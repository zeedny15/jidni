import React, { createContext, useContext } from 'react';
import { interpolate, spring, useCurrentFrame, Easing, Img, staticFile } from 'remotion';

export const C = {
  bg0: '#070d1c', bg1: '#0f1b36', card: 'rgba(255,255,255,0.06)', cardB: 'rgba(255,255,255,0.14)',
  text: '#eef3ff', dim: '#9fb0d0', oxy: '#ff4d5e', oxyD: '#c81d35', deoxy: '#3d8bff', deoxyD: '#1f55c9',
  pressure: '#ffb703', fluid: '#4cc9f0', lymph: '#7ae582', nerve: '#c77dff', muscle: '#ff8fa3',
  good: '#4ade80', bad: '#f87171', accent: '#ffd166', wall: '#f4a3b4', collagen: '#e9c46a', elastin: '#e76f51',
};
export const FONT = "'Inter', 'Noto Sans', 'DejaVu Sans', sans-serif";

export type Line = { from: number; dur: number; s: string; x: number; silent?: number };
export type SceneT = { id: string; ch: number; v: string; p: any; src: string; notes: { at: number; text: string }[]; from: number; dur: number; lines: Line[] };

export const SceneCtx = createContext<SceneT | null>(null);

/** Scene helpers: current step (narration line) & timing */
export const useS = () => {
  const sc = useContext(SceneCtx)!;
  const f = useCurrentFrame();
  let step = 0;
  sc.lines.forEach((l, i) => { if (f >= l.from - 4) step = i; });
  const L = (k: number) => sc.lines[Math.min(Math.max(k, 0), sc.lines.length - 1)];
  const at = (k: number) => (k >= sc.lines.length ? sc.dur : L(k).from);
  /** 0→1 ramp starting at line k (+delay frames) over len frames */
  const ap = (k: number, delay = 0, len = 18) => k >= sc.lines.length ? 0 :
    interpolate(f, [at(k) + delay - 6, at(k) + delay - 6 + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  /** progress through line k (0..1) */
  const lp = (k: number) => interpolate(f, [L(k).from, L(k).from + Math.max(1, L(k).dur)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { f, step, sc, ap, lp, at, p: sc.p || {}, n: sc.lines.length };
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => Easing.inOut(Easing.cubic)(clamp01(t));

/** pop-in spring for element appearing at line k */
export const usePop = (k: number, delay = 0) => {
  const { f, at } = useS();
  return spring({ frame: f - at(k) - delay + 6, fps: 30, config: { damping: 14, mass: 0.6 } });
};

// ---------- polyline helpers ----------
export type Pt = [number, number];
export const polyLen = (pts: Pt[]) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
export const pointAt = (pts: Pt[], t: number): Pt => {
  const L = polyLen(pts); let d = clamp01(t) * L;
  for (let i = 1; i < pts.length; i++) {
    const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= s || i === pts.length - 1) { const u = s ? Math.min(1, d / s) : 0; return [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)]; }
    d -= s;
  }
  return pts[pts.length - 1];
};
export const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');

/** Particles flowing along a polyline */
export const Flow: React.FC<{ pts: Pt[]; n?: number; speed?: number; color?: string | ((t: number) => string); r?: number; opacity?: number; jitter?: number; rbc?: boolean }> = ({ pts, n = 14, speed = 3, color = C.oxy, r = 7, opacity = 1, jitter = 0, rbc = true }) => {
  const f = useCurrentFrame();
  const L = polyLen(pts);
  return <g opacity={opacity}>{Array.from({ length: n }).map((_, i) => {
    const t = ((i / n) + (f * speed) / L) % 1;
    const [x, y] = pointAt(pts, t);
    const j = jitter ? Math.sin(i * 12.9898 + f * 0.05) * jitter : 0;
    const col = typeof color === 'function' ? color(t) : color;
    return rbc ? <g key={i} transform={`translate(${x},${y + j})`}><ellipse rx={r * 1.25} ry={r} fill={col} /><ellipse rx={r * 0.55} ry={r * 0.4} fill="rgba(0,0,0,0.22)" /></g>
      : <circle key={i} cx={x} cy={y + j} r={r} fill={col} />;
  })}</g>;
};

/** Animated arrow (draws itself in) */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color?: string; w?: number; t?: number; head?: number; dash?: boolean; label?: string; lx?: number; ly?: number; fs?: number }> = ({ x1, y1, x2, y2, color = C.text, w = 6, t = 1, head = 22, dash, label, lx = 0, ly = -18, fs = 30 }) => {
  if (t <= 0) return null;
  const ex = lerp(x1, x2, t), ey = lerp(y1, y2, t);
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = ex - Math.cos(a) * head, hy = ey - Math.sin(a) * head;
  const p1 = [hx + Math.cos(a + Math.PI / 2) * head * 0.6, hy + Math.sin(a + Math.PI / 2) * head * 0.6];
  const p2 = [hx - Math.cos(a + Math.PI / 2) * head * 0.6, hy - Math.sin(a + Math.PI / 2) * head * 0.6];
  return <g>
    <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? '14 10' : undefined} />
    <polygon points={`${ex},${ey} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill={color} />
    {label && <text x={(x1 + x2) / 2 + lx} y={(y1 + y2) / 2 + ly} fill={color} fontSize={fs} fontWeight={700} textAnchor="middle" opacity={t}>{label}</text>}
  </g>;
};

/** Text label with pill background (SVG) */
export const Tag: React.FC<{ x: number; y: number; text: string; color?: string; fs?: number; o?: number; bg?: string; anchor?: 'middle' | 'start' | 'end'; bold?: boolean }> = ({ x, y, text, color = C.text, fs = 30, o = 1, bg = 'rgba(7,13,28,0.78)', anchor = 'middle', bold = true }) => {
  if (o <= 0) return null;
  const w = text.length * fs * 0.56 + fs * 0.9;
  const bx = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x - fs * 0.45 : x - w + fs * 0.45;
  return <g opacity={o}>
    <rect x={bx} y={y - fs * 0.95} width={w} height={fs * 1.4} rx={fs * 0.7} fill={bg} stroke={color} strokeOpacity={0.55} strokeWidth={2} />
    <text x={x} y={y} fill={color} fontSize={fs} fontWeight={bold ? 700 : 500} textAnchor={anchor}>{text}</text>
  </g>;
};

/** HTML card */
export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; o?: number; hi?: boolean; color?: string }> = ({ style, children, o = 1, hi, color = C.accent }) => (
  <div style={{ background: hi ? 'rgba(255,209,102,0.10)' : C.card, border: `2px solid ${hi ? color : C.cardB}`, borderRadius: 26, padding: '22px 28px', color: C.text, opacity: o, transform: `translateY(${(1 - o) * 30}px) scale(${hi ? 1.03 : 1})`, boxShadow: hi ? `0 0 40px ${color}55` : '0 10px 30px rgba(0,0,0,0.3)', transition: 'none', ...style }}>{children}</div>
);

export const Heading: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  return <div style={{ position: 'absolute', left: 90, top: 92, opacity: o, transform: `translateX(${(1 - o) * -30}px)` }}>
    <div style={{ fontSize: 52, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>{children}</div>
    {sub && <div style={{ fontSize: 28, color: C.dim, marginTop: 4 }}>{sub}</div>}
  </div>;
};

/** Original figure from the PPT */
export const PdfFig: React.FC<{ src: string; x: number; y: number; w: number; o?: number; caption?: string; h?: number; zoom?: number }> = ({ src, x, y, w, o = 1, caption, h, zoom = 1 }) => {
  if (o <= 0) return null;
  return <div style={{ position: 'absolute', left: x, top: y, width: w, opacity: o, transform: `scale(${0.94 + 0.06 * o})`, background: '#fff', borderRadius: 18, padding: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
    <div style={{ overflow: 'hidden', borderRadius: 10, height: h }}>
      <Img src={staticFile('pdf/' + src)} style={{ width: '100%', display: 'block', transform: `scale(${zoom})`, transformOrigin: 'center' }} />
    </div>
    {caption && <div style={{ color: '#334', fontSize: 20, padding: '6px 6px 0', fontStyle: 'italic' }}>{caption}</div>}
  </div>;
};

/** full-screen svg layer */
export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, fontFamily: FONT, ...style }}>{children}</svg>
);

// ---------- simple anatomical icons ----------
export const HeartIcon: React.FC<{ x: number; y: number; s?: number; beat?: boolean; split?: boolean }> = ({ x, y, s = 1, beat = true, split = true }) => {
  const f = useCurrentFrame();
  const b = beat ? 1 + 0.05 * Math.max(0, Math.sin(f / 30 * Math.PI * 2 * 1.1)) ** 6 : 1;
  return <g transform={`translate(${x},${y}) scale(${s * b})`}>
    <defs>
      <radialGradient id="hgR" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor="#ff8a95" /><stop offset="1" stopColor="#a3122a" /></radialGradient>
      <radialGradient id="hgB" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor="#8ab8ff" /><stop offset="1" stopColor="#173e9a" /></radialGradient>
    </defs>
    {split ? <>
      <path d="M0,-60 C-20,-95 -95,-90 -95,-30 C-95,20 -40,60 0,95 Z" fill="url(#hgB)" />
      <path d="M0,-60 C20,-95 95,-90 95,-30 C95,20 40,60 0,95 Z" fill="url(#hgR)" />
      <line x1={0} y1={-60} x2={0} y2={95} stroke="#fff" strokeOpacity={0.5} strokeWidth={3} />
    </> : <path d="M0,-60 C-20,-95 -95,-90 -95,-30 C-95,20 -40,60 0,95 C40,60 95,20 95,-30 C95,-90 20,-95 0,-60 Z" fill="url(#hgR)" />}
  </g>;
};

export const Lungs: React.FC<{ x: number; y: number; s?: number; breathe?: number }> = ({ x, y, s = 1, breathe = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s * (1 + breathe * 0.06)})`} opacity={0.95}>
    <path d="M-15,-70 L-15,-10 M15,-70 L15,-10" stroke="#e8d5d9" strokeWidth={10} strokeLinecap="round" />
    <path d="M-25,-30 C-90,-40 -130,40 -110,90 C-90,120 -40,110 -25,80 Z" fill="#f2a7b5" stroke="#d07085" strokeWidth={3} />
    <path d="M25,-30 C90,-40 130,40 110,90 C90,120 40,110 25,80 Z" fill="#f2a7b5" stroke="#d07085" strokeWidth={3} />
  </g>
);

export const Brain: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#f7c6d0' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-70,10 C-90,-30 -60,-70 -20,-65 C0,-85 50,-80 60,-50 C95,-40 95,10 70,25 C70,55 30,60 10,45 C-10,60 -60,55 -70,10 Z" fill={color} stroke="#b56b80" strokeWidth={4} />
    <path d="M-40,-30 C-20,-10 -50,10 -20,20 M10,-50 C0,-20 30,-10 20,15 M40,-20 C60,0 40,20 55,30" stroke="#b56b80" strokeWidth={3} fill="none" />
  </g>
);

export const Kidney: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M10,-60 C-50,-70 -60,0 -40,40 C-20,80 40,70 35,30 C20,15 20,-10 35,-25 C45,-45 35,-58 10,-60 Z" fill="#b5523b" stroke="#7a2f20" strokeWidth={4} />
  </g>
);

export const Muscle: React.FC<{ x: number; y: number; w: number; h: number; c?: number }> = ({ x, y, w, h, c = 0 }) => (
  <g>
    <ellipse cx={x} cy={y} rx={w * (1 + c * 0.25)} ry={h * (1 - c * 0.12)} fill="#d9536f" opacity={0.9} />
    {[-0.5, 0, 0.5].map((k) => <path key={k} d={`M${x + k * w * 0.6},${y - h * 0.9} Q${x + k * w * (1 + c * 0.3)},${y} ${x + k * w * 0.6},${y + h * 0.9}`} stroke="#ff9fb2" strokeWidth={3} fill="none" opacity={0.6} />)}
  </g>
);

/** gauge (dial) */
export const Gauge: React.FC<{ x: number; y: number; r?: number; v: number; min?: number; max?: number; label?: string; unit?: string; color?: string }> = ({ x, y, r = 110, v, min = 0, max = 200, label, unit = 'mmHg', color = C.pressure }) => {
  const a0 = -210, a1 = 30;
  const ang = (val: number) => (a0 + (a1 - a0) * clamp01((val - min) / (max - min))) * Math.PI / 180;
  const a = ang(v);
  return <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#0b1328" stroke="#56627d" strokeWidth={6} />
    {Array.from({ length: 11 }).map((_, i) => { const aa = ang(min + (max - min) * i / 10); return <line key={i} x1={Math.cos(aa) * r * 0.78} y1={Math.sin(aa) * r * 0.78} x2={Math.cos(aa) * r * 0.92} y2={Math.sin(aa) * r * 0.92} stroke="#9fb0d0" strokeWidth={3} />; })}
    <line x1={0} y1={0} x2={Math.cos(a) * r * 0.8} y2={Math.sin(a) * r * 0.8} stroke={color} strokeWidth={7} strokeLinecap="round" />
    <circle r={10} fill={color} />
    <text y={r * 0.5} fill={C.text} fontSize={r * 0.3} fontWeight={800} textAnchor="middle">{Math.round(v)}</text>
    <text y={r * 0.72} fill={C.dim} fontSize={r * 0.15} textAnchor="middle">{unit}</text>
    {label && <text y={-r - 18} fill={C.text} fontSize={28} fontWeight={700} textAnchor="middle">{label}</text>}
  </g>;
};

/** horizontal bar meter */
export const Meter: React.FC<{ x: number; y: number; w: number; v: number; label: string; color: string; valText?: string }> = ({ x, y, w, v, label, color, valText }) => (
  <g>
    <text x={x} y={y - 12} fill={C.text} fontSize={28} fontWeight={700}>{label}</text>
    <rect x={x} y={y} width={w} height={26} rx={13} fill="rgba(255,255,255,0.1)" />
    <rect x={x} y={y} width={w * clamp01(v)} height={26} rx={13} fill={color} />
    {valText && <text x={x + w + 16} y={y + 22} fill={color} fontSize={28} fontWeight={800}>{valText}</text>}
  </g>
);

export const Bg: React.FC<{ img?: string; o?: number }> = ({ img, o = 0.15 }) => {
  const f = useCurrentFrame();
  return <>
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${C.bg1} 0%, ${C.bg0} 70%)` }} />
    {img && <Img src={staticFile('pdf/' + img)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: o, transform: `scale(${1.05 + f * 0.0003})`, filter: 'blur(2px)' }} />}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
  </>;
};
