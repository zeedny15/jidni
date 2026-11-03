import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import timeline from '../public/timeline.json';
import { C, FONT, SceneCtx, SceneT, Bg } from './lib';
import { VISUALS } from './visuals';

const TL = timeline as any;
const CHAPTERS: { n: number; title: string }[] = TL.chapters;

const SceneFrame: React.FC<{ sc: SceneT }> = ({ sc }) => {
  const f = useCurrentFrame();
  const V = VISUALS[sc.v];
  const fadeIn = interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(f, [sc.dur - 10, sc.dur], [1, 0], { extrapolateLeft: 'clamp' });
  let step = 0; sc.lines.forEach((l, i) => { if (f >= l.from - 4) step = i; });
  const isX = sc.lines[step]?.x === 1 && f >= sc.lines[step].from - 4;
  const note = sc.notes.filter((n) => step >= n.at && f >= sc.lines[n.at].from)[0];
  const isTitle = sc.v === 'ChapterTitle' || sc.v === 'Cover';
  return (
    <SceneCtx.Provider value={sc}>
      <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut), fontFamily: FONT, color: C.text }}>
        {!isTitle && <Bg />}
        {V ? <V /> : <div style={{ fontSize: 60, padding: 200 }}>[{sc.v}]</div>}
        {/* header */}
        {!isTitle && sc.ch > 0 && sc.ch < 7 && <div style={{ position: 'absolute', left: 90, top: 34, fontSize: 24, color: C.dim, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
          Bab {sc.ch} · {CHAPTERS[sc.ch].title}
        </div>}
        {!isTitle && sc.ch === 7 && <div style={{ position: 'absolute', left: 90, top: 34, fontSize: 24, color: C.dim, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>Ringkasan & Latihan</div>}
        {sc.src && !isTitle && <div style={{ position: 'absolute', right: 60, top: 34, fontSize: 22, color: C.dim, background: 'rgba(255,255,255,0.06)', padding: '6px 16px', borderRadius: 12 }}>Sumber: PPT hlm {sc.src}</div>}
        {isX && <div style={{ position: 'absolute', right: 60, top: 82, fontSize: 24, color: '#0b1328', background: '#7dd3fc', padding: '8px 18px', borderRadius: 12, fontWeight: 700 }}>+ Klarifikasi tambahan (bukan isi slide)</div>}
        {note && <div style={{ position: 'absolute', right: 60, top: 140, width: 560, fontSize: 24, lineHeight: 1.35, color: '#1d1300', background: '#ffd166', padding: '16px 22px', borderRadius: 16, fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>⚠ Catatan slide: {note.text}</div>}
      </AbsoluteFill>
    </SceneCtx.Provider>
  );
};

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const cur = (TL.subs as { from: number; to: number; s: string; x: number }[]).find((s) => f >= s.from && f < s.to + 6);
  if (!cur || !cur.s) return null;
  return <div style={{ position: 'absolute', left: 0, right: 0, bottom: 38, display: 'flex', justifyContent: 'center', fontFamily: FONT }}>
    <div style={{ maxWidth: 1560, background: 'rgba(3,6,14,0.82)', color: cur.x ? '#bfe9ff' : '#fff', fontSize: 38, lineHeight: 1.3, padding: '12px 30px', borderRadius: 14, textAlign: 'center', fontWeight: 500, borderLeft: cur.x ? '6px solid #7dd3fc' : undefined }}>{cur.s}</div>
  </div>;
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: 'absolute', left: 0, bottom: 0, height: 6, width: `${(f / TL.total) * 100}%`, background: `linear-gradient(90deg, ${C.oxy}, ${C.pressure})` }} />;
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg0 }}>
    {(TL.scenes as SceneT[]).map((sc) => (
      <Sequence key={sc.id} from={sc.from} durationInFrames={sc.dur} name={sc.id}>
        <SceneFrame sc={sc} />
      </Sequence>
    ))}
    <Subtitles />
    <Progress />
  </AbsoluteFill>
);
export const TOTAL = TL.total as number;
export const SCENES = TL.scenes as SceneT[];
