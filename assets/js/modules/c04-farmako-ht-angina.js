/* Modul C4 — Farmakoterapi Hipertensi & Penyakit Jantung Iskemik (Kuliah 9) */
(function () {
  const W = (inner, h = 280) => `<svg viewBox="0 0 420 ${h}" role="img" aria-label="Ilustrasi farmakologi">${inner}</svg>`;
  /* Peta target obat */
  const NODES = {
    brain: [210, 30, "🧠 Otak (simpatis sentral)", "Agonis α2: klonidin, metildopa"],
    heart: [82, 130, "🫀 Jantung (CO)", "β-bloker, CCB non-DHP"],
    vessel: [338, 130, "🩸 Arteriol (TPR)", "CCB DHP, α1-bloker, hidralazin"],
    kidney: [82, 225, "🫘 Ginjal (volume)", "Diuretik tiazid, loop, MRA"],
    raas: [338, 225, "🧪 RAAS", "ACE inhibitor, ARB"],
  };
  function V_MAP(hl = []) {
    return W(`${Object.entries(NODES).map(([k, [x, y, t, d]]) => { const on = hl.includes(k); return `<line x1="${x}" y1="${y}" x2="210" y2="130" stroke="${on ? "var(--primary)" : "var(--border)"}" stroke-width="${on ? 3 : 1.5}"/><rect x="${x - 78}" y="${y - 24}" width="156" height="48" rx="12" fill="${on ? "var(--primary-soft)" : "var(--surface)"}" stroke="${on ? "var(--primary)" : "var(--border)"}" stroke-width="${on ? 2.5 : 1}"/><text class="svg-label small" x="${x}" y="${y - 5}" text-anchor="middle" style="font-weight:700">${t}</text><text class="svg-label small" x="${x}" y="${y + 12}" text-anchor="middle" style="font-size:9.5px;fill:var(--primary)">${d}</text>`; }).join("")}<rect x="166" y="108" width="88" height="44" rx="12" fill="var(--primary)"/><text class="svg-label small" x="210" y="127" text-anchor="middle" style="fill:#fff;font-weight:800;font-size:11px">MAP =</text><text class="svg-label small" x="210" y="143" text-anchor="middle" style="fill:#fff;font-weight:800;font-size:11px">CO × TPR</text>`, 260);
  }
  function V_RAAS(blocks = []) {
    const B = (x0, y, n, k) => { const x = 140; return blocks.includes(k) ? `<g><circle cx="${x}" cy="${y}" r="11" fill="var(--bad)"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" fill="#fff" font-weight="800">✕</text><text class="svg-label small" x="${x + 16}" y="${y + 4}" style="fill:var(--bad);font-weight:800">${n}</text></g>` : ""; };
    const B0 = (x, y, n, k) => blocks.includes(k) ? `<g><circle cx="${x}" cy="${y}" r="13" fill="var(--bad)"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" fill="#fff" font-weight="800">✕</text><text class="svg-label small" x="${x + 18}" y="${y + 4}" style="fill:var(--bad);font-weight:800">${n}</text></g>` : "";
    const box = (x, y, t, c = "var(--surface)") => `<rect x="${x - 70}" y="${y - 15}" width="140" height="30" rx="10" fill="${c}" stroke="var(--border)"/><text class="svg-label small" x="${x}" y="${y + 4}" text-anchor="middle" style="font-weight:700">${t}</text>`;
    return W(`${box(110, 25, "Angiotensinogen (hati)")}
      <line x1="110" y1="40" x2="110" y2="70" stroke="var(--text-soft)" stroke-width="2"/><text class="svg-label small" x="102" y="60" text-anchor="end" style="font-size:9.5px">renin (ginjal)</text>${B(70, 55, "aliskiren", "dri")}
      ${box(110, 85, "Angiotensin I")}
      <line x1="110" y1="100" x2="110" y2="130" stroke="var(--text-soft)" stroke-width="2"/><text class="svg-label small" x="102" y="120" text-anchor="end" style="font-size:9.5px">ACE (paru)</text>${B(70, 115, "ACE inhibitor", "acei")}
      ${box(110, 145, "Angiotensin II", "var(--primary-soft)")}
      <text class="svg-label small" x="250" y="30" style="font-size:9.5px">Catatan: ACE juga memecah</text><text class="svg-label small" x="250" y="44" style="font-size:9.5px">bradikinin → ACEi: bradikinin ↑</text><text class="svg-label small" x="250" y="58" style="font-size:9.5px">→ batuk kering, angioedema</text>
      <line x1="110" y1="160" x2="110" y2="190" stroke="var(--text-soft)" stroke-width="2"/>${B(70, 175, "ARB", "arb")}
      ${box(110, 205, "Reseptor AT1")}
      <line x1="180" y1="205" x2="250" y2="170" stroke="var(--text-soft)"/><line x1="180" y1="205" x2="250" y2="205" stroke="var(--text-soft)"/><line x1="180" y1="205" x2="250" y2="240" stroke="var(--text-soft)"/>
      <text class="svg-label small" x="256" y="174">vasokonstriksi</text><text class="svg-label small" x="256" y="209">aldosteron → retensi Na⁺</text><text class="svg-label small" x="256" y="244">ADH, haus, remodeling</text>
      ${blocks.includes("mra") ? `<circle cx="400" cy="186" r="11" fill="var(--bad)"/><text x="400" y="191" text-anchor="middle" font-size="13" fill="#fff" font-weight="800">✕</text><text class="svg-label small" x="400" y="168" text-anchor="middle" style="fill:var(--bad);font-weight:800">MRA</text>` : ""}`, 265);
  }
  function V_NEPH(hl = []) {
    const on = (k) => hl.includes(k);
    return W(`<path d="M60,40 C60,20 100,20 100,40 V200 C100,250 160,250 160,200 V60 C160,40 200,40 220,60 C240,80 260,70 280,60 V250" fill="none" stroke="var(--border)" stroke-width="22" stroke-linecap="round"/>
      <circle cx="80" cy="40" r="26" fill="var(--o2-rich)" opacity=".3"/><text class="svg-label small" x="80" y="16" text-anchor="middle">glomerulus</text>
      <path d="M160,200 V80" stroke="${on("loop") ? "var(--warn)" : "var(--border)"}" stroke-width="22" stroke-linecap="round"/><text class="svg-label small" x="176" y="140" style="font-weight:700;fill:${on("loop") ? "var(--warn)" : "var(--text-soft)"}">Loop Henle</text><text class="svg-label small" x="176" y="154" style="font-weight:700;fill:${on("loop") ? "var(--warn)" : "var(--text-soft)"}">asendens tebal</text><text class="svg-label small" x="176" y="168" style="font-size:9.5px">furosemid</text><text class="svg-label small" x="176" y="181" style="font-size:9.5px">(NKCC2)</text>
      <path d="M200,48 C220,60 240,75 270,62" stroke="${on("thz") ? "var(--accent)" : "var(--border)"}" stroke-width="22" fill="none" stroke-linecap="round"/><text class="svg-label small" x="290" y="40" style="font-weight:700;fill:${on("thz") ? "var(--accent)" : "var(--text-soft)"}">Tubulus distal</text><text class="svg-label small" x="290" y="54" style="font-size:9.5px">tiazid: HCT, klortalidon,</text><text class="svg-label small" x="290" y="66" style="font-size:9.5px">indapamid (NCC)</text>
      <path d="M280,120 V250" stroke="${on("mra") ? "var(--ok)" : "var(--border)"}" stroke-width="22" stroke-linecap="round"/><text class="svg-label small" x="296" y="180" style="font-weight:700;fill:${on("mra") ? "var(--ok)" : "var(--text-soft)"}">Duktus koligens</text><text class="svg-label small" x="296" y="194" style="font-size:9.5px">MRA: spironolakton</text><text class="svg-label small" x="296" y="206" style="font-size:9.5px">(hemat K⁺)</text>`, 265);
  }
  /* Neraca suplai–kebutuhan O₂ */
  function V_SD(drug = "none") {
    const E = {
      none: { hr: 0, ct: 0, wt: 0, fl: 0, dt: 0 }, nitrat: { hr: .1, ct: 0, wt: -.35, fl: .25, dt: 0 }, bb: { hr: -.35, ct: -.25, wt: -.05, fl: 0, dt: .3 },
      dhp: { hr: .08, ct: 0, wt: -.2, fl: .25, dt: 0 }, ndhp: { hr: -.2, ct: -.2, wt: -.15, fl: .2, dt: .2 }, iva: { hr: -.35, ct: 0, wt: 0, fl: 0, dt: .3 },
    }[drug];
    const bar = (x, y, v, c, t) => { const h = K.clamp(60 + v * 100, 10, 110); return `<rect x="${x}" y="${y - h}" width="34" height="${h}" rx="6" fill="${c}"/><text class="svg-label small" x="${x + 17}" y="${y + 14}" text-anchor="middle" style="font-size:9px">${t}</text>`; };
    const dem = 1 + (E.hr + E.ct + E.wt) / 3, sup = 1 + (E.fl + E.dt) / 2, tilt = K.clamp((dem - sup) * 40, -14, 14);
    return W(`<text class="svg-label" x="105" y="22" text-anchor="middle" style="font-weight:800;fill:var(--bad)">KEBUTUHAN O₂</text><text class="svg-label" x="315" y="22" text-anchor="middle" style="font-weight:800;fill:var(--ok)">SUPLAI O₂</text>
      ${bar(40, 160, E.hr, "var(--bad)", "HR")}${bar(88, 160, E.ct, "var(--bad)", "kontraksi")}${bar(136, 160, E.wt, "var(--bad)", "dinding")}
      ${bar(270, 160, E.fl, "var(--ok)", "aliran")}${bar(318, 160, E.dt, "var(--ok)", "diastol")}
      <g transform="rotate(${tilt} 210 215)"><line x1="70" y1="215" x2="350" y2="215" stroke="var(--text)" stroke-width="5" stroke-linecap="round"/><circle cx="105" cy="205" r="10" fill="var(--bad)"/><circle cx="315" cy="205" r="10" fill="var(--ok)"/></g>
      <path d="M195,250 L210,220 L225,250 Z" fill="var(--text-soft)"/>
      <text class="svg-label small" x="210" y="270" text-anchor="middle">${tilt > 3 ? "⚠️ kebutuhan > suplai → iskemia/angina" : tilt < -3 ? "✅ suplai ≥ kebutuhan → angina mereda" : "seimbang"}</text>`, 275);
  }

  const STEPS = [
    { title: "Prinsip: turunkan CO, TPR, atau volume", body: "Semua antihipertensi bekerja pada <b>MAP = CO × TPR</b> (B3) — lewat jantung, arteriol, ginjal (volume), RAAS, atau saraf pusat. <b>Lini pertama</b> (PERHI/ESH): <b>ACEi atau ARB</b>, <b>CCB</b>, dan <b>diuretik tiazid/thiazide-like</b>; <b>β-bloker</b> bila ada indikasi khusus. Kebanyakan pasien butuh <b>kombinasi 2 obat</b> (idealnya dalam satu pil).", key: "Kombinasi favorit: ACEi/ARB + CCB atau + diuretik.", viz: V_MAP(["raas", "vessel", "kidney"]) },
    { title: "ACE inhibitor (-pril)", body: "Contoh: kaptopril, lisinopril, ramipril. Menghambat ACE → angiotensin II ↓ (vasodilatasi, aldosteron ↓). ACE juga memecah bradikinin → bradikinin ↑ → <b>batuk kering</b> & (jarang) <b>angioedema</b>. Waspadai <b>hiperkalemia</b> & kenaikan kreatinin. <b>Kontraindikasi: kehamilan</b>, stenosis a. renalis bilateral.", key: "Pilihan utama pada DM/penyakit ginjal dengan albuminuria, gagal jantung, pasca-infark.", viz: V_RAAS(["acei"]) },
    { title: "ARB (-sartan)", body: "Contoh: losartan, valsartan, kandesartan, telmisartan. Memblok <b>reseptor AT1</b> → efek seperti ACEi tetapi <b>tanpa penumpukan bradikinin</b> → tidak menyebabkan batuk. Indikasi & kontraindikasi mirip ACEi (termasuk <b>kehamilan</b>).", key: "Jangan kombinasikan ACEi + ARB (risiko hiperkalemia & gangguan ginjal).", viz: V_RAAS(["arb", "mra", "dri"]) },
    { title: "Penghambat kanal kalsium (CCB)", body: "<b>Dihidropiridin</b> (-dipin: amlodipin, nifedipin) → terutama <b>vasodilatasi arteriol</b> → TPR ↓. Efek samping: <b>edema tungkai</b>, flushing, sakit kepala, refleks takikardia. <b>Non-dihidropiridin</b> (verapamil, diltiazem) → terutama <b>jantung</b>: HR ↓, konduksi AV ↓, kontraktilitas ↓.", key: "Non-DHP: hindari pada gagal jantung sistolik & jangan dikombinasi dengan β-bloker (bradikardia/blok AV).", viz: V_MAP(["vessel", "heart"]) },
    { title: "Diuretik", body: "<b>Tiazid / thiazide-like</b> (HCT, klortalidon, indapamid) menghambat reabsorpsi Na⁺ di tubulus distal → volume ↓, lalu TPR ↓. Efek samping metabolik: <b>hipokalemia, hiponatremia, hiperurisemia (gout), hiperglikemia</b>. <b>Loop</b> (furosemid) untuk edema/penyakit ginjal lanjut. <b>MRA</b> (spironolakton) untuk hipertensi resisten — hemat K⁺ (risiko hiperkalemia, ginekomastia).", key: "Tiazid: hati-hati pada riwayat gout.", viz: V_NEPH(["thz", "loop", "mra"]) },
    { title: "β-bloker (-olol)", body: "Contoh: bisoprolol, metoprolol (kardioselektif β1), propranolol (nonselektif), karvedilol (β + α1). Menurunkan HR, kontraktilitas, dan sekresi renin. Indikasi khusus: <b>angina, pasca-infark, gagal jantung, fibrilasi atrium</b>. Efek samping: bradikardia, kelelahan, <b>bronkospasme</b> (nonselektif — hindari pada asma), menutupi gejala hipoglikemia.", key: "Jangan dihentikan mendadak → rebound takikardia/iskemia.", viz: V_MAP(["heart"]) },
    { title: "Obat lain & situasi khusus", body: "<b>α1-bloker</b> (doksazosin) — berguna pada BPH; hipotensi ortostatik dosis pertama. <b>Agonis α2 sentral</b>: <b>metildopa</b> (aman pada kehamilan), klonidin (rebound bila dihentikan). <b>Hidralazin</b> — vasodilator langsung, refleks takikardia. <b>Kehamilan</b>: metildopa, nifedipin, labetalol; <b>hindari ACEi/ARB</b>.", key: "Hamil = “Mama Nifas Labu” → Metildopa, Nifedipin, Labetalol.", viz: V_MAP(["brain", "vessel"]) },
    { title: "Prinsip antiangina", body: "Angina = <b>kebutuhan O₂ > suplai</b> (C3). Kebutuhan ditentukan <b>HR, kontraktilitas, tegangan dinding</b> (preload & afterload); suplai ditentukan <b>aliran koroner</b> dan <b>waktu diastol</b> (A2). Obat antiangina memperbaiki neraca ini.", key: "Coba simulator neraca di bagian Interaksi.", viz: V_SD("none") },
    { title: "Nitrat", body: "Nitrogliserin, ISDN, ISMN → dilepas <b>NO</b> → cGMP ↑ → otot polos relaksasi. Efek utama: <b>venodilatasi</b> → preload ↓ → tegangan dinding & kebutuhan O₂ ↓; juga dilatasi arteri koroner epikardial. <b>Sublingual</b> untuk serangan akut. Efek samping: sakit kepala, hipotensi, refleks takikardia, <b>toleransi</b> (perlu interval bebas nitrat).", key: "KONTRAINDIKASI bersama penghambat PDE-5 (sildenafil, tadalafil) → hipotensi berat.", viz: V_SD("nitrat") },
    { title: "β-bloker, CCB, dan lainnya", body: "<b>β-bloker</b>: HR & kontraktilitas ↓ + diastol lebih panjang → lini pertama angina stabil. <b>CCB</b>: vasodilatasi koroner & perifer (non-DHP juga menurunkan HR). Tambahan: <b>ivabradine</b> (menghambat If → HR ↓, A6), <b>ranolazin</b> (menghambat arus Na⁺ lambat), <b>trimetazidin</b> (menggeser metabolisme ke glukosa, A3), <b>nikorandil</b>.", key: "Kombinasi BB + DHP saling melengkapi (DHP menimbulkan refleks takikardia, BB menekannya).", viz: V_SD("bb") },
  ];

  registerModule({
    id: "c04",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Obat bekerja di mata rantai fisiologi", emoji: "💡", html: `
          <p>Hampir semua obat kardiovaskular hanyalah “tuas” pada mekanisme yang sudah kamu pelajari: <b>MAP = CO × TPR</b> (B3), RAAS (B6), kanal ion (A6–A7), dan neraca O₂ miokard (A2).</p>
          <div class="table-wrap"><table class="table"><thead><tr><th>Golongan</th><th>Akhiran</th><th>Target utama</th></tr></thead><tbody>
            <tr><td>ACE inhibitor</td><td>-pril</td><td>RAAS (ACE)</td></tr><tr><td>ARB</td><td>-sartan</td><td>Reseptor AT1</td></tr>
            <tr><td>CCB dihidropiridin</td><td>-dipin</td><td>Kanal Ca²⁺ L arteriol</td></tr><tr><td>β-bloker</td><td>-olol</td><td>Reseptor β1 jantung</td></tr>
            <tr><td>Diuretik tiazid</td><td>-tiazid</td><td>NCC tubulus distal</td></tr><tr><td>Nitrat</td><td>nitro-/-nitrat</td><td>NO → venodilatasi</td></tr></tbody></table></div>
          <p class="small muted">Materi untuk belajar mekanisme. Dosis & pemilihan obat mengikuti pedoman terbaru dan supervisi klinis.</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Golongan demi golongan", emoji: "💊", intro: "Gambar menunjukkan di mana obat bekerja. ✕ merah = titik yang dihambat.",
          viz: V_MAP(), steps: STEPS, autoplayMs: 7500 },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat efek samping", emoji: "🔗", intro: "Efek samping juga bisa ditebak dari mekanismenya.",
          chains: [
            { label: "Mengapa ACEi menyebabkan batuk kering?", nodes: ["ACE = kininase II, juga memecah bradikinin", "ACE dihambat → bradikinin & substansi P menumpuk di saluran napas", "Refleks batuk terpicu", "Batuk kering menetap pada ±5–20% pasien", "Ganti dengan ARB (tidak memengaruhi bradikinin)"] },
            { label: "Mengapa amlodipin menyebabkan edema tungkai?", nodes: ["DHP melebarkan arteriol (prakapiler) lebih kuat daripada venula", "Tekanan hidrostatik kapiler meningkat", "Filtrasi cairan ke interstisial ↑ (gaya Starling, B2)", "Edema pergelangan kaki — bukan karena retensi cairan", "Karena itu diuretik kurang efektif; kombinasi dengan ACEi/ARB mengurangi edema"] },
            { label: "Mengapa tiazid menyebabkan hipokalemia?", nodes: ["Na⁺ lebih banyak tiba di duktus koligens", "Reabsorpsi Na⁺ lewat ENaC meningkat → lumen makin negatif", "Sekresi K⁺ ke urin meningkat", "Volume ↓ juga mengaktifkan aldosteron → buang K⁺ lebih banyak", "Hipokalemia → risiko aritmia (A7)"] },
            { label: "Mengapa nitrat + sildenafil berbahaya?", nodes: ["Nitrat menaikkan produksi cGMP", "Sildenafil menghambat PDE-5 yang memecah cGMP", "cGMP menumpuk berlebihan → vasodilatasi masif", "Preload & TPR turun drastis", "Hipotensi berat, iskemia, bahkan kematian"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Neraca O₂ miokard", emoji: "⚖️", html: `
          <p>Pilih obat antiangina dan lihat bagaimana neraca kebutuhan vs suplai O₂ berubah.</p>
          <div class="toggle-row" id="sd-btns"></div>
          <div class="viz-wrap" id="sd-viz" style="max-width:560px;margin:auto"></div>
          <div class="callout" id="sd-msg"></div>`,
          init(el) {
            const D = { none: ["Tanpa obat (saat aktivitas)", "Kebutuhan melebihi suplai → angina."], nitrat: ["Nitrat", "Preload ↓ → tegangan dinding ↓; dilatasi koroner ↑ suplai. HR sedikit naik (refleks)."], bb: ["β-bloker", "HR & kontraktilitas ↓; diastol memanjang → waktu perfusi ↑."], dhp: ["CCB DHP (amlodipin)", "Afterload ↓ & dilatasi koroner; bisa ada refleks takikardia."], ndhp: ["CCB non-DHP (verapamil/diltiazem)", "HR ↓, kontraktilitas ↓, dilatasi koroner."], iva: ["Ivabradine", "Hanya menurunkan HR (blok If) → diastol lebih panjang, kontraktilitas tetap."] };
            K.$("#sd-btns", el).innerHTML = Object.entries(D).map(([k, [n]]) => `<button class="btn btn-sm" data-k="${k}" type="button">${n}</button>`).join("");
            function show(k) { K.$$("#sd-btns button", el).forEach((b) => b.classList.toggle("on", b.dataset.k === k)); K.$("#sd-viz", el).innerHTML = V_SD(k); K.$("#sd-msg", el).innerHTML = `<p><b>${D[k][0]}:</b> ${D[k][1]}</p>`; }
            K.$$("#sd-btns button", el).forEach((b) => b.addEventListener("click", () => show(b.dataset.k))); show("none");
          } },
        { heading: "Pilih obat untuk pasien", emoji: "🩺", html: `<div id="rx-box"></div>`,
          init(el) {
            const C = [
              { t: "Pria 55 tahun, hipertensi derajat 1 + diabetes dengan albuminuria.", o: ["ACE inhibitor/ARB", "β-bloker nonselektif", "Hidralazin", "Tanpa obat"], a: 0, e: "ACEi/ARB menurunkan tekanan intraglomerulus (dilatasi arteriol eferen) → mengurangi albuminuria dan melindungi ginjal." },
              { t: "Perempuan hamil 24 minggu, TD 150/100.", o: ["Lisinopril", "Valsartan", "Metildopa atau nifedipin", "Spironolakton"], a: 2, e: "ACEi/ARB teratogenik (ginjal janin). Pilihan aman: metildopa, nifedipin, labetalol." },
              { t: "Pasien asma, hipertensi + angina stabil.", o: ["Propranolol", "CCB (mis. amlodipin/diltiazem)", "Kaptopril saja", "Klonidin"], a: 1, e: "β-bloker nonselektif dapat memicu bronkospasme. CCB menurunkan TD sekaligus antiangina." },
              { t: "Pasien hipertensi dengan riwayat gout berulang.", o: ["HCT dosis tinggi", "Losartan atau amlodipin", "Furosemid", "Spironolakton"], a: 1, e: "Tiazid & loop meningkatkan asam urat. Losartan bahkan sedikit urikosurik." },
              { t: "Pasien pakai lisinopril, batuk kering 2 bulan, rontgen normal.", o: ["Tambah antitusif", "Ganti ke ARB", "Tambah β-bloker", "Hentikan semua obat"], a: 1, e: "Batuk akibat bradikinin; ARB tidak memengaruhi bradikinin." },
              { t: "Angina stabil + HR istirahat 95 x/menit, tidak ada asma.", o: ["Nifedipin kerja cepat", "β-bloker kardioselektif", "Hidralazin", "Nitrat saja dosis kontinu tanpa jeda"], a: 1, e: "β-bloker menurunkan HR & kebutuhan O₂ serta memperpanjang diastol — lini pertama angina stabil." },
            ];
            let i = 0, sc = 0, n = 0; const box = K.$("#rx-box", el);
            function show() {
              const c = C[i];
              box.innerHTML = `<div class="callout"><p><b>Pasien ${i + 1}/${C.length}:</b> ${c.t}</p></div><div class="options">${c.o.map((o, j) => `<button class="option" data-j="${j}" type="button"><span class="letter">${"ABCD"[j]}</span><span>${o}</span></button>`).join("")}</div><div class="rx-r" style="margin-top:8px"></div>`;
              K.$$(".option", box).forEach((b) => b.addEventListener("click", () => {
                const r = K.$(".rx-r", box); if (r.innerHTML) return;
                const ok = +b.dataset.j === c.a; n++; if (ok) sc++;
                K.$$(".option", box).forEach((x) => { x.disabled = true; if (+x.dataset.j === c.a) x.classList.add("correct"); }); if (!ok) b.classList.add("incorrect");
                r.innerHTML = `<div class="explain ${ok ? "ok" : "no"}">${c.e}</div><div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary" type="button">${i < C.length - 1 ? "Pasien berikutnya →" : "↺ Ulangi"}</button><span class="small muted">Skor: ${sc}/${n}</span></div>`;
                K.$("button.btn", r).addEventListener("click", () => { i = (i + 1) % C.length; if (!i) { sc = 0; n = 0; } show(); });
              }));
            }
            show();
          } },
        { type: "match", heading: "Akhiran nama obat → golongan", emoji: "🔤", intro: "Ketuk akhiran, lalu golongannya.",
          pairs: [["-pril (lisinopril)", "ACE inhibitor"], ["-sartan (losartan)", "ARB"], ["-dipin (amlodipin)", "CCB dihidropiridin"], ["-olol (bisoprolol)", "β-bloker"], ["-tiazid (hidroklorotiazid)", "Diuretik tiazid"], ["-osin (doksazosin)", "α1-bloker"]] },
        { type: "match", heading: "Obat → efek samping khas", emoji: "⚠️", intro: "Ketuk obat, lalu efek samping khasnya.",
          pairs: [["ACE inhibitor", "Batuk kering, angioedema, hiperkalemia"], ["Amlodipin", "Edema pergelangan kaki, flushing"], ["Hidroklorotiazid", "Hipokalemia, hiperurisemia"], ["Propranolol", "Bronkospasme, bradikardia"], ["Nitrat", "Sakit kepala, hipotensi, toleransi"], ["Spironolakton", "Hiperkalemia, ginekomastia"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Lini pertama hipertensi “<b>A-C-D</b>”: <b>A</b>CEi/ARB · <b>C</b>CB · <b>D</b>iuretik tiazid (β-bloker = indikasi khusus).</p></div>
            <div class="callout"><p class="mnemo">Efek samping ACEi “<b>CAPTO-PRIL</b>”: <b>C</b>ough · <b>A</b>ngioedema · <b>P</b>regnancy (kontraindikasi) · <b>T</b>aste changes · <b>O</b>rthostatic/hipotensi · <b>P</b>otassium ↑ · <b>R</b>enal (kreatinin ↑) · <b>I</b>nteraksi OAINS · <b>L</b>eukopenia (jarang).</p></div>
            <div class="callout green"><p class="mnemo">Tiazid “<b>Hiper-GLUC</b>, <b>Hipo-KN</b>”: hiper<b>G</b>likemia, hiper<b>L</b>ipidemia, hiper<b>U</b>risemia, hiper<b>C</b>alsemia · hipo<b>K</b>alemia, hipo<b>N</b>atremia.</p></div>
            <div class="callout warn"><p class="mnemo">Hipertensi pada kehamilan “<b>Mama Nifas Labu</b>” → <b>M</b>etildopa · <b>Nif</b>edipin · <b>Lab</b>etalol. ACEi/ARB = ❌.</p></div>
            <div class="callout"><p class="mnemo">Nitrat: “<b>V</b>ena dulu” (venodilatasi → preload ↓) · “<b>No Viagra</b>” (kontraindikasi PDE-5 inhibitor) · “<b>Libur nitrat</b>” cegah toleransi.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Penyebab batuk akibat ACEi", "Akumulasi bradikinin"], ["ACEi/ARB dikontraindikasikan pada", "Kehamilan, stenosis a. renalis bilateral, riwayat angioedema"], ["CCB yang menurunkan HR", "Non-DHP: verapamil, diltiazem"], ["Kombinasi yang dihindari dengan verapamil", "β-bloker (bradikardia, blok AV)"], ["Lokasi kerja tiazid", "Tubulus distal (kotransporter Na⁺-Cl⁻)"], ["Lokasi kerja furosemid", "Loop Henle asendens tebal (NKCC2)"], ["Antihipertensi pada hipertensi resisten (tambahan)", "Spironolakton"], ["Mekanisme utama nitrat pada angina", "Venodilatasi → preload ↓ → kebutuhan O₂ ↓"], ["Obat antiangina yang hanya menurunkan HR", "Ivabradine (blok If)"], ["Kontraindikasi nitrat", "Penggunaan penghambat PDE-5 (sildenafil)"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Tebak masalahnya sebelum membuka kartu.", note: "Untuk latihan penalaran farmakologi; bukan pedoman dosis.",
          items: [
            { icon: "🧪", title: "Kreatinin naik 50% setelah memulai ACEi, ada bruit abdomen", chain: ["Filtrasi glomerulus pada stenosis a. renalis bergantung pada angiotensin II yang menyempitkan arteriol eferen", "ACEi melebarkan eferen → tekanan filtrasi turun", "Curiga stenosis a. renalis bilateral → hentikan, rujuk"] },
            { icon: "💓", title: "Berdebar & wajah merah setelah nifedipin kerja cepat", chain: ["Vasodilatasi mendadak → TD turun cepat", "Refleks baroreseptor → simpatis ↑", "Takikardia refleks — bisa memperburuk iskemia; pilih DHP kerja panjang"] },
            { icon: "🫁", title: "Mengi setelah mulai propranolol", chain: ["Propranolol memblok β2 di bronkus", "Bronkodilatasi simpatis hilang", "Bronkospasme → ganti β-bloker kardioselektif / obat lain"] },
            { icon: "⚡", title: "Lemas & aritmia pada pasien HCT dosis tinggi", chain: ["Diuretik tiazid membuang K⁺", "Hipokalemia", "Repolarisasi terganggu → aritmia (A7); periksa elektrolit"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Mengapa ARB tidak menyebabkan batuk kering seperti ACEi?",
          options: ["ARB tidak menurunkan tekanan darah", "ARB memblok reseptor AT1 tanpa menghambat pemecahan bradikinin", "ARB menghambat renin", "ARB bekerja di tubulus distal"], answer: 1,
          explain: "ACE juga memecah bradikinin; ARB bekerja setelah langkah ACE (di reseptor), sehingga bradikinin tidak menumpuk." },
        { q: "Edema tungkai akibat amlodipin terutama disebabkan oleh…",
          options: ["Retensi natrium oleh ginjal", "Dilatasi arteriol prakapiler sehingga tekanan hidrostatik kapiler naik", "Gagal jantung", "Hipoalbuminemia"], answer: 1,
          explain: "Arteriol melebar lebih dari venula → tekanan kapiler ↑ → filtrasi ↑ (gaya Starling)." },
        { q: "Obat antihipertensi yang paling tepat untuk ibu hamil adalah…",
          options: ["Ramipril", "Losartan", "Metildopa", "Spironolakton"], answer: 2,
          explain: "Metildopa (juga nifedipin & labetalol) dianggap aman. ACEi/ARB kontraindikasi karena fetotoksik." },
        { q: "Mekanisme utama nitrat meredakan angina adalah…",
          options: ["Meningkatkan HR", "Venodilatasi sehingga preload & tegangan dinding turun, plus dilatasi koroner", "Menghambat reseptor β1", "Meningkatkan kontraktilitas"], answer: 1,
          explain: "Penurunan preload mengurangi kebutuhan O₂ miokard; dilatasi arteri koroner epikardial menambah suplai." },
        { q: "Kombinasi berikut sebaiknya dihindari karena risiko bradikardia berat dan blok AV:",
          options: ["Amlodipin + ACEi", "Verapamil + β-bloker", "HCT + ARB", "Amlodipin + bisoprolol"], answer: 1,
          explain: "Keduanya menekan SA & AV node. Sebaliknya, DHP + β-bloker justru saling melengkapi." },
      ]},
    ],
  });
})();
