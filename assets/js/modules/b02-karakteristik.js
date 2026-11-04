/* Modul B2 — Karakteristik Masing-Masing Pembuluh */
(function () {
  const SEG = ["Aorta", "Arteri", "Arteriol", "Kapiler", "Venula", "Vena", "V. kava"];
  const X = (i) => 40 + i * 55;                 // posisi tengah segmen (i bisa pecahan)
  // nilai per segmen (titik batas 0..7)
  const P_MEAN = [[0, 95], [1, 92], [2, 85], [2.9, 35], [4, 15], [5, 10], [6, 5], [7, 1]];
  const AREA = [[0, 4.5], [1, 20], [2, 400], [3, 4500], [4, 4000], [5, 40], [6, 18], [7, 14]];   // cm²
  const pressure = (s) => {
    const m = K.keys(P_MEAN, s), amp = s < 2 ? 20 : s < 2.9 ? 20 * (2.9 - s) / .9 : 0;
    return m + amp * Math.sin(s * 14);
  };
  const area = (s) => Math.exp(K.keys(AREA.map(([a, b]) => [a, Math.log(b)]), s));
  const Q = 83; // cm³/detik ≈ 5 L/menit
  const vel = (s) => Q / area(s);               // cm/detik

  const W0 = 40 - 27, W1 = 40 + 6 * 55 + 27, sx = (s) => W0 + s / 7 * (W1 - W0);
  const VIZ = `<svg viewBox="0 0 420 330" role="img" aria-label="Tekanan, luas penampang, dan kecepatan di sepanjang pembuluh">
    <g id="b2-bands">${SEG.map((n, i) => `<rect class="b2-band" data-i="${i}" data-info="s${i}" x="${sx(i)}" y="8" width="${sx(i + 1) - sx(i)}" height="300" fill="${i % 2 ? "var(--surface)" : "var(--surface-2)"}" style="cursor:pointer"/>
      <text class="svg-label small" x="${(sx(i) + sx(i + 1)) / 2}" y="324" text-anchor="middle" style="font-size:9.5px">${n}</text>`).join("")}</g>
    <g style="pointer-events:none">
      <text class="svg-label small" x="${W0 + 4}" y="22">Tekanan (mmHg)</text>
      <path id="b2-p" fill="none" stroke="var(--o2-rich)" stroke-width="2.5"/>
      <line class="svg-grid" x1="${W0}" y1="100" x2="${W1}" y2="100"/>
      <text class="svg-label small" x="${W0 + 4}" y="122">Luas penampang total</text>
      <path id="b2-a" fill="var(--accent)" fill-opacity=".2" stroke="var(--accent)" stroke-width="2.5"/>
      <line class="svg-grid" x1="${W0}" y1="200" x2="${W1}" y2="200"/>
      <text class="svg-label small" x="${W0 + 4}" y="222">Kecepatan aliran</text>
      <path id="b2-v" fill="none" stroke="var(--warn)" stroke-width="2.5"/>
    </g>
  </svg>
  <div class="readouts" style="margin-top:6px"><div class="readout"><span>Tekanan rata-rata</span><b id="b2-rp"></b></div><div class="readout"><span>Luas penampang total</span><b id="b2-ra"></b></div><div class="readout"><span>Kecepatan</span><b id="b2-rv"></b></div></div>`;

  const STEPS = [
    { title: "Tiga grafik, satu perjalanan", body: "Grafik ini mengikuti darah dari aorta sampai vena kava. Atas: <b style='color:var(--o2-rich)'>tekanan</b>. Tengah: <b style='color:var(--accent)'>luas penampang total</b> (semua cabang dijumlahkan). Bawah: <b style='color:var(--warn)'>kecepatan</b> aliran.", key: "Klik segmen mana pun untuk melompat.", s: null },
    { title: "Aorta: tekanan tinggi & berdenyut", body: "Tekanan ±120/80 mmHg dan <b>berdenyut</b> (pulsatil). Luas penampangnya kecil (±4,5 cm²), sehingga darah mengalir <b>paling cepat</b> (±20–30 cm/s).", key: "Satu pipa besar = luas total kecil = cepat.", s: 0 },
    { title: "Arteri: tekanan masih tinggi", body: "Tekanan rata-rata baru turun sedikit — arteri besar resistensinya rendah. Denyutan masih terasa (itulah nadi yang kamu raba).", key: "Hampir tidak ada penurunan tekanan di arteri besar.", s: 1 },
    { title: "Arteriol: penurunan tekanan terbesar", body: "Di sinilah tekanan <b>turun paling tajam</b> (dari ±85 ke ±35 mmHg) dan denyutan menghilang. Arteriol adalah tempat <b>resistensi terbesar</b>.", key: "Penurunan tekanan terbesar = resistensi terbesar (B4).", s: 2 },
    { title: "Kapiler: paling lambat", body: "Jumlah kapiler miliaran → luas penampang total ±<b>4.500 cm²</b> (±1000× aorta). Karena aliran total sama, kecepatan menjadi <b>paling lambat</b> (±0,03 cm/s) — memberi waktu untuk pertukaran zat.", key: "Kecepatan = aliran ÷ luas penampang total (v = Q/A).", s: 3 },
    { title: "Venula & vena: tekanan rendah", body: "Tekanan tinggal ±15 → 5 mmHg. Kapiler bergabung lagi sehingga luas total mengecil dan kecepatan <b>naik lagi</b>.", key: "Tekanan rendah → vena butuh bantuan untuk mengembalikan darah (B5).", s: 5 },
    { title: "Vena kava: hampir 0 mmHg", body: "Tekanan di vena kava/atrium kanan ±0–5 mmHg. Kecepatan meningkat lagi (±15 cm/s) tetapi tetap di bawah aorta karena luasnya sedikit lebih besar.", key: "Gradien tekanan dari aorta (±93) ke atrium kanan (±0) inilah yang mendorong aliran.", s: 6 },
    { title: "Di mana darah berada?", body: "<div class='bar-row'><div class='bar-label'><span>Vena & venula</span><b>±64%</b></div><div class='bar'><span style='width:64%;background:var(--o2-poor)'></span></div></div><div class='bar-row'><div class='bar-label'><span>Sirkulasi paru</span><b>±9%</b></div><div class='bar'><span style='width:9%;background:var(--accent)'></span></div></div><div class='bar-row'><div class='bar-label'><span>Arteri</span><b>±13%</b></div><div class='bar'><span style='width:13%;background:var(--o2-rich)'></span></div></div><div class='bar-row'><div class='bar-label'><span>Jantung</span><b>±7%</b></div><div class='bar'><span style='width:7%;background:var(--primary)'></span></div></div><div class='bar-row'><div class='bar-label'><span>Arteriol & kapiler</span><b>±7%</b></div><div class='bar'><span style='width:7%;background:var(--vein)'></span></div></div>", key: "Vena = reservoir darah terbesar.", s: null },
  ];

  registerModule({
    id: "b02",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Tiap pembuluh, angka yang berbeda", emoji: "💡", html: `
          <p>Di B1 kamu melihat <b>struktur</b> tiap pembuluh. Sekarang lihat <b>angkanya</b>: tekanan, luas penampang, kecepatan aliran, dan volume darah.</p>
          <ul class="key-points">
            <li><span class="k-ico">📉</span><span><b>Tekanan</b> terus menurun dari aorta ke vena — paling tajam di <b>arteriol</b>.</span></li>
            <li><span class="k-ico">🌊</span><span><b>Kecepatan</b> berbanding terbalik dengan luas penampang total — paling lambat di <b>kapiler</b>.</span></li>
            <li><span class="k-ico">🅿️</span><span><b>Volume</b> darah terbanyak berada di <b>vena</b>.</span></li>
          </ul>
          <div class="callout"><p>Analogi sungai: saat sungai melebar menjadi danau, airnya mengalir pelan; saat menyempit lagi, airnya deras.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Menyusuri pembuluh", emoji: "📊", intro: "Segmen yang dibahas disorot. Klik segmen pada grafik untuk melompat.",
          viz: VIZ, steps: STEPS,
          info: Object.fromEntries(SEG.map((n, i) => [`s${i}`, [n, ""]])),
          onInfo(k, api) { const i = +k.slice(1); const j = STEPS.findIndex((s) => s.s === i || (i === 4 && s.s === 5)); if (j >= 0) { api.stop(); api.go(j); } },
          onStep(i, s, api) {
            K.$$(".b2-band", api.viz).forEach((b, j) => b.style.fill = s.s === j ? "var(--warn-soft)" : (j % 2 ? "var(--surface)" : "var(--surface-2)"));
            api._s = s.s;
          },
          init(api, secEl) {
            const v = api.viz;
            K.$("#b2-p", v).setAttribute("d", K.plot(pressure, 0, 7, sx, (p) => 96 - p / 125 * 70, 500));
            const la = (a) => 192 - (Math.log10(a) - .5) / 3.3 * 66;
            K.$("#b2-a", v).setAttribute("d", K.plot(area, 0, 7, sx, la, 300) + `L${sx(7)},196 L${sx(0)},196 Z`);
            const lv = (x) => 296 - (Math.log10(x) + 2) / 3.6 * 66;
            K.$("#b2-v", v).setAttribute("d", K.plot(vel, 0, 7, sx, lv, 300));
            let t = 0;
            K.loop(secEl, (dt) => {
              const s = api._s == null ? (t = (t + dt * .6) % 7) : api._s;
              K.$("#b2-rp", v).innerHTML = `${Math.round(K.keys(P_MEAN, s))}<small> mmHg</small>`;
              K.$("#b2-ra", v).innerHTML = `${area(s) >= 100 ? Math.round(area(s)).toLocaleString("id") : area(s).toFixed(1).replace(".", ",")}<small> cm²</small>`;
              const ve = vel(s); K.$("#b2-rv", v).innerHTML = `${ve >= 1 ? ve.toFixed(0) : ve.toFixed(2).replace(".", ",")}<small> cm/s</small>`;
            });
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa darah paling lambat di kapiler?", nodes: ["Aliran total (Q) di setiap tingkat pembuluh sama, ±5 L/menit", "Kapiler sangat banyak → luas penampang TOTAL sangat besar", "Kecepatan = Q ÷ luas penampang total", "Luas terbesar → kecepatan terkecil", "Darah punya waktu ±1–2 detik untuk pertukaran zat"] },
            { label: "Mengapa tekanan turun paling tajam di arteriol?", nodes: ["Aliran yang melewati suatu resistensi menimbulkan penurunan tekanan (ΔP = Q × R)", "Arteriol kecil dan berotot → resistensi terbesar di sirkulasi", "Maka penurunan tekanan terbesar terjadi di arteriol", "Tekanan yang sampai ke kapiler sudah rendah (±35 mmHg)", "Ini melindungi kapiler yang berdinding tipis"] },
            { label: "Mengapa denyutan hilang di kapiler?", nodes: ["Aorta & arteri elastis meredam sebagian denyutan", "Arteriol dengan resistensi tinggi meredam sisanya", "Aliran di kapiler menjadi hampir kontinu (tidak berdenyut)", "Pertukaran zat berlangsung stabil"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Sungai darah: kecepatan vs luas penampang", emoji: "🌊", html: `
          <p>Aliran total tetap <b>5 L/menit</b>. Pilih segmen dan lihat seberapa cepat partikel darah bergerak.</p>
          <div class="toggle-row" id="riv-btns"></div>
          <div class="viz-wrap"><svg id="riv" style="max-width:600px;margin:auto" viewBox="0 0 420 140" role="img" aria-label="Kecepatan aliran"><rect id="riv-tube" x="10" y="20" width="400" height="100" rx="12" fill="var(--o2-rich)" opacity=".12"/><g id="riv-p"></g></svg></div>
          <div class="readouts"><div class="readout"><span>Luas penampang total</span><b id="riv-a"></b></div><div class="readout big"><span>Kecepatan v = Q/A</span><b id="riv-v"></b></div></div>`,
          init(el, secEl) {
            const idx = [0, 2, 3, 5, 6]; let cur = 0;
            K.$("#riv-btns", el).innerHTML = idx.map((i) => `<button class="btn btn-sm" data-i="${i}" type="button">${SEG[i]}</button>`).join("");
            const NS = "http://www.w3.org/2000/svg", g = K.$("#riv-p", el), parts = [];
            for (let i = 0; i < 40; i++) { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", 4); c.setAttribute("fill", "var(--o2-rich)"); g.appendChild(c); parts.push({ c, x: Math.random() * 400, y: Math.random() }); }
            function pick(i) {
              cur = i; K.$$("#riv-btns button", el).forEach((b) => b.classList.toggle("on", +b.dataset.i === i));
              const a = area(i), v = vel(i);
              const h = K.clamp(20 + (Math.log10(a) - .5) / 3.2 * 90, 16, 110);
              const tube = K.$("#riv-tube", el); tube.setAttribute("height", h); tube.setAttribute("y", 70 - h / 2);
              K.$("#riv-a", el).innerHTML = `${a >= 100 ? Math.round(a).toLocaleString("id") : a.toFixed(1).replace(".", ",")}<small> cm²</small>`;
              K.$("#riv-v", el).innerHTML = `${v >= 1 ? v.toFixed(0) : v.toFixed(2).replace(".", ",")}<small> cm/s</small>`;
              parts.forEach((p) => p.h = h);
            }
            K.$$("#riv-btns button", el).forEach((b) => b.addEventListener("click", () => pick(+b.dataset.i))); pick(0);
            K.loop(secEl, (dt) => {
              const v = vel(cur), sp = K.clamp(Math.log10(v * 100 + 1) * 60, 4, 250);
              parts.forEach((p) => { p.x = (p.x + dt * sp) % 400; p.c.setAttribute("cx", 10 + p.x); p.c.setAttribute("cy", 70 + (p.y - .5) * (p.h - 10)); });
            });
          } },
        { heading: "Gaya Starling di kapiler", emoji: "⚖️", html: `
          <p>Cairan keluar–masuk kapiler ditentukan oleh <b>tekanan hidrostatik</b> (mendorong keluar) dan <b>tekanan onkotik</b> protein plasma (menarik masuk). Ubah nilainya dan lihat hasilnya di sepanjang kapiler.</p>
          <div class="slider-row"><label for="pa">Tekanan hidrostatik ujung arteri (Pc) <output id="pa-o"></output></label><input type="range" id="pa" min="20" max="55" value="35"></div>
          <div class="slider-row"><label for="pv">Tekanan hidrostatik ujung vena <output id="pv-o"></output></label><input type="range" id="pv" min="5" max="35" value="15"></div>
          <div class="slider-row"><label for="pi">Tekanan onkotik plasma (albumin) πc <output id="pi-o"></output></label><input type="range" id="pi" min="8" max="32" value="25"></div>
          <div class="slider-row"><label for="pii">Tekanan onkotik interstisial πi <output id="pii-o"></output></label><input type="range" id="pii" min="0" max="15" value="1"></div>
          <div class="btn-row" id="st-pre" style="margin-bottom:10px"></div>
          <div class="viz-wrap"><svg id="st" style="max-width:600px;margin:auto" viewBox="0 0 420 200" role="img" aria-label="Filtrasi dan reabsorpsi kapiler"></svg></div>
          <div class="readouts"><div class="readout"><span>Filtrasi bersih</span><b id="st-net"></b></div><div class="readout"><span>Risiko edema</span><b id="st-ed"></b></div></div>
          <div class="callout" id="st-msg"></div>`,
          init(el) {
            const s = (id) => K.$("#" + id, el);
            const PRE = [["Normal", 35, 15, 25, 1], ["Hipoalbuminemia", 35, 15, 12, 1], ["Bendungan vena (gagal jantung kanan)", 42, 30, 25, 1], ["Peradangan", 40, 20, 25, 10]];
            s("st-pre").innerHTML = PRE.map((p, i) => `<button class="btn btn-sm" data-i="${i}" type="button">${p[0]}</button>`).join("");
            K.$$("#st-pre button", el).forEach((b) => b.addEventListener("click", () => { const p = PRE[+b.dataset.i]; s("pa").value = p[1]; s("pv").value = p[2]; s("pi").value = p[3]; s("pii").value = p[4]; upd(); }));
            const Y = (v) => 100 - v * 3.2;
            function upd() {
              const pa = +s("pa").value, pv = +s("pv").value, pc = +s("pi").value, pii = +s("pii").value;
              s("pa-o").textContent = pa + " mmHg"; s("pv-o").textContent = pv + " mmHg"; s("pi-o").textContent = pc + " mmHg"; s("pii-o").textContent = pii + " mmHg";
              const nfp = (f) => (pa + (pv - pa) * f) - (pc - pii);
              let svg = `<rect x="20" y="88" width="380" height="24" rx="12" fill="var(--o2-rich)" opacity=".2"/><text class="svg-label small" x="22" y="130">ujung arteri</text><text class="svg-label small" x="398" y="130" text-anchor="end">ujung vena</text>
                <line class="svg-grid" x1="20" y1="100" x2="400" y2="100"/>`;
              let area = 0;
              for (let i = 0; i <= 8; i++) {
                const f = i / 8, n = nfp(f), x = 20 + f * 380; area += n;
                const len = K.clamp(Math.abs(n) * 3, 4, 60), up = n > 0;
                svg += `<line x1="${x}" y1="${up ? 88 : 88 - len}" x2="${x}" y2="${up ? 88 - len : 88}" stroke="${up ? "var(--bad)" : "var(--ok)"}" stroke-width="3" marker-end="url(#ah${up ? "o" : "i"})"/>`;
              }
              svg += `<defs><marker id="aho" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--bad)"/></marker><marker id="ahi" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--ok)"/></marker></defs>
                <path d="${K.plot(nfp, 0, 1, (f) => 20 + f * 380, (v) => 170 - v * 2, 50)}" fill="none" stroke="var(--text)" stroke-width="2"/><line class="svg-grid" x1="20" y1="170" x2="400" y2="170"/>
                <text class="svg-label small" x="398" y="150" text-anchor="end">garis = tekanan filtrasi bersih</text><text class="svg-label small" x="22" y="20" style="fill:var(--bad)">↑ keluar (filtrasi)</text><text class="svg-label small" x="398" y="20" text-anchor="end" style="fill:var(--ok)">↓ masuk (reabsorpsi)</text>`;
              s("st").innerHTML = svg;
              const net = area / 9;
              s("st-net").innerHTML = `${net >= 0 ? "+" : ""}${net.toFixed(1).replace(".", ",")}<small> mmHg (rata-rata)</small>`;
              const risk = net > 8 ? "Tinggi" : net > 3 ? "Sedang" : "Rendah";
              s("st-ed").textContent = risk;
              const m = s("st-msg");
              m.className = net > 8 ? "callout red" : net > 3 ? "callout warn" : "callout green";
              m.innerHTML = `<p>${net > 8 ? "Filtrasi jauh melebihi reabsorpsi → cairan menumpuk di interstisial melebihi kemampuan <b>pembuluh limfe</b> → <b>edema</b>." : net > 3 ? "Filtrasi meningkat; sistem limfe bekerja lebih keras. Bila berlanjut, edema dapat muncul." : "Seimbang: filtrasi kecil yang tersisa diangkut oleh pembuluh limfe (±2–4 L/hari)."}</p>`;
            }
            ["pa", "pv", "pi", "pii"].forEach((id) => s(id).addEventListener("input", upd)); upd();
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Empat jalan menuju edema", emoji: "🩺", intro: "Semua edema bisa dijelaskan dengan gaya Starling + aliran limfe.",
          items: [
            { icon: "🥚", title: "Hipoalbuminemia (sindrom nefrotik, sirosis, malnutrisi)", chain: ["Albumin plasma rendah", "Tekanan onkotik plasma turun → daya tarik cairan ke dalam kapiler berkurang", "Filtrasi bersih ↑ → edema menyeluruh (mis. di sekitar mata, tungkai)"] },
            { icon: "🫀", title: "Tekanan vena tinggi (gagal jantung, trombosis vena)", chain: ["Tekanan vena naik", "Tekanan hidrostatik kapiler ujung vena ikut naik", "Reabsorpsi berkurang → edema (tungkai, atau paru pada gagal jantung kiri)"] },
            { icon: "🔥", title: "Peradangan / alergi", chain: ["Histamin & mediator lain melebarkan celah endotel", "Protein bocor ke interstisial → tekanan onkotik interstisial ↑", "Cairan tertarik keluar → bengkak lokal"] },
            { icon: "🚧", title: "Sumbatan limfe (mis. filariasis, pasca operasi)", chain: ["Pembuluh limfe tersumbat atau diangkat", "Sisa filtrasi tidak bisa dikembalikan ke sirkulasi", "Cairan kaya protein menumpuk → limfedema"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Di segmen pembuluh mana kecepatan aliran darah paling lambat?",
          options: ["Aorta", "Arteriol", "Kapiler", "Vena kava"], answer: 2,
          explain: "Kecepatan = aliran ÷ luas penampang total. Kapiler memiliki luas penampang total terbesar (±4.500 cm²) sehingga alirannya paling lambat." },
        { q: "Penurunan tekanan darah terbesar terjadi di…",
          options: ["Aorta", "Arteri besar", "Arteriol", "Vena"], answer: 2,
          explain: "Arteriol memiliki resistensi terbesar. Karena ΔP = Q × R, penurunan tekanan terbesar terjadi di sana." },
        { q: "Kapiler memiliki diameter tunggal terkecil, tetapi kecepatan alirannya paling lambat. Mengapa tidak paling cepat?",
          options: ["Karena darah di kapiler lebih kental", "Karena yang menentukan kecepatan adalah luas penampang TOTAL semua kapiler, yang sangat besar", "Karena kapiler tidak memiliki tekanan", "Karena kapiler memompa darah ke belakang"], answer: 1,
          explain: "Walau tiap kapiler sempit, jumlahnya miliaran sehingga luas penampang totalnya sangat besar. Aliran total yang sama tersebar ke luas yang besar → lambat." },
        { q: "Pasien sindrom nefrotik kehilangan banyak albumin lewat urin. Mekanisme edemanya adalah…",
          options: ["Tekanan hidrostatik kapiler turun", "Tekanan onkotik plasma turun sehingga filtrasi bersih meningkat", "Pembuluh limfe tersumbat", "Tekanan onkotik interstisial turun"], answer: 1,
          explain: "Albumin adalah penentu utama tekanan onkotik plasma. Jika turun, gaya yang menarik cairan kembali ke kapiler melemah → cairan menumpuk di interstisial." },
        { q: "Mengapa vena dapat menampung sebagian besar volume darah meskipun tekanannya rendah?",
          options: ["Karena dindingnya tebal dan kaku", "Karena dindingnya tipis dan sangat lentur (compliance tinggi)", "Karena kecepatan alirannya paling lambat", "Karena vena memiliki banyak arteriol"], answer: 1,
          explain: "Compliance = ΔV/ΔP. Vena sangat lentur sehingga dapat menampung banyak volume dengan kenaikan tekanan kecil." },
      ]},
    ],
  });
})();
