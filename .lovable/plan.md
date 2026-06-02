# Mirror flow audit

## Flow as it actually runs today

`/welcome` (first time only) → `/` (Home) → user types → AI angles render inline → user taps an angle (fills the textarea) → "开始观察" → `/shuffle` → auto-navigates to `/draw` → pick + confirm card → `/observe` → fill 4 questions → "继续" → `/reflection` → AI runs, `saveReading()` writes history → `/history` list → `/history/$readingId` detail.

Note: `/reframe` exists but is not wired into the live path. Home submits straight to `/shuffle`. The "choose one angle" step happens inline on Home (taps fill the textarea, then the user presses 开始观察).

## 1. What works

- Home input + `patchDraft` autosave ✅
- Angle generation (`generateAngles` serverFn) + inline angle selection ✅
- `/shuffle` writes a 7-card spread to `sessionStorage["mirror.shuffledDeck"]` and navigates to `/draw` ✅
- `/draw` reads spread, confirm-then-flip flow, persists card via `saveSelectedCard` + `patchDraft`, navigates to `/observe` ✅
- `/observe` reads card + answers, autosaves each keystroke (`saveObserveAnswers` + `patchDraft`), navigates to `/reflection` ✅
- `/reflection` calls `generateReflection`, then calls `saveReading()` in `finally` — which writes both `mirror_reading_history_v1` and `mirror_reading_history_backup_v1`, and clears `mirror_current_draft_v1` ✅
- `/history` reads `mirror_reading_history_v1` via `getReadings()` (with legacy + backup migration) ✅
- `/history/$readingId` resolves by id ✅
- History persists across refresh (localStorage, mirrored to backup, with refusal to overwrite non-empty with `[]`) ✅

## 2. What breaks — one real blocker

**Duplicate readings on every reflection.** In `src/routes/reflection.tsx`:

- First `useEffect` hydrates the store and calls `setObs("q1"...)`, `setObs("q2"...)`, `setObs("q3"...)`, `setObs("q4"...)` — four sequential store writes, each producing a new `obs` object reference.
- Second `useEffect` lists `obs` (and `generateFn`, `originalQuestion`, `refinedQuestion`) in its dependency array. Every new `obs` reference re-runs the effect, which:
  - generates a fresh `id` (`${Date.now()}-${random}`),
  - re-fires `generateReflection`,
  - and unconditionally calls `saveReading({...})` in `finally` — with a **new id each time**, so the dedupe-by-id in `saveReading` does not help.

Result: each completed reading is written to history 2–5 times, the AI gateway is hit multiple times per reading, and the History page shows duplicates.

`useServerFn(generateReflection)` also returns a new function identity on every render, which compounds the re-fire problem.

## 3. Storage / persistence checks

- `mirror_reading_history_v1` is correctly written by `saveReading` ✅
- `mirror_reading_history_backup_v1` mirrored ✅
- Legacy key `mirror.readings.v1` migrated on first read ✅
- Survives refresh ✅
- `writeHistory` refuses to overwrite a non-empty list with `[]` ✅
- Draft cleared on successful save ✅

## 4. Minor non-blockers (noted, not fixing now)

- Home submit bypasses `/reframe`; the orphan route stays in the tree but no UI links to it. Not a blocker for the demo flow.
- Console shows transient `Importing a module script failed` after a dev server reload — recovers on reload; not a code defect.

## Fix to apply

Stabilize `/reflection`'s "generate + save" effect so it runs exactly once per reading:

1. Replace the obs-derived dependency array with a `useRef` guard (`hasRunRef`) that runs the generate-and-save effect once after `checkedStorage === true` and `card` is present.
2. Read `obs`, `card`, `isReversed`, `refinedQuestion`, `originalQuestion` from local state at the moment of invocation (already in scope) — do not list them as deps.
3. Generate the `id` once and store it on `readingIdRef` before the AI call so the save call (and any retry path) reuses it.
4. Keep the existing `cancelled` flag so an unmount mid-flight skips the `setResult` / `saveReading` work.

No UI, no styling, no narrative-data changes. Single file: `src/routes/reflection.tsx`.

## Verification after fix

- Run the full flow once; confirm exactly one new entry in `mirror_reading_history_v1` and one matching backup entry.
- Refresh `/history` — entry still present, list length unchanged.
- Open `/history/$readingId` — detail renders.
- Re-run flow a second time — history length increments by exactly 1.
