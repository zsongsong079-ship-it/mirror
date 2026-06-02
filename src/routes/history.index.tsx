import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getReadings, type NarrativeReading } from "@/lib/narrative";
import { getCardNameZh } from "@/lib/cardNames";
import { downloadHistory, restoreFromBackup, getHistoryBackup } from "@/lib/draftStorage";

export const Route = createFileRoute("/history/")({
  component: HistoryList,
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

function HistoryList() {
  const [readings, setReadings] = useState<NarrativeReading[]>([]);
  const [ready, setReady] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [backupCount, setBackupCount] = useState(0);

  useEffect(() => {
    const list = getReadings();
    setReadings(list);
    setBackupCount(getHistoryBackup().length);
    setReady(true);
  }, []);

  if (!ready) return null;

  const handleRestore = () => {
    const { restored } = restoreFromBackup();
    if (restored > 0) {
      setReadings(getReadings());
      setRestoreMsg(`已从备份恢复 ${restored} 条记录。`);
    } else {
      setRestoreMsg("没有可恢复的备份。");
    }
  };

  return (
    <>
      <h1 className="font-serif font-light text-[28px] text-ink mb-2">你的记录</h1>
      <p className="font-sans font-light text-[14px] text-ink-3 mb-10">
        {readings.length} 次阅读 · 按时间倒序
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          type="button"
          onClick={downloadHistory}
          disabled={readings.length === 0}
          className="text-[12px] tracking-ui rounded-md border border-paper-3 px-4 py-2 text-ink-2 hover:bg-paper-2 transition-colors disabled:opacity-40"
        >
          导出记录
        </button>
        {readings.length === 0 && backupCount > 0 && (
          <button
            type="button"
            onClick={handleRestore}
            className="text-[12px] tracking-ui rounded-md border border-paper-3 px-4 py-2 text-ink-2 hover:bg-paper-2 transition-colors"
          >
            恢复备份（{backupCount}）
          </button>
        )}
        {restoreMsg && (
          <p className="font-sans text-[12px] text-ink-3 self-center">{restoreMsg}</p>
        )}
      </div>

      {readings.length === 0 && (
        <div className="text-center py-20">
          <p className="font-serif italic text-[16px] text-ink-3 mb-6">
            还没有任何记录。
          </p>
          <Link
            to="/"
            className="inline-block bg-ink text-paper rounded-lg px-6 py-3 text-[13px] font-medium tracking-ui hover:bg-ink-2 transition-colors"
          >
            开始新的阅读
          </Link>
        </div>
      )}

      <ul className="divide-y" style={{ borderColor: "var(--color-paper-3)" }}>
        {readings.map((r) => {
          const excerpt = (r.refined_question || r.original_question || "").trim();
          return (
            <li key={r.id} style={{ borderTop: "0.5px solid var(--color-paper-3)" }}>
              <Link
                to={`/history/${r.id}`}
                className="block py-6 group"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-2">
                  <span className="text-[11px] tracking-label uppercase text-ink-3 flex-shrink-0 md:w-[110px] mb-1 md:mb-0">
                    {formatDate(r.date)}
                  </span>
                  <span className="font-serif text-[14px] tracking-label uppercase text-ink-2 group-hover:text-ink transition-colors">
                    {getCardNameZh(r.card_name)}
                    <span className="text-ink-3 font-sans font-light text-[12px] ml-2 normal-case tracking-ui">
                      {r.card_reversed ? "逆位" : "正位"}
                    </span>
                  </span>
                </div>
                {excerpt && (
                  <p className="font-serif italic text-[15px] text-ink-3 leading-[1.75] md:pl-[126px]">
                    {excerpt.length > 80 ? excerpt.slice(0, 80) + "…" : excerpt}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
