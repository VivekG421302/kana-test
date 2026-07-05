const fs = require('fs');
const E = require('./engine-core.js');

// Load DATASET from data.js without needing DOM
const dataSrc = fs.readFileSync('./data.js', 'utf8');
const sandbox = {};
new Function('module', 'exports', dataSrc + '\nmodule.exports = { DATASET, DATA_CONFIG };')(sandbox, sandbox);
const { DATASET } = require('./data.js');

console.log('=== STRUCTURAL CHECKS ===');
console.log('Total entries:', DATASET.length);
const byType = {};
DATASET.forEach(e => byType[e.type] = (byType[e.type]||0)+1);
console.log('By type:', byType);

// duplicate chars
const seen = new Map();
DATASET.forEach((e, idx) => {
    if (!e.char) { console.log('MISSING char field at index', idx); return; }
    if (seen.has(e.char)) console.log('DUPLICATE char:', e.char, 'at indices', seen.get(e.char), 'and', idx);
    else seen.set(e.char, idx);
});

// stroke count mismatch, missing fields, degenerate points, out of bounds
let strokeMismatches = [];
let degenerate = [];
let outOfBounds = [];
let tooFewPoints = [];
DATASET.forEach(e => {
    if (!e.refStrokes || !Array.isArray(e.refStrokes)) { console.log('MISSING refStrokes:', e.char); return; }
    if (e.expectedStrokes !== e.refStrokes.length) {
        strokeMismatches.push({ char: e.char, name: e.name, expected: e.expectedStrokes, actual: e.refStrokes.length });
    }
    e.refStrokes.forEach((stroke, si) => {
        if (!stroke || stroke.length < 2) tooFewPoints.push({ char: e.char, stroke: si, points: stroke ? stroke.length : 0 });
        (stroke||[]).forEach(p => {
            if (p.x < 0 || p.x > 300 || p.y < 0 || p.y > 300) outOfBounds.push({ char: e.char, stroke: si, point: p });
        });
        // degenerate: all points identical (zero length stroke)
        if (stroke && stroke.length >= 2) {
            const len = E.CONFIG ? null : null;
        }
    });
});

console.log('\n-- Stroke count mismatches (expectedStrokes vs refStrokes.length):', strokeMismatches.length);
strokeMismatches.forEach(m => console.log(`   ${m.char} (${m.name}): expected=${m.expected} actual=${m.actual}`));

console.log('\n-- Strokes with <2 points (cannot compute direction):', tooFewPoints.length);
tooFewPoints.slice(0,20).forEach(m => console.log(`   ${m.char} stroke#${m.stroke}: ${m.points} points`));

console.log('\n-- Out-of-canvas-bounds points (outside 0-300):', outOfBounds.length);
outOfBounds.slice(0,20).forEach(m => console.log(`   ${m.char} stroke#${m.stroke}: (${m.point.x},${m.point.y})`));

// zero-length strokes (start===end exactly across all points -> a "dot")
let zeroLenStrokes = [];
DATASET.forEach(e => {
    (e.refStrokes||[]).forEach((stroke, si) => {
        if (!stroke || stroke.length < 2) return;
        const len = E.computeBoundingBoxRaw ? null : null;
        let total = 0;
        for (let i=1;i<stroke.length;i++){
            const dx = stroke[i].x-stroke[i-1].x, dy = stroke[i].y-stroke[i-1].y;
            total += Math.sqrt(dx*dx+dy*dy);
        }
        if (total < 3) zeroLenStrokes.push({char:e.char, stroke:si, len: total});
    });
});
console.log('\n-- Near-zero-length strokes (<3px total, direction undefined):', zeroLenStrokes.length);
zeroLenStrokes.slice(0,20).forEach(m => console.log(`   ${m.char} stroke#${m.stroke}: length=${m.len.toFixed(2)}`));

console.log('\n\n=== ENGINE SELF-TEST (precompute reference data using real script.js math) ===');

const REFERENCE_DATA = new Map();
DATASET.forEach(entry => {
    const resampled = entry.refStrokes.map(s => E.resampleStroke(s, E.CONFIG.RESAMPLE_POINTS));
    const vectors = resampled.map(E.pointsToDirectionVectors);
    const positions = E.computePositionAnchors(resampled);
    const grid = E.computeGridOccupancy(resampled);
    const curvature = E.computeCurvatureSignatures(resampled);
    const proportions = E.computeStrokeProportions(resampled);
    const matrix = E.generateReferenceMatrixFromStrokes(entry.refStrokes);
    REFERENCE_DATA.set(entry.char, { ...entry, resampled, vectors, positions, grid, curvature, proportions, matrix });
});

function scoreAgainst(userFeat, refEntry) {
    const dirMatch = E.matchDirectionVectors(userFeat.vectors, refEntry.vectors);
    const posMatch = E.matchPositionAnchors(userFeat.positions, refEntry.positions);
    const gridMatch = E.matchGridOccupancy(userFeat.grid, refEntry.grid);
    const curvMatch = E.matchCurvatureSignatures(userFeat.curvature, refEntry.curvature);
    const propMatch = E.matchStrokeProportions(userFeat.proportions, refEntry.proportions);
    const pixMatch = E.computePixelSimilarity(userFeat.pixel, refEntry.matrix);
    const blended = dirMatch.score*E.CONFIG.WEIGHT_DIRECTION + posMatch*E.CONFIG.WEIGHT_POSITION +
        gridMatch*E.CONFIG.WEIGHT_GRID + curvMatch*E.CONFIG.WEIGHT_CURVATURE +
        propMatch*E.CONFIG.WEIGHT_PROPORTION + pixMatch*E.CONFIG.WEIGHT_PIXEL;
    return blended;
}

// Self-recognition test: does each character match itself as the #1 result
// when its own reference strokes are fed in as "user input"?
let failSelfMatch = [];
let lowConfidenceSelfMatch = [];
let allResults = [];

DATASET.forEach(entry => {
    const refEntry = REFERENCE_DATA.get(entry.char);
    const bbox = E.computeBoundingBoxRaw(entry.refStrokes);
    if (!bbox) { failSelfMatch.push({char: entry.char, reason: 'bbox too small'}); return; }
    const userFeat = {
        vectors: refEntry.vectors,
        positions: refEntry.positions,
        grid: refEntry.grid,
        curvature: refEntry.curvature,
        proportions: refEntry.proportions,
        pixel: E.computePixelMatrix(entry.refStrokes, bbox)
    };

    const scores = [];
    REFERENCE_DATA.forEach((otherEntry, otherChar) => {
        scores.push({ char: otherChar, score: scoreAgainst(userFeat, otherEntry) });
    });
    scores.sort((a,b) => b.score - a.score);
    allResults.push({ char: entry.char, top: scores.slice(0,3) });

    const selfRank = scores.findIndex(s => s.char === entry.char);
    const selfScore = scores.find(s => s.char === entry.char).score;
    if (selfRank !== 0) {
        failSelfMatch.push({ char: entry.char, name: entry.name, selfScore, selfRank, beatenBy: scores.slice(0, selfRank+1) });
    } else if (selfScore < 0.5) {
        lowConfidenceSelfMatch.push({ char: entry.char, name: entry.name, selfScore });
    }
});

console.log(`\n-- Characters that DON'T match themselves as top result: ${failSelfMatch.length} / ${DATASET.length}`);
failSelfMatch.slice(0, 40).forEach(f => {
    console.log(`   ${f.char} (${f.name}): self-score=${f.selfScore.toFixed(3)}, rank=${f.selfRank}, beaten by top-${f.selfRank}: ${f.beatenBy.slice(0,f.selfRank).map(b=>`${b.char}(${b.score.toFixed(2)})`).join(', ')}`);
});
if (failSelfMatch.length > 40) console.log(`   ... and ${failSelfMatch.length - 40} more`);

console.log(`\n-- Characters that self-match but with LOW confidence (<0.5): ${lowConfidenceSelfMatch.length}`);
lowConfidenceSelfMatch.slice(0, 30).forEach(f => console.log(`   ${f.char} (${f.name}): ${f.selfScore.toFixed(3)}`));

// Confusability: for each char, is there another char scoring within 0.05 of the top score?
console.log('\n-- High confusability pairs (2nd place within 0.05 of 1st place):');
let confusable = [];
allResults.forEach(r => {
    if (r.top.length >= 2 && (r.top[0].score - r.top[1].score) < 0.05 && r.top[0].char !== r.top[1].char) {
        confusable.push({ char: r.char, first: r.top[0], second: r.top[1] });
    }
});
confusable.slice(0, 40).forEach(c => console.log(`   ${c.char}: ${c.first.char}(${c.first.score.toFixed(3)}) vs ${c.second.char}(${c.second.score.toFixed(3)})`));
console.log(`   Total: ${confusable.length}`);

fs.writeFileSync('./analysis-results.json', JSON.stringify({
    total: DATASET.length, byType, strokeMismatches, tooFewPoints, outOfBounds, zeroLenStrokes,
    failSelfMatch: failSelfMatch.map(f=>({char:f.char,name:f.name,selfScore:f.selfScore,selfRank:f.selfRank})),
    lowConfidenceSelfMatch, confusableCount: confusable.length, confusable: confusable.slice(0,100)
}, null, 2));
console.log('\nFull results written to analysis-results.json');
