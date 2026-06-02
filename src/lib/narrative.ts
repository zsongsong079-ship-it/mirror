// Local narrative archive. Lives in localStorage only — no server, no auth.
// Purpose: let Mirror reflect the user's *own* repeated language back to
// them across readings, without ever diagnosing or scoring them.

export interface NarrativeReading {
  id: string;
  date: number; // epoch ms
  card_name: string;
  card_reversed: boolean;
  card_image_url?: string;
  original_question?: string;
  refined_question: string;
  // Structured observation, each q maps to a different layer of interpretation.
  // q1 = attention pattern, q2 = emotional pattern,
  // q3 = narrative pattern, q4 = reality mapping.
  obs: { q1: string; q2: string; q3: string; q4: string };
  // Reserved for future narrative-theme aggregation (e.g. 自由 / 控制 / 安全感).
  // Always present but populated later.
  narrative_themes?: string[];
  observation_summary: string;
  classic_meaning: string;
  connection: string;
  psychology: string;
  actions: string[];
  one_liner: string;
  pushback?: string; // "this isn't me" note
  personal_name?: string;
}

const READINGS_KEY = "mirror.readings.v1";
const METAPHOR_KEY = "mirror.metaphors.v1";
const SEED_KEY = "mirror.onboarding_seed_emotion";
const HISTORY_KEY = "mirror_reading_history_v1";
const HISTORY_BACKUP_KEY = "mirror_reading_history_backup_v1";
const DRAFT_KEY = "mirror_current_draft_v1";

function readArray(key: string): NarrativeReading[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as NarrativeReading[]) : [];
  } catch {
    return [];
  }
}

function migrateLegacyIfNeeded() {
  if (typeof window === "undefined") return;
  const current = readArray(HISTORY_KEY);
  if (current.length > 0) return;
  const legacy = readArray(READINGS_KEY);
  if (legacy.length > 0) {
    const payload = JSON.stringify(legacy);
    localStorage.setItem(HISTORY_KEY, payload);
    localStorage.setItem(HISTORY_BACKUP_KEY, payload);
    return;
  }
  // If primary is empty but backup has data (e.g. crash, accidental clear),
  // resurrect from backup automatically on read.
  const backup = readArray(HISTORY_BACKUP_KEY);
  if (backup.length > 0) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(backup));
  }
}

export function getSeedEmotion(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SEED_KEY);
}

export function setSeedEmotion(s: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SEED_KEY, s);
}

export function getReadings(): NarrativeReading[] {
  if (typeof window === "undefined") return [];
  migrateLegacyIfNeeded();
  return readArray(HISTORY_KEY);
}

export function saveReading(r: NarrativeReading) {
  if (typeof window === "undefined") return;
  migrateLegacyIfNeeded();
  const existing = readArray(HISTORY_KEY);
  // Avoid duplicates if saveReading runs twice for the same id (e.g. StrictMode).
  const deduped = existing.filter((e) => e.id !== r.id);
  const list = [r, ...deduped].slice(0, 500);
  const payload = JSON.stringify(list);
  localStorage.setItem(HISTORY_KEY, payload);
  localStorage.setItem(HISTORY_BACKUP_KEY, payload);
  // Keep legacy key in sync for any older readers still in flight.
  localStorage.setItem(READINGS_KEY, payload);
  // Reading successfully archived — safe to clear the in-progress draft.
  localStorage.removeItem(DRAFT_KEY);
  console.log("SAVE_HISTORY", r.id);
  console.log("HISTORY_LENGTH", list.length);
  // update metaphor dict from user's own observations
  const dict = getMetaphorDict();
  const words = Object.values(r.obs).join(" ").split(/[\s,，。.!?！？、;；]+/);
  for (const w of words) {
    const key = w.trim().toLowerCase();
    if (!key || key.length < 2 || key.length > 10) continue;
    dict[key] = (dict[key] ?? 0) + 1;
  }
  localStorage.setItem(METAPHOR_KEY, JSON.stringify(dict));
}

export function updateReading(id: string, patch: Partial<NarrativeReading>) {
  if (typeof window === "undefined") return;
  migrateLegacyIfNeeded();
  const list = readArray(HISTORY_KEY);
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], ...patch };
  const payload = JSON.stringify(list);
  localStorage.setItem(HISTORY_KEY, payload);
  localStorage.setItem(HISTORY_BACKUP_KEY, payload);
  localStorage.setItem(READINGS_KEY, payload);
}

export function getMetaphorDict(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(METAPHOR_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function topMetaphors(n = 5): { word: string; count: number }[] {
  return Object.entries(getMetaphorDict())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function readingCount(): number {
  return getReadings().length;
}