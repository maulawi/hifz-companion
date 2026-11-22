"""Original sound design for the QURRA Hifz Lab promo — synthesised from scratch
(numpy only), so every sound is fully owned and licence-free.

Usage: python3 tools/sfx_synth.py public/audio
Writes sfx/*.wav (UI / motion sounds) and music/hifzlab-bed.wav (ambient bed).
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def write(path: Path, x: np.ndarray, peak: float = 0.9):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t(dur):
    return np.arange(int(SR * dur)) / SR


def env(n, attack, release, curve=3.0):
    a = int(SR * attack)
    e = np.ones(n)
    if a > 0:
        e[:a] = np.linspace(0, 1, a) ** 2
    r = n - a
    e[a:] = np.exp(-curve * np.linspace(0, 1, r)) * (1 - np.linspace(0, 1, r) ** 4) if release else 1
    return e


def onepole_lp(x, cutoff):
    """One-pole low-pass; cutoff may be an array (Hz per sample)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=np.float64), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def hp(x, cutoff):
    return x - onepole_lp(x, cutoff)


def fft_band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    w = np.clip((f - lo) / (lo * 0.5 + 1), 0, 1) * np.clip((hi - f) / (hi * 0.5 + 1), 0, 1)
    return np.fft.irfft(X * w, len(x))


def reverb(x, seconds=2.2, mix=0.35, damp=4000):
    """Convolution with a decaying, damped noise impulse (stereo decorrelated)."""
    n = int(SR * seconds)
    out = []
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-6.0 * np.linspace(0, 1, n))
        ir = onepole_lp(ir, damp) if n < SR * 3 else fft_band(ir, 60, damp)
        ir /= np.sqrt(np.sum(ir**2))
        L = len(x) + n
        y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)
        out.append(y)
    wet = np.stack(out, axis=1)
    dry = np.stack([np.pad(x, (0, n))] * 2, axis=1)
    return dry * (1 - mix) + wet * mix * 3


# ───────────────────────── UI / motion sounds ─────────────────────────

def whoosh(dur=0.9, lo=250, hi=3200, brightness=1.0):
    n = len(t(dur))
    noise = rng.standard_normal(n)
    sweep = np.concatenate([np.linspace(lo, hi, n // 2), np.linspace(hi, lo * 0.8, n - n // 2)]) * brightness
    x = onepole_lp(noise, sweep)
    x = hp(x, 120)
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return reverb(x * e, 1.2, 0.25)


def page_turn():
    dur = 0.75
    n = len(t(dur))
    noise = rng.standard_normal(n)
    flutter = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * np.cumsum(np.linspace(9, 26, n)) / SR))
    x = hp(onepole_lp(noise, 5500), 700) * flutter
    e = env(n, 0.05, True, 2.5) * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.5
    thump = np.sin(2 * np.pi * 95 * t(dur)) * np.exp(-30 * t(dur)) * 0.5
    return reverb(x * e + thump, 0.9, 0.2)


def chime(f0=880, dur=2.4, partials=(1, 2.01, 3.03, 4.2), amps=(1, 0.45, 0.22, 0.1)):
    tt = t(dur)
    x = sum(a * np.sin(2 * np.pi * f0 * p * tt * (1 + 0.0015 * np.sin(2 * np.pi * 4 * tt))) * np.exp(-tt * (2.2 + p)) for p, a in zip(partials, amps))
    x *= np.minimum(1, tt / 0.006)
    return reverb(x, 2.6, 0.45, 6000)


def shimmer(dur=1.8, base=1318.5):
    tt = t(dur)
    notes = [base, base * 1.25, base * 1.5, base * 2]
    x = np.zeros_like(tt)
    for i, f in enumerate(notes):
        start = int(SR * i * 0.06)
        seg = tt[: len(tt) - start]
        x[start:] += np.sin(2 * np.pi * f * seg) * np.exp(-seg * 3.2) * (0.8 - i * 0.12)
    air = hp(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 4) * 0.05
    return reverb((x + air) * np.minimum(1, tt / 0.01), 2.8, 0.5, 7000)


def tick(freq=2400, dur=0.25):
    tt = t(dur)
    x = np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 70)
    x += hp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 300) * 0.3
    return reverb(x, 0.6, 0.18)


def tap():
    a = tick(1700, 0.2)
    b = tick(2300, 0.2)
    off = int(SR * 0.07)
    out = np.zeros((max(len(a), len(b) + off), 2))
    out[: len(a)] += a
    out[off : off + len(b)] += b * 0.7
    return out


def pop(freq=180, dur=0.35):
    tt = t(dur)
    f = freq * (1 + 0.6 * np.exp(-tt * 40))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18)
    x += hp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 120) * 0.12
    return reverb(x, 0.7, 0.2)


def swell(dur=2.4):
    tt = t(dur)
    n = len(tt)
    rise = np.linspace(0, 1, n) ** 2
    noise = onepole_lp(rng.standard_normal(n), 300 + 2500 * rise)
    tone = sum(np.sin(2 * np.pi * f * tt) for f in (73.4, 110, 146.8)) * 0.25
    e = rise * (1 - np.linspace(0, 1, n) ** 12)
    return reverb((noise * 0.5 + tone) * e, 2.0, 0.4)


def sweep_line(dur=1.2):
    """Soft rising tonal sweep for lines / timelines drawing on."""
    tt = t(dur)
    f = 440 * 2 ** (np.linspace(0, 1, len(tt)))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * np.linspace(0, 1, len(tt))) ** 2 * 0.4
    return reverb(x, 1.8, 0.45, 5000)


# ───────────────────────── Ambient music bed ─────────────────────────

def bed(seconds=100.0):
    """Slow, warm pad: D – Bm – G – A(sus) cycle, 8 s per chord, soft swells."""
    n = int(SR * seconds)
    tt = np.arange(n) / SR
    chords = [
        [146.83, 220.0, 293.66, 369.99, 440.0],  # D(add)
        [123.47, 185.0, 246.94, 293.66, 369.99],  # Bm
        [98.0, 196.0, 246.94, 293.66, 392.0],  # G
        [110.0, 220.0, 277.18, 329.63, 440.0],  # A
    ]
    length = 8.0
    out = np.zeros(n)
    for k in range(int(seconds / length) + 2):
        c = chords[k % 4]
        start = int(SR * (k * length - 1.0))
        dur = int(SR * (length + 2.0))
        s0 = max(start, 0)
        s1 = min(start + dur, n)
        if s1 <= s0:
            continue
        lt = (np.arange(s0, s1) - start) / SR
        e = np.sin(np.pi * np.clip(lt / (length + 2.0), 0, 1)) ** 1.5
        seg = np.zeros(s1 - s0)
        for i, f in enumerate(c):
            det = 1 + 0.002 * (i - 2)
            seg += (np.sin(2 * np.pi * f * det * lt) + 0.3 * np.sin(2 * np.pi * f * 2.003 * lt)) / (1 + i * 0.35)
        out[s0:s1] += seg * e
    out = fft_band(out, 50, 2200)
    # gentle high sparkle notes every 4 s
    for k in range(int(seconds / 4)):
        f = [587.33, 739.99, 880.0, 659.25][k % 4]
        s0 = int(SR * (k * 4 + 2))
        lt = np.arange(min(int(SR * 3), n - s0)) / SR
        out[s0 : s0 + len(lt)] += 0.12 * np.sin(2 * np.pi * f * lt) * np.exp(-lt * 1.4)
    st = reverb(out, 3.5, 0.5, 3000)[:n]
    fade = np.minimum(1, tt / 3.0) * np.minimum(1, (seconds - tt) / 4.0)
    return st * fade[:, None]


if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public/audio")
    sfx = {
        "whoosh-soft": whoosh(0.9, 250, 2600),
        "whoosh-wide": whoosh(1.3, 180, 3600),
        "whoosh-short": whoosh(0.5, 400, 3000),
        "page-turn": page_turn(),
        "chime-low": chime(587.33),
        "chime-high": chime(880.0, 2.0),
        "shimmer": shimmer(),
        "tick": tick(),
        "tick-soft": tick(2000, 0.2),
        "tap": tap(),
        "pop": pop(),
        "pop-high": pop(260, 0.3),
        "swell": swell(),
        "sweep-line": sweep_line(),
    }
    for name, x in sfx.items():
        write(root / "sfx" / f"{name}.wav", x, 0.85)
        print("sfx", name, round(len(x) / SR, 2), "s")
    write(root / "music" / "hifzlab-bed.wav", bed(100.0), 0.8)
    print("music bed written")
