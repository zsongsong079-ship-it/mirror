import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUp, MoreHorizontal, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useReadingStore } from "@/store/readingStore";
import { generateAngles } from "@/lib/ai.functions";
import { translations } from "@/lib/translations";
import { useLanguageStore } from "@/store/languageStore";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start — Mirror" },
      {
        name: "description",
        content: "Write what happened, then begin your Mirror reading.",
      },
    ],
  }),
  component: Start,
});

export function Start() {
  const navigate = useNavigate();
  const language = useLanguageStore((s) => s.language) || "en";
  const t = translations[language] || translations.en;
  const setRawQuestion = useReadingStore((s) => s.setRawQuestion);
  const setRefinedQuestion = useReadingStore((s) => s.setRefinedQuestion);
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const placeholderText = t.ask.placeholder || translations.en.ask.placeholder;

  console.log("CURRENT LANGUAGE:", language);
  console.log("ASK PLACEHOLDER:", placeholderText);

  const fallbackQuestions = (input: string) => {
    const text = input.toLowerCase();
    if (/备考|学习|product|产品|跳舞|平衡|时间|任务|节奏|效率|目标/i.test(text)) {
      return language === "zh"
        ? [
            "当前阶段，哪件事最能服务于你的长期目标？",
            "你说的平衡，是时间平均分配，还是优先级清晰？",
            "如果只能保留一个主线，其他都变成辅助，你会如何安排？",
          ]
        : [
            "Which part of this phase best serves your long-term goals?",
            "When you say balance, do you mean equal time or clearer priorities?",
            "If only one thread could remain central, how would you arrange the rest?",
          ];
    }
    return language === "zh"
      ? [
          "这个问题里，真正需要你做选择的部分是什么？",
          "你想改变的是结果，还是自己理解这件事的方式？",
          "如果把注意力收回到自己身上，你现在最能调整的是什么？",
        ]
      : [
          "What part of this is actually yours to choose?",
          "Do you want to change the outcome, or the way you make sense of it?",
          "If you brought the focus back to yourself, what could you adjust now?",
        ];
  };

  const persistAskState = (userQuestion: string, suggestion: string | null) => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem("mirror_user_question", userQuestion);
    window.sessionStorage.setItem("mirror_selected_suggestion", suggestion || "");
    window.localStorage.setItem("mirror_user_question", userQuestion);
    window.localStorage.setItem("mirror_selected_suggestion", suggestion || "");
  };

  const submit = async () => {
    const next = value.trim();
    if (!next) return;

    console.log("ASK INPUT:", next);
    console.log("GENERATING SUGGESTIONS FOR:", next);

    setRawQuestion(next);
    setRefinedQuestion("");
    persistAskState(next, null);
    setShowSuggestions(true);
    setSelectedSuggestion(null);
    setSuggestionLoading(true);

    try {
      const result = await generateAngles({ data: { input: next } });
      setSuggestedQuestions(result.angles || fallbackQuestions(next));
    } catch {
      setSuggestedQuestions(fallbackQuestions(next));
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handlePickSuggestion = (question: string) => {
    setSelectedSuggestion(question);
    persistAskState(value.trim(), question);
    setRefinedQuestion(question);
  };

  const handleStartDrawing = () => {
    const next = value.trim();
    if (!next) return;
    persistAskState(next, selectedSuggestion);
    navigate({ to: "/draw" });
  };

  const regenerateSuggestions = async () => {
    const next = value.trim();
    if (!next) return;
    console.log("GENERATING SUGGESTIONS FOR:", next);
    setSelectedSuggestion(null);
    persistAskState(next, null);
    setSuggestionLoading(true);
    try {
      const result = await generateAngles({ data: { input: next } });
      setSuggestedQuestions(result.angles || fallbackQuestions(next));
    } catch {
      setSuggestedQuestions(fallbackQuestions(next));
    } finally {
      setSuggestionLoading(false);
    }
  };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="min-h-screen bg-paper relative flex items-center justify-center px-6 py-12 md:py-10">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-[#7A746D] transition-colors hover:bg-[rgba(47,45,42,0.06)] hover:text-[#2A2A2A]"
        aria-label="Open menu"
      >
        <MoreHorizontal className="h-5 w-5 opacity-75 hover:opacity-100" />
      </button>

      {menuOpen && (
        <div ref={menuRef} className="absolute right-6 top-16 z-20 w-[120px] overflow-hidden rounded-[12px] bg-[rgba(35,35,40,0.96)] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              navigate({ to: "/history" });
            }}
            className="flex h-[42px] w-full items-center px-3 text-[15px] text-white/90 transition-colors hover:bg-white/8"
          >
            {t.nav.history}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-[42px] w-full items-center px-3 text-[15px] text-white/90 transition-colors hover:bg-white/8"
          >
            {t.nav.settings}
          </button>
        </div>
      )}

      <div className="flex w-full max-w-[520px] flex-col items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.26em] text-[#7A746D]">{t.ask.askFirst}</p>
        <div className="relative w-full max-w-[90vw] min-h-[56px] rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(47,45,42,0.72)] px-[18px] pr-[48px] shadow-[0_8px_28px_rgba(47,45,42,0.10)] transition-all duration-200 focus-within:bg-[rgba(70,70,75,0.60)] focus-within:shadow-[0_10px_30px_rgba(47,45,42,0.14)]">
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (!e.target.value.trim()) {
                setShowSuggestions(false);
                setSuggestedQuestions([]);
                setSelectedSuggestion(null);
                persistAskState("", null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={placeholderText}
            className="block min-h-[56px] w-full resize-none border-0 bg-transparent py-4 pr-0 text-[16px] font-normal leading-[1.6] text-[rgba(255,255,255,0.92)] placeholder:whitespace-nowrap placeholder:overflow-hidden placeholder:text-ellipsis placeholder:text-[rgba(255,255,255,0.48)] focus:outline-none"
          />

          <button
            type="button"
            onClick={submit}
            disabled={!value.trim() || suggestionLoading}
            aria-label={t.ask.startDrawing}
            className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.76)] transition-colors hover:text-[rgba(255,255,255,0.9)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-[30px] w-[30px]" strokeWidth={2.1} />
          </button>
        </div>

        {showSuggestions && (
          <section className="mt-8 w-full max-w-[90vw] rounded-[12px] border border-[rgba(47,45,42,0.06)] bg-[rgba(255,252,245,0.55)] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-[#2F2D2A]">{t.ask.panelTitle}</p>
                <p className="mt-1 text-[13px] text-[#7A746D]">{t.ask.panelSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={regenerateSuggestions}
                className="inline-flex items-center gap-1 text-[13px] text-[#7A746D] transition-colors hover:text-[#2A2A2A]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {t.ask.refresh}
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {suggestionLoading ? (
                <p className="text-[14px] text-[#7A746D]">{t.ask.loading}</p>
              ) : (
                (suggestedQuestions || []).map((question) => {
                  const active = selectedSuggestion === question;
                  return (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handlePickSuggestion(question)}
                      className={`w-full rounded-[10px] px-1 py-1 text-left text-[15px] leading-[1.9] transition-colors ${
                        active ? "bg-[rgba(164,143,214,0.10)]" : "hover:bg-[rgba(47,45,42,0.03)]"
                      }`}
                    >
                      <span className="text-[#2F2D2A]">{question}</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-[13px] text-[#7A746D]">{selectedSuggestion ? t.ask.selected : ""}</div>
              <button
                type="button"
                onClick={handleStartDrawing}
                className="rounded-full bg-[#D8CBB8] px-4 py-2 text-[13px] text-[#2A2A2A] transition-colors hover:bg-[#CDBCA5]"
              >
                {t.ask.startDrawing}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
