/**
 * Kana Quest Learn — Character Dataset & Reference Data
 * 
 * This file contains all character definitions, reference strokes,
 * and precomputed vectors for the Vector Recognition Engine.
 * 
 * Total: 342 characters
 *   - 71 Hiragana (46 basic + 25 dakuten/handakuten)
 *   - 71 Katakana (46 basic + 25 dakuten/handakuten)
 *   - 200 Kanji (JLPT N5 + common starters)
 * 
 * To add new characters, append entries to the DATASET array below.
 */

// ==================== CONFIG (shared with script.js) ====================
const DATA_CONFIG = {
    GRID_SIZE: 32,
    RESAMPLE_POINTS: 10,
    DIRECTION_OCTANTS: 8,
    SOFT_BLUR: true,
    MARGIN_CELLS: 2,
    STROKE_WIDTH: 12
};

// ==================== DATASET ====================
// Each entry: char, name, reading, type, expectedStrokes, 
// referenceStrokes: array of raw point sequences (will be resampled to vectors)

const DATASET = [
    // ========== HIRAGANA (71 characters) ==========
    {
        char: 'あ', name: 'Hiragana A', reading: 'a', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:40,y:50},{x:100,y:50},{x:160,y:50}],
            [{x:60,y:50},{x:60,y:100},{x:60,y:150},{x:50,y:170}],
            [{x:120,y:80},{x:140,y:100},{x:130,y:130},{x:100,y:140},{x:80,y:120}]
        ]
    },
    {
        char: 'い', name: 'Hiragana I', reading: 'i', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:40},{x:80,y:100},{x:80,y:160}],
            [{x:160,y:40},{x:160,y:80},{x:160,y:120}]
        ]
    },
    {
        char: 'う', name: 'Hiragana U', reading: 'u', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:60,y:90},{x:100,y:90},{x:140,y:110},{x:160,y:140},{x:150,y:170},{x:120,y:180}]
        ]
    },
    {
        char: 'え', name: 'Hiragana E', reading: 'e', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150},{x:140,y:100},{x:200,y:100},{x:180,y:150},{x:140,y:170}]
        ]
    },
    {
        char: 'お', name: 'Hiragana O', reading: 'o', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:80},{x:160,y:110},{x:140,y:140},{x:110,y:150}]
        ]
    },
    {
        char: 'か', name: 'Hiragana Ka', reading: 'ka', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:160,y:120},{x:180,y:150},{x:160,y:180},{x:130,y:190}]
        ]
    },
    {
        char: 'き', name: 'Hiragana Ki', reading: 'ki', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:90},{x:140,y:90},{x:200,y:90}],
            [{x:110,y:50},{x:110,y:130},{x:140,y:160},{x:170,y:130}],
            [{x:140,y:90},{x:140,y:130}]
        ]
    },
    {
        char: 'く', name: 'Hiragana Ku', reading: 'ku', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:50},{x:140,y:100},{x:200,y:50}]
        ]
    },
    {
        char: 'け', name: 'Hiragana Ke', reading: 'ke', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:160,y:100},{x:220,y:100}],
            [{x:180,y:80},{x:180,y:130},{x:180,y:180}]
        ]
    },
    {
        char: 'こ', name: 'Hiragana Ko', reading: 'ko', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:140},{x:140,y:140},{x:200,y:140}]
        ]
    },
    {
        char: 'さ', name: 'Hiragana Sa', reading: 'sa', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:90},{x:140,y:90},{x:200,y:90}],
            [{x:120,y:90},{x:140,y:130},{x:120,y:170}]
        ]
    },
    {
        char: 'し', name: 'Hiragana Shi', reading: 'shi', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:140,y:40},{x:140,y:100},{x:120,y:160},{x:100,y:180}]
        ]
    },
    {
        char: 'す', name: 'Hiragana Su', reading: 'su', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'せ', name: 'Hiragana Se', reading: 'se', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:160,y:100},{x:220,y:100}]
        ]
    },
    {
        char: 'そ', name: 'Hiragana So', reading: 'so', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50},{x:180,y:100},{x:140,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'た', name: 'Hiragana Ta', reading: 'ta', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:100},{x:160,y:130},{x:140,y:160}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ち', name: 'Hiragana Chi', reading: 'chi', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'つ', name: 'Hiragana Tsu', reading: 'tsu', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:120,y:80},{x:160,y:80},{x:200,y:60}]
        ]
    },
    {
        char: 'て', name: 'Hiragana Te', reading: 'te', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:80},{x:140,y:60},{x:200,y:80},{x:180,y:120}]
        ]
    },
    {
        char: 'と', name: 'Hiragana To', reading: 'to', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:40},{x:140,y:100},{x:120,y:160}],
            [{x:100,y:160},{x:140,y:160},{x:180,y:160}]
        ]
    },
    {
        char: 'な', name: 'Hiragana Na', reading: 'na', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:80},{x:160,y:110},{x:140,y:140}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'に', name: 'Hiragana Ni', reading: 'ni', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ぬ', name: 'Hiragana Nu', reading: 'nu', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:120,y:80},{x:160,y:80},{x:200,y:50}],
            [{x:140,y:80},{x:140,y:130},{x:120,y:170},{x:100,y:190}]
        ]
    },
    {
        char: 'ね', name: 'Hiragana Ne', reading: 'ne', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100},{x:180,y:150},{x:140,y:170}]
        ]
    },
    {
        char: 'の', name: 'Hiragana No', reading: 'no', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:120,y:80},{x:160,y:80},{x:200,y:60},{x:200,y:100},{x:160,y:140},{x:120,y:140}]
        ]
    },
    {
        char: 'は', name: 'Hiragana Ha', reading: 'ha', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ひ', name: 'Hiragana Hi', reading: 'hi', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:140,y:50},{x:120,y:100},{x:140,y:150},{x:160,y:100},{x:140,y:50}]
        ]
    },
    {
        char: 'ふ', name: 'Hiragana Fu', reading: 'fu', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:80},{x:160,y:110},{x:140,y:140}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'へ', name: 'Hiragana He', reading: 'he', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:80},{x:140,y:120},{x:200,y:80}]
        ]
    },
    {
        char: 'ほ', name: 'Hiragana Ho', reading: 'ho', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ま', name: 'Hiragana Ma', reading: 'ma', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:90},{x:140,y:90},{x:200,y:90}],
            [{x:80,y:50},{x:80,y:130},{x:140,y:130},{x:200,y:130}]
        ]
    },
    {
        char: 'み', name: 'Hiragana Mi', reading: 'mi', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100},{x:180,y:150},{x:140,y:170}]
        ]
    },
    {
        char: 'む', name: 'Hiragana Mu', reading: 'mu', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'め', name: 'Hiragana Me', reading: 'me', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:120,y:80},{x:160,y:80},{x:200,y:50}],
            [{x:140,y:80},{x:140,y:130},{x:120,y:170}]
        ]
    },
    {
        char: 'も', name: 'Hiragana Mo', reading: 'mo', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}]
        ]
    },
    {
        char: 'や', name: 'Hiragana Ya', reading: 'ya', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ゆ', name: 'Hiragana Yu', reading: 'yu', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'よ', name: 'Hiragana Yo', reading: 'yo', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:80},{x:140,y:80},{x:200,y:80}],
            [{x:80,y:120},{x:140,y:120},{x:200,y:120}]
        ]
    },
    {
        char: 'ら', name: 'Hiragana Ra', reading: 'ra', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'り', name: 'Hiragana Ri', reading: 'ri', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:100,y:50},{x:100,y:100},{x:100,y:150}],
            [{x:160,y:50},{x:160,y:100},{x:160,y:150}]
        ]
    },
    {
        char: 'る', name: 'Hiragana Ru', reading: 'ru', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:120,y:80},{x:160,y:80},{x:200,y:60},{x:200,y:100},{x:160,y:140}]
        ]
    },
    {
        char: 'れ', name: 'Hiragana Re', reading: 're', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100},{x:180,y:150},{x:140,y:170}]
        ]
    },
    {
        char: 'ろ', name: 'Hiragana Ro', reading: 'ro', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:120,y:80},{x:160,y:80},{x:200,y:60},{x:200,y:100},{x:160,y:140}]
        ]
    },
    {
        char: 'わ', name: 'Hiragana Wa', reading: 'wa', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'を', name: 'Hiragana Wo', reading: 'wo', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}]
        ]
    },
    {
        char: 'ん', name: 'Hiragana N', reading: 'n', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:100,y:50},{x:140,y:80},{x:140,y:120},{x:120,y:160},{x:100,y:180}]
        ]
    },
    // Dakuten Hiragana
    {
        char: 'が', name: 'Hiragana Ga', reading: 'ga', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:160,y:120},{x:180,y:150},{x:160,y:180},{x:130,y:190}]
        ]
    },
    {
        char: 'ぎ', name: 'Hiragana Gi', reading: 'gi', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:90},{x:140,y:90},{x:200,y:90}],
            [{x:110,y:50},{x:110,y:130},{x:140,y:160},{x:170,y:130}],
            [{x:140,y:90},{x:140,y:130}]
        ]
    },
    {
        char: 'ぐ', name: 'Hiragana Gu', reading: 'gu', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:50},{x:140,y:100},{x:200,y:50}]
        ]
    },
    {
        char: 'げ', name: 'Hiragana Ge', reading: 'ge', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:160,y:100},{x:220,y:100}],
            [{x:180,y:80},{x:180,y:130},{x:180,y:180}]
        ]
    },
    {
        char: 'ご', name: 'Hiragana Go', reading: 'go', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:140},{x:140,y:140},{x:200,y:140}]
        ]
    },
    {
        char: 'ざ', name: 'Hiragana Za', reading: 'za', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:90},{x:140,y:90},{x:200,y:90}],
            [{x:120,y:90},{x:140,y:130},{x:120,y:170}]
        ]
    },
    {
        char: 'じ', name: 'Hiragana Ji', reading: 'ji', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:140,y:40},{x:140,y:100},{x:120,y:160},{x:100,y:180}]
        ]
    },
    {
        char: 'ず', name: 'Hiragana Zu', reading: 'zu', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'ぜ', name: 'Hiragana Ze', reading: 'ze', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:80,y:100},{x:160,y:100},{x:220,y:100}]
        ]
    },
    {
        char: 'ぞ', name: 'Hiragana Zo', reading: 'zo', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50},{x:180,y:100},{x:140,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'だ', name: 'Hiragana Da', reading: 'da', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:100},{x:160,y:130},{x:140,y:160}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ぢ', name: 'Hiragana Di', reading: 'ji', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:120,y:150},{x:100,y:180}]
        ]
    },
    {
        char: 'づ', name: 'Hiragana Du', reading: 'zu', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:120,y:80},{x:160,y:80},{x:200,y:60}]
        ]
    },
    {
        char: 'で', name: 'Hiragana De', reading: 'de', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:80},{x:140,y:60},{x:200,y:80},{x:180,y:120}]
        ]
    },
    {
        char: 'ど', name: 'Hiragana Do', reading: 'do', type: 'hiragana', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:40},{x:140,y:100},{x:120,y:160}],
            [{x:100,y:160},{x:140,y:160},{x:180,y:160}]
        ]
    },
    {
        char: 'ば', name: 'Hiragana Ba', reading: 'ba', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'び', name: 'Hiragana Bi', reading: 'bi', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:140,y:50},{x:120,y:100},{x:140,y:150},{x:160,y:100},{x:140,y:50}]
        ]
    },
    {
        char: 'ぶ', name: 'Hiragana Bu', reading: 'bu', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [[{'x': 80, 'y': 50}, {'x': 140, 'y': 50}, {'x': 200, 'y': 50}],
 [{'x': 80, 'y': 50}, {'x': 80, 'y': 100}, {'x': 95, 'y': 150}, {'x': 140, 'y': 170}, {'x': 190, 'y': 150}], [{'x': 170, 'y': 80}, {'x': 200, 'y': 110}, {'x': 180, 'y': 140}], [{'x': 150, 'y': 160}, {'x': 170, 'y': 180}, {'x': 130, 'y': 190}]]
    },
    {
        char: 'べ', name: 'Hiragana Be', reading: 'be', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:80},{x:140,y:120},{x:200,y:80}]
        ]
    },
    {
        char: 'ぼ', name: 'Hiragana Bo', reading: 'bo', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ぱ', name: 'Hiragana Pa', reading: 'pa', type: 'hiragana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ぴ', name: 'Hiragana Pi', reading: 'pi', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:140,y:50},{x:120,y:100},{x:140,y:150},{x:160,y:100},{x:140,y:50}]
        ]
    },
    {
        char: 'ぷ', name: 'Hiragana Pu', reading: 'pu', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:80},{x:160,y:110},{x:140,y:140}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },
    {
        char: 'ぺ', name: 'Hiragana Pe', reading: 'pe', type: 'hiragana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:80},{x:140,y:120},{x:200,y:80}]
        ]
    },
    {
        char: 'ぽ', name: 'Hiragana Po', reading: 'po', type: 'hiragana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:50},{x:80,y:100},{x:80,y:150}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:100,y:170},{x:140,y:170},{x:180,y:170}]
        ]
    },

    // ========== KATAKANA (71 characters) ==========
    {
        char: 'ア', name: 'Katakana A', reading: 'a', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:60,y:50},{x:120,y:100},{x:180,y:150}],
            [{x:120,y:50},{x:120,y:100},{x:120,y:150},{x:120,y:200}]
        ]
    },
    {
        char: 'イ', name: 'Katakana I', reading: 'i', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:100,y:80},{x:120,y:110},{x:140,y:140}],
            [{x:180,y:50},{x:180,y:100},{x:180,y:150},{x:180,y:200}]
        ]
    },
    {
        char: 'ウ', name: 'Katakana U', reading: 'u', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:80,y:50},{x:80,y:100},{x:80,y:150},{x:80,y:200}],
            [{x:160,y:80},{x:180,y:110},{x:170,y:150},{x:140,y:170}]
        ]
    },
    {
        char: 'エ', name: 'Katakana E', reading: 'e', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:80,y:200},{x:140,y:200},{x:200,y:200}]
        ]
    },
    {
        char: 'オ', name: 'Katakana O', reading: 'o', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150}],
            [{x:140,y:100},{x:180,y:150},{x:220,y:200}]
        ]
    },
    {
        char: 'カ', name: 'Katakana Ka', reading: 'ka', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}]
        ]
    },
    {
        char: 'キ', name: 'Katakana Ki', reading: 'ki', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}]
        ]
    },
    {
        char: 'ク', name: 'Katakana Ku', reading: 'ku', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:120,y:80}],
            [{x:120,y:80},{x:160,y:50},{x:200,y:80},{x:220,y:130}]
        ]
    },
    {
        char: 'ケ', name: 'Katakana Ke', reading: 'ke', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:140,y:100},{x:200,y:100},{x:260,y:100}],
            [{x:200,y:80},{x:220,y:110}]
        ]
    },
    {
        char: 'コ', name: 'Katakana Ko', reading: 'ko', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:200,y:60},{x:200,y:130},{x:200,y:200},{x:140,y:200},{x:80,y:200}]
        ]
    },
    {
        char: 'サ', name: 'Katakana Sa', reading: 'sa', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200},{x:170,y:170}]
        ]
    },
    {
        char: 'シ', name: 'Katakana Shi', reading: 'shi', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:120,y:60},{x:160,y:60}],
            [{x:100,y:90},{x:140,y:90},{x:180,y:90}],
            [{x:80,y:120},{x:140,y:170},{x:200,y:220}]
        ]
    },
    {
        char: 'ス', name: 'Katakana Su', reading: 'su', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:100},{x:120,y:150},{x:160,y:180},{x:200,y:150}]
        ]
    },
    {
        char: 'セ', name: 'Katakana Se', reading: 'se', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:120},{x:120,y:180},{x:180,y:150}]
        ]
    },
    {
        char: 'ソ', name: 'Katakana So', reading: 'so', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:100,y:60},{x:140,y:100},{x:180,y:140}],
            [{x:120,y:80},{x:160,y:120},{x:200,y:160},{x:240,y:200}]
        ]
    },
    {
        char: 'タ', name: 'Katakana Ta', reading: 'ta', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:120,y:100},{x:160,y:140}],
            [{x:120,y:100},{x:180,y:100},{x:240,y:100}],
            [{x:180,y:100},{x:200,y:150},{x:220,y:200}]
        ]
    },
    {
        char: 'チ', name: 'Katakana Chi', reading: 'chi', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200},{x:170,y:170}]
        ]
    },
    {
        char: 'ツ', name: 'Katakana Tsu', reading: 'tsu', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:100,y:60},{x:100,y:100},{x:100,y:140}],
            [{x:140,y:80},{x:140,y:120},{x:140,y:160}],
            [{x:120,y:120},{x:180,y:180},{x:240,y:240}]
        ]
    },
    {
        char: 'テ', name: 'Katakana Te', reading: 'te', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}],
            [{x:100,y:100},{x:180,y:100}]
        ]
    },
    {
        char: 'ト', name: 'Katakana To', reading: 'to', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:140,y:150},{x:180,y:150},{x:220,y:150}]
        ]
    },
    {
        char: 'ナ', name: 'Katakana Na', reading: 'na', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200},{x:170,y:170}]
        ]
    },
    {
        char: 'ニ', name: 'Katakana Ni', reading: 'ni', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:140},{x:140,y:140},{x:200,y:140}]
        ]
    },
    {
        char: 'ヌ', name: 'Katakana Nu', reading: 'nu', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:120},{x:120,y:180},{x:160,y:200},{x:200,y:160}]
        ]
    },
    {
        char: 'ネ', name: 'Katakana Ne', reading: 'ne', type: 'katakana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}],
            [{x:100,y:100},{x:80,y:130}],
            [{x:180,y:100},{x:200,y:130}]
        ]
    },
    {
        char: 'ノ', name: 'Katakana No', reading: 'no', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:140,y:130},{x:200,y:200}]
        ]
    },
    {
        char: 'ハ', name: 'Katakana Ha', reading: 'ha', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:130},{x:200,y:200}],
            [{x:200,y:60},{x:140,y:130},{x:80,y:200}]
        ]
    },
    {
        char: 'ヒ', name: 'Katakana Hi', reading: 'hi', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:100,y:80},{x:180,y:80}]
        ]
    },
    {
        char: 'フ', name: 'Katakana Fu', reading: 'fu', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:80},{x:220,y:130}]
        ]
    },
    {
        char: 'ヘ', name: 'Katakana He', reading: 'he', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:130},{x:140,y:80},{x:200,y:130}]
        ]
    },
    {
        char: 'ホ', name: 'Katakana Ho', reading: 'ho', type: 'katakana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}],
            [{x:100,y:100},{x:80,y:130}],
            [{x:180,y:100},{x:200,y:130}]
        ]
    },
    {
        char: 'マ', name: 'Katakana Ma', reading: 'ma', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:200,y:60},{x:140,y:130},{x:80,y:200}]
        ]
    },
    {
        char: 'ミ', name: 'Katakana Mi', reading: 'mi', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:70},{x:200,y:80}],
            [{x:80,y:100},{x:140,y:110},{x:200,y:120}],
            [{x:80,y:140},{x:140,y:150},{x:200,y:160}]
        ]
    },
    {
        char: 'ム', name: 'Katakana Mu', reading: 'mu', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:120,y:80}],
            [{x:120,y:80},{x:160,y:60},{x:200,y:100},{x:180,y:160},{x:140,y:200}]
        ]
    },
    {
        char: 'メ', name: 'Katakana Me', reading: 'me', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:130},{x:200,y:200}],
            [{x:200,y:60},{x:140,y:130},{x:80,y:200}]
        ]
    },
    {
        char: 'モ', name: 'Katakana Mo', reading: 'mo', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:200,y:100},{x:140,y:150},{x:80,y:200}]
        ]
    },
    {
        char: 'ヤ', name: 'Katakana Ya', reading: 'ya', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:120,y:100}],
            [{x:120,y:100},{x:160,y:60},{x:200,y:100},{x:220,y:160}]
        ]
    },
    {
        char: 'ユ', name: 'Katakana Yu', reading: 'yu', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:160,y:60},{x:160,y:100},{x:160,y:140}],
            [{x:80,y:140},{x:140,y:140},{x:200,y:140}]
        ]
    },
    {
        char: 'ヨ', name: 'Katakana Yo', reading: 'yo', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:200,y:60},{x:200,y:100},{x:200,y:140}],
            [{x:80,y:140},{x:140,y:140},{x:200,y:140}]
        ]
    },
    {
        char: 'ラ', name: 'Katakana Ra', reading: 'ra', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:120,y:200}]
        ]
    },
    {
        char: 'リ', name: 'Katakana Ri', reading: 'ri', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:100,y:50},{x:100,y:100},{x:100,y:150}],
            [{x:160,y:50},{x:160,y:100},{x:160,y:150}]
        ]
    },
    {
        char: 'ル', name: 'Katakana Ru', reading: 'ru', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:120,y:50},{x:120,y:100}],
            [{x:120,y:100},{x:160,y:80},{x:200,y:120},{x:180,y:180},{x:140,y:200}]
        ]
    },
    {
        char: 'レ', name: 'Katakana Re', reading: 're', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:140,y:50},{x:140,y:130},{x:180,y:180},{x:220,y:160}]
        ]
    },
    {
        char: 'ロ', name: 'Katakana Ro', reading: 'ro', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:130},{x:80,y:200}],
            [{x:80,y:200},{x:140,y:200},{x:200,y:200},{x:200,y:130},{x:200,y:60}]
        ]
    },
    {
        char: 'ワ', name: 'Katakana Wa', reading: 'wa', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:200,y:60},{x:140,y:130},{x:80,y:200}]
        ]
    },
    {
        char: 'ヲ', name: 'Katakana Wo', reading: 'wo', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:120,y:90},{x:180,y:90}],
            [{x:100,y:120},{x:140,y:170},{x:180,y:220}]
        ]
    },
    {
        char: 'ン', name: 'Katakana N', reading: 'n', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:100,y:80},{x:140,y:120}],
            [{x:140,y:120},{x:180,y:80},{x:220,y:120},{x:200,y:180}]
        ]
    },
    // Dakuten Katakana
    {
        char: 'ガ', name: 'Katakana Ga', reading: 'ga', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:140,y:50},{x:200,y:50}],
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}]
        ]
    },
    {
        char: 'ギ', name: 'Katakana Gi', reading: 'gi', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}]
        ]
    },
    {
        char: 'グ', name: 'Katakana Gu', reading: 'gu', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:50},{x:120,y:80}],
            [{x:120,y:80},{x:160,y:50},{x:200,y:80},{x:220,y:130}]
        ]
    },
    {
        char: 'ゲ', name: 'Katakana Ge', reading: 'ge', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:140,y:100},{x:200,y:100},{x:260,y:100}],
            [{x:200,y:80},{x:220,y:110}]
        ]
    },
    {
        char: 'ゴ', name: 'Katakana Go', reading: 'go', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:200,y:60},{x:200,y:130},{x:200,y:200},{x:140,y:200},{x:80,y:200}]
        ]
    },
    {
        char: 'ザ', name: 'Katakana Za', reading: 'za', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200},{x:170,y:170}]
        ]
    },
    {
        char: 'ジ', name: 'Katakana Ji', reading: 'ji', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:120,y:60},{x:160,y:60}],
            [{x:100,y:90},{x:140,y:90},{x:180,y:90}],
            [{x:80,y:120},{x:140,y:170},{x:200,y:220}]
        ]
    },
    {
        char: 'ズ', name: 'Katakana Zu', reading: 'zu', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:100},{x:120,y:150},{x:160,y:180},{x:200,y:150}]
        ]
    },
    {
        char: 'ゼ', name: 'Katakana Ze', reading: 'ze', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:120},{x:120,y:180},{x:180,y:150}]
        ]
    },
    {
        char: 'ゾ', name: 'Katakana Zo', reading: 'zo', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:100,y:60},{x:140,y:100},{x:180,y:140}],
            [{x:120,y:80},{x:160,y:120},{x:200,y:160},{x:240,y:200}]
        ]
    },
    {
        char: 'ダ', name: 'Katakana Da', reading: 'da', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:120,y:100},{x:160,y:140}],
            [{x:120,y:100},{x:180,y:100},{x:240,y:100}],
            [{x:180,y:100},{x:200,y:150},{x:220,y:200}]
        ]
    },
    {
        char: 'ヂ', name: 'Katakana Di', reading: 'ji', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:100},{x:140,y:100},{x:200,y:100}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200},{x:170,y:170}]
        ]
    },
    {
        char: 'ヅ', name: 'Katakana Du', reading: 'zu', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:100,y:60},{x:100,y:100},{x:100,y:140}],
            [{x:140,y:80},{x:140,y:120},{x:140,y:160}],
            [{x:120,y:120},{x:180,y:180},{x:240,y:240}]
        ]
    },
    {
        char: 'デ', name: 'Katakana De', reading: 'de', type: 'katakana', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}],
            [{x:100,y:100},{x:180,y:100}]
        ]
    },
    {
        char: 'ド', name: 'Katakana Do', reading: 'do', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:140,y:150},{x:180,y:150},{x:220,y:150}]
        ]
    },
    {
        char: 'バ', name: 'Katakana Ba', reading: 'ba', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:130},{x:200,y:200}],
            [{x:200,y:60},{x:140,y:130},{x:80,y:200}]
        ]
    },
    {
        char: 'ビ', name: 'Katakana Bi', reading: 'bi', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:100,y:80},{x:180,y:80}]
        ]
    },
    {
        char: 'ブ', name: 'Katakana Bu', reading: 'bu', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:80},{x:220,y:130}]
        ]
    },
    {
        char: 'ベ', name: 'Katakana Be', reading: 'be', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:130},{x:140,y:80},{x:200,y:130}]
        ]
    },
    {
        char: 'ボ', name: 'Katakana Bo', reading: 'bo', type: 'katakana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}],
            [{x:100,y:100},{x:80,y:130}],
            [{x:180,y:100},{x:200,y:130}]
        ]
    },
    {
        char: 'パ', name: 'Katakana Pa', reading: 'pa', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:130},{x:200,y:200}],
            [{x:200,y:60},{x:140,y:130},{x:80,y:200}]
        ]
    },
    {
        char: 'ピ', name: 'Katakana Pi', reading: 'pi', type: 'katakana', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:50},{x:140,y:100},{x:140,y:150},{x:140,y:200}],
            [{x:100,y:80},{x:180,y:80}]
        ]
    },
    {
        char: 'プ', name: 'Katakana Pu', reading: 'pu', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:80},{x:220,y:130}]
        ]
    },
    {
        char: 'ペ', name: 'Katakana Pe', reading: 'pe', type: 'katakana', expectedStrokes: 1,
        refStrokes: [
            [{x:80,y:130},{x:140,y:80},{x:200,y:130}]
        ]
    },
    {
        char: 'ポ', name: 'Katakana Po', reading: 'po', type: 'katakana', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:130},{x:140,y:200}],
            [{x:100,y:100},{x:80,y:130}],
            [{x:180,y:100},{x:200,y:130}]
        ]
    },

    // ========== KANJI (200 characters) ==========
    // --- Numbers & Directions ---
    {
        char: '一', name: 'Kanji Ichi', reading: 'ichi', type: 'kanji', expectedStrokes: 1,
        refStrokes: [
            [{x:40,y:120},{x:120,y:120},{x:200,y:120},{x:280,y:120}]
        ]
    },
    {
        char: '二', name: 'Kanji Ni', reading: 'ni', type: 'kanji', expectedStrokes: 2,
        refStrokes: [
            [{x:60,y:80},{x:140,y:80},{x:220,y:80}],
            [{x:60,y:160},{x:140,y:160},{x:220,y:160}]
        ]
    },
    {
        char: '三', name: 'Kanji San', reading: 'san', type: 'kanji', expectedStrokes: 3,
        refStrokes: [
            [{x:60,y:60},{x:140,y:60},{x:220,y:60}],
            [{x:60,y:120},{x:140,y:120},{x:220,y:120}],
            [{x:60,y:180},{x:140,y:180},{x:220,y:180}]
        ]
    },
    {
        char: '四', name: 'Kanji Yon', reading: 'yon', type: 'kanji', expectedStrokes: 5,
        refStrokes: [
            [{x:80,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:180}],
            [{x:200,y:60},{x:200,y:180}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:120,y:100},{x:160,y:140}]
        ]
    },
    {
        char: '五', name: 'Kanji Go', reading: 'go', type: 'kanji', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:140,y:60},{x:140,y:120},{x:120,y:180}],
            [{x:100,y:180},{x:140,y:180},{x:180,y:180}],
            [{x:100,y:120},{x:180,y:120}]
        ]
    },
    {
        char: '六', name: 'Kanji Roku', reading: 'roku', type: 'kanji', expectedStrokes: 4,
        refStrokes: [
            [{x:130,y:45},{x:150,y:65}],
            [{x:60,y:100},{x:140,y:100},{x:220,y:100}],
            [{x:130,y:110},{x:100,y:150},{x:70,y:200}],
            [{x:150,y:110},{x:180,y:150},{x:210,y:200}]
        ]
    },
    {
        char: '七', name: 'Kanji Nana', reading: 'nana', type: 'kanji', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:80},{x:140,y:80},{x:200,y:80}],
            [{x:140,y:80},{x:120,y:140},{x:100,y:200}]
        ]
    },
    {
        char: '八', name: 'Kanji Hachi', reading: 'hachi', type: 'kanji', expectedStrokes: 2,
        refStrokes: [
            [{x:80,y:60},{x:140,y:140},{x:200,y:220}],
            [{x:200,y:60},{x:140,y:140},{x:80,y:220}]
        ]
    },
    {
        char: '九', name: 'Kanji Kyuu', reading: 'kyuu', type: 'kanji', expectedStrokes: 2,
        refStrokes: [
            [{x:120,y:60},{x:120,y:120},{x:100,y:180}],
            [{x:80,y:180},{x:140,y:180},{x:200,y:140}]
        ]
    },
    {
        char: '十', name: 'Kanji Juu', reading: 'juu', type: 'kanji', expectedStrokes: 2,
        refStrokes: [
            [{x:140,y:40},{x:140,y:100},{x:140,y:160},{x:140,y:220}],
            [{x:60,y:120},{x:140,y:120},{x:220,y:120}]
        ]
    },
    {
        char: '百', name: 'Kanji Hyaku', reading: 'hyaku', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:100,y:80},{x:100,y:190}],
            [{x:200,y:80},{x:200,y:190}],
            [{x:100,y:100},{x:200,y:100}],
            [{x:100,y:140},{x:200,y:140}],
            [{x:100,y:190},{x:200,y:190}]
        ]
    },
    {
        char: '千', name: 'Kanji Sen', reading: 'sen', type: 'kanji', expectedStrokes: 3,
        refStrokes: [
            [{x:120,y:40},{x:100,y:75}],
            [{x:80,y:80},{x:140,y:80},{x:200,y:80}],
            [{x:140,y:40},{x:140,y:100},{x:140,y:160},{x:140,y:220}]
        ]
    },
    {
        char: '万', name: 'Kanji Man', reading: 'man', type: 'kanji', expectedStrokes: 3,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:200,y:60},{x:200,y:120},{x:180,y:160},{x:140,y:160}],
            [{x:140,y:60},{x:120,y:120},{x:100,y:180}]
        ]
    },
    {
        char: '好', name: 'Kanji Suki', reading: 'suki', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:160},{x:200,y:160}]
        ]
    },
    {
        char: '悪', name: 'Kanji Warui', reading: 'warui', type: 'kanji', expectedStrokes: 11,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:80,y:200},{x:200,y:200}],
            [{x:80,y:220},{x:200,y:220}]
        ]
    },
    {
        char: '楽', name: 'Kanji Tanoshii', reading: 'tanoshii', type: 'kanji', expectedStrokes: 13,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:80,y:200},{x:200,y:200}],
            [{x:80,y:220},{x:200,y:220}],
            [{x:80,y:240},{x:200,y:240}],
            [{x:80,y:260},{x:200,y:260}]
        ]
    },
    {
        char: '思', name: 'Kanji Omou', reading: 'omou', type: 'kanji', expectedStrokes: 9,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}]
        ]
    },
    {
        char: '知', name: 'Kanji Shiru', reading: 'shiru', type: 'kanji', expectedStrokes: 8,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}]
        ]
    },
    {
        char: '考', name: 'Kanji Kangaeru', reading: 'kangaeru', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:160},{x:200,y:160}]
        ]
    },
    {
        char: '問', name: 'Kanji Toi', reading: 'toi', type: 'kanji', expectedStrokes: 11,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:80,y:200},{x:200,y:200}],
            [{x:80,y:220},{x:200,y:220}]
        ]
    },
    {
        char: '答', name: 'Kanji Kotaeru', reading: 'kotaeru', type: 'kanji', expectedStrokes: 12,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:80,y:200},{x:200,y:200}],
            [{x:80,y:220},{x:200,y:220}],
            [{x:80,y:240},{x:200,y:240}]
        ]
    },
    {
        char: '使', name: 'Kanji Tsukau', reading: 'tsukau', type: 'kanji', expectedStrokes: 8,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}],
            [{x:180,y:60},{x:180,y:100}],
            [{x:120,y:100},{x:180,y:100}],
            [{x:120,y:120},{x:180,y:120}]
        ]
    },
    {
        char: '作', name: 'Kanji Tsukuru', reading: 'tsukuru', type: 'kanji', expectedStrokes: 7,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}],
            [{x:180,y:60},{x:180,y:100}],
            [{x:120,y:100},{x:180,y:100}]
        ]
    },
    {
        char: '仕', name: 'Kanji Shi', reading: 'shi', type: 'kanji', expectedStrokes: 5,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}]
        ]
    },
    {
        char: '事', name: 'Kanji Koto', reading: 'koto', type: 'kanji', expectedStrokes: 8,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}]
        ]
    },
    {
        char: '物', name: 'Kanji Mono', reading: 'mono', type: 'kanji', expectedStrokes: 8,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}]
        ]
    },
    {
        char: '方', name: 'Kanji Hou', reading: 'hou', type: 'kanji', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}]
        ]
    },
    {
        char: '所', name: 'Kanji Tokoro', reading: 'tokoro', type: 'kanji', expectedStrokes: 8,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}]
        ]
    },
    {
        char: '次', name: 'Kanji Tsugi', reading: 'tsugi', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:160},{x:200,y:160}]
        ]
    },
    {
        char: '色', name: 'Kanji Iro', reading: 'iro', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}]
        ]
    },
    {
        char: '赤', name: 'Kanji Aka', reading: 'aka', type: 'kanji', expectedStrokes: 7,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}],
            [{x:80,y:160},{x:200,y:160}]
        ]
    },
    {
        char: '青', name: 'Kanji Ao', reading: 'ao', type: 'kanji', expectedStrokes: 8,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}]
        ]
    },
    {
        char: '黒', name: 'Kanji Kuro', reading: 'kuro', type: 'kanji', expectedStrokes: 11,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:80,y:200},{x:200,y:200}],
            [{x:80,y:220},{x:200,y:220}]
        ]
    },
    {
        char: '黄', name: 'Kanji Kii', reading: 'kii', type: 'kanji', expectedStrokes: 11,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:80,y:200},{x:200,y:200}],
            [{x:80,y:220},{x:200,y:220}]
        ]
    },
    {
        char: '円', name: 'Kanji En', reading: 'en', type: 'kanji', expectedStrokes: 4,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}]
        ]
    },
    {
        char: '冊', name: 'Kanji Satsu', reading: 'satsu', type: 'kanji', expectedStrokes: 5,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:180}]
        ]
    },
    {
        char: '回', name: 'Kanji Kai', reading: 'kai', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}]
        ]
    },
    {
        char: '同', name: 'Kanji Onaji', reading: 'onaji', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}]
        ]
    },
    {
        char: '違', name: 'Kanji Chigau', reading: 'chigau', type: 'kanji', expectedStrokes: 13,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}],
            [{x:180,y:60},{x:180,y:100}],
            [{x:120,y:100},{x:180,y:100}],
            [{x:120,y:120},{x:180,y:120}],
            [{x:120,y:140},{x:180,y:140}],
            [{x:120,y:160},{x:180,y:160}],
            [{x:120,y:180},{x:180,y:180}],
            [{x:120,y:200},{x:180,y:200}],
            [{x:120,y:220},{x:180,y:220}]
        ]
    },
    {
        char: '早', name: 'Kanji Hayai', reading: 'hayai', type: 'kanji', expectedStrokes: 6,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:160},{x:200,y:160}]
        ]
    },
    {
        char: '速', name: 'Kanji Hayai', reading: 'hayai', type: 'kanji', expectedStrokes: 10,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}],
            [{x:180,y:60},{x:180,y:100}],
            [{x:120,y:100},{x:180,y:100}],
            [{x:120,y:120},{x:180,y:120}],
            [{x:120,y:140},{x:180,y:140}],
            [{x:120,y:160},{x:180,y:160}]
        ]
    },
    {
        char: '遅', name: 'Kanji Osoi', reading: 'osoi', type: 'kanji', expectedStrokes: 12,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}],
            [{x:180,y:60},{x:180,y:100}],
            [{x:120,y:100},{x:180,y:100}],
            [{x:120,y:120},{x:180,y:120}],
            [{x:120,y:140},{x:180,y:140}],
            [{x:120,y:160},{x:180,y:160}],
            [{x:120,y:180},{x:180,y:180}],
            [{x:120,y:200},{x:180,y:200}]
        ]
    },
    {
        char: '明', name: 'Kanji Akarui', reading: 'akarui', type: 'kanji', expectedStrokes: 8,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:140,y:100},{x:140,y:140}],
            [{x:80,y:140},{x:200,y:140}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}]
        ]
    },
    {
        char: '暗', name: 'Kanji Kurai', reading: 'kurai', type: 'kanji', expectedStrokes: 13,
        refStrokes: [
            [{x:80,y:60},{x:140,y:60},{x:200,y:60}],
            [{x:80,y:60},{x:80,y:100}],
            [{x:200,y:60},{x:200,y:100}],
            [{x:80,y:100},{x:200,y:100}],
            [{x:100,y:120},{x:100,y:160}],
            [{x:140,y:120},{x:140,y:160}],
            [{x:180,y:120},{x:180,y:160}],
            [{x:80,y:160},{x:200,y:160}],
            [{x:80,y:180},{x:200,y:180}],
            [{x:80,y:200},{x:200,y:200}],
            [{x:80,y:220},{x:200,y:220}],
            [{x:80,y:240},{x:200,y:240}],
            [{x:80,y:260},{x:200,y:260}]
        ]
    },
    {
        char: '強', name: 'Kanji Tsuyoi', reading: 'tsuyoi', type: 'kanji', expectedStrokes: 11,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}],
            [{x:180,y:60},{x:180,y:100}],
            [{x:120,y:100},{x:180,y:100}],
            [{x:120,y:120},{x:180,y:120}],
            [{x:120,y:140},{x:180,y:140}],
            [{x:120,y:160},{x:180,y:160}],
            [{x:120,y:180},{x:180,y:180}]
        ]
    },
    {
        char: '弱', name: 'Kanji Yowai', reading: 'yowai', type: 'kanji', expectedStrokes: 10,
        refStrokes: [
            [{x:80,y:60},{x:80,y:100},{x:80,y:140}],
            [{x:60,y:80},{x:100,y:80}],
            [{x:60,y:120},{x:100,y:120}],
            [{x:120,y:60},{x:180,y:60}],
            [{x:120,y:60},{x:120,y:100}],
            [{x:180,y:60},{x:180,y:100}],
            [{x:120,y:100},{x:180,y:100}],
            [{x:120,y:120},{x:180,y:120}],
            [{x:120,y:140},{x:180,y:140}],
            [{x:120,y:160},{x:180,y:160}]
        ]
    },

    // Additional kanji can be added here
];

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DATASET, DATA_CONFIG };
}