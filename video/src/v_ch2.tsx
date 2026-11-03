import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { C, useS, Card, Heading, Svg, HeartIcon, Brain, Kidney, Flow, Pt, Arrow, Tag, lerp, clamp01, PdfFig, Meter, Gauge, Muscle } from './lib';

/** horizontal tube with walls; radius r (half-height) */
const HTube: React.FC<{ x1: number; x2: number; y: number; r: number; wall?: number; wallColor?: string; blood?: string; rings?: number; ringColor?: string; glow?: string }> = ({ x1, x2, y, r, wall = 18, wallColor = '#d9536f', blood = '#5b0f1d', rings = 0, ringColor = '#ff9fb2', glow }) => (
  <g>
    {glow && <rect x={x1 - 10} y={y - r - wall - 10} width={x2 - x1 + 20} height={2 * (r + wall) + 20} rx={r + wall} fill={glow} opacity={0.25} />}
    <rect x={x1} y={y - r - wall} width={x2 - x1} height={2 * (r + wall)} rx={Math.min(30, r + wall)} fill={wallColor} />
    <rect x={x1} y={y - r} width={x2 - x1} height={2 * r} fill={blood} />
    {Array.from({ length: rings }).map((_, i) => { const x = x1 + ((i + 0.5) * (x2 - x1)) / rings; return <g key={i}><rect x={x - 5} y={y - r - wall} width={10} height={wall} fill={ringColor} rx={4} /><rect x={x - 5} y={y + r} width={10} height={wall} fill={ringColor} rx={4} /></g>; })}
  </g>
);

export const ArteryWall: React.FC = () => {
  const { step, ap, f } = useS();
  const cx = 560, cy = 540;
  const pulse = 1 + 0.03 * Math.max(0, Math.sin(f / 30 * Math.PI * 2)) ** 4;
  const H = (k: number) => step === k;
  const rows = [['Radius besar', 'resistensi turun drastis', 1], ['Endotel licin', 'gesekan minimal', 2], ['Otot polos tebal', 'lumen tetap terbuka', 3], ['Kolagen + elastin', 'kuat & elastis (meregang–recoil)', 4], ['Hasil', 'aliran mulus, tanpa turbulensi', 5]];
  return <AbsoluteFill>
    <Heading sub="Artery wall structure">Struktur Dinding Arteri</Heading>
    <Svg>
      <g transform={`translate(${cx},${cy}) scale(${pulse})`}>
        {/* adventitia with collagen */}
        <circle r={300} fill="#b88a5c" stroke={H(4) ? C.accent : 'none'} strokeWidth={8} />
        {Array.from({ length: 36 }).map((_, i) => { const a = (i / 36) * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * 262},${Math.sin(a) * 262} q${Math.cos(a + 1) * 14},${Math.sin(a + 1) * 14} ${Math.cos(a) * 32},${Math.sin(a) * 32}`} stroke={C.collagen} strokeWidth={5} fill="none" opacity={0.9} />; })}
        {/* external elastic lamina */}
        <circle r={258} fill={C.elastin} />
        {/* media: smooth muscle */}
        <circle r={250} fill="#cf4b67" stroke={H(3) ? C.accent : 'none'} strokeWidth={8} />
        {Array.from({ length: 5 }).map((_, k) => <circle key={k} r={170 + k * 16} fill="none" stroke={C.elastin} strokeWidth={H(4) ? 6 : 3} opacity={0.85} strokeDasharray="30 12" />)}
        {Array.from({ length: 40 }).map((_, i) => { const a = (i / 40) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 210} cy={Math.sin(a) * 210} rx={26} ry={7} fill="#ff8da1" opacity={0.6} transform={`rotate(${(a * 180) / Math.PI + 90},${Math.cos(a) * 210},${Math.sin(a) * 210})`} />; })}
        {/* internal elastic lamina + endothelium */}
        <circle r={160} fill={C.elastin} />
        <circle r={154} fill="#ffd7df" stroke={H(2) ? C.accent : 'none'} strokeWidth={10} />
        <circle r={146} fill="#7a0f22" />
        {Array.from({ length: 9 }).map((_, i) => { const a = i * 0.7 + f * 0.01; const rr = 40 + (i % 3) * 30; return <ellipse key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} rx={26} ry={18} fill={C.oxy} />; })}
        {H(1) && <><line x1={0} y1={0} x2={146} y2={0} stroke={C.accent} strokeWidth={8} /><text x={60} y={-16} fill={C.accent} fontSize={40} fontWeight={900}>r</text></>}
      </g>
      <Tag x={cx - 330} y={cy - 280} text="Tunika adventisia (kolagen)" fs={24} color={C.collagen} anchor="start" />
      <Tag x={cx + 120} y={cy - 320} text="Tunika media (otot polos + elastin)" fs={24} color="#ff9fb2" anchor="start" />
      <Tag x={cx + 170} y={cy + 300} text="Tunika intima (endotel)" fs={24} color="#ffd7df" anchor="start" />
    </Svg>
    <div style={{ position: 'absolute', left: 1000, top: 210, width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {rows.map(([a, b, k], i) => <Card key={i} o={ap(k as number)} hi={step === k} style={{ fontSize: 32, padding: '16px 26px' }}><b style={{ color: C.accent }}>{a}</b> → {b}</Card>)}
    </div>
    <PdfFig src="artery-wall.png" x={1060} y={250} w={440} o={step === 0 ? ap(0, 20) : 0} caption="Gambar PPT hlm 13" />
  </AbsoluteFill>;
};

export const RapidTransit: React.FC = () => {
  const { step, ap, f } = useS();
  const beat = (f % 36) / 36;
  const y = 470;
  const pulseX = 330 + beat * 1250;
  const organs: [number, number, React.ReactNode, string][] = [[1650, 260, <Brain x={0} y={0} s={0.8} />, 'Otak'], [1700, 470, <Kidney x={0} y={0} s={0.9} />, 'Ginjal'], [1650, 700, <g><Muscle x={0} y={0} w={60} h={35} /></g>, 'Otot']];
  return <AbsoluteFill>
    <Heading sub="Rapid-transit passageway">Fungsi 1: Jalur Transit Cepat</Heading>
    <Svg>
      <HeartIcon x={230} y={y} s={1.2} />
      <HTube x1={320} x2={1450} y={y} r={56} wall={26} wallColor="#c8394f" blood="#6d0f20" glow={step === 3 ? C.bad : undefined} />
      {[[1450, y, 1580, 280], [1450, y, 1600, y], [1450, y, 1580, 690]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#c8394f" strokeWidth={40} strokeLinecap="round" />)}
      <Flow pts={[[330, y], [1450, y]]} n={22} speed={14} r={11} jitter={22} />
      {/* pressure pulse */}
      <rect x={pulseX - 30} y={y - 90} width={60} height={180} fill={C.pressure} opacity={0.35 * ap(1)} rx={20} />
      <Tag x={pulseX} y={y - 110} text="gelombang tekanan" fs={24} color={C.pressure} o={ap(1)} />
      {organs.map(([x, yy, el, t], i) => <g key={i} transform={`translate(${x},${yy})`}>{el}<text y={90} fill={C.text} fontSize={28} textAnchor="middle" fontWeight={700}>{t}</text></g>)}
      {step >= 3 && <g opacity={ap(3)}>
        {[600, 900, 1200].map((x) => <g key={x}><text x={x} y={y + 140} fill={C.bad} fontSize={60} textAnchor="middle" fontWeight={900}>✕</text></g>)}
        <Tag x={900} y={y + 220} text="Dinding tebal & tidak permeabel → tidak ada pertukaran" fs={30} color={C.bad} />
        <Tag x={900} y={y - 180} text="🛣️ Jalan tol: untuk melaju, bukan bongkar muat" fs={32} color={C.accent} />
      </g>}
    </Svg>
    {step === 2 && <div style={{ position: 'absolute', left: 300, top: 640, display: 'flex', gap: 24 }}>
      {['⚡ Distribusi O₂ cepat', '📈 Tekanan terjaga', '🎛️ Arteriol mengatur aliran tiap organ'].map((t, i) => <Card key={i} o={ap(2, i * 10)} style={{ fontSize: 30 }}>{t}</Card>)}
    </div>}
  </AbsoluteFill>;
};

export const Windkessel: React.FC = () => {
  const { step, ap, f } = useS();
  const T = 60; const ph = (f % T) / T;
  const sys = ph < 0.33;
  const fill = sys ? Math.sin((ph / 0.33) * Math.PI / 2) : 1 - (ph - 0.33) / 0.67; // stored volume 0..1
  const stiff = step >= 6;
  const bulge = (stiff ? 10 : 46) * fill;
  const y = 450;
  const art = (x: number) => { const u = (x - 520) / 700; return 60 + bulge * Math.sin(Math.PI * clamp01(u)); };
  const top = Array.from({ length: 30 }).map((_, i) => { const x = 520 + (i / 29) * 700; return `${x},${y - art(x) - 26}`; }).join(' ');
  const bot = Array.from({ length: 30 }).map((_, i) => { const x = 1220 - (i / 29) * 700; return `${x},${y + art(x) + 26}`; }).join(' ');
  const topL = Array.from({ length: 30 }).map((_, i) => { const x = 520 + (i / 29) * 700; return `${x},${y - art(x)}`; }).join(' ');
  const botL = Array.from({ length: 30 }).map((_, i) => { const x = 1220 - (i / 29) * 700; return `${x},${y + art(x)}`; }).join(' ');
  // graphs
  const gW = 560, gx = 300, gy = 800;
  const ej = (t: number) => { const p = (t % 1); return p < 0.33 ? Math.sin(p / 0.33 * Math.PI) : 0; };
  const flow = (t: number) => 0.55 + 0.3 * (((t % 1) < 0.33) ? Math.sin((t % 1) / 0.33 * Math.PI / 2) : 1 - ((t % 1) - 0.33) / 0.67) * (stiff ? 1.6 : 0.6);
  const path = (fn: (t: number) => number, ox: number) => Array.from({ length: 120 }).map((_, i) => { const t = i / 120 * 3 + f / T; return `${i ? 'L' : 'M'}${ox + (i / 119) * gW},${gy - fn(t) * 90}`; }).join(' ');
  return <AbsoluteFill>
    <Heading sub="Pressure reservoir">Fungsi 2: Reservoir Tekanan</Heading>
    <Svg>
      <HeartIcon x={330} y={y} s={sys ? 1.05 : 0.95} beat={false} />
      <Tag x={330} y={y - 150} text={sys ? 'SISTOL: ejeksi' : 'DIASTOL: pengisian'} fs={30} color={sys ? C.oxy : C.fluid} />
      <polygon points={`${top} ${bot}`} fill={stiff ? '#8a6a6a' : C.elastin} />
      <polygon points={`${topL} ${botL}`} fill="#6d0f20" />
      {/* arteriole outlet */}
      <rect x={1220} y={y - 22} width={300} height={44} fill="#6d0f20" stroke="#d9536f" strokeWidth={12} />
      <rect x={430} y={y - 40} width={92} height={80} fill="#6d0f20" />
      <Flow pts={[[440, y], [1220, y]]} n={18} speed={sys ? 16 : 5} r={10} jitter={30 + bulge * 0.4} />
      <Flow pts={[[1220, y], [1520, y]]} n={8} speed={5} r={8} />
      <text x={870} y={y + 160} fill={C.text} fontSize={30} textAnchor="middle" fontWeight={700}>{stiff ? 'Arteri kaku (aterosklerosis)' : 'Arteri besar elastis'}</text>
      <Tag x={870} y={y + 215} text="Recoil elastis = gaya pendorong aliran saat diastol" fs={28} color={C.accent} o={step === 5 ? ap(5) : 0} />
      <text x={1370} y={y + 90} fill={C.text} fontSize={26} textAnchor="middle">Arteriol (resistensi tinggi)</text>
      {sys && ap(2) > 0 && <Arrow x1={470} y1={y - 120} x2={620} y2={y - 120} color={C.oxy} t={ap(2)} label="masuk > keluar" ly={-20} fs={26} />}
      {!sys && ap(4) > 0 && <g>{[700, 870, 1040].map((x) => <g key={x}><Arrow x1={x} y1={y - art(x) - 90} x2={x} y2={y - art(x) - 34} color={C.fluid} w={5} head={16} /><Arrow x1={x} y1={y + art(x) + 90} x2={x} y2={y + art(x) + 34} color={C.fluid} w={5} head={16} /></g>)}<Tag x={870} y={y - 170} text="recoil elastis mendorong darah" fs={28} color={C.fluid} /></g>}
      {/* balloon analogy */}
      {ap(3) > 0 && <g opacity={ap(3)} transform="translate(1700,440)">
        <ellipse rx={60 + 50 * fill} ry={75 + 55 * fill} fill="#ff6b81" opacity={0.9} /><ellipse rx={20} ry={30} cx={-20 - 15 * fill} cy={-30 - 20 * fill} fill="#fff" opacity={0.35} />
        <path d={`M0,${75 + 55 * fill} l-10,20 h20 z`} fill="#ff6b81" />
        <text y={200} fill={C.text} fontSize={28} textAnchor="middle" fontWeight={700}>🎈 Analogi balon</text>
      </g>}
      {/* graphs */}
      <g opacity={ap(1)}>
        <text x={gx} y={gy - 120} fill={C.oxy} fontSize={26} fontWeight={700}>Ejeksi jantung: berdenyut</text>
        <path d={path(ej, gx)} stroke={C.oxy} strokeWidth={5} fill="none" />
        <line x1={gx} y1={gy} x2={gx + gW} y2={gy} stroke="#56627d" strokeWidth={2} />
        <text x={gx + 700} y={gy - 120} fill={C.fluid} fontSize={26} fontWeight={700}>Aliran ke jaringan: kontinu</text>
        <path d={path(flow, gx + 700)} stroke={C.fluid} strokeWidth={5} fill="none" />
        <line x1={gx + 700} y1={gy} x2={gx + 700 + gW} y2={gy} stroke="#56627d" strokeWidth={2} />
      </g>
    </Svg>

  </AbsoluteFill>;
};

export const ArterioleStructure: React.FC = () => {
  const { step, ap, f } = useS();
  const y = 470;
  const osc = step >= 2 ? 0.5 + 0.5 * Math.sin(f / 22) : 0.5;
  const r = lerp(22, 62, osc);
  return <AbsoluteFill>
    <Heading sub="Arteriole wall structure">Struktur Dinding Arteriol</Heading>
    <Svg>
      <HTube x1={260} x2={1500} y={y} r={r} wall={40} wallColor="#c94a63" blood="#6d0f20" rings={22} ringColor="#ff9fb2" />
      <Flow pts={[[260, y], [1500, y]]} n={16} speed={4 + (62 - r) * 0.05} r={Math.min(10, r * 0.45)} jitter={r * 0.5} />
      <Tag x={420} y={y - r - 70} text="Otot polos melingkar (tebal)" fs={28} color="#ff9fb2" o={ap(0)} />
      {/* sympathetic nerve */}
      <g opacity={ap(1)}>
        <path d={`M300,${y - 230} C600,${y - 190} 900,${y - 270} 1450,${y - 200}`} stroke={C.nerve} strokeWidth={6} fill="none" />
        {[500, 800, 1100, 1350].map((x, i) => <g key={x}><circle cx={x} cy={y - 222 + (i % 2) * 8} r={12} fill={C.nerve} />{Array.from({ length: 3 }).map((_, k) => { const t = ((f / 40 + k / 3 + i * 0.2) % 1); return <circle key={k} cx={x + (k - 1) * 10} cy={lerp(y - 210, y - r - 40, t)} r={5} fill={C.nerve} opacity={1 - t} />; })}</g>)}
        <Tag x={1450} y={y - 250} text="Serat simpatis (NE)" fs={26} color={C.nerve} />
        {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={350 + ((i * 137 + f * 1.5) % 1100)} cy={y + r + 80 + (i % 3) * 30} r={9} fill={i % 2 ? C.pressure : C.lymph} opacity={0.8} />)}
        <Tag x={500} y={y + r + 190} text="Zat kimia lokal" fs={24} color={C.lymph} />
        <Tag x={1150} y={y + r + 190} text="Hormon dalam darah" fs={24} color={C.pressure} />
      </g>
      {step >= 2 && <g opacity={ap(2)}><Tag x={1700} y={y - 60} text={osc < 0.5 ? 'Vasokonstriksi' : 'Vasodilatasi'} fs={30} color={osc < 0.5 ? C.bad : C.good} /></g>}
    </Svg>
    {step >= 3 && <Card hi o={ap(3)} style={{ position: 'absolute', left: 560, top: 780, width: 800, fontSize: 30, textAlign: 'center' }}>Jaringan elastis sedikit → <b>recoil minimal</b> (beda dengan arteri)</Card>}
  </AbsoluteFill>;
};

export const PressureProfile: React.FC = () => {
  const { step, ap, lp, f } = useS();
  const gx = 260, gw = 1400, gy = 840, gh = 600; // 0..120 mmHg
  const Y = (p: number) => gy - (p / 120) * gh;
  const seg = [['Ventrikel kiri', 0, 0.16], ['Arteri', 0.16, 0.42], ['Arteriol', 0.42, 0.6], ['Kapiler', 0.6, 0.76], ['Venula & vena', 0.76, 1]] as const;
  const P = (u: number) => {
    if (u < 0.16) { const c = (u / 0.16 * 3) % 1; return c < 0.45 ? 120 * Math.sin(c / 0.45 * Math.PI) : 2; }
    if (u < 0.42) { const c = ((u - 0.16) / 0.26 * 3.5) % 1; return 80 + 40 * (c < 0.3 ? Math.sin(c / 0.3 * Math.PI / 2) : 1 - (c - 0.3) / 0.7) ** 1.3; }
    if (u < 0.6) { const k = (u - 0.42) / 0.18; const swing = (1 - k) * 18 * Math.sin(k * 30); return lerp(93, 37, k) + swing * 0.6; }
    if (u < 0.76) return lerp(37, 17, (u - 0.6) / 0.16);
    return lerp(17, 0, (u - 0.76) / 0.24);
  };
  const reveal = clamp01(0.15 + f / 150);
  const d = Array.from({ length: 400 }).map((_, i) => { const u = i / 399; return u <= reveal ? `${i ? 'L' : 'M'}${gx + u * gw},${Y(P(u))}` : ''; }).join(' ');
  const hiArt = step >= 0;
  return <AbsoluteFill>
    <Heading sub="Pressure drop across arterioles (dibuat ulang dari PPT hlm 23)">Arteriol: Pembuluh Resistensi</Heading>
    <Svg>
      {seg.map(([t, a, b], i) => <g key={i}><rect x={gx + a * gw} y={gy - gh} width={(b - a) * gw} height={gh} fill={i === 2 ? C.pressure : i % 2 ? '#1a2747' : '#142039'} opacity={i === 2 && hiArt ? 0.18 + 0.12 * ap(0) : 0.8} />
        <text x={gx + ((a + b) / 2) * gw} y={gy + 40} fill={i === 2 ? C.pressure : C.dim} fontSize={26} textAnchor="middle" fontWeight={700}>{t}</text></g>)}
      {[0, 20, 40, 60, 80, 100, 120].map((v) => <g key={v}><line x1={gx} x2={gx + gw} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={0.06} /><text x={gx - 16} y={Y(v) + 8} fill={C.dim} fontSize={22} textAnchor="end">{v}</text></g>)}
      <text x={gx - 70} y={gy - gh / 2} fill={C.dim} fontSize={24} transform={`rotate(-90,${gx - 70},${gy - gh / 2})`} textAnchor="middle">Tekanan (mmHg)</text>
      <path d={d} stroke={C.oxy} strokeWidth={5} fill="none" />
      <line x1={gx + 0.16 * gw} x2={gx + 0.42 * gw} y1={Y(93)} y2={Y(93)} stroke={C.pressure} strokeWidth={4} strokeDasharray="12 8" opacity={ap(1)} />
      <Tag x={gx + 0.29 * gw} y={Y(93) - 20} text="MAP ≈ 93" fs={24} color={C.pressure} o={ap(1)} />
      {step >= 2 && <g>
        <circle cx={gx + 0.42 * gw} cy={Y(93)} r={14} fill={C.pressure} opacity={ap(2)} />
        <Tag x={gx + 0.42 * gw - 10} y={Y(93) - 40} text="masuk ~93 mmHg" fs={28} color={C.pressure} o={ap(2)} />
        <circle cx={gx + 0.6 * gw} cy={Y(37)} r={14} fill={C.fluid} opacity={ap(2, 20)} />
        <Tag x={gx + 0.64 * gw + 60} y={Y(37) - 30} text="keluar ~37 mmHg" fs={28} color={C.fluid} o={ap(2, 20)} />
      </g>}
      {step >= 3 && <g opacity={ap(3)}>
        <line x1={gx + 0.51 * gw} x2={gx + 0.51 * gw} y1={Y(93)} y2={Y(37)} stroke={C.accent} strokeWidth={5} />
        <line x1={gx + 0.49 * gw} x2={gx + 0.53 * gw} y1={Y(93)} y2={Y(93)} stroke={C.accent} strokeWidth={5} />
        <line x1={gx + 0.49 * gw} x2={gx + 0.53 * gw} y1={Y(37)} y2={Y(37)} stroke={C.accent} strokeWidth={5} />
        <Tag x={gx + 0.51 * gw} y={Y(65)} text="Δ ≈ 56 mmHg" fs={34} color={C.accent} />
      </g>}
      {step >= 4 && <Arrow x1={gx + 0.45 * gw} y1={Y(10)} x2={gx + 0.95 * gw} y2={Y(10)} color={C.good} t={ap(4)} label="gradien tekanan → aliran" ly={-20} fs={26} />}
      {step >= 5 && <Tag x={gx + 0.68 * gw} y={Y(75)} text="pulsatil → stabil" fs={30} color={C.lymph} o={ap(5)} />}
    </Svg>
    {step === 1 && <Card o={ap(1)} style={{ position: 'absolute', left: 1180, top: 180, width: 640, fontSize: 28 }}>Kapiler lebih kecil, tapi <b>sangat banyak</b> → total penampang besar → resistensi kolektif lebih rendah dari arteriol.</Card>}
  </AbsoluteFill>;
};

export const VascularTone: React.FC = () => {
  const { step, ap, f } = useS();
  const knob = step >= 4 ? Math.sin(f / 25) * 60 : 0;
  const r = 60 + knob * 0.35;
  const cx = 520, cy = 520;
  return <AbsoluteFill>
    <Heading sub="Vascular tone">Tonus Vaskular: Keran Setengah Terbuka</Heading>
    <Svg>
      <g transform={`translate(${cx},${cy})`}>
        <circle r={200} fill="#b88a5c" />
        <circle r={185} fill="#c94a63" />
        {Array.from({ length: 30 }).map((_, i) => { const a = (i / 30) * Math.PI * 2; const rr = (r + 185) / 2; return <ellipse key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} rx={(185 - r) / 2 - 4} ry={8} fill="#ff8da1" opacity={0.7} transform={`rotate(${(a * 180) / Math.PI},${Math.cos(a) * rr},${Math.sin(a) * rr})`} />; })}
        <circle r={r + 6} fill="#ffd7df" />
        <circle r={r} fill="#6d0f20" />
        <circle r={14} fill={C.oxy} cx={Math.sin(f / 10) * r * 0.4} />
        <text y={250} fill={C.text} fontSize={30} textAnchor="middle" fontWeight={700}>Arteriol: sebagian berkontraksi</text>
      </g>
      {/* Ca channel */}
      {step >= 2 && <g opacity={ap(2)} transform="translate(1050,330)">
        <rect x={-200} y={-30} width={400} height={60} fill="#e9c46a" opacity={0.6} rx={10} />
        <rect x={-22} y={-40} width={44} height={80} fill="#2a9d8f" rx={8} />
        <rect x={-6} y={-40} width={12} height={80} fill="#0b1328" />
        {Array.from({ length: 4 }).map((_, k) => { const t = ((f / 50 + k / 4) % 1); return <g key={k}><circle cx={0} cy={lerp(-120, 110, t)} r={12} fill={C.fluid} /><text x={18} y={lerp(-120, 110, t) + 6} fill={C.fluid} fontSize={18}>Ca²⁺</text></g>; })}
        <text x={-200} y={-60} fill={C.text} fontSize={26} fontWeight={700}>Miogenik (intrinsik): kanal Ca²⁺ sedikit terbuka</text>
      </g>}
      {step >= 3 && <g opacity={ap(3)} transform="translate(1050,620)">
        <path d="M-200,-40 C-100,-60 0,-20 120,-40" stroke={C.nerve} strokeWidth={6} fill="none" />
        <circle cx={120} cy={-40} r={16} fill={C.nerve} />
        {Array.from({ length: 5 }).map((_, k) => { const t = ((f / 35 + k / 5) % 1); return <circle key={k} cx={120 + (k - 2) * 12} cy={lerp(-25, 60, t)} r={6} fill={C.nerve} opacity={1 - t} />; })}
        <text x={-200} y={-80} fill={C.text} fontSize={26} fontWeight={700}>Simpatis (ekstrinsik): norepinefrin terus-menerus</text>
      </g>}
      {/* faucet */}
      {step >= 4 && <g opacity={ap(4)} transform="translate(1600,620)">
        <rect x={-120} y={-20} width={200} height={40} rx={10} fill="#9aa5b8" />
        <rect x={60} y={-20} width={40} height={90} rx={10} fill="#9aa5b8" />
        <g transform={`rotate(${knob})`}><rect x={-12} y={-110} width={24} height={90} fill="#c0cad8" /><rect x={-60} y={-130} width={120} height={26} rx={12} fill={C.accent} /></g>
        <rect x={70} y={70} width={20} height={60 + knob * 0.5} fill={C.oxy} opacity={0.8} />
        <text y={200} fill={C.text} fontSize={28} textAnchor="middle" fontWeight={700}>🚰 setengah terbuka</text>
      </g>}
    </Svg>
    {step === 1 && <Card hi o={ap(1)} style={{ position: 'absolute', left: 960, top: 380, width: 820, fontSize: 32 }}>Tonus = <b>titik awal</b>. Dari sini arteriol bisa <span style={{ color: C.bad }}>menyempit</span> atau <span style={{ color: C.good }}>melebar</span>.</Card>}
  </AbsoluteFill>;
};

export const ConstrictDilate: React.FC = () => {
  const { step, ap } = useS();
  const left = step <= 1, right = step >= 2;
  const Panel: React.FC<{ x: number; on: boolean; con: boolean; k: number }> = ({ x, on, con, k }) => {
    const t = ap(k);
    const r = con ? lerp(50, 22, t) : lerp(50, 80, t);
    const R = Math.pow(50 / r, 4);
    const y = 470;
    return <g opacity={on ? 1 : 0.35}>
      <text x={x + 380} y={260} fill={con ? C.bad : C.good} fontSize={44} fontWeight={900} textAnchor="middle">{con ? 'Vasokonstriksi' : 'Vasodilatasi'}</text>
      <text x={x + 380} y={305} fill={C.dim} fontSize={26} textAnchor="middle">{con ? 'otot polos berkontraksi' : 'otot polos relaksasi'}</text>
      <HTube x1={x} x2={x + 760} y={y} r={r} wall={36} wallColor="#c94a63" blood="#6d0f20" rings={12} />
      <Flow pts={[[x, y], [x + 760, y]]} n={Math.round(r / 4)} speed={2 + r / 15} r={Math.min(11, r * 0.4)} jitter={r * 0.5} />
      <Meter x={x + 40} y={660} w={480} v={r / 90} label="Radius" color={C.fluid} valText={con ? '↓' : '↑'} />
      <Meter x={x + 40} y={750} w={480} v={Math.min(1, R / 8)} label="Resistensi" color={C.bad} valText={con ? '↑' : '↓'} />
      <Meter x={x + 40} y={840} w={480} v={Math.min(1, 0.35 / R)} label="Aliran darah" color={C.good} valText={con ? '↓' : '↑'} />
    </g>;
  };
  return <AbsoluteFill>
    <Heading sub="Arteriolar radius">Vasokonstriksi vs Vasodilatasi</Heading>
    <Svg>
      <Panel x={120} on={left} con k={1} />
      <Panel x={1040} on={right} con={false} k={3} />
    </Svg>
  </AbsoluteFill>;
};

export const OrganDistribution: React.FC = () => {
  const { step, ap } = useS();
  const ex = ap(1);
  const organs = [['🧠 Otak', 1, 1], ['🫀 Jantung', 0.7, 1.1], ['💪 Otot rangka', 0.8, 2.4], ['🍽️ Saluran cerna', 1.2, 0.6], ['🫘 Ginjal', 1.1, 0.8], ['🖐️ Kulit', 0.5, 0.9]] as const;
  return <AbsoluteFill>
    <Heading sub="The arteriolar radius adjustment">Arteriol Membagi Curah Jantung</Heading>
    <Svg>
      <HeartIcon x={300} y={520} s={1.2} />
      {organs.map(([t, a, b], i) => {
        const y = 230 + i * 110; const w = lerp(a, b, ex);
        return <g key={i}>
          <path d={`M400,520 C600,520 600,${y} 800,${y}`} stroke="#c8394f" strokeWidth={10 + w * 10} fill="none" />
          <circle cx={820} cy={y} r={16} fill={C.accent} />
          <rect x={860} y={y - 18} width={w * 230} height={36} rx={18} fill={i === 2 ? C.good : C.oxy} opacity={0.85} />
          <text x={1440} y={y + 11} fill={C.text} fontSize={32} fontWeight={700}>{t}</text>
        </g>;
      })}
      <text x={820} y={190} fill={C.accent} fontSize={24} textAnchor="middle">"keran" arteriol</text>
      <Tag x={1100} y={920} text={ex > 0.5 ? '🏃 Saat olahraga: otot rangka mendapat porsi lebih besar' : 'Saat istirahat'} fs={28} color={ex > 0.5 ? C.good : C.dim} o={1} />
    </Svg>
    {step >= 2 && <Card hi o={ap(2)} style={{ position: 'absolute', left: 1400, top: 100, width: 460, fontSize: 28 }}>Total radius semua arteriol → <b>TPR</b> → tekanan arteri</Card>}
    {step >= 3 && <div style={{ position: 'absolute', left: 90, top: 860, display: 'flex', gap: 20 }}>
      <Card o={ap(3)} style={{ fontSize: 28, borderColor: C.good }}>1. Kontrol lokal (intrinsik)</Card>
      <Card o={ap(3, 10)} style={{ fontSize: 28, borderColor: C.nerve }}>2. Kontrol ekstrinsik</Card></div>}
  </AbsoluteFill>;
};

export const LocalControl: React.FC = () => {
  const { step, ap, f } = useS();
  const items = [
    { col: 0, k: 1, t: 'Perubahan metabolik', d: '↓O₂ ↑CO₂ ↑H⁺ ↑K⁺ ↑adenosin → parakrin endotel', e: 'dil', ic: '⚗️' },
    { col: 0, k: 2, t: 'Contoh: naik tangga', d: 'otot aktif → vasodilatasi lokal → ↑ aliran', e: 'dil', ic: '🏃' },
    { col: 0, k: 3, t: 'Histamin', d: 'sel mast/basofil → vasodilatasi + ↑ permeabilitas', e: 'dil', ic: '🦟' },
    { col: 1, k: 4, t: 'Regangan (miogenik)', d: '↑MAP → kanal kation mekanis → depolarisasi → Ca²⁺ masuk', e: 'con', ic: '↔️' },
    { col: 1, k: 5, t: 'Shear stress', d: 'endotel → NO → vasodilatasi → shear stress ↓', e: 'dil', ic: '🌊' },
    { col: 1, k: 6, t: 'Suhu', d: 'panas → dilatasi · dingin → konstriksi', e: 'temp', ic: '🌡️' },
  ];
  const cur = items.find((it) => it.k === step);
  let target = 0.5;
  if (cur) target = cur.e === 'dil' ? 1 : cur.e === 'con' ? 0 : (Math.sin(f / 30) > 0 ? 1 : 0);
  const r = lerp(24, 70, target * ap(step, 10) + 0.5 * (1 - ap(step, 10)));
  return <AbsoluteFill>
    <Heading sub="Local (intrinsic) control of arteriolar radius">Kontrol Lokal Arteriol</Heading>
    <div style={{ position: 'absolute', left: 90, top: 220, width: 1150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: C.oxy }}>🧪 Pengaruh kimia</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: C.fluid }}>⚙️ Pengaruh fisik</div>
      {[0, 1, 2].map((row) => [0, 1].map((col) => { const it = items.filter((x) => x.col === col)[row]; return <Card key={it.k} o={Math.max(0.35, ap(it.k))} hi={step === it.k} style={{ fontSize: 26, padding: '16px 20px', minHeight: 130 }}><div style={{ fontSize: 30, fontWeight: 800 }}>{it.ic} {it.t}</div><div style={{ color: C.dim, marginTop: 6 }}>{it.d}</div></Card>; }))}
    </div>
    <Svg>
      <g transform="translate(1560,520)">
        <circle r={190} fill="#b88a5c" /><circle r={175} fill="#c94a63" />
        <circle r={r + 6} fill="#ffd7df" /><circle r={r} fill="#6d0f20" />
        {cur?.k === 3 && <circle r={230} fill="#ff4d5e" opacity={0.18} />}
        <text y={250} fill={cur ? (cur.e === 'con' || (cur.e === 'temp' && target === 0) ? C.bad : C.good) : C.dim} fontSize={34} fontWeight={900} textAnchor="middle">{!cur ? 'Arteriol' : cur.e === 'dil' ? 'Vasodilatasi' : cur.e === 'con' ? 'Vasokonstriksi' : target ? '🔥 Panas: dilatasi' : '❄️ Dingin: konstriksi'}</text>
      </g>
    </Svg>
  </AbsoluteFill>;
};

export const ExtrinsicControl: React.FC = () => {
  const { step, ap, f } = useS();
  return <AbsoluteFill>
    <Heading sub="Extrinsic control of arteriolar radius">Kontrol Ekstrinsik</Heading>
    <Svg>
      <Brain x={360} y={360} s={1.3} />
      <circle cx={400} cy={430} r={18} fill={C.nerve} />
      <text x={360} y={520} fill={C.text} fontSize={28} textAnchor="middle">Medula (pusat kardiovaskular)</text>
      <path d="M410,440 C700,420 800,560 1150,520" stroke={C.nerve} strokeWidth={7} fill="none" strokeDasharray="1400" strokeDashoffset={1400 * (1 - ap(0))} />
      {Array.from({ length: 4 }).map((_, k) => { const t = ((f / 40 + k / 4) % 1); return <circle key={k} cx={lerp(410, 1150, t)} cy={lerp(440, 520, t) - Math.sin(t * Math.PI) * 40} r={9} fill={C.nerve} opacity={ap(0)} />; })}
      <Tag x={780} y={430} text="Saraf simpatis" fs={28} color={C.nerve} o={ap(0)} />
      <g opacity={ap(0, 20)}><rect x={300} y={660} width={160} height={90} rx={30} fill="#e9c46a" /><text x={380} y={715} fill="#3a2a00" fontSize={26} textAnchor="middle" fontWeight={800}>Kelenjar</text>
        <path d="M460,705 C700,720 900,620 1150,560" stroke={C.pressure} strokeWidth={5} fill="none" strokeDasharray="12 12" />
        <Tag x={800} y={720} text="Hormon dalam sirkulasi" fs={26} color={C.pressure} /></g>
      <HTube x1={1150} x2={1500} y={540} r={30 + 10 * Math.sin(f / 20)} wall={30} rings={6} />
      <text x={1325} y={640} fill={C.text} fontSize={28} textAnchor="middle">Arteriol di seluruh tubuh</text>
      {step >= 1 && <g opacity={ap(1)}><Gauge x={1700} y={330} r={100} v={93 + 4 * Math.sin(f / 40)} max={160} label="MAP" /><Tag x={1700} y={520} text="TPR" fs={34} color={C.pressure} /></g>}
    </Svg>
    {step >= 2 && <Card hi o={ap(2)} style={{ position: 'absolute', left: 1000, top: 760, width: 820, fontSize: 30 }}>🎯 Tujuan: perfusi organ vital (terutama 🧠 otak) — bekerja bersama kontrol lokal saat olahraga, stres, perdarahan</Card>}
  </AbsoluteFill>;
};
void interpolate;
