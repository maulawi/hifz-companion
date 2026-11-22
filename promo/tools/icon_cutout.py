"""Remove the white background visible only at the rounded corners of an app
icon tile. Flood-fills near-white pixels from the four image corners (so the
cream tile itself is never touched), then softens the edge by 1 px."""
import sys
from PIL import Image, ImageDraw, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
w, h = im.size
marker = (255, 0, 255)
work = im.copy()
for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
    if sum(abs(c - 254) for c in work.getpixel(seed)) <= 18:
        ImageDraw.floodfill(work, seed, marker, thresh=14)
mask = Image.new("L", (w, h), 255)
px, mpx = work.load(), mask.load()
for y in range(h):
    for x in range(w):
        if px[x, y] == marker:
            mpx[x, y] = 0
mask = mask.filter(ImageFilter.GaussianBlur(0.8))
out = im.convert("RGBA")
out.putalpha(mask)
out.save(dst, optimize=True)
print("saved", dst, out.size)
