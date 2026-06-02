import type { TarotCard } from "@/data/cards";

import { getCardById } from "@/data/cards";

export type ObserveAnswers = { q1: string; q2: string; q3: string; q4: string };

const EMPTY_OBS: ObserveAnswers = { q1: "", q2: "", q3: "", q4: "" };

function safeStorage() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

export function readOriginalQuestion() {
  const storage = safeStorage();
  if (!storage) return "";
  return storage.getItem("originalQuestion") || storage.getItem("mirror.originalQuestion") || "";
}

export function saveSelectedQuestion(question: string, originalQuestion?: string) {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem("selectedQuestion", question);
  storage.setItem("mirror.selectedQuestion", question);
  if (originalQuestion) {
    storage.setItem("originalQuestion", originalQuestion);
    storage.setItem("mirror.originalQuestion", originalQuestion);
    storage.setItem("mirror.rawQuestion", originalQuestion);
  }
}

export function readSelectedQuestion() {
  const storage = safeStorage();
  if (!storage) return "";
  return storage.getItem("selectedQuestion") || storage.getItem("mirror.selectedQuestion") || "";
}

export function saveSelectedCard(card: TarotCard, reversed: boolean) {
  const storage = safeStorage();
  if (!storage) return;
  const payload = JSON.stringify(card);
  const orientation = reversed ? "reversed" : "upright";
  storage.setItem("selectedCard", payload);
  storage.setItem("mirror.selectedCard", payload);
  storage.setItem("cardOrientation", orientation);
  storage.setItem("mirror.cardOrientation", orientation);
}

export function readSelectedCard(): { card: TarotCard; reversed: boolean } | null {
  const storage = safeStorage();
  if (!storage) return null;
  const raw = storage.getItem("selectedCard") || storage.getItem("mirror.selectedCard");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as TarotCard | { id?: string };
    const card = parsed?.id ? getCardById(parsed.id) || (parsed as TarotCard) : null;
    if (!card?.id) return null;
    const orientation =
      storage.getItem("cardOrientation") || storage.getItem("mirror.cardOrientation");
    return { card, reversed: orientation === "reversed" };
  } catch (error) {
    console.error("observe loaded selectedCard parse error", error);
    return null;
  }
}

export function saveObserveAnswers(answers: ObserveAnswers) {
  const storage = safeStorage();
  if (!storage) return;
  const payload = JSON.stringify(answers);
  storage.setItem("observeAnswers", payload);
  storage.setItem("mirror.observeAnswers", payload);
}

export function readObserveAnswers(): ObserveAnswers {
  const storage = safeStorage();
  if (!storage) return EMPTY_OBS;
  const raw = storage.getItem("observeAnswers") || storage.getItem("mirror.observeAnswers");
  if (!raw) return EMPTY_OBS;
  try {
    return { ...EMPTY_OBS, ...(JSON.parse(raw) as Partial<ObserveAnswers>) };
  } catch (error) {
    console.error("observeAnswers parse error", error);
    return EMPTY_OBS;
  }
}
