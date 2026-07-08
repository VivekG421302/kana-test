// KANA PRO — plain character data. No stroke coordinates on purpose: Kana
// Pro renders each candidate directly from a real font at recognition time,
// so adding a new entry here is all that's needed to make it recognizable.
//
// Every entry carries "Structural DNA" used by the cascaded filter funnel
// in kana-pro.html to hard-gate the candidate pool BEFORE any expensive
// pixel-mask (IoU) comparison runs:
//
//   strokes  — canonical stroke count (integer). Used for the +/-1 tolerance
//              stroke-count filter (a 3-stroke drawing should never be
//              compared against a 1-stroke glyph like く or し).
//   columns  — expected vertical-projection peak count (1 or 2). This is
//              the specific "い vs し" solver: い has two side-by-side
//              strokes (2 peaks), し has one continuous stroke (1 peak).
//   aspect   — intrinsic, un-normalized design profile: 'tall', 'wide', or
//              'square'. Prevents a flat, wide こ from ever being matched
//              against a tall, narrow drawing (or vice versa) once it has
//              been stretched into the normalized scoring frame.
//
// Scope: 46 standard Hiragana, 12 basic Katakana (アイウエオカキクケコサシ),
// and 12 basic Kanji (一二三四五六七八九十木火) — 70 characters total.
const KANA_PRO_DATASET = [

    // ---- Hiragana (46) ----
    { char: 'あ', reading: 'a',   name: 'Hiragana A',   strokes: 3, columns: 1, aspect: 'square' },
    { char: 'い', reading: 'i',   name: 'Hiragana I',   strokes: 2, columns: 2, aspect: 'tall'   },
    { char: 'う', reading: 'u',   name: 'Hiragana U',   strokes: 2, columns: 1, aspect: 'square' },
    { char: 'え', reading: 'e',   name: 'Hiragana E',   strokes: 2, columns: 1, aspect: 'square' },
    { char: 'お', reading: 'o',   name: 'Hiragana O',   strokes: 3, columns: 1, aspect: 'square' },
    { char: 'か', reading: 'ka',  name: 'Hiragana Ka',  strokes: 3, columns: 1, aspect: 'square' },
    { char: 'き', reading: 'ki',  name: 'Hiragana Ki',  strokes: 4, columns: 1, aspect: 'tall'   },
    { char: 'く', reading: 'ku',  name: 'Hiragana Ku',  strokes: 1, columns: 1, aspect: 'tall'   },
    { char: 'け', reading: 'ke',  name: 'Hiragana Ke',  strokes: 3, columns: 2, aspect: 'tall'   },
    { char: 'こ', reading: 'ko',  name: 'Hiragana Ko',  strokes: 2, columns: 1, aspect: 'wide'   },
    { char: 'さ', reading: 'sa',  name: 'Hiragana Sa',  strokes: 3, columns: 1, aspect: 'square' },
    { char: 'し', reading: 'shi', name: 'Hiragana Shi', strokes: 1, columns: 1, aspect: 'tall'   },
    { char: 'す', reading: 'su',  name: 'Hiragana Su',  strokes: 2, columns: 1, aspect: 'square' },
    { char: 'せ', reading: 'se',  name: 'Hiragana Se',  strokes: 3, columns: 1, aspect: 'square' },
    { char: 'そ', reading: 'so',  name: 'Hiragana So',  strokes: 1, columns: 1, aspect: 'wide'   },
    { char: 'た', reading: 'ta',  name: 'Hiragana Ta',  strokes: 4, columns: 1, aspect: 'square' },
    { char: 'ち', reading: 'chi', name: 'Hiragana Chi', strokes: 2, columns: 1, aspect: 'square' },
    { char: 'つ', reading: 'tsu', name: 'Hiragana Tsu', strokes: 1, columns: 1, aspect: 'wide'   },
    { char: 'て', reading: 'te',  name: 'Hiragana Te',  strokes: 1, columns: 1, aspect: 'wide'   },
    { char: 'と', reading: 'to',  name: 'Hiragana To',  strokes: 2, columns: 1, aspect: 'tall'   },
    { char: 'な', reading: 'na',  name: 'Hiragana Na',  strokes: 4, columns: 1, aspect: 'square' },
    { char: 'に', reading: 'ni',  name: 'Hiragana Ni',  strokes: 3, columns: 2, aspect: 'tall'   },
    { char: 'ぬ', reading: 'nu',  name: 'Hiragana Nu',  strokes: 2, columns: 1, aspect: 'square' },
    { char: 'ね', reading: 'ne',  name: 'Hiragana Ne',  strokes: 2, columns: 1, aspect: 'tall'   },
    { char: 'の', reading: 'no',  name: 'Hiragana No',  strokes: 1, columns: 1, aspect: 'square' },
    { char: 'は', reading: 'ha',  name: 'Hiragana Ha',  strokes: 3, columns: 2, aspect: 'tall'   },
    { char: 'ひ', reading: 'hi',  name: 'Hiragana Hi',  strokes: 1, columns: 1, aspect: 'wide'   },
    { char: 'ふ', reading: 'fu',  name: 'Hiragana Fu',  strokes: 4, columns: 1, aspect: 'square' },
    { char: 'へ', reading: 'he',  name: 'Hiragana He',  strokes: 1, columns: 1, aspect: 'wide'   },
    { char: 'ほ', reading: 'ho',  name: 'Hiragana Ho',  strokes: 4, columns: 2, aspect: 'tall'   },
    { char: 'ま', reading: 'ma',  name: 'Hiragana Ma',  strokes: 3, columns: 1, aspect: 'square' },
    { char: 'み', reading: 'mi',  name: 'Hiragana Mi',  strokes: 2, columns: 1, aspect: 'square' },
    { char: 'む', reading: 'mu',  name: 'Hiragana Mu',  strokes: 3, columns: 1, aspect: 'square' },
    { char: 'め', reading: 'me',  name: 'Hiragana Me',  strokes: 2, columns: 1, aspect: 'square' },
    { char: 'も', reading: 'mo',  name: 'Hiragana Mo',  strokes: 3, columns: 1, aspect: 'tall'   },
    { char: 'や', reading: 'ya',  name: 'Hiragana Ya',  strokes: 3, columns: 1, aspect: 'square' },
    { char: 'ゆ', reading: 'yu',  name: 'Hiragana Yu',  strokes: 2, columns: 1, aspect: 'tall'   },
    { char: 'よ', reading: 'yo',  name: 'Hiragana Yo',  strokes: 2, columns: 1, aspect: 'tall'   },
    { char: 'ら', reading: 'ra',  name: 'Hiragana Ra',  strokes: 2, columns: 1, aspect: 'square' },
    { char: 'り', reading: 'ri',  name: 'Hiragana Ri',  strokes: 2, columns: 2, aspect: 'tall'   },
    { char: 'る', reading: 'ru',  name: 'Hiragana Ru',  strokes: 1, columns: 1, aspect: 'square' },
    { char: 'れ', reading: 're',  name: 'Hiragana Re',  strokes: 2, columns: 2, aspect: 'tall'   },
    { char: 'ろ', reading: 'ro',  name: 'Hiragana Ro',  strokes: 1, columns: 1, aspect: 'square' },
    { char: 'わ', reading: 'wa',  name: 'Hiragana Wa',  strokes: 2, columns: 1, aspect: 'square' },
    { char: 'を', reading: 'wo',  name: 'Hiragana Wo',  strokes: 3, columns: 1, aspect: 'square' },
    { char: 'ん', reading: 'n',   name: 'Hiragana N',   strokes: 1, columns: 1, aspect: 'tall'   },

    // ---- Katakana (12) ----
    { char: 'ア', reading: 'a',   name: 'Katakana A',   strokes: 2, columns: 1, aspect: 'square' },
    { char: 'イ', reading: 'i',   name: 'Katakana I',   strokes: 2, columns: 2, aspect: 'tall'   },
    { char: 'ウ', reading: 'u',   name: 'Katakana U',   strokes: 3, columns: 1, aspect: 'square' },
    { char: 'エ', reading: 'e',   name: 'Katakana E',   strokes: 3, columns: 1, aspect: 'wide'   },
    { char: 'オ', reading: 'o',   name: 'Katakana O',   strokes: 3, columns: 1, aspect: 'square' },
    { char: 'カ', reading: 'ka',  name: 'Katakana Ka',  strokes: 2, columns: 1, aspect: 'tall'   },
    { char: 'キ', reading: 'ki',  name: 'Katakana Ki',  strokes: 3, columns: 1, aspect: 'tall'   },
    { char: 'ク', reading: 'ku',  name: 'Katakana Ku',  strokes: 2, columns: 1, aspect: 'square' },
    { char: 'ケ', reading: 'ke',  name: 'Katakana Ke',  strokes: 3, columns: 2, aspect: 'tall'   },
    { char: 'コ', reading: 'ko',  name: 'Katakana Ko',  strokes: 2, columns: 1, aspect: 'wide'   },
    { char: 'サ', reading: 'sa',  name: 'Katakana Sa',  strokes: 3, columns: 1, aspect: 'tall'   },
    { char: 'シ', reading: 'shi', name: 'Katakana Shi', strokes: 3, columns: 2, aspect: 'tall'   },

    // ---- Kanji (12) ----
    { char: '一', reading: 'ichi', name: 'Kanji One',   strokes: 1, columns: 1, aspect: 'wide'   },
    { char: '二', reading: 'ni',   name: 'Kanji Two',   strokes: 2, columns: 1, aspect: 'wide'   },
    { char: '三', reading: 'san',  name: 'Kanji Three', strokes: 3, columns: 1, aspect: 'wide'   },
    { char: '四', reading: 'yon',  name: 'Kanji Four',  strokes: 5, columns: 1, aspect: 'square' },
    { char: '五', reading: 'go',   name: 'Kanji Five',  strokes: 4, columns: 1, aspect: 'square' },
    { char: '六', reading: 'roku', name: 'Kanji Six',   strokes: 4, columns: 2, aspect: 'square' },
    { char: '七', reading: 'nana', name: 'Kanji Seven', strokes: 2, columns: 1, aspect: 'square' },
    { char: '八', reading: 'hachi',name: 'Kanji Eight', strokes: 2, columns: 2, aspect: 'wide'   },
    { char: '九', reading: 'kyuu', name: 'Kanji Nine',  strokes: 2, columns: 1, aspect: 'square' },
    { char: '十', reading: 'juu',  name: 'Kanji Ten',   strokes: 2, columns: 1, aspect: 'square' },
    { char: '木', reading: 'ki',   name: 'Kanji Tree',  strokes: 4, columns: 1, aspect: 'square' },
    { char: '火', reading: 'hi',   name: 'Kanji Fire',  strokes: 4, columns: 2, aspect: 'square' },
];