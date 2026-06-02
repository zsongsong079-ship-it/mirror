import { createFileRoute, Link } from "@tanstack/react-router";

import { LanguageSwitch } from "@/components/LanguageSwitch";
import { translations } from "@/lib/translations";
import { useLanguageStore } from "@/store/languageStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mirror" },
      {
        name: "description",
        content:
          "Mirror is a reflective tarot experience that helps you notice the space between what you see and what the card traditionally means.",
      },
      { property: "og:title", content: "Mirror" },
      {
        property: "og:description",
        content:
          "Mirror is a reflective tarot experience that helps you notice the space between what you see and what the card traditionally means.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const language = useLanguageStore((s) => s.language) || "en";
  const t = translations[language] || translations.en;
  return (
    <div className="min-h-screen bg-paper text-ink transition-opacity duration-200 ease-in-out">
      <main className="mx-auto w-full max-w-[1180px] px-5 py-6 md:px-8 md:py-8">
        <header className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#6D6574]">
          <span className="font-serif text-[14px] tracking-[0.16em] text-[#1F1724]">MIRROR</span>
          <nav className="flex items-center gap-2">
            <LanguageSwitch />
            <Link to="/history" className="transition-colors hover:text-[#1F1724]">
              {t.nav.history}
            </Link>
          </nav>
        </header>

        <section className="py-16 md:py-24">
          <div className="max-w-[36rem]">
            <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-[#6D6574]">{t.landing.eyebrow}</p>
            <h1 className="max-w-[12ch] font-serif text-[52px] leading-[1.14] font-light tracking-[0.01em] text-ink md:text-[82px] md:leading-[1.12] md:tracking-[0.008em] whitespace-pre-line">
              {t.landing.title}
            </h1>
            <p className="mt-7 max-w-[28rem] font-serif text-[20px] italic leading-[1.9] tracking-[0.01em] text-ink-3 md:text-[24px] whitespace-pre-line">
              {t.landing.body}
            </p>
            <div className="mt-10">
              <Link
                to="/welcome"
                className="inline-flex items-center justify-center rounded-full bg-[#1A1814] px-8 py-4 text-[14px] font-medium tracking-ui text-[#F5F3EE] transition-colors hover:bg-[#3A3146]"
              >
                {t.landing.cta}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
