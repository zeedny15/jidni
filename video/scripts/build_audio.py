#!/usr/bin/env python3
"""Build narration (espeak-ng + MBROLA id1, Bahasa Indonesia), timeline, subtitles, music.

Usage: python3 scripts/build_audio.py   (run from video/)
Outputs:
  public/timeline.json      scene + line timings (frames @30fps) consumed by Remotion
  build/narration.wav
  build/music.wav
  out/subtitles.srt, out/narration_script.md
"""
import json, os, re, subprocess, wave, hashlib, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
PROSODY = os.environ.get('PROSODY', '1') == '1'   # lebih ekspresif (lihat scripts/prosody.py)

FPS = 30
GAP = 0.32
SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
os.makedirs('build', exist_ok=True)
os.makedirs('out', exist_ok=True)
CACHE = 'build/tts'
os.makedirs(CACHE, exist_ok=True)

VOICE = os.environ.get('VOICE', 'piper')          # 'piper' (neural, default) or an espeak voice e.g. 'mb-id1'
SPEED = int(os.environ.get('SPEED', '158'))          # espeak fallback only
LENGTH_SCALE = float(os.environ.get('LENGTH_SCALE', '0.78'))  # piper: <1 = faster speech
PIPER_MODEL = os.path.join(ROOT, 'build/models/vits-piper-id_ID-news_tts-medium/id_ID-news_tts-medium.onnx')
_piper = None
def piper_voice():
    global _piper
    if _piper is None:
        from piper import PiperVoice
        _piper = PiperVoice.load(PIPER_MODEL)
    return _piper

sb = json.loads(subprocess.check_output(
    ['node', '-e', "import('./storyboard.mjs').then(m=>console.log(JSON.stringify({chapters:m.chapters,scenes:m.scenes})))"]))

# ---------- text normalisation for TTS ----------
LETTERS = dict(A='a', B='be', C='ce', D='de', E='e', F='ef', G='ge', H='ha', I='i', K='ka', L='el', M='em',
               N='en', O='o', P='pe', R='er', S='es', T='te', V='fe')
def spell(w):
    return ' '.join(LETTERS.get(c, c) for c in w)

REPL = [
    (r'Vascular Physiology', 'Veskuler Fisiolodji'),
    (r'\bCN XII\b', 'saraf kranial dua belas'), (r'\bCN VII\b', 'saraf kranial tujuh'),
    (r'\bCN IX\b', 'saraf kranial sembilan'), (r'\bCN X\b', 'saraf kranial sepuluh'),
    (r'angiotensin II', 'angiotensin dua'), (r'angiotensin I\b', 'angiotensin satu'),
    (r'Angiotensin II', 'Angiotensin dua'),
    (r'CO₂', 'ce o dua'), (r'O₂', 'o dua'), (r'Ca²⁺', 'kalsium'), (r'H⁺', 'ion hidrogen'),
    (r'K⁺', 'kalium'), (r'Na⁺', 'natrium'), (r'PGI₂', 'pe ge i dua'), (r'H₂', 'ha dua'),
    (r'r⁴', 'er pangkat empat'), (r'ΔP', 'delta pe'), (r'πif', 'pi i ef'), (r'πp', 'pi pe'),
    (r'\bPif\b', 'pe i ef'), (r'\bPc\b', 'pe ce'), (r'π', 'pi'), (r'η', 'eta'),
    (r'(\d+),(\d+) mm\b', r'\1 koma \2 milimeter'),
    (r'µm', 'mikrometer'), (r'm²', 'meter persegi'), (r'(\d) cm\b', r'\1 sentimeter'),
    (r'mmHg', 'milimeter air raksa'), (r'(\d+)%', r'\1 persen'),
    (r'\b1/16\b', 'seperenam belas'), (r'\b1/8\b', 'seperdelapan'), (r'\b1/4\b', 'seperempat'), (r'\b1/2\b', 'setengah'),
    (r'(\d+)/(\d+)', r'\1 per \2'),
    (r'bulk flow', 'balk flo'), (r'shear stress', 'syier stres'), (r'closed loop', 'klost lup'),
    (r'recoil', 'rikoil'), (r'baroreflex', 'barorefleks'), (r'Baroreflex', 'Barorefleks'),
    (r'kemoreflex', 'kemorefleks'), (r'Korotkoff', 'Korotkof'), (r'Poiseuille', 'Puasei'),
    (r'Frank Starling', 'Frank Starling'), (r'Fick', 'Fik'),
    (r'\bMAP-lah\b', 'em a pe lah'), (r'\bMAP-nya\b', 'em a pe nya'),
    (r'→', ', '), (r'~', 'sekitar '), (r'>', 'lebih dari '), (r'<', 'kurang dari '), (r'×', ' kali '),
    (r'—', ', '), (r'–', ' sampai '),
]
ACRO = ['MAP', 'TPR', 'CO', 'ADH', 'ANP', 'BNP', 'RAAS', 'ACE', 'NO', 'SA', 'SV', 'HR', 'PP']

def tts_text(s):
    for a, b in REPL:
        s = re.sub(a, b, s)
    for w in ACRO:
        s = re.sub(r'\b%s\b' % w, spell(w), s)
    s = s.replace('/', ' per ')
    return s

# ---------- synthesis ----------
def synth(text):
    key = hashlib.md5(f'{VOICE}|{SPEED}|{LENGTH_SCALE}|{PROSODY}v1|{text}'.encode()).hexdigest()
    path = f'{CACHE}/{key}.wav'
    if not os.path.exists(path):
        raw = path + '.raw.wav'
        if VOICE == 'piper':
            from piper.config import SynthesisConfig
            with wave.open(raw, 'wb') as w:
                ls = LENGTH_SCALE * (0.94 if text.strip().endswith('!') else 1.0)
                piper_voice().synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=ls, noise_scale=0.8, noise_w_scale=1.0))
            if PROSODY:
                from prosody import liven
                with wave.open(raw) as w:
                    sr0 = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
                y = liven(x, sr0, text)
                with wave.open(raw, 'wb') as w:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr0); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
        else:
            subprocess.run(['espeak-ng', '-v', VOICE, '-s', str(SPEED), '-p', '48', '-g', '2', '-w', raw, text],
                           check=True, stderr=subprocess.DEVNULL)
        # resample to 48k mono, light EQ + gentle compression for a warmer voice
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af',
                        'highpass=f=70,equalizer=f=200:t=q:w=1:g=2,acompressor=threshold=-18dB:ratio=2.5:attack=5:release=80',
                        '-ar', str(SR), '-ac', '1', path], check=True)
        os.remove(raw)
    with wave.open(path) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    # trim leading/trailing silence
    nz = np.where(np.abs(data) > 0.01)[0]
    if len(nz):
        data = data[max(0, nz[0] - 800): nz[-1] + 1600]
    return data

# ---------- timeline ----------
def split_sub(s, maxc=105):
    """split subtitle text into display chunks"""
    if len(s) <= maxc:
        return [s]
    parts = re.split(r'(?<=[.:;?!])\s+', s)
    chunks, cur = [], ''
    for p in parts:
        if len(p) > maxc:
            sub = re.split(r'(?<=,)\s+', p)
        else:
            sub = [p]
        for q in sub:
            if cur and len(cur) + 1 + len(q) > maxc:
                chunks.append(cur); cur = q
            else:
                cur = (cur + ' ' + q).strip()
    if cur:
        chunks.append(cur)
    out = []
    for c in chunks:  # hard wrap if still too long
        while len(c) > maxc + 30:
            cut = c.rfind(' ', 0, maxc)
            out.append(c[:cut]); c = c[cut + 1:]
        out.append(c)
    return out

timeline = {'fps': FPS, 'scenes': [], 'chapters': sb['chapters']}
segments = []  # (start_sample, data)
subs = []
t = 0.0
script_md = ['# Naskah Narasi — Fisiologi Vaskular\n',
             '_Baris bertanda **[Klarifikasi]** adalah tambahan penjelasan ilmiah, bukan isi slide._\n']
cur_ch = None
for sc in sb['scenes']:
    title = sc['v'] == 'ChapterTitle'
    lead = 1.2 if title else 0.5
    tail = 1.4 if title else 0.7
    s0 = t
    t += lead
    lines = []
    if sc['ch'] != cur_ch:
        cur_ch = sc['ch']
        script_md.append(f"\n## Bab {cur_ch}: {sb['chapters'][cur_ch]['title']}\n")
    script_md.append(f"\n### Scene `{sc['id']}` — visual: {sc['v']}" + (f" (PPT hlm {sc['src']})" if sc.get('src') else '') + '\n')
    for ln in sc['lines']:
        if isinstance(ln, str):
            ln = {'s': ln}
        if ln.get('silent'):
            d = ln['silent']
            lines.append({'from': round(t * FPS) - round(s0 * FPS), 'dur': round(d * FPS), 's': '', 'x': 0, 'silent': 1})
            t += d
            continue
        say = tts_text(ln.get('say', ln['s']))
        data = synth(say)
        dur = len(data) / SR
        segments.append((int(t * SR), data))
        lines.append({'from': round(t * FPS) - round(s0 * FPS), 'dur': round(dur * FPS), 's': ln['s'], 'x': ln.get('x', 0)})
        # subtitle chunks proportional to length
        chunks = split_sub(ln['s'])
        total = sum(len(c) for c in chunks)
        ct = t
        for c in chunks:
            cd = dur * len(c) / total
            subs.append((ct, ct + cd, c, ln.get('x', 0)))
            ct += cd
        script_md.append(('- **[Klarifikasi]** ' if ln.get('x') else '- ') + ln['s'])
        t += dur + GAP + ln.get('pauseAfter', 0)
    t += tail - GAP
    f0 = round(s0 * FPS)
    timeline['scenes'].append({'id': sc['id'], 'ch': sc['ch'], 'v': sc['v'], 'p': sc.get('p', {}),
                               'src': sc.get('src', ''), 'notes': sc.get('notes', []),
                               'from': f0, 'dur': round(t * FPS) - f0, 'lines': lines})

total_s = t
timeline['total'] = round(total_s * FPS)
timeline['subs'] = [{'from': round(a * FPS), 'to': round(b * FPS), 's': s, 'x': x} for a, b, s, x in subs]

# narration track
N = int(total_s * SR) + SR
narr = np.zeros(N, dtype=np.float32)
for st, d in segments:
    narr[st:st + len(d)] += d
peak = np.max(np.abs(narr)) or 1
narr = narr / peak * 0.89

# ---------- background music: soft ambient pad (procedural, royalty-free) ----------
def pad_music(n):
    tt = np.arange(n) / SR
    out = np.zeros(n, dtype=np.float32)
    # A minor – F – C – G, 8 s per chord
    chords = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]
    seg = 8.0
    rng = np.random.default_rng(1)
    for i in range(int(n / SR / seg) + 1):
        a, b = int(i * seg * SR), min(n, int((i + 1) * seg * SR + 2 * SR))
        if a >= n:
            break
        ts = tt[a:b] - tt[a]
        env = np.minimum(1, ts / 2.5) * np.minimum(1, np.maximum(0, (seg + 2 - ts) / 2.5))
        for m in chords[i % 4]:
            f = 440 * 2 ** ((m - 69) / 12)
            det = 1 + rng.uniform(-0.002, 0.002)
            w = (np.sin(2 * np.pi * f * det * ts) + 0.35 * np.sin(2 * np.pi * 2 * f * ts + 1) + 0.12 * np.sin(2 * np.pi * 3 * f * ts))
            out[a:b] += (w * env * 0.05).astype(np.float32)
        # soft bass
        fb = 440 * 2 ** ((chords[i % 4][0] - 12 - 69) / 12)
        out[a:b] += (np.sin(2 * np.pi * fb * ts) * env * 0.06).astype(np.float32)
    # slow tremolo for movement
    out *= (0.85 + 0.15 * np.sin(2 * np.pi * 0.07 * tt)).astype(np.float32)
    return out

music = pad_music(N)
music = music / (np.max(np.abs(music)) or 1)
# duck under narration
def movavg(x, k):
    c = np.cumsum(np.concatenate([[0], x.astype(np.float64)]))
    y = (c[k:] - c[:-k]) / k
    pad = len(x) - len(y)
    return np.concatenate([np.full(pad // 2, y[0]), y, np.full(pad - pad // 2, y[-1])]).astype(np.float32)
envn = movavg(np.abs(narr), SR // 4)
duck = np.where(envn > 0.01, 0.07, 0.12).astype(np.float32)
duck = movavg(duck, SR // 2)
music_track = music * duck
fade = int(3 * SR)
music_track[:fade] *= np.linspace(0, 1, fade)
music_track[-fade:] *= np.linspace(1, 0, fade)

def wwrite(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

wwrite('build/narration.wav', narr)
wwrite('build/music.wav', music_track)
json.dump(timeline, open('public/timeline.json', 'w'), ensure_ascii=False)

def ts(sec):
    ms = int(round(sec * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
with open('out/subtitles.srt', 'w') as f:
    for i, (a, b, s, x) in enumerate(subs, 1):
        f.write(f'{i}\n{ts(a)} --> {ts(b)}\n{s}\n\n')
open('out/narration_script.md', 'w').write('\n'.join(script_md) + '\n')

chap = {}
for s in timeline['scenes']:
    chap.setdefault(s['ch'], 0); chap[s['ch']] += s['dur'] / FPS
print(f'Total: {total_s/60:.2f} min, scenes={len(timeline["scenes"])}, subs={len(subs)}')
for k, v in chap.items():
    print(f'  ch{k}: {v/60:.2f} min')
