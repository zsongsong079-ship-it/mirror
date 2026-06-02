import { useLanguageStore } from "@/store/languageStore";
import { translations } from "@/lib/translations";

export function LanguageSwitch() {
  const language = useLanguageStore((s) => s.language) || "en";
  const toggleLanguage = useLanguageStore((s) => s.toggleLanguage);
  const t = translations[language] || translations.en;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="rounded-full px-3 py-2 text-[12px] tracking-[0.16em] text-[#6D6574] transition-colors hover:bg-[rgba(47,45,42,0.06)] hover:text-[#2F2D2A]"
      aria-label="Toggle language"
    >
      {t.nav.languageLabel}
    </button>
  );
}
