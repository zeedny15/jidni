/* Modul C2 — Hipertensi (Kuliah 7) */
(function () {
  // Klasifikasi PERHI 2019 (mengacu ESH/ESC 2018)
  const CLS = [
    { n: "Optimal", s: [0, 120], d: [0, 80], c: "#2b8a3e" },
    { n: "Normal", s: [120, 130], d: [80, 85], c: "#74b816" },
    { n: "Normal-tinggi", s: [130, 140], d: [85, 90], c: "#fab005" },
    { n: "Hipertensi derajat 1", s: [140, 160], d: [90, 100], c: "#f76707" },
    { n: "Hipertensi derajat 2", s: [160, 180], d: [100, 110], c: "#e03131" },
    { n: "Hipertensi derajat 3", s: [180, 300], d: [110, 200], c: "#862e9c" },
  ];
  function classify(s, d) {
    let k = 0;
    CLS.forEach((c, i) => { if (s >= c.s[0] || d >= c.d[0]) k = i; });
    const iso = s >= 140 && d < 90;
    return { ...CLS[k], iso, crisis: s > 180 || d > 120 };
  }

  const W = (inner, h = 280) => `<svg viewBox="0 0 420 ${h}" role="img" aria-label="Ilustrasi hipertensi">${inner}</svg>`;
  const V_DEF = W(`
    <rect x="20" y="20" width="380" height="240" rx="18" fill="var(--surface)" stroke="var(--border)"/>
    <text class="svg-label" x="210" y="50" text-anchor="middle">Batas diagnosis hipertensi</text>
    ${[["🏥 Di klinik (berulang)", "≥ 140 / 90", 90], ["🏠 Di rumah (HBPM)", "≥ 135 / 85", 140], ["⌚ ABPM rata-rata 24 jam", "≥ 130 / 80", 190]].map(([a, b, y]) => `<text class="svg-label small" x="50" y="${y}">${a}</text><text class="svg-label" x="370" y="${y}" text-anchor="end" style="fill:var(--primary);font-weight:800">${b}</text>`).join("")}
    <text class="svg-label small" x="210" y="235" text-anchor="middle">Diukur ≥2 kali, duduk 5 menit, manset sesuai lengan</text>`);
  const V_CLS = W(`${CLS.map((c, i) => `<rect x="30" y="${20 + i * 40}" width="360" height="34" rx="10" fill="${c.c}" opacity=".85"/><text class="svg-label small" x="44" y="${42 + i * 40}" style="fill:#fff;font-weight:700">${c.n}</text><text class="svg-label small" x="376" y="${42 + i * 40}" text-anchor="end" style="fill:#fff">${i === 5 ? "≥180 dan/atau ≥110" : i === 0 ? "<120 dan <80" : `${c.s[0]}–${c.s[1] - 1} dan/atau ${c.d[0]}–${c.d[1] - 1}`}</text>`).join("")}`, 270);
  const V_MECH = W(`
    <rect x="130" y="110" width="160" height="60" rx="14" fill="var(--primary)"/><text class="svg-label" x="210" y="138" text-anchor="middle" style="fill:#fff;font-weight:800">MAP ↑</text><text class="svg-label small" x="210" y="156" text-anchor="middle" style="fill:#fff">= CO × TPR</text>
    ${[["🧂 Retensi Na⁺ & volume", 20, 20, "CO ↑"], ["🧪 RAAS aktif", 250, 20, "TPR & volume ↑"], ["⚡ Simpatis berlebih", 20, 210, "CO & TPR ↑"], ["🧱 Arteri kaku & endotel", 250, 210, "TPR ↑"]].map(([t, x, y, e]) => `<rect x="${x}" y="${y}" width="150" height="50" rx="12" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="${x + 75}" y="${y + 22}" text-anchor="middle" style="font-weight:700">${t}</text><text class="svg-label small" x="${x + 75}" y="${y + 38}" text-anchor="middle" style="fill:var(--primary)">${e}</text><line x1="${x + 75}" y1="${y < 100 ? y + 50 : y}" x2="210" y2="${y < 100 ? 110 : 170}" stroke="var(--text-soft)" stroke-width="2" marker-end="url(#ha)"/>`).join("")}
    <defs><marker id="ha" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--text-soft)"/></marker></defs>`);
  const ORG = [["brain", "🧠", 210, 30, "Otak", "Stroke (iskemik & perdarahan), ensefalopati, demensia vaskular"], ["eye", "👁️", 300, 60, "Mata", "Retinopati hipertensif: penyempitan arteriol, AV nicking, perdarahan, eksudat, papiledema"], ["heart", "🫀", 200, 120, "Jantung", "Hipertrofi VKi (afterload ↑, A13), gagal jantung, PJK, fibrilasi atrium"], ["kidney", "🫘", 186, 178, "Ginjal", "Nefrosklerosis → albuminuria → penyakit ginjal kronik"], ["vessel", "🩸", 236, 210, "Pembuluh", "Aterosklerosis, penyakit arteri perifer, aneurisma & diseksi aorta"]];
  const V_HMOD = W(`
    <circle cx="210" cy="50" r="28" fill="var(--surface)" stroke="var(--border)"/><rect x="160" y="80" width="100" height="150" rx="30" fill="var(--surface)" stroke="var(--border)"/>
    <rect x="130" y="90" width="26" height="110" rx="12" fill="var(--surface)" stroke="var(--border)"/><rect x="264" y="90" width="26" height="110" rx="12" fill="var(--surface)" stroke="var(--border)"/>
    <rect x="170" y="230" width="30" height="45" rx="12" fill="var(--surface)" stroke="var(--border)"/><rect x="220" y="230" width="30" height="45" rx="12" fill="var(--surface)" stroke="var(--border)"/>
    ${ORG.map(([k, e, x, y]) => `<g data-info="${k}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="20" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/><text x="${x}" y="${y + 7}" font-size="20" text-anchor="middle">${e}</text></g>`).join("")}
    <text class="svg-label small" x="210" y="272" text-anchor="middle" style="font-size:9.5px">HMOD = hypertension-mediated organ damage · klik organ</text>`);
  const V_SEC = W(`
    ${[["🫘 Penyakit parenkim ginjal", "tersering"], ["🩻 Stenosis a. renalis (renovaskular)", "bruit abdomen, muda/tua"], ["🧪 Hiperaldosteronisme primer", "hipokalemia"], ["😰 Feokromositoma", "episodik: sakit kepala, berdebar, keringat"], ["🌙 Obstructive sleep apnea", "mendengkur, kantuk siang"], ["🦵 Koarktasio aorta", "TD lengan > tungkai, nadi femoral lemah"], ["🌕 Sindrom Cushing", "obesitas sentral, striae"], ["💊 Obat: OAINS, kortikosteroid, kontrasepsi oral, dekongestan", ""]].map(([a, b], i) => `<rect x="20" y="${12 + i * 33}" width="380" height="28" rx="8" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="32" y="${31 + i * 33}" style="font-weight:700">${a}</text><text class="svg-label small" x="390" y="${31 + i * 33}" text-anchor="end" style="fill:var(--primary)">${b}</text>`).join("")}`);
  const V_CRI = W(`
    <rect x="130" y="10" width="160" height="40" rx="12" fill="var(--bad)"/><text class="svg-label" x="210" y="35" text-anchor="middle" style="fill:#fff;font-weight:800">TD > 180 / 120</text>
    <line x1="210" y1="50" x2="210" y2="75" stroke="var(--text-soft)" stroke-width="2"/>
    <rect x="80" y="75" width="260" height="40" rx="12" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="210" y="99" text-anchor="middle" style="font-weight:700">Ada kerusakan organ AKUT?</text>
    <path d="M140,115 L90,150 M280,115 L330,150" stroke="var(--text-soft)" stroke-width="2"/>
    <text class="svg-label small" x="95" y="138">YA</text><text class="svg-label small" x="315" y="138">TIDAK</text>
    <rect x="10" y="150" width="190" height="120" rx="12" fill="var(--bad-soft)" stroke="var(--bad)"/>
    <text class="svg-label small" x="105" y="172" text-anchor="middle" style="font-weight:800;fill:var(--bad)">EMERGENSI</text>
    <text class="svg-label small" x="20" y="192" style="font-size:9.5px">ensefalopati, stroke, SKA, edema paru,</text><text class="svg-label small" x="20" y="206" style="font-size:9.5px">diseksi aorta, eklampsia, AKI</text>
    <text class="svg-label small" x="20" y="228" style="font-size:9.5px">→ rawat ICU, obat IV</text><text class="svg-label small" x="20" y="242" style="font-size:9.5px">→ MAP turun ≤25% dalam jam pertama</text><text class="svg-label small" x="20" y="256" style="font-size:9.5px">(target khusus: diseksi, stroke, eklampsia)</text>
    <rect x="220" y="150" width="190" height="120" rx="12" fill="var(--warn-soft)" stroke="var(--warn)"/>
    <text class="svg-label small" x="315" y="172" text-anchor="middle" style="font-weight:800;fill:var(--warn)">URGENSI</text>
    <text class="svg-label small" x="230" y="192" style="font-size:9.5px">tanpa kerusakan organ akut</text>
    <text class="svg-label small" x="230" y="214" style="font-size:9.5px">→ obat ORAL</text><text class="svg-label small" x="230" y="228" style="font-size:9.5px">→ turunkan BERTAHAP 24–48 jam</text><text class="svg-label small" x="230" y="242" style="font-size:9.5px">→ jangan turun terlalu cepat</text><text class="svg-label small" x="230" y="256" style="font-size:9.5px">(risiko iskemia otak/koroner)</text>`);

  const STEPS = [
    { title: "Definisi & cara mengukur", body: "Hipertensi = TD <b>≥140/90 mmHg</b> di klinik pada pengukuran berulang (PERHI 2019). Pengukuran di luar klinik membantu menyingkirkan <b>white-coat hypertension</b> (tinggi hanya di klinik) dan menemukan <b>masked hypertension</b> (normal di klinik, tinggi di luar).", key: "Teknik pengukuran yang benar = separuh dari diagnosis (lihat B3).", viz: V_DEF },
    { title: "Klasifikasi", body: "PERHI 2019 membagi TD menjadi optimal, normal, normal-tinggi, dan hipertensi derajat 1–3. Bila sistolik dan diastolik jatuh di kategori berbeda, pakai <b>kategori yang lebih tinggi</b>. <b>Hipertensi sistolik terisolasi</b>: ≥140 / <90 (khas lansia, B3).", key: "Coba sendiri di bagian Interaksi.", viz: V_CLS },
    { title: "Hipertensi esensial (primer)", body: "<b>90–95%</b> kasus; tidak ada satu penyebab tunggal. Interaksi <b>genetik</b> dan <b>lingkungan</b> (asupan garam tinggi, obesitas, kurang aktivitas, alkohol, stres, usia) mengganggu pengatur tekanan: ginjal menahan Na⁺, RAAS & simpatis terlalu aktif, endotel terganggu, arteri kaku. Semuanya bermuara pada <b>MAP = CO × TPR</b> yang meningkat.", key: "Awalnya CO ↑; jangka panjang yang menetap adalah TPR ↑.", viz: V_MECH },
    { title: "Kerusakan organ target (HMOD)", body: "Tekanan tinggi bertahun-tahun merusak pembuluh dan organ — sering <b>tanpa gejala</b> (“silent killer”). Klik tiap organ.", key: "Skrining HMOD: EKG (LVH), kreatinin & eGFR, albuminuria, funduskopi.", viz: V_HMOD },
    { title: "Hipertensi sekunder", body: "<b>5–10%</b> kasus punya penyebab spesifik yang bisa diobati. Curigai bila: onset usia muda (<30–40 tahun) atau mendadak berat, <b>resisten</b> terhadap ≥3 obat, ada hipokalemia, gejala episodik, atau tanda khas penyakit tertentu.", key: "Hipertensi sekunder = “detektif”: cari petunjuknya (bagian Interaksi).", viz: V_SEC },
    { title: "Krisis hipertensi", body: "TD sangat tinggi (><b>180/120</b>). Pembedanya bukan angka, tetapi <b>ada tidaknya kerusakan organ akut</b>: <b>emergensi</b> (ada) → obat IV, turunkan terkontrol; <b>urgensi</b> (tidak ada) → obat oral, turunkan bertahap.", key: "Menurunkan terlalu cepat berbahaya: autoregulasi otak sudah bergeser ke kanan (B6).", viz: V_CRI },
  ];

  registerModule({
    id: "c02",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Tekanan yang terlalu tinggi, terlalu lama", emoji: "💡", html: `
          <p>Dari B3 & B6: tekanan darah = <b>CO × TPR</b>, dan diatur oleh saraf, hormon, serta ginjal. Hipertensi terjadi ketika titik setel pengaturan ini <b>bergeser ke atas</b>.</p>
          <ul class="key-points">
            <li><span class="k-ico">🧬</span><span><b>Esensial</b> (90–95%) — multifaktor, tanpa penyebab tunggal.</span></li>
            <li><span class="k-ico">🔍</span><span><b>Sekunder</b> (5–10%) — ada penyakit penyebab yang bisa dicari.</span></li>
            <li><span class="k-ico">🚨</span><span><b>Krisis hipertensi</b> — urgensi vs emergensi.</span></li>
          </ul>
          <p class="small muted">Level SKDI: hipertensi esensial 4A, sekunder 3A. Klasifikasi mengacu Konsensus PERHI 2019.</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Memahami hipertensi", emoji: "🎬", intro: "Gambar berganti mengikuti topik. Pada langkah organ target, klik tiap organ.",
          viz: V_DEF, steps: STEPS, autoplayMs: 7000,
          info: Object.fromEntries(ORG.map(([k, , , , n, d]) => [k, [n, d]])) },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Garam & ginjal → hipertensi", nodes: ["Asupan Na⁺ tinggi pada individu “sensitif garam”", "Ginjal tidak mampu membuang Na⁺ pada tekanan normal (kurva natriuresis bergeser)", "Retensi Na⁺ & air → volume darah ↑ → CO ↑", "Autoregulasi jaringan: arteriol menyempit karena aliran berlebih", "TPR ↑ menetap → hipertensi kronik"] },
            { label: "Hipertensi → hipertrofi VKi → gagal jantung", nodes: ["Afterload VKi meningkat terus (A13)", "Dinding VKi menebal (hipertrofi konsentrik) untuk menormalkan stres dinding", "Ventrikel kaku → relaksasi & pengisian terganggu (disfungsi diastolik)", "Kebutuhan O₂ ↑, suplai koroner relatif ↓ → iskemia", "Lama-lama → gagal jantung"] },
            { label: "Hiperaldosteronisme primer", nodes: ["Adenoma/hiperplasia adrenal memproduksi aldosteron otonom", "Ginjal menahan Na⁺ & air, membuang K⁺", "Volume ↑ → hipertensi; renin tertekan (rasio aldosteron/renin ↑)", "K⁺ terbuang → hipokalemia (lemah otot, kram)", "Petunjuk klinis: hipertensi + hipokalemia"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Klasifikasikan tekanan darah", emoji: "🎚️", html: `
          <p>Geser sistolik dan diastolik. Titik akan berpindah di peta klasifikasi PERHI 2019.</p>
          <div class="slider-row"><label for="h-s">Sistolik <output id="h-s-o"></output></label><input type="range" id="h-s" min="90" max="230" value="128"></div>
          <div class="slider-row"><label for="h-d">Diastolik <output id="h-d-o"></output></label><input type="range" id="h-d" min="50" max="140" value="82"></div>
          <div class="viz-wrap"><svg id="h-map" viewBox="0 0 420 260" style="max-width:600px;margin:auto" role="img" aria-label="Peta klasifikasi"></svg></div>
          <div class="callout" id="h-msg"></div>`,
          init(el) {
            const sx = (d) => 40 + (d - 50) / 90 * 370, sy = (s) => 240 - (s - 90) / 140 * 225;
            const s = K.$("#h-s", el), d = K.$("#h-d", el);
            // gambar area secara berlapis dari kategori tertinggi ke terendah
            let areas = ""; [...CLS].reverse().forEach((c) => { const x1 = sx(Math.min(140, c.d[1])), y1 = sy(Math.min(230, c.s[1])); areas += `<rect x="40" y="${Math.max(15, y1)}" width="${x1 - 40}" height="${240 - Math.max(15, y1)}" fill="${c.c}" opacity=".75"/>`; });
            K.$("#h-map", el).innerHTML = `<rect x="40" y="15" width="370" height="225" fill="#862e9c" opacity=".75"/>${areas}
              <line class="svg-axis" x1="40" y1="240" x2="410" y2="240"/><line class="svg-axis" x1="40" y1="15" x2="40" y2="240"/>
              ${[60, 80, 90, 100, 110, 120].map((v) => `<text class="svg-label small" x="${sx(v)}" y="254" text-anchor="middle" style="font-size:9px">${v}</text>`).join("")}
              ${[120, 140, 160, 180, 200].map((v) => `<text class="svg-label small" x="36" y="${sy(v) + 3}" text-anchor="end" style="font-size:9px">${v}</text>`).join("")}
              <text class="svg-label small" x="225" y="12" text-anchor="middle">sumbu X = diastolik · sumbu Y = sistolik</text>
              <circle id="h-dot" r="8" fill="#fff" stroke="#000" stroke-width="3"/>`;
            function upd() {
              const S = +s.value, D = +d.value, c = classify(S, D);
              K.$("#h-s-o", el).textContent = S + " mmHg"; K.$("#h-d-o", el).textContent = D + " mmHg";
              const dot = K.$("#h-dot", el); dot.setAttribute("cx", sx(Math.min(140, D))); dot.setAttribute("cy", sy(Math.min(230, S)));
              const m = K.$("#h-msg", el);
              m.className = "callout " + (c.n.includes("Hipertensi") ? "red" : c.n === "Normal-tinggi" ? "warn" : "green");
              m.innerHTML = `<p><b>${S}/${D} mmHg → ${c.n}${c.iso ? " (sistolik terisolasi)" : ""}.</b> ${c.crisis ? "⚠️ Masuk kisaran <b>krisis hipertensi</b> — periksa tanda kerusakan organ akut!" : c.n.includes("Hipertensi") ? "Perlu modifikasi gaya hidup dan (umumnya) obat — lihat C4." : c.n === "Normal-tinggi" ? "Modifikasi gaya hidup; pantau berkala." : "Pertahankan gaya hidup sehat."}</p>`;
            }
            [s, d].forEach((x) => x.addEventListener("input", upd)); upd();
          } },
        { heading: "Gaya hidup: berapa mmHg yang bisa turun?", emoji: "🥗", html: `
          <p>Centang modifikasi gaya hidup. Angka adalah <b>perkiraan rata-rata penurunan TD sistolik</b> dari penelitian (efek tiap orang berbeda).</p>
          <div class="toggle-row" id="ls-btns"></div>
          <div class="readouts"><div class="readout"><span>TD sistolik awal</span><b>152 mmHg</b></div><div class="readout big"><span>Perkiraan setelah modifikasi</span><b id="ls-out"></b></div></div>
          <div class="bar"><span id="ls-bar" style="background:var(--ok)"></span></div>
          <div class="callout" id="ls-msg" style="margin-top:10px"></div>`,
          init(el) {
            const L = [["🧂 Kurangi garam (<5 g/hari)", 5], ["⚖️ Turun BB 5 kg", 5], ["🥗 Pola makan DASH", 11], ["🏃 Aktivitas aerobik rutin", 5], ["🍺 Batasi alkohol", 4], ["🚭 Berhenti merokok (risiko KV ↓)", 0]];
            const on = new Set();
            K.$("#ls-btns", el).innerHTML = L.map(([n], i) => `<button class="btn btn-sm" data-i="${i}" type="button">${n}</button>`).join("");
            function upd() {
              let drop = 0; on.forEach((i) => drop += L[i][1]); drop = Math.round(drop * (on.size > 1 ? .8 : 1));
              const v = 152 - drop;
              K.$("#ls-out", el).innerHTML = `${v}<small> mmHg</small>`; K.$("#ls-bar", el).style.width = (drop / 30 * 100) + "%";
              K.$$("#ls-btns button", el).forEach((b) => b.classList.toggle("on", on.has(+b.dataset.i)));
              K.$("#ls-msg", el).innerHTML = `<p>Perkiraan penurunan ±${drop} mmHg${on.size > 1 ? " (efek gabungan tidak sepenuhnya dijumlah)" : ""}. Penurunan sistolik 10 mmHg menurunkan risiko stroke ±25–35% dan PJK ±20%. ${on.has(5) ? "Berhenti merokok tidak banyak menurunkan TD, tetapi sangat menurunkan risiko kardiovaskular total." : ""}</p>`;
            }
            K.$$("#ls-btns button", el).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.i; on.has(i) ? on.delete(i) : on.add(i); upd(); }));
            upd();
          } },
        { type: "match", heading: "Detektif hipertensi sekunder", emoji: "🔍", intro: "Ketuk petunjuk klinis, lalu penyebab yang paling mungkin.",
          pairs: [["Hipertensi + hipokalemia spontan", "Hiperaldosteronisme primer"], ["Serangan sakit kepala, berdebar, berkeringat", "Feokromositoma"], ["TD lengan tinggi, nadi femoral lemah & terlambat", "Koarktasio aorta"], ["Bruit abdomen, kreatinin naik setelah ACE inhibitor", "Stenosis a. renalis"], ["Mendengkur keras, kantuk di siang hari", "Obstructive sleep apnea"], ["Proteinuria, edema, riwayat penyakit ginjal", "Penyakit parenkim ginjal"]] },
        { heading: "Simulasi: urgensi atau emergensi?", emoji: "🚑", html: `<div id="cr-box"></div>`,
          init(el) {
            const C = [
              { t: "TD 200/120, sakit kepala ringan, pemeriksaan neurologis & funduskopi normal, EKG normal.", a: "u", e: "Tanpa kerusakan organ akut → <b>urgensi</b>: obat oral, turunkan bertahap 24–48 jam, kontrol cepat." },
              { t: "TD 220/130, sesak berat, ronki basah kedua paru, SpO₂ 86%.", a: "e", e: "Edema paru akut = kerusakan organ akut → <b>emergensi</b>: obat IV (mis. nitrat), turunkan terkontrol." },
              { t: "TD 210/125, nyeri dada tajam menjalar ke punggung, beda TD lengan kanan–kiri.", a: "e", e: "Curiga <b>diseksi aorta</b> → emergensi dengan target paling agresif (sistolik <120 dalam ±1 jam) + kontrol HR." },
              { t: "Ibu hamil 34 minggu, TD 170/115, kejang.", a: "e", e: "<b>Eklampsia</b> → emergensi: MgSO₄ untuk kejang + antihipertensi (target <160/105)." },
              { t: "TD 190/115, lupa minum obat 3 hari, tidak ada keluhan, urin & EKG normal.", a: "u", e: "Urgensi karena putus obat. Mulai kembali obat oral; hindari menurunkan TD terlalu cepat." },
            ];
            let i = 0, sc = 0, n = 0;
            const box = K.$("#cr-box", el);
            function show() {
              const c = C[i];
              box.innerHTML = `<div class="callout"><p><b>Kasus ${i + 1}/${C.length}:</b> ${c.t}</p></div>
                <div class="btn-row"><button class="btn btn-sm" data-a="u" type="button">🟠 Urgensi</button><button class="btn btn-sm" data-a="e" type="button">🔴 Emergensi</button><span class="small muted">Skor: ${sc}/${n}</span></div><div id="cr-r" style="margin-top:8px"></div>`;
              K.$$("[data-a]", box).forEach((b) => b.addEventListener("click", () => {
                if (K.$("#cr-r", box).innerHTML) return;
                const ok = b.dataset.a === c.a; n++; if (ok) sc++;
                K.$("#cr-r", box).innerHTML = `<div class="callout ${ok ? "green" : "red"}"><p>${ok ? "✅" : "❌"} ${c.e}</p></div><button class="btn btn-sm btn-primary" id="cr-n" type="button">${i < C.length - 1 ? "Kasus berikutnya →" : "↺ Ulangi"}</button>`;
                K.$("#cr-n", box).addEventListener("click", () => { i = (i + 1) % C.length; if (i === 0) { sc = 0; n = 0; } show(); });
              }));
            }
            show();
          } },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Angka kunci PERHI: <b>140/90</b> (klinik) · <b>135/85</b> (rumah) · <b>130/80</b> (ABPM 24 jam) · krisis <b>>180/120</b>.</p></div>
            <div class="callout"><p class="mnemo">Organ target “<b>OJ-GiMP</b>”: <b>O</b>tak · <b>J</b>antung · <b>Gi</b>njal · <b>M</b>ata · <b>P</b>embuluh.</p></div>
            <div class="callout green"><p class="mnemo">Sekunder “<b>GRAF-COS</b>”: <b>G</b>injal parenkim · <b>R</b>enovaskular · <b>A</b>ldosteron · <b>F</b>eokromositoma · <b>C</b>ushing/<b>C</b>oarktasio · <b>O</b>bat · <b>S</b>leep apnea.</p></div>
            <div class="callout warn"><p class="mnemo">Krisis: “<b>E</b>mergensi = <b>E</b>rgan (organ) rusak → <b>IV</b>; <b>U</b>rgensi = <b>U</b>tuh → <b>oral</b>.”</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Batas hipertensi di klinik (PERHI)", "≥140/90 mmHg"], ["Batas hipertensi HBPM", "≥135/85 mmHg"], ["Proporsi hipertensi esensial", "90–95%"], ["Hipertensi + hipokalemia → curiga", "Hiperaldosteronisme primer"], ["Trias feokromositoma", "Sakit kepala, berdebar, berkeringat (episodik)"], ["TD lengan > tungkai", "Koarktasio aorta"], ["Beda krisis emergensi vs urgensi", "Ada/tidaknya kerusakan organ akut"], ["Target awal emergensi umum", "MAP turun ≤25% dalam jam pertama"], ["Target khusus diseksi aorta", "Sistolik <120 mmHg dalam ±1 jam"], ["Contoh HMOD jantung", "Hipertrofi VKi"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Tebak diagnosis & mekanismenya sebelum membuka kartu.", note: "Untuk latihan penalaran. Keputusan terapi mengikuti pedoman terbaru (PERHI/ESH) dan supervisi.",
          items: [
            { icon: "👨", title: "Pria 52 tahun, TD 156/98 pada 3 kunjungan, obesitas, tanpa keluhan", chain: ["Faktor risiko gaya hidup + usia", "Hipertensi esensial derajat 1", "Modifikasi gaya hidup + obat lini pertama (C4); cari HMOD & faktor risiko lain"] },
            { icon: "👩", title: "Perempuan 28 tahun, TD 170/105, K⁺ 2,9 mmol/L, kram otot", chain: ["Usia muda + hipokalemia → curiga hipertensi sekunder", "Kemungkinan hiperaldosteronisme primer", "Periksa rasio aldosteron/renin, rujuk"] },
            { icon: "🧓", title: "Lansia 75 tahun, TD 168/72", chain: ["Aorta kaku (compliance ↓, B3)", "Hipertensi sistolik terisolasi", "Tekanan nadi lebar → risiko stroke & HMOD"] },
            { icon: "🚑", title: "TD 230/140 dengan bingung, muntah, papiledema", chain: ["TD melampaui batas atas autoregulasi otak (B6)", "Edema otak → ensefalopati hipertensif", "Emergensi: rawat intensif, obat IV, turunkan terkontrol"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "TD 146/88 mmHg pada beberapa kali pengukuran. Menurut PERHI 2019, ini termasuk…",
          options: ["Normal-tinggi", "Hipertensi derajat 1", "Hipertensi sistolik terisolasi derajat 2", "Optimal"], answer: 1,
          explain: "Sistolik 140–159 masuk derajat 1. Bila kategori sistolik dan diastolik berbeda, pakai yang lebih tinggi. (Sistolik ≥140 dengan diastolik <90 juga disebut sistolik terisolasi.)" },
        { q: "Pembeda utama hipertensi emergensi dan urgensi adalah…",
          options: ["Nilai TD di atas 200/130", "Ada atau tidaknya kerusakan organ target akut", "Usia pasien", "Jenis obat yang sedang diminum"], answer: 1,
          explain: "Keduanya bisa memiliki angka TD sama. Emergensi ditandai kerusakan organ akut (otak, jantung, aorta, ginjal, eklampsia)." },
        { q: "Mengapa TD pada krisis hipertensi tidak boleh diturunkan terlalu cepat ke normal?",
          options: ["Karena obat IV mahal", "Karena kurva autoregulasi otak sudah bergeser ke tekanan lebih tinggi sehingga penurunan cepat menyebabkan iskemia", "Karena TD akan naik lagi", "Karena ginjal akan menahan Na⁺"], answer: 1,
          explain: "Pada hipertensi kronik, arteriol otak beradaptasi pada tekanan tinggi. Penurunan mendadak ke 'normal' bisa berada di bawah batas autoregulasi → hipoperfusi." },
        { q: "Hipertensi usia 25 tahun dengan TD lengan 170/100 tetapi nadi femoral lemah dan terlambat. Diagnosis paling mungkin…",
          options: ["Hiperaldosteronisme", "Koarktasio aorta", "Feokromositoma", "Hipertensi esensial"], answer: 1,
          explain: "Penyempitan aorta (umumnya distal a. subklavia kiri) menaikkan TD ekstremitas atas dan menurunkan aliran ke ekstremitas bawah." },
        { q: "Mekanisme hipertrofi ventrikel kiri pada hipertensi adalah…",
          options: ["Preload yang menurun", "Afterload yang meningkat kronik", "Kontraktilitas yang menurun", "HR yang menurun"], answer: 1,
          explain: "Ventrikel harus menghasilkan tekanan lebih tinggi untuk ejeksi; sarkomer ditambah secara paralel → dinding menebal (hipertrofi konsentrik)." },
      ]},
    ],
  });
})();
