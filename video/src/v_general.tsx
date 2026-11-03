import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { C, useS, Card, Heading, Svg, HeartIcon, Lungs, Brain, Kidney, Flow, Pt, Arrow, Tag, usePop, clamp01, Bg } from './lib';

const CH = ['Pendahuluan', 'Sistem Sirkulasi & Pembuluh Darah', 'Arteri & Arteriol', 'Kapiler, Difusi & Bulk Flow', 'Venula, Vena & Aliran Balik Vena', 'Hemodinamika & Tekanan Darah', 'Regulasi Aliran & Tekanan Darah', 'Ringkasan & Latihan Soal'];

export const Cover: React.FC = () => {
  const { f } = useS();
  const o = interpolate(f, [10, 40], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill>
    <Img src={staticFile('pdf/cover.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 + f * 0.0005}) translateX(${-f * 0.05}px)` }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(7,13,28,0.15) 0%, rgba(7,13,28,0.85) 55%)' }} />
    <div style={{ position: 'absolute', right: 120, top: 300, width: 860, opacity: o, transform: `translateY(${(1 - o) * 40}px)` }}>
      <div style={{ fontSize: 34, color: C.accent, fontWeight: 700, letterSpacing: 4 }}>VIDEO EDUKASI FISIOLOGI</div>
      <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, marginTop: 12 }}>Fisiologi<br />Vaskular</div>
      <div style={{ fontSize: 34, color: C.dim, marginTop: 28 }}>Dari struktur pembuluh darah hingga regulasi tekanan darah</div>
      <div style={{ fontSize: 26, color: C.dim, marginTop: 40 }}>Berdasarkan slide kuliah “Vascular Physiology” — dr. Dian Aristia Rachmayanti</div>
    </div>
  </AbsoluteFill>;
};

export const ChapterTitle: React.FC = () => {
  const { f, sc, p } = useS();
  const o = interpolate(f, [5, 30], [0, 1], { extrapolateRight: 'clamp' });
  const n = sc.ch;
  return <AbsoluteFill>
    <Img src={staticFile('pdf/' + p.img)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.15 - f * 0.0008})`, filter: 'brightness(0.55) saturate(1.2)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(7,13,28,0.2), rgba(7,13,28,0.9))' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: o, transform: `scale(${0.9 + 0.1 * o})` }}>
      <div style={{ display: 'inline-block', fontSize: 40, fontWeight: 800, color: '#0b1328', background: C.accent, borderRadius: 60, padding: '10px 40px' }}>{n === 7 ? 'BAGIAN AKHIR' : `BAB ${n}`}</div>
      <div style={{ fontSize: 96, fontWeight: 900, marginTop: 30, textShadow: '0 6px 30px rgba(0,0,0,0.7)' }}>{CH[n]}</div>
      <div style={{ margin: '30px auto 0', height: 6, width: 400 * o, background: `linear-gradient(90deg, ${C.oxy}, ${C.deoxy})`, borderRadius: 3 }} />
    </div>
  </AbsoluteFill>;
};

export const Objectives: React.FC = () => {
  const { ap, step } = useS();
  const items = [['🫀', 'Struktur & fungsi pembuluh darah'], ['💧', 'Hemodinamika: tekanan, aliran, resistensi'], ['📈', 'Sistolik, diastolik, tekanan nadi, MAP'], ['⬆️', 'Mekanisme aliran balik vena'], ['🎛️', 'Kontrol lokal, saraf & hormonal']];
  return <AbsoluteFill>
    <Heading sub="Learning Objectives">Tujuan Belajar</Heading>
    <div style={{ position: 'absolute', left: 160, top: 260, width: 1600, display: 'flex', flexDirection: 'column', gap: 22 }}>
      {items.map(([ic, t], i) => <Card key={i} o={ap(i + 1)} hi={step === i + 1} style={{ display: 'flex', alignItems: 'center', gap: 30, fontSize: 40, padding: '18px 34px' }}>
        <span style={{ fontSize: 48, width: 70 }}>{ic}</span><span style={{ fontWeight: 700, color: C.accent, width: 50 }}>{i + 1}</span>{t}
      </Card>)}
    </div>
  </AbsoluteFill>;
};

export const ThreeComponents: React.FC = () => {
  const { ap, step, f } = useS();
  const loop: Pt[] = [[960, 330], [1500, 330], [1500, 700], [960, 700], [420, 700], [420, 330], [960, 330]];
  return <AbsoluteFill>
    <Heading sub="Introduction">Sistem Sirkulasi = Sistem Transportasi Tubuh</Heading>
    <Svg>
      <path d="M960,330 L1500,330 L1500,700 L420,700 L420,330 Z" fill="none" stroke="#c8344c" strokeWidth={34} strokeLinejoin="round" opacity={0.85 * ap(1)} />
      <path d="M960,330 L1500,330 L1500,700 L420,700 L420,330 Z" fill="none" stroke="#ff6b7c" strokeWidth={6} strokeLinejoin="round" opacity={0.6 * ap(1)} />
      {ap(1) > 0 && <Flow pts={loop} n={36} speed={4} r={8} />}
      <g opacity={ap(1)}><HeartIcon x={960} y={330} s={0.9} split={false} /></g>
      {/* cargo */}
      {step >= 2 && [['O₂', C.fluid], ['Nutrien', C.good], ['Hormon', C.nerve], ['Sisa metabolisme', C.pressure]].map(([t, c], i) => {
        const o = ap(2, i * 10);
        const tt = ((f * 2.2) / 2160 + i / 4) % 1;
        const pts: Pt[] = [[1500, 330], [1500, 700], [420, 700], [420, 330]];
        const L = [370, 1080, 370];
        let d = tt * 1820, x = 0, y = 0;
        if (d < 370) { x = 1500; y = 330 + d; } else if (d < 1450) { x = 1500 - (d - 370); y = 700; } else { x = 420; y = 700 - (d - 1450); }
        void pts; void L;
        return <Tag key={i} x={x} y={y - 40} text={t as string} color={c as string} fs={28} o={o} />;
      })}
    </Svg>
    <div style={{ position: 'absolute', left: 230, top: 420, width: 1460, display: 'flex', justifyContent: 'space-around' }}>
      {[['🫀', 'Jantung', 'pompa'], ['🛣️', 'Pembuluh darah', 'jalur'], ['🩸', 'Darah', 'media angkut']].map(([ic, t, s], i) =>
        <Card key={i} o={ap(1, i * 8)} style={{ width: 340, textAlign: 'center' }}><div style={{ fontSize: 60 }}>{ic}</div><div style={{ fontSize: 38, fontWeight: 800 }}>{t}</div><div style={{ fontSize: 30, color: C.dim }}>{s}</div></Card>)}
    </div>
    {step >= 3 && <Card o={ap(3)} hi style={{ position: 'absolute', left: 460, top: 760, width: 1000, fontSize: 32, textAlign: 'center' }}>🏙️ Analogi kota: <b>jantung</b> = stasiun pompa · <b>pembuluh</b> = jalan raya · <b>darah</b> = truk pengantar</Card>}
  </AbsoluteFill>;
};

export const Recap: React.FC = () => {
  const { ap, step, p, sc, at, f } = useS();
  const qa: [string, string][] = p.qa;
  // line 0 = intro; subsequent lines reveal question/answers in order
  const lineOfQ = (i: number) => 1 + i;
  const lineOfA = (i: number) => 1 + i;
  return <AbsoluteFill>
    <Heading sub="Recap — uji pemahaman">🧠 Cek Pemahaman</Heading>
    <div style={{ position: 'absolute', left: 160, top: 270, width: 1600, display: 'flex', flexDirection: 'column', gap: 40 }}>
      {qa.map(([q, a], i) => {
        const L = sc.lines[lineOfA(i)];
        const showA = f > L.from + L.dur * 0.5;
        return <Card key={i} o={ap(lineOfQ(i))} hi={step === lineOfQ(i) || step === lineOfA(i)} style={{ fontSize: 40 }}>
          <div style={{ fontWeight: 700 }}>❓ {q}</div>
          <div style={{ marginTop: 18, color: C.good, fontSize: 38, opacity: showA ? 1 : 0.0, fontWeight: 700 }}>✅ {a}</div>
        </Card>;
      })}
    </div>
  </AbsoluteFill>;
};

export const QuizIntro: React.FC = () => {
  const { ap } = useS();
  return <AbsoluteFill>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: ap(0) }}>
      <div style={{ fontSize: 130 }}>📝</div>
      <div style={{ fontSize: 90, fontWeight: 900 }}>10 Soal Klinis</div>
      <div style={{ fontSize: 40, color: C.dim, marginTop: 20 }}>Jawab sebelum waktu habis</div>
    </div>
  </AbsoluteFill>;
};

export const Quiz: React.FC = () => {
  const { p, sc, f, ap } = useS();
  const silent = sc.lines[1];
  const countdown = Math.max(0, Math.ceil((silent.from + silent.dur - f) / 30));
  const reveal = f >= sc.lines[2].from - 4;
  const inCount = f >= silent.from && !reveal;
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 90, top: 92, fontSize: 34, color: C.accent, fontWeight: 800 }}>SOAL {p.n} / 10</div>
    <div style={{ position: 'absolute', left: 90, top: 150, width: 1420, fontSize: 46, fontWeight: 700, lineHeight: 1.3 }}>{p.q}</div>
    <div style={{ position: 'absolute', left: 90, top: 400, width: 1420, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
      {p.opts.map((o: string, k: number) => {
        const ok = reveal && k === p.ans; const no = reveal && k !== p.ans;
        return <Card key={k} o={ap(0, 20 + k * 6)} style={{ fontSize: 36, display: 'flex', gap: 20, alignItems: 'center', border: `3px solid ${ok ? C.good : C.cardB}`, background: ok ? 'rgba(74,222,128,0.18)' : C.card, opacity: no ? 0.4 : undefined }}>
          <span style={{ width: 60, height: 60, borderRadius: 30, background: ok ? C.good : 'rgba(255,255,255,0.12)', color: ok ? '#062' : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>{'ABCD'[k]}</span>{o}
        </Card>;
      })}
    </div>
    {inCount && <div style={{ position: 'absolute', right: 120, top: 400, width: 200, height: 200, borderRadius: 100, border: `10px solid ${C.pressure}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, fontWeight: 900, color: C.pressure }}>{countdown}</div>}
    {reveal && <Card hi color={C.good} o={ap(2, 4)} style={{ position: 'absolute', left: 90, top: 720, width: 1740, fontSize: 34, lineHeight: 1.35 }}><b style={{ color: C.good }}>Jawaban {'ABCD'[p.ans]}.</b> {p.why}</Card>}
  </AbsoluteFill>;
};

export const Outro: React.FC = () => {
  const { ap } = useS();
  return <AbsoluteFill>
    <Bg img="cover.png" o={0.25} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
      <div style={{ fontSize: 100, fontWeight: 900, opacity: ap(0) }}>🎓 Selesai!</div>
      <div style={{ display: 'flex', gap: 30, marginTop: 50 }}>
        {[['Tekanan', 'mendorong aliran', C.pressure], ['Radius', 'mengatur resistensi', C.oxy], ['MAP', 'dijaga tetap stabil', C.good]].map(([a, b, c], i) =>
          <Card key={i} o={ap(1, i * 12)} style={{ width: 420, borderColor: c as string }}><div style={{ fontSize: 50, fontWeight: 900, color: c as string }}>{a}</div><div style={{ fontSize: 32 }}>{b}</div></Card>)}
      </div>
      <div style={{ fontSize: 40, marginTop: 60, color: C.dim, opacity: ap(2) }}>Semoga sukses belajar!</div>
    </div>
  </AbsoluteFill>;
};

// ---------- Ringkasan ----------
export const ConceptMap: React.FC = () => {
  const { ap, step } = useS();
  const N = (x: number, y: number, t: string, c: string, k: number, w = 300) => {
    const o = ap(k); if (o <= 0) return null;
    return <g opacity={o} key={t}><rect x={x - w / 2} y={y - 42} width={w} height={84} rx={20} fill="#0f1b36" stroke={c} strokeWidth={step === k ? 6 : 3} /><text x={x} y={y + 11} textAnchor="middle" fill={C.text} fontSize={30} fontWeight={800}>{t}</text></g>;
  };
  return <AbsoluteFill>
    <Heading sub="Peta konsep">Fisiologi Vaskular dalam Satu Gambar</Heading>
    <Svg>
      {[[960, 260, 400, 330], [400, 330, 400, 460], [400, 460, 760, 560], [760, 560, 1160, 560], [1160, 560, 1520, 460], [1520, 460, 1520, 330], [1520, 330, 960, 260]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#56627d" strokeWidth={4} opacity={ap(1)} />)}
      <line x1={960} y1={560} x2={960} y2={680} stroke="#56627d" strokeWidth={4} opacity={ap(2)} />
      {N(960, 260, '🫀 Jantung: tekanan', C.oxy, 1, 360)}
      {N(400, 330, 'Arteri: reservoir', C.oxy, 1)}
      {N(400, 460, 'Arteriol: resistensi', C.pressure, 1, 330)}
      {N(760, 560, 'Kapiler: pertukaran', C.fluid, 2, 330)}
      {N(1160, 560, 'Venula: pengumpul', C.deoxy, 3, 320)}
      {N(1520, 460, 'Vena: kapasitans', C.deoxy, 3)}
      {N(1520, 330, 'Aliran balik vena', C.deoxy, 3)}
      {N(960, 680, 'Difusi · Bulk flow · Limfatik', C.lymph, 2, 480)}
      {N(960, 800, '🎛️ Kontrol lokal · saraf · hormonal  →  MAP = CO × TPR stabil', C.accent, 4, 1100)}
    </Svg>
  </AbsoluteFill>;
};

export const Formulas: React.FC = () => {
  const { ap, step } = useS();
  const F = [['Aliran', 'F = ΔP / R'], ['Poiseuille', 'F = πΔPr⁴ / 8ηL  ⇒  R ∝ ηL / r⁴'], ['Tekanan nadi', 'PP = SBP − DBP'], ['MAP', 'MAP = DBP + ⅓ PP'], ['Curah jantung', 'CO = HR × SV ;  MAP = CO × TPR'], ['Starling', 'NFP = (Pc + πif) − (πp + Pif)']];
  const lineFor = [1, 2, 3, 3, 4, 5];
  return <AbsoluteFill>
    <Heading sub="Rumus yang wajib dikuasai">Ringkasan Rumus</Heading>
    <div style={{ position: 'absolute', left: 160, top: 240, width: 1600, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
      {F.map(([a, b], i) => <Card key={i} o={ap(lineFor[i])} hi={step === lineFor[i]}><div style={{ fontSize: 28, color: C.dim }}>{a}</div><div style={{ fontSize: 44, fontWeight: 800, fontFamily: 'DejaVu Serif, serif' }}>{b}</div></Card>)}
    </div>
  </AbsoluteFill>;
};

export const VesselTable: React.FC = () => {
  const { ap, step } = useS();
  const rows = [
    ['Arteri', 'Tebal, elastis (elastin + kolagen)', 'Tinggi, pulsatil', 'Jalur cepat & reservoir tekanan', 1],
    ['Arteriol', 'Otot polos tebal melingkar', '93 → 37 mmHg', 'Pembuluh resistensi, atur TPR', 2],
    ['Kapiler', 'Selapis endotel (+ membran basal)', '37 → 17 mmHg', 'Pertukaran: difusi & bulk flow', 3],
    ['Venula', 'Tipis', '~17 mmHg', 'Pengumpul dari kapiler', 4],
    ['Vena', 'Tipis, lumen besar, berkatup', '→ 0 mmHg di atrium', 'Kapasitans (>60% volume darah)', 4],
  ];
  const col = [C.oxy, C.pressure, C.fluid, C.deoxy, C.deoxy];
  return <AbsoluteFill>
    <Heading sub="Perbandingan lima jenis pembuluh">Tabel Pembuluh Darah</Heading>
    <div style={{ position: 'absolute', left: 110, top: 230, width: 1700, fontSize: 30 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px 1fr', gap: 12, color: C.dim, fontWeight: 700, padding: '0 20px 10px' }}><div>Pembuluh</div><div>Dinding</div><div>Tekanan</div><div>Fungsi</div></div>
      {rows.map((r, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px 1fr', gap: 12, padding: '20px', marginBottom: 12, borderRadius: 18, background: step === r[4] ? 'rgba(255,209,102,0.12)' : C.card, border: `2px solid ${step === r[4] ? C.accent : C.cardB}`, opacity: ap(r[4] as number) }}>
        <div style={{ fontWeight: 900, color: col[i] }}>{r[0]}</div><div>{r[1]}</div><div>{r[2]}</div><div>{r[3]}</div></div>)}
    </div>
  </AbsoluteFill>;
};

export const RegSummary: React.FC = () => {
  const { ap, step } = useS();
  const L = [['⚡ Seketika', 'Kontrol lokal', 'Autoregulasi · metabolit · miogenik · NO / endotelin · hiperemia reaktif · angiogenesis (jangka panjang)', C.good], ['⏱️ Detik', 'Kontrol saraf', 'Baroreflex (CN IX, X) · kemoreflex · refleks iskemik medula → ubah CO & TPR', C.nerve], ['⏳ Menit–jam', 'Kontrol hormonal', '↑ BP: Angiotensin II · aldosteron · ADH · epinefrin/NE    ↓ BP: ANP · BNP', C.pressure]];
  return <AbsoluteFill>
    <Heading sub="Siapa mengatur apa, dan seberapa cepat">Ringkasan Regulasi Tekanan Darah</Heading>
    <div style={{ position: 'absolute', left: 160, top: 260, width: 1600, display: 'flex', flexDirection: 'column', gap: 26 }}>
      {L.map(([a, b, c, col], i) => <Card key={i} o={ap(i + 1)} hi={step === i + 1} color={col} style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
        <div style={{ width: 260, fontSize: 40, fontWeight: 900, color: col }}>{a}</div>
        <div><div style={{ fontSize: 38, fontWeight: 800 }}>{b}</div><div style={{ fontSize: 30, color: C.dim, marginTop: 6 }}>{c}</div></div>
      </Card>)}
    </div>
  </AbsoluteFill>;
};

void Lungs; void Brain; void Kidney; void Arrow; void usePop; void clamp01;
