/* Modul C3 — Penyakit Jantung Koroner (Kuliah 8) */
(function () {
  /* arteri memanjang dengan plak, stage 0..6 */
  function artery(stage) {
    const cap = stage >= 3 ? (stage === 3 ? 10 : 4) : 0;
    const plaqueH = [0, 8, 28, 34, 40, 40, 40][stage];
    const thr = stage === 5 ? 22 : stage === 6 ? 74 : 0;
    const lumenTop = 60, lumenBot = 150;
    let s = `<rect x="10" y="40" width="400" height="20" fill="#f3a6c4"/><rect x="10" y="150" width="400" height="20" fill="#f3a6c4"/>
      <rect x="10" y="60" width="400" height="90" fill="var(--o2-rich)" opacity=".12"/>
      <text class="svg-label small" x="14" y="34">dinding arteri koroner (intima–media)</text>`;
    if (stage >= 1) {
      const x0 = 150, x1 = 270, top = lumenBot - plaqueH;
      s += `<path d="M${x0},${lumenBot} C${x0 + 20},${top} ${x1 - 20},${top} ${x1},${lumenBot} Z" fill="#ffe066" stroke="#f08c00"/>`;
      if (stage >= 2) for (let i = 0; i < 6; i++) s += `<circle cx="${x0 + 25 + i * 14}" cy="${lumenBot - plaqueH * .4 + (i % 2) * 4}" r="5" fill="#fab005" stroke="#e67700"/>`;
      if (cap) s += `<path d="M${x0 + 4},${lumenBot - 2} C${x0 + 22},${top - 1} ${x1 - 22},${top - 1} ${x1 - 4},${lumenBot - 2}" fill="none" stroke="#c2255c" stroke-width="${cap / 2}"/>`;
      if (stage >= 4) s += `<path d="M205,${top + 2} l8,-6 l6,8" stroke="var(--bad)" stroke-width="3" fill="none"/>`;
      if (thr) s += `<path d="M175,${top + 2} C190,${top - thr} 235,${top - thr} 250,${top + 2} Z" fill="#c92a2a" opacity=".85"/>${[0, 1, 2, 3].map((i) => `<circle cx="${190 + i * 12}" cy="${top - thr / 2}" r="3" fill="#fff" opacity=".7"/>`).join("")}`;
    }
    const open = stage === 6 ? 0 : stage === 5 ? .45 : stage >= 2 ? .65 : 1;
    s += `<path id="art-flow" d="M10,105 H410" fill="none"/><g class="art-p" data-open="${open}"></g>`;
    const lbl = ["Arteri normal: endotel utuh, aliran lancar", "Fatty streak: sel busa (makrofag berisi LDL teroksidasi) di intima", "Fibroateroma: inti lipid + otot polos migrasi", "Plak STABIL: tudung fibrosa tebal → stenosis tetap", "Plak RENTAN: tudung tipis, inti lipid besar, radang → robek", "Trombus SEBAGIAN menyumbat → UA / NSTEMI", "Trombus MENYUMBAT TOTAL → STEMI"][stage];
    s += `<text class="svg-label small" x="210" y="196" text-anchor="middle" style="font-weight:700">${lbl}</text>`;
    return `<svg viewBox="0 0 420 205" role="img" aria-label="Perjalanan plak aterosklerosis">${s}</svg>`;
  }
  const g = (x, m, w) => Math.exp(-((x - m) ** 2) / (2 * w * w));
  /** gelombang EKG 1 denyut; st: +/-; tinv: T terbalik; q: gelombang Q patologis */
  function beat(o = {}) {
    const st = o.st || 0;
    return (t) => 0.12 * g(t, 40, 14) - (o.q ? .35 : .08) * g(t, 95, o.q ? 8 : 4) + (o.r ?? 1) * g(t, 110, 6) - .2 * g(t, 124, 5) + (t > 130 && t < 300 ? st * K.clamp((t - 130) / 20, 0, 1) * (t < 260 ? 1 : (300 - t) / 40) : 0) + (o.tinv ? -.3 : .3) * g(t, 300, 30);
  }
  const ecgSVG = (f, w = 200, h = 90, label = "") => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="EKG"><line class="svg-grid" x1="0" y1="${h * .62}" x2="${w}" y2="${h * .62}"/><path d="${K.plot(f, 0, 400, (t) => t / 400 * w, (v) => h * .62 - v * h * .45, 200)}" fill="none" stroke="var(--primary)" stroke-width="2.2"/>${label ? `<text class="svg-label small" x="4" y="12" style="font-weight:700">${label}</text>` : ""}</svg>`;

  const STEPS = [
    { title: "Spektrum PJK", body: "PJK = ketidakseimbangan <b>suplai</b> dan <b>kebutuhan</b> O₂ miokard, umumnya akibat <b>aterosklerosis koroner</b>. Dua kelompok besar: <b>Sindrom Koroner Kronik (SKK)</b> — mis. angina stabil — dan <b>Sindrom Koroner Akut (SKA)</b>: angina tidak stabil (UA), NSTEMI, STEMI.", key: "Kronik = plak stabil menyempitkan. Akut = plak robek + trombus.", st: 0 },
    { title: "Awal aterosklerosis: fatty streak", body: "Faktor risiko (LDL tinggi, hipertensi, rokok, diabetes) merusak <b>endotel</b>. LDL masuk ke intima dan teroksidasi → monosit masuk menjadi <b>makrofag</b> → memakan LDL → <b>sel busa</b>. Kumpulan sel busa = <b>fatty streak</b>.", key: "Sudah bisa dimulai sejak usia muda.", st: 1 },
    { title: "Fibroateroma", body: "Sel otot polos bermigrasi dari media, menghasilkan kolagen → terbentuk <b>tudung fibrosa</b> di atas <b>inti nekrotik berisi lipid</b>. Plak menonjol ke lumen.", key: "Plak = inti lipid + tudung fibrosa.", st: 2 },
    { title: "Plak stabil → angina stabil (SKK)", body: "Tudung tebal → plak stabil, tetapi menyempitkan lumen. Bila stenosis ≳70%, saat <b>aktivitas</b> kebutuhan O₂ naik sedangkan aliran tidak bisa naik → iskemia → <b>nyeri dada saat aktivitas</b>, hilang dengan istirahat/nitrat (<b>angina stabil</b>).", key: "Pola nyeri dapat diprediksi (ambang aktivitas sama).", st: 3 },
    { title: "Plak rentan & robek", body: "Plak dengan <b>tudung tipis</b>, inti lipid besar, dan banyak sel radang mudah <b>robek (ruptur)</b> atau mengalami <b>erosi</b>. Isi plak yang sangat trombogenik terpapar darah → trombosit menempel & teraktivasi → kaskade koagulasi.", key: "Plak yang robek seringkali bukan yang paling sempit.", st: 4 },
    { title: "Trombus sebagian: UA / NSTEMI", body: "Trombus <b>tidak menyumbat total</b> (atau intermiten) → iskemia terutama <b>subendokardium</b>. Nyeri saat istirahat / makin sering. EKG: <b>depresi ST</b> atau T terbalik (bisa normal). <b>Troponin normal → UA</b>; <b>troponin naik → NSTEMI</b> (sudah ada nekrosis).", key: "UA vs NSTEMI dibedakan oleh TROPONIN.", st: 5, ecg: { st: -.18, tinv: true } },
    { title: "Trombus total: STEMI", body: "Oklusi total → iskemia <b>transmural</b> → <b>elevasi ST</b> di sadapan yang menghadap area itu (dengan depresi resiprokal di sisi berlawanan). Troponin naik. Prinsip: <b>“time is muscle”</b> — buka arteri secepatnya (reperfusi).", key: "STEMI = reperfusi segera: PCI primer, atau fibrinolitik bila PCI tidak dapat dilakukan tepat waktu.", st: 6, ecg: { st: .55 } },
  ];

  /* Sadapan EKG & wilayah */
  const LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
  const TERR = {
    anterior: { n: "Anterior (LAD)", up: ["V1", "V2", "V3", "V4"], down: ["II", "III", "aVF"], a: "LAD" },
    lateral: { n: "Lateral (LCx / diagonal)", up: ["I", "aVL", "V5", "V6"], down: ["II", "III", "aVF"], a: "LCx atau cabang diagonal LAD" },
    inferior: { n: "Inferior (RCA ±80%)", up: ["II", "III", "aVF"], down: ["I", "aVL"], a: "RCA (sebagian kecil LCx)" },
    antlat: { n: "Anterior luas (LAD proksimal)", up: ["I", "aVL", "V1", "V2", "V3", "V4", "V5", "V6"], down: ["II", "III", "aVF"], a: "LAD proksimal / left main" },
    posterior: { n: "Posterior", up: [], down: ["V1", "V2", "V3"], a: "RCA atau LCx (cek V7–V9: elevasi)" },
  };

  registerModule({
    id: "c03",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Ketika pipa jantung menyempit atau tersumbat", emoji: "💡", html: `
          <p>Ingat A2: otot jantung bergantung penuh pada aliran koroner, dan ekstraksi O₂-nya sudah hampir maksimal. Jadi <b>aliran berkurang = iskemia</b>.</p>
          <div class="table-wrap"><table class="table"><thead><tr><th></th><th>Angina stabil (SKK)</th><th>UA</th><th>NSTEMI</th><th>STEMI</th></tr></thead><tbody>
            <tr><td>Plak</td><td>Stabil, menyempit</td><td colspan="2">Robek + trombus sebagian</td><td>Robek + trombus total</td></tr>
            <tr><td>Nyeri</td><td>Saat aktivitas, &lt;10 menit</td><td colspan="3">Saat istirahat / makin berat, sering >20 menit</td></tr>
            <tr><td>EKG</td><td>Normal (iskemia saat stres)</td><td colspan="2">Depresi ST / T terbalik / normal</td><td><b>Elevasi ST</b></td></tr>
            <tr><td>Troponin</td><td>Normal</td><td>Normal</td><td><b>Naik</b></td><td><b>Naik</b></td></tr></tbody></table></div>
          <p class="small muted">Level SKDI: SKA 3B (gawat darurat: diagnosis, terapi awal, rujuk).</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Perjalanan sebuah plak", emoji: "🎬", intro: "Ikuti plak dari awal sampai menyumbat. Partikel menunjukkan aliran darah yang tersisa.",
          viz: artery(0) + `<div id="pj-ecg" class="two-col" style="margin-top:6px"></div>`, steps: STEPS, autoplayMs: 7000,
          onStep(i, s, api) {
            const v = api.viz;
            K.$("svg", v).outerHTML = artery(s.st);
            const svg = K.$("svg", v);
            const open = +K.$(".art-p", svg).dataset.open;
            api._fl = K.flow(K.$(".art-p", svg));
            api._fl.set(open ? [{ el: K.$("#art-flow", svg), color: K.css("--o2-rich"), n: Math.max(1, Math.round(10 * open)), speed: 40 + 80 * open, r: 4 }] : []);
            K.$("#pj-ecg", v).innerHTML = s.ecg ? `<div class="readout"><span>EKG normal</span>${ecgSVG(beat())}</div><div class="readout"><span>EKG pada fase ini</span>${ecgSVG(beat(s.ecg))}</div>` : "";
          },
          init(api, secEl) { K.loop(secEl, (dt) => api._fl && api._fl.tick(dt)); } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa angina stabil muncul saat aktivitas?", nodes: ["Stenosis menetap ≥70% → aliran istirahat masih cukup karena arteriol hilir berdilatasi", "Saat aktivitas: HR, kontraktilitas, dan tekanan dinding ↑ → kebutuhan O₂ ↑", "Cadangan dilatasi sudah terpakai → aliran tidak bisa naik", "Iskemia → metabolit (adenosin, laktat) merangsang saraf nyeri (nyeri alih, D2)", "Istirahat/nitrat menurunkan kebutuhan → nyeri hilang"] },
            { label: "Mengapa STEMI memberi elevasi ST?", nodes: ["Oklusi total → iskemia seluruh tebal dinding (transmural)", "Sel iskemik tidak mampu mempertahankan potensial membran normal", "Terjadi beda potensial antara jaringan cedera & sehat (arus cedera)", "Vektor arus mengarah ke area cedera", "Segmen ST naik di sadapan yang menghadap area tersebut"] },
            { label: "Mengapa obat antiplatelet menjadi kunci SKA?", nodes: ["Plak robek memaparkan kolagen & faktor jaringan", "Trombosit menempel, teraktivasi (TXA₂, ADP), lalu beragregasi", "Trombus kaya trombosit menyumbat arteri", "Aspirin (blok TXA₂) + penghambat P2Y12 (blok ADP) menghentikan pertumbuhan trombus", "Mengurangi kematian & infark ulang (detail obat: C8)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Lokasi infark dari 12 sadapan", emoji: "📈", html: `
          <p>Pilih wilayah infark. Sadapan dengan <b style="color:var(--bad)">elevasi ST</b> dan <b style="color:var(--accent)">depresi resiprokal</b> akan disorot.</p>
          <div class="toggle-row" id="tr-btns"></div>
          <div class="viz-wrap"><div id="tr-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px"></div></div>
          <div class="callout" id="tr-msg"></div>`,
          init(el) {
            K.$("#tr-btns", el).innerHTML = Object.entries(TERR).map(([k, t]) => `<button class="btn btn-sm" data-k="${k}" type="button">${t.n}</button>`).join("");
            const order = ["I", "aVR", "V1", "V4", "II", "aVL", "V2", "V5", "III", "aVF", "V3", "V6"];
            function show(k) {
              const t = TERR[k];
              K.$$("#tr-btns button", el).forEach((b) => b.classList.toggle("on", b.dataset.k === k));
              K.$("#tr-grid", el).innerHTML = order.map((L) => { const up = t.up.includes(L), dn = t.down.includes(L); return `<div style="border-radius:10px;padding:2px;background:${up ? "var(--bad-soft)" : dn ? "var(--accent-soft)" : "var(--surface)"};border:1.5px solid ${up ? "var(--bad)" : dn ? "var(--accent)" : "var(--border)"}">${ecgSVG(beat({ st: up ? .55 : dn ? -.28 : 0, q: up && k !== "posterior" }), 160, 70, L)}</div>`; }).join("");
              K.$("#tr-msg", el).innerHTML = `<p><b>${t.n}</b> → arteri penyebab tersering: <b>${t.a}</b>. ${k === "inferior" ? "Pada infark inferior, periksa juga V4R (infark VKa) dan waspadai bradikardia/blok AV (A2)." : k === "posterior" ? "Infark posterior murni tampak sebagai <b>depresi ST</b> di V1–V3 (gambaran cermin) — konfirmasi dengan sadapan V7–V9." : "Elevasi ST di sadapan yang menghadap area cedera; depresi di sisi berlawanan = resiprokal."}</p>`;
            }
            K.$$("#tr-btns button", el).forEach((b) => b.addEventListener("click", () => show(b.dataset.k))); show("anterior");
          } },
        { heading: "Kapan troponin & CK-MB naik?", emoji: "🧪", html: `
          <p>Geser waktu sejak nyeri dada dimulai.</p>
          <div class="slider-row"><label for="bm-t">Waktu sejak onset <output id="bm-o"></output></label><input type="range" id="bm-t" min="0" max="336" value="6"></div>
          <div class="viz-wrap"><svg id="bm-svg" viewBox="0 0 420 200" role="img" aria-label="Kurva biomarker" style="max-width:600px;margin:auto"></svg></div>
          <div class="readouts"><div class="readout"><span>Troponin</span><b id="bm-tn"></b></div><div class="readout"><span>CK-MB</span><b id="bm-ck"></b></div></div>
          <div class="callout" id="bm-msg"></div>`,
          init(el) {
            const T = (h) => h < 1 ? h * .2 : h < 36 ? Math.min(1, .2 + .8 * (1 - Math.exp(-(h - 1) / 10))) : Math.max(.15, 1 - (h - 36) / 300);
            const C = (h) => h < 4 ? 0 : h < 24 ? .7 * (h - 4) / 20 : Math.max(0, .7 - (h - 24) / 48 * .7);
            const X = (h) => 40 + Math.log10(h + 1) / Math.log10(337) * 370, Y = (v) => 170 - v * 150;
            const s = K.$("#bm-t", el);
            function upd() {
              const h = +s.value;
              K.$("#bm-o", el).textContent = h < 48 ? h + " jam" : Math.round(h / 24) + " hari";
              K.$("#bm-svg", el).innerHTML = `<line class="svg-axis" x1="40" y1="170" x2="410" y2="170"/><line class="svg-axis" x1="40" y1="15" x2="40" y2="170"/>
                <line class="svg-grid" x1="40" x2="410" y1="${Y(.15)}" y2="${Y(.15)}"/><text class="svg-label small" x="44" y="${Y(.15) - 4}" style="font-size:9.5px">batas atas normal (persentil 99)</text>
                ${[[1, "1 j"], [6, "6 j"], [24, "24 j"], [72, "3 hr"], [168, "7 hr"], [336, "14 hr"]].map(([v, l]) => `<text class="svg-label small" x="${X(v)}" y="186" text-anchor="middle" style="font-size:9.5px">${l}</text>`).join("")}
                <path d="${K.plot(T, 0, 336, X, Y, 300)}" fill="none" stroke="var(--primary)" stroke-width="3"/><path d="${K.plot(C, 0, 336, X, Y, 300)}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="6 4"/>
                <text class="svg-label small" x="${X(150)}" y="${Y(T(150)) - 8}" style="fill:var(--primary);font-weight:700">Troponin</text><text class="svg-label small" x="${X(30)}" y="${Y(.72)}" style="fill:var(--accent);font-weight:700">CK-MB</text>
                <line x1="${X(h)}" x2="${X(h)}" y1="15" y2="170" stroke="var(--warn)" stroke-width="2"/>`;
              const tn = T(h), ck = C(h);
              K.$("#bm-tn", el).textContent = tn > .15 ? "↑ meningkat" : "normal"; K.$("#bm-ck", el).textContent = ck > .15 ? "↑ meningkat" : "normal";
              K.$("#bm-msg", el).innerHTML = `<p>${h < 2 ? "Sangat awal: biomarker bisa masih normal → jangan menunggu troponin bila EKG menunjukkan STEMI. Ulangi hs-troponin (protokol 0/1 jam atau 0/2 jam)." : h < 72 ? "Troponin sensitif & spesifik untuk nekrosis miokard; CK-MB juga naik (puncak ±24 jam)." : "CK-MB sudah kembali normal (48–72 jam) sedangkan troponin masih tinggi hingga 7–14 hari → CK-MB berguna mendeteksi <b>infark ulang</b>."}</p>`;
            }
            s.addEventListener("input", upd); upd();
          } },
        { heading: "Triase nyeri dada", emoji: "🚑", html: `<div id="tri-box"></div>`,
          init(el) {
            const OPT = [["ccs", "Angina stabil (SKK)"], ["ua", "Angina tidak stabil"], ["nstemi", "NSTEMI"], ["stemi", "STEMI"]];
            const C = [
              { t: "Nyeri dada tertekan saat naik tangga 2 lantai sejak 6 bulan, hilang 3 menit setelah istirahat. EKG istirahat normal.", a: "ccs", e: "Pola stabil & dapat diprediksi, dipicu aktivitas → <b>angina stabil</b>." },
              { t: "Nyeri dada saat istirahat 30 menit. EKG: depresi ST V4–V6. Troponin 0 & 1 jam meningkat bermakna.", a: "nstemi", e: "Tanpa elevasi ST + troponin naik → <b>NSTEMI</b>." },
              { t: "Nyeri dada hebat 1 jam, keringat dingin. EKG: elevasi ST II, III, aVF.", a: "stemi", e: "Elevasi ST inferior → <b>STEMI inferior</b> (RCA) → reperfusi segera." },
              { t: "Nyeri dada makin sering & kini muncul saat istirahat 15 menit. EKG: T terbalik V1–V3. Troponin berulang normal.", a: "ua", e: "Iskemia akut tanpa nekrosis (troponin normal) → <b>angina tidak stabil</b>." },
            ];
            let i = 0; const box = K.$("#tri-box", el);
            function show() {
              const c = C[i];
              box.innerHTML = `<div class="callout"><p><b>Kasus ${i + 1}/${C.length}:</b> ${c.t}</p></div><div class="btn-row">${OPT.map(([k, n]) => `<button class="btn btn-sm" data-a="${k}" type="button">${n}</button>`).join("")}</div><div class="tri-r" style="margin-top:8px"></div>`;
              K.$$("[data-a]", box).forEach((b) => b.addEventListener("click", () => {
                const r = K.$(".tri-r", box); if (r.innerHTML) return; const ok = b.dataset.a === c.a;
                r.innerHTML = `<div class="callout ${ok ? "green" : "red"}"><p>${ok ? "✅ Tepat." : "❌ Belum tepat."} ${c.e}</p></div><button class="btn btn-sm btn-primary" type="button">${i < C.length - 1 ? "Kasus berikutnya →" : "↺ Ulangi"}</button>`;
                K.$("button", r).addEventListener("click", () => { i = (i + 1) % C.length; show(); });
              }));
            }
            show();
          } },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Bedakan SKA: “<b>UA</b> = <b>U</b>tuh (troponin normal) · <b>N</b>STEMI = <b>N</b>aik troponin, <b>N</b>o ST elevasi · <b>ST</b>EMI = <b>ST</b> naik”.</p></div>
            <div class="callout"><p class="mnemo">Sadapan → arteri: “<b>II-III-aVF</b> = <b>I</b>nferior = <b>R</b>CA” · “<b>V1–V4</b> = <b>A</b>nterior = <b>LA</b>D” · “<b>I, aVL, V5–V6</b> = <b>L</b>ateral = <b>L</b>Cx”.</p></div>
            <div class="callout green"><p class="mnemo">Waktu reperfusi STEMI: EKG <b>≤10 menit</b> sejak tiba · PCI primer <b>≤120 menit</b> dari diagnosis · bila tidak mungkin: fibrinolitik <b>≤10 menit</b> setelah diagnosis.</p></div>
            <div class="callout warn"><p class="mnemo">Terapi awal SKA (bukan sekadar “MONA”): <b>antiplatelet ganda</b> + <b>antikoagulan</b> + nitrat (bila tidak ada kontraindikasi) + O₂ <b>hanya bila SpO₂ <90%</b> + reperfusi/revaskularisasi + statin dosis tinggi, β-bloker, ACEi.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Pembeda UA dan NSTEMI", "Troponin (UA normal, NSTEMI naik)"], ["Mekanisme utama SKA", "Ruptur/erosi plak + trombus"], ["Elevasi ST II, III, aVF", "Infark inferior → umumnya RCA"], ["Elevasi ST V1–V4", "Infark anterior → LAD"], ["Biomarker untuk infark ulang", "CK-MB (normal kembali 48–72 jam)"], ["Troponin tetap tinggi selama", "±7–14 hari"], ["Target PCI primer STEMI", "≤120 menit dari diagnosis"], ["Kapan O₂ diberikan pada SKA?", "Bila SpO₂ <90%"], ["Ciri angina stabil", "Dipicu aktivitas, <10 menit, hilang dengan istirahat/nitrat"], ["Depresi ST V1–V3 dengan R tinggi", "Curiga infark posterior (cek V7–V9)"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Tebak diagnosis & mekanismenya sebelum membuka kartu.", note: "Untuk latihan penalaran. Tata laksana mengikuti pedoman PERKI/ESC terbaru dan supervisi.",
          items: [
            { icon: "🐢", title: "STEMI inferior dengan HR 40 x/menit", chain: ["RCA memperdarahi AV node pada kebanyakan orang (A2)", "Iskemia AV node → blok AV/bradikardia", "Atasi bradikardia simtomatik (mis. atropin) + reperfusi"] },
            { icon: "📉", title: "STEMI inferior, hipotensi, JVP ↑, paru bersih", chain: ["Oklusi RCA proksimal ikut mengenai ventrikel kanan", "Infark VKa → preload VKi ↓ → CO ↓", "Hindari nitrat; beri cairan hati-hati untuk menjaga preload"] },
            { icon: "🍬", title: "Perempuan lansia diabetes, sesak & mual tanpa nyeri dada khas", chain: ["Neuropati otonom menumpulkan persepsi nyeri", "Presentasi SKA atipikal (silent ischemia)", "Tetap periksa EKG & troponin"] },
            { icon: "🏃", title: "Nyeri dada saat aktivitas berat, membaik dengan istirahat, EKG treadmill positif", chain: ["Stenosis koroner stabil", "Sindrom koroner kronik (angina stabil)", "Gaya hidup, antiangina (C4), pencegahan (aspirin, statin), evaluasi revaskularisasi"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Pasien nyeri dada istirahat, EKG depresi ST, troponin berulang normal. Diagnosis paling tepat…",
          options: ["STEMI", "NSTEMI", "Angina tidak stabil", "Angina stabil"], answer: 2,
          explain: "Iskemia akut (nyeri istirahat, perubahan ST) tanpa bukti nekrosis (troponin normal) = angina tidak stabil." },
        { q: "Elevasi ST pada sadapan II, III, dan aVF paling sering disebabkan oklusi…",
          options: ["LAD", "LCx", "RCA", "Left main"], answer: 2,
          explain: "Sadapan inferior menghadap dinding inferior yang umumnya diperdarahi RCA (dominansi kanan)." },
        { q: "Perbedaan mekanisme dasar angina stabil dan SKA adalah…",
          options: ["Angina stabil disebabkan spasme, SKA oleh hipertensi", "Angina stabil = plak stabil yang menyempitkan; SKA = plak robek/erosi dengan trombus", "Keduanya identik", "SKA selalu tanpa aterosklerosis"], answer: 1,
          explain: "Kunci SKA adalah trombosis pada plak yang terganggu, sehingga aliran turun mendadak." },
        { q: "Biomarker yang paling berguna untuk mendeteksi infark ulang 5 hari setelah infark pertama adalah…",
          options: ["Troponin", "CK-MB", "Mioglobin", "LDH"], answer: 1,
          explain: "Troponin masih tinggi 7–14 hari sehingga sulit menilai kenaikan baru; CK-MB sudah normal dalam 48–72 jam." },
        { q: "Mengapa pemberian O₂ rutin pada semua pasien SKA tidak lagi dianjurkan?",
          options: ["Karena O₂ mahal", "Karena hanya bermanfaat bila hipoksemia (SpO₂ <90%); hiperoksia tidak memperbaiki luaran", "Karena O₂ menyebabkan elevasi ST", "Karena O₂ menurunkan troponin"], answer: 1,
          explain: "Penelitian menunjukkan O₂ pada pasien normoksemia tidak menurunkan kematian; O₂ diberikan bila SpO₂ <90%." },
      ]},
    ],
  });
})();
