import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { C, useS, Card, Heading, Svg, HeartIcon, Flow, Arrow, Tag, lerp, clamp01, PdfFig, Gauge, Meter } from './lib';

const Eq: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; o?: number }> = ({ children, style, o = 1 }) => (
  <div style={{ fontFamily: 'DejaVu Serif, Georgia, serif', fontSize: 64, fontWeight: 700, opacity: o, ...style }}>{children}</div>
);

export const PipeFlow: React.FC = () => {
  const { step, ap, f } = useS();
  const pinch = step >= 4 ? ap(4) * 0.6 : 0;
  const head = step >= 2 ? 1 : 0.6;
  const y = 560;
  return <AbsoluteFill>
    <Heading sub="Pressure gradient & resistance">Tekanan, Aliran, dan Resistensi</Heading>
    <Svg>
      {/* tank */}
      <rect x={160} y={260} width={240} height={420} rx={20} fill="none" stroke="#9aa5b8" strokeWidth={6} />
      <rect x={166} y={260 + 420 * (1 - head * 0.85)} width={228} height={420 * head * 0.85 - 6} fill={C.fluid} opacity={0.5} />
      <text x={280} y={240} fill={C.text} fontSize={28} textAnchor="middle">P₁ (tinggi)</text>
      {/* pipe */}
      <path d={`M400,${y - 40} L900,${y - 40} Q1000,${y - 40 + pinch * 34} 1100,${y - 40} L1600,${y - 40} L1600,${y + 40} L1100,${y + 40} Q1000,${y + 40 - pinch * 34} 900,${y + 40} L400,${y + 40} Z`} fill="rgba(76,201,240,0.35)" stroke="#9aa5b8" strokeWidth={6} />
      <Flow pts={[[410, y], [1600, y]]} n={18} speed={(2 + head * 5) * (1 - pinch * 0.7)} r={9} color={C.fluid} rbc={false} jitter={20 * (1 - pinch)} />
      {step >= 4 && <g opacity={ap(4)}><path d={`M960,${y - 140} L1000,${y - 40 + pinch * 30} L1040,${y - 140}`} fill="#9aa5b8" /><Tag x={1000} y={y - 170} text="R ↑ (selang dijepit)" fs={28} color={C.bad} /></g>}
      <text x={1600} y={y - 80} fill={C.text} fontSize={28} textAnchor="end">P₂ (rendah)</text>
      {step >= 2 && <Arrow x1={420} y1={y + 130} x2={1580} y2={y + 130} color={C.pressure} w={7} t={ap(2)} label="ΔP = P₁ − P₂  (gradien tekanan)" ly={50} fs={30} />}
      {step === 3 && <g opacity={ap(3)}>
        <Tag x={480} y={330} text="Pembuluh A: 100 → 90 mmHg (ΔP 10)" fs={26} color={C.pressure} anchor="start" />
        <Tag x={480} y={390} text="Pembuluh B: 50 → 40 mmHg (ΔP 10)" fs={26} color={C.pressure} anchor="start" />
        <Tag x={1420} y={360} text="Aliran sama!" fs={30} color={C.good} />
      </g>}
    </Svg>
    {step >= 5 && <Card hi o={ap(5)} style={{ position: 'absolute', left: 1140, top: 170, width: 640, textAlign: 'center' }}><Eq>F = ΔP / R</Eq></Card>}
    {step === 3 && <div style={{ position: 'absolute', left: 1500, top: 830, fontSize: 20, color: C.dim }}>(contoh angka ilustratif, PPT hlm 50)</div>}
    <PdfFig src="pressure-gradient.png" x={1660} y={170} w={200} o={step === 3 ? ap(3, 10) : 0} />
  </AbsoluteFill>;
};

export const Poiseuille: React.FC = () => {
  const { step, ap } = useS();
  const hl = (k: number) => ({ color: step === k ? C.accent : C.text, textShadow: step === k ? `0 0 20px ${C.accent}` : undefined });
  const rows = [['ΔP', 'Gradien tekanan', 'Makin besar → aliran makin besar', 2], ['r⁴', 'Radius pangkat 4', 'Penentu terkuat', 3], ['η', 'Viskositas', 'Kekentalan darah (↑Ht → aliran ↓)', 4], ['L', 'Panjang pembuluh', 'Relatif konstan', 4], ['π/8', 'Konstanta', 'Dari mekanika fluida', 4]];
  return <AbsoluteFill>
    <Heading sub="Poiseuille's law (PPT hlm 49)">Hukum Poiseuille</Heading>
    <Card o={ap(1)} style={{ position: 'absolute', left: 360, top: 210, width: 1200, textAlign: 'center', padding: '30px' }}>
      <Eq style={{ fontSize: 76 }}>F = <span style={hl(4)}>π</span> <span style={hl(2)}>ΔP</span> <span style={hl(3)}>r⁴</span> / 8 <span style={hl(4)}>η L</span></Eq>
    </Card>
    <div style={{ position: 'absolute', left: 260, top: 450, width: 1400, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map(([a, b, c, k], i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 380px 1fr', fontSize: 32, padding: '10px 24px', borderRadius: 16, background: step === k ? 'rgba(255,209,102,0.12)' : C.card, opacity: ap(k as number) > 0 ? 1 : 0.3 }}>
        <b style={{ fontFamily: 'DejaVu Serif, serif', color: C.accent }}>{a}</b><span>{b}</span><span style={{ color: C.dim }}>{c}</span></div>)}
    </div>
    {step >= 5 && <Card hi o={ap(5)} style={{ position: 'absolute', left: 460, top: 810, width: 1000, textAlign: 'center' }}><Eq style={{ fontSize: 50 }}>R ∝ η L / r⁴</Eq></Card>}
  </AbsoluteFill>;
};

export const RadiusDemo: React.FC = () => {
  const { step, ap, f } = useS();
  let k = 1; // radius factor
  if (step >= 1 && step <= 2) k = lerp(1, 0.5, ap(1, 0, 40));
  if (step === 3) k = lerp(0.5, 2, ap(3, 0, 50));
  if (step >= 4) k = 1;
  const R = 1 / Math.pow(k, 4), F = Math.pow(k, 4);
  const y = 430, r = 60 * k;
  const fmt = (v: number) => v >= 1 ? `${v.toFixed(v < 10 ? 1 : 0)}×` : `1/${(1 / v).toFixed(1 / v < 10 ? 1 : 0)}`;
  return <AbsoluteFill>
    <Heading sub="R ∝ 1/r⁴ (PPT hlm 52)">Kekuatan Radius</Heading>
    <Svg>
      <rect x={200} y={y - r - 24} width={1150} height={2 * r + 48} rx={Math.min(40, r + 24)} fill="#c94a63" />
      <rect x={200} y={y - r} width={1150} height={2 * r} fill="#6d0f20" />
      <Flow pts={[[220, y], [1330, y]]} n={Math.max(3, Math.round(16 * Math.min(2, k)))} speed={3 * Math.sqrt(F) + 0.5} r={Math.min(14, r * 0.35)} jitter={r * 0.55} />
      {step >= 4 && <g opacity={ap(4)}>{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={260 + i * 130} y={y - r - 6} width={60} height={12} fill={C.accent} />)}<Tag x={775} y={y + r + 90} text="Lapisan darah dekat dinding: gesekan" fs={28} color={C.accent} /></g>}
      <Tag x={775} y={y - 150} text={`radius = ${k === 1 ? '1' : k < 1 ? (k === 0.5 ? '½' : k.toFixed(2)) : k === 2 ? '2' : k.toFixed(2)} × r`} fs={34} color={C.fluid} />
      <g transform="translate(1450,250)">
        <text x={0} y={0} fill={C.text} fontSize={32} fontWeight={700}>r⁴: {fmt(Math.pow(k, 4))}</text>
        <text x={0} y={70} fill={C.bad} fontSize={44} fontWeight={900}>R: {fmt(R)}</text>
        <text x={0} y={140} fill={C.good} fontSize={44} fontWeight={900}>Aliran: {fmt(F)}</text>
      </g>
      <Meter x={1450} y={460} w={380} v={Math.min(1, R / 16)} label="Resistensi" color={C.bad} />
      <Meter x={1450} y={560} w={380} v={Math.min(1, F / 16)} label="Aliran" color={C.good} />
    </Svg>
    {step >= 1 && step <= 2 && <Card hi o={ap(1)} style={{ position: 'absolute', left: 200, top: 720, width: 1150 }}><Eq style={{ fontSize: 48 }}>(½)⁴ = 1/16 → R × 16, aliran × 1/16</Eq></Card>}
    {step === 3 && <Card hi color={C.good} o={ap(3)} style={{ position: 'absolute', left: 200, top: 720, width: 1150 }}><Eq style={{ fontSize: 48 }}>2⁴ = 16 → R × 1/16, aliran × 16</Eq></Card>}
    {step >= 5 && <Card hi o={ap(5)} style={{ position: 'absolute', left: 200, top: 720, width: 1150, fontSize: 32 }}>🎛️ Arteriol mengubah radius → <b>pengatur utama resistensi & distribusi aliran</b></Card>}
  </AbsoluteFill>;
};

export const Viscosity: React.FC = () => {
  const { step, ap } = useS();
  const Tube: React.FC<{ y: number; n: number; sp: number; t: string; c: string }> = ({ y, n, sp, t, c }) => <g>
    <rect x={300} y={y - 70} width={1100} height={140} rx={30} fill="#3a0a14" stroke="#c94a63" strokeWidth={10} />
    <Flow pts={[[320, y], [1380, y]]} n={n} speed={sp} r={14} jitter={45} />
    <text x={300} y={y - 90} fill={c} fontSize={30} fontWeight={800}>{t}</text>
  </g>;
  return <AbsoluteFill>
    <Heading sub="Blood viscosity">Viskositas Darah</Heading>
    <Svg>
      <g opacity={step >= 1 ? 1 : 0.3}>
        <Tube y={380} n={16} sp={6} t="Jumlah sel darah merah normal" c={C.good} />
        <Tube y={660} n={52} sp={2} t="Sel darah merah ↑ (polisitemia / dehidrasi): aliran lamban" c={C.bad} />
      </g>
      <g transform="translate(1600,300)" opacity={ap(0)}>
        <text x={0} y={0} fill={C.text} fontSize={28} textAnchor="middle">💧 Air</text>
        <rect x={-50} y={20} width={100} height={150} rx={14} fill={C.fluid} opacity={0.5} />
        <text x={0} y={250} fill={C.text} fontSize={28} textAnchor="middle">🍯 Sirup / molase</text>
        <rect x={-50} y={270} width={100} height={150} rx={14} fill="#b5651d" opacity={0.85} />
      </g>
    </Svg>
    {step >= 3 && <div style={{ position: 'absolute', left: 300, top: 800, display: 'flex', gap: 16 }}>
      {['↑ TPR', '↑ MAP', '↑ Beban jantung'].map((t, i) => <Card key={i} o={ap(3, i * 8)} style={{ fontSize: 32, borderColor: C.bad }}>{t}</Card>)}
      {step >= 4 && <Card o={ap(4)} style={{ fontSize: 28 }}>📏 Panjang pembuluh: relatif konstan</Card>}
    </div>}
    {step === 2 && <Card o={ap(2)} style={{ position: 'absolute', left: 300, top: 800, fontSize: 30 }}>Jarang berubah mendadak → bukan pengatur utama dari waktu ke waktu</Card>}
  </AbsoluteFill>;
};

export const BPMeasure: React.FC = () => {
  const { step, ap, f, at } = useS();
  // cuff pressure: inflate at step 2 to 160, then deflate steadily through 120 (step3) and 80 (step4)
  const t2 = at(2), t3 = at(3), t4 = at(4), t5 = at(5);
  let P = 0;
  if (f < t2) P = 0;
  else if (f < t2 + 45) P = interpolate(f, [t2, t2 + 45], [0, 160]);
  else if (f < t3) P = interpolate(f, [t2 + 45, t3], [160, 124], { extrapolateRight: 'clamp' });
  else if (f < t4) P = interpolate(f, [t3, t4], [124, 92], { extrapolateRight: 'clamp' });
  else if (f < t5) P = interpolate(f, [t4, t5], [92, 74], { extrapolateRight: 'clamp' });
  else P = 74;
  const sound = P <= 120 && P >= 80 && f > t2 + 45;
  const beat = (f % 26) < 5;
  return <AbsoluteFill>
    <Heading sub="Sfigmomanometer & bunyi Korotkoff">Mengukur Tekanan Darah</Heading>
    <Svg>
      {/* arm */}
      <path d="M200,560 C500,520 900,520 1250,560 L1250,700 C900,690 500,690 200,700 Z" fill="#e0a98c" />
      <rect x={430} y={520} width={300} height={200} rx={20} fill="#2d3a5c" stroke="#56627d" strokeWidth={4} opacity={step >= 1 ? 1 : 0.3} />
      <text x={580} y={630} fill="#fff" fontSize={28} textAnchor="middle" fontWeight={700}>Manset</text>
      {/* artery under */}
      <rect x={200} y={612} width={1050} height={22} fill={C.oxyD} opacity={0.9} />
      {P > 0 && P < 120 && <Flow pts={[[200, 623], [1240, 623]]} n={10} speed={P > 80 ? (beat ? 12 : 1) : 5} r={7} />}
      {P >= 120 && <Flow pts={[[200, 623], [430, 623]]} n={4} speed={1} r={7} />}
      {/* stethoscope */}
      <circle cx={900} cy={600} r={34} fill="#c0cad8" stroke="#56627d" strokeWidth={6} opacity={ap(1)} />
      <path d="M900,566 C900,420 1050,380 1150,330" stroke="#56627d" strokeWidth={10} fill="none" opacity={ap(1)} />
      {sound && beat && <g>{[1, 2, 3].map((k) => <path key={k} d={`M${1180 + k * 25},${300 - k * 15} q20,30 0,60`} stroke={C.accent} strokeWidth={6} fill="none" />)}<Tag x={1300} y={250} text="dug! (Korotkoff)" fs={30} color={C.accent} /></g>}
      <Gauge x={1580} y={500} r={170} v={P} min={0} max={200} label="Tekanan manset" />
      {f >= t3 && <Tag x={1580} y={760} text="Bunyi pertama: SISTOLIK 120" fs={28} color={C.oxy} o={ap(3)} />}
      {f >= t4 && <Tag x={1580} y={820} text="Bunyi hilang: DIASTOLIK 80" fs={28} color={C.fluid} o={ap(4)} />}
    </Svg>
    {step === 0 && <Card o={ap(0)} style={{ position: 'absolute', left: 200, top: 210, width: 900, fontSize: 30 }}>Tekanan darah = gaya darah pada dinding · bergantung <b>volume darah</b> & <b>komplians</b> dinding</Card>}
    {step === 1 && <Card o={ap(1)} style={{ position: 'absolute', left: 200, top: 210, width: 900, fontSize: 30 }}>Langsung: kateter intra-arteri · Tidak langsung: sfigmomanometer + stetoskop</Card>}
    {step >= 5 && <Card hi o={ap(5)} style={{ position: 'absolute', left: 300, top: 220, width: 700, textAlign: 'center' }}><Eq style={{ fontSize: 96 }}><span style={{ color: C.oxy }}>120</span>/<span style={{ color: C.fluid }}>80</span> <span style={{ fontSize: 40 }}>mmHg</span></Eq></Card>}
  </AbsoluteFill>;
};

const wave = (t: number) => { const p = t % 1; if (p < 0.33) return 80 + 40 * Math.sin((p / 0.33) * Math.PI / 2) ** 1.5; const q = (p - 0.33) / 0.67; return 80 + 40 * (1 - q) ** 1.6 + (q > 0.05 && q < 0.2 ? 4 * Math.sin((q - 0.05) / 0.15 * Math.PI) : 0); };

export const BPWave: React.FC = () => {
  const { step, ap, f } = useS();
  const gx = 200, gw = 1100, gy = 820, Y = (p: number) => gy - (p - 60) * 7;
  const d = Array.from({ length: 300 }).map((_, i) => `${i ? 'L' : 'M'}${gx + (i / 299) * gw},${Y(wave(i / 299 * 3 + f / 60))}`).join(' ');
  return <AbsoluteFill>
    <Heading sub="Systolic, diastolic & pulse pressure">Komponen Tekanan Darah</Heading>
    <Svg>
      {[60, 80, 100, 120, 140].map((v) => <g key={v}><line x1={gx} x2={gx + gw} y1={Y(v)} y2={Y(v)} stroke="#fff" strokeOpacity={0.06} /><text x={gx - 14} y={Y(v) + 8} fill={C.dim} fontSize={22} textAnchor="end">{v}</text></g>)}
      <path d={d} stroke={C.oxy} strokeWidth={6} fill="none" />
      <line x1={gx} x2={gx + gw} y1={Y(120)} y2={Y(120)} stroke={C.oxy} strokeWidth={3} strokeDasharray="10 8" opacity={ap(0)} />
      <Tag x={gx + gw + 120} y={Y(120) + 8} text="SBP 120" fs={30} color={C.oxy} o={ap(0)} />
      <line x1={gx} x2={gx + gw} y1={Y(80)} y2={Y(80)} stroke={C.fluid} strokeWidth={3} strokeDasharray="10 8" opacity={ap(1)} />
      <Tag x={gx + gw + 120} y={Y(80) + 8} text="DBP 80" fs={30} color={C.fluid} o={ap(1)} />
      {step >= 2 && <g opacity={ap(2)}><line x1={gx + gw + 260} x2={gx + gw + 260} y1={Y(120)} y2={Y(80)} stroke={C.accent} strokeWidth={6} /><Tag x={gx + gw + 380} y={Y(100) + 8} text="PP = 40" fs={34} color={C.accent} /></g>}
    </Svg>
    {step >= 3 && <div style={{ position: 'absolute', left: 1400, top: 150, display: 'flex', flexDirection: 'column', gap: 10, width: 440 }}>
      {[['Normal dewasa', '~40 mmHg', C.good], ['Rendah', '< 30 mmHg', C.fluid], ['Tinggi', '> 60 mmHg', C.bad]].map(([a, b, c], i) => <Card key={i} o={ap(3, i * 8)} style={{ fontSize: 28, padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}><span>{a}</span><b style={{ color: c as string }}>{b}</b></Card>)}
    </div>}
  </AbsoluteFill>;
};

export const SbpDbpFactors: React.FC = () => {
  const { step, ap } = useS();
  const rows = [['Volume sekuncup ↑', '↑', 'bervariasi', 1], ['Kontraktilitas ↑', '↑', 'tidak langsung', 1], ['TPR ↑', '↑', '↑', 2], ['Denyut jantung ↑', '↑', '↑', 2], ['Volume darah ↑', '↑', '↑', 2], ['Komplians arteri ↓', '↑', 'turun / naik, lebih kecil dari SBP', 3]];
  return <AbsoluteFill>
    <Heading sub="PPT hlm 57">Faktor yang Memengaruhi SBP & DBP</Heading>
    <div style={{ position: 'absolute', left: 260, top: 220, width: 1400, fontSize: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px 1fr', padding: '0 24px 10px', color: C.dim, fontWeight: 700 }}><div>Faktor</div><div>Efek SBP</div><div>Efek DBP</div></div>
      {rows.map(([a, b, c, k], i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 240px 1fr', padding: '14px 24px', marginBottom: 8, borderRadius: 14, background: step === k ? 'rgba(255,209,102,0.12)' : C.card, border: `2px solid ${step === k ? C.accent : 'transparent'}`, opacity: ap(k as number) > 0 ? 1 : 0.25 }}>
        <span>{a}</span><b style={{ color: C.oxy }}>{b}</b><span style={{ color: C.fluid }}>{c}</span></div>)}
    </div>
    {step >= 4 && <Card hi o={ap(4)} style={{ position: 'absolute', left: 260, top: 840, width: 1400, fontSize: 30 }}>DBP terutama dipengaruhi: <b>resistensi perifer</b>, <b>durasi diastol</b>, <b>komplians arteri</b></Card>}
  </AbsoluteFill>;
};

export const MAPCalc: React.FC = () => {
  const { step, ap, f } = useS();
  const gx = 160, gw = 900, gy = 760, Y = (p: number) => gy - (p - 60) * 7;
  const d = Array.from({ length: 200 }).map((_, i) => `${i ? 'L' : 'M'}${gx + (i / 199) * gw},${Y(wave(i / 199 * 2))}`).join(' ');
  const cyc = gw / 2;
  return <AbsoluteFill>
    <Heading sub="Mean arterial pressure (PPT hlm 61)">MAP: Mengapa Bukan Nilai Tengah?</Heading>
    <Svg>
      {step >= 1 && [0, 1].map((k) => <g key={k} opacity={ap(1)}>
        <rect x={gx + k * cyc} y={Y(130)} width={cyc * 0.33} height={Y(60) - Y(130)} fill={C.oxy} opacity={0.15} />
        <rect x={gx + k * cyc + cyc * 0.33} y={Y(130)} width={cyc * 0.67} height={Y(60) - Y(130)} fill={C.fluid} opacity={0.12} />
        <text x={gx + k * cyc + cyc * 0.165} y={Y(128)} fill={C.oxy} fontSize={24} textAnchor="middle" fontWeight={700}>⅓ sistol</text>
        <text x={gx + k * cyc + cyc * 0.66} y={Y(128)} fill={C.fluid} fontSize={24} textAnchor="middle" fontWeight={700}>⅔ diastol</text>
      </g>)}
      <path d={d} stroke={C.oxy} strokeWidth={6} fill="none" />
      {[80, 100, 120].map((v) => <text key={v} x={gx - 14} y={Y(v) + 8} fill={C.dim} fontSize={22} textAnchor="end">{v}</text>)}
      {step >= 2 && <g opacity={ap(2)}><line x1={gx} x2={gx + gw} y1={Y(93)} y2={Y(93)} stroke={C.pressure} strokeWidth={5} /><Tag x={gx + gw + 90} y={Y(93) + 8} text="MAP 93" fs={30} color={C.pressure} /></g>}
      {step >= 5 && <g opacity={ap(5)}><line x1={gx} x2={gx + gw} y1={Y(100)} y2={Y(100)} stroke={C.bad} strokeWidth={3} strokeDasharray="10 8" /><Tag x={gx + gw + 90} y={Y(100) - 30} text="100 ✗" fs={28} color={C.bad} /></g>}
    </Svg>
    <div style={{ position: 'absolute', left: 1180, top: 290, width: 680, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card o={ap(2)} hi={step === 2}><Eq style={{ fontSize: 46 }}>MAP = DBP + ⅓ PP</Eq></Card>
      <Card o={ap(3)} hi={step === 3}><Eq style={{ fontSize: 36 }}>PP = 120 − 80 = 40</Eq><Eq style={{ fontSize: 36, marginTop: 8 }}>⅓ × 40 ≈ 13</Eq><Eq style={{ fontSize: 40, marginTop: 8, color: C.pressure }}>MAP = 80 + 13 = 93</Eq></Card>
      <Card o={ap(4)} hi={step === 4}><Eq style={{ fontSize: 34 }}>MAP = (SBP + 2·DBP) / 3</Eq><Eq style={{ fontSize: 34, marginTop: 8 }}>= (120 + 160) / 3 ≈ 93</Eq></Card>
    </div>
  </AbsoluteFill>;
};

export const MAPPurpose: React.FC = () => {
  const { step, ap, f } = useS();
  const v = 93 + (step === 3 ? 6 * Math.sin(f / 15) * Math.exp(-((f % 120) / 60)) : 0);
  return <AbsoluteFill>
    <Heading sub="Tujuan regulasi MAP">MAP: Tekanan yang Dijaga Tubuh</Heading>
    <Svg>
      <g transform="translate(560,520)">
        <path d="M-260,0 A260,260 0 0,1 -130,-225" stroke={C.fluid} strokeWidth={40} fill="none" />
        <path d="M-130,-225 A260,260 0 0,1 130,-225" stroke={C.good} strokeWidth={40} fill="none" />
        <path d="M130,-225 A260,260 0 0,1 260,0" stroke={C.bad} strokeWidth={40} fill="none" />
        <line x1={0} y1={0} x2={Math.cos(Math.PI + (v - 40) / 110 * Math.PI) * 220} y2={Math.sin(Math.PI + (v - 40) / 110 * Math.PI) * 220} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
        <circle r={18} fill="#fff" />
        <text y={70} fill={C.text} fontSize={44} fontWeight={900} textAnchor="middle">MAP</text>
        <text x={-300} y={50} fill={C.fluid} fontSize={26} textAnchor="middle" opacity={ap(1)}>terlalu rendah</text>
        <text x={300} y={50} fill={C.bad} fontSize={26} textAnchor="middle" opacity={ap(2)}>terlalu tinggi</text>
      </g>
    </Svg>
    <div style={{ position: 'absolute', left: 1000, top: 220, width: 820, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card o={ap(0)} hi={step === 0}>🎯 Yang dipantau & diatur: <b>MAP</b>, bukan SBP/DBP</Card>
      <Card o={ap(1)} hi={step === 1}>⬆️ Cukup tinggi → perfusi 🧠 otak & 🫀 jantung</Card>
      <Card o={ap(2)} hi={step === 2}>⬇️ Tidak terlalu tinggi → cegah beban jantung & ruptur pembuluh kecil</Card>
      <Card o={ap(3)} hi={step === 3}>⚖️ Satu organ dilatasi → organ lain konstriksi sedikit → MAP stabil</Card>
    </div>
  </AbsoluteFill>;
};

export const MAPTree: React.FC = () => {
  const { step, ap } = useS();
  const N = (x: number, y: number, t: string, c: string, k: number, w = 300, fs = 30) => <g opacity={ap(k)}>
    <rect x={x - w / 2} y={y - 38} width={w} height={76} rx={18} fill="#0f1b36" stroke={c} strokeWidth={step === k ? 6 : 3} />
    <text x={x} y={y + 10} fill={C.text} fontSize={fs} fontWeight={800} textAnchor="middle">{t}</text></g>;
  const L = (a: number, b: number, c: number, d: number, k: number) => <line x1={a} y1={b} x2={c} y2={d} stroke="#56627d" strokeWidth={4} opacity={ap(k)} />;
  return <AbsoluteFill>
    <Heading sub="PPT hlm 63–65">MAP = CO × TPR</Heading>
    <Svg>
      {L(960, 250, 560, 370, 0)}{L(960, 250, 1360, 370, 0)}
      {L(560, 370, 360, 500, 1)}{L(560, 370, 760, 500, 1)}
      {L(360, 500, 260, 640, 2)}{L(360, 500, 460, 640, 2)}
      {L(760, 500, 660, 640, 3)}{L(760, 500, 860, 640, 3)}{L(860, 640, 860, 760, 3)}
      {L(1360, 370, 1200, 500, 4)}{L(1360, 370, 1560, 500, 4)}{L(1560, 500, 1560, 640, 4)}
      {L(1200, 500, 1080, 640, 5)}{L(1200, 500, 1300, 640, 5)}{L(1200, 500, 1200, 760, 5)}
      {N(960, 250, 'MAP', C.pressure, 0, 260, 40)}
      {N(560, 370, 'Curah jantung (CO)', C.oxy, 0, 360)}
      {N(1360, 370, 'TPR', C.pressure, 0, 260)}
      {N(360, 500, 'Denyut jantung', C.oxy, 1, 280, 28)}
      {N(760, 500, 'Volume sekuncup', C.oxy, 1, 290, 28)}
      {N(260, 640, 'Parasimpatis ↓', C.fluid, 2, 240, 24)}
      {N(460, 640, 'Simpatis+epi ↑', C.nerve, 2, 240, 24)}
      {N(660, 640, 'Simpatis ↑', C.nerve, 3, 210, 24)}
      {N(860, 640, 'Aliran balik vena', C.deoxy, 3, 260, 24)}
      {N(860, 760, 'Frank–Starling (EDV ↑)', C.deoxy, 3, 320, 24)}
      {N(1200, 500, 'Radius arteriol', C.pressure, 4, 280, 28)}
      {N(1560, 500, 'Viskositas', C.pressure, 4, 240, 28)}
      {N(1560, 640, 'Jumlah sel darah merah', C.oxy, 4, 340, 24)}
      {N(1080, 640, 'Kontrol lokal', C.good, 5, 220, 24)}
      {N(1310, 640, 'Simpatis & epi', C.nerve, 5, 230, 24)}
      {N(1200, 760, 'ADH, angiotensin II', C.pressure, 5, 320, 24)}
    </Svg>
    {step >= 1 && <Card o={ap(1)} style={{ position: 'absolute', left: 90, top: 200, fontSize: 30, padding: '10px 22px' }}>CO = HR × SV</Card>}
  </AbsoluteFill>;
};
void HeartIcon; void clamp01; void PdfFig;
