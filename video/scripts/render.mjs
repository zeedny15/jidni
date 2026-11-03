// Render the video in chunks (one per chapter) so progress is preserved. usage: node scripts/render.mjs [chapter...]
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'fs';
const tl = JSON.parse(fs.readFileSync('public/timeline.json', 'utf8'));
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const want = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: 'src/index.ts' });
const composition = await selectComposition({ serveUrl, id: 'Vascular', browserExecutable });
fs.mkdirSync('out/chunks', { recursive: true });
for (let ch = 0; ch <= 7; ch++) {
  if (want.length && !want.includes(ch)) continue;
  const sc = tl.scenes.filter((s) => s.ch === ch);
  const a = sc[0].from, b = sc[sc.length - 1].from + sc[sc.length - 1].dur - 1;
  const out = `out/chunks/ch${ch}.mp4`;
  if (fs.existsSync(out) && !want.length) { console.log('skip', out); continue; }
  const t0 = Date.now();
  await renderMedia({ serveUrl, composition, codec: 'h264', outputLocation: out + '.tmp.mp4', frameRange: [a, b], browserExecutable,
    concurrency: 4, imageFormat: 'jpeg', jpegQuality: 90, crf: 20, muted: true, x264Preset: 'medium',
    onProgress: ({ progress }) => { if (Math.round(progress * 100) % 10 === 0) process.stdout.write(`\rch${ch} ${Math.round(progress * 100)}%   `); } });
  fs.renameSync(out + '.tmp.mp4', out);
  console.log(`\nch${ch} done: ${b - a + 1} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
