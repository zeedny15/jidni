"""Find sentence boundaries in a scene's ElevenLabs audio.
For each line boundary, the expected time comes from character proportions; the closest pause
(>=0.12 s) to it is chosen. usage: el_split.py file.mp3 'line1' 'line2' ..."""
import sys, numpy as np, subprocess
def load(p, sr=16000):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', p, '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768, sr
def segments(p, lines):
    n = len(lines)
    x, sr = load(p)
    hop = int(sr * 0.01)
    e = np.sqrt(np.convolve(x ** 2, np.ones(hop * 3) / (hop * 3), 'same'))[::hop]
    thr = max(0.008, np.percentile(e, 95) * 0.06)
    speech = e > thr
    idx = np.where(speech)[0]; s0, s1 = idx[0], idx[-1]
    gaps = []; i = s0
    while i < s1:
        if not speech[i]:
            j = i
            while j < s1 and not speech[j]: j += 1
            if j - i >= 12: gaps.append((i, j))
            i = j
        else: i += 1
    L = [max(1, len(l)) for l in lines]; tot = sum(L)
    chosen = []; last = s0
    for k in range(1, n):
        exp = s0 + (s1 - s0) * sum(L[:k]) / tot
        cand = [g for g in gaps if g[0] > last and (not chosen or g != chosen[-1])]
        # weight: closeness to expected time, bonus for longer pauses
        best = min(cand, key=lambda g: abs((g[0] + g[1]) / 2 - exp) - 3 * (g[1] - g[0])) if cand else (int(exp), int(exp))
        chosen.append(best); last = best[1]
    b = [s0] + [v for g in chosen for v in g] + [s1]
    segs = [(b[2 * k] / 100, b[2 * k + 1] / 100) for k in range(n)]
    return segs, len(x) / sr
if __name__ == '__main__':
    segs, dur = segments(sys.argv[1], sys.argv[2:])
    print(f'dur={dur:.2f}'); [print(f'{a:.2f}-{b:.2f}') for a, b in segs]
