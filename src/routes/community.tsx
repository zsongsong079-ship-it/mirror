import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";

import { ALL_CARDS as CARDS } from "@/data/cards";
import { getAllCommunityEntries, getEntriesForCard } from "@/lib/community";
import { getCardNameZh } from "@/lib/cardNames";

interface CommunitySearch {
  card?: string;
}

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "其他人的理解 — Mirror" }] }),
  validateSearch: (search: Record<string, unknown>): CommunitySearch => ({
    card: typeof search.card === "string" ? search.card : undefined,
  }),
  component: Community,
});

function formatDate(ts: number) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day} ${hh}:${mm}`;
  } catch {
    return "";
  }
}

function Community() {
  const { card: cardId } = Route.useSearch();

  const entries = useMemo(() => {
    if (cardId) return getEntriesForCard(cardId);
    return getAllCommunityEntries()
      .filter((e) => e.visibility !== "private")
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [cardId]);

  const cardMeta = cardId ? CARDS.find((c) => c.id === cardId) : undefined;

  return (
    <div className="min-h-screen bg-paper px-6 md:px-10 py-12 md:py-20">
      <div className="max-w-[640px] mx-auto">
        <header className="flex items-center justify-between mb-14">
          <Link to="/" className="font-serif text-lg tracking-label uppercase text-ink">
            Mirror
          </Link>
          <Link
            to="/"
            className="text-[12px] tracking-label uppercase text-ink-3 hover:text-ink transition-colors"
          >
            返回
          </Link>
        </header>

        <h1 className="font-serif font-light text-[28px] text-ink mb-3">
          {cardMeta ? `这张牌的其他故事` : `其他人的理解`}
        </h1>
        <p className="font-sans font-light text-[14px] text-ink-3 leading-relaxed mb-2">
          同一张牌，
          <br />
          不同的人会看见不同的东西。
        </p>
        {cardMeta && (
          <p className="font-sans font-light text-[12px] text-ink-3 tracking-ui mt-3 mb-2">
            正在查看 · {cardMeta.name} · {getCardNameZh(cardMeta.name)}
          </p>
        )}

        <div className="mt-14">
          {entries.length === 0 ? (
            <p className="font-serif italic text-[15px] text-ink-3 text-center py-16">
              这张牌还没有别人的故事。
            </p>
          ) : (
            <ul className="space-y-8">
              {entries.map((e) => {
                const meta = CARDS.find((c) => c.id === e.card_id);
                const authorLabel =
                  e.visibility === "named" && e.author_name ? e.author_name : "匿名";
                return (
                  <li
                    key={e.id}
                    className="bg-paper-2 rounded-2xl p-6 md:p-8"
                    style={{ border: "0.5px solid var(--color-paper-3)" }}
                  >
                    <div className="flex gap-5 items-start">
                      {meta?.imageUrl && (
                        <img
                          src={meta.imageUrl}
                          alt={e.card_name}
                          loading="lazy"
                          className="w-[64px] h-[112px] object-cover rounded-md flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] tracking-label uppercase text-ink-3 mb-2">
                          {e.card_name}
                        </p>
                        <p className="font-sans font-light text-[13px] text-ink-2 mb-1">
                          {authorLabel}
                        </p>
                        {e.question_summary && (
                          <p className="font-serif italic text-[14px] text-ink-3 leading-relaxed mb-4">
                            "{e.question_summary}"
                          </p>
                        )}
                        <p className="font-serif text-[16px] text-ink leading-[1.85] mb-4">
                          {e.story}
                        </p>
                        {e.timestamp > 0 && (
                          <p className="text-[11px] tracking-label uppercase text-ink-3">
                            {formatDate(e.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
