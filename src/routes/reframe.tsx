import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { reframeQuestion } from "@/lib/ai.functions";
import { saveSelectedQuestion } from "@/lib/readingPersistence";
import { useReadingStore } from "@/store/readingStore";

export const Route = createFileRoute("/reframe")({
  head: () => ({ meta: [{ title: "A different way to hold this question — Mirror" }] }),
  component: Reframe,
});

function createLocalFallbacks(question: string) {
  const q = question.trim().replace(/[?？。！!]+$/, "");
  if (!q) return [];

  if (/爱不爱|喜欢|关系|分手|复合|他|她|ta/i.test(q)) {
    return [
      `我在“${q}”里真正渴望被确认的是什么？`,
      "我现在处在一段什么样的关系里？",
      "我如何靠近一段真正滋养我的关系？",
    ];
  }

  if (/考|考试|上岸|录取|北大|清华|学校|成绩|学习/i.test(q)) {
    return [
      `我把“${q}”解释成了什么？`,
      "我现在需要如何调整自己的学习系统，而不是否定自己？",
      "我如何判断自己是在真实评估，还是被恐惧牵着走？",
    ];
  }

  if (/工作|离职|辞职|跳槽|事业|offer|老板|同事|项目/i.test(q)) {
    return [
      `我在“${q}”背后真正担心失去什么？`,
      "我想通过这个选择靠近怎样的工作状态？",
      "我如何区分现实压力和我对自己的否定？",
    ];
  }

  return [
    `当我问“${q}”时，我最在意的具体结果是什么？`,
    `在“${q}”里，我真正能回到自己手里的部分是什么？`,
    `面对“${q}”，我如何分辨直觉、期待和恐惧？`,
  ];
}

function Reframe() {
  const rawQuestion = useReadingStore((s) => s.rawQuestion);
  const setRefined = useReadingStore((s) => s.setRefinedQuestion);
  const reframeFn = useServerFn(reframeQuestion);

  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState("");

  const originalQuestion =
    rawQuestion ||
    (typeof window !== "undefined"
      ? localStorage.getItem("mirror.originalQuestion") ||
        localStorage.getItem("mirror.rawQuestion") ||
        ""
      : "");

  // NOTE: Do NOT auto-navigate back to "/" here.
  // zustand persist hydrates asynchronously and StrictMode double-renders;
  // any redirect based on `rawQuestion` being "" will fire in the gap
  // between mount and hydration and bounce the user back to the input page
  // even after the perspective-selection screen has already rendered.

  useEffect(() => {
    console.log("[reframe] STEP CHANGE -> perspective-selection", {
      rawQuestion,
      originalQuestion,
      loading,
      optionsLen: options.length,
    });
  }, [rawQuestion, originalQuestion, loading, options.length]);

  useEffect(() => {
    if (!originalQuestion) return;
    let cancelled = false;
    (async () => {
      try {
        console.log("[reframe] generating dynamic questions for:", originalQuestion);
        const result = await reframeFn({ data: { question: originalQuestion } });
        if (!cancelled) setOptions(result.options.filter(Boolean));
      } catch (e) {
        console.error("[reframe] AI generation failed, using local contextual fallback", e);
        if (!cancelled) {
          setOptions(createLocalFallbacks(originalQuestion));
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [originalQuestion, reframeFn]);

  useEffect(() => {
    console.log("[reframe] REFLECTION_OPTIONS", options);
  }, [options]);

  useEffect(() => {
    console.log("[reframe] QUESTION", originalQuestion);
  }, [originalQuestion]);

  const choose = (q: string) => {
    console.log("[reframe] choose:", q);
    try {
      setRefined(q);
      if (typeof window !== "undefined") {
        saveSelectedQuestion(q, originalQuestion);
        if (originalQuestion) {
          localStorage.setItem("mirror.originalQuestion", originalQuestion);
          localStorage.setItem("mirror.rawQuestion", originalQuestion);
        }
      }
    } catch (err) {
      console.error("[reframe] save error", err);
    }
    if (typeof window !== "undefined") {
      window.location.href = "/draw";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
        <div
          className="w-2 h-2 rounded-full mb-6 animate-mirror-pulse"
          style={{ background: "var(--color-gold)" }}
        />
        <p className="font-sans text-sm text-ink-3 tracking-ui">正在把问题轻轻转向你自己……</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-[560px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] tracking-label uppercase text-[var(--color-gold-dim)] mb-3">
            你的问题
          </p>
          <blockquote
            className="font-serif italic text-[20px] text-ink-2 pl-5 leading-relaxed"
            style={{ borderLeft: "1px solid var(--color-gold)" }}
          >
            "{originalQuestion}"
          </blockquote>
        </motion.div>

        <div className="flex justify-center my-12">
          <div className="w-10 h-px bg-paper-3" />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif font-light text-[28px] text-ink leading-snug mb-3"
        >
          换一种方式握住这个问题
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-sans font-light text-[14px] text-ink-3 leading-relaxed mb-10 max-w-[440px]"
        >
          选那个让你心里轻轻一颤的角度。没有正确答案——你看见的，就是你需要看见的。
        </motion.p>

        {error && (
          <p className="text-sm text-ink-3 italic mb-6">
            我在下面放了几个温柔的角度——选一个有共鸣的。
          </p>
        )}

        <div className="space-y-4">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.15 }}
              onClick={(e) => {
                e.preventDefault();
                choose(opt);
              }}
              className="w-full text-left bg-paper-2 px-6 py-5 group"
              style={{
                border: "0.5px solid var(--color-paper-3)",
                borderRadius: "12px",
                transition: "border-color 0.4s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor =
                  "color-mix(in oklab, var(--color-gold) 40%, transparent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-paper-3)")
              }
            >
              <p className="font-serif italic text-[18px] text-ink text-center leading-snug">
                {opt}
              </p>
              <p className="mt-4 text-center text-[12px] tracking-ui text-ink-3 font-sans font-medium">
                选这个角度 →
              </p>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-10 text-center"
        >
          {!showCustom ? (
            <button
              type="button"
              onClick={() => setShowCustom(true)}
              className="text-[13px] text-ink-3 hover:text-ink-2 transition-colors font-sans"
            >
              或者用你自己的话 ↓
            </button>
          ) : (
            <div className="text-left">
              <textarea
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                rows={2}
                placeholder="用你自己的话来框这个问题…"
                className="w-full bg-paper-2 rounded-lg px-5 py-4 font-serif italic text-[17px] text-ink placeholder:text-ink-3 placeholder:italic resize-none focus:outline-none focus:bg-paper-3/40 transition-colors"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!custom.trim()}
                  onClick={(e) => {
                    e.preventDefault();
                    choose(custom.trim());
                  }}
                  className="px-5 py-2 rounded-lg bg-ink text-paper text-[13px] font-medium tracking-ui disabled:opacity-40 hover:bg-ink-2 transition-colors"
                >
                  用这个 →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
