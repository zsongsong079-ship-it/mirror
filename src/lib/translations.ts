export type Language = "en" | "zh";

export const translations = {
  en: {
    nav: {
      history: "History",
      settings: "Settings",
      languageLabel: "EN / 中文",
    },
    landing: {
      eyebrow: "MIRROR",
      title: "You do not live in the world itself.\nYou live in your interpretation of it.",
      body: "Mirror does not predict the future.\nThrough a card, it helps you notice how you make meaning of what is happening.",
      cta: "Begin Reflection",
      flowTitle: "How observation unfolds",
      flow: ["01 Ask First", "You bring the question.", "02 Draw a Card", "The card interrupts your usual story.", "03 Notice the Pattern", "Mirror shows how meaning is made."],
    },
    ask: {
      askFirst: "ASK FIRST",
      placeholder: "What happened recently? What are you feeling? How do you make sense of it?",
      panelTitle: "A Different Direction",
      panelSubtitle: "Perhaps the deeper question is",
      refresh: "Refresh",
      startDrawing: "Begin Drawing",
      loading: "Mirror is reworking this question…",
      selected: "One direction selected",
    },
    observation: {
      title: "What did you notice first?",
      subtitle: "Before asking what it means, notice where your attention went first.",
    },
  },
  zh: {
    nav: {
      history: "历史",
      settings: "设置",
      languageLabel: "中文 / EN",
    },
    landing: {
      eyebrow: "MIRROR",
      title: "你身处的不是这个世界，\n而是你对世界的解释。",
      body: "Mirror 不预测未来。\n它借由一张牌，让你看见自己如何理解正在发生的事。",
      cta: "开始观察",
      flowTitle: "一次观察如何发生",
      flow: ["01 先提问", "你带着问题来。", "02 抽一张牌", "牌打断你原有的故事。", "03 看见模式", "Mirror 让意义如何被建构浮现出来。"],
    },
    ask: {
      askFirst: "先提问",
      placeholder: "发生了什么？你有什么感受？你如何看待？",
      panelTitle: "Mirror 看见的方向",
      panelSubtitle: "也许你真正想问的是",
      refresh: "换一批",
      startDrawing: "开始抽牌",
      loading: "Mirror 正在重新整理这个问题…",
      selected: "已选中一个问题",
    },
    observation: {
      title: "你最先看见了什么？",
      subtitle: "不要急着知道它是什么意思。先写下你的眼睛停在了哪里。",
    },
  },
} as const;
