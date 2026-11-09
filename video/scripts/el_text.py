"""Prepare per-scene narration text for ElevenLabs (keeps English terms; expands symbols/units)."""
import json, re, subprocess
src = open('scripts/build_audio.py').read()
ns = {'re': re}; exec(src[src.index('LETTERS = dict'):src.index('# ---------- synthesis')], ns)
PHON = {'Veskuler Fisiolodji', 'balk flo', 'syier stres', 'klost lup', 'rikoil', 'barorefleks', 'Barorefleks', 'kemorefleks', 'Korotkof', 'Puasei', 'Fik'}
ns['REPL'][:] = [(a, b) for a, b in ns['REPL'] if b not in PHON]
sb = json.loads(subprocess.check_output(['node', '-e', "import('./storyboard.mjs').then(m=>console.log(JSON.stringify(m.scenes)))"]))
out = {}
for s in sb:
    L = []
    for l in s['lines']:
        if isinstance(l, str): l = {'s': l}
        if l.get('silent'): continue
        L.append(ns['tts_text'](l.get('say', l['s'])))
    out[s['id']] = L
json.dump(out, open('build/el_text.json', 'w'), ensure_ascii=False, indent=0)
print(sum(len(x) for v in out.values() for x in v))
