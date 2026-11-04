/* Modul A8 — Elektrokardiogram (EKG) */
(function () {
  const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
  /** Satu denyut EKG (sadapan II), t dalam ms (0–800) */
  function ecg(t, o = {}) {
    const qt = o.qtShift || 0;
    return 0.15 * g(t, 60, 18) - 0.12 * g(t, 168, 5) + 1.0 * g(t, 185, 7) - 0.25 * g(t, 202, 6) + 0.3 * g(t, 400 + qt, 40);
  }
  // status jantung pada waktu t
  function heartState(t) {
    return {
      ra: t >= 15 && t <= 170 ? "on" : "", la: t >= 35 && t <= 190 ? "on" : "",
      sep: t >= 165 && t <= 345 ? "on" : t > 345 && t <= 470 ? "rep" : "",
      lv: t >= 178 && t <= 360 ? "on" : t > 360 && t <= 470 ? "rep" : "",
      rv: t >= 180 && t <= 355 ? "on" : t > 355 && t <= 470 ? "rep" : "",
      sa: t < 15, av: t >= 90 && t <= 160,
    };
  }
  const MECH = (t) => t < 110 ? "Atrium mulai berkontraksi (setelah depolarisasi)" : t < 165 ? "Atrium berkontraksi, mendorong sisa darah ke ventrikel" : t < 240 ? "Ventrikel mulai berkontraksi — katup AV menutup (S1)" : t < 340 ? "Ventrikel berkontraksi & memompa darah keluar (ejeksi)" : t < 480 ? "Ventrikel mulai relaksasi — katup semilunar menutup (S2)" : "Seluruh jantung relaksasi — ventrikel terisi darah";

  const sx = (t) => 20 + t / 800 * 390, sy = (v) => 120 - v * 90;
  const SEG = { p: [15, 105], pr: [105, 160], qrs: [160, 215], st: [215, 340], t: [340, 470], tp: [470, 800] };

  const VIZ = `<svg viewBox="0 0 420 165" role="img" aria-label="Satu siklus EKG">
      <line class="svg-grid" x1="20" y1="120" x2="410" y2="120"/>
      ${Object.entries(SEG).map(([k, [a, b]]) => `<rect data-info="${k}" class="ecg-seg" data-seg="${k}" x="${sx(a)}" y="10" width="${sx(b) - sx(a)}" height="140" fill="var(--warn)" opacity="0" style="cursor:pointer"/>`).join("")}
      <path id="e-trace" fill="none" stroke="var(--primary)" stroke-width="3" style="pointer-events:none"/>
      <line id="e-cur" y1="10" y2="150" stroke="var(--accent)" stroke-width="1.5" style="pointer-events:none"/>
      <g class="svg-label small" style="font-weight:700;pointer-events:none">
        <text x="${sx(60)}" y="94" text-anchor="middle">P</text><text x="${sx(168)}" y="140" text-anchor="middle">Q</text>
        <text x="${sx(185)}" y="18" text-anchor="middle">R</text><text x="${sx(205)}" y="148" text-anchor="middle">S</text>
        <text x="${sx(400)}" y="80" text-anchor="middle">T</text>
      </g>
      <text class="svg-label small" x="215" y="162" text-anchor="middle">👆 klik bagian gelombang</text>
    </svg>
    <div class="two-col" style="gap:10px;margin-top:8px;align-items:center">
      <svg id="e-heart" viewBox="0 0 300 290" style="max-width:220px;margin:auto">${K.heartSVG("e")}</svg>
      <div><div class="readout"><span>Listrik</span><b id="e-elec" style="font-size:.95rem"></b></div>
        <div class="readout" style="margin-top:8px"><span>Mekanik (yang dirasakan jantung)</span><b id="e-mech" style="font-size:.95rem"></b></div></div>
    </div>`;

  const ELEC = (t) => t < 15 ? "SA node menembak" : t < 105 ? "Depolarisasi atrium" : t < 160 ? "Impuls tertahan di AV node" : t < 215 ? "Depolarisasi ventrikel" : t < 340 ? "Seluruh ventrikel terdepolarisasi (plateau)" : t < 470 ? "Repolarisasi ventrikel" : "Semua sel istirahat";

  const STEPS = [
    { title: "Apa yang direkam EKG?", body: "EKG merekam <b>jumlah aktivitas listrik</b> jutaan sel jantung yang sampai ke kulit. EKG bukan gambar kontraksi — tetapi listrik selalu <b>mendahului</b> kontraksi.", key: "Garis datar (isoelektrik) = tidak ada perbedaan potensial yang bergerak, bukan berarti jantung diam.", seg: null, w: [0, 800] },
    { title: "Gelombang P = depolarisasi atrium", body: "Impuls dari SA node menyebar di kedua atrium. Karena massa atrium kecil, gelombangnya kecil. Sesaat setelah gelombang P, atrium berkontraksi.", key: "P normal: kecil, bulat, < 0,12 detik.", seg: "p", w: [0, 110] },
    { title: "Segmen PR = jeda di AV node", body: "Impuls tertahan di AV node. Sel yang aktif sangat sedikit, sehingga garis kembali datar. Inilah waktu atrium menyelesaikan pengisian ventrikel.", key: "Interval PR (awal P – awal QRS) normal 0,12–0,20 detik.", seg: "pr", w: [95, 165] },
    { title: "Kompleks QRS = depolarisasi ventrikel", body: "Impuls melesat lewat His–Purkinje dan seluruh ventrikel terdepolarisasi. Massa ventrikel besar → gelombang paling tinggi. Q ≈ septum, R ≈ massa utama ventrikel, S ≈ basis. Repolarisasi atrium terjadi bersamaan, tetapi “tertutup” QRS.", key: "QRS normal < 0,12 detik. Lebar = konduksi lambat (mis. blok cabang berkas).", seg: "qrs", w: [155, 220] },
    { title: "Segmen ST = plateau ventrikel", body: "Semua sel ventrikel berada di fase 2 (plateau, A7) pada potensial yang sama → tidak ada perbedaan potensial → garis datar. Secara mekanik, ventrikel sedang <b>memompa darah</b>.", key: "ST yang naik/turun dari garis dasar bisa menandakan cedera/iskemia otot.", seg: "st", w: [210, 345] },
    { title: "Gelombang T = repolarisasi ventrikel", body: "Sel ventrikel kembali ke −90 mV (fase 3). Ventrikel mulai relaksasi dan katup aorta/pulmonal menutup di sekitar akhir T.", key: "Interval QT (awal Q – akhir T) ≈ durasi potensial aksi ventrikel; makin pendek saat HR tinggi.", seg: "t", w: [335, 480] },
    { title: "Segmen TP = istirahat & pengisian", body: "Semua sel istirahat (fase 4). Jantung relaksasi dan ventrikel terisi darah. Lalu siklus berikutnya dimulai dengan gelombang P.", key: "Saat HR naik, segmen TP-lah yang paling banyak memendek.", seg: "tp", w: [470, 800] },
    { title: "Rangkuman satu siklus", body: "<ul class='key-points'><li><span class='k-ico'>P</span><span>Depolarisasi atrium → kontraksi atrium</span></li><li><span class='k-ico'>PR</span><span>Jeda AV node</span></li><li><span class='k-ico'>QRS</span><span>Depolarisasi ventrikel → kontraksi ventrikel</span></li><li><span class='k-ico'>T</span><span>Repolarisasi ventrikel → relaksasi</span></li></ul>", key: "Listrik dulu, baru mekanik.", seg: null, w: [0, 800] },
  ];

  registerModule({
    id: "a08",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Membaca listrik jantung dari kulit", emoji: "💡", html: `
          <p>Di A5–A7 kamu melihat impuls bergerak dari SA node ke ventrikel, dan tiap sel melewati depolarisasi–repolarisasi. Saat <b>gelombang depolarisasi bergerak</b>, ia menimbulkan arus kecil di tubuh yang bisa direkam elektroda di kulit. Rekaman itulah <b>EKG</b>.</p>
          <ul class="key-points">
            <li><span class="k-ico">〰️</span><span><b>Gelombang</b> = ada aktivitas listrik yang bergerak (P, QRS, T).</span></li>
            <li><span class="k-ico">➖</span><span><b>Segmen</b> = garis datar di antara gelombang (PR, ST, TP).</span></li>
            <li><span class="k-ico">↔️</span><span><b>Interval</b> = gelombang + segmen (PR, QRS, QT) — diukur untuk menilai waktu hantaran.</span></li>
          </ul>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Gelombang ↔ yang terjadi di jantung", emoji: "📈", intro: "Klik bagian mana pun pada gelombang untuk langsung melompat ke penjelasannya.",
          viz: VIZ, steps: STEPS,
          info: {
            p: ["Gelombang P", "Depolarisasi atrium."], pr: ["Segmen PR", "Impuls tertahan di AV node."], qrs: ["Kompleks QRS", "Depolarisasi ventrikel."],
            st: ["Segmen ST", "Ventrikel dalam plateau, sedang memompa."], t: ["Gelombang T", "Repolarisasi ventrikel."], tp: ["Segmen TP", "Diastol — semua sel istirahat."],
          },
          onInfo(k, api) { const i = STEPS.findIndex((s) => s.seg === k); if (i >= 0) { api.stop(); api.go(i); } },
          onStep(i, s, api) {
            api._w = s.w; api._t = s.w[0];
            K.$$(".ecg-seg", api.viz).forEach((r) => r.setAttribute("opacity", r.dataset.seg === s.seg ? .18 : 0));
          },
          init(api, secEl) {
            const v = api.viz;
            K.$("#e-trace", v).setAttribute("d", K.plot(ecg, 0, 800, sx, sy, 600));
            const regs = {}; K.$$("#e-heart [data-r]", v).forEach((e) => regs[e.dataset.r] = e);
            const nodes = {}; K.$$("#e-heart [data-n]", v).forEach((e) => nodes[e.dataset.n] = e);
            K.loop(secEl, (dt) => {
              if (!api._w) return;
              const span = api._w[1] - api._w[0];
              api._t += dt * (span > 400 ? 320 : 90);
              if (api._t > api._w[1] + 15) api._t = api._w[0];
              const t = Math.min(api._t, api._w[1]);
              K.$("#e-cur", v).setAttribute("x1", sx(t)); K.$("#e-cur", v).setAttribute("x2", sx(t));
              const s = heartState(t);
              Object.entries(regs).forEach(([k, e]) => { e.classList.toggle("on", s[k] === "on"); e.classList.toggle("rep", s[k] === "rep"); });
              nodes.sa.classList.toggle("on", s.sa); nodes.av.classList.toggle("on", s.av);
              K.$("#e-elec", v).textContent = ELEC(t);
              K.$("#e-mech", v).textContent = MECH(t);
            });
          },
        },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { heading: "Mengapa gelombang bisa ke atas atau ke bawah?", emoji: "🧭", html: `
          <p>Aturannya sederhana: depolarisasi yang bergerak <b>menuju</b> elektrode positif → defleksi <b>ke atas</b>; <b>menjauhi</b> → ke bawah; <b>tegak lurus</b> → kecil/bifasik. Arah rata-rata depolarisasi ventrikel normal ±+60°. Geser posisi elektrode.</p>
          <div class="slider-row"><label for="ang">Posisi elektrode positif <output id="ang-o"></output></label><input type="range" id="ang" min="-180" max="180" value="60"></div>
          <div class="toggle-row" id="lead-btns"></div>
          <div class="two-col">
            <div class="viz-wrap"><svg id="vec" style="max-width:300px;margin:auto" viewBox="0 0 240 240" role="img" aria-label="Vektor jantung dan elektrode">
              <circle cx="120" cy="120" r="95" fill="none" stroke="var(--border)" stroke-dasharray="4 4"/>
              <text class="svg-label small" x="222" y="124">0°</text><text class="svg-label small" x="112" y="236">+90°</text><text class="svg-label small" x="2" y="124">180°</text><text class="svg-label small" x="110" y="16">−90°</text>
              <path d="M120,92 C104,80 84,88 88,108 C92,126 120,146 120,146 C120,146 148,126 152,108 C156,88 136,80 120,92 Z" fill="var(--primary-soft)" stroke="var(--primary)"/>
              <line x1="120" y1="120" x2="${120 + 80 * Math.cos(Math.PI / 3)}" y2="${120 + 80 * Math.sin(Math.PI / 3)}" stroke="var(--primary)" stroke-width="5" marker-end="url(#vh)"/>
              <defs><marker id="vh" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--primary)"/></marker></defs>
              <circle id="elec" r="11" fill="var(--accent)" stroke="#fff" stroke-width="2"/><text id="elec-t" class="svg-label small" text-anchor="middle" style="fill:#fff">+</text>
            </svg></div>
            <div><div class="viz-wrap"><svg viewBox="0 0 200 140" style="max-width:300px;margin:auto" role="img" aria-label="Bentuk QRS"><line class="svg-grid" x1="0" y1="70" x2="200" y2="70"/><path id="qrs-shape" fill="none" stroke="var(--primary)" stroke-width="3"/></svg></div>
              <div class="callout" id="vec-msg"></div></div>
          </div>`,
          init(el) {
            const LEADS = { "I": 0, "II": 60, "III": 120, "aVF": 90, "aVL": -30, "aVR": -150 };
            const ang = K.$("#ang", el);
            K.$("#lead-btns", el).innerHTML = Object.entries(LEADS).map(([n, a]) => `<button class="btn btn-sm" data-a="${a}" type="button">${n}</button>`).join("");
            K.$$("#lead-btns button", el).forEach((b) => b.addEventListener("click", () => { ang.value = b.dataset.a; draw(); }));
            function draw() {
              const a = +ang.value, r = a * Math.PI / 180;
              const x = 120 + 95 * Math.cos(r), y = 120 + 95 * Math.sin(r);
              K.$("#elec", el).setAttribute("cx", x); K.$("#elec", el).setAttribute("cy", y);
              K.$("#elec-t", el).setAttribute("x", x); K.$("#elec-t", el).setAttribute("y", y + 4);
              const proj = Math.cos((a - 60) * Math.PI / 180);
              K.$("#ang-o", el).textContent = (a > 0 ? "+" : "") + a + "°";
              const lead = Object.entries(LEADS).find(([, v]) => v === a);
              K.$$("#lead-btns button", el).forEach((b) => b.classList.toggle("on", +b.dataset.a === a));
              const R = Math.max(0, proj) * 1 + 0.12, S = Math.max(0, -proj) * 1 + 0.12;
              K.$("#qrs-shape", el).setAttribute("d", K.plot((t) => -0.1 * g(t, 85, 4) + R * g(t, 100, 6) - S * g(t, 116, 6), 20, 180, (t) => t, (v) => 70 - v * 55, 200));
              const m = K.$("#vec-msg", el);
              const nm = lead ? `Sadapan <b>${lead[0]}</b>: ` : "";
              m.innerHTML = `<p>${nm}${proj > .35 ? "depolarisasi bergerak <b>menuju</b> elektrode → QRS dominan <b>positif</b>." : proj < -.35 ? "depolarisasi bergerak <b>menjauhi</b> elektrode → QRS dominan <b>negatif</b>." : "arahnya hampir <b>tegak lurus</b> → QRS kecil/bifasik."}</p>`;
            }
            ang.addEventListener("input", draw); draw();
          } },
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa QRS jauh lebih tinggi dari P?", nodes: ["Tinggi gelombang ∝ jumlah sel yang berdepolarisasi bersamaan", "Massa otot ventrikel jauh lebih besar dari atrium", "Purkinje membuat seluruh ventrikel aktif hampir serentak", "Sinyal yang sampai ke kulit jauh lebih besar → QRS tinggi"] },
            { label: "Mengapa segmen ST datar?", nodes: ["Saat ST, semua sel ventrikel berada di plateau (±0 mV)", "Tidak ada perbedaan potensial antardaerah ventrikel", "Tidak ada arus yang mengalir di antara sel", "Elektrode tidak menangkap apa pun → garis isoelektrik"] },
            { label: "Mengapa T searah dengan QRS (padahal repolarisasi)?", nodes: ["Repolarisasi = muatan berlawanan dengan depolarisasi", "Tetapi arahnya terbalik: sel epikardium repolarisasi LEBIH DULU (potensial aksinya lebih pendek)", "Muatan berlawanan + arah berlawanan = defleksi searah", "Maka T normal di sadapan II positif, sama seperti QRS"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Kertas EKG: hitung denyut jantung", emoji: "📏", html: `
          <p>Kertas EKG berjalan 25 mm/detik: 1 kotak kecil = <b>0,04 s</b>, 1 kotak besar = <b>0,2 s</b>. Geser HR, lalu hitung sendiri dengan rumus <b>HR = 300 ÷ jumlah kotak besar antara dua R</b>.</p>
          <div class="slider-row"><label for="ehr">Denyut jantung <output id="ehr-o"></output></label><input type="range" id="ehr" min="40" max="180" value="75"></div>
          <div class="viz-wrap" style="overflow-x:auto"><svg id="paper" viewBox="0 0 500 170" role="img" aria-label="Strip EKG di kertas berpetak"></svg></div>
          <div class="readouts">
            <div class="readout"><span>Jarak R–R</span><b id="rr-o"></b></div>
            <div class="readout"><span>300 ÷ kotak besar</span><b id="calc-o"></b></div>
            <div class="readout"><span>Interval PR</span><b>0,16 s</b></div>
            <div class="readout"><span>Interval QT</span><b id="qt-o"></b></div>
          </div>
          <div class="callout" id="paper-msg"></div>`,
          init(el) {
            const hr = K.$("#ehr", el), svg = K.$("#paper", el);
            // 500 px = 3 detik → 1 detik = 166.7 px; kotak kecil 0.04 s = 6.67 px
            const PX = 500 / 3, small = PX * 0.04;
            let grid = "";
            for (let x = 0; x <= 500; x += small) grid += `<line x1="${x}" y1="0" x2="${x}" y2="150" stroke="var(--primary)" stroke-width="${Math.round(x / small) % 5 === 0 ? .9 : .25}" opacity=".5"/>`;
            for (let y = 0; y <= 150; y += small) grid += `<line x1="0" y1="${y}" x2="500" y2="${y}" stroke="var(--primary)" stroke-width="${Math.round(y / small) % 5 === 0 ? .9 : .25}" opacity=".5"/>`;
            svg.innerHTML = `<rect width="500" height="150" fill="var(--surface)"/>${grid}<path id="ptrace" fill="none" stroke="var(--text)" stroke-width="2"/><g id="rr-mark"></g>`;
            function draw() {
              const H = +hr.value, RR = 60000 / H;
              const qt = 400 * Math.sqrt(RR / 1000);
              const one = (t) => { // EKG dengan QT menyesuaikan HR
                const ph = ((t % RR) + RR) % RR;
                const shift = Math.max(0, 800 - RR) * 0;
                return 0.15 * g(ph, 60, 18) - 0.12 * g(ph, 168, 5) + 1.0 * g(ph, 185, 7) - 0.25 * g(ph, 202, 6) + 0.3 * g(ph, 160 + qt * 0.62, 38 * Math.sqrt(RR / 800)) + (ph > RR - 60 ? 0.15 * g(ph - RR, 60, 18) : 0);
              };
              K.$("#ptrace", svg).setAttribute("d", K.plot(one, 0, 3000, (t) => t / 1000 * PX, (v) => 105 - v * 70, 900));
              const r1 = 185, r2 = 185 + RR;
              const X1 = r1 / 1000 * PX, X2 = r2 / 1000 * PX;
              K.$("#rr-mark", svg).innerHTML = X2 < 500 ? `<line x1="${X1}" y1="18" x2="${X2}" y2="18" stroke="var(--accent)" stroke-width="2"/><line x1="${X1}" y1="12" x2="${X1}" y2="24" stroke="var(--accent)" stroke-width="2"/><line x1="${X2}" y1="12" x2="${X2}" y2="24" stroke="var(--accent)" stroke-width="2"/><text class="svg-label small" x="${(X1 + X2) / 2}" y="14" text-anchor="middle" style="fill:var(--accent)">R–R</text>` : "";
              const big = RR / 200;
              K.$("#ehr-o", el).textContent = H + " x/menit";
              K.$("#rr-o", el).innerHTML = `${(RR / 1000).toFixed(2).replace(".", ",")} s <small>(${big.toFixed(1).replace(".", ",")} kotak besar)</small>`;
              K.$("#calc-o", el).innerHTML = `${(300 / big).toFixed(0)}<small> x/mnt</small>`;
              K.$("#qt-o", el).innerHTML = `${(qt / 1000).toFixed(2).replace(".", ",")} s`;
              K.$("#paper-msg", el).className = H < 60 ? "callout warn" : H > 100 ? "callout red" : "callout green";
              K.$("#paper-msg", el).innerHTML = `<p>${H < 60 ? "<b>Bradikardia</b> (&lt; 60 x/menit)." : H > 100 ? "<b>Takikardia</b> (&gt; 100 x/menit)." : "Laju normal (60–100 x/menit)."} Perhatikan: saat HR naik, yang paling memendek adalah <b>segmen TP</b> (diastol); interval QT juga ikut memendek.</p>`;
            }
            hr.addEventListener("input", draw); draw();
          } },
        { type: "match", heading: "Cocokkan bagian EKG dengan peristiwanya", emoji: "🧩", intro: "Ketuk bagian EKG di kiri, lalu peristiwa listriknya di kanan.",
          pairs: [["Gelombang P", "Depolarisasi atrium"], ["Interval PR", "Waktu hantaran dari atrium ke ventrikel (termasuk jeda AV)"], ["Kompleks QRS", "Depolarisasi ventrikel"], ["Segmen ST", "Seluruh ventrikel dalam fase plateau"], ["Gelombang T", "Repolarisasi ventrikel"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika listriknya berubah…", emoji: "🩺", intro: "Pikirkan dulu: bagian EKG mana yang mewakili proses yang terganggu?",
          items: [
            { icon: "📐", title: "PR memanjang (> 0,20 s)", chain: ["Hantaran melalui AV node melambat", "Jeda antara P dan QRS bertambah panjang", "Blok AV derajat 1 — biasanya tanpa gejala, tetapi perlu dipantau"] },
            { icon: "↔️", title: "QRS melebar (≥ 0,12 s)", chain: ["Depolarisasi ventrikel tidak lewat jalur cepat (mis. blok cabang berkas)", "Impuls merambat lewat otot yang lambat", "QRS lebar dan bentuknya berubah"] },
            { icon: "⛰️", title: "Elevasi segmen ST", chain: ["Otot ventrikel yang cedera akut (infark) tidak dapat mempertahankan plateau normal", "Muncul perbedaan potensial antara area sehat dan cedera saat ST", "Segmen ST tidak lagi isoelektrik → naik di sadapan yang menghadap area cedera"] },
            { icon: "🌊", title: "Tidak ada gelombang P, irama tidak teratur", chain: ["Atrium tidak berdepolarisasi teratur dari SA node, melainkan kacau", "Tidak ada gelombang P yang jelas; AV node menerima impuls tak beraturan", "Fibrilasi atrium: R–R tidak teratur"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Saat segmen ST, apa yang sedang terjadi pada ventrikel?",
          options: ["Ventrikel berelaksasi dan terisi", "Seluruh sel ventrikel berada di plateau dan ventrikel sedang memompa darah", "Ventrikel mulai berdepolarisasi", "Atrium berkontraksi"], answer: 1,
          explain: "ST sesuai dengan fase 2 (plateau) seluruh sel ventrikel. Karena potensialnya sama, garis datar. Secara mekanik ini masa ejeksi." },
        { q: "Mengapa repolarisasi atrium biasanya tidak terlihat di EKG?",
          options: ["Atrium tidak mengalami repolarisasi", "Terjadi bersamaan dengan QRS yang jauh lebih besar sehingga tertutup", "Terjadi saat gelombang T", "Elektrode tidak bisa merekam atrium"], answer: 1,
          explain: "Repolarisasi atrium terjadi saat ventrikel berdepolarisasi. Sinyal QRS yang besar menutupinya." },
        { q: "Interval PR seorang pasien 0,28 detik, dan setiap P diikuti QRS. Gangguan paling mungkin ada di…",
          options: ["SA node", "AV node", "Serabut Purkinje kiri", "Otot ventrikel"], answer: 1,
          explain: "Interval PR terutama mencerminkan jeda di AV node. PR > 0,20 s dengan konduksi 1:1 = blok AV derajat 1." },
        { q: "Pada sadapan II (+60°), QRS normal tampak dominan positif karena…",
          options: ["Ventrikel kiri berada di kanan tubuh", "Arah rata-rata depolarisasi ventrikel (±+60°) menuju elektrode positif sadapan II", "Sadapan II hanya merekam atrium", "Depolarisasi menjauhi elektrode"], answer: 1,
          explain: "Depolarisasi yang bergerak menuju elektrode positif menghasilkan defleksi ke atas. Aksis normal ±+60° hampir sejajar dengan sadapan II." },
        { q: "Pada EKG, jarak R–R adalah 4 kotak besar. Berapa denyut jantungnya?",
          options: ["±50 x/menit", "±75 x/menit", "±100 x/menit", "±150 x/menit"], answer: 1,
          explain: "HR = 300 ÷ 4 = 75 x/menit (1 kotak besar = 0,2 s, jadi R–R = 0,8 s → 60/0,8 = 75)." },
      ]},
    ],
  });
})();
