import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, useS, Card, Heading, Svg, HeartIcon, Lungs, Flow, Pt, Arrow, Tag, lerp, clamp01, PdfFig, Muscle, Gauge } from './lib';

export const VeinReservoir: React.FC = () => {
  const { step, ap, f } = useS();
  const fill = step >= 1 ? 0.5 + 0.5 * Math.sin(f / 40) : 0.3;
  const y = 470;
  const r = 70 + 40 * fill;
  return <AbsoluteFill>
    <Heading sub="Vein as a reservoir">Vena: Pembuluh Kapasitans</Heading>
    <Svg>
      {/* venules merging */}
      {[-120, -40, 40, 120].map((dy, i) => <path key={i} d={`M140,${y + dy * 2} C260,${y + dy * 2} 300,${y} 420,${y}`} stroke={C.deoxyD} strokeWidth={22} fill="none" />)}
      <Tag x={190} y={y - 235} text="Venula" fs={26} color={C.deoxy} />
      <rect x={420} y={y - r - 14} width={760} height={2 * r + 28} rx={r} fill="#6d7fae" />
      <rect x={420} y={y - r} width={760} height={2 * r} rx={r - 10} fill={C.deoxyD} />
      <Flow pts={[[440, y], [1160, y]]} n={Math.round(8 + fill * 14)} speed={1.5} r={13} color="#5a7fd6" jitter={r * 0.55} />
      <text x={800} y={y + r + 70} fill={C.text} fontSize={30} textAnchor="middle" fontWeight={700}>Vena: dinding tipis, mudah teregang</text>
      {/* pie */}
      <g transform="translate(1560,420)" opacity={ap(1)}>
        <circle r={170} fill="#22314f" />
        <path d={`M0,0 L0,-170 A170,170 0 1,1 ${170 * Math.sin(2 * Math.PI * 0.62)},${-170 * Math.cos(2 * Math.PI * 0.62)} Z`} fill={C.deoxy} />
        <text y={-10} fill="#fff" fontSize={60} fontWeight={900} textAnchor="middle">&gt;60%</text>
        <text y={40} fill="#fff" fontSize={26} textAnchor="middle">volume darah</text>
        <text y={70} fill="#fff" fontSize={26} textAnchor="middle">di vena (istirahat)</text>
      </g>
    </Svg>
    {step >= 2 && <div style={{ position: 'absolute', left: 120, top: 690, width: 1100, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {[['Otot polos', '↓'], ['Elastin', '↓'], ['Kolagen', '↑']].map(([a, b], i) => <Card key={i} o={ap(2, i * 8)} style={{ fontSize: 30 }}>{a} <b style={{ color: b === '↑' ? C.good : C.bad }}>{b}</b></Card>)}
      {step >= 3 && <Card hi o={ap(3)} style={{ fontSize: 28, width: 1000 }}>Mudah teregang, recoil kecil → simpan banyak darah tanpa ↑ tekanan besar</Card>}
    </div>}
    {step >= 4 && <Card o={ap(4)} style={{ position: 'absolute', left: 1320, top: 720, width: 500, fontSize: 28 }}>🛍️ Kantong plastik lentur, bukan 🎈 balon karet</Card>}
    <PdfFig src="vein-reservoir.png" x={1320} y={640} w={420} o={step === 1 ? ap(1, 30) : 0} caption="Gambar PPT hlm 40" />
  </AbsoluteFill>;
};

export const VenousGradient: React.FC = () => {
  const { step, ap } = useS();
  const y = 470;
  return <AbsoluteFill>
    <Heading sub="Venous return">Aliran Balik Vena</Heading>
    <Svg>
      <defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stopColor="#8a5ad6" /><stop offset="1" stopColor={C.deoxyD} /></linearGradient></defs>
      <rect x={260} y={y - 70} width={1100} height={140} rx={70} fill="url(#vg)" />
      <Flow pts={[[280, y], [1340, y]]} n={14} speed={3} r={14} color="#5a7fd6" jitter={30} />
      <HeartIcon x={1500} y={y} s={1.1} />
      <Tag x={330} y={y - 110} text="Keluar kapiler ~17 mmHg" fs={28} color={C.pressure} o={ap(1)} />
      <Tag x={1350} y={y - 150} text="Atrium ~0 mmHg" fs={28} color={C.pressure} o={ap(1, 10)} />
      {step >= 2 && <Tag x={810} y={y + 130} text="Gradien kecil, tapi cukup: radius besar, resistensi rendah" fs={28} color={C.good} o={ap(2)} />}
      <Tag x={810} y={y - 210} text="Aliran balik vena = curah jantung" fs={32} color={C.accent} o={ap(0)} />
    </Svg>
    {step >= 3 && <div style={{ position: 'absolute', left: 120, top: 720, width: 1680, display: 'flex', gap: 16 }}>
      {['⚡ Simpatis', '💪 Pompa otot', '🚪 Katup vena', '🫁 Pompa respirasi', '🫀 Isapan jantung'].map((t, i) => <Card key={i} o={ap(3, i * 8)} style={{ fontSize: 28, flex: 1, textAlign: 'center' }}>{i + 1}. {t}</Card>)}
    </div>}
  </AbsoluteFill>;
};

export const SympVeno: React.FC = () => {
  const { step, ap, f } = useS();
  const con = ap(1);
  const y = 520; const r = lerp(95, 55, con);
  const hr = step >= 2 ? 1.6 : 1;
  return <AbsoluteFill>
    <Heading sub="Sympathetic activity on venous return">1. Venokonstriksi Simpatis</Heading>
    <Svg>
      <rect x={200} y={y - r - 12} width={1000} height={2 * r + 24} rx={r} fill="#6d7fae" />
      <rect x={200} y={y - r} width={1000} height={2 * r} rx={r - 10} fill={C.deoxyD} />
      <Flow pts={[[220, y], [1180, y]]} n={16} speed={1.5 + con * 4} r={13} color="#5a7fd6" jitter={r * 0.5} />
      <path d={`M200,${y - 230} C500,${y - 260} 800,${y - 200} 1200,${y - 240}`} stroke={C.nerve} strokeWidth={6} fill="none" />
      {[350, 650, 950].map((x, i) => Array.from({ length: 3 }).map((_, k) => { const t = ((f / 35 + k / 3 + i * 0.2) % 1); return <circle key={x + '' + k} cx={x + (k - 1) * 10} cy={lerp(y - 230, y - r - 14, t)} r={6} fill={C.nerve} opacity={(1 - t) * ap(0)} />; }))}
      <Tag x={700} y={y - 280} text="Saraf simpatis → otot polos vena" fs={28} color={C.nerve} o={ap(0)} />
      <Arrow x1={1210} y1={y} x2={1380} y2={y} color={C.deoxy} t={con} w={10} label="ke atrium kanan" ly={-30} fs={26} />
      <g transform={`translate(1560,${y})`}><HeartIcon x={0} y={0} s={1.1} beat={false} /></g>
      <g transform={`translate(1560,${y}) scale(${1 + 0.06 * Math.max(0, Math.sin(f / 30 * Math.PI * 2 * hr)) ** 4})`} opacity={0} />
      {step >= 2 && <g opacity={ap(2)}><Tag x={1560} y={y - 170} text="↑ HR (nodus SA)" fs={28} color={C.oxy} /><Tag x={1560} y={y + 170} text="↑ kontraktilitas (Ca²⁺)" fs={28} color={C.oxy} /></g>}
    </Svg>
    {step >= 3 && <Card hi o={ap(3)} style={{ position: 'absolute', left: 300, top: 790, width: 1300, fontSize: 30, textAlign: 'center' }}>🏃 Olahraga: simpatis ↑ → vena konstriksi + jantung cepat & kuat → <b>↑↑ curah jantung</b> ke otot</Card>}
    <PdfFig src="sympathetic-heart.png" x={1380} y={150} w={460} o={step === 2 ? 0 : 0} />
  </AbsoluteFill>;
};

/** vertical vein segment with two valves; c = contraction 0..1 */
export const MusclePump: React.FC = () => {
  const { step, ap, f, at } = useS();
  // cycle: contract / relax every 90 frames from line 1
  let c = 0.5;
  if (step === 1) c = ap(1, 10, 30);
  else if (step === 2) c = 1 - ap(2, 10, 30);
  else if (step >= 3) c = 0.5 + 0.5 * Math.sin(f / 24);
  const cx = 560, top = 260, bot = 880;
  const w = lerp(70, 34, c);
  const upOpen = c > 0.5, lowOpen = c <= 0.5;
  const Valve = (y: number, open: boolean, label: string) => <g>
    <path d={open ? `M${cx - w},${y + 30} Q${cx - w * 0.85},${y - 10} ${cx - w * 0.75},${y - 40} M${cx + w},${y + 30} Q${cx + w * 0.85},${y - 10} ${cx + w * 0.75},${y - 40}` : `M${cx - w},${y - 20} Q${cx - w * 0.4},${y + 10} ${cx},${y + 25} M${cx + w},${y - 20} Q${cx + w * 0.4},${y + 10} ${cx},${y + 25}`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
    <Tag x={cx + 240} y={y + 8} text={`${label}: ${open ? 'TERBUKA' : 'TERTUTUP'}`} fs={26} color={open ? C.good : C.bad} />
  </g>;
  const dir = c > 0.5 ? -1 : 1;
  void at;
  return <AbsoluteFill>
    <Heading sub="Skeletal muscle pump + venous valves">2–3. Pompa Otot Rangka & Katup Vena</Heading>
    <Svg>
      <rect x={cx - w - 12} y={top} width={2 * (w + 12)} height={bot - top} rx={30} fill="#6d7fae" />
      <rect x={cx - w} y={top} width={2 * w} height={bot - top} rx={24} fill={C.deoxyD} />
      {Array.from({ length: 10 }).map((_, i) => { const t = ((i / 10) + (f * (c > 0.5 ? 3 : 1.2)) / 660) % 1; const y = bot - t * (bot - top); return <ellipse key={i} cx={cx + Math.sin(i * 3) * w * 0.4} cy={y} rx={Math.min(16, w * 0.4)} ry={11} fill="#5a7fd6" />; })}
      <Muscle x={cx - w - 90} y={530} w={70} h={190} c={c} />
      <Muscle x={cx + w + 90} y={530} w={70} h={190} c={c} />
      {Valve(380, upOpen, 'Katup atas')}
      {Valve(790, lowOpen, 'Katup bawah')}
      <Arrow x1={cx} y1={dir < 0 ? 620 : 420} x2={cx} y2={dir < 0 ? 420 : 620} color={C.accent} w={8} t={step >= 1 ? 1 : 0} />
      <text x={cx} y={top - 30} fill={C.text} fontSize={28} textAnchor="middle" fontWeight={700}>↑ ke jantung</text>
      <Tag x={cx - 230} y={530} text={c > 0.5 ? 'Otot KONTRAKSI' : 'Otot RELAKSASI'} fs={28} color={c > 0.5 ? C.oxy : C.fluid} />
      {step >= 3 && <g opacity={ap(3)} transform="translate(1250,330)">
        <rect x={-90} y={-60} width={180} height={400} rx={20} fill="none" stroke="#9aa5b8" strokeWidth={6} />
        <rect x={-70} y={lerp(260, -40, (f % 120) / 120)} width={140} height={90} rx={12} fill={C.accent} />
        <text x={0} y={lerp(320, 20, (f % 120) / 120)} fill="#3a2a00" fontSize={60} textAnchor="middle">⬆</text>
        <text x={0} y={400} fill={C.text} fontSize={28} textAnchor="middle" fontWeight={700}>Lift yang hanya naik</text>
      </g>}
      {step >= 4 && <g opacity={ap(4)} transform="translate(1600,300)">
        <rect x={-30} y={0} width={60} height={480} rx={20} fill={C.deoxyD} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-30,${60 + i * 95} Q0,${90 + i * 95} 30,${60 + i * 95}`} stroke="#fff" strokeWidth={5} fill="none" />)}
        <text x={0} y={-20} fill={C.text} fontSize={26} textAnchor="middle">Berdiri: segmen</text>
        <text x={50} y={110} fill={C.accent} fontSize={24}>2–4 cm</text>
      </g>}
    </Svg>
    {step >= 5 && <Card o={ap(5)} style={{ position: 'absolute', left: 1000, top: 830, width: 760, fontSize: 28, borderColor: '#7dd3fc' }}>Katup rusak → darah menggenang → <b>varises</b></Card>}
    <PdfFig src="venous-valves.png" x={1320} y={180} w={480} o={step === 0 ? ap(0, 20) : 0} caption="Gambar PPT hlm 43–44" />
  </AbsoluteFill>;
};

export const RespPump: React.FC = () => {
  const { step, ap, f } = useS();
  const insp = step >= 1 ? 0.5 + 0.5 * Math.sin(f / 30) : 0;
  const dY = 470 + insp * 60;
  return <AbsoluteFill>
    <Heading sub="Respiratory (thoracic) pump">4. Pompa Respirasi</Heading>
    <Svg>
      {/* thorax */}
      <path d={`M${560 - insp * 40},230 Q960,${150 - insp * 20} ${1360 + insp * 40},230 L${1360 + insp * 40},${dY} Q960,${dY - 80} ${560 - insp * 40},${dY} Z`} fill="rgba(76,201,240,0.10)" stroke="#9aa5b8" strokeWidth={6} />
      <Lungs x={960} y={330} s={1.4 + insp * 0.15} />
      <path d={`M${560 - insp * 40},${dY} Q960,${dY - 80} ${1360 + insp * 40},${dY}`} stroke="#d9536f" strokeWidth={22} fill="none" />
      <Tag x={1500} y={dY - 30} text="Diafragma" fs={26} color="#ff9fb2" />
      {/* abdomen */}
      <rect x={600} y={dY + 20} width={720} height={330 - insp * 50} rx={60} fill="rgba(255,183,3,0.08)" stroke="#9aa5b8" strokeWidth={4} />
      {/* IVC */}
      <rect x={760} y={260} width={50} height={600} rx={20} fill={C.deoxyD} />
      <Flow pts={[[785, 840], [785, 280]]} n={10} speed={1 + insp * 4} r={11} color="#5a7fd6" />
      <HeartIcon x={880} y={280} s={0.5} beat={false} />
      {step >= 1 && <><Tag x={1180} y={220} text={`Tekanan intratoraks ${insp > 0.5 ? '↓' : ''}`} fs={28} color={C.fluid} o={ap(1)} />
        <Tag x={1150} y={dY + 160} text={`Tekanan abdomen ${insp > 0.5 ? '↑' : ''}`} fs={28} color={C.pressure} o={ap(2)} /></>}
      <Tag x={420} y={260} text={insp > 0.5 ? 'INSPIRASI' : 'EKSPIRASI'} fs={34} color={C.accent} o={step >= 1 ? 1 : 0} />
      {step >= 3 && <Arrow x1={700} y1={760} x2={700} y2={330} color={C.accent} w={8} t={ap(3)} label="vena abdomen → dada → atrium kanan" lx={-10} ly={0} fs={0} />}
    </Svg>
    {step >= 3 && <Card hi o={ap(3)} style={{ position: 'absolute', left: 90, top: 560, width: 460, fontSize: 28 }}>Darah terdorong: vena abdomen → vena dada → atrium kanan</Card>}
    {step >= 4 && <Card o={ap(4)} style={{ position: 'absolute', left: 1400, top: 640, width: 440, fontSize: 28 }}>🏃 Olahraga: pompa respirasi + pompa otot + venokonstriksi = sinergis</Card>}
  </AbsoluteFill>;
};

export const CardiacSuction: React.FC = () => {
  const { step, ap, f } = useS();
  const T = 70; const ph = (f % T) / T; const sys = ph < 0.4;
  const av = sys ? Math.sin(ph / 0.4 * Math.PI / 2) : 1 - (ph - 0.4) / 0.6;
  const cx = 820, avY = 470 + av * 70;
  const pa = sys ? -3 * av : 0;
  return <AbsoluteFill>
    <Heading sub="Cardiac suction">5. Isapan Jantung</Heading>
    <Svg>
      {/* atrium */}
      <rect x={cx - 230} y={230} width={460} height={avY - 230} rx={40} fill="#2c5fc4" opacity={0.85} />
      <text x={cx} y={300} fill="#fff" fontSize={30} textAnchor="middle" fontWeight={800}>Atrium</text>
      {/* ventricle */}
      <path d={`M${cx - 250 + (sys ? av * 30 : 0)},${avY} L${cx + 250 - (sys ? av * 30 : 0)},${avY} L${cx + 120 - (sys ? av * 20 : -10)},860 L${cx - 120 + (sys ? av * 20 : -10)},860 Z`} fill="#1f4aa8" />
      <text x={cx} y={760} fill="#fff" fontSize={30} textAnchor="middle" fontWeight={800}>Ventrikel</text>
      <line x1={cx - 250} y1={avY} x2={cx + 250} y2={avY} stroke={C.accent} strokeWidth={10} />
      <Tag x={cx + 400} y={avY + 10} text="Bidang katup AV" fs={26} color={C.accent} />
      {/* veins in */}
      <rect x={cx - 400} y={300} width={180} height={70} rx={30} fill={C.deoxyD} />
      <Flow pts={[[cx - 400, 335], [cx - 150, 335]]} n={6} speed={sys ? 5 : 2} r={11} color="#5a7fd6" />
      <text x={cx - 400} y={280} fill={C.text} fontSize={26}>dari vena</text>
      <Tag x={cx} y={190} text={sys ? 'SISTOL VENTRIKEL' : 'DIASTOL'} fs={32} color={sys ? C.oxy : C.fluid} />
      {step >= 1 && <g opacity={ap(1)}><Gauge x={1500} y={420} r={120} v={pa} min={-5} max={10} label="Tekanan atrium" /></g>}
      {step >= 1 && sys && <Arrow x1={cx} y1={420} x2={cx} y2={avY + 10} color={C.accent} w={6} t={1} />}
      {step >= 3 && !sys && <g>{[-1, 1].map((s) => <Arrow key={s} x1={cx + s * 60} y1={680} x2={cx + s * 170} y2={680} color={C.fluid} w={6} t={ap(3)} />)}<Tag x={1500} y={760} text="Ventrikel mengembang → tekanan negatif singkat" fs={26} color={C.fluid} o={ap(3)} /></g>}
    </Svg>
    {step === 2 && <Card hi o={ap(2)} style={{ position: 'absolute', left: 1240, top: 680, width: 560, fontSize: 30 }}>Tekanan atrium &lt; 0 mmHg → darah tertarik dari vena</Card>}
  </AbsoluteFill>;
};

export const VenousSummary: React.FC = () => {
  const { step, ap } = useS();
  const nodes: [number, number, string, string][] = [[420, 330, '⚡ Venokonstriksi simpatis', C.nerve], [420, 520, '💪 Pompa otot + katup', C.oxy], [420, 710, '🫁 Pompa respirasi', C.fluid], [1500, 330, '🫀 Isapan jantung', C.oxy], [1500, 560, '🩸 Volume darah', C.pressure]];
  return <AbsoluteFill>
    <Heading sub="Factors that facilitate venous return (PPT hlm 47)">Rangkuman Aliran Balik Vena</Heading>
    <Svg>
      <circle cx={960} cy={520} r={150} fill="#1a2747" stroke={C.deoxy} strokeWidth={6} />
      <text x={960} y={510} fill={C.text} fontSize={36} fontWeight={900} textAnchor="middle">Aliran balik</text>
      <text x={960} y={555} fill={C.text} fontSize={36} fontWeight={900} textAnchor="middle">vena ↑</text>
      {nodes.map(([x, y, t, c], i) => <g key={i} opacity={ap(0, i * 8)}>
        <Arrow x1={x < 960 ? x + 200 : x - 200} y1={y} x2={x < 960 ? 805 : 1115} y2={lerp(y, 520, 0.6)} color={c} w={5} />
        <rect x={x - 200} y={y - 40} width={400} height={80} rx={20} fill="#0f1b36" stroke={c} strokeWidth={step === 1 && i === 4 ? 7 : 3} />
        <text x={x} y={y + 10} fill={C.text} fontSize={28} fontWeight={700} textAnchor="middle">{t}</text>
      </g>)}
    </Svg>
    {step >= 2 && <Card o={ap(2)} hi={step === 2} style={{ position: 'absolute', left: 1260, top: 660, width: 560, fontSize: 26 }}>⏱️ Jangka pendek: pergeseran cairan <b>bulk flow</b> plasma ⇄ interstisial</Card>}
    {step >= 3 && <Card o={ap(3)} hi={step === 3} style={{ position: 'absolute', left: 1260, top: 800, width: 560, fontSize: 26 }}>📅 Jangka panjang: garam & air via <b>RAAS</b> & <b>ADH</b></Card>}
  </AbsoluteFill>;
};
void clamp01;
