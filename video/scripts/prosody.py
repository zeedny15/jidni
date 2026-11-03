"""Make flat TTS speech livelier: expand intonation, add exclamation/question contours,
brighten pitch slightly. Uses the WORLD vocoder (pyworld)."""
import numpy as np, pyworld as pw, hashlib

def liven(x, sr, text, expand=1.7, shift_st=1.5, seed=None):
    x = x.astype(np.float64)
    fp = 5.0
    f0, t = pw.harvest(x, sr, f0_floor=70, f0_ceil=500, frame_period=fp)
    sp = pw.cheaptrick(x, f0, t, sr)
    ap = pw.d4c(x, f0, t, sr)
    v = f0 > 0
    if v.sum() < 5:
        return x.astype(np.float32)
    lf = np.log2(np.where(v, f0, 1.0))
    med = np.median(lf[v])
    # smooth the voiced contour, expand deviations from the median (bigger rises & falls)
    dev = np.where(v, lf - med, 0.0)
    out = med + dev * expand
    n = len(f0); u = np.arange(n) / max(1, n - 1)
    rng = np.random.default_rng(int(hashlib.md5(text.encode()).hexdigest()[:8], 16) if seed is None else seed)
    st = shift_st + rng.uniform(-0.8, 0.8)           # each line slightly different key
    s = text.strip()
    if s.endswith('!'):
        st += 1.0
        out += (np.clip((u - 0.55) / 0.45, 0, 1) * np.sin(np.clip((u - 0.55) / 0.45, 0, 1) * np.pi)) * 2.5 / 12
    if s.endswith('?'):
        out += np.clip((u - 0.75) / 0.25, 0, 1) ** 1.5 * 4.0 / 12   # rising question
    # gentle phrase "hat" so sentences start lively and settle at the end
    out += (0.6 * np.sin(np.pi * u) - 0.4 * u) / 12
    out += st / 12
    nf0 = np.where(v, 2 ** out, 0.0)
    y = pw.synthesize(nf0, sp, ap, sr, frame_period=fp)
    y = y / (np.max(np.abs(y)) + 1e-9) * 0.9
    return y.astype(np.float32)
