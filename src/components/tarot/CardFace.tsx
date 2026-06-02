import { motion } from "framer-motion";

import type { TarotCard } from "@/data/cards";

interface CardFaceProps {
  card: TarotCard;
  reversed?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-20 h-36 text-[10px]",
  md: "w-[140px] h-[245px] text-xs",
  lg: "w-[200px] h-[350px] text-sm",
};

export function CardFace({ card, reversed = false, size = "md" }: CardFaceProps) {
  return (
    <motion.div
      className={`${sizes[size]} relative rounded-xl overflow-hidden flex items-center justify-center`}
      style={{
        background: "#f5f3ee",
        border: "0.5px solid var(--color-paper-3)",
        transform: reversed ? "rotate(180deg)" : undefined,
      }}
    >
      <img
        src={card.imageUrl}
        alt={card.name}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}

export function CardBack({ size = "sm" }: { size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-16 h-28" : "w-20 h-36";
  return (
    <div
      className={`${w} rounded-xl relative overflow-hidden`}
      style={{
        background: "#2a2520",
      }}
    >
      <div
        className="absolute inset-2 rounded-md"
        style={{ border: "0.5px solid rgba(196,169,106,0.25)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-6 h-6 rounded-full"
          style={{ border: "1px solid rgba(196,169,106,0.35)" }}
        />
      </div>
    </div>
  );
}