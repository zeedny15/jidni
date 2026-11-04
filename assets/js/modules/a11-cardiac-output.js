/* Modul A11 — Cardiac Output & Cardiac Reserve */
(function () {
  const fillFactor = (hr) => hr <= 140 ? 1 : 1 - Math.pow((hr - 140) / 60, 1.5) * 0.45;

  const VIZ = `<svg viewBox="0 0 420 250" role="img" aria-label="Cardiac output: jantung dan gelas ukur">
    <g id="co-heart" transform="translate(95 120)">
      <path d="M0,60 C-50,25 -70,-5 -60,-35 C-50,-62 -15,-62 0,-35 C15,-62 50,-62 60,-35 C70,-5 50,25 0,60 Z" fill="var(--primary)"/>
      <text class="svg-label" y="0" text-anchor="middle" style="fill:#fff">VKi</text>
    </g>
    <path id="co-pipe" d="M150,100 C200,60 240,60 280,95" fill="none" stroke="var(--o2-rich)" stroke-width="8" stroke-linecap="round" opacity=".5"/>
    <g class="co-drops"></g>
    <rect x="285" y="95" width="100" height="130" rx="10" fill="var(--surface)" stroke="var(--border)" stroke-width="2"/>
    <rect id="co-fill" x="288" y="222" width="94" height="0" rx="8" fill="var(--o2-rich)" opacity=".75"/>
    ${[1, 2, 3, 4, 5].map((l) => `<line x1="285" y1="${225 - l * 24}" x2="300" y2="${225 - l * 24}" stroke="var(--text-soft)"/><text class="svg-label small" x="390" y="${229 - l * 24}">${l} L</text>`).join("")}
    <text class="svg-label small" x="335" y="245" text-anchor="middle">darah terpompa</text>
    <g id="co-formula" class="svg-label" style="font-size:17px;font-weight:700">
      <text x="20" y="28">CO</text><text x="56" y="28">=</text>
      <text id="f-hr" x="76" y="28">HR</text><text x="112" y="28">×</text><text id="f-sv" x="132" y="28">SV</text>
    </g>
    <text id="co-sub" class="svg-label small" x="20" y="48"></text>
    <text id="co-time" class="svg-label small" x="335" y="88" text-anchor="middle"></text>
  </svg>`;

  const STEPS = [
    { title: "Cardiac output (CO)", body: "<b>Cardiac output</b> adalah volume darah yang dipompa <b>satu ventrikel</b> dalam <b>satu menit</b>. Saat istirahat pada dewasa ±<b>5 L/menit</b> — kira-kira seluruh volume darah tubuh berputar sekali tiap menit.", key: "Karena sirkuit seri (A1), CO ventrikel kanan = CO ventrikel kiri.", hl: [] },
    { title: "Heart rate (HR)", body: "<b>HR</b> = jumlah denyut per menit (normal 60–100). Ditentukan oleh SA node dan diatur saraf otonom (A6, A12).", key: "HR naik → lebih banyak “porsi” darah per menit.", hl: ["f-hr"] },
    { title: "Stroke volume (SV)", body: "<b>SV</b> = volume darah per denyut = <b>EDV − ESV</b> (dari A10: 130 − 60 ≈ 70 mL). Ditentukan oleh preload, kontraktilitas, dan afterload (A13).", key: "SV = “ukuran porsi” tiap denyut.", hl: ["f-sv"] },
    { title: "CO = HR × SV", body: "Contoh: 72 x/menit × 70 mL = 5.040 mL ≈ <b>5 L/menit</b>. Lihat gelas ukur terisi ±5 L dalam “satu menit” (dipercepat).", key: "CO bisa naik dengan menaikkan HR, SV, atau keduanya.", hl: ["f-hr", "f-sv"] },
    { title: "Cardiac index", body: "Orang bertubuh besar butuh CO lebih besar. Supaya adil dibandingkan, CO dibagi luas permukaan tubuh: <b>cardiac index (CI) = CO / BSA</b>, normal ±2,5–4 L/menit/m².", key: "CI menyesuaikan CO dengan ukuran tubuh.", hl: [] },
    { title: "Cardiac reserve", body: "<b>Cardiac reserve</b> = selisih CO maksimal dan CO istirahat. Orang sehat: 5 → 20–25 L/menit (cadangan ±4–5×). Atlet terlatih bisa mencapai 35 L/menit.", key: "Cadangan berasal dari HR reserve dan SV reserve.", hl: [] },
  ];

  registerModule({
    id: "a11",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Berapa banyak darah yang dipompa?", emoji: "💡", html: `
          <p>Semua yang kamu pelajari sejauh ini (listrik, kontraksi, katup) bermuara pada satu pertanyaan: <b>berapa banyak darah yang sampai ke jaringan tiap menit?</b> Jawabannya adalah <b>cardiac output</b>.</p>
          <div class="callout red"><p style="font-size:1.2rem;text-align:center"><b>CO = HR × SV</b></p></div>
          <ul class="key-points">
            <li><span class="k-ico">🔢</span><span><b>HR</b> — berapa kali jantung berdenyut per menit.</span></li>
            <li><span class="k-ico">🥤</span><span><b>SV</b> — berapa banyak darah per denyut.</span></li>
            <li><span class="k-ico">🔋</span><span><b>Cardiac reserve</b> — seberapa besar CO bisa ditingkatkan saat dibutuhkan.</span></li>
          </ul>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Membangun rumus CO", emoji: "🎬", intro: "Perhatikan jantung berdenyut dan gelas ukur yang terisi. Satu “menit” dipercepat menjadi 6 detik.",
          viz: VIZ, steps: STEPS, noPlay: false,
          onStep(i, s, api) { K.$$("#f-hr, #f-sv", api.viz).forEach((e) => { e.style.fill = s.hl.includes(e.id) ? K.css("--primary") : ""; }); },
          init(api, secEl) {
            const v = api.viz; const HR = 72, SV = 70;
            K.$("#co-sub", v).textContent = `= ${HR} x/menit × ${SV} mL ≈ ${(HR * SV / 1000).toFixed(1).replace(".", ",")} L/menit`;
            const fl = K.flow(K.$(".co-drops", v));
            fl.set([{ el: K.$("#co-pipe", v), color: K.css("--o2-rich"), n: 4, speed: 120, r: 5 }]);
            let t = 0;
            K.loop(secEl, (dt) => {
              t += dt; const minute = (t % 6) / 6;              // 6 detik = 1 menit
              const beat = (t * HR / 60 * 10) % 1;               // denyut dipercepat 10×
              K.$("#co-heart", v).setAttribute("transform", `translate(95 120) scale(${beat < .15 ? .88 : 1})`);
              const L = minute * HR * SV / 1000, h = Math.min(L / 5, 1.05) * 120;
              const f = K.$("#co-fill", v); f.setAttribute("height", h); f.setAttribute("y", 222 - h);
              K.$("#co-time", v).textContent = `detik ke-${Math.floor(minute * 60)} dari 60`;
              fl.tick(dt);
            });
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Bagaimana CO naik saat olahraga?", nodes: ["Otak & reseptor otot mendeteksi aktivitas → simpatis ↑, vagus ↓", "HR naik (SA node lebih cepat)", "Kontraktilitas naik → ESV turun", "Pompa otot & napas meningkatkan aliran balik vena → EDV naik", "SV naik + HR naik → CO bisa mencapai 4–5× nilai istirahat"] },
            { label: "Mengapa HR terlalu tinggi justru menurunkan CO?", nodes: ["Saat HR naik, yang memendek terutama diastol (A2, A10)", "Di atas ±150–180 x/menit, waktu pengisian ventrikel tidak cukup", "EDV turun drastis → SV turun", "Penurunan SV lebih besar dari kenaikan HR", "CO turun, dan suplai koroner pun berkurang"] },
            { label: "Mengapa atlet punya HR istirahat rendah?", nodes: ["Latihan membuat ventrikel lebih besar & kuat", "SV istirahat lebih besar (mis. 100 mL)", "Untuk CO 5 L/menit hanya perlu ±50 x/menit", "Tonus vagus juga meningkat", "HR istirahat rendah, tetapi cadangan HR untuk olahraga jadi lebih besar"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator CO = HR × SV", emoji: "🎚️", html: `
          <p>Ubah HR dan SV dengan slider. CO dihitung otomatis. Coba nyalakan <b>“batas pengisian”</b> lalu naikkan HR sangat tinggi.</p>
          <div class="slider-row"><label for="c-hr">Heart rate <output id="c-hr-o"></output></label><input type="range" id="c-hr" min="40" max="200" value="70"></div>
          <div class="slider-row"><label for="c-sv">Stroke volume (bila pengisian cukup) <output id="c-sv-o"></output></label><input type="range" id="c-sv" min="30" max="160" value="70"></div>
          <div class="toggle-row"><button class="btn btn-sm on" id="c-fill" type="button">⏱️ Batas pengisian: ON</button></div>
          <div class="btn-row" id="c-pre" style="margin-bottom:10px"></div>
          <div class="readouts">
            <div class="readout big"><span>Cardiac output</span><b id="c-co"></b></div>
            <div class="readout"><span>SV efektif</span><b id="c-sveff"></b></div>
            <div class="readout"><span>Cardiac index (BSA 1,7 m²)</span><b id="c-ci"></b></div>
          </div>
          <div class="bar-row"><div class="bar-label"><span>CO dibanding maksimum orang sehat (±25 L/menit)</span><b id="c-pct"></b></div><div class="bar"><span id="c-bar" style="background:var(--primary)"></span></div></div>
          <div class="callout" id="c-msg"></div>`,
          init(el) {
            const hr = K.$("#c-hr", el), sv = K.$("#c-sv", el); let lim = true;
            const PRE = [["😴 Tidur", 55, 70], ["😌 Istirahat", 70, 70], ["🏃 Olahraga berat", 185, 115], ["🏅 Atlet maksimal", 190, 160], ["🩸 Perdarahan", 120, 40], ["⚡ Takikardia 200", 200, 70]];
            K.$("#c-pre", el).innerHTML = PRE.map((p, i) => `<button class="btn btn-sm" data-i="${i}" type="button">${p[0]}</button>`).join("");
            K.$$("#c-pre button", el).forEach((b) => b.addEventListener("click", () => { const p = PRE[+b.dataset.i]; hr.value = p[1]; sv.value = p[2]; upd(); }));
            K.$("#c-fill", el).addEventListener("click", (e) => { lim = !lim; e.target.classList.toggle("on", lim); e.target.textContent = `⏱️ Batas pengisian: ${lim ? "ON" : "OFF"}`; upd(); });
            function upd() {
              const H = +hr.value, S = +sv.value, ff = lim ? fillFactor(H) : 1, Se = S * ff, CO = H * Se / 1000;
              K.$("#c-hr-o", el).textContent = H + " x/menit"; K.$("#c-sv-o", el).textContent = S + " mL";
              K.$("#c-co", el).innerHTML = `${CO.toFixed(1).replace(".", ",")}<small> L/menit</small>`;
              K.$("#c-sveff", el).innerHTML = `${Se.toFixed(0)}<small> mL</small>`;
              K.$("#c-ci", el).innerHTML = `${(CO / 1.7).toFixed(1).replace(".", ",")}<small> L/mnt/m²</small>`;
              const pct = Math.min(100, CO / 25 * 100); K.$("#c-pct", el).textContent = Math.round(pct) + "%"; K.$("#c-bar", el).style.width = pct + "%";
              const m = K.$("#c-msg", el);
              if (ff < .9) { m.className = "callout red"; m.innerHTML = `<p>HR sangat tinggi: waktu diastol tidak cukup → SV efektif turun ke ${Se.toFixed(0)} mL (${Math.round(ff * 100)}%). Tanpa batas ini CO akan ${(H * S / 1000).toFixed(1).replace(".", ",")} L/menit — kenyataannya tidak tercapai.</p>`; }
              else if (CO < 4) { m.className = "callout warn"; m.innerHTML = "<p>CO di bawah normal. Jaringan bisa kekurangan perfusi bila berlangsung lama — tubuh biasanya mengompensasi dengan menaikkan HR.</p>"; }
              else if (CO > 12) { m.className = "callout green"; m.innerHTML = "<p>CO tinggi — memakai <b>cardiac reserve</b>, seperti saat olahraga.</p>"; }
              else { m.className = "callout"; m.innerHTML = "<p>CO dalam kisaran istirahat–aktivitas ringan.</p>"; }
            }
            [hr, sv].forEach((s) => s.addEventListener("input", upd)); upd();
          } },
        { heading: "Membandingkan cardiac reserve", emoji: "📊", html: `
          <p>Pilih individu untuk melihat CO istirahat vs maksimal.</p>
          <div class="toggle-row" id="rv-btns"></div>
          <div id="rv-bars"></div>
          <div class="callout" id="rv-msg"></div>`,
          init(el) {
            const P = {
              normal: { n: "🧑 Dewasa sehat", rest: [72, 70], max: [190, 115], msg: "Cadangan ±4×: HR naik ±2,6× dan SV naik ±1,6×." },
              athlete: { n: "🏅 Atlet", rest: [50, 100], max: [190, 170], msg: "SV sangat besar → HR istirahat rendah dan CO maksimal sangat tinggi (cadangan ±6×)." },
              hf: { n: "💔 Gagal jantung", rest: [90, 50], max: [130, 55], msg: "CO istirahat mungkin masih cukup, tetapi cadangannya hampir habis → cepat lelah & sesak saat aktivitas ringan." },
              old: { n: "👴 Lansia sehat", rest: [70, 70], max: [150, 100], msg: "HR maksimal menurun dengan usia (±220 − usia) → cadangan lebih kecil." },
            };
            K.$("#rv-btns", el).innerHTML = Object.entries(P).map(([k, p]) => `<button class="btn btn-sm" data-k="${k}" type="button">${p.n}</button>`).join("");
            function show(k) {
              const p = P[k], r = p.rest[0] * p.rest[1] / 1000, m = p.max[0] * p.max[1] / 1000;
              K.$$("#rv-btns button", el).forEach((b) => b.classList.toggle("on", b.dataset.k === k));
              const row = (lbl, v, max, col, unit) => `<div class="bar-row"><div class="bar-label"><span>${lbl}</span><b>${v}${unit}</b></div><div class="bar"><span style="width:${Math.min(100, v / max * 100)}%;background:${col}"></span></div></div>`;
              K.$("#rv-bars", el).innerHTML = `<div class="two-col"><div><h3 style="font-size:1rem">Istirahat</h3>${row("HR", p.rest[0], 200, "var(--accent)", " x/mnt")}${row("SV", p.rest[1], 180, "var(--warn)", " mL")}${row("CO", r.toFixed(1), 32, "var(--primary)", " L/mnt")}</div>
                <div><h3 style="font-size:1rem">Maksimal</h3>${row("HR", p.max[0], 200, "var(--accent)", " x/mnt")}${row("SV", p.max[1], 180, "var(--warn)", " mL")}${row("CO", m.toFixed(1), 32, "var(--primary)", " L/mnt")}</div></div>
                <div class="readout big"><span>Cardiac reserve (maks − istirahat)</span><b>${(m - r).toFixed(1).replace(".", ",")}<small> L/menit</small></b></div>`;
              K.$("#rv-msg", el).innerHTML = `<p>${p.msg}</p>`;
            }
            K.$$("#rv-btns button", el).forEach((b) => b.addEventListener("click", () => show(b.dataset.k))); show("normal");
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika CO terganggu…", emoji: "🩺", intro: "Tanyakan: komponen mana yang turun — HR atau SV — dan bagaimana tubuh mengompensasi?",
          items: [
            { icon: "🩸", title: "Perdarahan (syok hipovolemik)", chain: ["Volume darah turun → aliran balik vena & EDV turun", "SV turun → CO turun → tekanan darah turun", "Baroreseptor memicu simpatis → HR naik (takikardia) untuk mempertahankan CO"] },
            { icon: "💔", title: "Gagal jantung", chain: ["Kontraktilitas menurun → SV kecil", "Tubuh menaikkan HR dan menahan cairan", "CO istirahat bisa dipertahankan, tetapi cardiac reserve sangat kecil → intoleransi aktivitas"] },
            { icon: "🐢", title: "Blok AV total", chain: ["Ventrikel hanya dipimpin pacemaker cadangan (±40 x/menit)", "Meski SV sedikit naik, HR terlalu rendah", "CO turun → lemas, pusing, pingsan"] },
            { icon: "⚡", title: "Takikardia supraventrikular (±200 x/menit)", chain: ["HR sangat tinggi", "Diastol sangat pendek → pengisian ventrikel tidak cukup", "SV & CO turun → pusing, hipotensi"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "HR 80 x/menit dan SV 60 mL. Berapa cardiac output-nya?",
          options: ["1,3 L/menit", "4,8 L/menit", "6,0 L/menit", "140 mL/menit"], answer: 1,
          explain: "CO = HR × SV = 80 × 60 mL = 4.800 mL/menit = 4,8 L/menit." },
        { q: "Mengapa CO bisa turun ketika HR mencapai ±200 x/menit?",
          options: ["Karena kontraktilitas otomatis menurun", "Karena diastol terlalu pendek sehingga pengisian ventrikel dan SV turun drastis", "Karena SA node kelelahan", "Karena tekanan aorta menjadi nol"], answer: 1,
          explain: "Peningkatan HR terutama memangkas diastol. Pada HR sangat tinggi, EDV turun begitu besar sehingga penurunan SV mengalahkan kenaikan HR." },
        { q: "Seorang atlet memiliki HR istirahat 48 x/menit dengan CO normal. Penjelasan yang paling tepat?",
          options: ["Atlet memiliki blok AV", "SV istirahatnya besar karena ventrikel lebih besar & kuat, ditambah tonus vagus tinggi", "CO atlet lebih rendah dari normal", "Jantung atlet tidak dipengaruhi saraf"], answer: 1,
          explain: "Dengan SV ±100 mL, cukup ±50 denyut/menit untuk CO 5 L/menit. Ini bradikardia fisiologis." },
        { q: "Cardiac reserve pada pasien gagal jantung umumnya…",
          options: ["Lebih besar dari orang sehat", "Sangat kecil, sehingga CO sulit dinaikkan saat aktivitas", "Sama dengan orang sehat", "Tidak dapat diukur"], answer: 1,
          explain: "Jantung yang lemah sudah memakai sebagian besar kapasitasnya saat istirahat. Kemampuan menaikkan SV & HR terbatas → cepat lelah dan sesak." },
        { q: "Pada perdarahan akut, takikardia yang muncul merupakan…",
          options: ["Penyebab utama turunnya CO", "Kompensasi untuk mempertahankan CO ketika SV turun", "Tanda jantung berhenti", "Efek langsung kehilangan sel darah merah pada SA node"], answer: 1,
          explain: "Volume darah turun → SV turun. Baroreseptor mendeteksi tekanan turun → simpatis menaikkan HR agar CO = HR × SV tetap terjaga." },
      ]},
    ],
  });
})();
