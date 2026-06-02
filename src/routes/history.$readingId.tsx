import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getReadings, type NarrativeReading } from "@/lib/narrative";
import { getCardNameZh } from "@/lib/cardNames";

export const Route = createFileRoute("/history/$readingId")({
  head: () => ({ meta: [{ title: "Reading — Mirror" }] }),
  component: ReadingDetail,
});

function formatDate(ts: number) {
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

function ReadingDetail() {
  const { readingId } = Route.useParams();
  const [reading, setReading] = useState<NarrativeReading | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const list = getReadings();
    const found = list.find((r) => r.id === readingId) || null;
    setReading(found);
    setReady(true);
  }, [readingId]);

  if (!ready) return <div className="min-h-screen bg-paper" />;

  if (!reading) {
    return (
      <div className="min-h-screen bg-paper px-6 md:px-10 py-10 md:py-16">
        <div className="max-w-[640px] mx-auto text-center py-20">
          <p className="font-serif italic text-[16px] text-ink-3 mb-6">
            找不到这条记录。
          </p>
          <Link
            to="/history"
            className="inline-block bg-ink text-paper rounded-lg px-6 py-3 text-[13px] font-medium tracking-ui hover:bg-ink-2 transition-colors"
          >
            返回记录
          </Link>
        </div>
      </div>
    );
  }

  const writtenObs = Object.values(reading.obs || {}).filter(
    (s) => s && s.trim() && s !== "(left blank)"
  );

  return (
    <div className="min-h-screen bg-paper px-6 md:px-10 py-10 md:py-16">
      <div className="max-w-[640px] mx-auto">
        {/* Back link */}
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-[12px] tracking-ui text-ink-3 hover:text-ink transition-colors mb-10"
        >
          ← 返回记录
        </Link>

        {/* Card header */}
        <div className="flex flex-col items-center text-center mb-10">
          {reading.card_image_url && (
            <img
              src={reading.card_image_url}
              alt={reading.card_name}
              loading="lazy"
              className="w-[140px] h-[245px] object-cover rounded-xl mb-5"
              style={{
                transform: reading.card_reversed ? "rotate(180deg)" : undefined,
              }}
            />
          )}
          <p className="font-serif text-[20px] tracking-label uppercase text-ink">
            {reading.card_name}
          </p>
          <p className="font-sans font-light text-[13px] text-ink-3 tracking-ui mt-1">
            {getCardNameZh(reading.card_name)} · {reading.card_reversed ? "逆位" : "正位"}
          </p>
          <p className="font-sans font-light text-[12px] text-ink-3 mt-3">
            {formatDate(reading.date)}
          </p>
        </div>

        {/* Question */}
        <div className="mb-12">
          <p className="text-[11px] tracking-label uppercase text-[var(--color-gold-dim)] mb-3">
            你的问题
          </p>
          {reading.original_question && reading.original_question !== reading.refined_question && (
            <p className="font-sans font-light text-[13px] text-ink-3 mb-2">
              原始：{reading.original_question}
            </p>
          )}
          <blockquote
            className="font-serif italic text-[18px] text-ink pl-5 leading-relaxed"
            style={{ borderLeft: "1px solid var(--color-gold)" }}
          >
            "{reading.refined_question}"
          </blockquote>
        </div>

        <div className="w-8 h-px bg-paper-3 mb-12" />

        {/* Observations */}
        {reading.obs && (
          <div className="mb-12">
            <p className="text-[11px] tracking-label uppercase text-[var(--color-gold-dim)] mb-4">
              观察记录
            </p>
            <div className="space-y-6">
              <ObsBlock label="第一眼" value={reading.obs.q1} />
              <ObsBlock label="第一感觉" value={reading.obs.q2} />
              <ObsBlock label="正在发生的故事" value={reading.obs.q3} />
              <ObsBlock label="回应与提醒" value={reading.obs.q4} />
            </div>
          </div>
        )}

        {reading.observation_summary && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <Section label="你的牌面观察">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {reading.observation_summary}
              </p>
              {writtenObs.length > 0 && (
                <div
                  className="mt-5 pl-5 space-y-2"
                  style={{ borderLeft: "1px solid var(--color-gold)" }}
                >
                  {writtenObs.map((s, i) => (
                    <p
                      key={i}
                      className="font-serif italic text-[15px] text-ink-2 leading-relaxed"
                    >
                      "{s}"
                    </p>
                  ))}
                </div>
              )}
            </Section>
          </>
        )}

        {reading.classic_meaning && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <Section label="经典牌意">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {reading.classic_meaning}
              </p>
            </Section>
          </>
        )}

        {reading.connection && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <Section label="结合你的问题">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85] whitespace-pre-wrap">
                {reading.connection}
              </p>
            </Section>
          </>
        )}

        {reading.psychology && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <Section label="心理学视角">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {reading.psychology}
              </p>
            </Section>
          </>
        )}

        {reading.actions && reading.actions.length > 0 && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <div className="mb-12">
              <p className="text-[11px] tracking-label uppercase text-[var(--color-gold-dim)] mb-4">
                行动建议
              </p>
              <ol className="space-y-3">
                {reading.actions.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-3 font-sans font-light text-[16px] text-ink leading-[1.7]"
                  >
                    <span className="font-serif text-[var(--color-gold-dim)] flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        {reading.one_liner && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <p className="font-serif italic text-[20px] text-ink text-center leading-relaxed mb-12">
              "{reading.one_liner}"
            </p>
          </>
        )}

        {reading.pushback && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <Section label="你的反驳">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {reading.pushback}
              </p>
            </Section>
          </>
        )}

        {reading.personal_name && (
          <>
            <div className="w-8 h-px bg-paper-3 mb-12" />
            <Section label="你给它起的名字">
              <p className="font-sans font-light text-[16px] text-ink leading-[1.85]">
                {reading.personal_name}
              </p>
            </Section>
          </>
        )}

        <div className="mt-16 text-center">
          <Link
            to="/history"
            className="inline-block text-[13px] text-ink-3 hover:text-ink transition-colors font-sans tracking-ui"
          >
            ← 返回全部记录
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <p className="text-[11px] tracking-label uppercase text-[var(--color-gold-dim)] mb-4">
        {label}
      </p>
      {children}
    </section>
  );
}

function ObsBlock({ label, value }: { label: string; value?: string }) {
  if (!value || value === "(left blank)") return null;
  return (
    <div>
      <p className="text-[11px] tracking-label uppercase text-ink-3 mb-1">{label}</p>
      <p className="font-sans font-light text-[15px] text-ink leading-relaxed">{value}</p>
    </div>
  );
}
