/* Modul C7 — Kardiomiopati & Kor Pulmonale (Kuliah 12) */
(function () {
  const T = {
    normal: { n: "Normal", lvW: 14, lvC: 1, sep: 14, rvW: 6, rvC: 1, la: 1, ra: 1, fat: false, sam: false, pv: { edv: 125, esv: 55, pes: 115, k: 1 } },
    dcm: { n: "Kardiomiopati dilatasi (DCM)", lvW: 8, lvC: 1.45, sep: 8, rvW: 5, rvC: 1.2, la: 1.3, ra: 1.1, pv: { edv: 220, esv: 175, pes: 95, k: .7 },
      ef: "↓↓ (<40%)", fn: "Disfungsi SISTOLIK", sound: "S3, murmur MR fungsional", cause: "Idiopatik/genetik, alkohol, miokarditis virus (C5), peripartum, obat kemoterapi (doksorubisin), takikardia kronik." },
    hcm: { n: "Kardiomiopati hipertrofik (HCM)", lvW: 22, lvC: .62, sep: 34, rvW: 6, rvC: 1, la: 1.35, ra: 1, sam: true, pv: { edv: 95, esv: 25, pes: 140, k: 2.6 },
      ef: "normal / ↑", fn: "Disfungsi DIASTOLIK ± obstruksi alur keluar", sound: "S4; murmur ejeksi yang MENGUAT dengan Valsalva/berdiri", cause: "Genetik (autosomal dominan) — mutasi protein sarkomer (mis. β-miosin, protein C pengikat miosin)." },
    rcm: { n: "Kardiomiopati restriktif (RCM)", lvW: 15, lvC: .9, sep: 15, rvW: 7, rvC: .9, la: 1.6, ra: 1.5, pv: { edv: 100, esv: 45, pes: 105, k: 3.2 },
      ef: "normal / sedikit ↓", fn: "Disfungsi DIASTOLIK (ventrikel kaku)", sound: "S3/S4, JVP tinggi, Kussmaul", cause: "Amiloidosis (tersering), sarkoidosis, hemokromatosis, fibrosis endomiokard, pasca radiasi." },
    arvc: { n: "Kardiomiopati aritmogenik (ARVC)", lvW: 14, lvC: 1, sep: 14, rvW: 3, rvC: 1.35, la: 1, ra: 1.2, fat: true, pv: { edv: 125, esv: 55, pes: 115, k: 1 },
      ef: "VKi biasanya normal", fn: "Otot VKa diganti jaringan lemak-fibrosa → aritmia ventrikel", sound: "Sering normal; EKG: gelombang epsilon, T terbalik V1–V3", cause: "Genetik — mutasi protein desmosom (D3/A4)." },
  };

  function heart(k) {
    const t = T[k];
    const lvRx = 52 * t.lvC, lvRy = 70 * Math.sqrt(t.lvC), cx = 270, cy = 175;
    const rvRx = 46 * t.rvC, rvRy = 62 * Math.sqrt(t.rvC), rcx = 150, rcy = 175;
    let s = `<ellipse cx="${rcx}" cy="${rcy}" rx="${rvRx + t.rvW}" ry="${rvRy + t.rvW}" fill="${t.fat ? "#ffe066" : "#f3a6c4"}" stroke="${t.fat ? "#f08c00" : "none"}"/><ellipse cx="${rcx}" cy="${rcy}" rx="${rvRx}" ry="${rvRy}" fill="var(--o2-poor)" opacity=".7"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${lvRx + t.lvW}" ry="${lvRy + t.lvW}" fill="#f3a6c4"/>
      <rect x="${cx - lvRx - t.sep}" y="${cy - lvRy * .8}" width="${t.sep + 10}" height="${lvRy * 1.6}" rx="10" fill="${t.sep > 20 ? "#e64980" : "#f3a6c4"}"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${lvRx}" ry="${lvRy}" fill="var(--o2-rich)" opacity=".75"/>
      <ellipse cx="150" cy="${70 - 6 * t.ra}" rx="${40 * t.ra}" ry="${28 * t.ra}" fill="var(--o2-poor)" opacity=".5"/><ellipse cx="270" cy="${70 - 6 * t.la}" rx="${40 * t.la}" ry="${28 * t.la}" fill="var(--o2-rich)" opacity=".5"/>
      <g class="svg-label small" style="font-weight:700"><text x="150" y="${74 - 6 * t.ra}" text-anchor="middle">AK</text><text x="270" y="${74 - 6 * t.la}" text-anchor="middle">AKi</text><text x="${rcx}" y="${rcy + 4}" text-anchor="middle" style="fill:#fff">VKa</text><text x="${cx}" y="${cy + 4}" text-anchor="middle" style="fill:#fff">VKi</text></g>`;
    if (t.sam) s += `<path d="M${cx - lvRx + 4},${cy - lvRy + 10} q 18,8 26,30" stroke="var(--bad)" stroke-width="4" fill="none"/><text class="svg-label small" x="${cx}" y="${cy - lvRy - 22}" text-anchor="middle" style="fill:var(--bad);font-size:9.5px">obstruksi alur keluar (SAM)</text><text class="svg-label small" x="${cx - lvRx - t.sep - 4}" y="${cy + lvRy}" text-anchor="end" style="fill:#c2255c;font-size:9.5px">septum sangat tebal</text>`;
    if (t.fat) s += `<text class="svg-label small" x="${rcx}" y="${rcy + rvRy + 22}" text-anchor="middle" style="fill:#e67700;font-size:9.5px">dinding VKa: lemak-fibrosa</text>`;
    if (k === "rcm") s += `<text class="svg-label small" x="210" y="16" text-anchor="middle" style="fill:var(--warn);font-size:9.5px">kedua atrium sangat besar · dinding ventrikel kaku</text>`;
    if (k === "dcm") s += `<text class="svg-label small" x="210" y="285" text-anchor="middle" style="fill:var(--warn);font-size:9.5px">rongga besar · dinding tipis · kontraksi lemah</text>`;
    return `<svg viewBox="0 0 420 295" role="img" aria-label="Bentuk jantung ${t.n}">${s}</svg>`;
  }
  function pvLoop(k) {
    const p = T[k].pv, n = T.normal.pv;
    const PX = (v) => 30 + v / 240 * 180, PY = (q) => 130 - q / 160 * 115;
    const edp = (v, kk) => kk * 0.8 * (Math.exp(0.022 * (v - 10)) - 1);
    const loop = (q) => { const pts = []; for (let i = 0; i <= 15; i++) { const v = q.esv + (q.edv - q.esv) * i / 15; pts.push([v, edp(v, q.k)]); } pts.push([q.edv, q.pes * .7]); for (let i = 1; i <= 15; i++) { const f = i / 15; pts.push([q.edv - (q.edv - q.esv) * f, K.keys([[0, q.pes * .7], [.5, q.pes * 1.1], [1, q.pes]], f)]); } return "M" + pts.map(([v, pr]) => PX(v).toFixed(1) + "," + PY(Math.min(pr, 160)).toFixed(1)).join("L") + "Z"; };
    return `<svg viewBox="0 0 220 150" role="img" aria-label="Loop tekanan volume"><line class="svg-axis" x1="30" y1="10" x2="30" y2="130"/><line class="svg-axis" x1="30" y1="130" x2="215" y2="130"/>
      <path d="${loop(n)}" fill="none" stroke="var(--text-soft)" stroke-dasharray="4 3" stroke-width="1.5"/><path d="${loop(p)}" fill="var(--primary-soft)" fill-opacity=".6" stroke="var(--primary)" stroke-width="2.5"/>
      <text class="svg-label small" x="120" y="146" text-anchor="middle" style="font-size:9px">volume VKi → · — — normal</text><text class="svg-label small" x="8" y="70" transform="rotate(-90 8 70)" text-anchor="middle" style="font-size:9px">tekanan</text></svg>`;
  }

  /* Kor pulmonale */
  function corSVG(ph, rvw) {
    return `<svg viewBox="0 0 420 200" role="img" aria-label="Rantai kor pulmonale">
      ${[["🫁 Penyakit paru", 10], ["💨 Hipoksia & asidosis", 92], ["🩸 Vasokonstriksi & remodeling a. pulmonalis", 174], ["📈 Hipertensi pulmonal", 256], ["🫀 VKa hipertrofi → gagal", 338]].map(([t, x], i) => `<rect x="${x}" y="20" width="76" height="70" rx="10" fill="${i < ph ? "var(--bad-soft)" : "var(--surface)"}" stroke="${i < ph ? "var(--bad)" : "var(--border)"}"/><foreignObject x="${x + 2}" y="24" width="72" height="64"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:10px;text-align:center;line-height:1.2;color:var(--text)">${t}</div></foreignObject>${i < 4 ? `<text x="${x + 80}" y="58" font-size="12" fill="var(--text-soft)">→</text>` : ""}`).join("")}
      <ellipse cx="150" cy="150" rx="${40 + rvw}" ry="${36 + rvw * .6}" fill="#f3a6c4"/><ellipse cx="150" cy="150" rx="40" ry="36" fill="var(--o2-poor)" opacity=".7"/><text class="svg-label small" x="150" y="154" text-anchor="middle" style="fill:#fff;font-weight:700">VKa</text>
      <ellipse cx="270" cy="150" rx="48" ry="40" fill="#f3a6c4"/><ellipse cx="270" cy="150" rx="34" ry="28" fill="var(--o2-rich)" opacity=".7"/><text class="svg-label small" x="270" y="154" text-anchor="middle" style="fill:#fff;font-weight:700">VKi</text>
    </svg>`;
  }

  const STEPS = [
    { title: "Apa itu kardiomiopati?", body: "Kelainan <b>struktur & fungsi otot jantung</b> yang tidak cukup dijelaskan oleh penyakit koroner, hipertensi, katup, atau kelainan kongenital. Dibagi menurut bentuk & fungsinya: <b>dilatasi</b>, <b>hipertrofik</b>, <b>restriktif</b>, dan <b>aritmogenik</b>.", key: "Bandingkan setiap tipe dengan jantung normal di gambar.", k: "normal" },
    { title: "Kardiomiopati dilatasi (DCM)", body: `Ventrikel <b>membesar dan tipis</b>, kontraksi lemah → <b>EF turun</b> (gagal jantung sistolik). Loop PV bergeser ke kanan & sempit: EDV besar, SV kecil (A13). Gejala gagal jantung, aritmia, emboli. <b>Penyebab:</b> ${T.dcm.cause}`, key: "DCM = kardiomiopati tersering. Pompa lemah → jantung “melar”.", k: "dcm" },
    { title: "Kardiomiopati hipertrofik (HCM)", body: `Dinding — terutama <b>septum</b> — <b>menebal asimetris</b> tanpa sebab beban (bukan karena hipertensi/AS). Rongga kecil & kaku → <b>disfungsi diastolik</b>. Pada sebagian pasien septum tebal + gerakan anterior daun mitral (SAM) menyebabkan <b>obstruksi alur keluar dinamis</b>. Penyebab <b>kematian mendadak pada atlet muda</b>. <b>Penyebab:</b> ${T.hcm.cause}`, key: "Obstruksi makin berat bila VKi makin kecil (Valsalva, berdiri, dehidrasi) — kebalikan murmur lain (C6).", k: "hcm" },
    { title: "Kardiomiopati restriktif (RCM)", body: `Ukuran ventrikel & tebal dinding relatif normal, tetapi <b>sangat kaku</b> → pengisian terganggu (EDPVR curam) → tekanan atrium tinggi → <b>kedua atrium membesar</b>, gejala bendungan (JVP ↑, edema, hepatomegali). <b>Penyebab:</b> ${T.rcm.cause}`, key: "Mirip perikarditis konstriktif — dibedakan dengan pencitraan.", k: "rcm" },
    { title: "Kardiomiopati aritmogenik (ARVC)", body: `Sel otot (terutama VKa) <b>lepas dan diganti jaringan lemak-fibrosa</b> akibat kelainan <b>desmosom</b>. Konduksi terganggu → <b>aritmia ventrikel</b> & kematian mendadak, sering saat olahraga. <b>Penyebab:</b> ${T.arvc.cause}`, key: "Ingat D3/A4: desmosom = perekat mekanis antarsel.", k: "arvc" },
    { title: "Kor pulmonale: definisi", body: "<b>Pembesaran/kegagalan ventrikel kanan akibat hipertensi pulmonal</b> yang disebabkan penyakit paru, pembuluh paru, atau gangguan ventilasi — <b>bukan</b> akibat penyakit jantung kiri atau kongenital.", key: "Kunci: penyebab primernya di PARU.", cor: 3 },
    { title: "Kor pulmonale akut", body: "Paling sering akibat <b>emboli paru masif</b>: resistensi paru naik mendadak → VKa yang berdinding tipis (D2) tidak siap → <b>dilatasi akut & gagal VKa</b>, septum terdorong ke kiri → CO turun → syok. EKG dapat menunjukkan takikardia sinus, strain VKa, RBBB, pola S1Q3T3.", key: "VKa tidak tahan beban tekanan mendadak.", cor: 5 },
    { title: "Kor pulmonale kronik", body: "Paling sering akibat <b>PPOK</b>; juga penyakit paru interstisial, OSA/obesitas hipoventilasi. <b>Hipoksia alveolar → vasokonstriksi pulmonal hipoksik</b> (+ asidosis, polisitemia, kerusakan kapiler) → hipertensi pulmonal → <b>hipertrofi VKa</b> → lama-lama gagal VKa: JVP ↑, edema tungkai, hepatomegali, P2 keras, heave parasternal.", key: "Terapi O₂ jangka panjang memperlambat progresivitas karena mengurangi vasokonstriksi hipoksik.", cor: 5 },
  ];

  registerModule({
    id: "c07",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Ketika ototnya sendiri yang sakit", emoji: "💡", html: `
          <p>Di C2–C6 penyakit jantung berasal dari beban luar (tekanan, koroner, katup). Pada <b>kardiomiopati</b>, masalahnya ada pada <b>otot jantung itu sendiri</b>. Pada <b>kor pulmonale</b>, VKa gagal karena <b>paru</b> yang sakit.</p>
          <div class="table-wrap"><table class="table"><thead><tr><th>Tipe</th><th>Bentuk</th><th>Masalah fungsi</th></tr></thead><tbody>
            <tr><td><b>Dilatasi</b></td><td>Rongga besar, dinding tipis</td><td>Sistolik (pompa lemah)</td></tr>
            <tr><td><b>Hipertrofik</b></td><td>Dinding (septum) tebal, rongga kecil</td><td>Diastolik ± obstruksi</td></tr>
            <tr><td><b>Restriktif</b></td><td>Ukuran normal, kaku; atrium besar</td><td>Diastolik (pengisian)</td></tr>
            <tr><td><b>Aritmogenik</b></td><td>VKa diganti lemak-fibrosa</td><td>Aritmia</td></tr></tbody></table></div>
          <p class="small muted">Level SKDI: kardiomiopati 2; kor pulmonale akut 3A, kronik 3B.</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Bentuk menentukan fungsi", emoji: "🎬", intro: "Kiri: bentuk jantung. Kanan: loop tekanan–volume (garis putus = normal).",
          viz: `<div class="cm-h" style="max-width:520px;margin:auto"></div><div class="two-col" style="gap:8px;margin-top:6px"><div class="cm-p"></div><div class="cm-r"></div></div>`, steps: STEPS, autoplayMs: 8000,
          onStep(i, s, api) {
            if (s.k) { K.$(".cm-h", api.viz).innerHTML = heart(s.k); K.$(".cm-p", api.viz).innerHTML = pvLoop(s.k); K.$(".cm-r", api.viz).innerHTML = s.k !== "normal" ? `<div class="readout"><span>EF</span><b style="font-size:1rem">${T[s.k].ef}</b></div><div class="readout" style="margin-top:6px"><span>Bunyi / EKG</span><b style="font-size:.85rem">${T[s.k].sound}</b></div>` : `<div class="readout"><span>Pembanding</span><b style="font-size:.9rem">Jantung normal</b></div>`; }
            else { K.$(".cm-h", api.viz).innerHTML = corSVG(s.cor, s.cor > 3 ? 16 : 6); K.$(".cm-p", api.viz).innerHTML = ""; K.$(".cm-r", api.viz).innerHTML = `<div class="callout"><p>${s.cor > 3 ? "Dinding VKa menebal (hipertrofi) lalu melebar dan gagal." : "Rantai: paru → hipoksia → pembuluh paru menyempit → hipertensi pulmonal → VKa."}</p></div>`; }
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa obstruksi HCM memburuk saat Valsalva?", nodes: ["Valsalva/berdiri/dehidrasi → aliran balik vena ↓ → preload ↓", "Rongga VKi yang sudah kecil makin kecil", "Septum tebal & daun mitral makin berdekatan saat sistol", "Obstruksi alur keluar (dan murmurnya) bertambah", "Karena itu: hindari diuretik/vasodilator berlebihan; β-bloker membantu (memperpanjang diastol)"] },
            { label: "PPOK → edema tungkai", nodes: ["Ventilasi alveolar buruk → hipoksia & hiperkapnia kronik", "Vasokonstriksi pulmonal hipoksik menyeluruh (tidak seperti refleks lokal yang normal)", "Resistensi paru ↑ → hipertensi pulmonal", "VKa hipertrofi lalu gagal → tekanan atrium kanan ↑", "Venous return terhambat (B5) → JVP ↑, hepatomegali, edema tungkai"] },
            { label: "DCM → gagal jantung", nodes: ["Kehilangan/kelemahan miosit (genetik, toksin, virus)", "Kontraktilitas ↓ → ESV ↑ → SV ↓ (A13)", "Neurohormonal aktif (simpatis, RAAS) → retensi cairan → EDV ↑", "Ventrikel melebar → regurgitasi mitral fungsional (anulus melebar)", "Kongesti + CO rendah → sesak, lelah, edema"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Bandingkan tipe kardiomiopati", emoji: "🔍", html: `
          <div class="toggle-row" id="cm-btns"></div>
          <div class="viz-wrap" id="cm-h" style="max-width:520px;margin:auto"></div><div class="two-col" style="gap:8px;margin-top:8px"><div class="viz-wrap" id="cm-p"></div><div id="cm-t"></div></div>`,
          init(el) {
            K.$("#cm-btns", el).innerHTML = Object.entries(T).map(([k, t]) => `<button class="btn btn-sm" data-k="${k}" type="button">${t.n.replace("Kardiomiopati ", "")}</button>`).join("");
            function show(k) {
              K.$$("#cm-btns button", el).forEach((b) => b.classList.toggle("on", b.dataset.k === k));
              K.$("#cm-h", el).innerHTML = heart(k); K.$("#cm-p", el).innerHTML = pvLoop(k);
              const t = T[k];
              K.$("#cm-t", el).innerHTML = k === "normal" ? `<div class="callout"><p>Jantung normal sebagai pembanding.</p></div>` : `<div class="callout"><p><b>${t.n}</b><br>Fungsi: ${t.fn}<br>EF: ${t.ef}<br>Bunyi/EKG: ${t.sound}<br><span class="small">Penyebab: ${t.cause}</span></p></div>`;
            }
            K.$$("#cm-btns button", el).forEach((b) => b.addEventListener("click", () => show(b.dataset.k))); show("dcm");
          } },
        { heading: "Simulator kor pulmonale kronik", emoji: "🎚️", html: `
          <p>Atur beratnya hipoksia akibat penyakit paru dan lihat dampaknya pada pembuluh paru dan ventrikel kanan. Coba berikan O₂.</p>
          <div class="slider-row"><label for="cp-o2">PaO₂ <output id="cp-o2-o"></output></label><input type="range" id="cp-o2" min="40" max="95" value="90"></div>
          <div class="slider-row"><label for="cp-y">Lama penyakit <output id="cp-y-o"></output></label><input type="range" id="cp-y" min="0" max="20" value="2"></div>
          <div class="toggle-row"><button class="btn btn-sm" id="cp-ox" type="button">🫧 Terapi O₂ jangka panjang</button></div>
          <div class="viz-wrap" id="cp-svg"></div>
          <div class="readouts"><div class="readout"><span>Tekanan a. pulmonalis rata-rata</span><b id="cp-pa"></b></div><div class="readout"><span>Hematokrit</span><b id="cp-ht"></b></div><div class="readout"><span>Ventrikel kanan</span><b id="cp-rv" style="font-size:1rem"></b></div></div>
          <div class="callout" id="cp-msg"></div>`,
          init(el) {
            const o = K.$("#cp-o2", el), y = K.$("#cp-y", el); let ox = false;
            K.$("#cp-ox", el).addEventListener("click", (e) => { ox = !ox; e.target.classList.toggle("on", ox); upd(); });
            function upd() {
              const pao2 = ox ? Math.max(+o.value, 65) : +o.value, yrs = +y.value;
              const hyp = K.clamp((80 - pao2) / 40, 0, 1);
              const remodel = K.clamp(yrs / 15, 0, 1) * hyp;
              const mpap = Math.round(15 + hyp * 15 * (ox ? .4 : 1) + remodel * 20);
              const ht = Math.round(44 + hyp * 14 * (ox ? .5 : 1));
              const rvw = K.clamp((mpap - 20) / 2, 0, 16);
              const stage = mpap < 21 ? 1 : mpap < 30 ? 3 : mpap < 40 ? 4 : 5;
              K.$("#cp-o2-o", el).textContent = pao2 + " mmHg" + (ox ? " (dengan O₂)" : ""); K.$("#cp-y-o", el).textContent = yrs + " tahun";
              K.$("#cp-svg", el).innerHTML = corSVG(stage, rvw);
              K.$("#cp-pa", el).innerHTML = `${mpap}<small> mmHg</small>`; K.$("#cp-ht", el).innerHTML = `${ht}<small>%</small>`;
              K.$("#cp-rv", el).textContent = mpap < 21 ? "normal" : mpap < 35 ? "hipertrofi" : "hipertrofi → gagal";
              const m = K.$("#cp-msg", el); m.className = mpap >= 35 ? "callout red" : mpap >= 21 ? "callout warn" : "callout green";
              m.innerHTML = `<p>${mpap >= 21 ? `<b>Hipertensi pulmonal</b> (rata-rata a. pulmonalis >20 mmHg). ` : "Tekanan pulmonal normal. "}${hyp > .2 ? "Hipoksia → vasokonstriksi pulmonal hipoksik & polisitemia (darah lebih kental). " : ""}${remodel > .3 ? "Penyakit lama → dinding arteri paru menebal (remodeling) sehingga sebagian tidak reversibel. " : ""}${ox ? "O₂ mengurangi komponen vasokonstriksi — tetapi remodeling yang sudah terjadi tidak hilang." : ""}${mpap >= 35 ? " Tanda gagal VKa: JVP ↑, edema tungkai, hepatomegali." : ""}</p>`;
            }
            [o, y].forEach((x) => x.addEventListener("input", upd)); upd();
          } },
        { type: "match", heading: "Petunjuk → diagnosis", emoji: "🧩", intro: "Ketuk petunjuk, lalu diagnosisnya.",
          pairs: [["Atlet muda pingsan saat lari, septum 2× tebal", "Kardiomiopati hipertrofik"], ["Peminum alkohol berat, jantung besar, EF 25%", "Kardiomiopati dilatasi"], ["Amiloidosis, kedua atrium besar, ventrikel kaku", "Kardiomiopati restriktif"], ["Gelombang epsilon, VKa diganti lemak", "Kardiomiopati aritmogenik"], ["PPOK lama, edema tungkai, P2 keras", "Kor pulmonale kronik"], ["Emboli paru masif, VKa dilatasi akut", "Kor pulmonale akut"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Tipe: “<b>D</b>ilatasi = <b>D</b>ompet melar (sistolik)” · “<b>H</b>ipertrofik = <b>H</b>ati-hati atlet (diastolik, obstruksi)” · “<b>R</b>estriktif = <b>R</b>igid (kaku)”.</p></div>
            <div class="callout"><p class="mnemo">Penyebab DCM “<b>ABCD + P</b>”: <b>A</b>lkohol · <b>B</b>eri-beri (defisiensi tiamin) · <b>C</b>oxsackie (miokarditis) · <b>D</b>oksorubisin · <b>P</b>eripartum.</p></div>
            <div class="callout green"><p class="mnemo">Penyebab RCM “<b>A-S-H</b>”: <b>A</b>miloidosis · <b>S</b>arkoidosis · <b>H</b>emokromatosis.</p></div>
            <div class="callout warn"><p class="mnemo">Kor pulmonale = “<b>Paru sakit → jantung KANAN menjerit</b>”. Akut: emboli paru · Kronik: PPOK.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Kardiomiopati tersering", "Kardiomiopati dilatasi"], ["Pola pewarisan HCM", "Autosomal dominan (protein sarkomer)"], ["Disfungsi utama HCM", "Diastolik ± obstruksi alur keluar dinamis"], ["Manuver yang memperberat murmur HCM", "Valsalva, berdiri (preload ↓)"], ["Penyebab tersering RCM", "Amiloidosis"], ["Kelainan protein pada ARVC", "Desmosom"], ["Definisi kor pulmonale", "Hipertrofi/gagal VKa akibat hipertensi pulmonal karena penyakit paru"], ["Penyebab kor pulmonale akut", "Emboli paru masif"], ["Penyebab kor pulmonale kronik tersering", "PPOK"], ["Mekanisme kunci hipertensi pulmonal pada PPOK", "Vasokonstriksi pulmonal hipoksik"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Tebak diagnosisnya sebelum membuka kartu.", note: "Untuk latihan penalaran; diagnosis memerlukan ekokardiografi/pencitraan.",
          items: [
            { icon: "🤰", title: "Perempuan 1 bulan pascapersalinan, sesak & edema, EF 30%", chain: ["Kardiomiopati yang muncul akhir kehamilan–5 bulan pascapersalinan", "Kardiomiopati peripartum (jenis dilatasi)", "Tata laksana gagal jantung; sebagian besar dapat pulih"] },
            { icon: "⚽", title: "Pemain bola 17 tahun pingsan saat bertanding; ayahnya meninggal mendadak usia 35", chain: ["Riwayat keluarga + kejadian saat olahraga", "Curiga kardiomiopati hipertrofik (atau aritmogenik)", "Skrining keluarga, hindari olahraga kompetitif, evaluasi ICD"] },
            { icon: "🚬", title: "Perokok 60 tahun dengan PPOK, bibir biru, edema tungkai, hepatomegali", chain: ["Hipoksia kronik → hipertensi pulmonal", "Kor pulmonale kronik dengan gagal VKa", "O₂ jangka panjang, atasi PPOK, diuretik hati-hati"] },
            { icon: "✈️", title: "Pascaoperasi lutut, tiba-tiba sesak, hipotensi, JVP ↑, EKG S1Q3T3", chain: ["Trombus vena dalam lepas ke a. pulmonalis (B5)", "Emboli paru masif → kor pulmonale akut", "Kegawatdaruratan: pertimbangkan trombolitik (C8)"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Kardiomiopati dengan ventrikel melebar, dinding tipis, dan EF sangat rendah adalah…",
          options: ["Hipertrofik", "Dilatasi", "Restriktif", "Aritmogenik"], answer: 1,
          explain: "DCM = disfungsi sistolik; loop PV bergeser ke kanan dengan SV kecil." },
        { q: "Mengapa murmur kardiomiopati hipertrofik obstruktif menguat saat pasien berdiri?",
          options: ["Afterload naik", "Preload turun sehingga rongga VKi mengecil dan obstruksi bertambah", "HR turun", "Katup aorta menutup"], answer: 1,
          explain: "Rongga lebih kecil mendekatkan septum dan daun mitral → obstruksi alur keluar ↑." },
        { q: "Ciri utama kardiomiopati restriktif adalah…",
          options: ["Dinding sangat tipis", "Ventrikel kaku dengan pengisian terganggu dan atrium membesar", "Obstruksi alur keluar", "Katup mitral stenosis"], answer: 1,
          explain: "Kekakuan (mis. amiloid) membuat EDPVR curam: sedikit volume menaikkan tekanan tinggi." },
        { q: "Mekanisme utama hipertensi pulmonal pada kor pulmonale akibat PPOK adalah…",
          options: ["Regurgitasi mitral", "Vasokonstriksi pulmonal hipoksik yang luas disertai remodeling", "Hipertensi sistemik", "VSD"], answer: 1,
          explain: "Hipoksia alveolar menyempitkan arteriol paru secara luas; jangka panjang terjadi remodeling dinding." },
        { q: "Mengapa emboli paru masif dapat cepat menyebabkan syok?",
          options: ["VKi hipertrofi mendadak", "VKa berdinding tipis tidak mampu melawan kenaikan resistensi paru mendadak sehingga gagal dan CO turun", "Katup aorta pecah", "Volume darah bertambah"], answer: 1,
          explain: "VKa terbiasa dengan tekanan rendah; afterload mendadak tinggi → dilatasi & gagal VKa → preload VKi ↓ → CO ↓." },
      ]},
    ],
  });
})();
