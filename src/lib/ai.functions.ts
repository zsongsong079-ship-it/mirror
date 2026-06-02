import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { sanitizeAIOutput } from "./sanitize";

const MODEL = "google/gemini-3-flash-preview";
const MIN_DELAY_MS = 400;

async function withSlowness<T>(fn: () => Promise<T>): Promise<T> {
  const [result] = await Promise.all([
    fn(),
    new Promise((r) => setTimeout(r, MIN_DELAY_MS)),
  ]);
  return result;
}

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  return createLovableAiGatewayProvider(key)(MODEL);
}

const REFRAME_SYSTEM = `你是一个塔罗自我观察的向导。这个工具不是算命，而是借塔罗牌做自我观察和行动澄清。

用户会写下一个原始问题。你的任务是把它转化成 3 个更适合用塔罗牌来观察的问题。

转化原则：
- 不问不可验证的外部事实（例如"他到底怎么想"）
- 不替别人做心理判断
- 转向用户自身的状态、感受、关系模式、内在需求、行动选择
- 语言自然、具体、温柔
- 不要堆砌抽象概念（不要说"掌控感""存在意义""试验品身份"这种）
- 通常一题关于"用户当前的真实感受/状态"，一题关于"需要看清的模式或风险"，一题关于"可以从哪里开始的小行动/调整"
- 全部使用第一人称中文
- 每行一个问题，只输出 3 行，不要解释，不要序号

示例：

原问题：他爱不爱我？
好的转化：
我在这段关系里真正感受到的是滋养，还是消耗？
我现在最需要看清这段关系里的什么模式？
如果我想进入更稳定滋养的关系，我可以从哪里开始调整？

原问题：我现在的学习方法高效吗？
好的转化：
我现在的学习方式最值得保留的部分是什么？
我目前学习中最大的阻滞点在哪里？
接下来我应该如何调整学习节奏，让努力更有效？

原问题：我该不该继续做这个产品？
好的转化：
我继续做这个产品时，真正的动力来自哪里？
这个产品目前最需要我看清的风险是什么？
接下来我应该采取什么小行动来验证它是否值得继续？

不要生成这种问题：
"我如何平衡产品开发者和试验品身份"
"我追求什么样的掌控感"
"我真正想通过这个问题找到的是什么"
这些太抽象，用户不会想问。`;

export const reframeQuestion = createServerFn({ method: "POST" })
  .inputValidator(z.object({ question: z.string().min(1).max(800) }))
  .handler(async ({ data }) => {
    return withSlowness(async () => {
      try {
        const { text } = await generateText({
          model: getModel(),
          system: REFRAME_SYSTEM,
          prompt: `原问题：\n${data.question}\n\n请把它转化成 3 个适合用塔罗牌观察的第一人称中文问题。每个问题必须保留原问题里的具体对象（具体的人、关系、目标、决定、领域），不要替换成抽象概念。`,
        });
        const options = text
          .split("\n")
          .map((line) => sanitizeAIOutput(line.replace(/^[-*\d.、\s]+/, "")))
          .filter(Boolean)
          .slice(0, 3);

        if (options.length === 0) throw new Error("empty_reframe_options");
        return { options };
      } catch (err) {
        console.error("[reframeQuestion] error", err);
        throw new Error("reframe_failed");
      }
    });
  });

const ANGLES_SYSTEM = `你是一个安静的镜子。用户写下来的可能是一段经历、一个困惑、一种感受、一个反复出现的念头——不一定是完整的问题。

你的任务是给出 3 个"观察角度"，帮助用户看见自己的叙事系统、解读模式和情绪模式。不是预测未来，不是算命，不是诊断问题。

核心方向：
- 不是"为什么会发生这件事"，而是"我在怎么理解这件事"
- 不是"问题出在哪"，而是"我在做哪些假设"
- 不是"我该怎么做"，而是"我在保护什么、渴望什么、害怕失去什么"
- 不是"判断对错"，而是"看见自己的解读方式"

具体聚焦：
- 用户是怎么理解当前处境的
- 用户在做什么假设
- 哪些价值观在这个处境里被触动了
- 用户在保护什么
- 用户在渴望什么
- 用户在害怕失去什么

规则：
- 必须是第一人称中文（"我……"）
- 引导注意自己的解读方式，而非分析外部原因
- 不要生成预测性问题（"结果会是什么""将来会怎样"）
- 不要生成算命式问题（"命运会怎样安排""塔罗在暗示什么"）
- 不要生成诊断式问题（"我是不是因为……""为什么我总是……"）
- 不要替别人下结论（"他是不是……"是错的）
- 自然口语，温柔，具体，像一面镜子在帮你看见
- 不要堆砌抽象概念（不要说"掌控感""存在意义""自我同一性"这种）
- 每行一个角度，只输出 3 行，不要序号，不要解释

好的角度示例：
我在怎么理解这件事？我做了什么假设？
我在保护什么？我在害怕失去什么？
什么对我来说真正重要？
我在渴望发生什么？
我一直用什么方式解读类似的处境？
我忽略了什么可能性？

不好的角度示例：
结果会好吗？
他是不是……？
我是不是在逃避？
是不是因为不安全感？
为什么我总是这样？`;

export const generateAngles = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      input: z.string().min(1).max(2000),
      seed: z.number().optional(),
    }),
  )
  .handler(async ({ data }) => {
    return withSlowness(async () => {
      try {
        const { text } = await generateText({
          model: getModel(),
          system: ANGLES_SYSTEM,
          prompt: `用户写下：\n${data.input}\n\n请给出 3 个第一人称中文的自我观察角度。${
            data.seed ? `（请给出与之前不同的角度，批次 #${data.seed}）` : ""
          }每行一个，不要序号，不要解释。`,
        });
        const angles = text
          .split("\n")
          .map((line) => sanitizeAIOutput(line.replace(/^[-*\d.、\s]+/, "")))
          .filter(Boolean)
          .slice(0, 3);
        if (angles.length === 0) throw new Error("empty_angles");
        return { angles };
      } catch (err) {
        console.error("[generateAngles] error", err);
        throw new Error("angles_failed");
      }
    });
  });

const REFLECTION_SYSTEM = `你是一个安静、克制、懂塔罗也懂心理学的解释者。语气温柔、清晰、具体，不玄学，不恐吓，不装神秘，不替用户下结论。

你的任务不是算命，而是帮助用户看见：
- 他们原本的问题是如何被他们自己解释的
- 他们如何看待这张牌
- 他们在这段情境里正在保护什么、渴望什么、害怕什么
- 传统牌意如何和他们自己的理解发生碰撞

你会根据以下信息生成结构化解读：
- 用户原始问题（original_question / question）
- 用户对牌面的观察（obs_q1~obs_q4）
- 当前牌（card_name、card_orientation、card_meaning）

生成结构化解读。每一段都用中文，自然口语，不要 markdown 符号。

各字段要求：
- observation_summary（你的牌面观察）：用 2-3 句话，把用户写下的画面、感受和联想温柔地复述出来。尽量引用用户的原词。如果用户全部跳过，就写"你这次没有写下观察，那我们直接看这张牌本身。"
- classic_meaning（经典牌意）：用 2-3 句话讲这张牌在传统塔罗中的核心含义，并明确说明这是正位还是逆位的解释。不要神秘化。
- connection（结合你的问题）：4-6 句话。把经典牌意 + 用户问题 + 用户观察联系起来。重点放在用户当前状态、内在需求、行为模式、可能的卡点、可以重新理解问题的角度。不要预测结果，不要替别人下判断。涉及感情时，不评判对方是否爱用户，只帮用户看清自己的感受、需求和选择。要明确回应用户原始问题所体现的现实处境，而不是只围绕牌本身。
- psychology（心理学视角）：2-4 句话。用一个温和、科学的心理学概念解释当前情况（例如：投射、依恋模式、情绪调节、认知偏差、自我效能感、边界感、行为强化、压力反应等）。点名这个概念，但用人话解释，不要堆术语。这个部分必须和用户的问题与观察一起读，而不是只讲牌。
- actions（行动建议）：恰好 3 条。每条是用户今天或这周可以做的具体小行动，动词开头，避免空泛鸡汤。例如"今晚花 10 分钟写下你在这段关系里最舒服和最不舒服的三个时刻"而不是"多关爱自己"。
- one_liner（一句话提醒）：1 句温柔、有力量、可以收束全部的话。不超过 30 字。

安全边界：
- 涉及健康、法律、财务，只做情绪和行动澄清，不给专业诊断或确定性建议。
- 不要使用"命中注定""一定会""注定"这类词。`;

export const generateReflection = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      card_name: z.string(),
      card_meaning: z.string(),
      card_orientation: z.string(),
      question: z.string(),
      original_question: z.string().optional(),
      obs_q1: z.string(),
      obs_q2: z.string(),
      obs_q3: z.string(),
      obs_q4: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    return withSlowness(async () => {
      try {
        const prompt = `牌：${data.card_name}（${data.card_orientation}）
经典牌意：${data.card_meaning}

用户的原始问题：${data.original_question || data.question}
用户选定的转化问题：${data.question}

用户对牌面的观察：
1. 观察 · 第一眼你看到了什么：${data.obs_q1 || "（跳过）"}
2. 感受 · 它给你的第一感觉是什么：${data.obs_q2 || "（跳过）"}
3. 叙事 · 如果这张牌是一段故事，它正在发生什么：${data.obs_q3 || "（跳过）"}
4. 意义 · 如果这张牌在回应你的问题，它像是在提醒你什么：${data.obs_q4 || "（跳过）"}

请按规定的字段生成结构化解读。`;

        const { output } = await generateText({
          model: getModel(),
          system: REFLECTION_SYSTEM,
          prompt,
          output: Output.object({
            schema: z.object({
              observation_summary: z.string(),
              classic_meaning: z.string(),
              connection: z.string(),
              psychology: z.string(),
              actions: z.array(z.string()).min(3).max(3),
              one_liner: z.string(),
            }),
          }),
        });
        return {
          observation_summary: sanitizeAIOutput(output.observation_summary),
          classic_meaning: sanitizeAIOutput(output.classic_meaning),
          connection: sanitizeAIOutput(output.connection),
          psychology: sanitizeAIOutput(output.psychology),
          actions: output.actions.map((a) => sanitizeAIOutput(a)).filter(Boolean),
          one_liner: sanitizeAIOutput(output.one_liner),
        };
      } catch (err) {
        console.error("[generateReflection] error", err);
        return {
          observation_summary:
            "我们这次先放下复杂的解读，回到你写下的那几句话本身。",
          classic_meaning:
            "这张牌的核心，是邀请你把注意力从外部结果挪回到此刻的自己。",
          connection:
            "你提出的问题里其实已经藏着方向。也许现在最重要的不是答案，而是你愿意停下来问自己。",
          psychology:
            "情绪调节里有一个简单的事实：当我们能命名自己的感受时，它的强度通常会下降一些。",
          actions: [
            "今天找一个安静的时刻，把你写下的观察大声读一遍。",
            "这一周里挑一件你能做且只关于自己的小事，做完它。",
            "睡前用一句话写下今天最真实的感受，不评价。",
          ],
          one_liner: "你不需要立刻有答案，留出空间，答案才会浮上来。",
          error: "fallback" as const,
        };
      }
    });
  });
