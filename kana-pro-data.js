// KANA PRO — plain character data. No stroke coordinates on purpose: Kana
// Pro renders each candidate directly from a real font at recognition time,
// so adding a new entry here is all that's needed to make it recognizable.
//
// Prototype scope: first 12 hiragana only (あ–こ). To extend later, just
// append more {char, reading, name} objects — nothing else needs to change.
const KANA_PRO_DATASET = [
    { char: 'あ', reading: 'a',  name: 'Hiragana A'  },
    { char: 'い', reading: 'i',  name: 'Hiragana I'  },
    { char: 'う', reading: 'u',  name: 'Hiragana U'  },
    { char: 'え', reading: 'e',  name: 'Hiragana E'  },
    { char: 'お', reading: 'o',  name: 'Hiragana O'  },
    { char: 'か', reading: 'ka', name: 'Hiragana Ka' },
    { char: 'き', reading: 'ki', name: 'Hiragana Ki' },
    { char: 'く', reading: 'ku', name: 'Hiragana Ku' },
    { char: 'け', reading: 'ke', name: 'Hiragana Ke' },
    { char: 'こ', reading: 'ko', name: 'Hiragana Ko' },
    { char: 'さ', reading: 'sa', name: 'Hiragana Sa' },
    { char: 'し', reading: 'shi',name: 'Hiragana Shi'},
];
