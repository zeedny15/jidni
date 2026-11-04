/* Modul A10 — Siklus Jantung & Diagram Wiggers */
(function () {
  const C = 800;
  const P_LV = [[0, 6], [60, 8], [100, 10], [110, 12], [160, 82], [230, 120], [270, 118], [380, 96], [420, 40], [460, 6], [480, 3], [580, 4], [800, 6]];
  const P_AO = [[0, 84], [110, 81], [160, 80], [230, 118], [270, 117], [380, 98], [388, 93], [402, 99], [460, 96], [800, 85]];
  const P_LA = [[0, 6], [60, 10], [110, 7], [130, 9], [170, 4], [380, 12], [460, 14], [520, 6], [580, 5], [800, 6]];
  const V_LV = [[0, 110], [100, 130], [160, 130], [270, 75], [380, 60], [460, 60], [580, 100], [800, 110]];
  const lv = (t) => K.keys(P_LV, t), ao = (t) => K.keys(P_AO, t), la = (t) => K.keys(P_LA, t), vol = (t) => K.keys(V_LV, t);
  const gs = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
  const ecg = (t) => 0.15 * gs(t, 40, 16) - 0.12 * gs(t, 96, 5) + gs(t, 110, 7) - 0.25 * gs(t, 125, 6) + 0.3 * gs(t, 340, 35);
  const phono = (t) => { const n = (c, w, a) => a * gs(t, c, w) * Math.sin((t - c) * 0.9); return n(118, 10, 1) + n(388, 7, .8); };

  const PH = [
    { id: "a", n: 1, name: "Sistol atrium", w: [0, 110], mit: true, aor: false },
    { id: "b", n: 2, name: "Kontraksi isovolumetrik", w: [110, 160], mit: false, aor: false },
    { id: "c", n: 3, name: "Ejeksi cepat", w: [160, 270], mit: false, aor: true },
    { id: "d", n: 4, name: "Ejeksi lambat", w: [270, 380], mit: false, aor: true },
    { id: "e", n: 5, name: "Relaksasi isovolumetrik", w: [380, 460], mit: false, aor: false },
    { id: "f", n: 6, name: "Pengisian cepat", w: [460, 580], mit: true, aor: false },
    { id: "g", n: 7, name: "Diastasis (pengisian lambat)", w: [580, 800], mit: true, aor: false },
  ];
  const phaseAt = (t) => PH.find((p) => t >= p.w[0] && t < p.w[1]) || PH[6];

  const X = (t) => 46 + t / C * 364;
  const YP = (p) => 200 - p / 130 * 180, YV = (v) => 290 - (v - 50) / 90 * 70, YE = (v) => 340 - v * 34, YS = (v) => 378 - v * 16;

  function wiggersMarkup(uid) {
    const bands = PH.map((p, i) => `<rect class="wg-band" data-info="${p.id}" data-ph="${p.id}" x="${X(p.w[0])}" y="14" width="${X(p.w[1]) - X(p.w[0])}" height="386" fill="${i % 2 ? "var(--surface)" : "var(--surface-2)"}" style="cursor:pointer"/>
      <text class="svg-label small" x="${(X(p.w[0]) + X(p.w[1])) / 2}" y="12" text-anchor="middle" style="font-weight:700">${p.n}</text>`).join("");
    return `<svg class="wg" viewBox="0 0 420 405" role="img" aria-label="Diagram Wiggers">
      ${bands}
      <g style="pointer-events:none">
        <line class="svg-axis" x1="46" y1="20" x2="46" y2="200"/>
        <g class="svg-label small" style="font-size:9.5px"><text x="42" y="${YP(120) + 3}" text-anchor="end">120</text><text x="42" y="${YP(80) + 3}" text-anchor="end">80</text><text x="42" y="${YP(40) + 3}" text-anchor="end">40</text><text x="42" y="${YP(0) + 3}" text-anchor="end">0</text>
          <text x="42" y="${YV(130) + 3}" text-anchor="end">130</text><text x="42" y="${YV(60) + 3}" text-anchor="end">60</text></g>
        <text class="svg-label small" x="8" y="110" transform="rotate(-90 8 110)" text-anchor="middle">Tekanan (mmHg)</text>
        <text class="svg-label small" x="8" y="255" transform="rotate(-90 8 255)" text-anchor="middle">Volume VKi</text>
        <path class="w-ao" fill="none" stroke="var(--o2-rich)" stroke-width="2.5"/>
        <path class="w-lv" fill="none" stroke="var(--text)" stroke-width="2.5"/>
        <path class="w-la" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
        <path class="w-vol" fill="none" stroke="var(--warn)" stroke-width="2.5"/>
        <path class="w-ecg" fill="none" stroke="var(--primary)" stroke-width="2"/>
        <path class="w-pho" fill="none" stroke="var(--text-soft)" stroke-width="1.4"/>
        <text class="svg-label small" x="410" y="${YP(90)}" text-anchor="end" style="fill:var(--o2-rich)">Aorta</text>
        <text class="svg-label small" x="${X(250)}" y="${YP(126)}" text-anchor="middle">Ventrikel kiri</text>
        <text class="svg-label small" x="410" y="${YP(18)}" text-anchor="end" style="fill:var(--accent)">Atrium kiri</text>
        <text class="svg-label small" x="410" y="${YV(118)}" text-anchor="end" style="fill:var(--warn)">Volume VKi</text>
        <text class="svg-label small" x="410" y="${YE(.5)}" text-anchor="end" style="fill:var(--primary)">EKG</text>
        <text class="svg-label small" x="410" y="${YS(.9)}" text-anchor="end">Bunyi</text>
        <text class="svg-label small" x="${X(118)}" y="398" text-anchor="middle" style="font-weight:700">S1</text><text class="svg-label small" x="${X(388)}" y="398" text-anchor="middle" style="font-weight:700">S2</text>
        <g class="svg-label small" style="font-size:9.5px">
          <text x="${X(110)}" y="${YP(20)}" text-anchor="middle">▲MC</text><text x="${X(160)}" y="${YP(70)}" text-anchor="end">AO▲</text>
          <text x="${X(384)}" y="${YP(108)}" text-anchor="start">▲AC</text><text x="${X(460)}" y="${YP(24)}" text-anchor="middle">MO▲</text>
        </g>
        <line class="w-cur" y1="14" y2="400" stroke="var(--accent)" stroke-width="2"/>
        <circle class="w-dot-lv" r="4.5" fill="var(--text)"/><circle class="w-dot-ao" r="4.5" fill="var(--o2-rich)"/><circle class="w-dot-la" r="4.5" fill="var(--accent)"/><circle class="w-dot-v" r="4.5" fill="var(--warn)"/>
      </g>
    </svg>`;
  }
  function drawWiggers(svg) {
    K.$(".w-ao", svg).setAttribute("d", K.plot(ao, 0, C, X, YP, 400));
    K.$(".w-lv", svg).setAttribute("d", K.plot(lv, 0, C, X, YP, 400));
    K.$(".w-la", svg).setAttribute("d", K.plot(la, 0, C, X, YP, 400));
    K.$(".w-vol", svg).setAttribute("d", K.plot(vol, 0, C, X, YV, 400));
    K.$(".w-ecg", svg).setAttribute("d", K.plot(ecg, 0, C, X, YE, 500));
    K.$(".w-pho", svg).setAttribute("d", K.plot(phono, 0, C, X, YS, 600));
  }
  function cursorWiggers(svg, t, hl) {
    const c = K.$(".w-cur", svg); c.setAttribute("x1", X(t)); c.setAttribute("x2", X(t));
    [["lv", lv, YP], ["ao", ao, YP], ["la", la, YP], ["v", vol, YV]].forEach(([k, f, Y]) => { const d = K.$(".w-dot-" + k, svg); d.setAttribute("cx", X(t)); d.setAttribute("cy", Y(f(t))); });
    if (hl !== undefined) K.$$(".wg-band", svg).forEach((b, i) => { b.style.fill = b.dataset.ph === hl ? "var(--warn-soft)" : (i % 2 ? "var(--surface)" : "var(--surface-2)"); });
  }

  /* Jantung kiri skematis */
  const LH = `<svg class="lh" viewBox="0 0 200 230" role="img" aria-label="Jantung kiri skematis" style="max-width:240px;margin:auto">
      <rect x="125" y="0" width="44" height="95" rx="8" fill="var(--o2-rich)" opacity=".55"/><text class="svg-label small" x="147" y="14" text-anchor="middle">Aorta</text><text class="svg-label small" x="174" y="100" style="font-size:10px">katup aorta</text>
      <rect class="lh-la" x="14" y="22" width="96" height="62" rx="16" fill="var(--o2-rich)" opacity=".7"/><text class="svg-label small" x="62" y="56" text-anchor="middle" style="fill:#fff">Atrium kiri</text>
      <ellipse class="lh-lv" cx="100" cy="160" rx="60" ry="55" fill="var(--o2-rich)"/>
      <text class="svg-label small" x="100" y="164" text-anchor="middle" style="fill:#fff">Ventrikel kiri</text>
      <g class="lh-v" data-v="mit"><line x1="38" y1="92" x2="62" y2="92"/><line x1="86" y1="92" x2="62" y2="92"/></g>
      <g class="lh-v" data-v="aor"><line x1="125" y1="96" x2="147" y2="96"/><line x1="169" y1="96" x2="147" y2="96"/></g>
      <text class="svg-label small lh-mt" x="4" y="100" style="display:none"></text><text class="svg-label small lh-at" x="196" y="110" text-anchor="end" style="display:none"></text><text class="svg-label small" x="62" y="104" text-anchor="middle" style="font-size:10px">mitral</text><text class="svg-label small" x="190" y="92" text-anchor="start" style="font-size:10px"></text>
    </svg>`;
  function drawHeart(svg, t) {
    const V = vol(t), p = phaseAt(t);
    const e = K.$(".lh-lv", svg);
    e.setAttribute("rx", 34 + (V - 60) * 0.42); e.setAttribute("ry", 36 + (V - 60) * 0.33);
    e.setAttribute("cy", 96 + 36 + (V - 60) * 0.33);
    const la_ = K.$(".lh-la", svg); const sq = p.id === "a" ? 6 * Math.sin((t / 110) * Math.PI) : 0;
    la_.setAttribute("x", 14 + sq); la_.setAttribute("width", 96 - 2 * sq);
    K.$$(".lh-v", svg).forEach((g) => {
      const open = g.dataset.v === "mit" ? p.mit : p.aor;
      const [l, r] = K.$$("line", g);
      if (!g.dataset.xm) { g.dataset.x1 = l.getAttribute("x1"); g.dataset.xm = l.getAttribute("x2"); g.dataset.y = l.getAttribute("y1"); }
      const x1 = +g.dataset.x1, xm = +g.dataset.xm, y = +g.dataset.y, sh = open ? (xm - x1) * .3 : 0;
      const dy = open ? (g.dataset.v === "mit" ? 18 : -16) : 0;
      l.setAttribute("x2", xm - sh); l.setAttribute("y2", y + dy); r.setAttribute("x2", xm + sh); r.setAttribute("y2", y + dy);
      g.style.stroke = open ? K.css("--ok") : K.css("--text");
    });
    K.$(".lh-mt", svg).textContent = p.mit ? "mitral buka" : "mitral tutup";
    K.$(".lh-at", svg).textContent = p.aor ? "aorta buka" : "aorta tutup";
  }
  function compareText(t) {
    const L = lv(t), A = ao(t), Aa = la(t);
    const f = (v) => v.toFixed(0);
    const p = phaseAt(t);
    const OPEN = (n) => `<b style="color:var(--ok)">${n} TERBUKA</b>`, SHUT = (n) => `<b>${n} TERTUTUP</b>`;
    const mit = p.mit
      ? `P<sub>AKi</sub> ${f(Aa)} ${Aa >= L ? "&gt;" : "≈"} P<sub>VKi</sub> ${f(L)} → ${OPEN("mitral")}`
      : `P<sub>VKi</sub> ${f(L)} ${L > Aa ? "&gt;" : "≈"} P<sub>AKi</sub> ${f(Aa)} → ${SHUT("mitral")}`;
    const aor = p.aor
      ? (L >= A ? `P<sub>VKi</sub> ${f(L)} ≥ P<sub>aorta</sub> ${f(A)} → ${OPEN("aorta")}` : `P<sub>VKi</sub> ${f(L)} sedikit &lt; P<sub>aorta</sub> ${f(A)}, darah tetap mengalir karena momentum → ${OPEN("aorta")}`)
      : (L < A ? `P<sub>aorta</sub> ${f(A)} &gt; P<sub>VKi</sub> ${f(L)} → ${SHUT("aorta")}` : `P<sub>VKi</sub> ${f(L)} baru menyamai P<sub>aorta</sub> ${f(A)} → katup aorta akan terbuka`);
    return `${mit}<br>${aor}<br>Volume VKi: <b>${vol(t).toFixed(0)} mL</b>`;
  }

  const STEPS = [
    { title: "Cara membaca Diagram Wiggers", body: "Semua garis memakai <b>sumbu waktu yang sama</b> (satu denyut ±0,8 s). Atas: tekanan <span style='color:var(--o2-rich)'>aorta</span>, ventrikel kiri, <span style='color:var(--accent)'>atrium kiri</span>. Tengah: <span style='color:var(--warn)'>volume VKi</span>. Bawah: EKG & bunyi jantung. Angka 1–7 = fase.", key: "Aturan emas: katup membuka/menutup karena PERBEDAAN TEKANAN di kedua sisinya.", ph: null },
    { title: "1. Sistol atrium", body: "Setelah gelombang P, atrium berkontraksi → tekanan atrium naik sedikit (<b>gelombang a</b>). Mitral masih terbuka, sehingga ±10–20% darah terakhir masuk ke ventrikel. Volume VKi mencapai maksimum = <b>EDV ±130 mL</b>.", key: "Pada istirahat, sebagian besar pengisian sudah terjadi sebelum atrium berkontraksi.", ph: "a" },
    { title: "2. Kontraksi isovolumetrik", body: "Setelah QRS, ventrikel berkontraksi. Tekanan VKi segera melampaui atrium → <b>mitral menutup (S1)</b>. Tetapi tekanan VKi belum melampaui aorta → katup aorta masih tertutup. <b>Semua katup tertutup</b>: tekanan naik sangat cepat, volume tetap.", key: "Iso-volumetrik = volume sama. Tekanan naik, darah belum keluar.", ph: "b" },
    { title: "3. Ejeksi cepat", body: "Begitu P<sub>VKi</sub> &gt; P<sub>aorta</sub> (±80 mmHg) → <b>katup aorta terbuka</b>. Darah menyembur keluar; tekanan aorta naik mengikuti VKi hingga ±120 mmHg. Volume VKi turun drastis.", key: "Tekanan sistolik aorta = puncak kurva ini.", ph: "c" },
    { title: "4. Ejeksi lambat", body: "Kontraksi melemah (repolarisasi, gelombang T). Tekanan VKi mulai turun sedikit di bawah aorta, tetapi darah masih mengalir karena momentum. Volume VKi mencapai minimum = <b>ESV ±60 mL</b>.", key: "SV = EDV − ESV ≈ 70 mL; EF = SV/EDV ≈ 55%.", ph: "d" },
    { title: "5. Relaksasi isovolumetrik", body: "Ventrikel relaksasi → P<sub>VKi</sub> turun di bawah aorta → <b>katup aorta menutup (S2)</b>. Darah yang memantul di katup membuat lekukan kecil (<b>insisura/dicrotic notch</b>). Mitral belum terbuka → <b>semua katup tertutup</b>, volume tetap, tekanan turun cepat.", key: "Sementara itu atrium terus terisi → tekanan atrium naik (gelombang v).", ph: "e" },
    { title: "6. Pengisian cepat", body: "Saat P<sub>VKi</sub> turun di bawah P<sub>atrium</sub> → <b>mitral terbuka</b>. Darah yang “menumpuk” di atrium mengalir deras ke ventrikel. Volume VKi naik cepat; tekanan atrium turun (y descent).", key: "Sebagian besar pengisian ventrikel terjadi di fase ini — pasif, tanpa kontraksi atrium.", ph: "f" },
    { title: "7. Diastasis", body: "Pengisian melambat karena tekanan atrium dan ventrikel hampir sama. Darah dari vena pulmonalis mengalir pelan melalui atrium ke ventrikel. Lalu gelombang P berikutnya muncul… dan siklus berulang.", key: "Saat HR tinggi, fase inilah yang pertama memendek/hilang.", ph: "g" },
  ];

  registerModule({
    id: "a10",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Satu denyut, banyak peristiwa", emoji: "💡", html: `
          <p>Siklus jantung = semua yang terjadi dari satu denyut ke denyut berikutnya. Kamu sudah punya semua kepingannya:</p>
          <ul class="key-points">
            <li><span class="k-ico">⚡</span><span><b>Listrik</b> (EKG, A8) memicu…</span></li>
            <li><span class="k-ico">💪</span><span><b>Kontraksi/relaksasi</b> (A7) yang mengubah…</span></li>
            <li><span class="k-ico">📈</span><span><b>Tekanan</b> di ruang jantung, sehingga…</span></li>
            <li><span class="k-ico">🚪</span><span><b>Katup</b> membuka/menutup (menghasilkan bunyi S1/S2, A9) dan…</span></li>
            <li><span class="k-ico">🫙</span><span><b>Volume</b> ventrikel berubah (pengisian & ejeksi).</span></li>
          </ul>
          <div class="callout"><p><b>Diagram Wiggers</b> menumpuk semuanya pada satu sumbu waktu. Kuncinya bukan menghafal grafik, tetapi memahami <b>rantai: listrik → tekanan → katup → aliran → volume</b>.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Diagram Wiggers fase demi fase", emoji: "🎬", intro: "Kursor biru berjalan di fase yang dibahas. Klik nomor/area fase pada grafik untuk melompat ke fase itu.",
          viz: `${wiggersMarkup("x")}<div class="two-col" style="gap:10px;margin-top:8px;align-items:center">${LH}<div class="readout"><span>Perbandingan tekanan → status katup</span><b class="cmp" style="font-size:.88rem;font-weight:500;line-height:1.7"></b></div></div>`,
          steps: STEPS,
          info: Object.fromEntries(PH.map((p) => [p.id, [`Fase ${p.n}: ${p.name}`, `${p.mit ? "Mitral terbuka" : "Mitral tertutup"}, ${p.aor ? "aorta terbuka" : "aorta tertutup"}.`]])),
          onInfo(k, api) { const i = STEPS.findIndex((s) => s.ph === k); if (i >= 0) { api.stop(); api.go(i); } },
          onStep(i, s, api) { api._ph = s.ph; const p = PH.find((x) => x.id === s.ph); api._w = p ? p.w : [0, 800]; api._t = api._w[0]; },
          init(api, secEl) {
            const svg = K.$(".wg", api.viz), h = K.$(".lh", api.viz);
            drawWiggers(svg);
            K.loop(secEl, (dt) => {
              if (!api._w) return;
              const span = api._w[1] - api._w[0];
              api._t += dt * (span > 300 ? 260 : Math.max(50, span * .8));
              if (api._t > api._w[1]) api._t = api._w[0];
              const t = api._t;
              cursorWiggers(svg, t, api._ph || "");
              drawHeart(h, t);
              K.$(".cmp", api.viz).innerHTML = compareText(t);
            });
          },
        },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Setiap peristiwa di diagram punya penyebab. Buka satu per satu.",
          chains: [
            { label: "Dari QRS sampai darah keluar", nodes: ["QRS: ventrikel terdepolarisasi", "Ca²⁺ masuk → otot ventrikel berkontraksi", "Tekanan VKi naik melebihi tekanan AKi → mitral menutup (S1)", "Tekanan terus naik dengan volume tetap (isovolumetrik)", "Tekanan VKi > tekanan aorta → katup aorta terbuka → ejeksi"] },
            { label: "Dari gelombang T sampai pengisian", nodes: ["Gelombang T: ventrikel repolarisasi", "Ca²⁺ dipompa kembali (SERCA) → otot relaksasi", "Tekanan VKi turun di bawah tekanan aorta → katup aorta menutup (S2)", "Tekanan VKi terus turun dengan volume tetap (isovolumetrik)", "Tekanan VKi < tekanan AKi → mitral terbuka → pengisian cepat"] },
            { label: "Mengapa tekanan aorta tidak turun ke 0?", nodes: ["Saat ejeksi, dinding aorta yang elastis meregang menampung darah", "Saat katup aorta menutup, dinding aorta “membalik” (recoil)", "Recoil mendorong darah terus ke perifer selama diastol", "Tekanan aorta hanya turun perlahan ke ±80 mmHg (diastolik)", "Itulah sebabnya aliran ke jaringan tetap kontinu (efek Windkessel, B3)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Geser waktu sendiri", emoji: "🎚️", html: `
          <p>Geser slider untuk menjelajah satu denyut. Semua grafik, jantung, dan status katup akan mengikuti.</p>
          <div class="slider-row"><label for="tt">Waktu dalam siklus <output id="tt-o"></output></label><input type="range" id="tt" min="0" max="799" value="120"></div>
          <div id="w2"></div>
          <div class="two-col" style="gap:10px;margin-top:8px;align-items:center"><div id="h2"></div><div><div class="readout"><span>Fase</span><b id="ph2" style="font-size:1rem"></b></div><div class="readout" style="margin-top:8px"><span>Perbandingan tekanan</span><b id="cmp2" style="font-size:.88rem;font-weight:500;line-height:1.7"></b></div></div></div>`,
          init(el) {
            K.$("#w2", el).innerHTML = wiggersMarkup("i"); K.$("#h2", el).innerHTML = LH;
            const svg = K.$(".wg", el), h = K.$(".lh", el), s = K.$("#tt", el);
            drawWiggers(svg);
            K.$$(".wg-band", svg).forEach((b) => b.addEventListener("click", () => { const p = PH.find((x) => x.id === b.dataset.ph); s.value = Math.round((p.w[0] + p.w[1]) / 2); upd(); }));
            function upd() { const t = +s.value; K.$("#tt-o", el).textContent = t + " ms"; cursorWiggers(svg, t, phaseAt(t).id); drawHeart(h, t); K.$("#ph2", el).textContent = `${phaseAt(t).n}. ${phaseAt(t).name}`; K.$("#cmp2", el).innerHTML = compareText(t); }
            s.addEventListener("input", upd); upd();
          } },
        { heading: "Tebak status katup", emoji: "🎯", html: `
          <p>Lihat posisi kursor pada mini-diagram tekanan, lalu tebak status kedua katup. Gunakan logika tekanan!</p>
          <div class="viz-wrap"><svg id="gq" viewBox="0 0 420 210" role="img" aria-label="Kuis status katup"></svg></div>
          <div class="two-col" style="margin-top:10px">
            <div><b>Katup mitral</b><div class="toggle-row" data-q="mit"><button class="btn btn-sm" data-a="1" type="button">Terbuka</button><button class="btn btn-sm" data-a="0" type="button">Tertutup</button></div></div>
            <div><b>Katup aorta</b><div class="toggle-row" data-q="aor"><button class="btn btn-sm" data-a="1" type="button">Terbuka</button><button class="btn btn-sm" data-a="0" type="button">Tertutup</button></div></div>
          </div>
          <div class="btn-row"><button class="btn btn-primary btn-sm" id="gq-check" type="button">Periksa</button><button class="btn btn-sm" id="gq-next" type="button">Soal lain ↻</button><span class="small muted" id="gq-score"></span></div>
          <div id="gq-msg" style="margin-top:10px"></div>`,
          init(el) {
            const svg = K.$("#gq", el);
            const Yp = (p) => 195 - p / 130 * 180;
            svg.innerHTML = `<line class="svg-axis" x1="46" y1="10" x2="46" y2="195"/>
              <path fill="none" stroke="var(--o2-rich)" stroke-width="2.5" d="${K.plot(ao, 0, C, X, Yp, 300)}"/>
              <path fill="none" stroke="var(--text)" stroke-width="2.5" d="${K.plot(lv, 0, C, X, Yp, 300)}"/>
              <path fill="none" stroke="var(--accent)" stroke-width="2.5" d="${K.plot(la, 0, C, X, Yp, 300)}"/>
              <text class="svg-label small" x="410" y="${Yp(90)}" text-anchor="end" style="fill:var(--o2-rich)">Aorta</text><text class="svg-label small" x="${X(240)}" y="${Yp(126)}" text-anchor="middle">VKi</text><text class="svg-label small" x="410" y="${Yp(16)}" text-anchor="end" style="fill:var(--accent)">AKi</text>
              <line id="gq-cur" y1="10" y2="195" stroke="var(--warn)" stroke-width="3"/>`;
            let t, ans = {}, score = 0, tries = 0;
            function next() {
              const p = PH[Math.floor(Math.random() * PH.length)];
              t = p.w[0] + (p.w[1] - p.w[0]) * (0.25 + Math.random() * .5);
              const c = K.$("#gq-cur", el); c.setAttribute("x1", X(t)); c.setAttribute("x2", X(t));
              ans = {}; K.$$("[data-q] button", el).forEach((b) => b.classList.remove("on"));
              K.$("#gq-msg", el).innerHTML = "";
            }
            K.$$("[data-q]", el).forEach((row) => K.$$("button", row).forEach((b) => b.addEventListener("click", () => {
              ans[row.dataset.q] = b.dataset.a === "1"; K.$$("button", row).forEach((x) => x.classList.toggle("on", x === b));
            })));
            K.$("#gq-check", el).addEventListener("click", () => {
              if (!("mit" in ans) || !("aor" in ans)) { K.$("#gq-msg", el).innerHTML = `<div class="callout warn"><p>Pilih status kedua katup dulu.</p></div>`; return; }
              const p = phaseAt(t), ok = ans.mit === p.mit && ans.aor === p.aor;
              tries++; if (ok) score++;
              K.$("#gq-score", el).textContent = `Skor: ${score}/${tries}`;
              K.$("#gq-msg", el).innerHTML = `<div class="callout ${ok ? "green" : "red"}"><p><b>${ok ? "✅ Tepat!" : "❌ Belum tepat."}</b> Ini fase <b>${p.n}. ${p.name}</b>.<br>${compareText(t)}</p></div>`;
            });
            K.$("#gq-next", el).addEventListener("click", next);
            next();
          } },
        { heading: "Loop tekanan–volume (PV loop)", emoji: "🔁", html: `
          <p>Plot tekanan VKi terhadap volume VKi selama satu siklus menghasilkan sebuah “loop”. Tiap sisi loop = satu kelompok fase. (Loop ini akan dipakai lagi di A13.)</p>
          <div class="two-col"><div class="viz-wrap"><svg id="pv" viewBox="0 0 300 240" role="img" aria-label="Loop tekanan volume"></svg></div>
            <div class="key-points" style="display:grid;gap:8px">
              <div class="callout"><p><b>A → B</b> (kanan, vertikal): kontraksi isovolumetrik.<br><b>B → C</b> (atas): ejeksi.<br><b>C → D</b> (kiri, vertikal): relaksasi isovolumetrik.<br><b>D → A</b> (bawah): pengisian.</p></div>
              <div class="readout"><span>Lebar loop = stroke volume</span><b>130 − 60 = 70 mL</b></div></div></div>`,
          init(el, secEl) {
            const svg = K.$("#pv", el);
            const PX = (v) => 40 + (v - 40) / 110 * 250, PY = (p) => 210 - p / 130 * 190;
            let d = ""; for (let i = 0; i <= 400; i++) { const t = i / 400 * C; d += (i ? "L" : "M") + PX(vol(t)).toFixed(1) + "," + PY(lv(t)).toFixed(1); }
            svg.innerHTML = `<line class="svg-axis" x1="40" y1="15" x2="40" y2="210"/><line class="svg-axis" x1="40" y1="210" x2="295" y2="210"/>
              <text class="svg-label small" x="168" y="232" text-anchor="middle">Volume VKi (mL)</text><text class="svg-label small" x="12" y="112" transform="rotate(-90 12 112)" text-anchor="middle">Tekanan VKi (mmHg)</text>
              <path d="${d}" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="3"/>
              <g class="svg-label small" style="font-weight:700"><text x="${PX(130) + 6}" y="${PY(10)}">A</text><text x="${PX(130) + 6}" y="${PY(82)}">B</text><text x="${PX(60) - 14}" y="${PY(98)}">C</text><text x="${PX(60) - 14}" y="${PY(6)}">D</text></g>
              <circle id="pv-dot" r="6" fill="var(--warn)" stroke="#fff" stroke-width="2"/>`;
            let t = 0;
            K.loop(secEl, (dt) => { t = (t + dt * 300) % C; const c = K.$("#pv-dot", svg); c.setAttribute("cx", PX(vol(t))); c.setAttribute("cy", PY(lv(t))); });
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika siklusnya terganggu…", emoji: "🩺", intro: "Bayangkan bagaimana kurva tekanan berubah.",
          items: [
            { icon: "🚪", title: "Stenosis aorta", chain: ["Katup aorta sempit", "Saat ejeksi tekanan VKi harus jauh lebih tinggi dari aorta (ada gradien tekanan)", "Beban VKi berat → lama-lama dinding menebal (hipertrofi); murmur sistolik"] },
            { icon: "🔒", title: "Stenosis mitral", chain: ["Katup mitral sempit", "Saat diastol tekanan AKi harus jauh lebih tinggi dari VKi untuk mengisi", "Tekanan AKi tinggi diteruskan ke paru → sesak; pengisian VKi berkurang"] },
            { icon: "↩️", title: "Regurgitasi mitral", chain: ["Mitral tidak menutup rapat saat sistol", "Tidak ada fase isovolumetrik yang sejati: darah bocor ke AKi", "Gelombang v di atrium sangat tinggi; volume yang efektif ke aorta berkurang"] },
            { icon: "🏃", title: "Takikardia berat", chain: ["Durasi siklus memendek, terutama diastol", "Diastasis hilang, lalu pengisian cepat ikut terpotong", "EDV turun → stroke volume turun (lihat A11)"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Selama kontraksi isovolumetrik, apa yang terjadi?",
          options: ["Mitral terbuka, aorta tertutup", "Semua katup tertutup; tekanan VKi naik, volume tetap", "Semua katup terbuka", "Aorta terbuka, volume turun"], answer: 1,
          explain: "Tekanan VKi sudah melebihi AKi (mitral menutup) tetapi belum melebihi aorta (aorta masih tertutup). Darah tidak masuk atau keluar → volume tetap." },
        { q: "Katup aorta terbuka tepat pada saat…",
          options: ["Tekanan VKi melampaui tekanan AKi", "Tekanan VKi melampaui tekanan aorta", "Gelombang P muncul", "Volume VKi mencapai minimum"], answer: 1,
          explain: "Katup aorta terdorong membuka ketika tekanan di sisi ventrikel lebih tinggi daripada di sisi aorta (±80 mmHg)." },
        { q: "Bunyi jantung S2 bertepatan dengan…",
          options: ["Awal kontraksi isovolumetrik", "Awal relaksasi isovolumetrik (penutupan katup aorta/pulmonal)", "Awal pengisian cepat", "Puncak gelombang R"], answer: 1,
          explain: "S2 = penutupan katup semilunar ketika tekanan ventrikel turun di bawah tekanan arteri — awal relaksasi isovolumetrik, terlihat juga sebagai insisura pada kurva aorta." },
        { q: "EDV 120 mL dan ESV 50 mL. Berapa stroke volume dan ejection fraction-nya?",
          options: ["SV 70 mL, EF ±58%", "SV 170 mL, EF 100%", "SV 50 mL, EF 42%", "SV 70 mL, EF 42%"], answer: 0,
          explain: "SV = EDV − ESV = 120 − 50 = 70 mL. EF = SV/EDV = 70/120 ≈ 58% (normal ±55–70%)." },
        { q: "Mengapa sebagian besar pengisian ventrikel terjadi sebelum atrium berkontraksi?",
          options: ["Karena atrium berkontraksi terlebih dahulu", "Karena saat mitral terbuka, darah yang menumpuk di atrium mengalir pasif mengikuti gradien tekanan (pengisian cepat)", "Karena aorta mendorong darah ke ventrikel", "Karena ventrikel berkontraksi menarik darah"], answer: 1,
          explain: "Selama ventrikel sistol, darah terus masuk dan menumpuk di atrium. Begitu mitral terbuka, gradien tekanan mendorong darah itu dengan cepat ke ventrikel. Kontraksi atrium hanya menambah ±10–20% (di akhir)." },
      ]},
    ],
  });
})();
