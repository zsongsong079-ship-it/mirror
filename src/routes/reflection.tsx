import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { CardFace } from "@/components/tarot/CardFace";
import { generateReflection } from "@/lib/ai.functions";
import {
  saveCommunityEntry,
  type CommunityEntry,
  type Visibility,
} from "@/lib/community";
import { saveReading, updateReading } from "@/lib/narrative";
import { patchDraft } from "@/lib/draftStorage";
import {
  readObserveAnswers,
  readOriginalQuestion,
  readSelectedCard,
  readSelectedQuestion,
} from "@/lib/readingPersistence";
import { useReadingStore } from "@/store/readingStore";

export const Route = createFileRoute("/reflection")({
  head: () => ({ meta: [{ title: "What you noticed — Mirror" }] }),
  component: Reflection,
});

interface AIResult {
  observation_summary: string;
  classic_meaning: string;
  connection: string;
  psychology: string;
  actions: string[];
  one_liner: string;
}

function Reflection() {
  const navigate = useNavigate();
  const {
    card: storeCard,
    isReversed: storeIsReversed,
    refinedQuestion: storeRefinedQuestion,
    rawQuestion: storeRawQuestion,
    obs: storeObs,
    reset,
    setCard,
    setRefinedQuestion,
    setObs,
  } = useReadingStore();
  const generateFn = useServerFn(generateReflection);

  const [card, setLocalCard] = useState(storeCard);
  const [isReversed, setLocalReversed] = useState(storeIsReversed);
  const [refinedQuestion, setLocalRefinedQuestion] = useState(storeRefinedQuestion);
  const [originalQuestion, setLocalOriginalQuestion] = useState(storeRawQuestion);
  const [obs, setLocalObs] = useState(storeObs);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [personalName, setPersonalName] = useState("");
  const [pushback, setPushback] = useState("");
  const [showPushback, setShowPushback] = useState(false);
  const [pushbackSaved, setPushbackSaved] = useState(false);
  const readingIdRef = useRef<string | null>(null);
  const hasRunRef = useRef(false);

  // Share-to-community modal (shown when the user is about to leave the page).
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingExit, setPendingExit] = useState<null | "stay" | "again">(null);
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const storedCard = readSelectedCard();
    const storedQuestion = readSelectedQuestion();
    const storedOriginal = readOriginalQuestion();
    const storedObs = readObserveAnswers();

    if (storedCard) {
      setLocalCard(storedCard.card);
      setLocalReversed(storedCard.reversed);
      setCard(storedCard.card, storedCard.reversed);
    } else if (storeCard) {
      setLocalCard(storeCard);
      setLocalReversed(storeIsReversed);
    }

    if (storedQuestion) {
      setLocalRefinedQuestion(storedQuestion);
      setRefinedQuestion(storedQuestion);
    } else if (storeRefinedQuestion) {
      setLocalRefinedQuestion(storeRefinedQuestion);
    }

    setLocalOriginalQuestion(storedOriginal || storeRawQuestion);

    setLocalObs(storedObs);
    setObs("q1", storedObs.q1);
    setObs("q2", storedObs.q2);
    setObs("q3", storedObs.q3);
    setObs("q4", storedObs.q4);
    setCheckedStorage(true);
  }, [
    setCard,
    setObs,
    setRefinedQuestion,
    storeCard,
    storeIsReversed,
    storeRawQuestion,
    storeRefinedQuestion,
  ]);

  useEffect(() => {
    // Run the AI + save exactly once per /reflection mount, after storage
    // hydration is finished and we have a card. Reading the rest of the
    // reading from local state at invocation time means re-renders caused by
    // setObs / store updates do not re-fire the AI call or duplicate the
    // saved history entry.
    if (!checkedStorage) return;
    if (!card) return;
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    readingIdRef.current = id;
    let cancelled = false;

    (async () => {
      let r: AIResult | null = null;
      try {
        const meaning = isReversed
          ? card.classic_meaning_reversed
          : card.classic_meaning_upright;
        r = await generateFn({
          data: {
            card_name: card.name,
            card_meaning: meaning,
            card_orientation: isReversed ? "逆位" : "正位",
            question: refinedQuestion,
            original_question: originalQuestion,
            obs_q1: obs.q1,
            obs_q2: obs.q2,
            obs_q3: obs.q3,
            obs_q4: obs.q4,
          },
        });
        if (!cancelled && r) setResult(r);
      } catch (err) {
        console.error("generateReflection failed", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
          saveReading({
            id,
            date: Date.now(),
            card_name: card.name,
            card_reversed: isReversed,
            card_image_url: card.imageUrl,
            original_question: originalQuestion,
            refined_question: refinedQuestion,
            obs,
            observation_summary: r?.observation_summary ?? "",
            classic_meaning: r?.classic_meaning ?? "",
            connection: r?.connection ?? "",
            psychology: r?.psychology ?? "",
            actions: r?.actions ?? [],
            one_liner: r?.one_liner ?? "",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // Intentionally only depends on hydration + card presence — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedStorage, card]);

  const begin = () => {
    reset();
    navigate({ to: "/" });
  };

  if (!checkedStorage) return <div className="min-h-screen bg-paper" />;

  if (!card) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
        <p className="font-sans text-[14px] text-ink-3 mb-6">请先抽一张牌</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/draw" })}
          className="bg-ink text-paper rounded-lg px-6 py-3 text-[14px] font-medium tracking-ui hover:bg-ink-2 transition-colors"
        >
          返回抽牌
        </button>
      </div>
    );
  }

  const writtenObs = [obs.q1, obs.q2, obs.q3, obs.q4].filter(
    (s) => s && s.trim() && s !== "(left blank)",
  );

  return (
    <div className="min-h-screen bg-paper px-6 md:px-10 py-12 md:py-20">
      <div className="max-w-[640px] mx-auto">
        {/* Card recap */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12"
        >
          <div className="flex-shrink-0">
            <CardFace card={card} reversed={isReversed} size="md" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="font-serif text-[20px] tracking-label uppercase text-ink mb-1">
              {card.name}
            </p>
            <p className="font-sans font-light text-[12px] text-ink-3 tracking-ui uppercase mb-4">
              {isReversed ? "逆位" : "正位"}
            </p>
            {originalQuestion && originalQuestion !== refinedQuestion && (
              <p className="font-sans font-light text-[12px] text-ink-3 mb-2">
                你的原始问题：{originalQuestion}
              </p>
            )}
            <p className="font-serif italic text-[15px] text-ink-2 leading-relaxed">
              "{refinedQuestion}"
            </p>
          </div>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center py-16">
            <div
              className="w-2 h-2 rounded-full mb-4 animate-mirror-pulse"
              style={{ background: "var(--color-gold)" }}
            />
            <p className="font-sans text-sm text-ink-3 tracking-ui">在听…</p>
          </div>
        )}

        {result && (
          <>
            {/* 1. 你的牌面观察 */}
            <Section label="你的牌面观察" accent="gold">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {result.observation_summary}
              </p>
              {writtenObs.length > 0 && (
                <div
                  className="mt-5 pl-5 space-y-2"
                  style={{ borderLeft: "1px solid var(--color-gold)" }}
                >
                  {writtenObs.map((s, i) => (
                    <p
                      key={i}
                      className="font-serif italic text-[15px] text-ink-2 leading-relaxed"
                    >
                      "{s}"
                    </p>
                  ))}
                </div>
              )}
            </Section>

            <Divider />

            {/* 2. 经典牌意 */}
            <Section label="经典牌意">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {result.classic_meaning}
              </p>
            </Section>

            <Divider />

            {/* 3. 结合你的问题 */}
            <Section label="结合你的问题" accent="gold">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85] whitespace-pre-wrap">
                {result.connection}
              </p>
            </Section>

            <Divider />

            {/* 4. 心理学视角 */}
            <Section label="心理学视角">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {result.psychology}
              </p>
            </Section>

            <Divider />

            {/* 5. 行动建议 */}
            <Section label="行动建议" accent="gold">
              <ol className="space-y-3">
                {result.actions.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-3 font-sans font-light text-[16px] text-ink leading-[1.7]"
                  >
                    <span className="font-serif text-[var(--color-gold-dim)] flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Divider />

            {/* 6. 一句话提醒 */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-14"
            >
              <p className="font-serif italic text-[20px] text-ink text-center leading-relaxed">
                "{result.one_liner}"
              </p>
            </motion.section>

            {/* Pushback + personal name */}
            <Divider />

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="mb-8">
                {!showPushback && !pushbackSaved && (
                  <button
                    type="button"
                    onClick={() => setShowPushback(true)}
                    className="text-[12px] text-ink-3 hover:text-ink-2 transition-colors font-sans underline-offset-4 hover:underline"
                  >
                    这说的不是我 ↓
                  </button>
                )}
                {showPushback && !pushbackSaved && (
                  <div className="space-y-3">
                    <textarea
                      value={pushback}
                      onChange={(e) => {
                        setPushback(e.target.value);
                        patchDraft({ pushback: e.target.value, finalReflection: e.target.value });
                      }}
                      rows={3}
                      placeholder="那它说错了什么？你自己的版本是什么？"
                      className="w-full bg-paper-2 rounded-lg px-4 py-3 font-serif italic text-[15px] text-ink placeholder:text-ink-3 placeholder:italic resize-none focus:outline-none focus:bg-paper-3/40 transition-colors"
                    />
                    <button
                      type="button"
                      disabled={!pushback.trim()}
                      onClick={() => {
                        if (readingIdRef.current) {
                          updateReading(readingIdRef.current, {
                            pushback: pushback.trim(),
                          });
                        }
                        setPushbackSaved(true);
                      }}
                      className="text-[12px] text-ink-2 hover:text-ink transition-colors font-sans disabled:opacity-40"
                    >
                      保存我的版本 →
                    </button>
                  </div>
                )}
                {pushbackSaved && (
                  <p className="text-[12px] text-ink-3 italic font-serif">
                    你的反驳已经被记下来了。它和这张牌一起留在你的档案里。
                  </p>
                )}
              </div>

              <p className="font-serif italic text-[16px] text-ink-2 text-center mb-2">
                给这张牌起一个你自己的名字。
              </p>
              <p className="font-sans font-light text-[12px] text-ink-3 text-center mb-5 italic">
                这是你的语言，不是塔罗的，也不是 AI 的。
              </p>
              <input
                type="text"
                value={personalName}
                onChange={(e) => {
                  setPersonalName(e.target.value);
                  patchDraft({ personalName: e.target.value });
                }}
                onBlur={() => {
                  if (personalName.trim() && readingIdRef.current) {
                    updateReading(readingIdRef.current, {
                      personal_name: personalName.trim(),
                    });
                  }
                }}
                placeholder="你会怎么叫它？"
                className="w-full bg-paper-2 rounded-lg px-5 py-4 font-serif italic text-[16px] text-ink placeholder:text-ink-3 placeholder:italic focus:outline-none focus:bg-paper-3/40 transition-colors"
              />

              <div className="mt-10 flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPendingExit("stay");
                    setShowSaveModal(true);
                  }}
                  className="flex-1 text-center rounded-lg border border-paper-3 bg-paper px-6 py-3.5 text-[14px] font-medium text-ink-2 tracking-ui hover:bg-paper-2 transition-colors"
                >
                  让它停留一会儿
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingExit("again");
                    setShowSaveModal(true);
                  }}
                  className="flex-1 rounded-lg bg-ink px-6 py-3.5 text-[14px] font-medium text-paper tracking-ui hover:bg-ink-2 transition-colors"
                >
                  开始另一次记录 →
                </button>
              </div>
            </motion.section>

            <Divider />

            {/* 看看别人的理解 — 极简入口 */}
            <Link
              to="/community"
              search={{ card: card.id }}
              className="block rounded-2xl px-6 py-7 mb-14 -mx-2 hover:bg-paper-2 transition-colors"
            >
              <p className="font-serif text-[18px] text-ink mb-2">
                看看别人的理解 →
              </p>
              <p className="font-sans font-light text-[13px] text-ink-3 leading-relaxed">
                同一张牌，
                <br />
                不同的人会看见不同的东西。
              </p>
            </Link>
          </>
        )}
      </div>

      {showSaveModal && card && (
        <SaveModal
          visibility={visibility}
          setVisibility={(v) => {
            setVisibility(v);
            patchDraft({ visibility: v });
          }}
          authorName={authorName}
          setAuthorName={setAuthorName}
          onCancel={() => {
            setShowSaveModal(false);
            setPendingExit(null);
          }}
          onConfirm={() => {
            const story = (obs.q3 || "").trim();
            if (
              readingIdRef.current &&
              visibility !== "private" &&
              story &&
              story !== "(left blank)"
            ) {
              const entry: CommunityEntry = {
                id: readingIdRef.current,
                card_id: card.id,
                card_name: card.name,
                question_summary: (refinedQuestion || originalQuestion || "")
                  .trim()
                  .slice(0, 120),
                story: story.slice(0, 400),
                timestamp: Date.now(),
                visibility,
                author_name:
                  visibility === "named" && authorName.trim()
                    ? authorName.trim()
                    : undefined,
              };
              saveCommunityEntry(entry);
            }
            setShowSaveModal(false);
            if (pendingExit === "again") {
              reset();
              navigate({ to: "/" });
            } else {
              reset();
              navigate({ to: "/" });
            }
          }}
        />
      )}
    </div>
  );
}

function SaveModal({
  visibility,
  setVisibility,
  authorName,
  setAuthorName,
  onCancel,
  onConfirm,
}: {
  visibility: Visibility;
  setVisibility: (v: Visibility) => void;
  authorName: string;
  setAuthorName: (s: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const disabled = visibility === "named" && !authorName.trim();
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink/30 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-[480px] bg-paper rounded-2xl p-8"
        style={{ border: "0.5px solid var(--color-paper-3)" }}
      >
        <p className="font-serif text-[18px] text-ink mb-2 leading-relaxed">
          是否愿意将这段观察
          <br />
          加入公共档案？
        </p>
        <p className="font-sans font-light text-[12px] text-ink-3 mb-6">
          默认仅自己可见。
        </p>
        <div className="space-y-3 mb-6">
          {(
            [
              ["private", "仅自己可见"],
              ["anon", "公开匿名"],
              ["named", "公开署名"],
            ] as [Visibility, string][]
          ).map(([v, label]) => (
            <label
              key={v}
              className="flex items-center gap-3 cursor-pointer font-sans text-[14px] text-ink-2"
            >
              <input
                type="radio"
                name="visibility"
                checked={visibility === v}
                onChange={() => setVisibility(v)}
                className="accent-ink"
              />
              {label}
            </label>
          ))}
        </div>
        {visibility === "named" && (
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="你想用什么名字署名？"
            className="w-full bg-paper-2 rounded-lg px-4 py-2.5 mb-6 font-sans text-[14px] text-ink placeholder:text-ink-3 focus:outline-none focus:bg-paper-3/40 transition-colors"
          />
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-paper-3 px-5 py-3 text-[13px] text-ink-2 hover:bg-paper-2 transition-colors"
          >
            返回
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className="flex-1 rounded-lg bg-ink text-paper px-5 py-3 text-[13px] tracking-ui hover:bg-ink-2 transition-colors disabled:opacity-40"
          >
            确认保存
          </button>
        </div>
      </div>
    </div>
  );
}

// (end of Reflection component)

function Section({
  label,
  children,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  accent?: "gold";
}) {
  const color = accent === "gold" ? "var(--color-gold-dim)" : "var(--color-ink-3, #888)";
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-10"
    >
      <p
        className="text-[11px] tracking-label uppercase mb-4"
        style={{ color }}
      >
        {label}
      </p>
      {children}
    </motion.section>
  );
}

function Divider() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-10 h-px bg-paper-3" />
    </div>
  );
}
