// Headless extraction of the PURE matching functions from script.js
// (copied verbatim from the uploaded script.js — no DOM/canvas dependencies)

const CONFIG = {
    RESAMPLE_POINTS: 10,
    DIRECTION_OCTANTS: 8,
    MIN_STROKE_POINTS: 5,
    MIN_BBOX_SIZE: 20,
    MIN_TOTAL_STROKES: 1,
    MATCH_THRESHOLD: 0.30,
    EDIT_SUB_COST: 1.0,
    EDIT_INS_COST: 1.2,
    EDIT_DEL_COST: 1.2,
    CYCLIC_TOLERANCE: 1,
    STROKE_COUNT_PENALTY_WEIGHT: 0.35,
    COVERAGE_PENALTY_WEIGHT: 0.35,
    AMBIGUITY_MARGIN: 0.05,
    DIRECTION_SHARPNESS: 5.0,
    POSITION_SHARPNESS: 4.0,
    WEIGHT_DIRECTION: 0.30,
    WEIGHT_POSITION: 0.20,
    WEIGHT_GRID: 0.15,
    WEIGHT_CURVATURE: 0.10,
    WEIGHT_PROPORTION: 0.10,
    WEIGHT_PIXEL: 0.15,
    GRID_DIVISIONS: 4,
    CURVE_STRAIGHT: 15,
    CURVE_GENTLE: 45,
    CURVE_SHARP: 90,
    PIXEL_GRID_SIZE: 32,
    GRID_SIZE: 32,
    SOFT_BLUR: true,
    MARGIN_CELLS: 2,
    STROKE_WIDTH: 12
};

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

function directionFromDelta(dx, dy) {
    const angle = Math.atan2(dy, dx);
    const normalized = angle < 0 ? angle + Math.PI * 2 : angle;
    return Math.round((normalized / (Math.PI * 2)) * 8) % 8;
}

function pointsToDirectionVectors(points) {
    const vectors = [];
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) continue;
        vectors.push(directionFromDelta(dx, dy));
    }
    return vectors;
}

function cyclicDirectionDistance(d1, d2) {
    const diff = Math.abs(d1 - d2);
    return Math.min(diff, 8 - diff);
}

function computePositionAnchors(resampledStrokes) {
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
        start: { x: (stroke[0].x - minX) / w, y: (stroke[0].y - minY) / h },
        end: { x: (stroke[stroke.length - 1].x - minX) / w, y: (stroke[stroke.length - 1].y - minY) / h }
    }));
}

function matchPositionAnchors(userAnchors, refAnchors) {
    if (userAnchors.length === 0 || refAnchors.length === 0) return 0;
    const usedRef = new Set();
    let totalSim = 0, matched = 0;
    for (let i = 0; i < userAnchors.length; i++) {
        let bestSim = -1, bestJ = -1;
        for (let j = 0; j < refAnchors.length; j++) {
            if (usedRef.has(j)) continue;
            const dx = userAnchors[i].start.x - refAnchors[j].start.x;
            const dy = userAnchors[i].start.y - refAnchors[j].start.y;
            const ex = userAnchors[i].end.x - refAnchors[j].end.x;
            const ey = userAnchors[i].end.y - refAnchors[j].end.y;
            const startDist = Math.sqrt(dx*dx + dy*dy);
            const endDist = Math.sqrt(ex*ex + ey*ey);
            const sim = Math.exp(-((startDist + endDist) / 2) * CONFIG.POSITION_SHARPNESS);
            if (sim > bestSim) { bestSim = sim; bestJ = j; }
        }
        if (bestJ >= 0 && bestSim > 0.1) { usedRef.add(bestJ); totalSim += bestSim; matched++; }
    }
    const coverage = refAnchors.length > 0 ? matched / refAnchors.length : 0;
    return matched > 0 ? (totalSim / matched) * (0.7 + 0.3 * coverage) : 0;
}

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
    let totalSim = 0, matched = 0;
    for (let i = 0; i < userGrids.length; i++) {
        let bestSim = -1, bestJ = -1;
        for (let j = 0; j < refGrids.length; j++) {
            if (usedRef.has(j)) continue;
            const intersection = userGrids[i].filter(c => refGrids[j].includes(c));
            const union = [...new Set([...userGrids[i], ...refGrids[j]])];
            const sim = union.length > 0 ? intersection.length / union.length : 0;
            if (sim > bestSim) { bestSim = sim; bestJ = j; }
        }
        if (bestJ >= 0 && bestSim > 0.05) { usedRef.add(bestJ); totalSim += bestSim; matched++; }
    }
    const coverage = refGrids.length > 0 ? matched / refGrids.length : 0;
    return matched > 0 ? (totalSim / matched) * (0.7 + 0.3 * coverage) : 0;
}

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
    let totalSim = 0, matched = 0;
    for (let i = 0; i < userCurv.length; i++) {
        let bestSim = -1, bestJ = -1;
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
        if (bestJ >= 0 && bestSim > 0.1) { usedRef.add(bestJ); totalSim += bestSim; matched++; }
    }
    return matched > 0 ? totalSim / matched : 0;
}

function computeStrokeProportions(resampledStrokes) {
    const lengths = resampledStrokes.map(s => strokeLength(s));
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    return lengths.map(l => l / total);
}

function matchStrokeProportions(userProps, refProps) {
    if (userProps.length === 0 || refProps.length === 0) return 0;
    const usedRef = new Set();
    let totalSim = 0, matched = 0;
    for (let i = 0; i < userProps.length; i++) {
        let bestSim = -1, bestJ = -1;
        for (let j = 0; j < refProps.length; j++) {
            if (usedRef.has(j)) continue;
            const sim = 1 - Math.abs(userProps[i] - refProps[j]);
            if (sim > bestSim) { bestSim = sim; bestJ = j; }
        }
        if (bestJ >= 0 && bestSim > 0.1) { usedRef.add(bestJ); totalSim += bestSim; matched++; }
    }
    return matched > 0 ? totalSim / matched : 0;
}

function computeBoundingBoxRaw(strokes) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    strokes.forEach(stroke => stroke.forEach(pt => {
        minX = Math.min(minX, pt.x); minY = Math.min(minY, pt.y);
        maxX = Math.max(maxX, pt.x); maxY = Math.max(maxY, pt.y);
    }));
    const padding = CONFIG.STROKE_WIDTH;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = maxX + padding;
    maxY = maxY + padding;
    const w = maxX - minX, h = maxY - minY;
    if (w < 5 || h < 5) return null;
    return { minX, minY, width: w, height: h, maxX, maxY };
}

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
            const p1 = stroke[i-1], p2 = stroke[i];
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
                const gx = Math.round(x), gy = Math.round(y);
                if (gx >= 0 && gx < size && gy >= 0 && gy < size) matrix[gy * size + gx] = 1;
            }
        }
    });
    return matrix;
}

function computePixelSimilarity(userMatrix, refMatrix) {
    let intersection = 0, union = 0;
    for (let i = 0; i < userMatrix.length; i++) {
        if (userMatrix[i] > 0 && refMatrix[i] > 0) intersection++;
        if (userMatrix[i] > 0 || refMatrix[i] > 0) union++;
    }
    return union > 0 ? intersection / union : 0;
}

function rasterizeLine(matrix, size, x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const steps = Math.max(dx, dy) * 2 + 1;
    for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        for (let dyy = -1; dyy <= 1; dyy++) {
            for (let dxx = -1; dxx <= 1; dxx++) {
                const gx = Math.round(x + dxx);
                const gy = Math.round(y + dyy);
                if (gx >= 0 && gx < size && gy >= 0 && gy < size) {
                    const weight = (Math.abs(dxx) + Math.abs(dyy) === 0) ? 1.0 : 0.5;
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
            for (let dy = -1; dy <= 1; dy++)
                for (let dx = -1; dx <= 1; dx++)
                    sum += temp[(y + dy) * size + (x + dx)];
            result[y * size + x] = sum / 9;
        }
    }
    return result;
}

function generateReferenceMatrixFromStrokes(strokes) {
    const size = CONFIG.GRID_SIZE;
    const matrix = new Float32Array(size * size).fill(0);
    strokes.forEach(stroke => {
        for (let i = 1; i < stroke.length; i++) {
            const scale = size / 300;
            rasterizeLine(matrix, size, stroke[i-1].x * scale, stroke[i-1].y * scale, stroke[i].x * scale, stroke[i].y * scale);
        }
    });
    return CONFIG.SOFT_BLUR ? applySoftBlur(matrix, size) : matrix;
}

function cyclicAngularEditDistance(vecA, vecB) {
    const m = vecA.length, n = vecB.length;
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
            curr[j] = Math.min(prev[j] + CONFIG.EDIT_DEL_COST, curr[j-1] + CONFIG.EDIT_INS_COST, prev[j-1] + subCost);
        }
        [prev, curr] = [curr, prev];
    }
    return prev[n];
}

function editDistanceToSimilarity(distance, maxLen) {
    if (maxLen === 0) return 0;
    return Math.max(0, Math.exp(-(distance / maxLen) * CONFIG.DIRECTION_SHARPNESS));
}

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
    let totalSim = 0, matched = 0;
    for (let i = 0; i < userVectors.length; i++) {
        let bestSim = -1, bestJ = -1;
        for (let j = 0; j < refVectors.length; j++) {
            if (usedRef.has(j)) continue;
            if (distMatrix[i][j].similarity > bestSim) { bestSim = distMatrix[i][j].similarity; bestJ = j; }
        }
        if (bestJ >= 0 && bestSim > 0.1) {
            usedRef.add(bestJ); totalSim += bestSim; matched++;
            perStroke.push({ userStroke: i, refStroke: bestJ, similarity: bestSim });
        }
    }
    const maxStrokes = Math.max(userVectors.length, refVectors.length);
    const strokeDiffPenalty = maxStrokes > 0
        ? (Math.abs(userVectors.length - refVectors.length) / maxStrokes) * CONFIG.STROKE_COUNT_PENALTY_WEIGHT
        : 0;
    const coveragePenalty = refVectors.length > 0
        ? ((refVectors.length - matched) / refVectors.length) * CONFIG.COVERAGE_PENALTY_WEIGHT
        : 0;
    let score = 0;
    if (matched > 0) score = (totalSim / matched) - strokeDiffPenalty - coveragePenalty;
    return { score: Math.max(0, Math.min(1, score)), perStroke };
}

module.exports = {
    CONFIG, resampleStroke, pointsToDirectionVectors, computePositionAnchors, matchPositionAnchors,
    computeGridOccupancy, matchGridOccupancy, computeCurvatureSignatures, matchCurvatureSignatures,
    computeStrokeProportions, matchStrokeProportions, computeBoundingBoxRaw, computePixelMatrix,
    computePixelSimilarity, generateReferenceMatrixFromStrokes, matchDirectionVectors
};
