import { createFileRoute } from "@tanstack/react-router";

import { ALL_CARDS, MAJOR_ARCANA, MINOR_ARCANA } from "@/data/cards";

export const Route = createFileRoute("/cards-debug")({
  head: () => ({ meta: [{ title: "Cards Debug — Mirror" }] }),
  component: CardsDebug,
});

function CardsDebug() {
  const wands = MINOR_ARCANA.filter((c) => c.suit === "wands");
  const cups = MINOR_ARCANA.filter((c) => c.suit === "cups");
  const swords = MINOR_ARCANA.filter((c) => c.suit === "swords");
  const pentacles = MINOR_ARCANA.filter((c) => c.suit === "pentacles");

  const counts = [
    { label: "Total", actual: ALL_CARDS.length, expected: 78 },
    { label: "Major Arcana", actual: MAJOR_ARCANA.length, expected: 22 },
    { label: "Wands", actual: wands.length, expected: 14 },
    { label: "Cups", actual: cups.length, expected: 14 },
    { label: "Swords", actual: swords.length, expected: 14 },
    { label: "Pentacles", actual: pentacles.length, expected: 14 },
  ];

  return (
    <div className="min-h-screen bg-paper px-6 py-12">
      <main className="max-w-[1100px] mx-auto">
        <h1 className="font-serif text-2xl text-ink mb-2">Cards Debug</h1>
        <p className="text-[12px] text-ink-3 mb-8">Developer-only. Validates the tarot deck.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {counts.map((c) => {
            const ok = c.actual === c.expected;
            return (
              <div
                key={c.label}
                className="rounded-lg p-4 bg-paper-2"
                style={{
                  border: `1px solid ${ok ? "var(--color-paper-3)" : "#c0392b"}`,
                }}
              >
                <p className="text-[11px] tracking-label uppercase text-ink-3">{c.label}</p>
                <p className="font-serif text-xl text-ink mt-1">
                  {c.actual} <span className="text-ink-3 text-sm">/ {c.expected}</span>
                </p>
                {!ok && (
                  <p className="text-[11px] text-red-700 mt-1">
                    Mismatch
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <Section title="Major Arcana" cards={MAJOR_ARCANA} />
        <Section title="Wands" cards={wands} />
        <Section title="Cups" cards={cups} />
        <Section title="Swords" cards={swords} />
        <Section title="Pentacles" cards={pentacles} />
      </main>
    </div>
  );
}

function Section({
  title,
  cards,
}: {
  title: string;
  cards: { id: string; name: string; imageUrl: string }[];
}) {
  return (
    <section className="mb-12">
      <h2 className="font-serif text-lg text-ink mb-4">
        {title} <span className="text-ink-3 text-sm">({cards.length})</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cards.map((c) => (
          <CardCheck key={c.id} card={c} />
        ))}
      </div>
    </section>
  );
}

function CardCheck({ card }: { card: { id: string; name: string; imageUrl: string } }) {
  const missing = !card.imageUrl;
  return (
    <div className="rounded-md overflow-hidden bg-paper-2 p-2">
      <div className="aspect-[2/3.5] bg-paper-3 rounded overflow-hidden flex items-center justify-center">
        {missing ? (
          <span className="text-red-700 text-xs">NO URL</span>
        ) : (
          <img
            src={card.imageUrl}
            alt={card.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const sib = (e.currentTarget as HTMLImageElement)
                .nextElementSibling as HTMLElement | null;
              if (sib) sib.style.display = "flex";
            }}
          />
        )}
        <div
          style={{ display: "none" }}
          className="w-full h-full bg-red-100 text-red-700 text-[10px] items-center justify-center text-center p-1"
        >
          Image failed to load
        </div>
      </div>
      <p className="font-serif text-[13px] text-ink mt-2 leading-tight">{card.name}</p>
      <p className="text-[10px] text-ink-3 break-all mt-1">{card.imageUrl}</p>
    </div>
  );
}
