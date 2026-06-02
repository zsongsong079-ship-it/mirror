import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Language } from "@/lib/translations";

const DEFAULT_LANGUAGE: Language = "en";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (language) => set({ language: language === "zh" ? "zh" : "en" }),
      toggleLanguage: () => set({ language: get().language === "zh" ? "en" : "zh" }),
    }),
    {
      name: "mirror-language",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : (undefined as never))),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.language = state.language === "zh" ? "zh" : DEFAULT_LANGUAGE;
        }
      },
    },
  ),
);
