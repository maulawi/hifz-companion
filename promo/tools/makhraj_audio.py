"""Original sound for the Makhraj Lab film (numpy only; extends sfx_synth).
Usage: python3 tools/makhraj_audio.py public/audio
Writes sfx/impact-low.wav, sfx/gold-ping.wav, sfx/light-sweep.wav and
music/makhraj-bed.mp3 (via a temporary wav)."""
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from sfx_synth import SR, fft_band, onepole_lp, reverb, rng, t, write  # noqa: E402


def impact_low():
    tt = t(3.5)
    f = 46 * (1 + 0.9 * np.exp(-tt * 9))
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.6)
    thump = onepole_lp(rng.standard_normal(len(tt)), 220) * np.exp(-tt * 14) * 1.5
    return reverb((sub + thump) * np.minimum(1, tt / 0.004), 3.0, 0.35, 1500)


def gold_ping():
    tt = t(3.2)
    f0 = 1567.98
    parts = [(1.0, 1.0, 3.0), (2.76, 0.45, 5.0), (5.40, 0.22, 7.5), (8.93, 0.1, 10.0)]
    x = sum(a * np.sin(2 * np.pi * f0 * p * tt) * np.exp(-tt * d) for p, a, d in parts)
    return reverb(x * np.minimum(1, tt / 0.002), 3.0, 0.5, 9000)


def light_sweep():
    tt = t(1.6)
    n = len(tt)
    rise = np.linspace(0, 1, n)
    x = onepole_lp(rng.standard_normal(n), 1500 + 9000 * rise ** 1.5)
    x = x - onepole_lp(x, 1200)
    e = np.sin(np.pi * rise) ** 2
    return reverb(x * e, 1.6, 0.45, 9000)


def bed(seconds=72.0):
    """Dark, slowly evolving drone in D with soft lifts at the reveal and the ending."""
    n = int(SR * seconds)
    tt = np.arange(n) / SR
    drone = sum(a * np.sin(2 * np.pi * f * tt + ph) for f, a, ph in [(73.42, 1.0, 0), (110.0, 0.55, 1), (146.83, 0.35, 2), (220.0, 0.12, 3)])
    drone *= 0.75 + 0.25 * np.sin(2 * np.pi * tt / 11.0)
    pads = np.zeros(n)
    chords = [[293.66, 349.23, 440.0, 523.25], [261.63, 329.63, 392.0, 493.88], [233.08, 293.66, 349.23, 440.0], [261.63, 349.23, 440.0, 523.25]]
    for k in range(int(seconds / 9) + 1):
        c = chords[k % 4]
        s0 = int(SR * k * 9)
        dur = int(SR * 11)
        s1 = min(n, s0 + dur)
        lt = np.arange(s1 - s0) / SR
        env = np.sin(np.pi * np.clip(lt / 11, 0, 1)) ** 2
        for i, f in enumerate(c):
            pads[s0:s1] += np.sin(2 * np.pi * f * 1.0015 ** i * lt) * env / (1 + i * 0.5)
    pads = fft_band(pads, 120, 1800)
    air = fft_band(rng.standard_normal(n), 3000, 9000) * 0.02
    lift = np.clip((tt - 14.6) / 1.2, 0, 1) * np.clip((22 - tt) / 6, 0, 1) + np.clip((tt - 59.4) / 1.5, 0, 1)
    mix = drone * 0.5 + pads * (0.35 + 0.45 * lift) + air
    st = reverb(mix, 4.0, 0.45, 2500)[:n]
    fade = np.minimum(1, tt / 4.0) * np.minimum(1, (seconds - tt) / 3.0)
    return st * fade[:, None]


if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public/audio")
    for name, fn in {"impact-low": impact_low, "gold-ping": gold_ping, "light-sweep": light_sweep}.items():
        write(root / "sfx" / f"{name}.wav", fn(), 0.85)
        print("sfx", name)
    tmp = root / "music" / "makhraj-bed.wav"
    write(tmp, bed(), 0.8)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-b:a", "192k", str(root / "music" / "makhraj-bed.mp3")], check=True)
    tmp.unlink()
    print("music makhraj-bed.mp3")
