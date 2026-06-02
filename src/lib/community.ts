// Community interpretations — local-first archive of how different people
// see the same card. Stored in localStorage today; structured so a server
// backend can pick this up later without changing the consumer shape.

export type Visibility = "private" | "anon" | "named";

export interface CommunityEntry {
  id: string;
  card_id: string;
  card_name: string;
  question_summary: string; // refined or original question, trimmed
  story: string; // q3 — "this card is a story, what is happening"
  timestamp: number;
  visibility: Visibility;
  author_name?: string; // only when visibility === "named"
  // Reserved for future narrative-theme tagging.
  narrative_themes?: string[];
}

const KEY = "mirror.community.v1";

// Seed examples — always shown alongside user-contributed entries so a brand
// new visitor sees that the same card produces wildly different stories.
const SEED_ENTRIES: CommunityEntry[] = [
  {
    id: "seed-chariot-1",
    card_id: "major_07",
    card_name: "The Chariot",
    question_summary: "是否继续考研二战",
    story: "我看到一个已经很累但仍然往前走的人。",
    timestamp: 0,
    visibility: "anon",
  },
  {
    id: "seed-chariot-2",
    card_id: "major_07",
    card_name: "The Chariot",
    question_summary: "要不要离开一段关系",
    story: "我看到一个不愿停下来的人。",
    timestamp: 0,
    visibility: "anon",
  },
  {
    id: "seed-chariot-3",
    card_id: "major_07",
    card_name: "The Chariot",
    question_summary: "要不要接下这个项目",
    story: "我看到一个终于知道方向的人。",
    timestamp: 0,
    visibility: "anon",
  },
  {
    id: "seed-fool-1",
    card_id: "major_00",
    card_name: "The Fool",
    question_summary: "要不要换城市",
    story: "我看到一个准备纵身一跃但其实并不害怕的人。",
    timestamp: 0,
    visibility: "anon",
  },
  {
    id: "seed-fool-2",
    card_id: "major_00",
    card_name: "The Fool",
    question_summary: "我是不是太天真",
    story: "我看到一个还没有被现实磨平的人，他在保护那点东西。",
    timestamp: 0,
    visibility: "anon",
  },
  {
    id: "seed-tower-1",
    card_id: "major_16",
    card_name: "The Tower",
    question_summary: "工作崩塌之后该怎么办",
    story: "我看到一个东西塌了，但其实早就应该塌了。",
    timestamp: 0,
    visibility: "anon",
  },
  {
    id: "seed-tower-2",
    card_id: "major_16",
    card_name: "The Tower",
    question_summary: "要不要结束这段友谊",
    story: "我看到一座我一直在维护、其实从未真的稳过的塔。",
    timestamp: 0,
    visibility: "anon",
  },
  {
    id: "seed-star-1",
    card_id: "major_17",
    card_name: "The Star",
    question_summary: "我还能再相信吗",
    story: "我看到一个人在重新把水倒回河里——她终于愿意付出了。",
    timestamp: 0,
    visibility: "anon",
  },
];

function safeStorage() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

export function getAllCommunityEntries(): CommunityEntry[] {
  const storage = safeStorage();
  if (!storage) return SEED_ENTRIES;
  try {
    const raw = storage.getItem(KEY);
    const user = raw ? (JSON.parse(raw) as CommunityEntry[]) : [];
    return [...user, ...SEED_ENTRIES];
  } catch {
    return SEED_ENTRIES;
  }
}

export function getEntriesForCard(cardId: string): CommunityEntry[] {
  return getAllCommunityEntries()
    .filter((e) => e.card_id === cardId && e.visibility !== "private")
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function saveCommunityEntry(entry: CommunityEntry) {
  const storage = safeStorage();
  if (!storage) return;
  try {
    const raw = storage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as CommunityEntry[]) : [];
    const filtered = list.filter((e) => e.id !== entry.id);
    filtered.unshift(entry);
    storage.setItem(KEY, JSON.stringify(filtered.slice(0, 500)));
  } catch (err) {
    console.error("saveCommunityEntry failed", err);
  }
}