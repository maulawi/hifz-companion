"""Colour-to-alpha: remove the flat off-white background from the official QURRA
logo without changing any logo colour or proportion. Pixels composite back onto
the original background colour exactly (GIMP 'color to alpha' algorithm)."""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float64)
# Background sampled from the four corners of the supplied logo.
corners = np.array([im[5, 5], im[5, -6], im[-6, 5], im[-6, -6]])
bg = corners.mean(0)
diff = im - bg
# The logo contains nothing lighter than its paper, so alpha is measured from
# darkening only; brighter-than-paper pixels are compression noise.
alpha = (np.clip(-diff, 0, None) / bg).max(axis=2)
alpha = np.clip((alpha - 0.03) / (1 - 0.03), 0, 1)  # remove faint paper noise
safe = np.maximum(alpha, 1e-6)[..., None]
rgb = np.clip(bg + np.minimum(diff, 0) / safe, 0, 255)
out = np.dstack([rgb, alpha * 255]).round().astype(np.uint8)
Image.fromarray(out, "RGBA").save(dst, optimize=True)
print("background", bg.round(1), "->", dst)

# Trim to the visible artwork (+ padding) so layout math uses the real logo box.
img = Image.open(dst)
x0, y0, x1, y1 = img.getchannel("A").point(lambda v: 255 if v > 3 else 0).getbbox()
pad = 24
img.crop((max(x0 - pad, 0), max(y0 - pad, 0), min(x1 + pad, img.width), min(y1 + pad, img.height))).save(dst, optimize=True)
print("trimmed size", Image.open(dst).size)
