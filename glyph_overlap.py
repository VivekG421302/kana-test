import json, math
from PIL import Image, ImageDraw, ImageFont

CANVAS = 300
FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"

with open('dataset.json') as f:
    DATASET = json.load(f)

# Noto Sans CJK ttc has multiple faces (JP, KR, SC, TC, HK) - find the JP one
def get_jp_font(size):
    for idx in range(6):
        try:
            f = ImageFont.truetype(FONT_PATH, size, index=idx)
            if 'JP' in f.getname()[0]:
                return f
        except Exception:
            continue
    return ImageFont.truetype(FONT_PATH, size, index=0)

font = get_jp_font(240)

def render_glyph_mask(char):
    img = Image.new('L', (CANVAS, CANVAS), 0)
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0,0), char, font=font)
    w = bbox[2]-bbox[0]; h = bbox[3]-bbox[1]
    x = (CANVAS - w)/2 - bbox[0]
    y = (CANVAS - h)/2 - bbox[1]
    draw.text((x,y), char, font=font, fill=255)
    return img

def render_strokes_mask(refStrokes):
    img = Image.new('L', (CANVAS, CANVAS), 0)
    draw = ImageDraw.Draw(img)
    for stroke in refStrokes:
        pts = [(p['x'], p['y']) for p in stroke]
        if len(pts) >= 2:
            draw.line(pts, fill=255, width=14, joint='curve')
        for p in pts:
            draw.ellipse([p[0]-7,p[1]-7,p[0]+7,p[1]+7], fill=255)
    return img

def iou(a, b):
    import numpy as np
    A = (np.array(a) > 0)
    B = (np.array(b) > 0)
    inter = (A & B).sum()
    union = (A | B).sum()
    return inter/union if union else 0

results = []
for entry in DATASET:
    try:
        gm = render_glyph_mask(entry['char'])
        sm = render_strokes_mask(entry['refStrokes'])
        score = iou(gm, sm)
        results.append({'char': entry['char'], 'name': entry['name'], 'type': entry['type'], 'iou': score})
    except Exception as e:
        results.append({'char': entry['char'], 'name': entry['name'], 'type': entry['type'], 'iou': None, 'error': str(e)})

results.sort(key=lambda r: (r['iou'] if r['iou'] is not None else -1))

with open('glyph-overlap-results.json','w') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Total:", len(results))
valid = [r for r in results if r['iou'] is not None]
import statistics
ious = [r['iou'] for r in valid]
print("Mean IoU:", round(statistics.mean(ious),3), "Median:", round(statistics.median(ious),3))
print("\nWorst 30 (lowest overlap with real glyph):")
for r in results[:30]:
    print(f"  {r['char']} ({r['name']}, {r['type']}): IoU={r['iou']:.3f}" if r['iou'] is not None else f"  {r['char']} ERROR {r.get('error')}")

print("\nBest 10 (for calibration/sanity):")
for r in results[-10:]:
    print(f"  {r['char']} ({r['name']}, {r['type']}): IoU={r['iou']:.3f}")
