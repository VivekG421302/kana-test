// ==================== KANA QUEST — LEARN MODE ====================
// A separate matching approach from script.js's shape-recognition engine.
// Here the target character is shown as a traceable guide, and the score is
// purely about how well the user's ink stays inside that guide:
//
//   - Ink inside the guide's tolerance band  -> increases coverage (good)
//   - Guide area left untouched              -> no effect either way
//   - Ink outside the guide's tolerance band -> penalized
//
// This is intentionally pixel/coverage-based rather than vector/feature-based
// (script.js's approach) since "did you stay inside the lines" is a coverage
// problem, not a shape-classification problem. The two systems don't share
// any matching code — only the character dataset (DATASET from data.js).

const LEARN_CONFIG = {
    TRACE_WIDTH_RATIO: 0.085,   // guide tolerance band width, as a fraction of canvas CSS size
    INK_WIDTH_RATIO: 0.045,     // user pen width, as a fraction of canvas CSS size
    ALPHA_THRESHOLD: 10,        // pixel alpha above this counts as "on"
    SUCCESS_THRESHOLD: 60,      // match % at/above this counts as a success
    MIN_STROKE_POINTS: 3,
    STORAGE_KEY: 'kana_learn_best_scores'
};

// ---- DOM references ----
const canvasWrapper = document.getElementById('canvasWrapper');
const traceCanvas = document.getElementById('traceCanvas');
const inkCanvas = document.getElementById('inkCanvas');
const traceCtx = traceCanvas.getContext('2d', { willReadFrequently: true });
const inkCtx = inkCanvas.getContext('2d', { willReadFrequently: true });

const charSelect = document.getElementById('charSelect');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const randomBtn = document.getElementById('randomBtn');
const charReadingEl = document.getElementById('charReading');
const charNameEl = document.getElementById('charName');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const checkBtn = document.getElementById('checkBtn');
const resultBanner = document.getElementById('resultBanner');

const statLast = document.getElementById('statLast');
const statBest = document.getElementById('statBest');
const statAttempts = document.getElementById('statAttempts');
const statSuccesses = document.getElementById('statSuccesses');

// ---- State ----
let dpr = window.devicePixelRatio || 1;
let lastCanvasWidth = 0;
let currentIndex = 0;
let currentEntry = null;

let allStrokes = [];      // committed ink strokes: [{x,y}, ...][]
let currentStroke = [];
let isDrawing = false;

let sessionAttempts = 0;
let sessionSuccesses = 0;

// ---- Persisted best-score-per-character (purely local, no server) ----
function loadBestScores() {
    try {
        const raw = localStorage.getItem(LEARN_CONFIG.STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}
function saveBestScore(char, score) {
    try {
        const scores = loadBestScores();
        if (!scores[char] || score > scores[char]) {
            scores[char] = score;
            localStorage.setItem(LEARN_CONFIG.STORAGE_KEY, JSON.stringify(scores));
        }
    } catch (e) { /* localStorage unavailable — best score just won't persist */ }
}
function getBestScore(char) {
    const scores = loadBestScores();
    return scores[char] !== undefined ? scores[char] : null;
}

// ==================== CHARACTER PICKER ====================

function buildCharSelect() {
    const groups = { hiragana: [], katakana: [], kanji: [] };
    DATASET.forEach((entry, idx) => {
        if (groups[entry.type]) groups[entry.type].push(idx);
    });

    const labels = { hiragana: 'Hiragana', katakana: 'Katakana', kanji: 'Kanji' };
    Object.keys(groups).forEach(type => {
        if (groups[type].length === 0) return;
        const optgroup = document.createElement('optgroup');
        optgroup.label = labels[type];
        groups[type].forEach(idx => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = `${DATASET[idx].char}  ${DATASET[idx].reading}`;
            optgroup.appendChild(opt);
        });
        charSelect.appendChild(optgroup);
    });
}

function selectCharacterByIndex(idx) {
    currentIndex = ((idx % DATASET.length) + DATASET.length) % DATASET.length;
    currentEntry = DATASET[currentIndex];
    charSelect.value = currentIndex;
    charReadingEl.textContent = currentEntry.reading;
    charNameEl.textContent = currentEntry.name;

    resetDrawing();
    drawTrace();
    updateStatsDisplay(null);
}

// ==================== CANVAS SETUP ====================

function initCanvases() {
    const rect = canvasWrapper.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;

    [traceCanvas, inkCanvas].forEach(c => {
        c.width = cssW * dpr;
        c.height = cssH * dpr;
        c.style.width = cssW + 'px';
        c.style.height = cssH + 'px';
    });

    traceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    inkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    inkCtx.lineCap = 'round';
    inkCtx.lineJoin = 'round';
    inkCtx.strokeStyle = '#16241f';
    inkCtx.lineWidth = cssW * LEARN_CONFIG.INK_WIDTH_RATIO;

    lastCanvasWidth = cssW;

    if (currentEntry) drawTrace();
    redrawInk();
}

// Mobile browsers fire 'resize' purely from the address bar hiding/showing
// while scrolling (viewport height changes, width doesn't) — only reinit on
// a genuine width change, or every scroll would wipe the user's drawing.
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newWidth = canvasWrapper.getBoundingClientRect().width;
        if (Math.abs(newWidth - lastCanvasWidth) < 2) return;
        initCanvases();
    }, 150);
});

// ==================== TRACE GUIDE ====================

function drawTrace() {
    const cssW = canvasWrapper.getBoundingClientRect().width;
    const cssH = canvasWrapper.getBoundingClientRect().height;
    traceCtx.clearRect(0, 0, cssW, cssH);

    if (!currentEntry) return;

    // data.js's refStrokes are authored in a 0–300 logical coordinate space;
    // scale them to fit whatever size this canvas actually renders at.
    const scale = Math.min(cssW, cssH) / 300;

    traceCtx.lineCap = 'round';
    traceCtx.lineJoin = 'round';
    traceCtx.strokeStyle = 'rgba(13,143,110,0.28)';
    traceCtx.lineWidth = cssW * LEARN_CONFIG.TRACE_WIDTH_RATIO;

    currentEntry.refStrokes.forEach(stroke => {
        if (!stroke || stroke.length < 2) return;
        traceCtx.beginPath();
        stroke.forEach((p, i) => {
            const x = p.x * scale;
            const y = p.y * scale;
            if (i === 0) traceCtx.moveTo(x, y);
            else traceCtx.lineTo(x, y);
        });
        traceCtx.stroke();
    });
}

// ==================== DRAWING (ink layer) ====================

function getPointerPos(e) {
    const rect = inkCanvas.getBoundingClientRect();
    let cx, cy;
    if (e.touches && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
    } else {
        cx = e.clientX;
        cy = e.clientY;
    }
    return { x: cx - rect.left, y: cy - rect.top };
}

function startStroke(e) {
    if (e.cancelable) e.preventDefault();
    isDrawing = true;
    const pos = getPointerPos(e);
    currentStroke = [pos];
    inkCtx.beginPath();
    inkCtx.moveTo(pos.x, pos.y);
    hideResultBanner();
}

function moveStroke(e) {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const pos = getPointerPos(e);
    currentStroke.push(pos);
    inkCtx.lineTo(pos.x, pos.y);
    inkCtx.stroke();
}

function endStroke(e) {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    isDrawing = false;
    if (currentStroke.length >= LEARN_CONFIG.MIN_STROKE_POINTS) {
        allStrokes.push([...currentStroke]);
    }
    currentStroke = [];
}

inkCanvas.addEventListener('mousedown', startStroke);
inkCanvas.addEventListener('mousemove', moveStroke);
inkCanvas.addEventListener('mouseup', endStroke);
inkCanvas.addEventListener('mouseleave', endStroke);

inkCanvas.addEventListener('touchstart', startStroke, { passive: false });
inkCanvas.addEventListener('touchmove', moveStroke, { passive: false });
inkCanvas.addEventListener('touchend', endStroke, { passive: false });
inkCanvas.addEventListener('touchcancel', endStroke, { passive: false });

function redrawInk() {
    const cssW = canvasWrapper.getBoundingClientRect().width;
    const cssH = canvasWrapper.getBoundingClientRect().height;
    inkCtx.clearRect(0, 0, cssW, cssH);
    inkCtx.lineWidth = cssW * LEARN_CONFIG.INK_WIDTH_RATIO;
    allStrokes.forEach(stroke => {
        if (stroke.length < 2) return;
        inkCtx.beginPath();
        stroke.forEach((p, i) => {
            if (i === 0) inkCtx.moveTo(p.x, p.y);
            else inkCtx.lineTo(p.x, p.y);
        });
        inkCtx.stroke();
    });
}

function resetDrawing() {
    allStrokes = [];
    currentStroke = [];
    isDrawing = false;
    redrawInk();
    hideResultBanner();
}

// ==================== MATCHING: pixel-coverage against the trace ====================
//
// Both traceCanvas and inkCanvas are the same physical size, so their pixel
// buffers line up 1:1 — no coordinate conversion needed at check time.
//
//   coverage%   = (trace pixels also inked) / (total trace pixels)
//   outsidePenalty = (inked pixels outside the trace) / (total trace pixels)
//   match% = clamp(coverage% - outsidePenalty, 0, 100)
//
// This directly implements the requested rule: leaving guide area untouched
// has no effect (it just doesn't count toward coverage), while ink outside
// the guide actively subtracts from the score.
function computeMatchPercent() {
    const w = traceCanvas.width, h = traceCanvas.height;
    const traceData = traceCtx.getImageData(0, 0, w, h).data;
    const inkData = inkCtx.getImageData(0, 0, w, h).data;

    let traceTotal = 0, covered = 0, outside = 0;
    const total = w * h;
    for (let i = 0; i < total; i++) {
        const a = i * 4 + 3;
        const traceOn = traceData[a] > LEARN_CONFIG.ALPHA_THRESHOLD;
        const inkOn = inkData[a] > LEARN_CONFIG.ALPHA_THRESHOLD;
        if (traceOn) {
            traceTotal++;
            if (inkOn) covered++;
        } else if (inkOn) {
            outside++;
        }
    }

    if (traceTotal === 0) return 0;
    const raw = (covered - outside) / traceTotal;
    return Math.max(0, Math.min(100, raw * 100));
}

// ==================== CONTROLS ====================

undoBtn.addEventListener('click', () => {
    allStrokes.pop();
    redrawInk();
    hideResultBanner();
});

clearBtn.addEventListener('click', () => {
    resetDrawing();
});

checkBtn.addEventListener('click', () => {
    if (allStrokes.length === 0) return;

    const score = computeMatchPercent();
    const rounded = Math.round(score);
    const success = rounded >= LEARN_CONFIG.SUCCESS_THRESHOLD;

    sessionAttempts++;
    if (success) sessionSuccesses++;
    if (currentEntry) saveBestScore(currentEntry.char, rounded);

    updateStatsDisplay(rounded);
    showResultBanner(success, rounded);
});

function showResultBanner(success, score) {
    resultBanner.textContent = success ? `Nice! ${score}% match` : `${score}% match — try again`;
    resultBanner.className = 'result-banner show ' + (success ? 'success' : 'fail');
}
function hideResultBanner() {
    resultBanner.className = 'result-banner';
}

function updateStatsDisplay(lastScore) {
    statLast.textContent = lastScore === null ? '–' : lastScore + '%';
    const best = currentEntry ? getBestScore(currentEntry.char) : null;
    statBest.textContent = best === null ? '–' : best + '%';
    statAttempts.textContent = sessionAttempts;
    statSuccesses.textContent = sessionSuccesses;
}

// ---- Navigation ----
charSelect.addEventListener('change', () => selectCharacterByIndex(parseInt(charSelect.value, 10)));
prevBtn.addEventListener('click', () => selectCharacterByIndex(currentIndex - 1));
nextBtn.addEventListener('click', () => selectCharacterByIndex(currentIndex + 1));
randomBtn.addEventListener('click', () => {
    let idx;
    do { idx = Math.floor(Math.random() * DATASET.length); } while (idx === currentIndex && DATASET.length > 1);
    selectCharacterByIndex(idx);
});

// ==================== INIT ====================

function init() {
    buildCharSelect();
    initCanvases();
    selectCharacterByIndex(0);
}

init();
