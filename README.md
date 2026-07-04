# Kana Quest Learn

A client-side, zero-dependency Japanese character recognition and learning app. Built entirely in vanilla JavaScript with a hybrid multi-feature recognition engine.

---

## What It Does

Kana Quest Learn lets you draw Japanese characters (Hiragana, Katakana, or Kanji) on a canvas and instantly identifies what you wrote. It speaks the result in Japanese, shows you how confident it is, and — if it gets it wrong — you can teach it your personal writing style.

---

## Architecture & Approach

### The Core Problem

Online handwriting recognition for East Asian scripts is hard because:
- The same character can be drawn fast or slow, big or small
- Stroke order varies between people
- Some characters look very similar (あ vs ア, 人 vs 入)
- Curved strokes vs straight strokes are easy to confuse

### Our Solution: A Hybrid Multi-Feature Engine

Instead of relying on a single technique, we combine **six independent feature matchers** and blend their scores. Each matcher catches different kinds of mistakes the others might miss.

---

## The Six Feature Matchers

### 1. Directional Substroke Vectors (30% weight)
**What it does:** Records the compass direction of every pen movement.

- Each stroke is resampled to exactly 10 evenly-spaced points
- The angle between consecutive points is mapped to 1 of 8 octants (→ ↘ ↓ ↙ ← ↖ ↑ ↗)
- A stroke becomes a sequence like `[0, 0, 1, 2, 2, 3]`
- Matching uses **cyclic angular Levenshtein edit distance** — so direction 0 (→) and direction 7 (↗) are considered "close" with a small penalty, not a full mismatch

**Why it matters:** This is the backbone. It is completely invariant to drawing speed and size.

**Weakness:** Two different characters can accidentally have the same direction sequence.

---

### 2. Position Anchors (20% weight)
**What it does:** Compares where each stroke starts and ends within the character's bounding box.

- Start and end points are normalized to a 0–1 coordinate system
- Matches are scored by Euclidean distance between corresponding points

**Why it matters:** Catches cases where direction sequences match but the overall shape is wrong. For example, あ and ア both have horizontal + vertical + diagonal strokes, but their positions differ.

**Weakness:** Doesn't care about the path between start and end.

---

### 3. Grid Occupancy (15% weight)
**What it does:** Divides the character into a 4×4 grid and checks which cells each stroke passes through.

- Uses Jaccard similarity: `intersection / union` of occupied cells
- Per-stroke matching with greedy assignment

**Why it matters:** Captures spatial layout independently of stroke shape. A stroke that goes through the top-left quadrant vs bottom-right is easily distinguished.

**Weakness:** Coarse resolution — a thin stroke and a thick stroke in the same cell look identical.

---

### 4. Curvature Detection (10% weight)
**What it does:** Classifies each point along a stroke by how much it bends.

- Straight: angle change < 15°
- Gentle curve: 15°–45°
- Sharp corner: 45°–90°
- Loop: > 90°

**Why it matters:** Distinguishes straight lines from curves. あ has a loop; ア does not. This catches those differences.

**Weakness:** Sensitive to wobbly hands — a shaky straight line may register as gentle curves.

---

### 5. Stroke Proportions (10% weight)
**What it does:** Compares the relative length of each stroke.

- Each stroke length is divided by total character length
- Produces ratios like `[0.6, 0.4]` for a long + short stroke pair

**Why it matters:** い has one long vertical stroke and one short one. Without this, two equal-length strokes might score well against it.

**Weakness:** Doesn't help for characters where all strokes are roughly equal length.

---

### 6. Pixel Similarity Fallback (15% weight)
**What it does:** Renders both user drawing and reference to a 32×32 grid and computes pixel overlap (Intersection over Union).

- Acts as a safety net when vector features are ambiguous
- Visual debug shows green (match), red (user only), blue (reference only)

**Why it matters:** When the top two vector-based candidates are within 10% of each other, this breaks ties by actual visual appearance.

**Weakness:** Size and position dependent — must be normalized first.

---

## Blended Scoring

Final score = weighted sum of all six features + learned user boost

| Feature | Weight |
|---------|--------|
| Direction Vectors | 30% |
| Position Anchors | 20% |
| Grid Occupancy | 15% |
| Pixel Similarity | 15% |
| Curvature | 10% |
| Stroke Proportions | 10% |
| **Learned Boost** | up to +30% |

The threshold for a "valid match" is **35%**. Below that, the app says "No clear match."

---

## User-Correctable Learning

### How It Works

1. You draw a character
2. The app guesses wrong (or you just want to reinforce)
3. You tap the correct character in the "Not right?" correction grid
4. The app stores your stroke pattern in `localStorage`
5. Future drawings that match your stored pattern get a **boost up to +30%**

### Storage Format

```json
{
  "か": [
    { "timestamp": 1234567890, "vectors": [...], "features": {...} },
    { "timestamp": 1234567900, "vectors": [...], "features": {...} }
  ],
  "き": [...]
}
```

- Up to **5 samples per character** stored (prevents bloat)
- Stored under key `kana_learned_references`
- Completely client-side — no server, no privacy concerns

---

## Live Stroke Feedback

After every stroke you complete, the app runs a lightweight analysis and shows a **live guess panel** in the top-right corner of the canvas:

- Top 3 candidate characters
- Mini confidence bars
- Updates in real-time as you add strokes

This gives immediate feedback on whether you're on the right track before you finish the whole character.

---

## Two Recognition Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| **Auto-Detect** | Evaluates 450ms after you lift your pen | Quick practice, natural flow |
| **Manual Check** | Only evaluates when you press "Check Character" | Deliberate study, want to finish first |

Toggle between modes with the switch above the canvas.

---

## File Structure

```
index.html      →  UI layout, all debug panels, mode toggle, canvas
├── data.js     →  Character dataset (expand here)
└── script.js   →  Full recognition engine (55KB)
```

### Why Split data.js?

- `data.js` is the **only file you edit** to add characters
- `script.js` is the **engine** — never needs changing for new characters
- Clean separation makes bulk expansion easy

---

## How to Add Characters

Open `data.js` and append to the `DATASET` array:

```javascript
{
    char: 'か',
    name: 'Hiragana Ka',
    reading: 'ka',
    type: 'hiragana',
    expectedStrokes: 3,
    refStrokes: [
        [{x:40,y:60}, {x:100,y:60}, {x:160,y:60}],          // stroke 1
        [{x:80,y:60}, {x:80,y:120}, {x:80,y:180}],          // stroke 2
        [{x:140,y:100}, {x:160,y:130}, {x:140,y:160}]       // stroke 3
    ]
}
```

### Coordinate Conventions

- Canvas logical space: **~300×300**
- `(0,0)` = top-left, `(300,300)` = bottom-right
- Use **3–5 points per stroke** to define the path
- Keep strokes roughly centered
- Horizontal strokes: `y ≈ 50–150`, `x` spans `40–260`
- Vertical strokes: `x ≈ 100–200`, `y` spans `40–260`
- Curved strokes: use 4–5 points to approximate the curve

The engine automatically resamples your points to 10 evenly-spaced points and computes all features. You don't need to be pixel-perfect.

---

## Scaling Roadmap

### Phase 1: Complete Basic Sets (Immediate)
- [ ] All 46 Hiragana (あ–わ + ん)
- [ ] All 46 Katakana (ア–ワ + ン)
- [ ] Dakuten/Handakuten variants (が, ぱ, ギ, パ, etc.)

**Effort:** Low — just need reference strokes for each.

### Phase 2: JLPT N5 Kanji (~80 characters)
- [ ] 一, 二, 三, 人, 口, 日, 月, 火, 水, 木, 金, 土...
- [ ] Numbers, nature, body parts, directions, time

**Effort:** Medium — Kanji have more strokes, need careful reference definition.

### Phase 3: JLPT N4 Kanji (~170 additional)
- [ ] More complex characters with radicals
- [ ] Compound kanji (明 = 日 + 月)

**Effort:** Medium-High — stroke count increases, similarity conflicts rise.

### Phase 4: Advanced Features (Engine Enhancement)
- [ ] **Radical decomposition** — match by component radicals instead of whole character
- [ ] **Stroke-order-agnostic mode** — allow any stroke order (harder matching)
- [ ] **Batch dataset import** — JSON/CSV format for bulk character loading
- [ ] **Community dataset** — export/import learned references between devices

### Phase 5: Beyond Recognition
- [ ] **Guided practice mode** — app shows stroke order animation, user traces over it
- [ ] **Spaced repetition** — track which characters you struggle with, quiz those more often
- [ ] **Progress dashboard** — accuracy over time, characters mastered, streak counter

---

## Use Cases

### 1. Self-Study Japanese Learner
> *"I'm learning Hiragana and want to check if I'm writing characters correctly."*

Draw the character → instant feedback → hear pronunciation → correct if wrong → app remembers your style.

### 2. Classroom Teacher
> *"I want students to practice writing on tablets without installing apps."*

Zero-dependency web app. Works on any device with a browser. No login, no setup, no internet required after first load.

### 3. Kanji Exam Prep (JLPT)
> *"I need to memorize 80+ Kanji for N5 and verify my stroke accuracy."*

Expand dataset to JLPT N5 characters. Use Manual Check mode to finish the whole character before seeing the answer — mimics test conditions.

### 4. Calligraphy Practice
> *"I want to see how my handwriting compares to standard reference forms."*

The Position Anchors and Pixel Similarity debug panels show exactly where your strokes deviate from the reference. Use this to refine form.

### 5. Child-Friendly Learning
> *"My kid is learning Kana and needs encouraging, immediate feedback."*

Live stroke feedback gives a "game-like" feel. Web Speech API pronounces the character. Correction system adapts to a child's developing handwriting.

### 6. Accessibility / Motor Difficulty
> *"My hand shakes, so my strokes are wobbly. The app keeps misreading me."*

The user-correctable learning system is designed exactly for this. After 3–5 corrections, the app learns your wobbly style and matches it correctly.

---

## Technical Specs

| Spec | Value |
|------|-------|
| Dependencies | Zero (vanilla JS) |
| External APIs | Web Speech API (ja-JP) — optional |
| Storage | localStorage (~50KB max) |
| Canvas resolution | High-DPI aware (devicePixelRatio) |
| Touch support | Full, with scroll blocking |
| Offline capable | Yes, after first load |
| Bundle size | ~60KB total (HTML + JS + data) |

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Canvas 2D | ✅ | ✅ | ✅ | ✅ |
| Touch events | ✅ | ✅ | ✅ | ✅ |
| Web Speech API | ✅ | ✅ | ⚠️ partial | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| High-DPI canvas | ✅ | ✅ | ✅ | ✅ |

Safari note: Speech synthesis may require user interaction first (click "🔊" button).

---

## License

MIT — free to use, modify, and distribute. Attribution appreciated.

---

## Contributing

To add characters:
1. Fork the repo
2. Edit `data.js` — append new entries to `DATASET`
3. Test by drawing the character in the app
4. Adjust `refStrokes` if recognition is poor
5. Submit a PR with the character list

For engine improvements, edit `script.js`. Keep the feature matcher interface consistent:
- `computeXxxFeatures(resampledStrokes)` → returns feature data
- `matchXxxFeatures(userFeatures, refFeatures)` → returns similarity 0–1
- Add weight to `CONFIG.WEIGHT_XXX`
- Add bar to `displayResults()` feature grid

---

*Built with patience, vectors, and a lot of resampling.*
