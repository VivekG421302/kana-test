# Continuing Kana Quest Learn robustness work — Round 4

I'm attaching `data.js`, `script.js`, `validate-data.html`, and a `diagnostic-tools/` folder. Three prior rounds fixed the dataset and tuned the matching algorithm. **Both are now in good shape.** Read this whole prompt before doing anything — the remaining work is narrower and more judgment-based than previous rounds.

## What this app is
A client-side Japanese handwriting recognition app. `data.js` holds 188 characters (71 hiragana, 71 katakana, 46 kanji) with `refStrokes` the engine in `script.js` matches user drawings against.

## What's been done (rounds 1–4, don't redo this)
- **Round 1–2 (data.js):** Fixed 3 kanji with stroke-count mismatches (六, 百, 千). Found and fixed 129/188 characters (69%) that were byte-identical copies of unrelated characters — every dakuten/handakuten kana was missing its diacritic marks entirely; six unrelated kanji shared one shape; etc. All given genuine, unique, hand-authored strokes.
- **Round 3 (data.js):** Fixed the remaining 23 duplicated kanji (好/考/次/早, 悪/問/黒/黄, 楽/暗, 知/事/物/所/青/明, 方/円, 色/回/同, 速/弱).
- **Round 4 (script.js, this round):**
  1. Changed the stroke-count/coverage penalty in `matchDirectionVectors` from a flat per-stroke penalty to one scaled by *proportion* of strokes mismatched (`CONFIG.STROKE_COUNT_PENALTY_WEIGHT` / `COVERAGE_PENALTY_WEIGHT`, both 0.35). Empirically this alone didn't move the confusability numbers — see below for why.
  2. Found the actual lever: the per-stroke similarity falloff functions (direction-vector edit-distance → similarity, and position-anchor distance → similarity) were too forgiving, letting most character pairs cluster in a ~0.83–0.89 band regardless of real shape difference. Added `CONFIG.DIRECTION_SHARPNESS` (tuned to 5.0) and `CONFIG.POSITION_SHARPNESS` (tuned to 4.0), replacing the old linear/mild-exponential falloffs with sharper exponential decay. Tuned by sweeping values against `diagnostic-tools/analyze.js`'s confusability report — swept 1.5 → 15.0 for direction (plateaued at 5.0) and 1.5 → 6.0 for position (peaked at 4.0, got slightly worse beyond that from overshooting).
  3. Added `CONFIG.AMBIGUITY_MARGIN` (0.05) and a `displayConfidence`/`isAmbiguous` calculation in `matchAgainstDataset`: when the top-2 candidates are a near-tie, the UI now shows a scaled-down confidence and a tooltip naming the runner-up, instead of reporting the raw top-1 score at face value. Wired into `displayResults` via a `.ambiguous` CSS class on `#matchConfidence` — **no corresponding CSS was added** (out of scope, see Constraints), so visually right now this only shows via the browser's default title-tooltip. If you're allowed to touch CSS, styling that class would make ambiguous matches visibly distinct.
  4. Added `selfTestDataset()` — runs automatically when the app is loaded with `?debug=1` in the URL, logs self-match failures and ambiguous pairs to the console. Not wired into any UI element, console only.
  5. Added a guard in `pointsToDirectionVectors` (both `script.js` and `engine-core.js`) that skips zero-length segments instead of emitting a spurious direction value.

**Verification, confirmed just now:**
- Structural checks: still 0 issues.
- Engine self-test: **2/188 failures** (unchanged) — ニ (katakana "two") vs 二 (kanji "two"), a genuine real-world lookalike.
- Confusability (top-2 within 0.05): **26 → 13 pairs**, with zero new self-match regressions introduced by the tuning.

## What's left — the remaining 13 confusable pairs
```
へ ↔ ヘ    べ ↔ ベ    ぺ ↔ ペ    グ ↔ ゾ    ヂ ↔ デ    よ/ニ/二 (3-way)
```
I stopped tuning here deliberately. へ/ヘ, べ/ベ, ぺ/ペ are hiragana/katakana pairs that are **genuinely near-identical in real Japanese** — a native reader relies on context (surrounding script, not isolated-character shape) to disambiguate these, which this app's per-character recognition has no way to do. Pushing the sharpness parameters further to force separation on these risked over-fitting to this specific dataset and could hurt genuine handwriting variation from real users (I didn't test against actual noisy hand-drawn input, only the clean reference strokes — this is a real limitation of the self-test approach worth keeping in mind). よ/ニ/二 is a similar story for a different reason: ニ and 二 really do look the same, and よ getting pulled into that cluster is a side effect of the position-anchor sharpening (it's now scoring high against ニ's simple two-stroke shape). Grid occupancy or curvature signature might be the more discriminating feature for these specific pairs, if you want to keep pushing.

**Your task, if you choose to continue this thread**, is one of:
1. **Accept current state as good enough** — 13 pairs, most/all of them genuine real-world ambiguity, is a defensible stopping point. Consider this closed.
2. **Push further on grid/curvature weighting** for the remaining pairs specifically — try sharpening `matchGridOccupancy`'s Jaccard-similarity floor or `matchCurvatureSignatures`'s per-point matching the same way direction/position were sharpened, and re-run the sweep methodology in `analyze.js`. Watch for regressions in the self-test count (currently 2, should not go above that).
3. **Test against real noisy input** — everything verified so far uses each character's own *reference* strokes as "user input," which is the cleanest possible case. If you have access to real user-drawn samples (or can simulate jitter/noise on the reference strokes), testing the tuned sharpness values against noisy input would validate whether DIRECTION_SHARPNESS=5.0 / POSITION_SHARPNESS=4.0 are too aggressive for real handwriting (sharper falloff = less tolerance for imprecise drawing). This is the most valuable and currently-untested next step.
4. **Style the `.ambiguous` CSS class** in `index.html` so the near-tie warning is visible, not just a hover tooltip — requires touching `index.html`, which prior rounds were told to avoid; check with the user before doing this.

## Tools you have (in `diagnostic-tools/`)
- **`engine-core.js`** — headless Node port of every pure math function from `script.js`, kept in sync through all 4 rounds including this round's sharpness/penalty/guard changes. Verify this stays byte-for-byte equivalent to `script.js`'s CONFIG values and math if you change either file.
- **`analyze.js`** — `node analyze.js` (needs `data.js` + `engine-core.js` in the same folder). Structural checks + self-test + confusability report. Your primary regression check.
- **`glyph_overlap.py`** — visual QA against real font glyphs, less relevant now that both data and algorithm are stable; still useful if you suspect a specific character's shape rather than the algorithm.
- **`kana-fixes-already-applied.js`** / **`kanji-fixes-already-applied.js`** — audit trail from rounds 1–2 and 3. Reference only.

## How to verify further changes
1. Edit `script.js`, mirror in `engine-core.js`, run `node analyze.js`.
2. Self-match failures must stay at 2 (ニ/二 only) — anything higher is a regression.
3. If tuning sharpness further, sweep several values rather than guessing one — see the swept-value comment in `script.js`'s CONFIG for the methodology.

## Constraints
- Don't touch `index.html`, `data-maker.html`, or `validate.html` without explicit sign-off from the user — this has held across all 4 rounds. Round 4 added a CSS class reference in `script.js` (`.ambiguous`) with no corresponding style, which is a minor inconsistency but doesn't break anything; flag it if you touch CSS.
- Don't touch `data.js` — it's clean, this thread is scoped to the algorithm.
- Keep `script.js`'s function names/interface stable so `engine-core.js` and the diagnostic tooling keep working.
