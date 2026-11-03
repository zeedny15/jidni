import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, useS, Card, Heading, Svg, HeartIcon, Lungs, Brain, Kidney, Flow, Arrow, Tag, lerp, clamp01, PdfFig, Gauge } from './lib';

const Box: React.FC<{ x: number; y: number; w?: number; h?: number; t: string; c: string; o?: number; hi?: boolean; fs?: number; sub?: string }> = ({ x, y, w = 300, h = 80, t, c, o = 1, hi, fs = 28, sub }) => o <= 0 ? null : <g opacity={o}>
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={18} fill="#0f1b36" stroke={c} strokeWidth={hi ? 7 : 3} />
  <text x={x} y={y + (sub ? -4 : fs * 0.35)} fill={C.text} fontSize={fs} fontWeight={800} textAnchor="middle">{t}</text>
  {sub && <text x={x} y={y + 28} fill={C.dim} fontSize={20} textAnchor="middle">{sub}</text>}
</g>;

export const ThreeLevels: React.FC = () => {
  const { step, ap } = useS();
  const L = [['🏠 Lokal', 'Intrinsik (di jaringan)', 'Sesuaikan aliran dengan kebutuhan metabolik', 'Seketika', C.good], ['⚡ Saraf', 'Ekstrinsik (otonom–simpatis)', 'Tonus vaskular & penyesuaian BP cepat', 'Detik', C.nerve], ['💉 Hormonal', 'Ekstrinsik (endokrin)', 'Regulasi BP & volume darah jangka panjang', 'Menit–jam', C.pressure]];
  return <AbsoluteFill>
    <Heading sub="PPT hlm 68">Tiga Tingkat Regulasi</Heading>
    <div style={{ position: 'absolute', left: 120, top: 250, width: 1680, display: 'flex', gap: 30 }}>
      {L.map(([a, b, c, d, col], i) => <Card key={i} o={ap(i + 1)} hi={step === i + 1} color={col} style={{ flex: 1, minHeight: 440 }}>
        <div style={{ fontSize: 46, fontWeight: 900, color: col }}>{a}</div>
        <div style={{ fontSize: 28, color: C.dim, marginTop: 10 }}>{b}</div>
        <div style={{ fontSize: 32, marginTop: 24 }}>{c}</div>
        <div style={{ fontSize: 40, fontWeight: 900, marginTop: 30, color: col }}>⏱ {d}</div>
      </Card>)}
    </div>
  </AbsoluteFill>;
};

export const Autoregulation: React.FC = () => {
  const { step, ap, at, f } = useS();
  const t0 = at(2);
  const gx = 160, gw = 900;
  const u = (i: number) => i / 199;
  const stepAt = 0.3;
  const prog = clamp01((f - t0) / 150);
  const press = (x: number) => x < stepAt ? 0 : 1;
  const flow = (x: number) => x < stepAt ? 0 : Math.exp(-(x - stepAt) * 9);
  const pathP = Array.from({ length: 200 }).map((_, i) => u(i) <= prog || step < 2 ? `${i ? 'L' : 'M'}${gx + u(i) * gw},${700 - press(u(i)) * 70}` : '').join(' ');
  const pathF = Array.from({ length: 200 }).map((_, i) => u(i) <= prog || step < 2 ? `${i ? 'L' : 'M'}${gx + u(i) * gw},${430 - flow(u(i)) * 110}` : '').join(' ');
  const organs = [['🧠 Otak', 1, C.good], ['🫘 Ginjal', 0.8, C.good], ['💪 Otot rangka', 0.35, C.pressure], ['🖐️ Kulit', 0.25, C.bad]] as const;
  return <AbsoluteFill>
    <Heading sub="Autoregulation (PPT hlm 69–70)">Autoregulasi: Termostat Lokal</Heading>
    <Svg>
      <g opacity={ap(0)}>
        <rect x={gx} y={260} width={gw} height={220} fill="rgba(255,255,255,0.03)" /><rect x={gx} y={520} width={gw} height={220} fill="rgba(255,255,255,0.03)" />
        <text x={gx - 20} y={370} fill={C.fluid} fontSize={24} textAnchor="end">Aliran</text><text x={gx - 20} y={400} fill={C.fluid} fontSize={24} textAnchor="end">jaringan</text>
        <text x={gx - 20} y={640} fill={C.oxy} fontSize={24} textAnchor="end">Tekanan</text><text x={gx - 20} y={670} fill={C.oxy} fontSize={24} textAnchor="end">arteri</text>
        <line x1={gx} x2={gx + gw} y1={430} y2={430} stroke={C.fluid} strokeDasharray="10 8" strokeWidth={2} opacity={0.5} />
        <path d={pathF} stroke={C.fluid} strokeWidth={6} fill="none" />
        <path d={pathP} stroke={C.oxy} strokeWidth={6} fill="none" />
        <text x={gx + gw / 2} y={790} fill={C.dim} fontSize={24} textAnchor="middle">Waktu →</text>
      </g>
      {step >= 2 && prog > 0.4 && <Tag x={gx + 0.55 * gw} y={300} text="arteriol konstriksi → aliran kembali normal" fs={24} color={C.good} />}
      {step === 3 && <g transform="translate(1450,480)" opacity={ap(3)}>
        <rect x={-110} y={-150} width={220} height={300} rx={30} fill="#1a2747" stroke="#9aa5b8" strokeWidth={4} />
        <circle r={80} fill="#0b1328" stroke={C.accent} strokeWidth={6} />
        <text y={14} fill={C.accent} fontSize={50} fontWeight={900} textAnchor="middle">{(37 + 0.6 * Math.sin(f / 10) * Math.exp(-((f - ap(3)) % 90) / 40)).toFixed(0)}°</text>
        <text y={200} fill={C.text} fontSize={28} textAnchor="middle" fontWeight={700}>🌡️ Termostat</text>
      </g>}
    </Svg>
    {step >= 4 && <div style={{ position: 'absolute', left: 1140, top: 300, width: 700, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {organs.map(([t, v, c], i) => <Card key={i} o={ap(4, i * 6)} style={{ fontSize: 30, padding: '12px 22px' }}>{t}<div style={{ height: 14, background: 'rgba(255,255,255,0.1)', borderRadius: 7, marginTop: 8 }}><div style={{ width: `${v * 100}%`, height: 14, background: c, borderRadius: 7 }} /></div></Card>)}
      {step >= 5 && <Card hi o={ap(5)} style={{ fontSize: 26 }}>🛏️→🧍 Bangun cepat: arteriol otak dilatasi → tidak pingsan</Card>}
    </div>}
  </AbsoluteFill>;
};

export const EDVP: React.FC = () => {
  const { step, ap, f } = useS();
  const mols = [['NO', C.good, 'vasodilator kuat', 2], ['Endotelin', C.bad, 'vasokonstriktor poten', 3], ['PGH₂', C.bad, 'vasokonstriktor', 4], ['PGI₂ (prostasiklin)', C.good, 'vasodilator', 4]] as const;
  const cur = mols.find((m) => m[3] === step && (step !== 4));
  const dil = step === 2 ? 1 : step === 3 ? -1 : step === 4 ? Math.sin(f / 30) : step >= 5 ? 1 : 0;
  const r = 70 + dil * 30 * ap(Math.max(step, 0));
  const y = 560;
  return <AbsoluteFill>
    <Heading sub="Endothelial-derived vasoactive paracrines (PPT hlm 71)">Parakrin dari Endotel</Heading>
    <Svg>
      <rect x={160} y={y - r - 70} width={1100} height={60} fill="#c94a63" />
      <rect x={160} y={y + r + 10} width={1100} height={60} fill="#c94a63" />
      <rect x={160} y={y - r - 10} width={1100} height={10} fill="#ffd7df" /><rect x={160} y={y + r} width={1100} height={10} fill="#ffd7df" />
      <rect x={160} y={y - r} width={1100} height={2 * r} fill="#6d0f20" />
      <Flow pts={[[180, y], [1240, y]]} n={12} speed={2 + r / 30} r={14} jitter={r * 0.5} />
      <text x={170} y={y - r - 85} fill="#ff9fb2" fontSize={26}>Otot polos</text>
      <text x={1250} y={y - r - 20} fill="#ffd7df" fontSize={22} textAnchor="end">Endotel</text>
      {step >= 1 && Array.from({ length: 10 }).map((_, i) => { const t = ((f / 40 + i / 10) % 1); const m = step >= 2 && step <= 4 ? (step === 4 ? mols[2 + (i % 2)] : mols[step - 2]) : mols[0]; return <circle key={i} cx={220 + i * 100} cy={lerp(y - r - 5, y - r - 60, t)} r={9} fill={m[1]} opacity={(1 - t) * ap(1)} />; })}
      {step >= 1 && <Tag x={700} y={y - r - 110} text="sinyal: ↓O₂ / ↑ shear stress → endotel melepas parakrin" fs={24} color={C.accent} o={ap(1)} />}
      <Tag x={700} y={y + r + 120} text={dil > 0.2 ? 'Vasodilatasi' : dil < -0.2 ? 'Vasokonstriksi' : ''} fs={32} color={dil > 0 ? C.good : C.bad} o={step >= 2 ? 1 : 0} />
    </Svg>
    <div style={{ position: 'absolute', left: 1340, top: 220, width: 500, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {mols.map(([t, c, d, k], i) => <Card key={i} o={ap(k)} hi={step === k} color={c} style={{ fontSize: 28, padding: '12px 20px' }}><b style={{ color: c }}>{t}</b><div style={{ color: C.dim, fontSize: 24 }}>{d}</div></Card>)}
      {step >= 5 && <Card o={ap(5)} style={{ fontSize: 24, padding: '12px 20px' }}>Lainnya: histamin, bradikinin, prostaglandin → <b style={{ color: C.good }}>vasodilatasi</b></Card>}
      {step >= 6 && <Card o={ap(6)} style={{ fontSize: 24, padding: '12px 20px', borderColor: '#7dd3fc' }}>💊 Nitrogliserin → NO → vasodilatasi</Card>}
    </div>
    {void cur}
  </AbsoluteFill>;
};

export const ReactiveHyperemia: React.FC = () => {
  const { step, ap, at, f } = useS();
  const gx = 160, gw = 1000, gy = 640;
  const prog = clamp01((f - at(0)) / 200);
  const flow = (u: number) => u < 0.25 ? 1 : u < 0.5 ? 0 : u < 0.56 ? lerp(0, 2.4, (u - 0.5) / 0.06) : 1 + 1.4 * Math.exp(-(u - 0.56) * 9);
  const d = Array.from({ length: 300 }).map((_, i) => { const u = i / 299; return u <= prog ? `${i ? 'L' : 'M'}${gx + u * gw},${gy - flow(u) * 120}` : ''; }).join(' ');
  const grow = ap(3, 0, 120);
  return <AbsoluteFill>
    <Heading sub="Reactive hyperemia & angiogenesis (PPT hlm 72)">Hiperemia Reaktif & Angiogenesis</Heading>
    <Svg>
      <g opacity={step <= 2 ? 1 : 0.3}>
        <rect x={gx + 0.25 * gw} y={gy - 360} width={0.25 * gw} height={380} fill={C.bad} opacity={0.12} />
        <text x={gx + 0.375 * gw} y={gy - 320} fill={C.bad} fontSize={26} textAnchor="middle" fontWeight={700}>Oklusi</text>
        <text x={gx + 0.375 * gw} y={gy - 285} fill={C.dim} fontSize={22} textAnchor="middle">↓O₂, metabolit ↑</text>
        <line x1={gx} x2={gx + gw} y1={gy - 120} y2={gy - 120} stroke="#fff" strokeOpacity={0.2} strokeDasharray="8 8" />
        <path d={d} stroke={C.fluid} strokeWidth={6} fill="none" />
        <text x={gx} y={gy + 50} fill={C.dim} fontSize={24}>Aliran darah →  waktu</text>
        {prog > 0.6 && <Tag x={gx + 0.62 * gw} y={gy - 330} text="lonjakan aliran sementara" fs={26} color={C.accent} />}
      </g>
      {step >= 3 && <g opacity={ap(3)} transform="translate(1250,250)">
        <rect x={0} y={0} width={580} height={520} rx={30} fill="rgba(255,255,255,0.04)" stroke="#56627d" />
        <path d="M40,260 L540,260" stroke={C.oxyD} strokeWidth={30} />
        {Array.from({ length: 8 }).map((_, i) => { const x = 80 + i * 60; const L = 180 * clamp01(grow * 1.6 - i * 0.08); return <g key={i}><path d={`M${x},260 q${i % 2 ? 30 : -30},${-L / 2} 0,${-L}`} stroke="#d9536f" strokeWidth={8} fill="none" /><path d={`M${x + 20},260 q${i % 2 ? -30 : 30},${L / 2} 0,${L}`} stroke="#d9536f" strokeWidth={8} fill="none" /></g>; })}
        <text x={290} y={490} fill={C.text} fontSize={26} textAnchor="middle" fontWeight={700}>Hipoksia kronis → pembuluh baru</text>
      </g>}
    </Svg>
    {step === 2 && <Card hi o={ap(2)} style={{ position: 'absolute', left: 1240, top: 260, width: 580, fontSize: 30 }}>Dipicu kimia lokal · diperantarai <b>parakrin endotel</b></Card>}
    {step >= 4 && <div style={{ position: 'absolute', left: 1250, top: 800, display: 'flex', gap: 12 }}><Card o={ap(4)} style={{ fontSize: 24, padding: '10px 16px' }}>🏅 Kapiler atlet ↑</Card><Card o={ap(4, 10)} style={{ fontSize: 24, padding: '10px 16px' }}>🫀 Pintas koroner</Card></div>}
  </AbsoluteFill>;
};

export const CVCenter: React.FC = () => {
  const { step, ap, f } = useS();
  const targets: [number, number, string][] = [[1350, 300, '🫀 Jantung'], [1350, 520, '🔴 Arteriol'], [1350, 740, '🔵 Vena']];
  return <AbsoluteFill>
    <Heading sub="Cardiovascular center (PPT hlm 73)">Pusat Kardiovaskular di Medula</Heading>
    <Svg>
      <Brain x={430} y={460} s={2.4} />
      <ellipse cx={480} cy={640} rx={40} ry={90} fill="#e9a6b8" stroke="#b56b80" strokeWidth={4} />
      <circle cx={480} cy={630} r={30 + 5 * Math.sin(f / 8)} fill={C.accent} opacity={0.8} />
      <Tag x={480} y={790} text="Medula oblongata" fs={30} color={C.accent} />
      {step >= 1 && <g opacity={ap(1)}>{['Baroreflex', 'Kemoreflex', 'Iskemik medula'].map((t, i) => <Tag key={t} x={180 + i * 300} y={230} text={t} fs={26} color={C.nerve} />)}</g>}
      {step >= 2 && targets.map(([x, y, t], i) => <g key={t} opacity={ap(2, i * 8)}>
        <path d={`M510,630 C800,630 900,${y} ${x - 160},${y}`} stroke={C.nerve} strokeWidth={6} fill="none" />
        <path d={`M510,650 C800,660 900,${y + 24} ${x - 160},${y + 24}`} stroke={C.fluid} strokeWidth={6} fill="none" strokeDasharray="12 10" />
        {Array.from({ length: 3 }).map((_, k) => { const tt = ((f / 45 + k / 3) % 1); return <circle key={k} cx={lerp(510, x - 160, tt)} cy={lerp(630, y, tt * tt)} r={8} fill={C.nerve} />; })}
        <rect x={x - 150} y={y - 40} width={320} height={90} rx={20} fill="#0f1b36" stroke={C.cardB} strokeWidth={3} />
        <text x={x + 10} y={y + 15} fill={C.text} fontSize={32} fontWeight={800} textAnchor="middle">{t}</text>
      </g>)}
      {step >= 2 && <g opacity={ap(2)}><Tag x={1700} y={250} text="— simpatis" fs={24} color={C.nerve} /><Tag x={1700} y={300} text="- - parasimpatis" fs={24} color={C.fluid} /></g>}
    </Svg>
    {step >= 3 && <Card hi o={ap(3)} style={{ position: 'absolute', left: 1180, top: 830, width: 640, fontSize: 26 }}>Mengatur tonus vaskular via simpatis ke otot polos</Card>}
    <PdfFig src="medulla.png" x={1300} y={240} w={520} o={step === 0 ? ap(0, 15) : 0} caption="Gambar PPT hlm 73" />
  </AbsoluteFill>;
};

/** neck + heart schematic */
const BaroSchema: React.FC<{ step: number; ap: (k: number, d?: number) => number; f: number; hiIX?: boolean; hiX?: boolean; chemo?: boolean }> = ({ ap, f, hiIX, hiX, chemo }) => {
  const sig = (pts: [number, number][], c: string, on: boolean) => on ? Array.from({ length: 4 }).map((_, k) => { const t = ((f / 40 + k / 4) % 1); const i = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1))); const u = t * (pts.length - 1) - i; return <circle key={k} cx={lerp(pts[i][0], pts[i + 1][0], u)} cy={lerp(pts[i][1], pts[i + 1][1], u)} r={9} fill={c} />; }) : null;
  const ixPts: [number, number][] = [[560, 470], [600, 340], [700, 230]];
  const xPts: [number, number][] = [[760, 720], [820, 500], [740, 230]];
  return <g>
    <Brain x={720} y={180} s={1.4} />
    <circle cx={720} cy={235} r={20} fill={C.accent} />
    {/* carotid */}
    <path d="M760,760 C700,650 560,620 560,420 L560,280" stroke={C.oxyD} strokeWidth={34} fill="none" strokeLinecap="round" />
    <circle cx={560} cy={470} r={34} fill={C.oxy} stroke={hiIX ? C.accent : '#fff'} strokeWidth={hiIX ? 8 : 3} />
    {/* aortic arch */}
    <path d="M820,900 C820,720 980,700 1000,820 L1000,960" stroke={C.oxyD} strokeWidth={50} fill="none" />
    <circle cx={850} cy={740} r={34} fill={C.oxy} stroke={hiX ? C.accent : '#fff'} strokeWidth={hiX ? 8 : 3} />
    <HeartIcon x={880} y={930} s={0.8} />
    <polyline points={ixPts.map((p) => p.join(',')).join(' ')} stroke={C.nerve} strokeWidth={6} fill="none" opacity={ap(0)} />
    <polyline points={xPts.map((p) => p.join(',')).join(' ')} stroke={C.lymph} strokeWidth={6} fill="none" opacity={ap(0)} />
    {sig(ixPts, C.nerve, !!hiIX)}{sig(xPts, C.lymph, !!hiX)}
    <Tag x={360} y={480} text={chemo ? 'Badan karotis' : 'Sinus karotis'} fs={28} color={C.oxy} />
    <Tag x={1080} y={720} text={chemo ? 'Badan aorta' : 'Arkus aorta'} fs={28} color={C.oxy} />
    <Tag x={430} y={330} text="CN IX (glosofaringeus)" fs={24} color={C.nerve} o={hiIX ? 1 : 0.6} />
    <Tag x={1000} y={520} text="CN X (vagus)" fs={24} color={C.lymph} o={hiX ? 1 : 0.6} />
    <Tag x={720} y={90} text="Medula" fs={26} color={C.accent} />
  </g>;
};

export const Baroreflex: React.FC = () => {
  const { step, ap, f } = useS();
  const rows = [['Reseptor', 'Baroreseptor (mekanoreseptor regangan): sinus karotis & arkus aorta', 1], ['Aferen', 'CN IX (sinus karotis) · CN X (arkus aorta)', 3], ['Integrasi', 'Pusat kardiovaskular, medula oblongata', 4], ['Eferen', 'Simpatis: ↑HR, ↑kontraktilitas, vasokonstriksi · Parasimpatis (vagus): ↓HR', 5]];
  return <AbsoluteFill>
    <Heading sub="Baroreflex (PPT hlm 74–75)">Baroreflex: Sensor Tekanan</Heading>
    <Svg><g transform="translate(-40,105) scale(0.85)"><BaroSchema step={step} ap={ap} f={f} hiIX={step >= 3} hiX={step >= 3} /></g></Svg>
    <div style={{ position: 'absolute', left: 1080, top: 200, width: 760, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card o={ap(0)} hi={step === 0} style={{ fontSize: 26 }}>⚡ Kontrol cepat, jangka pendek · <b>umpan balik negatif</b></Card>
      {rows.map(([a, b, k], i) => <Card key={i} o={ap(k as number)} hi={step === k || (k === 1 && step === 2)} style={{ fontSize: 26, padding: '14px 22px' }}><b style={{ color: C.accent }}>{a}:</b> {b}</Card>)}
      {step >= 6 && <Card hi color={C.good} o={ap(6)} style={{ fontSize: 30 }}>🧠 Ingat: <b>9 → sinus</b>, <b>10 → arkus</b></Card>}
    </div>
  </AbsoluteFill>;
};

export const BaroLoop: React.FC = () => {
  const { step, ap } = useS();
  const up = step <= 3;
  const base = up ? 0 : 4;
  const col = up ? C.bad : C.fluid;
  const items = up
    ? ['Tekanan darah ↑', 'Regangan ↑ → impuls baroreseptor ↑', 'Medula: parasimpatis ↑, simpatis ↓', 'HR ↓, SV ↓, arteriol & vena dilatasi', 'CO ↓ + TPR ↓ → tekanan kembali normal']
    : ['Tekanan darah ↓ (berdiri mendadak)', 'Impuls baroreseptor ↓', 'Medula: simpatis ↑, parasimpatis ↓', 'HR ↑, kontraktilitas ↑, vasokonstriksi', 'CO ↑ + TPR ↑ → tekanan pulih'];
  const vis = (i: number) => up ? (i === 0 ? ap(0) : i === 1 ? ap(1) : i === 2 ? ap(2) : ap(3, (i - 3) * 20)) : (i <= 1 ? ap(4, i * 15) : ap(5, (i - 2) * 15));
  const pos: [number, number][] = [[960, 230], [1500, 400], [1300, 700], [620, 700], [420, 400]];
  return <AbsoluteFill>
    <Heading sub="Baroreceptor reflex (PPT hlm 76–77)">{up ? 'Skenario 1: Tekanan Naik' : 'Skenario 2: Tekanan Turun'}</Heading>
    <Svg>
      {pos.map((p, i) => { const q = pos[(i + 1) % 5]; return <Arrow key={i} x1={lerp(p[0], q[0], 0.22)} y1={lerp(p[1], q[1], 0.22)} x2={lerp(p[0], q[0], 0.78)} y2={lerp(p[1], q[1], 0.78)} color={col} w={6} t={i === 4 ? 0 : Math.min(vis(i), vis(i + 1))} />; })}
      {items.map((t, i) => <Box key={i + base} x={pos[i][0]} y={pos[i][1]} w={520} h={90} t={t} c={col} o={vis(i)} fs={26} />)}
      <text x={960} y={480} fill={C.text} fontSize={34} textAnchor="middle" fontWeight={900} opacity={step >= 6 ? ap(6) : 0}>🌡️ Termostat tubuh</text>
      <text x={960} y={525} fill={C.dim} fontSize={26} textAnchor="middle" opacity={step >= 6 ? ap(6) : 0}>sensor → pusat → efektor → titik setel</text>
    </Svg>
    <PdfFig src="baroreflex-flow.png" x={1420} y={780} w={420} o={step >= 6 ? 0 : 0} />
  </AbsoluteFill>;
};

export const Chemoreflex: React.FC = () => {
  const { step, ap, f } = useS();
  return <AbsoluteFill>
    <Heading sub="Chemoreflex (PPT hlm 77)">Kemoreflex</Heading>
    <Svg><g transform="translate(-40,105) scale(0.85)"><BaroSchema step={step} ap={ap} f={f} hiIX={step >= 2} hiX={step >= 2} chemo /></g></Svg>
    <div style={{ position: 'absolute', left: 1080, top: 200, width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card o={ap(1)} hi={step === 1} style={{ fontSize: 28 }}>Pemicu: ↓O₂ (hipoksemia) · ↑CO₂ (hiperkapnia) · ↑H⁺ (asidosis)</Card>
      <Card o={ap(2)} hi={step === 2} style={{ fontSize: 28 }}>Reseptor: badan karotis & badan aorta</Card>
      <Card o={ap(3)} hi={step === 3} style={{ fontSize: 28 }}>🫁 Utama: ↑ laju napas</Card>
      <Card o={ap(4)} hi={step === 4} style={{ fontSize: 28 }}>🩸 Sekunder: vasokonstriksi luas → BP ↑</Card>
    </div>
    {step >= 3 && <Svg><g transform="translate(1500,820)"><Lungs x={0} y={0} s={0.6} breathe={Math.sin(f / 6)} /></g></Svg>}
  </AbsoluteFill>;
};

export const MedullaryIschemic: React.FC = () => {
  const { step, ap, f } = useS();
  const bp = step === 0 ? lerp(93, 50, ap(0, 10, 90)) : step === 1 ? 50 : lerp(50, 85, ap(2, 30, 120));
  const alarm = step >= 1 && Math.floor(f / 10) % 2 === 0;
  return <AbsoluteFill>
    <Heading sub="Medullary ischemic reflex (PPT hlm 78)">Refleks Iskemik Medula (Darurat)</Heading>
    <Svg>
      <Gauge x={420} y={520} r={200} v={bp} max={160} label="Tekanan darah" color={bp < 60 ? C.bad : C.pressure} />
      <line x1={420 + Math.cos((-210 + 240 * 60 / 160) * Math.PI / 180) * 160} y1={520 + Math.sin((-210 + 240 * 60 / 160) * Math.PI / 180) * 160} x2={420 + Math.cos((-210 + 240 * 60 / 160) * Math.PI / 180) * 215} y2={520 + Math.sin((-210 + 240 * 60 / 160) * Math.PI / 180) * 215} stroke={C.bad} strokeWidth={8} />
      <Tag x={420} y={800} text="ambang ~60 mmHg" fs={26} color={C.bad} />
      <Brain x={1000} y={420} s={1.8} color={step >= 1 && step < 2 ? '#e7a0a8' : '#f7c6d0'} />
      {alarm && step === 1 && <circle cx={1040} cy={520} r={70} fill={C.bad} opacity={0.35} />}
      {step >= 1 && <Tag x={1000} y={640} text="Medula: CO₂ ↑, pH ↓" fs={28} color={C.bad} o={ap(1)} />}
      {step >= 2 && <g opacity={ap(2)}><Arrow x1={1180} y1={460} x2={1450} y2={460} color={C.nerve} w={10} label="SIMPATIS KUAT" fs={28} />
        <Tag x={1640} y={360} text="↑ HR" fs={30} color={C.oxy} /><Tag x={1640} y={440} text="↑ kontraktilitas" fs={30} color={C.oxy} /><Tag x={1640} y={520} text="vasokonstriksi" fs={30} color={C.oxy} /><Tag x={1640} y={620} text="→ perfusi otak pulih" fs={30} color={C.good} /></g>}
    </Svg>
    {step === 0 && <Card o={ap(0)} style={{ position: 'absolute', left: 1180, top: 760, width: 640, fontSize: 28 }}>Contoh: syok hemoragik berat</Card>}
  </AbsoluteFill>;
};

export const RAAS: React.FC = () => {
  const { step, ap, f } = useS();
  return <AbsoluteFill>
    <Heading sub="Renin–angiotensin–aldosterone (PPT hlm 80–81)">Sistem RAAS</Heading>
    <Svg>
      <g opacity={ap(1)}><Kidney x={200} y={330} s={1.3} /><text x={200} y={440} fill={C.text} fontSize={26} textAnchor="middle">Ginjal: renin</text></g>
      <g opacity={ap(1)} transform="translate(420,40)"><path d="M560,230 C640,200 760,210 780,260 C760,320 620,330 560,300 Z" fill="#8b2e2e" /><text x={670} y={350} fill={C.text} fontSize={26} textAnchor="middle">Hati: angiotensinogen</text></g>
      <Box x={670} y={380} w={340} t="Angiotensinogen" c={C.pressure} o={ap(1)} />
      <Arrow x1={300} y1={380} x2={490} y2={380} color={C.pressure} t={ap(1, 10)} label="renin" fs={24} />
      <Arrow x1={670} y1={425} x2={670} y2={505} color={C.pressure} t={ap(1, 20)} />
      <Box x={670} y={550} w={300} t="Angiotensin I" c={C.pressure} o={ap(1, 20)} />
      <g opacity={ap(2)}><Lungs x={260} y={640} s={0.8} /><text x={260} y={760} fill={C.text} fontSize={26} textAnchor="middle">Paru: ACE</text></g>
      <Arrow x1={670} y1={595} x2={670} y2={675} color={C.pressure} t={ap(2)} label="ACE" lx={-50} ly={10} fs={24} />
      <Box x={670} y={720} w={340} t="Angiotensin II" c={C.bad} o={ap(2, 10)} hi={step >= 3} fs={32} />
      {step >= 3 && <g opacity={ap(3)}>
        <Arrow x1={840} y1={700} x2={1100} y2={560} color={C.bad} t={ap(3)} />
        <Box x={1260} y={520} w={400} t="Vasokonstriksi kuat" c={C.bad} />
        <Arrow x1={840} y1={720} x2={1100} y2={720} color={C.bad} t={ap(3, 15)} />
        <Box x={1260} y={720} w={400} t="Hipotalamus: haus" c={C.bad} />
      </g>}
      {step >= 4 && <g opacity={ap(4)}>
        <Arrow x1={840} y1={740} x2={1100} y2={880} color={C.bad} t={ap(4)} />
        <Box x={1260} y={890} w={400} t="Aldosteron (adrenal)" c={C.pressure} />
        <Arrow x1={1460} y1={890} x2={1560} y2={890} color={C.pressure} t={ap(4, 20)} />
        <Box x={1720} y={890} w={300} h={90} t="Retensi Na⁺ & air" sub="volume ↑ → BP ↑" c={C.good} fs={24} />
      </g>}
      {step >= 3 && <Tag x={1700} y={620} text="BP ↑" fs={44} color={C.bad} o={ap(3, 30)} />}
      {void f}
    </Svg>
    <PdfFig src="raas.png" x={1300} y={170} w={520} o={step === 0 ? ap(0, 10) : 0} caption="Gambar PPT hlm 81" />
  </AbsoluteFill>;
};

export const Hormones: React.FC = () => {
  const { step, ap } = useS();
  const H = [['ANP & BNP', '↑ ekskresi Na⁺ & air · vasodilatasi · ↓ renin, Ang II, aldosteron', '↓ BP', C.good, 0], ['ADH / vasopresin', 'Retensi air · kadar tinggi: vasokonstriksi', '↑ BP', C.bad, 2], ['Epinefrin & NE', 'Reseptor α-adrenergik → vasokonstriksi', '↑ BP', C.bad, 3], ['Angiotensin II · Aldosteron', '(dibahas sebelumnya)', '↑ BP', C.bad, 0]];
  return <AbsoluteFill>
    <Heading sub="Hormonal control (PPT hlm 79–81)">Hormon Pengatur Tekanan Darah</Heading>
    <div style={{ position: 'absolute', left: 120, top: 220, width: 1100, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {H.map(([a, b, c, col, k], i) => <Card key={i} o={ap(k as number, i === 3 ? 30 : 0)} hi={step === k || (k === 0 && step === 1 && i === 0)} color={col as string} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: 1 }}><div style={{ fontSize: 34, fontWeight: 900 }}>{a}</div><div style={{ fontSize: 26, color: C.dim, marginTop: 4 }}>{b}</div></div>
        <div style={{ fontSize: 44, fontWeight: 900, color: col as string, width: 140, textAlign: 'right' }}>{c}</div>
      </Card>)}
    </div>
    <PdfFig src="anp.png" x={1280} y={230} w={560} o={step <= 1 ? ap(0, 20) : 0} caption="Gambar PPT hlm 81" />
    {step >= 4 && <Card o={ap(4)} style={{ position: 'absolute', left: 1280, top: 300, width: 560, fontSize: 26, borderColor: '#7dd3fc' }}>💊 Penghambat ACE & diuretik bekerja pada sistem ini. (β₂ di otot rangka: epinefrin dapat vasodilatasi)</Card>}
  </AbsoluteFill>;
};

export const Integration: React.FC = () => {
  const { step, ap, f } = useS();
  const hem = step >= 2;
  const map = step < 2 ? 93 : step === 2 ? lerp(93, 70, ap(2, 0, 60)) : step === 3 ? lerp(70, 84, ap(3, 0, 80)) : lerp(84, 92, ap(4, 0, 100));
  return <AbsoluteFill>
    <Heading sub="Integrasi CO, TPR, volume darah & MAP">Semua Bekerja Bersama</Heading>
    <Svg>
      <Gauge x={960} y={330} r={130} v={map} max={160} label="MAP" color={map < 80 ? C.bad : C.pressure} />
      <Box x={620} y={560} w={300} t="CO = HR × SV" c={C.oxy} o={ap(0)} />
      <Box x={1300} y={560} w={300} t="TPR" c={C.pressure} o={ap(0)} />
      <Arrow x1={700} y1={515} x2={850} y2={420} color={C.oxy} t={ap(0)} />
      <Arrow x1={1220} y1={515} x2={1070} y2={420} color={C.pressure} t={ap(0)} />
      <Box x={420} y={720} w={300} t="Aliran balik vena" c={C.deoxy} o={ap(1)} fs={26} />
      <Box x={420} y={850} w={300} t="Volume darah" c={C.deoxy} o={ap(1)} fs={26} hi={hem} />
      <Arrow x1={420} y1={810} x2={420} y2={765} color={C.deoxy} t={ap(1)} />
      <Arrow x1={500} y1={680} x2={580} y2={605} color={C.deoxy} t={ap(1)} />
      <Box x={1180} y={720} w={260} t="Radius arteriol" c={C.pressure} o={ap(1)} fs={24} />
      <Box x={1450} y={720} w={220} t="Viskositas" c={C.pressure} o={ap(1)} fs={24} />
      {hem && <Tag x={420} y={940} text="🩸 Perdarahan" fs={28} color={C.bad} o={ap(2)} />}
      {step >= 3 && <g opacity={ap(3)}><Box x={1650} y={330} w={340} h={90} t="⚡ Baroreflex" sub="detik: simpatis ↑" c={C.nerve} /><Arrow x1={1480} y1={330} x2={1100} y2={330} color={C.nerve} t={ap(3)} /></g>}
      {step >= 4 && <g opacity={ap(4)}><Box x={250} y={330} w={380} h={90} t="💉 Ang II · Aldo · ADH" sub="menit–jam: volume ↑" c={C.pressure} /><Arrow x1={440} y1={330} x2={820} y2={330} color={C.pressure} t={ap(4)} /></g>}
      {step >= 5 && <Tag x={960} y={150} text="🧠🫀 Autoregulasi: perfusi organ vital terjaga" fs={30} color={C.good} o={ap(5)} />}
      {void f}{void clamp01}
    </Svg>
  </AbsoluteFill>;
};
