import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { CardBack, CardFace } from "@/components/tarot/CardFace";
import { ALL_CARDS, getCardById, shuffleDeck, type TarotCard } from "@/data/cards";
import { readSelectedQuestion, saveSelectedCard } from "@/lib/readingPersistence";
import { patchDraft } from "@/lib/draftStorage";
import { useReadingStore } from "@/store/readingStore";

export const Route = createFileRoute("/draw")({
  head: () => ({ meta: [{ title: "Choose — Mirror" }] }),
  component: Draw,
});

const SHUFFLE_KEY = "mirror.shuffledDeck";

type Pick = { card: TarotCard; reversed: boolean };

function loadSpread(): Pick[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SHUFFLE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { id: string; reversed: boolean }[];
    const picks: Pick[] = [];
    for (const p of parsed) {
      const c = getCardById(p.id);
      if (c) picks.push({ card: c, reversed: !!p.reversed });
    }
    return picks;
  } catch {
    return [];
  }
}

function Draw() {
  const navigate = useNavigate();
  const setCard = useReadingStore((s) => s.setCard);
  const rawQuestion = useReadingStore((s) => s.rawQuestion);
  const refinedFromStore = useReadingStore((s) => s.refinedQuestion);

  const [spread, setSpread] = useState<Pick[]>([]);
  const [refined, setRefined] = useState<string>(refinedFromStore || "");
  const [missing, setMissing] = useState(false);
  const [flying, setFlying] = useState<number | null>(null);
  const [chosen, setChosen] = useState<Pick | null>(null);
  const [phase, setPhase] = useState<
    "choose" | "confirm" | "reshuffle" | "flip" | "revealed"
  >("choose");
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const flyingRoll = useMemo(() => Math.random() < 0.1, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log("DRAW PAGE DATA", {
      userQuestion: rawQuestion,
      session: sessionStorage.getItem("mirror.reading.v1.rawQuestion"),
      reading: refinedFromStore,
      selectedSuggestion: readSelectedQuestion(),
    });

    const stored = readSelectedQuestion();
    if (stored) setRefined(stored);
    else if (!refinedFromStore && !rawQuestion) {
      setMissing(true);
      return;
    }
    let s = loadSpread();
    if (s.length < 7) {
      const fresh: Pick[] = shuffleDeck(ALL_CARDS)
        .slice(0, 7)
        .map((card) => ({ card, reversed: Math.random() < 0.3 }));
      s = fresh;
      sessionStorage.setItem(
        SHUFFLE_KEY,
        JSON.stringify(fresh.map((p) => ({ id: p.card.id, reversed: p.reversed }))),
      );
    }
    setSpread(s.slice(0, 7));
    if (flyingRoll && s.length >= 7) {
      setFlying(Math.floor(Math.random() * 7));
    }
  }, [flyingRoll, refinedFromStore]);

  if (missing) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
        <p className="font-sans text-[14px] text-ink-3 mb-6">请先从首页开始。</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="bg-ink text-paper rounded-lg px-6 py-3 text-[14px] font-medium tracking-ui hover:bg-ink-2 transition-colors"
        >
          回到首页
        </button>
      </div>
    );
  }

  const pick = (i: number) => {
    const p = spread[i];
    if (!p) return;
    setPendingIndex(i);
    setChosen(p);
    setPhase("confirm");
  };

  const cancelPick = () => {
    setChosen(null);
    setPendingIndex(null);
    setPhase("choose");
  };

  const confirmPick = () => {
    if (!chosen) return;
    setCard(chosen.card, chosen.reversed);
    saveSelectedCard(chosen.card, chosen.reversed);
    patchDraft({
      card: {
        id: chosen.card.id,
        name: chosen.card.name,
        imageUrl: chosen.card.imageUrl,
        reversed: chosen.reversed,
      },
    });
    setPhase("flip");
    setTimeout(() => setPhase("revealed"), 900);
    setTimeout(() => {
      if (typeof window !== "undefined") sessionStorage.removeItem(SHUFFLE_KEY);
      navigate({ to: "/observe" });
    }, 2200);
  };

  const reshuffle = () => {
    setPhase("reshuffle");
    setFlying(null);
    setChosen(null);
    setPendingIndex(null);
    setTimeout(() => {
      const fresh: Pick[] = shuffleDeck(ALL_CARDS)
        .slice(0, 7)
        .map((card) => ({ card, reversed: Math.random() < 0.3 }));
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          SHUFFLE_KEY,
          JSON.stringify(fresh.map((p) => ({ id: p.card.id, reversed: p.reversed }))),
        );
      }
      setSpread(fresh);
      if (Math.random() < 0.1) setFlying(Math.floor(Math.random() * 7));
      setPhase("choose");
    }, 1900);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <AnimatePresence mode="wait">
        {phase === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center px-4 py-12"
          >
            {refined && (
              <p className="font-serif italic text-[15px] text-ink-3 max-w-[420px] text-center mb-8 leading-relaxed">
                "{refined}"
              </p>
            )}
            <p className="text-[12px] tracking-label uppercase text-ink-3 mb-12">
              选那张吸引你的牌
            </p>

            <div className="relative w-full max-w-[520px] h-[280px] flex items-end justify-center">
              {spread.map((_, i) => {
                const center = (spread.length - 1) / 2;
                const offset = i - center;
                const rot = offset * 8;
                const tx = offset * 46;
                const ty = Math.abs(offset) * 8;
                const isFlying = flying === i;
                return (
                  <motion.button
                    type="button"
                    key={i}
                    onClick={() => pick(i)}
                    initial={{ opacity: 0, y: 30, rotate: 0, x: 0 }}
                    animate={{
                      opacity: 1,
                      x: tx,
                      y: isFlying ? ty - 28 : ty,
                      rotate: rot,
                    }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                    whileHover={{ y: ty - 16, transition: { duration: 0.25 } }}
                    className="absolute cursor-pointer"
                    style={{ transformOrigin: "bottom center" }}
                  >
                    <CardBack size="md" />
                    {isFlying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          boxShadow:
                            "0 0 0 1px color-mix(in oklab, var(--color-gold) 50%, transparent), 0 8px 24px -8px color-mix(in oklab, var(--color-gold) 35%, transparent)",
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {flying !== null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="mt-10 font-serif italic text-[13px] text-ink-3"
              >
                这张牌似乎想被看见。你可以选它，也可以继续自己选择。
              </motion.p>
            )}

            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={reshuffle}
                className="text-[13px] font-sans text-ink-3 underline underline-offset-4 decoration-ink-3/40 hover:text-ink transition-colors"
              >
                重新洗牌
              </button>
              <p className="font-sans font-light text-[12px] text-ink-3">
                如果没有感觉，可以重新洗牌。
              </p>
            </div>
          </motion.div>
        )}

        {phase === "reshuffle" && (
          <motion.div
            key="reshuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            {refined && (
              <p className="font-serif italic text-[14px] text-ink-3 max-w-[420px] text-center mb-10 leading-relaxed">
                "{refined}"
              </p>
            )}
            <div className="relative w-[240px] h-[260px] flex items-center justify-center">
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (Math.random() - 0.5) * 80;
                const dx = (Math.random() - 0.5) * 180;
                const dy = (Math.random() - 0.5) * 80;
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ x: 0, y: -i * 0.6, rotate: 0 }}
                    animate={{
                      x: [0, dx, dx * 0.5, 0],
                      y: [-i * 0.6, dy, dy * 0.5, -i * 0.6],
                      rotate: [0, angle, angle * 0.4, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      times: [0, 0.35, 0.7, 1],
                      ease: "easeInOut",
                      delay: i * 0.03,
                    }}
                  >
                    <CardBack size="md" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === "confirm" && chosen && pendingIndex !== null && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            {refined && (
              <p className="font-serif italic text-[14px] text-ink-3 max-w-[420px] text-center mb-10 leading-relaxed">
                "{refined}"
              </p>
            )}
            <motion.div
              initial={{ scale: 1, y: 0 }}
              animate={{ scale: 1.15, y: -16 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{
                filter:
                  "drop-shadow(0 18px 32px color-mix(in oklab, var(--color-ink) 22%, transparent))",
              }}
            >
              <CardBack size="md" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-12 font-serif text-[16px] text-ink"
            >
              你确定是它吗？
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 flex items-center gap-3"
            >
              <button
                type="button"
                onClick={cancelPick}
                className="border border-ink-3/40 text-ink rounded-lg px-5 py-2.5 text-[13px] font-medium tracking-ui hover:bg-ink/5 transition-colors"
              >
                换一张
              </button>
              <button
                type="button"
                onClick={confirmPick}
                className="bg-ink text-paper rounded-lg px-6 py-2.5 text-[13px] font-medium tracking-ui hover:bg-ink-2 transition-colors"
              >
                翻开
              </button>
            </motion.div>
          </motion.div>
        )}

        {(phase === "flip" || phase === "revealed") && chosen && (
          <motion.div
            key="reveal"
            className="flex-1 flex flex-col items-center justify-center px-6"
            style={{ perspective: 1200 }}
          >
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: "preserve-3d", position: "relative" }}
              className="w-[140px] h-[245px]"
            >
              <div style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}>
                <CardBack size="md" />
              </div>
              <div
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  position: "absolute",
                  inset: 0,
                }}
              >
                <CardFace card={chosen.card} reversed={chosen.reversed} size="md" />
              </div>
            </motion.div>
            {phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="mt-8 text-center"
              >
                <p className="font-serif text-[16px] tracking-label uppercase text-ink">
                  {chosen.card.name}
                </p>
                {chosen.reversed && (
                  <p className="mt-2 font-sans font-light text-[12px] text-ink-3 tracking-ui uppercase">
                    逆位
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
