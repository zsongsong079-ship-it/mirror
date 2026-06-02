import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CardFace } from "@/components/tarot/CardFace";
import { readObserveAnswers, readOriginalQuestion, readSelectedCard, saveObserveAnswers } from "@/lib/readingPersistence";
import { patchDraft } from "@/lib/draftStorage";
import { useReadingStore } from "@/store/readingStore";

export const Route = createFileRoute("/observe")({
  head: () => ({ meta: [{ title: "Notice — Mirror" }] }),
  component: Observe,
});

const QUESTIONS = [
  { q: "第一眼看到什么？", key: "q1" as const },
  { q: "它给你的感觉是什么？", key: "q2" as const },
  { q: "如果这是一段故事，正在发生什么？", key: "q3" as const },
  { q: "它像是在提醒你什么？", key: "q4" as const },
];

function Observe() {
  const navigate = useNavigate();
  const { card: storeCard, isReversed: storeIsReversed, setCard, setObs } = useReadingStore();
  const [card, setLocalCard] = useState(storeCard);
  const [isReversed, setLocalReversed] = useState(storeIsReversed);
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [answers, setAnswers] = useState<{ q1: string; q2: string; q3: string; q4: string }>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  useEffect(() => {
    const stored = readSelectedCard();
    console.log("observe loaded selectedCard", stored);
    if (stored) {
      setLocalCard(stored.card);
      setLocalReversed(stored.reversed);
      setCard(stored.card, stored.reversed);
    } else if (storeCard) {
      setLocalCard(storeCard);
      setLocalReversed(storeIsReversed);
    }
    setAnswers(readObserveAnswers());
    setOriginalQuestion(readOriginalQuestion());
    setCheckedStorage(true);
  }, [setCard, storeCard, storeIsReversed]);

  if (!checkedStorage) return <div className="min-h-screen" style={{ background: "#F5F3EE" }} />;

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#F5F3EE" }}>
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

  const updateAnswer = (key: keyof typeof answers, val: string) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    setObs(key, val);
    saveObserveAnswers(updated);
    patchDraft({ obs: updated });
  };

  const handleContinue = () => {
    const finalAnswers = { ...answers };
    (Object.keys(finalAnswers) as (keyof typeof answers)[]).forEach((k) => {
      if (!finalAnswers[k].trim()) finalAnswers[k] = "(left blank)";
      setObs(k, finalAnswers[k]);
    });
    saveObserveAnswers(finalAnswers);
    navigate({ to: "/reflection" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F3EE" }}>
      <main className="mx-auto w-full max-w-[560px] px-6 py-12 md:px-10 md:py-16">
        <div className="flex flex-col items-center text-center mb-14 md:mb-20">
          <div className="max-w-[280px] w-full mx-auto">
            <CardFace card={card} reversed={isReversed} size="lg" />
          </div>
          <p className="mt-3 text-[12px] tracking-[0.1em] uppercase text-[#7A7268] font-sans">{card.name}</p>
          <p className="mt-1 text-[11px] text-[#7A7268] font-sans">{isReversed ? "逆位" : "正位"}</p>
          {originalQuestion && (
            <p className="mt-6 font-serif italic text-[16px] md:text-[18px] text-ink-2 leading-relaxed max-w-[480px]">
              "{originalQuestion}"
            </p>
          )}
        </div>

        <div>
          {QUESTIONS.map((q) => (
            <div key={q.key} className="mt-14 first:mt-0">
              <h2
                className="font-serif italic font-light text-[24px] text-[#1A1814] leading-[1.4]"
                style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300 }}
              >
                {q.q}
              </h2>
              <textarea
                value={answers[q.key]}
                onChange={(e) => updateAnswer(q.key, e.target.value)}
                rows={4}
                className="w-full bg-transparent font-sans text-[16px] text-[#1A1814] resize-y focus:outline-none px-0 py-2 mt-4"
                style={{
                  border: "none",
                  borderBottom: "0.5px solid #E0DBD0",
                  boxShadow: "none",
                  borderRadius: 0,
                  backgroundColor: "transparent",
                  minHeight: "100px",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 300,
                }}
                placeholder="在这里写下你的感受"
              />
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            className="bg-transparent text-[#7A7268] border-0 p-0 text-[14px] font-normal hover:opacity-80 transition-opacity"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            继续 →
          </button>
        </div>
      </main>
    </div>
  );
}
