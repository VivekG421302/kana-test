/**
 * Kana Quest Learn — Hybrid Recognition Engine v4.0
 * Real-Time Vector Tracking & Multi-Feature Recognition Engine
 * 
 * Features:
 * 1. Real-Time Vector Capture — Time-series point recording
 * 2. Equidistant Point Resampling — Normalizes drawing speed
 * 3. Directional Substroke Vectors — 8-octant angular mapping
 * 4. Cyclic Angular Levenshtein Edit Distance
 * 5. Position Anchors — Start/end point spatial matching
 * 6. Grid Occupancy — 4×4 spatial cell matching
 * 7. Curvature Detection — Corner/loop classification
 * 8. Stroke Proportion Ratios — Length awareness
 * 9. Pixel Similarity Fallback — Visual overlap safety net
 * 10. Live Stroke Feedback — Real-time guess panel
 * 11. User-Correctable Learning — localStorage personalization
 * 
 * Zero dependencies. Client-side vanilla JavaScript.
 */

// ==================== CONFIG ====================
const CONFIG = {
    CANVAS_SIZE: 320,
    GRID_SIZE: 32,
    STROKE_WIDTH: 12,
    STROKE_COLOR: '#1a1a1a',
    BG_COLOR: '#ffffff',

    // Vector Engine Parameters
    RESAMPLE_POINTS: 10,
    DIRECTION_OCTANTS: 8,

    // Recognition Guards
    MIN_STROKE_POINTS: 5,
    MIN_BBOX_SIZE: 20,
    MIN_TOTAL_STROKES: 1,
    RECOGNITION_DEBOUNCE: 450,
    MATCH_THRESHOLD: 0.30,

    // Edit Distance Weights
    EDIT_SUB_COST: 1.0,
    EDIT_INS_COST: 1.2,
    EDIT_DEL_COST: 1.2,
    CYCLIC_TOLERANCE: 1,

    // Feature Weights (for final blended score)
    WEIGHT_DIRECTION: 0.30,
    WEIGHT_POSITION: 0.20,
    WEIGHT_GRID: 0.15,
    WEIGHT_CURVATURE: 0.10,
    WEIGHT_PROPORTION: 0.10,
    WEIGHT_PIXEL: 0.15,

    // Grid matching
    GRID_DIVISIONS: 4,  // 4x4 grid

    // Curvature thresholds (degrees)
    CURVE_STRAIGHT: 15,
    CURVE_GENTLE: 45,
    CURVE_SHARP: 90,

    // Pixel fallback
    PIXEL_GRID_SIZE: 32,
    PIXEL_SIMILARITY_THRESHOLD: 0.15,

    // Learning
    LEARNED_STORAGE_KEY: 'kana_learned_references',
    LEARNED_WEIGHT: 0.3,  // How much user corrections influence score

    // Soft blur for debug matrix
    SOFT_BLUR: true,
    MARGIN_CELLS: 2
};

// ==================== DOM REFERENCES ====================
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const canvasWrapper = document.getElementById('canvasWrapper');
const resetBtn = document.getElementById('resetBtn');
const checkBtn = document.getElementById('checkBtn');
const resultPlaceholder = document.getElementById('resultPlaceholder');
const topMatch = document.getElementById('topMatch');
const statsList = document.getElementById('statsList');
const debugCanvas = document.getElementById('debugCanvas');
const debugCtx = debugCanvas.getContext('2d');
const debugMatchCanvas = document.getElementById('debugMatchCanvas');
const debugMatchCtx = debugMatchCanvas.getContext('2d');
const listeningBadge = document.getElementById('listeningBadge');
const strokeMeta = document.getElementById('strokeMeta');
const modeToggle = document.getElementById('modeToggle');
const modeAutoBtn = document.getElementById('modeAuto');
const modeManualBtn = document.getElementById('modeManual');
const liveFeedback = document.getElementById('liveFeedback');
const liveGuessList = document.getElementById('liveGuessList');
const correctionBar = document.getElementById('correctionBar');
const correctionGrid = document.getElementById('correctionGrid');
const featureGrid = document.getElementById('featureGrid');

// Vector debug canvases
const vectorUserCanvas = document.getElementById('vectorUserCanvas');
const vectorUserCtx = vectorUserCanvas.getContext('2d');
const vectorRefCanvas = document.getElementById('vectorRefCanvas');
const vectorRefCtx = vectorRefCanvas.getContext('2d');
const vectorCompareCanvas = document.getElementById('vectorCompareCanvas');
const vectorCompareCtx = vectorCompareCanvas.getContext('2d');

// Position anchor canvas
const positionCanvas = document.getElementById('positionCanvas');
const positionCtx = positionCanvas.getContext('2d');

// Curvature canvas
const curvatureCanvas = document.getElementById('curvatureCanvas');
const curvatureCtx = curvatureCanvas.getContext('2d');

// Pixel canvases
const pixelUserCanvas = document.getElementById('pixelUserCanvas');
const pixelUserCtx = pixelUserCanvas.getContext('2d');
const pixelMatchCanvas = document.getElementById('pixelMatchCanvas');
const pixelMatchCtx = pixelMatchCanvas.getContext('2d');
const pixelOverlapCanvas = document.getElementById('pixelOverlapCanvas');
const pixelOverlapCtx = pixelOverlapCanvas.getContext('2d');

// ==================== STATE ====================
let isDrawing = false;
let currentStroke = [];
let allStrokes = [];
let dpr = window.devicePixelRatio || 1;
let recognitionTimer = null;
let currentMode = 'auto';
let lastResults = [];  // Store last results for correction
let learnedReferences = loadLearnedReferences();

// ==================== DIRECTION COLORS ====================
const DIRECTION_COLORS = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
    '#3498db', '#9b59b6', '#1abc9c', '#34495e'
];

const DIRECTION_NAMES = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'];

// ==================== USER LEARNING: localStorage ====================

function loadLearnedReferences() {
    try {
        const stored = localStorage.getItem(CONFIG.LEARNED_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
}

function saveLearnedReferences() {
    try {
        localStorage.setItem(CONFIG.LEARNED_STORAGE_KEY, JSON.stringify(learnedReferences));
    } catch (e) {
        console.warn('Could not save learned references:', e);
    }
}

function recordUserCorrection(char, userStrokes, userVectors, userFeatures) {
    // Store the user's stroke pattern for this character
    if (!learnedReferences[char]) {
        learnedReferences[char] = [];
    }

    learnedReferences[char].push({
        timestamp: Date.now(),
        strokes: userStrokes.map(s => s.map(p => ({x: p.x, y: p.y}))),
        vectors: userVectors,
        features: userFeatures,
        count: 1
    });

    // Keep only last 5 samples per character to prevent bloat
    if (learnedReferences[char].length > 5) {
        learnedReferences[char].shift();
    }

    saveLearnedReferences();
}

function getLearnedBoost(char, userFeatures) {
    const samples = learnedReferences[char];
    if (!samples || samples.length === 0) return 0;

    // Compare user features against learned samples
    let bestSim = 0;
    samples.forEach(sample => {
        const sim = compareFeatures(userFeatures, sample.features);
        if (sim > bestSim) bestSim = sim;
    });

    // Return boost proportional to similarity (0 to LEARNED_WEIGHT)
    return bestSim * CONFIG.LEARNED_WEIGHT;
}

// ==================== PRECOMPUTED REFERENCE DATA ====================

const REFERENCE_DATA = new Map();

function precomputeReferenceData() {
    DATASET.forEach(entry => {
        const resampled = entry.refStrokes.map(s => resampleStroke(s, CONFIG.RESAMPLE_POINTS));
        const vectors = resampled.map(pointsToDirectionVectors);
        const positions = computePositionAnchors(resampled);
        const grid = computeGridOccupancy(resampled);
        const curvature = computeCurvatureSignatures(resampled);
        const proportions = computeStrokeProportions(resampled);
        const matrix = generateReferenceMatrixFromStrokes(entry.refStrokes);

        REFERENCE_DATA.set(entry.char, {
            ...entry,
            resampled,
            vectors,
            positions,
            grid,
            curvature,
            proportions,
            matrix
        });
    });
}

// ==================== VECTOR MATH: RESAMPLING ====================

function strokeLength(points) {
    let len = 0;
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        len += Math.sqrt(dx*dx + dy*dy);
    }
    return len;
}

function resampleStroke(points, n) {
    if (points.length < 2) return points;
    if (points.length === n) return [...points];

    const totalLen = strokeLength(points);
    if (totalLen < 0.001) return points.slice(0, n);

    const interval = totalLen / (n - 1);
    const resampled = [points[0]];
    let currentDist = 0;
    let nextTarget = interval;
    let pointIdx = 1;

    while (resampled.length < n && pointIdx < points.length) {
        const p0 = points[pointIdx - 1];
        const p1 = points[pointIdx];
        const segDx = p1.x - p0.x;
        const segDy = p1.y - p0.y;
        const segLen = Math.sqrt(segDx*segDx + segDy*segDy);

        if (segLen < 0.001) { pointIdx++; continue; }

        while (currentDist + segLen >= nextTarget && resampled.length < n) {
            const remaining = nextTarget - currentDist;
            const ratio = remaining / segLen;
            resampled.push({
                x: p0.x + segDx * ratio,
                y: p0.y + segDy * ratio
            });
            nextTarget += interval;
        }
        currentDist += segLen;
        pointIdx++;
    }

    while (resampled.length < n) resampled.push({...points[points.length - 1]});
    if (resampled.length > n) resampled.length = n;

    return resampled;
}

function pointsToDirectionVectors(points) {
    const vectors = [];
    for (let i = 1; i < points.length; i++) {
        vectors.push(directionFromDelta(
            points[i].x - points[i-1].x,
            points[i].y - points[i-1].y
        ));
    }
    return vectors;
}

function directionFromDelta(dx, dy) {
    const angle = Math.atan2(dy, dx);
    const normalized = angle < 0 ? angle + Math.PI * 2 : angle;
    return Math.round((normalized / (Math.PI * 2)) * 8) % 8;
}

function cyclicDirectionDistance(d1, d2) {
    const diff = Math.abs(d1 - d2);
    return Math.min(diff, 8 - diff);
}

// ==================== FEATURE 1: POSITION ANCHORS ====================

/**
 * Compute normalized start/end positions for each stroke
 * Returns array of {start: {x,y}, end: {x,y}} in 0-1 range
 */
function computePositionAnchors(resampledStrokes) {
    // Get bounding box of all strokes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    resampledStrokes.forEach(stroke => {
        stroke.forEach(p => {
            minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
        });
    });

    const w = maxX - minX || 1;
    const h = maxY - minY || 1;

    return resampledStrokes.map(stroke => ({
        start: {
            x: (stroke[0].x - minX) / w,
            y: (stroke[0].y - minY) / h
        },
        end: {
            x: (stroke[stroke.length - 1].x - minX) / w,
            y: (stroke[stroke.length - 1].y - minY) / h
        }
    }));
}

function matchPositionAnchors(userAnchors, refAnchors) {
    if (userAnchors.length === 0 || refAnchors.length === 0) return 0;

    const usedRef = new Set();
    let totalSim = 0;
    let matched = 0;

    for (let i = 0; i < userAnchors.length; i++) {
        let bestSim = -1;
        let bestJ = -1;

        for (let j = 0; j < refAnchors.length; j++) {
            if (usedRef.has(j)) continue;
            const dx = userAnchors[i].start.x - refAnchors[j].start.x;
            const dy = userAnchors[i].start.y - refAnchors[j].start.y;
            const ex = userAnchors[i].end.x - refAnchors[j].end.x;
            const ey = userAnchors[i].end.y - refAnchors[j].end.y;

            const startDist = Math.sqrt(dx*dx + dy*dy);
            const endDist = Math.sqrt(ex*ex + ey*ey);
            const sim = 1 - Math.min(1, (startDist + endDist) / 2);

            if (sim > bestSim) { bestSim = sim; bestJ = j; }
        }

        if (bestJ >= 0 && bestSim > 0.1) {
            usedRef.add(bestJ);
            totalSim += bestSim;
            matched++;
        }
    }

    const coverage = refAnchors.length > 0 ? matched / refAnchors.length : 0;
    return matched > 0 ? (totalSim / matched) * (0.7 + 0.3 * coverage) : 0;
}

// ==================== FEATURE 2: GRID OCCUPANCY ====================

/**
 * Compute which cells of a 4×4 grid each stroke occupies
 */
function computeGridOccupancy(resampledStrokes) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    resampledStrokes.forEach(stroke => {
        stroke.forEach(p => {
            minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
        });
    });

    const w = maxX - minX || 1;
    const h = maxY - minY || 1;
    const divs = CONFIG.GRID_DIVISIONS;

    return resampledStrokes.map(stroke => {
        const cells = new Set();
        stroke.forEach(p => {
            const gx = Math.min(divs - 1, Math.floor(((p.x - minX) / w) * divs));
            const gy = Math.min(divs - 1, Math.floor(((p.y - minY) / h) * divs));
            cells.add(`${gx},${gy}`);
        });
        return Array.from(cells);
    });
}

function matchGridOccupancy(userGrids, refGrids) {
    if (userGrids.length === 0 || refGrids.length === 0) return 0;

    const usedRef = new Set();
    let totalSim = 0;
    let matched = 0;

    for (let i = 0; i < userGrids.length; i++) {
        let bestSim = -1;
        let bestJ = -1;

        for (let j = 0; j < refGrids.length; j++) {
            if (usedRef.has(j)) continue;
            const intersection = userGrids[i].filter(c => refGrids[j].includes(c));
            const union = [...new Set([...userGrids[i], ...refGrids[j]])];
            const sim = union.length > 0 ? intersection.length / union.length : 0;

            if (sim > bestSim) { bestSim = sim; bestJ = j; }
        }

        if (bestJ >= 0 && bestSim > 0.05) {
            usedRef.add(bestJ);
            totalSim += bestSim;
            matched++;
        }
    }

    const coverage = refGrids.length > 0 ? matched / refGrids.length : 0;
    return matched > 0 ? (totalSim / matched) * (0.7 + 0.3 * coverage) : 0;
}

// ==================== FEATURE 3: CURVATURE DETECTION ====================

/**
 * Classify curvature at each point: 0=straight, 1=gentle, 2=sharp, 3=loop
 */
function computeCurvatureSignatures(resampledStrokes) {
    return resampledStrokes.map(stroke => {
        const sig = [];
        for (let i = 1; i < stroke.length - 1; i++) {
            const dx1 = stroke[i].x - stroke[i-1].x;
            const dy1 = stroke[i].y - stroke[i-1].y;
            const dx2 = stroke[i+1].x - stroke[i].x;
            const dy2 = stroke[i+1].y - stroke[i].y;

            const angle1 = Math.atan2(dy1, dx1);
            const angle2 = Math.atan2(dy2, dx2);
            let diff = Math.abs(angle2 - angle1) * (180 / Math.PI);
            if (diff > 180) diff = 360 - diff;

            if (diff < CONFIG.CURVE_STRAIGHT) sig.push(0);
            else if (diff < CONFIG.CURVE_GENTLE) sig.push(1);
            else if (diff < CONFIG.CURVE_SHARP) sig.push(2);
            else sig.push(3);
        }
        return sig;
    });
}

function matchCurvatureSignatures(userCurv, refCurv) {
    if (userCurv.length === 0 || refCurv.length === 0) return 0;

    const usedRef = new Set();
    let totalSim = 0;
    let matched = 0;

    for (let i = 0; i < userCurv.length; i++) {
        let bestSim = -1;
        let bestJ = -1;

        for (let j = 0; j < refCurv.length; j++) {
            if (usedRef.has(j)) continue;
            const minLen = Math.min(userCurv[i].length, refCurv[j].length);
            if (minLen === 0) continue;

            let matches = 0;
            for (let k = 0; k < minLen; k++) {
                const diff = Math.abs(userCurv[i][k] - refCurv[j][k]);
                if (diff <= 1) matches++;
            }
            const sim = matches / Math.max(userCurv[i].length, refCurv[j].length);

            if (sim > bestSim) { bestSim = sim; bestJ = j; }
        }

        if (bestJ >= 0 && bestSim > 0.1) {
            usedRef.add(bestJ);
            totalSim += bestSim;
            matched++;
        }
    }

    return matched > 0 ? totalSim / matched : 0;
}

// ==================== FEATURE 4: STROKE PROPORTIONS ====================

function computeStrokeProportions(resampledStrokes) {
    const lengths = resampledStrokes.map(s => strokeLength(s));
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    return lengths.map(l => l / total);
}

function matchStrokeProportions(userProps, refProps) {
    if (userProps.length === 0 || refProps.length === 0) return 0;

    const usedRef = new Set();
    let totalSim = 0;
    let matched = 0;

    for (let i = 0; i < userProps.length; i++) {
        let bestSim = -1;
        let bestJ = -1;

        for (let j = 0; j < refProps.length; j++) {
            if (usedRef.has(j)) continue;
            const sim = 1 - Math.abs(userProps[i] - refProps[j]);
            if (sim > bestSim) { bestSim = sim; bestJ = j; }
        }

        if (bestJ >= 0 && bestSim > 0.1) {
            usedRef.add(bestJ);
            totalSim += bestSim;
            matched++;
        }
    }

    return matched > 0 ? totalSim / matched : 0;
}

// ==================== FEATURE 5: PIXEL SIMILARITY ====================

function computePixelMatrix(strokes, bbox) {
    const size = CONFIG.PIXEL_GRID_SIZE;
    const matrix = new Float32Array(size * size).fill(0);

    const margin = 2;
    const avail = size - margin * 2;
    const scale = Math.min(avail / bbox.width, avail / bbox.height);
    const scaledW = bbox.width * scale;
    const scaledH = bbox.height * scale;
    const offX = margin + (avail - scaledW) / 2;
    const offY = margin + (avail - scaledH) / 2;

    strokes.forEach(stroke => {
        for (let i = 1; i < stroke.length; i++) {
            const p1 = stroke[i-1];
            const p2 = stroke[i];
            const gx1 = (p1.x - bbox.minX) * scale + offX;
            const gy1 = (p1.y - bbox.minY) * scale + offY;
            const gx2 = (p2.x - bbox.minX) * scale + offX;
            const gy2 = (p2.y - bbox.minY) * scale + offY;

            const dx = Math.abs(gx2 - gx1);
            const dy = Math.abs(gy2 - gy1);
            const steps = Math.max(dx, dy) * 2 + 1;

            for (let s = 0; s <= steps; s++) {
                const t = steps === 0 ? 0 : s / steps;
                const x = gx1 + (gx2 - gx1) * t;
                const y = gy1 + (gy2 - gy1) * t;
                const gx = Math.round(x);
                const gy = Math.round(y);
                if (gx >= 0 && gx < size && gy >= 0 && gy < size) {
                    matrix[gy * size + gx] = 1;
                }
            }
        }
    });

    return matrix;
}

function computePixelSimilarity(userMatrix, refMatrix) {
    let intersection = 0;
    let union = 0;

    for (let i = 0; i < userMatrix.length; i++) {
        if (userMatrix[i] > 0 && refMatrix[i] > 0) intersection++;
        if (userMatrix[i] > 0 || refMatrix[i] > 0) union++;
    }

    return union > 0 ? intersection / union : 0;
}

// ==================== EDIT DISTANCE: CYCLIC ANGULAR ====================

function cyclicAngularEditDistance(vecA, vecB) {
    const m = vecA.length;
    const n = vecB.length;
    if (m === 0) return n * CONFIG.EDIT_INS_COST;
    if (n === 0) return m * CONFIG.EDIT_DEL_COST;

    let prev = new Float64Array(n + 1);
    let curr = new Float64Array(n + 1);

    for (let j = 0; j <= n; j++) prev[j] = j * CONFIG.EDIT_INS_COST;

    for (let i = 1; i <= m; i++) {
        curr[0] = i * CONFIG.EDIT_DEL_COST;
        for (let j = 1; j <= n; j++) {
            const dirDist = cyclicDirectionDistance(vecA[i-1], vecB[j-1]);
            let subCost;
            if (dirDist === 0) subCost = 0;
            else if (dirDist <= CONFIG.CYCLIC_TOLERANCE) subCost = 0.5;
            else subCost = CONFIG.EDIT_SUB_COST;

            curr[j] = Math.min(
                prev[j] + CONFIG.EDIT_DEL_COST,
                curr[j-1] + CONFIG.EDIT_INS_COST,
                prev[j-1] + subCost
            );
        }
        [prev, curr] = [curr, prev];
    }

    return prev[n];
}

function editDistanceToSimilarity(distance, maxLen) {
    if (maxLen === 0) return 0;
    return Math.max(0, Math.exp(-(distance / maxLen) * 1.5));
}

// ==================== STROKE-LEVEL DIRECTION MATCHING ====================

function matchDirectionVectors(userVectors, refVectors) {
    if (userVectors.length === 0 || refVectors.length === 0) return { score: 0, perStroke: [] };

    const distMatrix = [];
    for (let i = 0; i < userVectors.length; i++) {
        distMatrix[i] = [];
        for (let j = 0; j < refVectors.length; j++) {
            const maxLen = Math.max(userVectors[i].length, refVectors[j].length);
            const dist = cyclicAngularEditDistance(userVectors[i], refVectors[j]);
            const sim = editDistanceToSimilarity(dist, maxLen);
            distMatrix[i][j] = { distance: dist, similarity: sim, maxLen };
        }
    }

    const usedRef = new Set();
    const perStroke = [];
    let totalSim = 0;
    let matched = 0;

    for (let i = 0; i < userVectors.length; i++) {
        let bestSim = -1, bestJ = -1;
        for (let j = 0; j < refVectors.length; j++) {
            if (usedRef.has(j)) continue;
            if (distMatrix[i][j].similarity > bestSim) {
                bestSim = distMatrix[i][j].similarity;
                bestJ = j;
            }
        }

        if (bestJ >= 0 && bestSim > 0.1) {
            usedRef.add(bestJ);
            totalSim += bestSim;
            matched++;
            perStroke.push({
                userStroke: i,
                refStroke: bestJ,
                similarity: bestSim,
                distance: distMatrix[i][bestJ].distance,
                userVec: userVectors[i],
                refVec: refVectors[bestJ]
            });
        }
    }

    const strokeDiffPenalty = Math.abs(userVectors.length - refVectors.length) * 0.08;
    const coveragePenalty = (refVectors.length - matched) * 0.05;

    let score = 0;
    if (matched > 0) {
        score = (totalSim / matched) - strokeDiffPenalty - coveragePenalty;
    }
    return { score: Math.max(0, Math.min(1, score)), perStroke };
}

// ==================== FEATURE COMPARISON HELPERS ====================

function compareFeatures(featA, featB) {
    if (!featA || !featB) return 0;
    let sim = 0;
    sim += (1 - Math.abs(featA.direction - featB.direction)) * CONFIG.WEIGHT_DIRECTION;
    sim += (1 - Math.abs(featA.position - featB.position)) * CONFIG.WEIGHT_POSITION;
    sim += (1 - Math.abs(featA.grid - featB.grid)) * CONFIG.WEIGHT_GRID;
    sim += (1 - Math.abs(featA.curvature - featB.curvature)) * CONFIG.WEIGHT_CURVATURE;
    sim += (1 - Math.abs(featA.proportion - featB.proportion)) * CONFIG.WEIGHT_PROPORTION;
    sim += (1 - Math.abs(featA.pixel - featB.pixel)) * CONFIG.WEIGHT_PIXEL;
    return Math.max(0, sim);
}

// ==================== MATRIX GENERATION (for debug) ====================

function generateReferenceMatrixFromStrokes(strokes) {
    const size = CONFIG.GRID_SIZE;
    const matrix = new Float32Array(size * size).fill(0);

    strokes.forEach(stroke => {
        for (let i = 1; i < stroke.length; i++) {
            const scale = size / 300;
            rasterizeLine(matrix, size,
                stroke[i-1].x * scale, stroke[i-1].y * scale,
                stroke[i].x * scale, stroke[i].y * scale
            );
        }
    });

    return CONFIG.SOFT_BLUR ? applySoftBlur(matrix, size) : matrix;
}

function rasterizeLine(matrix, size, x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const steps = Math.max(dx, dy) * 2 + 1;

    for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const gx = Math.round(x + dx);
                const gy = Math.round(y + dy);
                if (gx >= 0 && gx < size && gy >= 0 && gy < size) {
                    const weight = (Math.abs(dx) + Math.abs(dy) === 0) ? 1.0 : 0.5;
                    matrix[gy * size + gx] = Math.max(matrix[gy * size + gx], weight);
                }
            }
        }
    }
}

function applySoftBlur(matrix, size) {
    const result = new Float32Array(matrix);
    const temp = new Float32Array(matrix);

    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            let sum = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    sum += temp[(y + dy) * size + (x + dx)];
                }
            }
            result[y * size + x] = sum / 9;
        }
    }
    return result;
}

// ==================== CANVAS SETUP ====================

function initCanvas() {
    const rect = canvasWrapper.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;

    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = CONFIG.STROKE_COLOR;
    ctx.lineWidth = CONFIG.STROKE_WIDTH;
    ctx.fillStyle = CONFIG.BG_COLOR;
    ctx.fillRect(0, 0, cssW, cssH);
}

function clearCanvas() {
    const rect = canvasWrapper.getBoundingClientRect();
    ctx.fillStyle = CONFIG.BG_COLOR;
    ctx.fillRect(0, 0, rect.width, rect.height);

    isDrawing = false;
    currentStroke = [];
    allStrokes = [];
    cancelRecognition();

    resetResults();
    clearDebugGrid();
    clearVectorDebug();
    clearPositionDebug();
    clearCurvatureDebug();
    clearPixelDebug();
    hideLiveFeedback();
}

function resetResults() {
    resultPlaceholder.style.display = 'block';
    topMatch.classList.remove('active');
    statsList.innerHTML = '';
    strokeMeta.textContent = '';
    listeningBadge.style.opacity = '0';
    correctionBar.classList.remove('active');
    featureGrid.innerHTML = '';
}

function clearDebugGrid() {
    debugCtx.fillStyle = '#f0f0f0';
    debugCtx.fillRect(0, 0, 128, 128);
    debugMatchCtx.fillStyle = '#f0f0f0';
    debugMatchCtx.fillRect(0, 0, 128, 128);
}

function clearVectorDebug() {
    [vectorUserCtx, vectorRefCtx, vectorCompareCtx].forEach(c => {
        c.fillStyle = '#f8f8f8';
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    });
}

function clearPositionDebug() {
    positionCtx.fillStyle = '#f8f8f8';
    positionCtx.fillRect(0, 0, positionCanvas.width, positionCanvas.height);
}

function clearCurvatureDebug() {
    curvatureCtx.fillStyle = '#f8f8f8';
    curvatureCtx.fillRect(0, 0, curvatureCanvas.width, curvatureCanvas.height);
}

function clearPixelDebug() {
    [pixelUserCtx, pixelMatchCtx, pixelOverlapCtx].forEach(c => {
        c.fillStyle = '#f8f8f8';
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    });
}

function hideLiveFeedback() {
    liveFeedback.classList.remove('active');
}

// ==================== COORDINATE HELPERS ====================

function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    let cx, cy;

    if (e.touches && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
    } else {
        cx = e.clientX;
        cy = e.clientY;
    }

    return { x: cx - rect.left, y: cy - rect.top, t: performance.now() };
}

// ==================== DRAWING HANDLERS ====================

function startStroke(e) {
    if (e.cancelable) e.preventDefault();
    isDrawing = true;
    cancelRecognition();

    const pos = getPointerPos(e);
    currentStroke = [pos];

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function moveStroke(e) {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const pos = getPointerPos(e);
    currentStroke.push(pos);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function endStroke(e) {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    isDrawing = false;

    if (currentStroke.length >= CONFIG.MIN_STROKE_POINTS) {
        allStrokes.push([...currentStroke]);
    }

    currentStroke = [];

    // Live feedback after each stroke
    if (allStrokes.length >= CONFIG.MIN_TOTAL_STROKES) {
        updateLiveFeedback();
        if (currentMode === 'auto') {
            scheduleRecognition();
        }
    }
}

// ==================== LIVE STROKE FEEDBACK ====================

function updateLiveFeedback() {
    const bbox = computeBoundingBox(allStrokes);
    if (!bbox || bbox.width < CONFIG.MIN_BBOX_SIZE || bbox.height < CONFIG.MIN_BBOX_SIZE) return;

    const userResampled = allStrokes.map(s => resampleStroke(s, CONFIG.RESAMPLE_POINTS));
    const userVectors = userResampled.map(pointsToDirectionVectors);
    const userAnchors = computePositionAnchors(userResampled);
    const userGrids = computeGridOccupancy(userResampled);
    const userCurv = computeCurvatureSignatures(userResampled);
    const userProps = computeStrokeProportions(userResampled);
    const userPixel = computePixelMatrix(allStrokes, bbox);

    const guesses = [];

    REFERENCE_DATA.forEach((refEntry, char) => {
        const dirMatch = matchDirectionVectors(userVectors, refEntry.vectors);
        const posMatch = matchPositionAnchors(userAnchors, refEntry.positions);
        const gridMatch = matchGridOccupancy(userGrids, refEntry.grid);
        const curvMatch = matchCurvatureSignatures(userCurv, refEntry.curvature);
        const propMatch = matchStrokeProportions(userProps, refEntry.proportions);
        const pixMatch = computePixelSimilarity(userPixel, refEntry.matrix);

        const blended = 
            dirMatch.score * CONFIG.WEIGHT_DIRECTION +
            posMatch * CONFIG.WEIGHT_POSITION +
            gridMatch * CONFIG.WEIGHT_GRID +
            curvMatch * CONFIG.WEIGHT_CURVATURE +
            propMatch * CONFIG.WEIGHT_PROPORTION +
            pixMatch * CONFIG.WEIGHT_PIXEL;

        guesses.push({ char, name: refEntry.name, score: blended });
    });

    guesses.sort((a, b) => b.score - a.score);

    // Update live feedback overlay
    liveGuessList.innerHTML = '';
    guesses.slice(0, 3).forEach(g => {
        const pct = Math.round(g.score * 100);
        const item = document.createElement('div');
        item.className = 'live-guess-item';
        item.innerHTML = `
            <span class="live-guess-char">${g.char}</span>
            <div class="live-guess-bar"><div class="live-guess-bar-fill" style="width:${pct}%"></div></div>
            <span class="live-guess-pct">${pct}%</span>
        `;
        liveGuessList.appendChild(item);
    });

    liveFeedback.classList.add('active');
}

// ==================== MODE TOGGLE ====================

function setMode(mode) {
    currentMode = mode;

    if (mode === 'auto') {
        modeAutoBtn.classList.add('active');
        modeManualBtn.classList.remove('active');
        checkBtn.classList.add('hidden');
        if (allStrokes.length >= CONFIG.MIN_TOTAL_STROKES) {
            scheduleRecognition();
        }
    } else {
        modeManualBtn.classList.add('active');
        modeAutoBtn.classList.remove('active');
        checkBtn.classList.remove('hidden');
        cancelRecognition();
    }
}

modeAutoBtn.addEventListener('click', () => setMode('auto'));
modeManualBtn.addEventListener('click', () => setMode('manual'));

checkBtn.addEventListener('click', () => {
    if (allStrokes.length >= CONFIG.MIN_TOTAL_STROKES) {
        runRecognition();
    }
});

// ==================== DEBOUNCED RECOGNITION ====================

function scheduleRecognition() {
    if (currentMode !== 'auto') return;
    cancelRecognition();
    listeningBadge.style.opacity = '1';

    recognitionTimer = setTimeout(() => {
        runRecognition();
        listeningBadge.style.opacity = '0';
    }, CONFIG.RECOGNITION_DEBOUNCE);
}

function cancelRecognition() {
    if (recognitionTimer) {
        clearTimeout(recognitionTimer);
        recognitionTimer = null;
    }
    listeningBadge.style.opacity = '0';
}

// ==================== RECOGNITION PIPELINE ====================

function runRecognition() {
    if (allStrokes.length === 0) {
        resetResults();
        return;
    }

    const bbox = computeBoundingBox(allStrokes);
    if (!bbox || bbox.width < CONFIG.MIN_BBOX_SIZE || bbox.height < CONFIG.MIN_BBOX_SIZE) {
        resetResults();
        return;
    }

    // Step 1: Resample and compute all features
    const userResampled = allStrokes.map(s => resampleStroke(s, CONFIG.RESAMPLE_POINTS));
    const userVectors = userResampled.map(pointsToDirectionVectors);
    const userAnchors = computePositionAnchors(userResampled);
    const userGrids = computeGridOccupancy(userResampled);
    const userCurv = computeCurvatureSignatures(userResampled);
    const userProps = computeStrokeProportions(userResampled);
    const userPixel = computePixelMatrix(allStrokes, bbox);

    // Step 2: Debug matrix visualization
    const inputMatrix = normalizeToMatrix(allStrokes, bbox);
    renderDebugGrid(inputMatrix, debugCtx);
    renderDebugGrid(null, debugMatchCtx);

    // Step 3: Match against dataset with all features
    const results = matchAgainstDataset({
        userVectors, userAnchors, userGrids, userCurv, userProps, userPixel,
        userStrokeCount: allStrokes.length
    });

    // Step 4: Display
    if (results.length > 0 && results[0].score > CONFIG.MATCH_THRESHOLD) {
        displayResults(results, allStrokes.length, {
            userVectors, userAnchors, userGrids, userCurv, userProps, userPixel
        });
    } else {
        displayNoMatch();
    }
}

function computeBoundingBox(strokes) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    strokes.forEach(stroke => {
        stroke.forEach(pt => {
            minX = Math.min(minX, pt.x); minY = Math.min(minY, pt.y);
            maxX = Math.max(maxX, pt.x); maxY = Math.max(maxY, pt.y);
        });
    });

    const padding = CONFIG.STROKE_WIDTH;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width / dpr, maxX + padding);
    maxY = Math.min(canvas.height / dpr, maxY + padding);

    const w = maxX - minX, h = maxY - minY;
    if (w < 5 || h < 5) return null;

    return { minX, minY, width: w, height: h, maxX, maxY };
}

function normalizeToMatrix(strokes, bbox) {
    const size = CONFIG.GRID_SIZE;
    const matrix = new Float32Array(size * size).fill(0);

    const margin = CONFIG.MARGIN_CELLS;
    const avail = size - margin * 2;
    const scale = Math.min(avail / bbox.width, avail / bbox.height);
    const scaledW = bbox.width * scale;
    const scaledH = bbox.height * scale;
    const offX = margin + (avail - scaledW) / 2;
    const offY = margin + (avail - scaledH) / 2;

    strokes.forEach(stroke => {
        for (let i = 1; i < stroke.length; i++) {
            const p1 = stroke[i-1], p2 = stroke[i];
            const gx1 = (p1.x - bbox.minX) * scale + offX;
            const gy1 = (p1.y - bbox.minY) * scale + offY;
            const gx2 = (p2.x - bbox.minX) * scale + offX;
            const gy2 = (p2.y - bbox.minY) * scale + offY;
            rasterizeLine(matrix, size, gx1, gy1, gx2, gy2);
        }
    });

    return CONFIG.SOFT_BLUR ? applySoftBlur(matrix, size) : matrix;
}

// ==================== FULL DATASET MATCHING ====================

function matchAgainstDataset(features) {
    const results = [];

    REFERENCE_DATA.forEach((refEntry, char) => {
        const dirMatch = matchDirectionVectors(features.userVectors, refEntry.vectors);
        const posMatch = matchPositionAnchors(features.userAnchors, refEntry.positions);
        const gridMatch = matchGridOccupancy(features.userGrids, refEntry.grid);
        const curvMatch = matchCurvatureSignatures(features.userCurv, refEntry.curvature);
        const propMatch = matchStrokeProportions(features.userProps, refEntry.proportions);
        const pixMatch = computePixelSimilarity(features.userPixel, refEntry.matrix);

        // Base blended score
        let blended = 
            dirMatch.score * CONFIG.WEIGHT_DIRECTION +
            posMatch * CONFIG.WEIGHT_POSITION +
            gridMatch * CONFIG.WEIGHT_GRID +
            curvMatch * CONFIG.WEIGHT_CURVATURE +
            propMatch * CONFIG.WEIGHT_PROPORTION +
            pixMatch * CONFIG.WEIGHT_PIXEL;

        // Apply learned user boost
        const userFeatures = { direction: dirMatch.score, position: posMatch, 
                               grid: gridMatch, curvature: curvMatch, 
                               proportion: propMatch, pixel: pixMatch };
        const learnedBoost = getLearnedBoost(char, userFeatures);
        blended = Math.min(1, blended + learnedBoost);

        results.push({
            char: refEntry.char,
            name: refEntry.name,
            reading: refEntry.reading,
            type: refEntry.type,
            expectedStrokes: refEntry.expectedStrokes,
            userStrokeCount: features.userStrokeCount,
            score: blended,
            featureScores: {
                direction: dirMatch.score,
                position: posMatch,
                grid: gridMatch,
                curvature: curvMatch,
                proportion: propMatch,
                pixel: pixMatch,
                learned: learnedBoost
            },
            perStrokeScores: dirMatch.perStroke,
            matrix: refEntry.matrix,
            refVectors: refEntry.vectors,
            refPositions: refEntry.positions,
            userFeatures
        });
    });

    results.sort((a, b) => b.score - a.score);
    lastResults = results;
    return results;
}

// ==================== VISUAL DEBUG: POSITION ANCHORS ====================

function renderPositionAnchors(userAnchors, refAnchors, bestMatch) {
    const w = positionCanvas.width;
    const h = positionCanvas.height;
    positionCtx.fillStyle = '#f8f8f8';
    positionCtx.fillRect(0, 0, w, h);

    // Draw grid
    positionCtx.strokeStyle = '#e0e0e0';
    positionCtx.lineWidth = 0.5;
    for (let i = 0; i <= CONFIG.GRID_DIVISIONS; i++) {
        const x = (i / CONFIG.GRID_DIVISIONS) * w;
        positionCtx.beginPath();
        positionCtx.moveTo(x, 0);
        positionCtx.lineTo(x, h);
        positionCtx.stroke();
        const y = (i / CONFIG.GRID_DIVISIONS) * h;
        positionCtx.beginPath();
        positionCtx.moveTo(0, y);
        positionCtx.lineTo(w, y);
        positionCtx.stroke();
    }

    // Draw user anchors
    if (userAnchors) {
        userAnchors.forEach((anchor, i) => {
            const sx = anchor.start.x * w;
            const sy = anchor.start.y * h;
            const ex = anchor.end.x * w;
            const ey = anchor.end.y * h;

            // Start point (red filled)
            positionCtx.fillStyle = '#e74c3c';
            positionCtx.beginPath();
            positionCtx.arc(sx, sy, 5, 0, Math.PI * 2);
            positionCtx.fill();

            // End point (blue filled)
            positionCtx.fillStyle = '#3498db';
            positionCtx.beginPath();
            positionCtx.arc(ex, ey, 5, 0, Math.PI * 2);
            positionCtx.fill();

            // Stroke number
            positionCtx.fillStyle = '#333';
            positionCtx.font = '10px sans-serif';
            positionCtx.fillText(`U${i+1}`, sx + 8, sy - 8);
        });
    }

    // Draw reference anchors (if best match exists)
    if (bestMatch && bestMatch.refPositions) {
        bestMatch.refPositions.forEach((anchor, i) => {
            const sx = anchor.start.x * w;
            const sy = anchor.start.y * h;
            const ex = anchor.end.x * w;
            const ey = anchor.end.y * h;

            // Start point (green outline)
            positionCtx.strokeStyle = '#27ae60';
            positionCtx.lineWidth = 2;
            positionCtx.beginPath();
            positionCtx.arc(sx, sy, 6, 0, Math.PI * 2);
            positionCtx.stroke();

            // End point (orange outline)
            positionCtx.strokeStyle = '#f39c12';
            positionCtx.beginPath();
            positionCtx.arc(ex, ey, 6, 0, Math.PI * 2);
            positionCtx.stroke();

            positionCtx.fillStyle = '#666';
            positionCtx.font = '10px sans-serif';
            positionCtx.fillText(`R${i+1}`, sx + 10, sy + 12);
        });
    }
}

// ==================== VISUAL DEBUG: CURVATURE ====================

function renderCurvatureDebug(userCurv, refCurv, perStrokeScores) {
    const w = curvatureCanvas.width;
    const h = curvatureCanvas.height;
    curvatureCtx.fillStyle = '#f8f8f8';
    curvatureCtx.fillRect(0, 0, w, h);

    const colors = ['#95a5a6', '#3498db', '#f39c12', '#e74c3c']; // straight, gentle, sharp, loop
    const labels = ['Straight', 'Gentle', 'Sharp', 'Loop'];

    // Draw user curvature
    if (userCurv) {
        const rowH = 18;
        userCurv.forEach((sig, strokeIdx) => {
            const y = 10 + strokeIdx * (rowH + 8);
            sig.forEach((val, i) => {
                curvatureCtx.fillStyle = colors[val];
                curvatureCtx.fillRect(40 + i * 12, y, 10, rowH - 2);
            });
            curvatureCtx.fillStyle = '#333';
            curvatureCtx.font = '10px sans-serif';
            curvatureCtx.fillText(`U${strokeIdx+1}`, 4, y + 12);
        });
    }

    // Draw reference curvature (matched strokes)
    if (refCurv && perStrokeScores) {
        const rowH = 18;
        perStrokeScores.forEach((match, idx) => {
            const refSig = refCurv[match.refStroke];
            if (!refSig) return;
            const y = 10 + (userCurv ? userCurv.length : 0) * (rowH + 8) + 10 + idx * (rowH + 8);
            refSig.forEach((val, i) => {
                curvatureCtx.fillStyle = colors[val];
                curvatureCtx.globalAlpha = 0.5;
                curvatureCtx.fillRect(40 + i * 12, y, 10, rowH - 2);
                curvatureCtx.globalAlpha = 1;
            });
            curvatureCtx.fillStyle = '#666';
            curvatureCtx.font = '10px sans-serif';
            curvatureCtx.fillText(`R${match.refStroke+1}`, 4, y + 12);
        });
    }
}

// ==================== VISUAL DEBUG: PIXEL OVERLAP ====================

function renderPixelDebug(userMatrix, refMatrix, overlapScore) {
    const size = CONFIG.PIXEL_GRID_SIZE;
    const cell = 4;

    // User drawing
    pixelUserCtx.fillStyle = '#f8f8f8';
    pixelUserCtx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (userMatrix[y * size + x] > 0) {
                pixelUserCtx.fillStyle = '#333';
                pixelUserCtx.fillRect(x * cell, y * cell, cell, cell);
            }
        }
    }

    // Reference
    pixelMatchCtx.fillStyle = '#f8f8f8';
    pixelMatchCtx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (refMatrix[y * size + x] > 0) {
                pixelMatchCtx.fillStyle = '#333';
                pixelMatchCtx.fillRect(x * cell, y * cell, cell, cell);
            }
        }
    }

    // Overlap (green = match, red = user only, blue = ref only)
    pixelOverlapCtx.fillStyle = '#f8f8f8';
    pixelOverlapCtx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const u = userMatrix[y * size + x] > 0;
            const r = refMatrix[y * size + x] > 0;
            if (u && r) {
                pixelOverlapCtx.fillStyle = '#27ae60'; // green = both
            } else if (u) {
                pixelOverlapCtx.fillStyle = '#e74c3c'; // red = user only
            } else if (r) {
                pixelOverlapCtx.fillStyle = '#3498db'; // blue = ref only
            } else {
                continue;
            }
            pixelOverlapCtx.fillRect(x * cell, y * cell, cell, cell);
        }
    }

    document.getElementById('pixelScore').textContent = 
        Math.round(overlapScore * 100) + '% overlap';
}

// ==================== VISUAL DEBUG: VECTOR DIAGNOSTICS ====================

function renderVectorDebug(userVectors, bestMatch) {
    const cellW = vectorUserCanvas.width / CONFIG.RESAMPLE_POINTS;
    const cellH = 20;
    const startY = 10;

    // User vectors
    vectorUserCtx.fillStyle = '#f8f8f8';
    vectorUserCtx.fillRect(0, 0, vectorUserCanvas.width, vectorUserCanvas.height);

    userVectors.forEach((vec, strokeIdx) => {
        const y = startY + strokeIdx * (cellH + 8);
        vec.forEach((dir, i) => {
            vectorUserCtx.fillStyle = DIRECTION_COLORS[dir];
            vectorUserCtx.fillRect(i * cellW + 2, y, cellW - 4, cellH);
        });
        vectorUserCtx.fillStyle = '#666';
        vectorUserCtx.font = '10px sans-serif';
        vectorUserCtx.fillText(`S${strokeIdx+1}`, 2, y + cellH + 10);
    });

    // Reference vectors
    vectorRefCtx.fillStyle = '#f8f8f8';
    vectorRefCtx.fillRect(0, 0, vectorRefCanvas.width, vectorRefCanvas.height);

    if (bestMatch && bestMatch.refVectors) {
        bestMatch.refVectors.forEach((vec, strokeIdx) => {
            const y = startY + strokeIdx * (cellH + 8);
            vec.forEach((dir, i) => {
                vectorRefCtx.fillStyle = DIRECTION_COLORS[dir];
                vectorRefCtx.fillRect(i * cellW + 2, y, cellW - 4, cellH);
            });
            vectorRefCtx.fillStyle = '#666';
            vectorRefCtx.font = '10px sans-serif';
            vectorRefCtx.fillText(`S${strokeIdx+1}`, 2, y + cellH + 10);
        });
    }

    // Comparison
    vectorCompareCtx.fillStyle = '#f8f8f8';
    vectorCompareCtx.fillRect(0, 0, vectorCompareCanvas.width, vectorCompareCanvas.height);

    if (bestMatch && bestMatch.perStrokeScores) {
        bestMatch.perStrokeScores.forEach((match, idx) => {
            const y = startY + idx * (cellH + 8);
            const barW = match.similarity * (vectorCompareCanvas.width - 80);

            vectorCompareCtx.fillStyle = '#eee';
            vectorCompareCtx.fillRect(60, y, vectorCompareCanvas.width - 80, cellH);

            vectorCompareCtx.fillStyle = match.similarity > 0.7 ? '#27ae60' : 
                                          match.similarity > 0.4 ? '#f39c12' : '#e74c3c';
            vectorCompareCtx.fillRect(60, y, barW, cellH);

            vectorCompareCtx.fillStyle = '#333';
            vectorCompareCtx.font = '11px sans-serif';
            vectorCompareCtx.fillText(
                `U${match.userStroke+1}→R${match.refStroke+1}: ${Math.round(match.similarity*100)}%`,
                2, y + cellH - 4
            );
        });
    }
}

// ==================== VISUAL DEBUG: MATRIX ====================

function renderDebugGrid(matrix, targetCtx) {
    const cell = 4;
    const size = CONFIG.GRID_SIZE;

    targetCtx.fillStyle = '#f8f8f8';
    targetCtx.fillRect(0, 0, 128, 128);

    if (!matrix) return;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const val = matrix[y * size + x];
            if (val > 0.08) {
                const intensity = Math.min(1, val);
                const g = Math.round(255 * (1 - intensity));
                targetCtx.fillStyle = `rgb(${g},${g},${g})`;
                targetCtx.fillRect(x * cell, y * cell, cell, cell);
            }
        }
    }

    targetCtx.strokeStyle = 'rgba(200,0,0,0.12)';
    targetCtx.lineWidth = 0.5;
    for (let i = 0; i <= size; i++) {
        targetCtx.beginPath();
        targetCtx.moveTo(i * cell, 0);
        targetCtx.lineTo(i * cell, 128);
        targetCtx.stroke();
        targetCtx.beginPath();
        targetCtx.moveTo(0, i * cell);
        targetCtx.lineTo(128, i * cell);
        targetCtx.stroke();
    }
}

// ==================== UI UPDATES ====================

function displayResults(results, userStrokeCount, allFeatures) {
    const best = results[0];

    resultPlaceholder.style.display = 'none';
    topMatch.classList.add('active');

    document.getElementById('matchChar').textContent = best.char;
    document.getElementById('matchName').textContent = best.name;
    document.getElementById('matchReading').textContent = best.reading;
    document.getElementById('matchConfidence').textContent = Math.round(best.score * 100) + '%';

    // Stroke count metadata
    const strokeDiff = userStrokeCount - best.expectedStrokes;
    let strokeText = `Strokes: ${userStrokeCount} drawn · ${best.expectedStrokes} expected`;
    if (strokeDiff !== 0) {
        strokeText += ` <span class="mismatch">(${strokeDiff > 0 ? '+' : ''}${strokeDiff})</span>`;
    }
    strokeMeta.innerHTML = strokeText;

    // Feature score breakdown
    featureGrid.innerHTML = '';
    const features = [
        { key: 'direction', label: 'Direction Vectors', score: best.featureScores.direction },
        { key: 'position', label: 'Position Anchors', score: best.featureScores.position },
        { key: 'grid', label: 'Grid Occupancy', score: best.featureScores.grid },
        { key: 'curvature', label: 'Curvature', score: best.featureScores.curvature },
        { key: 'proportion', label: 'Stroke Proportions', score: best.featureScores.proportion },
        { key: 'pixel', label: 'Pixel Similarity', score: best.featureScores.pixel }
    ];

    features.forEach(f => {
        const pct = Math.round(f.score * 100);
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.innerHTML = `
            <div class="feature-label">
                <span>${f.label}</span>
                <span class="feature-score">${pct}%</span>
            </div>
            <div class="feature-bar">
                <div class="feature-bar-fill ${f.score > 0.6 ? 'good' : f.score > 0.3 ? 'ok' : 'bad'}" 
                     style="width: ${pct}%"></div>
            </div>
        `;
        featureGrid.appendChild(item);
    });

    // Render all debug visualizations
    renderDebugGrid(best.matrix, debugMatchCtx);
    renderVectorDebug(allFeatures.userVectors, best);
    renderPositionAnchors(allFeatures.userAnchors, best.refPositions, best);
    renderCurvatureDebug(allFeatures.userCurv, REFERENCE_DATA.get(best.char)?.curvature, best.perStrokeScores);
    renderPixelDebug(allFeatures.userPixel, best.matrix, best.featureScores.pixel);

    // Stats list
    statsList.innerHTML = '';
    results.slice(0, 5).forEach((r, idx) => {
        const pct = Math.round(r.score * 100);
        const item = document.createElement('div');
        item.className = 'stat-item';
        item.style.animationDelay = (idx * 40) + 'ms';
        item.innerHTML = `
            <div class="stat-char">${r.char}</div>
            <div class="stat-bar-wrapper">
                <div class="stat-bar" style="width: ${pct}%; opacity: ${0.35 + (r.score * 0.65)}"></div>
                <span class="stat-percent">${pct}%</span>
            </div>
            <div class="stat-reading">${r.reading}</div>
        `;
        statsList.appendChild(item);
    });

    // Correction bar
    correctionBar.classList.add('active');
    correctionGrid.innerHTML = '';
    results.slice(0, 6).forEach(r => {
        const btn = document.createElement('button');
        btn.className = 'correction-btn';
        btn.textContent = r.char;
        btn.title = `${r.name} (${r.reading})`;
        btn.addEventListener('click', () => handleCorrection(r.char, allFeatures));
        correctionGrid.appendChild(btn);
    });

    speakCharacter(best.char);
}

function displayNoMatch() {
    resultPlaceholder.style.display = 'block';
    topMatch.classList.remove('active');
    statsList.innerHTML = '<div style="text-align:center;color:#999;font-size:0.85rem;padding:12px;">No clear match. Try drawing larger and more centered.</div>';
    strokeMeta.textContent = '';
    featureGrid.innerHTML = '';
    correctionBar.classList.remove('active');
    clearDebugGrid();
    clearVectorDebug();
    clearPositionDebug();
    clearCurvatureDebug();
    clearPixelDebug();
}

// ==================== CORRECTION HANDLER ====================

function handleCorrection(correctChar, allFeatures) {
    // Record this drawing as the user's version of the correct character
    recordUserCorrection(correctChar, allStrokes, allFeatures.userVectors, allFeatures);

    // Visual feedback
    const btn = Array.from(correctionGrid.children).find(b => b.textContent === correctChar);
    if (btn) {
        btn.style.background = '#27ae60';
        btn.style.color = 'white';
        btn.style.borderColor = '#27ae60';
        setTimeout(() => {
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 800);
    }

    // Update the result to show the corrected character
    const correctedEntry = REFERENCE_DATA.get(correctChar);
    if (correctedEntry) {
        document.getElementById('matchChar').textContent = correctedEntry.char;
        document.getElementById('matchName').textContent = correctedEntry.name;
        document.getElementById('matchReading').textContent = correctedEntry.reading;

        // Add learned badge
        const nameEl = document.getElementById('matchName');
        if (!nameEl.querySelector('.learned-badge')) {
            nameEl.innerHTML += ' <span class="learned-badge">✓ Learned</span>';
        }
    }

    speakCharacter(correctChar);
}

// ==================== WEB SPEECH API ====================

function speakCharacter(char) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(char);
    u.lang = 'ja-JP';
    u.rate = 0.85;
    u.pitch = 1.0;
    u.volume = 1.0;

    window.speechSynthesis.speak(u);
}

document.getElementById('speakBtn').addEventListener('click', () => {
    const char = document.getElementById('matchChar').textContent;
    if (char && char !== '?') speakCharacter(char);
});

// ==================== EVENT LISTENERS ====================

// Mouse
canvas.addEventListener('mousedown', startStroke);
canvas.addEventListener('mousemove', moveStroke);
canvas.addEventListener('mouseup', endStroke);
canvas.addEventListener('mouseleave', endStroke);

// Touch — passive: false to block scroll
canvas.addEventListener('touchstart', startStroke, { passive: false });
canvas.addEventListener('touchmove', moveStroke, { passive: false });
canvas.addEventListener('touchend', endStroke, { passive: false });
canvas.addEventListener('touchcancel', endStroke, { passive: false });

// Prevent document-level touch scrolling while interacting with canvas
document.body.addEventListener('touchmove', (e) => {
    if (isDrawing && e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });

resetBtn.addEventListener('click', clearCanvas);

// Debounced resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initCanvas();
        clearCanvas();
    }, 150);
});

// ==================== INIT ====================

function init() {
    precomputeReferenceData();
    initCanvas();
    clearCanvas();
    setMode('auto');
}

init();