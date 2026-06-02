// Robust autosave for the in-progress Mirror reading + history archive.
// Single source of truth for the canonical localStorage keys.
import type { NarrativeReading } from "@/lib/narrative";

export const DRAFT_KEY = "mirror_current_draft_v1";
export const HISTORY_KEY = "mirror_reading_history_v1";
export const HISTORY_BACKUP_KEY = "mirror_reading_history_backup_v1";

export type DraftVisibility = "private" | "anon" | "named";

export interface DraftCard {
  id: string;
  name: string;
  imageUrl?: string;
  reversed: boolean;
}

export interface CurrentDraft {
  rawQuestion?: string;
  refinedQuestion?: string;
  selectedAngle?: string;
  card?: DraftCard | null;
  obs?: { q1: string; q2: string; q3: string; q4: string };
  finalReflection?: string;
  personalName?: string;
  pushback?: string;
  visibility?: DraftVisibility;
  updatedAt?: number;
}

function storage(): Storage | null {
  return typeof window !== "undefined" ? window.localStorage : null;
}

export function getDraft(): CurrentDraft | null {
  const s = storage();
  if (!s) return null;
  const raw = s.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentDraft;
  } catch {
    return null;
  }
}

export function patchDraft(patch: Partial<CurrentDraft>) {
  const s = storage();
  if (!s) return;
  const cur = getDraft() ?? {};
  const next: CurrentDraft = { ...cur, ...patch, updatedAt: Date.now() };
  try {
    s.setItem(DRAFT_KEY, JSON.stringify(next));
  } catch (err) {
    console.error("patchDraft failed", err);
  }
}

export function clearDraft() {
  const s = storage();
  if (!s) return;
  s.removeItem(DRAFT_KEY);
}

export function hasMeaningfulDraft(): boolean {
  const d = getDraft();
  if (!d) return false;
  if (d.rawQuestion?.trim()) return true;
  if (d.refinedQuestion?.trim()) return true;
  if (d.card?.id) return true;
  if (d.obs && Object.values(d.obs).some((v) => v && v.trim() && v !== "(left blank)"))
    return true;
  return false;
}

// --- History (canonical + backup) ---------------------------------------

function readJSONArray<T>(key: string): T[] {
  const s = storage();
  if (!s) return [];
  try {
    const raw = s.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function getHistory(): NarrativeReading[] {
  return readJSONArray<NarrativeReading>(HISTORY_KEY);
}

export function getHistoryBackup(): NarrativeReading[] {
  return readJSONArray<NarrativeReading>(HISTORY_BACKUP_KEY);
}

/** Persist history. Refuses to overwrite a non-empty archive with an empty list. */
export function writeHistory(list: NarrativeReading[]) {
  const s = storage();
  if (!s) return;
  if (!Array.isArray(list)) return;
  if (list.length === 0) {
    const existing = getHistory();
    if (existing.length > 0) {
      console.warn("writeHistory: refused to overwrite non-empty history with []");
      return;
    }
  }
  const payload = JSON.stringify(list);
  try {
    s.setItem(HISTORY_KEY, payload);
    // Mirror to backup as well.
    if (list.length > 0) s.setItem(HISTORY_BACKUP_KEY, payload);
  } catch (err) {
    console.error("writeHistory failed", err);
  }
}

export function restoreFromBackup(): { restored: number } {
  const s = storage();
  if (!s) return { restored: 0 };
  const current = getHistory();
  if (current.length > 0) return { restored: 0 };
  const backup = getHistoryBackup();
  if (backup.length === 0) return { restored: 0 };
  s.setItem(HISTORY_KEY, JSON.stringify(backup));
  return { restored: backup.length };
}

export function exportHistoryAsJSON(): string {
  return JSON.stringify(getHistory(), null, 2);
}

export function downloadHistory() {
  if (typeof window === "undefined") return;
  const json = exportHistoryAsJSON();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  a.href = url;
  a.download = `mirror-readings-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}