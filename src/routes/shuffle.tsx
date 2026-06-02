import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

import { CardBack } from "@/components/tarot/CardFace";
import { ALL_CARDS, shuffleDeck } from "@/data/cards";

export const Route = createFileRoute("/shuffle")({
  head: () => ({ meta: [{ title: "Shuffle — Mirror" }] }),
  component: Shuffle,
});

const SHUFFLE_KEY = "mirror.shuffledDeck";

function Shuffle() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "shuffling">("idle");

  const startShuffle = () => {
    setPhase("shuffling");
    // Actually shuffle the deck and persist a 7-card spread for /draw
    const shuffled = shuffleDeck(ALL_CARDS);
    const spread = shuffled.slice(0, 7).map((card) => ({
      id: card.id,
      reversed: Math.random() < 0.3,
    }));
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SHUFFLE_KEY, JSON.stringify(spread));
    }
    setTimeout(() => {
      navigate({ to: "/draw" });
    }, 2600);
  };

  // Visual deck: 12 cards we animate
  const visual = Array.from({ length: 12 });

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[400px] text-center"
        >
          <h1 className="font-serif font-light text-[40px] text-ink mb-8">洗牌</h1>
          <p className="font-sans font-light text-[14px] text-ink-3 leading-loose mb-12">
            你可以停顿几秒。
            <br />
            等准备好了，再继续。
          </p>
          <button
            type="button"
            onClick={startShuffle}
            className="bg-ink text-paper rounded-lg px-7 py-3.5 text-[14px] font-medium tracking-ui hover:bg-ink-2 transition-colors"
          >
            开始洗牌
          </button>
        </motion.div>
      )}

      {phase === "shuffling" && (
        <div className="relative w-[240px] h-[260px] flex items-center justify-center">
          {visual.map((_, i) => {
            // each card: scatter then regroup
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
                  duration: 2.2,
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
      )}
    </div>
  );
}
