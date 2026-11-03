// Render one still per scene (at given fraction) for visual QA. usage: node scripts/stills.mjs 0.85 [id,id]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'fs';
const frac = parseFloat(process.argv[2] || '0.85');
const only = process.argv[3] ? process.argv[3].split(',') : null;
const tl = JSON.parse(fs.readFileSync('public/timeline.json', 'utf8'));
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({ entryPoint: 'src/index.ts' });
const composition = await selectComposition({ serveUrl, id: 'Vascular', browserExecutable });
fs.mkdirSync('out/qa', { recursive: true });
for (const s of tl.scenes) {
  if (only && !only.includes(s.id)) continue;
  const frame = Math.floor(s.from + s.dur * frac);
  await renderStill({ serveUrl, composition, frame, output: `out/qa/${String(tl.scenes.indexOf(s)).padStart(2, '0')}_${s.id}_${frac}.jpg`, imageFormat: 'jpeg', jpegQuality: 70, browserExecutable, scale: 0.5 });
}
console.log('done');
