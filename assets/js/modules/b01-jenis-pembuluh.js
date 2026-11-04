/* Modul B1 — Jenis Pembuluh Darah */
(function () {
  // parameter potongan melintang (dalam px relatif): lumen, intima, media, adventitia
  const V = {
    aorta: { n: "Aorta (arteri elastik)", lumen: 46, intima: 3, media: 18, adv: 6, elastic: true, color: "--o2-rich" },
    musc: { n: "Arteri muskular", lumen: 24, intima: 2, media: 16, adv: 6, elastic: false, color: "--o2-rich" },
    arteriole: { n: "Arteriol", lumen: 8, intima: 1.5, media: 8, adv: 2, elastic: false, color: "--o2-rich" },
    cap: { n: "Kapiler", lumen: 5, intima: 1.5, media: 0, adv: 0, elastic: false, color: "--vein" },
    venule: { n: "Venula", lumen: 12, intima: 1.5, media: 2, adv: 2, elastic: false, color: "--o2-poor" },
    vein: { n: "Vena", lumen: 40, intima: 2, media: 5, adv: 8, elastic: false, valve: true, color: "--o2-poor", flat: true },
  };
  function cross(k) {
    const v = V[k], cx = 110, cy = 100, s = k === "cap" || k === "arteriole" ? 3 : 1;
    const r0 = v.lumen * s, r1 = r0 + v.intima * s, r2 = r1 + v.media * s, r3 = r2 + v.adv * s;
    const ry = v.flat ? .72 : 1;
    let g = "";
    if (v.adv) g += `<ellipse cx="${cx}" cy="${cy}" rx="${r3}" ry="${r3 * ry}" fill="#e9d8a6" stroke="var(--text-soft)" data-l="adv"/>`;
    if (v.media) g += `<ellipse cx="${cx}" cy="${cy}" rx="${r2}" ry="${r2 * ry}" fill="${v.elastic ? "#ffd8a8" : "#ffa8a8"}" stroke="var(--text-soft)" data-l="media"/>`;
    if (v.elastic) for (let r = r1 + 3; r < r2 - 1; r += 4) g += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * ry}" fill="none" stroke="#f08c00" stroke-width=".8"/>`;
    g += `<ellipse cx="${cx}" cy="${cy}" rx="${r1}" ry="${r1 * ry}" fill="#fff5f5" stroke="var(--primary)" stroke-width="1.5" data-l="intima"/>`;
    g += `<ellipse cx="${cx}" cy="${cy}" rx="${r0}" ry="${r0 * ry}" fill="var(${v.color})" opacity=".55"/>`;
    if (v.valve) g += `<path d="M${cx - r0 + 4},${cy + 8} Q${cx},${cy - 20} ${cx + r0 - 4},${cy + 8}" fill="none" stroke="var(--text)" stroke-width="2.5"/>`;
    if (k === "cap") g += `<text class="svg-label small" x="${cx}" y="${cy + 4}" text-anchor="middle">🔴</text>`;
    const lbl = [];
    if (v.adv) lbl.push(["Adventisia", r3]);
    if (v.media) lbl.push([v.elastic ? "Media (kaya elastin)" : "Media (otot polos)", r2 - v.media * s / 2]);
    lbl.push(["Intima (endotel)", r1]);
    return g + lbl.map(([t, r], i) => `<line x1="${cx + r * .72}" y1="${cy - r * .72 * ry}" x2="232" y2="${36 + i * 28}" stroke="var(--text-soft)"/><text class="svg-label small" x="236" y="${40 + i * 28}">${t}</text>`).join("") +
      `<text class="svg-label" x="${cx}" y="196" text-anchor="middle" style="font-size:12px">${v.n}${s > 1 ? " (diperbesar 3×)" : ""}</text>`;
  }

  const TREE = `<svg viewBox="0 0 420 90" role="img" aria-label="Urutan pembuluh darah">
    <path id="tree" d="M10,45 H410" fill="none"/>
    ${[["aorta", 10, 70, 22, "--o2-rich"], ["musc", 70, 140, 14, "--o2-rich"], ["arteriole", 140, 200, 7, "--o2-rich"], ["cap", 200, 250, 3, "--vein"], ["venule", 250, 300, 8, "--o2-poor"], ["vein", 300, 410, 20, "--o2-poor"]]
      .map(([k, a, b, w, c]) => `<line class="tseg" data-k="${k}" data-info="${k}" x1="${a}" y1="45" x2="${b}" y2="45" stroke="var(${c})" stroke-width="${w}" stroke-linecap="butt"/>`).join("")}
    <g class="svg-label small" style="font-size:9.5px">
      <text x="40" y="84" text-anchor="middle">Aorta</text><text x="105" y="84" text-anchor="middle">Arteri</text><text x="170" y="84" text-anchor="middle">Arteriol</text>
      <text x="225" y="84" text-anchor="middle">Kapiler</text><text x="275" y="84" text-anchor="middle">Venula</text><text x="355" y="84" text-anchor="middle">Vena</text>
    </g>
    <text class="svg-label small" x="10" y="14">dari jantung →</text><text class="svg-label small" x="410" y="14" text-anchor="end">→ kembali ke jantung</text>
    <g class="flow-layer"></g>
  </svg>`;

  const STEPS = [
    { title: "Tiga lapisan dinding", body: "Hampir semua pembuluh punya 3 lapisan: <b>tunika intima</b> (endotel licin), <b>tunika media</b> (otot polos & serat elastin), dan <b>tunika adventisia</b> (jaringan ikat). Ketebalan tiap lapisan berbeda sesuai tugasnya.", key: "Bentuk mengikuti fungsi.", k: "musc" },
    { title: "Aorta & arteri besar: arteri elastik", body: "Media kaya <b>serat elastin</b>. Saat sistol, dinding meregang menampung darah; saat diastol dinding mengerut kembali dan terus mendorong darah. Disebut <b>pembuluh penampung tekanan</b>.", key: "Inilah yang membuat aliran tetap berjalan saat diastol (efek Windkessel).", k: "aorta" },
    { title: "Arteri muskular: distribusi", body: "Contoh: a. femoralis, a. radialis, a. koroner. Media didominasi <b>otot polos</b> tebal. Tugasnya <b>mendistribusikan</b> darah ke organ-organ.", key: "Pembuluh distribusi.", k: "musc" },
    { title: "Arteriol: keran pengatur", body: "Diameter kecil, tetapi dinding ototnya relatif tebal terhadap lumennya. Dengan berkontraksi atau berelaksasi, arteriol mengatur <b>berapa banyak darah masuk ke kapiler</b> dan menjadi tempat <b>resistensi terbesar</b>.", key: "Pembuluh resistensi — kunci pengaturan tekanan darah (B4, B6).", k: "arteriole" },
    { title: "Kapiler: tempat pertukaran", body: "Dinding hanya <b>satu lapis endotel</b> + membran basal; diameter ±5–10 µm, cukup untuk eritrosit lewat satu per satu. O₂, nutrien, CO₂, dan sisa metabolisme berpindah di sini.", key: "Pembuluh pertukaran. Jenis: kontinu, fenestrata, sinusoid.", k: "cap" },
    { title: "Venula: pengumpul", body: "Kapiler bergabung menjadi venula. Dindingnya tipis; venula pascakapiler juga ikut pertukaran zat dan menjadi tempat utama sel radang keluar dari pembuluh.", key: "Saat peradangan, kebocoran cairan banyak terjadi di venula.", k: "venule" },
    { title: "Vena: penampung volume", body: "Dinding tipis, lumen lebar dan mudah melebar, serta punya <b>katup</b> (terutama di tungkai) agar darah tidak mengalir balik. Sekitar <b>60–70% volume darah</b> berada di vena.", key: "Pembuluh kapasitans (reservoir darah).", k: "vein" },
    { title: "Satu perjalanan utuh", body: "Aorta → arteri → arteriol → kapiler → venula → vena → jantung. Lihat ketebalan garis: lumen menyempit di arteriol & kapiler, lalu melebar lagi di vena.", key: "Tiap pembuluh punya “pekerjaan” yang berbeda.", k: "aorta", all: true },
  ];

  registerModule({
    id: "b01",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Jalan raya darah", emoji: "💡", html: `
          <p>Jantung (A1–A13) adalah pompanya. Sekarang kita lihat <b>pipanya</b>. Pembuluh darah bukan pipa pasif — tiap jenis punya struktur khusus sesuai tugasnya.</p>
          <ul class="key-points">
            <li><span class="k-ico">🛣️</span><span><b>Arteri</b> — jalan tol berdinding tebal & bertekanan tinggi, dari jantung.</span></li>
            <li><span class="k-ico">🚦</span><span><b>Arteriol</b> — lampu lalu lintas: mengatur aliran ke tiap jaringan.</span></li>
            <li><span class="k-ico">🏘️</span><span><b>Kapiler</b> — gang kecil tempat “bongkar muat” zat.</span></li>
            <li><span class="k-ico">🅿️</span><span><b>Vena</b> — jalan pulang sekaligus “tempat parkir” sebagian besar darah.</span></li>
          </ul>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Dari aorta sampai vena", emoji: "🔬", intro: "Atas: urutan pembuluh (klik untuk melompat). Bawah: potongan melintang pembuluh yang sedang dibahas.",
          viz: TREE + `<svg id="xsec" viewBox="0 0 420 205" role="img" aria-label="Potongan melintang pembuluh"></svg>`,
          steps: STEPS,
          info: Object.fromEntries(Object.entries(V).map(([k, v]) => [k, [v.n, "Lihat potongan melintangnya di bawah."]])),
          onInfo(k, api) { const j = STEPS.findIndex((s, n) => n > 0 && s.k === k); if (j >= 0) { api.stop(); api.go(j); } },
          onStep(i, s, api) {
            K.$("#xsec", api.viz).innerHTML = cross(s.k);
            K.$$(".tseg", api.viz).forEach((l) => l.style.opacity = s.all || l.dataset.k === s.k ? 1 : .25);
          },
          init(api, secEl) {
            const fl = K.flow(K.$(".flow-layer", api.viz));
            fl.set([{ el: K.$("#tree", api.viz), color: (f) => K.mixHex(K.css("--o2-rich"), K.css("--o2-poor"), K.clamp((f - .5) / .15, 0, 1)), n: 10, speed: 60, r: 3.5 }]);
            K.loop(secEl, (dt) => fl.tick(dt));
          } },
        { heading: "Tiga jenis kapiler", emoji: "🧪", html: `
          <div class="segmented" id="cap-tabs"><button type="button" class="on" data-c="k">Kontinu</button><button type="button" data-c="f">Fenestrata</button><button type="button" data-c="s">Sinusoid</button></div>
          <div class="two-col" style="margin-top:12px"><div class="viz-wrap"><svg id="cap-svg" style="max-width:360px;margin:auto" viewBox="0 0 260 120" role="img" aria-label="Jenis kapiler"></svg></div><div id="cap-text"></div></div>`,
          init(el) {
            const C = {
              k: { t: "<b>Kontinu</b> — endotel rapat, hanya celah antarsel yang kecil. Ada di otot, kulit, paru, dan <b>otak</b> (sawar darah-otak, sambungannya sangat rapat).", holes: 0, gap: 2, bm: true },
              f: { t: "<b>Fenestrata</b> — endotel berlubang-lubang (“jendela”) → pertukaran cairan sangat cepat. Ada di <b>glomerulus ginjal</b>, usus, kelenjar endokrin.", holes: 6, gap: 2, bm: true },
              s: { t: "<b>Sinusoid</b> — lumen lebar, celah besar, membran basal tidak utuh → bahkan protein & sel bisa lewat. Ada di <b>hati, limpa, sumsum tulang</b>.", holes: 0, gap: 14, bm: false },
            };
            function show(k) {
              const c = C[k];
              K.$$("#cap-tabs button", el).forEach((b) => b.classList.toggle("on", b.dataset.c === k));
              let s = `<rect x="0" y="40" width="260" height="40" fill="var(--o2-rich)" opacity=".15"/><text class="svg-label small" x="130" y="64" text-anchor="middle">lumen kapiler</text>`;
              for (let x = 0; x < 260; x += 65) {
                [28, 80].forEach((y) => {
                  s += `<rect x="${x + c.gap / 2}" y="${y}" width="${65 - c.gap}" height="12" rx="4" fill="var(--primary-soft)" stroke="var(--primary)"/>`;
                  for (let h = 0; h < c.holes / 2; h++) s += `<rect x="${x + 14 + h * 18}" y="${y}" width="6" height="12" fill="var(--surface-2)"/>`;
                });
              }
              if (c.bm) s += `<line x1="0" y1="25" x2="260" y2="25" stroke="var(--text-soft)" stroke-width="2"/><line x1="0" y1="95" x2="260" y2="95" stroke="var(--text-soft)" stroke-width="2"/><text class="svg-label small" x="4" y="18">membran basal</text>`;
              K.$("#cap-svg", el).innerHTML = s; K.$("#cap-text", el).innerHTML = `<p>${c.t}</p>`;
            }
            K.$$("#cap-tabs button", el).forEach((b) => b.addEventListener("click", () => show(b.dataset.c))); show("k");
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa aorta harus elastis?", nodes: ["Jantung memompa secara terputus-putus (hanya saat sistol)", "Saat sistol, aorta meregang dan menyimpan sebagian energi tekanan", "Saat diastol, dinding elastis mengerut kembali (recoil)", "Recoil terus mendorong darah ke perifer", "Aliran ke jaringan tetap kontinu, dan tekanan diastolik tidak jatuh ke 0"] },
            { label: "Mengapa arteriol menjadi pengatur aliran?", nodes: ["Arteriol memiliki otot polos tebal relatif terhadap lumennya", "Saraf, hormon, dan zat lokal dapat mengubah tonus otot ini", "Perubahan diameter kecil → perubahan resistensi besar (∝ 1/r⁴, B4)", "Aliran ke tiap jaringan dapat diatur sesuai kebutuhan", "Sekaligus menentukan resistensi perifer total → tekanan darah"] },
            { label: "Mengapa vena menampung banyak darah?", nodes: ["Dinding vena tipis dengan sedikit otot & elastin", "Vena sangat lentur (compliance tinggi)", "Sedikit kenaikan tekanan saja sudah menambah banyak volume", "±60–70% volume darah berada di vena", "Venokonstriksi dapat “memindahkan” darah cadangan ini ke jantung (B5)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Tebak pembuluh dari potongan melintangnya", emoji: "🎯", html: `
          <p>Perhatikan ketebalan dinding, lumen, dan ciri khasnya. Pembuluh apakah ini?</p>
          <div class="viz-wrap"><svg id="g-svg" viewBox="0 0 420 205" role="img" aria-label="Potongan melintang misteri"></svg></div>
          <div class="toggle-row" id="g-opts"></div>
          <div id="g-msg"></div>
          <div class="btn-row"><button class="btn btn-sm" id="g-next" type="button">Soal lain ↻</button><span class="small muted" id="g-score"></span></div>`,
          init(el) {
            const keys = Object.keys(V); let cur, score = 0, n = 0, answered = false;
            const HINT = { aorta: "Dinding sangat tebal dengan banyak lapisan elastin bergelombang.", musc: "Media otot polos tebal, lumen bulat.", arteriole: "Kecil, tetapi dinding otot relatif tebal dibanding lumennya.", cap: "Hanya satu lapis endotel, muat satu eritrosit.", venule: "Kecil dengan dinding sangat tipis.", vein: "Lumen lebar & pipih, dinding tipis, ada katup." };
            K.$("#g-opts", el).innerHTML = keys.map((k) => `<button class="btn btn-sm" data-k="${k}" type="button">${V[k].n.split(" (")[0]}</button>`).join("");
            function next() {
              cur = keys[Math.floor(Math.random() * keys.length)]; answered = false;
              K.$("#g-svg", el).innerHTML = cross(cur).replace(/<text class="svg-label" x="110" y="196"[^<]*<\/text>/, "");
              K.$("#g-msg", el).innerHTML = ""; K.$$("#g-opts button", el).forEach((b) => b.classList.remove("on"));
            }
            K.$$("#g-opts button", el).forEach((b) => b.addEventListener("click", () => {
              if (answered) return; answered = true; n++;
              const ok = b.dataset.k === cur; if (ok) score++;
              b.classList.add("on");
              K.$("#g-msg", el).innerHTML = `<div class="callout ${ok ? "green" : "red"}"><p><b>${ok ? "✅ Tepat!" : `❌ Ini adalah ${V[cur].n}.`}</b> ${HINT[cur]}</p></div>`;
              K.$("#g-score", el).textContent = `Skor: ${score}/${n}`;
            }));
            K.$("#g-next", el).addEventListener("click", next); next();
          } },
        { type: "match", heading: "Cocokkan julukan fungsional", emoji: "🧩", intro: "Ketuk pembuluh di kiri, lalu julukan fungsinya di kanan.",
          pairs: [["Aorta & arteri elastik", "Penampung tekanan (pressure reservoir)"], ["Arteri muskular", "Pembuluh distribusi"], ["Arteriol", "Pembuluh resistensi"], ["Kapiler", "Pembuluh pertukaran"], ["Vena", "Pembuluh kapasitans (penampung volume)"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika strukturnya rusak…", emoji: "🩺", intro: "Hubungkan lapisan yang rusak dengan fungsi yang hilang.",
          items: [
            { icon: "🎈", title: "Aneurisma aorta", chain: ["Serat elastin & otot di media melemah", "Dinding tidak mampu menahan tekanan tinggi", "Aorta menggelembung; risiko pecah"] },
            { icon: "🧈", title: "Aterosklerosis", chain: ["Lemak & sel radang menumpuk di tunika intima arteri", "Lumen menyempit dan dinding kaku", "Aliran ke organ berkurang (mis. angina, stroke)"] },
            { icon: "🦵", title: "Varises", chain: ["Katup vena tungkai tidak menutup sempurna", "Darah mengalir balik dan menumpuk", "Vena melebar & berkelok; tungkai terasa berat dan bengkak"] },
            { icon: "🔥", title: "Peradangan", chain: ["Mediator radang (histamin dll.) bekerja pada venula", "Celah antarsel endotel melebar", "Cairan & protein keluar → bengkak (edema) lokal"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Mengapa tekanan darah tidak turun ke 0 mmHg saat diastol?",
          options: ["Karena vena terus memompa", "Karena dinding arteri elastis mengerut kembali dan terus mendorong darah", "Karena kapiler menutup", "Karena katup aorta tetap terbuka"], answer: 1,
          explain: "Aorta & arteri besar menyimpan energi saat sistol dengan meregang, lalu mengembalikannya saat diastol (recoil). Ini menjaga tekanan diastolik ±80 mmHg." },
        { q: "Pembuluh mana yang paling berperan mengatur distribusi aliran darah ke berbagai organ?",
          options: ["Aorta", "Arteriol", "Kapiler", "Vena besar"], answer: 1,
          explain: "Arteriol memiliki otot polos yang tonusnya dapat diubah. Karena resistensi ∝ 1/r⁴, sedikit perubahan diameter sangat memengaruhi aliran." },
        { q: "Mengapa pertukaran zat terjadi di kapiler, bukan di arteri?",
          options: ["Karena kapiler bertekanan paling tinggi", "Karena dinding kapiler hanya satu lapis endotel dan luas permukaannya sangat besar", "Karena darah di kapiler mengalir paling cepat", "Karena kapiler memiliki otot polos"], answer: 1,
          explain: "Dinding tipis (jarak difusi pendek), luas permukaan total sangat besar, dan aliran yang lambat membuat kapiler ideal untuk pertukaran." },
        { q: "Sebagian besar volume darah pada saat tertentu berada di…",
          options: ["Arteri", "Kapiler", "Vena", "Jantung"], answer: 2,
          explain: "Vena menampung ±60–70% volume darah karena dindingnya tipis dan sangat lentur (compliance tinggi)." },
        { q: "Kapiler jenis apa yang paling cocok untuk organ yang perlu menyaring cairan sangat banyak, seperti glomerulus ginjal?",
          options: ["Kontinu", "Fenestrata", "Tidak ada kapiler di ginjal", "Kapiler dengan otot polos tebal"], answer: 1,
          explain: "Fenestra (lubang di endotel) membuat permeabilitas terhadap air & zat terlarut kecil sangat tinggi — ideal untuk filtrasi glomerulus." },
      ]},
    ],
  });
})();
