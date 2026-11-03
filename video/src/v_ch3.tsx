import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, useS, Card, Heading, Svg, Lungs, Kidney, Flow, Pt, Arrow, Tag, lerp, clamp01, PdfFig } from './lib';

const rnd = (i: number) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };

/** row of endothelial cells (flat tiles) */
const EndoRow: React.FC<{ x1: number; x2: number; y: number; h?: number; gap?: number; fen?: boolean; big?: boolean; tight?: boolean; n?: number }> = ({ x1, x2, y, h = 34, gap = 10, fen, big, tight, n = 6 }) => {
  const w = (x2 - x1) / n;
  return <g>{Array.from({ length: n }).map((_, i) => {
    const x = x1 + i * w; const g = tight ? 0 : big ? gap * 3 : gap;
    return <g key={i}>
      <rect x={x + g / 2} y={y - h / 2} width={w - g} height={h} rx={12} fill="#f6c1cc" stroke="#d07085" strokeWidth={2} />
      <ellipse cx={x + w / 2} cy={y} rx={w * 0.16} ry={h * 0.28} fill="#b45a74" />
      {fen && [0.22, 0.75].map((u) => <ellipse key={u} cx={x + w * u} cy={y} rx={7} ry={h * 0.42} fill="#0b1328" />)}
      {tight && <line x1={x} y1={y - h / 2} x2={x} y2={y + h / 2} stroke={C.accent} strokeWidth={4} />}
    </g>;
  })}</g>;
};

/** particles crossing a wall at positions xs from yA to yB */
const Cross: React.FC<{ xs: number[]; yA: number; yB: number; color: string; r?: number; rate?: number; label?: string; o?: number }> = ({ xs, yA, yB, color, r = 8, rate = 60, o = 1 }) => {
  const { f } = useS();
  return <g opacity={o}>{xs.map((x, i) => [0, 0.5].map((off) => {
    const t = ((f / rate + off + rnd(i)) % 1);
    return <circle key={i + '-' + off} cx={x + Math.sin(t * 6 + i) * 6} cy={lerp(yA, yB, t)} r={r} fill={color} opacity={Math.min(1, Math.sin(t * Math.PI) * 2)} />;
  }))}</g>;
};

export const CapillaryWall: React.FC = () => {
  const { step, ap, f } = useS();
  const yT = 380, yB = 640;
  return <AbsoluteFill>
    <Heading sub="Capillary wall structure">Dinding Kapiler: Selapis Endotel</Heading>
    <Svg>
      <rect x={160} y={yT} width={1250} height={yB - yT} fill="#5b0f1d" />
      <EndoRow x1={160} x2={1410} y={yT} gap={step >= 1 ? 14 : 10} fen={step >= 2} />
      <EndoRow x1={160} x2={1410} y={yB} gap={step >= 1 ? 14 : 10} fen={step >= 2} />
      <Flow pts={[[160, (yT + yB) / 2], [1410, (yT + yB) / 2]]} n={7} speed={1.6} r={36} />
      {step >= 1 && <>
        <Cross xs={[160 + 1250 / 6, 160 + 2 * 1250 / 6, 160 + 4 * 1250 / 6]} yA={yT + 40} yB={yT - 110} color={C.fluid} r={7} o={ap(1)} />
        <Cross xs={[160 + 3 * 1250 / 6, 160 + 5 * 1250 / 6]} yA={yB - 40} yB={yB + 110} color={C.fluid} r={7} o={ap(1)} />
        <Tag x={480} y={yT - 120} text="Pori / celah antarsel: air & zat kecil larut air" fs={26} color={C.fluid} o={ap(1)} />
      </>}
      {step >= 2 && <Tag x={1000} y={yB + 140} text="Fenestrasi: lubang menembus sel" fs={26} color={C.accent} o={ap(2)} />}
      <Tag x={330} y={yB + 140} text="Sel endotel pipih" fs={26} color="#f6c1cc" o={ap(0)} />
      {step >= 3 && <g opacity={ap(3)} transform="translate(1640,500)">
        <circle r={110} fill="none" stroke="#9aa5b8" strokeWidth={8} />
        {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={-100 + i * 33} y1={-80} x2={-100 + i * 33} y2={80} stroke="#9aa5b8" strokeWidth={3} />)}
        {Array.from({ length: 7 }).map((_, i) => <line key={i} y1={-100 + i * 33} x1={-80} y2={-100 + i * 33} x2={80} stroke="#9aa5b8" strokeWidth={3} />)}
        {Array.from({ length: 5 }).map((_, i) => <circle key={i} cx={-40 + i * 20} cy={((f * 2 + i * 40) % 260) - 130} r={6} fill={C.fluid} />)}
        <text y={160} fill={C.text} fontSize={28} textAnchor="middle" fontWeight={700}>Seperti saringan</text>
      </g>}
    </Svg>
    <PdfFig src="capillary-continuous.png" x={1450} y={200} w={420} o={step === 0 ? ap(0, 20) : 0} caption="Gambar PPT hlm 31" />
  </AbsoluteFill>;
};

export const CapillaryTypes: React.FC = () => {
  const { step, ap } = useS();
  const T = [
    { k: 1, t: 'Otak', s: 'paling rapat', tight: true, rate: 0, col: C.good },
    { k: 2, t: 'Otot & paru', s: 'kontinu, cukup bocor', rate: 2, col: C.fluid },
    { k: 3, t: 'Ginjal & usus', s: 'berfenestrasi', fen: true, rate: 4, col: C.pressure },
    { k: 4, t: 'Hati', s: 'diskontinu, paling bocor', big: true, fen: true, rate: 7, col: C.oxy },
  ];
  return <AbsoluteFill>
    <Heading sub="Permeabilitas berbeda tiap organ">Jenis Kapiler</Heading>
    <Svg>
      {T.map((c, i) => {
        const x = 120 + i * 440; const on = step === 0 || step === c.k || step >= 5;
        const y1 = 360, y2 = 560;
        return <g key={i} opacity={on ? (ap(c.k) > 0 || step === 0 ? 1 : 0.5) : 0.3}>
          <rect x={x - 10} y={250} width={400} height={540} rx={30} fill={step === c.k ? 'rgba(255,209,102,0.08)' : 'rgba(255,255,255,0.03)'} stroke={step === c.k ? C.accent : 'rgba(255,255,255,0.1)'} strokeWidth={3} />
          <rect x={x + 10} y={y1} width={360} height={y2 - y1} fill="#5b0f1d" />
          <EndoRow x1={x + 10} x2={x + 370} y={y1} n={3} tight={c.tight} fen={c.fen} big={c.big} gap={14} />
          <EndoRow x1={x + 10} x2={x + 370} y={y2} n={3} tight={c.tight} fen={c.fen} big={c.big} gap={14} />
          {c.rate > 0 && <Cross xs={Array.from({ length: c.rate }).map((_, k) => x + 40 + k * (300 / c.rate))} yA={y2 - 30} yB={y2 + 130} color={C.fluid} r={7} rate={50} />}
          <text x={x + 190} y={300} fill={c.col} fontSize={40} fontWeight={900} textAnchor="middle">{c.t}</text>
          <text x={x + 190} y={740} fill={C.text} fontSize={28} textAnchor="middle">{c.s}</text>
          <rect x={x + 60} y={760} width={260} height={14} rx={7} fill="rgba(255,255,255,0.1)" />
          <rect x={x + 60} y={760} width={260 * (0.05 + c.rate / 7.5)} height={14} rx={7} fill={c.col} />
        </g>;
      })}
      <Tag x={960} y={830} text="permeabilitas →" fs={24} color={C.dim} />
    </Svg>
  </AbsoluteFill>;
};

export const CapillaryBed: React.FC = () => {
  const { step, ap } = useS();
  const active = step === 3 ? ap(3) : step >= 4 ? 1 - ap(4) : 0.5;
  const yM = 520;
  const caps = [[-1, 0.18], [-1, 0.42], [-1, 0.66], [1, 0.3], [1, 0.55], [1, 0.8]] as const;
  return <AbsoluteFill>
    <Heading sub="Metarteriol & sfingter prekapiler">Kapiler Saat Aktif vs Istirahat</Heading>
    <Svg>
      {/* arteriole & venule */}
      <rect x={120} y={yM - 40} width={300} height={80} rx={40} fill={C.oxyD} />
      <rect x={1500} y={yM - 40} width={300} height={80} rx={40} fill={C.deoxyD} />
      <rect x={400} y={yM - 22} width={1120} height={44} fill="#7a3a6a" />
      <Flow pts={[[150, yM], [1780, yM]]} n={22} speed={step >= 4 ? 7 : 4} r={9} color={(t) => (t < 0.45 ? C.oxy : t > 0.6 ? C.deoxy : '#b04a9a')} />
      <Tag x={270} y={yM - 70} text="Arteriol" fs={28} color={C.oxy} />
      <Tag x={1650} y={yM - 70} text="Venula" fs={28} color={C.deoxy} />
      <Tag x={960} y={yM + 8} text="Metarteriol" fs={24} color={C.text} bg="rgba(0,0,0,0)" />
      {caps.map(([side, u], i) => {
        const x1 = 400 + u * 900, x2 = x1 + 260; const yy = yM + side * 230;
        const pts: Pt[] = [[x1, yM + side * 22], [x1, yy], [x2, yy], [x2, yM + side * 22]];
        const open = active > 0.5;
        return <g key={i}>
          <path d={`M${x1},${yM + side * 22} L${x1},${yy} L${x2},${yy} L${x2},${yM + side * 22}`} fill="none" stroke={open ? '#c0396b' : '#4a3048'} strokeWidth={14} strokeLinejoin="round" opacity={0.6 + active * 0.4} />
          {open && <Flow pts={pts} n={6} speed={2} r={6} color={(t) => (t < 0.5 ? C.oxy : C.deoxy)} />}
          <g transform={`translate(${x1},${yM + side * 60})`}>
            <ellipse rx={open ? 22 : 12} ry={8} fill="none" stroke={open ? C.good : C.bad} strokeWidth={7} />
          </g>
        </g>;
      })}
      {step >= 1 && step <= 2 && <Tag x={400 + 0.18 * 900} y={yM - 300} text="Sfingter prekapiler (cincin otot polos)" fs={26} color={C.accent} o={ap(1)} />}
    </Svg>
    {step === 2 && <Card o={ap(2)} style={{ position: 'absolute', left: 1240, top: 170, width: 600, fontSize: 28 }}>Tidak dipersarafi · tonus miogenik tinggi · peka metabolit lokal</Card>}
    {step >= 3 && <Card hi color={step === 3 ? C.good : C.bad} o={1} style={{ position: 'absolute', left: 1240, top: 170, width: 600, fontSize: 30 }}>{step === 3 ? '🏃 Jaringan AKTIF: metabolit ↑ → sfingter relaksasi → banyak kapiler terisi' : '😴 ISTIRAHAT: sfingter kontraksi → darah lewat metarteriol'}</Card>}
  </AbsoluteFill>;
};

export const Diffusion: React.FC = () => {
  const { step, ap, f } = useS();
  const yC = 330;
  const mk = (i: number, down: boolean) => {
    const t = ((f / 90 + rnd(i)) % 1);
    const x = 360 + rnd(i + 7) * 1100;
    const y = down ? lerp(yC, 760, t) : lerp(760, yC, t);
    return { x, y, o: Math.sin(t * Math.PI) };
  };
  return <AbsoluteFill>
    <Heading sub="Diffusion across capillary walls">Difusi: Dari Konsentrasi Tinggi ke Rendah</Heading>
    <Svg>
      <rect x={260} y={yC - 70} width={1300} height={140} rx={70} fill="#5b0f1d" stroke="#f6c1cc" strokeWidth={10} />
      <Flow pts={[[300, yC], [1520, yC]]} n={10} speed={1.6} r={26} />
      <text x={280} y={yC - 95} fill={C.text} fontSize={28} fontWeight={700}>Kapiler (darah)</text>
      <ellipse cx={910} cy={770} rx={520} ry={90} fill="#f3d9a4" opacity={0.9} />
      <ellipse cx={910} cy={780} rx={90} ry={45} fill="#b98a3e" />
      <text x={910} y={735} fill="#4a3000" fontSize={30} fontWeight={800} textAnchor="middle">Sel jaringan: memakai O₂ & glukosa → CO₂ & sisa</text>
      {step >= 1 && Array.from({ length: 10 }).map((_, i) => { const p = mk(i, true); return <g key={'d' + i} opacity={p.o * ap(1)}>{i % 2 ? <circle cx={p.x} cy={p.y} r={11} fill={C.fluid} /> : <polygon points={Array.from({ length: 6 }).map((_, k) => `${p.x + 13 * Math.cos(k * Math.PI / 3)},${p.y + 13 * Math.sin(k * Math.PI / 3)}`).join(' ')} fill={C.good} />}</g>; })}
      {step >= 2 && Array.from({ length: 8 }).map((_, i) => { const p = mk(i + 30, false); return <g key={'u' + i} opacity={p.o * ap(2)}>{i % 2 ? <circle cx={p.x} cy={p.y} r={11} fill={C.pressure} /> : <rect x={p.x - 9} y={p.y - 9} width={18} height={18} fill="#9aa5b8" />}</g>; })}
      <g transform="translate(1620,420)" opacity={ap(1)}>
        <circle cx={0} cy={0} r={11} fill={C.fluid} /><text x={22} y={9} fill={C.text} fontSize={26}>O₂ ↓</text>
        <polygon points="0,40 11,46 11,58 0,64 -11,58 -11,46" fill={C.good} /><text x={22} y={60} fill={C.text} fontSize={26}>Glukosa ↓</text>
        <circle cx={0} cy={100} r={11} fill={C.pressure} opacity={ap(2)} /><text x={22} y={109} fill={C.text} fontSize={26} opacity={ap(2)}>CO₂ ↑</text>
        <rect x={-9} y={140} width={18} height={18} fill="#9aa5b8" opacity={ap(2)} /><text x={22} y={158} fill={C.text} fontSize={26} opacity={ap(2)}>Sisa ↑</text>
      </g>
    </Svg>
    {step >= 3 && <div style={{ position: 'absolute', left: 160, top: 875, display: 'flex', gap: 16 }}>
      {['🫁 Paru', '🍽️ Saluran cerna', '🫘 Ginjal', '🖐️ Kulit'].map((t, i) => <Card key={i} o={ap(3, i * 8)} style={{ fontSize: 26, padding: '10px 18px' }}>{t}</Card>)}
      <Card hi o={ap(3, 30)} style={{ fontSize: 26, padding: '10px 18px' }}>Organ rekondisi: + O₂ & nutrien, − CO₂ & sisa</Card>
    </div>}
  </AbsoluteFill>;
};

export const Fick: React.FC = () => {
  const { step, ap, f, lp } = useS();
  const panel = step <= 2 ? 0 : step === 3 ? 1 : 2;
  const P = (i: number, x: number, title: string, ic: string, body: React.ReactNode) => (
    <Card hi={panel === i && step >= 1} o={step >= [1, 3, 4][i] ? 1 : 0.35} style={{ position: 'absolute', left: x, top: 200, width: 540, height: 620, padding: 26 }}>
      <div style={{ fontSize: 34, fontWeight: 900 }}>{ic} {title}</div>{body}
    </Card>
  );
  const count = Math.round(lerp(0, 40, clamp01(lp(3) * 1.5)));
  return <AbsoluteFill>
    <Heading sub="Factors enhancing diffusion (Fick's law)">Hukum Fick: 3 Keunggulan Kapiler</Heading>
    {P(0, 90, 'Jarak difusi minimal', '📏', <svg width={490} height={500} style={{ marginTop: 10 }}>
      <rect x={20} y={110} width={450} height={110} fill="#5b0f1d" />
      <rect x={20} y={96} width={450} height={14} fill="#f6c1cc" /><rect x={20} y={220} width={450} height={14} fill="#f6c1cc" />
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 130 + f * 1.5) % 520) - 20} cy={165} rx={46} ry={40} fill={C.oxy} />)}
      <text x={245} y={70} fill={C.text} fontSize={26} textAnchor="middle">selapis endotel + membran basal</text>
      <line x1={490} y1={110} x2={490} y2={220} stroke={C.accent} strokeWidth={4} /><text x={470} y={175} fill={C.accent} fontSize={28} textAnchor="end" fontWeight={800}>≈7 µm</text>
      <text x={245} y={290} fill={C.text} fontSize={26} textAnchor="middle" opacity={ap(2)}>Sel darah merah lewat satu per satu</text>
      <rect x={60} y={340} width={370} height={70} rx={20} fill="#f3d9a4" opacity={ap(2)} /><text x={245} y={385} fill="#4a3000" fontSize={26} textAnchor="middle" opacity={ap(2)}>Sel jaringan &lt; 0,1 mm</text>
    </svg>)}
    {P(1, 690, 'Luas permukaan maksimal', '🗺️', <div style={{ marginTop: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 30, color: C.dim }}>Jumlah kapiler</div>
      <div style={{ fontSize: 80, fontWeight: 900, color: C.fluid }}>10–{step >= 3 ? count : 40}</div><div style={{ fontSize: 34 }}>miliar</div>
      <div style={{ fontSize: 30, color: C.dim, marginTop: 40 }}>Total luas permukaan</div>
      <div style={{ fontSize: 80, fontWeight: 900, color: C.accent }}>~600 m²</div>
      <div style={{ fontSize: 26, color: C.dim, marginTop: 20 }}>sedikit darah disebar tipis di area yang sangat luas</div>
    </div>)}
    {P(2, 1290, 'Waktu pertukaran cukup', '🐢', <svg width={490} height={500} style={{ marginTop: 10 }}>
      {['Aorta', 'Arteri', 'Arteriol', 'Kapiler', 'Vena'].map((t, i) => { const area = [0.08, 0.18, 0.35, 1, 0.3][i]; const vel = [1, 0.7, 0.35, 0.06, 0.4][i]; return <g key={t}>
        <text x={0} y={60 + i * 80} fill={C.text} fontSize={24}>{t}</text>
        <rect x={110} y={38 + i * 80} width={180 * area} height={18} fill={C.fluid} rx={6} />
        <rect x={110} y={60 + i * 80} width={180 * vel} height={18} fill={C.pressure} rx={6} />
      </g>; })}
      <rect x={310} y={40} width={20} height={14} fill={C.fluid} /><text x={338} y={53} fill={C.dim} fontSize={20}>total penampang</text>
      <rect x={310} y={70} width={20} height={14} fill={C.pressure} /><text x={338} y={83} fill={C.dim} fontSize={20}>kecepatan</text>
      <text x={0} y={470} fill={C.dim} fontSize={18}>(skema kualitatif)</text>
    </svg>)}
    {step >= 5 && <Card hi o={ap(5)} style={{ position: 'absolute', left: 560, top: 840, width: 800, fontSize: 30, textAlign: 'center', padding: '12px 20px' }}>🏞️ Sungai melebar menjadi danau → arus melambat</Card>}
  </AbsoluteFill>;
};

export const BulkFlow: React.FC = () => {
  const { step, ap, f } = useS();
  const y = 520;
  return <AbsoluteFill>
    <Heading sub="Bulk flow across capillary walls">Bulk Flow: Perpindahan Cairan</Heading>
    <Svg>
      <rect x={160} y={240} width={1600} height={170} fill="rgba(76,201,240,0.07)" /><rect x={160} y={630} width={1600} height={170} fill="rgba(76,201,240,0.07)" />
      <text x={180} y={280} fill={C.fluid} fontSize={28} fontWeight={700}>Cairan interstisial (kompartemen interstisial)</text>
      <rect x={260} y={y - 80} width={1400} height={160} rx={80} fill="#5b0f1d" stroke="#f6c1cc" strokeWidth={10} />
      <text x={960} y={y + 10} fill={C.text} fontSize={30} fontWeight={700} textAnchor="middle">Plasma (kompartemen vaskular)</text>
      <Flow pts={[[300, y + 40], [1620, y + 40]]} n={8} speed={2} r={14} opacity={0.8} />
      {step >= 2 && [400, 560, 720].map((x, i) => <g key={x}>{[0, 1].map((s) => { const t = ((f / 45 + i * 0.3) % 1); return <circle key={s} cx={x + 20 * i} cy={s ? lerp(y - 80, y - 230, t) : lerp(y + 80, y + 230, t)} r={10} fill={C.fluid} opacity={1 - t} />; })}<Arrow x1={x} y1={y - 90} x2={x} y2={y - 200} color={C.fluid} w={6} t={ap(2)} /><Arrow x1={x} y1={y + 90} x2={x} y2={y + 200} color={C.fluid} w={6} t={ap(2)} /></g>)}
      {step >= 2 && <Tag x={560} y={y - 250 + 20} text="ULTRAFILTRASI (keluar)" fs={30} color={C.fluid} o={ap(2)} />}
      {step >= 3 && [1200, 1360, 1520].map((x, i) => <g key={x}>{[0, 1].map((s) => { const t = ((f / 45 + i * 0.3) % 1); return <circle key={s} cx={x - 20 * i} cy={s ? lerp(y - 230, y - 80, t) : lerp(y + 230, y + 80, t)} r={10} fill={C.lymph} opacity={t} />; })}<Arrow x1={x} y1={y - 200} x2={x} y2={y - 90} color={C.lymph} w={6} t={ap(3)} /><Arrow x1={x} y1={y + 200} x2={x} y2={y + 90} color={C.lymph} w={6} t={ap(3)} /></g>)}
      {step >= 3 && <Tag x={1360} y={y - 250 + 20} text="REABSORPSI (masuk)" fs={30} color={C.lymph} o={ap(3)} />}
    </Svg>
    {step === 1 && <Card hi o={ap(1)} style={{ position: 'absolute', left: 460, top: 830, width: 1000, fontSize: 30, textAlign: 'center' }}>Bukan untuk nutrien (itu difusi) — tetapi membagi <b>volume cairan ekstraseluler</b></Card>}
  </AbsoluteFill>;
};

export const Starling: React.FC = () => {
  const { step, ap, f } = useS();
  const x1 = 300, x2 = 1620, y = 520;
  const Pc = (u: number) => lerp(37, 17, u);
  const S = 4.2; // px per mmHg
  const pts = [0.05, 0.3, 0.55, 0.8, 0.97];
  const net = (u: number) => Pc(u) + 0 - 25 - 1;
  return <AbsoluteFill>
    <Heading sub="Gaya Starling (nilai dari PPT hlm 37)">Empat Gaya Starling</Heading>
    <Svg>
      <defs><linearGradient id="capg" x1="0" x2="1"><stop offset="0" stopColor={C.oxyD} /><stop offset="1" stopColor={C.deoxyD} /></linearGradient></defs>
      <rect x={x1} y={y - 60} width={x2 - x1} height={120} rx={60} fill="url(#capg)" stroke="#f6c1cc" strokeWidth={8} />
      <text x={x1} y={y + 115} fill={C.oxy} fontSize={28} fontWeight={800}>Ujung arteriol</text>
      <text x={x2} y={y + 115} fill={C.deoxy} fontSize={28} fontWeight={800} textAnchor="end">Ujung venula</text>
      {/* Pc outward (up) */}
      {step >= 1 && pts.map((u) => { const x = lerp(x1 + 60, x2 - 60, u); return <Arrow key={u} x1={x - 30} y1={y - 70} x2={x - 30} y2={y - 70 - Pc(u) * S} color={C.oxy} w={8} t={ap(1)} />; })}
      {step >= 1 && <Tag x={x1 + 200} y={y - 70 - 37 * S - 20} text="Pc 37 → 17 (keluar)" fs={28} color={C.oxy} o={ap(1)} />}
      {/* πp inward */}
      {step >= 2 && pts.map((u) => { const x = lerp(x1 + 60, x2 - 60, u); return <Arrow key={u} x1={x + 30} y1={y + 70 + 25 * S} x2={x + 30} y2={y + 70} color={C.fluid} w={8} t={ap(2)} />; })}
      {step >= 2 && <Tag x={x2 - 200} y={y + 70 + 25 * S + 50} text="πp 25 (masuk)" fs={28} color={C.fluid} o={ap(2)} />}
      {step >= 3 && <><Arrow x1={960} y1={y - 120} x2={960} y2={y - 70} color={C.lymph} w={6} t={ap(3)} head={14} /><Tag x={1090} y={y - 95} text="Pif +1 (masuk)" fs={24} color={C.lymph} o={ap(3)} /></>}
      {step >= 4 && <Tag x={820} y={y - 95} text="πif ≈ 0 (keluar)" fs={24} color={C.nerve} o={ap(4)} />}
      {/* water moving */}
      {step >= 5 && Array.from({ length: 6 }).map((_, i) => { const t = ((f / 50 + i / 6) % 1); return <circle key={'o' + i} cx={x1 + 120 + i * 40} cy={lerp(y - 60, y - 220, t)} r={9} fill={C.fluid} opacity={1 - t} />; })}
      {step >= 6 && Array.from({ length: 6 }).map((_, i) => { const t = ((f / 50 + i / 6) % 1); return <circle key={'i' + i} cx={x2 - 320 + i * 40} cy={lerp(y - 220, y - 60, t)} r={9} fill={C.fluid} opacity={t} />; })}
      <g opacity={step >= 1 ? 1 : 0}>{[0, 1].map((k) => { const u = k ? 1 : 0; void u; return null; })}</g>
    </Svg>
    {step >= 5 && <Card hi color={C.oxy} o={ap(5)} style={{ position: 'absolute', left: 120, top: 760, width: 780, fontSize: 30 }}>Ujung arteriol: (37 + 0) − (25 + 1) = <b style={{ color: C.oxy }}>+11 mmHg</b> → ultrafiltrasi</Card>}
    {step >= 6 && <Card hi color={C.fluid} o={ap(6)} style={{ position: 'absolute', left: 1020, top: 760, width: 780, fontSize: 30 }}>Ujung venula: (17 + 0) − (25 + 1) = <b style={{ color: C.fluid }}>−9 mmHg</b> → reabsorpsi</Card>}
    {step === 0 && <PdfFig src="starling.png" x={460} y={680} w={1000} o={ap(0, 10)} caption="Gambar PPT hlm 37" />}
    {step >= 7 && <Card o={ap(7)} style={{ position: 'absolute', left: 1240, top: 170, width: 600, fontSize: 26, borderColor: '#7dd3fc' }}>↑Pc (gagal jantung) atau ↓protein plasma → filtrasi ↑ → <b>edema</b></Card>}
  </AbsoluteFill>;
};

export const Lymphatic: React.FC = () => {
  const { step, ap, f } = useS();
  const yC = 300;
  return <AbsoluteFill>
    <Heading sub="Lymphatic system">Sistem Limfatik: Saluran Drainase</Heading>
    <Svg>
      <rect x={150} y={yC - 50} width={1100} height={100} rx={50} fill="#7a3a6a" stroke="#f6c1cc" strokeWidth={8} />
      <Flow pts={[[180, yC], [1220, yC]]} n={8} speed={2} r={14} color={(t) => (t < 0.5 ? C.oxy : C.deoxy)} />
      <text x={170} y={yC - 70} fill={C.text} fontSize={26} fontWeight={700}>Kapiler darah</text>
      {/* filtered vs reabsorbed */}
      {Array.from({ length: 14 }).map((_, i) => {
        const t = ((f / 120 + i / 14) % 1);
        const x0 = 250 + (i % 7) * 70; const toLymph = i % 3 === 0;
        const x = toLymph ? lerp(x0, 1300, t) : x0 + t * 400; const yy = toLymph ? lerp(yC + 60, 640, t) : yC + 60 + Math.sin(t * Math.PI) * 220;
        return <circle key={i} cx={x} cy={yy} r={9} fill={toLymph ? C.lymph : C.fluid} opacity={0.85} />;
      })}
      {/* lymph capillary */}
      <path d="M1180,640 C1250,560 1360,560 1420,640 L1700,640" stroke={C.lymph} strokeWidth={60} fill="none" strokeLinecap="round" opacity={0.75} />
      <Flow pts={[[1300, 620], [1420, 640], [1700, 640]]} n={6} speed={2} r={8} color={C.lymph} rbc={false} />
      <text x={1300} y={720} fill={C.lymph} fontSize={28} fontWeight={800} textAnchor="middle">Kapiler limfe → vena</text>
      <text x={500} y={820} fill={C.fluid} fontSize={26}>Cairan interstisial: sebagian besar direabsorpsi, sisanya ke limfe</text>
      {step === 1 && <Tag x={700} y={600} text="Tanpa limfatik → menumpuk → EDEMA" fs={30} color={C.bad} o={ap(1)} />}
    </Svg>
    {step >= 2 && <div style={{ position: 'absolute', left: 1260, top: 150, width: 600, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[['⚖️ Keseimbangan cairan', 2], ['🚫 Cegah penumpukan cairan interstisial', 2], ['🩸 Volume plasma & tekanan darah stabil', 2], ['🛡️ Jalur sel imun', 3], ['🧈 Absorpsi lemak (lakteal)', 3], ['🔁 Kembalikan protein ke sirkulasi', 3]].map(([t, k], i) => <Card key={i} o={ap(k as number, (i % 3) * 8)} style={{ fontSize: 24, padding: '8px 16px' }}>{t}</Card>)}
    </div>}
  </AbsoluteFill>;
};
void Lungs; void Kidney;
