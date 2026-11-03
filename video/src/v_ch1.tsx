import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { C, useS, Card, Heading, Svg, HeartIcon, Lungs, Flow, Pt, Arrow, Tag, lerp, clamp01 } from './lib';

const mix = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp01(t)))).join(',')})`;
};

// geometry (translated -170 in x)
const PA: Pt[] = [[870, 590], [690, 590], [690, 250], [850, 250]];
const PCAP: Pt[] = [[850, 250], [1070, 250]];
const PV: Pt[] = [[1070, 250], [1230, 250], [1230, 470], [1050, 470]];
const AO: Pt[] = [[1050, 590], [1420, 590], [1420, 800], [1090, 800]];
const SCAP: Pt[] = [[1090, 800], [830, 800]];
const VC: Pt[] = [[830, 800], [500, 800], [500, 470], [870, 470]];

const Tube: React.FC<{ pts: Pt[]; c1: string; c2?: string; w?: number; o?: number; glow?: boolean }> = ({ pts, c1, c2, w = 30, o = 1, glow }) => {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const id = 'g' + pts[0].join('_') + c1.replace('#', '');
  return <g opacity={o}>
    {c2 && <defs><linearGradient id={id} x1={pts[0][0]} x2={pts[pts.length - 1][0]} y1={0} y2={0} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>}
    {glow && <path d={d} fill="none" stroke={C.accent} strokeWidth={w + 22} strokeLinejoin="round" strokeLinecap="round" opacity={0.35} />}
    <path d={d} fill="none" stroke={c2 ? `url(#${id})` : c1} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />
    <path d={d} fill="none" stroke="#fff" strokeOpacity={0.18} strokeWidth={w * 0.3} strokeLinejoin="round" strokeLinecap="round" transform="translate(0,-5)" />
  </g>;
};

const Chamber: React.FC<{ x: number; y: number; t: string; c: string; hi?: boolean }> = ({ x, y, t, c, hi }) => (
  <g><rect x={x - 88} y={y - 48} width={176} height={96} rx={22} fill={c} stroke={hi ? C.accent : '#fff'} strokeOpacity={hi ? 1 : 0.4} strokeWidth={hi ? 7 : 3} />
    <text x={x} y={y + 8} fill="#fff" fontSize={21} fontWeight={800} textAnchor="middle">{t}</text></g>
);

const CapBed: React.FC<{ x1: number; x2: number; y: number; from: string; to: string }> = ({ x1, x2, y, from, to }) => (
  <g>{[-36, -12, 12, 36].map((dy, i) => <path key={i} d={`M${x1},${y} C${x1 + (x2 - x1) * 0.25},${y + dy} ${x1 + (x2 - x1) * 0.75},${y + dy} ${x2},${y}`} fill="none" stroke={mix(from, to, i / 3)} strokeWidth={7} opacity={0.8} />)}</g>
);

export const Circulation: React.FC = () => {
  const { p, step, ap, lp, f } = useS();
  const mode = p.mode as string;
  const pulOn = mode !== 'systemic';
  const sysOn = mode !== 'pulmonary';
  const dimP = mode === 'systemic' ? 0.25 : 1;
  const dimS = mode === 'pulmonary' ? 0.25 : 1;
  const hi = (m: string, s: number) => mode === m && step === s;
  const colA = (t: number) => mix(C.deoxy, C.oxy, 0) && C.deoxy;
  void colA;
  const capCol = (from: string, to: string) => (t: number) => mix(from, to, t);

  const chainAll = ['Ventrikel kiri', 'Aorta', 'Arteri', 'Arteriol', 'Kapiler', 'Venula', 'Vena', 'Vena kava', 'Atrium kanan', 'Ventrikel kanan', 'Arteri pulmonalis', 'Kapiler paru', 'Vena pulmonalis', 'Atrium kiri', 'Ventrikel kiri'];
  const chainPul = ['Ventrikel kanan', 'Trunkus pulmonalis', 'Arteri pulmonalis', 'Kapiler paru: O₂ masuk, CO₂ keluar', 'Venula & vena pulmonalis', 'Atrium kiri'];
  const pulStep = [0, 2, 3, 5, 5];
  const chainSys = ['Ventrikel kiri', 'Aorta', 'Arteri', 'Arteriol', 'Kapiler jaringan', 'Venula', 'Vena', 'Vena kava', 'Atrium kanan'];
  const sysStep = [1, 3, 4, 8];

  let chain: string[] = [], lit = -1;
  if (mode === 'full') { chain = chainAll; lit = step === 0 ? -1 : step === 1 ? Math.floor(lp(1) * 9.5) : step === 2 ? 9 + Math.floor(lp(2) * 6) : 14; }
  if (mode === 'pulmonary') { chain = chainPul; lit = pulStep[Math.min(step, 4)]; }
  if (mode === 'systemic') { chain = chainSys; lit = sysStep[Math.min(step, 3)]; }

  const exch = mode === 'pulmonary' && step >= 2 ? ap(2) : 0;
  const exchS = mode === 'systemic' && step >= 2 ? ap(2) : 0;
  return <AbsoluteFill>
    <Heading sub={mode === 'overview' ? 'Closed-loop: sirkulasi sistemik & pulmonal' : mode === 'pulmonary' ? 'Pulmonary circulation' : mode === 'systemic' ? 'Systemic circulation' : 'Close-loop diagram'}>
      {mode === 'overview' ? 'Sistem Sirkulasi Tertutup' : mode === 'pulmonary' ? 'Sirkulasi Pulmonal' : mode === 'systemic' ? 'Sirkulasi Sistemik' : 'Satu Lingkaran Lengkap'}
    </Heading>
    <Svg>
      <g transform={`translate(${mode === "overview" ? 0 : -170},10)`}>
        {/* lungs + tissues */}
        <g opacity={dimP}><Lungs x={960} y={215} s={1.25} breathe={Math.sin(f / 25)} /></g>
        <g opacity={dimP}><CapBed x1={850} x2={1070} y={250} from={C.deoxy} to={C.oxy} /></g>
        <g opacity={dimS}><rect x={800} y={745} width={320} height={110} rx={30} fill="#3a2230" stroke="#8a4a5e" strokeWidth={3} /><CapBed x1={1090} x2={830} y={800} from={C.oxy} to={C.deoxy} /></g>
        {/* vessels */}
        <Tube pts={PA} c1={C.deoxyD} o={dimP} glow={hi('pulmonary', 1)} />
        <Tube pts={PV} c1={C.oxyD} o={dimP} glow={hi('pulmonary', 3)} />
        <Tube pts={AO} c1={C.oxyD} o={dimS} glow={hi('systemic', 0) || hi('systemic', 1)} w={36} />
        <Tube pts={VC} c1={C.deoxyD} o={dimS} glow={hi('systemic', 3)} w={36} />
        {pulOn && <><Flow pts={PA} n={9} speed={3} color={C.deoxy} r={8} opacity={dimP} />
          <Flow pts={PCAP} n={4} speed={1.5} color={capCol(C.deoxy, C.oxy)} r={6} opacity={dimP} />
          <Flow pts={PV} n={9} speed={3} color={C.oxy} r={8} opacity={dimP} /></>}
        {sysOn && <><Flow pts={AO} n={11} speed={3.5} color={C.oxy} r={9} opacity={dimS} />
          <Flow pts={SCAP} n={5} speed={1.5} color={capCol(C.oxy, C.deoxy)} r={6} opacity={dimS} />
          <Flow pts={VC} n={11} speed={3} color={C.deoxy} r={9} opacity={dimS} /></>}
        {/* heart chambers */}
        <Chamber x={870} y={470} t="Atrium kanan" c="#2c5fc4" hi={hi('systemic', 3) || (mode === 'full' && lit === 8)} />
        <Chamber x={870} y={590} t="Ventrikel kanan" c="#1f4aa8" hi={hi('pulmonary', 0) || (mode === 'full' && lit === 9)} />
        <Chamber x={1050} y={470} t="Atrium kiri" c="#c4344c" hi={hi('pulmonary', 3) || (mode === 'full' && lit === 13)} />
        <Chamber x={1050} y={590} t="Ventrikel kiri" c="#a51f37" hi={hi('systemic', 0) || (mode === 'full' && (lit === 0 || lit === 14))} />
        <line x1={960} y1={420} x2={960} y2={640} stroke="#fff" strokeWidth={4} opacity={0.5} />
        {/* labels */}
        <Tag x={960} y={120} text="Paru (kapiler paru)" fs={26} color="#f6b8c4" o={dimP} />
        <Tag x={960} y={885} text="Jaringan tubuh (kapiler sistemik)" fs={26} color="#f6b8c4" o={dimS} />
        <Tag x={690} y={420} text="A. pulmonalis" fs={24} color={C.deoxy} o={pulOn ? dimP : 0} />
        <Tag x={1230} y={380} text="V. pulmonalis" fs={24} color={C.oxy} o={pulOn ? dimP : 0} />
        <Tag x={1420} y={690} text="Aorta → arteri" fs={24} color={C.oxy} o={sysOn ? dimS : 0} />
        <Tag x={500} y={640} text="Vena → v. kava" fs={24} color={C.deoxy} o={sysOn ? dimS : 0} />
        {mode === 'overview' && <>
          <Tag x={1330} y={170} text="SIRKULASI PULMONAL" fs={30} color={C.fluid} o={ap(1)} />
          <Tag x={960} y={700} text="SIRKULASI SISTEMIK" fs={30} color={C.pressure} o={ap(1)} />
          {['Arteri', 'Arteriol', 'Kapiler', 'Venula', 'Vena'].map((t, i) => {
            const pos: Pt[] = [[1530, 640], [1250, 850], [960, 775], [690, 850], [400, 600]];
            return <Tag key={t} x={pos[i][0]} y={pos[i][1]} text={t} fs={28} color={C.accent} o={ap(2, i * 10)} />;
          })}
        </>}
        {/* gas exchange */}
        {exch > 0 && <g opacity={exch}>
          <Arrow x1={920} y1={150} x2={920} y2={225} color={C.fluid} w={5} t={exch} label="O₂" lx={-40} ly={0} />
          <Arrow x1={1010} y1={225} x2={1010} y2={150} color={C.pressure} w={5} t={exch} label="CO₂" lx={50} ly={0} />
        </g>}
        {exchS > 0 && <g opacity={exchS}>
          <Arrow x1={1020} y1={830} x2={1020} y2={900} color={C.fluid} w={5} t={exchS} label="O₂, nutrien" lx={90} ly={10} />
          <Arrow x1={900} y1={900} x2={900} y2={830} color={C.pressure} w={5} t={exchS} label="CO₂, sisa" lx={-80} ly={10} />
        </g>}
      </g>
    </Svg>
    {chain.length > 0 && <div style={{ position: 'absolute', right: 60, top: mode === 'full' ? 150 : 200, width: 470, display: 'flex', flexDirection: 'column', gap: mode === 'full' ? 6 : 14 }}>
      {chain.map((c, i) => {
        const on = i <= lit; const cur = i === lit;
        const blue = mode === 'full' ? (i >= 5 && i <= 10) : mode === 'pulmonary' ? i < 3 : i >= 5;
        return <div key={i} style={{ fontSize: mode === 'full' ? 25 : 30, padding: mode === 'full' ? '5px 18px' : '12px 20px', borderRadius: 14, fontWeight: 700, background: on ? (blue ? 'rgba(61,139,255,0.25)' : 'rgba(255,77,94,0.25)') : 'rgba(255,255,255,0.04)', border: `2px solid ${cur ? C.accent : on ? (blue ? C.deoxy : C.oxy) : 'rgba(255,255,255,0.1)'}`, opacity: on ? 1 : 0.45, transform: `scale(${cur ? 1.04 : 1})` }}>{i + 1}. {c}</div>;
      })}
    </div>}
    {mode === 'full' && step >= 3 && <Card hi o={ap(3)} style={{ position: 'absolute', left: 120, top: 200, width: 420, fontSize: 32 }}>💡 <b>Kiri → tubuh</b><br /><b>Kanan → paru</b></Card>}
    {mode === 'pulmonary' && step >= 4 && <Card hi o={ap(4)} style={{ position: 'absolute', left: 90, top: 200, width: 470, fontSize: 29 }}>Arteri = <b>menjauhi jantung</b>, bukan "kaya oksigen". A. pulmonalis membawa darah <span style={{ color: C.deoxy }}>miskin O₂</span>.</Card>}
  </AbsoluteFill>;
};

// ---------- cross sections ----------
type VS = { name: string; outer: number; lumen: number; layers: [number, string][]; analog: string; fn: string; color: string; valve?: boolean };
const VESSELS: VS[] = [
  { name: 'Arteri', outer: 120, lumen: 62, layers: [[120, '#c9a27a'], [100, C.elastin], [96, '#d9536f'], [70, C.elastin], [66, '#f6d2da']], analog: 'pipa elastis', fn: 'Penghantar & reservoir tekanan', color: C.oxy },
  { name: 'Arteriol', outer: 70, lumen: 22, layers: [[70, '#c9a27a'], [62, '#d9536f'], [26, '#f6d2da']], analog: 'keran yang dapat diatur', fn: 'Pembuluh resistensi', color: C.pressure },
  { name: 'Kapiler', outer: 26, lumen: 21, layers: [[26, '#f6d2da']], analog: 'stasiun pertukaran', fn: 'Pertukaran zat', color: C.fluid },
  { name: 'Venula', outer: 50, lumen: 40, layers: [[50, '#c9a27a'], [44, '#f6d2da']], analog: 'pengumpul', fn: 'Mengumpulkan darah', color: '#7aa7ff' },
  { name: 'Vena', outer: 118, lumen: 100, layers: [[118, '#c9a27a'], [110, '#d97f8f'], [104, '#f6d2da']], analog: 'reservoir & jalur pulang', fn: 'Kapasitans (>60% darah)', color: C.deoxy, valve: true },
];

export const VesselCompare: React.FC = () => {
  const { step, ap, f } = useS();
  const xs = [260, 610, 900, 1170, 1560];
  return <AbsoluteFill>
    <Heading sub="Classification of vessels">Lima Jenis Pembuluh Darah</Heading>
    <Svg>
      {VESSELS.map((v, i) => {
        const on = step === i + 1; const o = ap(i + 1) > 0 ? (step === 0 ? 1 : on ? 1 : 0.35) : (step === 0 ? ap(0, i * 8) : 0.25);
        const sc = on ? 1.18 : 1;
        const blood = i < 2 ? C.oxyD : i === 2 ? '#8a3e8f' : C.deoxyD;
        return <g key={i} opacity={o} transform={`translate(${xs[i]},470) scale(${sc})`}>
          {on && <circle r={v.outer + 30} fill={v.color} opacity={0.18} />}
          {v.layers.map(([r, c], k) => <circle key={k} r={r} fill={c} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />)}
          <circle r={v.lumen} fill={blood} />
          {i === 2 ? <ellipse rx={15} ry={11} fill={C.oxy} transform={`rotate(${f * 2})`} /> : Array.from({ length: i === 4 ? 9 : i === 0 ? 6 : 3 }).map((_, k) => {
            const a = k * 2.4 + f * 0.02; const rr = v.lumen * 0.55;
            return <ellipse key={k} cx={Math.cos(a) * rr * (k % 2 ? 0.4 : 0.9)} cy={Math.sin(a) * rr * (k % 2 ? 0.4 : 0.9)} rx={v.lumen * 0.2} ry={v.lumen * 0.14} fill={i < 2 ? C.oxy : '#5a7fd6'} opacity={0.9} />;
          })}
          {v.valve && <path d="M-60,-40 Q0,30 60,-40" stroke="#fff" strokeWidth={6} fill="none" opacity={0.85} />}
          <text y={v.outer + 60} fill={v.color} fontSize={38} fontWeight={900} textAnchor="middle">{v.name}</text>
        </g>;
      })}
    </Svg>
    {step >= 1 && step <= 5 && <Card hi color={VESSELS[step - 1].color} o={ap(step)} style={{ position: 'absolute', left: 260, top: 720, width: 1400, display: 'flex', justifyContent: 'space-between', fontSize: 34 }}>
      <span><b style={{ color: VESSELS[step - 1].color }}>{VESSELS[step - 1].name}</b> — {VESSELS[step - 1].fn}</span>
      <span style={{ color: C.dim }}>Analogi: <b style={{ color: C.text }}>{VESSELS[step - 1].analog}</b></span>
    </Card>}
  </AbsoluteFill>;
};
void interpolate;
