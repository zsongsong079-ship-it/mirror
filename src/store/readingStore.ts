import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { TarotCard } from "@/data/cards";

interface ReadingState {
  rawQuestion: string;
  refinedQuestion: string;
  card: TarotCard | null;
  isReversed: boolean;
  obs: { q1: string; q2: string; q3: string; q4: string };
  setRawQuestion: (q: string) => void;
  setRefinedQuestion: (q: string) => void;
  setCard: (card: TarotCard, reversed: boolean) => void;
  setObs: (key: keyof ReadingState["obs"], value: string) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      rawQuestion: "",
      refinedQuestion: "",
      card: null,
      isReversed: false,
      obs: { q1: "", q2: "", q3: "", q4: "" },
      setRawQuestion: (q) => set({ rawQuestion: q }),
      setRefinedQuestion: (q) => set({ refinedQuestion: q }),
      setCard: (card, reversed) => set({ card, isReversed: reversed }),
      setObs: (key, value) => set((s) => ({ obs: { ...s.obs, [key]: value } })),
      reset: () =>
        set({
          rawQuestion: "",
          refinedQuestion: "",
          card: null,
          isReversed: false,
          obs: { q1: "", q2: "", q3: "", q4: "" },
        }),
    }),
    {
      name: "mirror.reading.v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : (undefined as never),
      ),
    },
  ),
);