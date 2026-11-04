/* Modul A5 — Sistem Hantaran Jantung */
(function () {
  /* ---------- Model aktivasi jantung ---------- */
  const SCN = {
    normal: { name: "Normal", Pa: 800, linked: true, delay: 130 },
    avb: { name: "Blok AV total", Pa: 800, linked: false, Pv: 1500 },
    sa: { name: "SA node berhenti", Pa: 0, linked: false, Pv: 1200, junctional: true },
    lbbb: { name: "Blok cabang berkas kiri", Pa: 800, linked: true, delay: 130, lbbb: true },
    wpw: { name: "Jalur aksesori (WPW)", Pa: 800, linked: true, delay: 130, wpw: true },
  };
  const inW = (t, a, b) => t >= a && t <= b;
  const frac = (t, a, b) => K.clamp((t - a) / (b - a), 0, 1);

  /** Hitung status semua elemen pada waktu t (ms) */
  function stateAt(scn, t) {
    const s = { reg: {}, cond: {}, node: {}, dots: [], ecg: 0 };
    const tA = scn.Pa ? t % scn.Pa : -1;
    let tV;
    if (scn.linked) tV = ((t - scn.delay) % scn.Pa + scn.Pa) % scn.Pa;
    else tV = t % scn.Pv;
    // Atrium
    if (tA >= 0) {
      s.node.sa = inW(tA, 0, 15);
      s.reg.ra = inW(tA, 10, 160); s.reg.la = inW(tA, 35, 185);
      if (inW(tA, 0, 50)) { s.cond.inter = true; s.dots.push(["inter", frac(tA, 0, 50)]); }
      if (inW(tA, 0, 40)) { s.cond.bach = true; s.dots.push(["bach", frac(tA, 0, 40)]); }
      if (inW(tA, 50, 130)) s.node.av = true;
      if (scn.wpw && inW(tA, 40, 70)) { s.cond.acc = true; s.dots.push(["acc", frac(tA, 40, 70)]); }
      // EKG: gelombang P
      s.ecg += 0.15 * Math.exp(-((tA - 50) ** 2) / (2 * 22 ** 2));
    }
    // Ventrikel (relatif terhadap aktivasi His = 0)
    if (scn.junctional && inW(tV, -1, 8)) s.node.av = true;
    if (inW(tV, 0, 10)) { s.cond.his = true; s.dots.push(["his", frac(tV, 0, 10)]); }
    if (inW(tV, 10, 30)) { s.cond.rbb = true; s.dots.push(["rbb", frac(tV, 10, 30)]); if (!scn.lbbb) { s.cond.lbb = true; s.dots.push(["lbb", frac(tV, 10, 30)]); } }
    if (inW(tV, 30, 55)) { s.cond.purkR = true; s.dots.push(["purkR", frac(tV, 30, 55)]); if (!scn.lbbb) { s.cond.purkL = true; s.dots.push(["purkL", frac(tV, 30, 55)]); } }
    const sepOn = scn.lbbb ? 50 : 35, rvOn = 55, lvOn = scn.lbbb ? 115 : 50;
    s.reg.sep = inW(tV, sepOn, 330); s.reg.rv = inW(tV, rvOn, 340);
    s.reg.lv = inW(tV, lvOn, 350) || (scn.wpw && tA >= 0 && inW(tA, 70, 130));
    // EKG: QRS & T
    const g = (x, m, w) => Math.exp(-((x - m) ** 2) / (2 * w * w));
    if (scn.lbbb) s.ecg += 0.9 * g(tV, 75, 22) - 0.15 * g(tV, 45, 10) + 0.5 * g(tV, 110, 14) - 0.25 * g(tV, 300, 45);
    else s.ecg += -0.1 * g(tV, 38, 5) + 1.0 * g(tV, 48, 6) - 0.25 * g(tV, 60, 5) + 0.3 * g(tV, 300, 45);
    if (scn.wpw && tA >= 0) s.ecg += 0.35 * (inW(tA, 75, 130) ? frac(tA, 75, 130) : 0) * (tV > 30 || tV < -200 ? 0 : 1);
    return s;
  }

  function makeRenderer(svg) {
    const regs = {}; K.$$("[data-r]", svg).forEach((e) => regs[e.dataset.r] = e);
    const conds = {}; K.$$("[data-c]", svg).forEach((e) => conds[e.dataset.c] = e);
    const nodes = {}; K.$$("[data-n]", svg).forEach((e) => nodes[e.dataset.n] = e);
    const dotLayer = K.$(".h-dots", svg);
    const NS = "http://www.w3.org/2000/svg";
    return function render(s, scn) {
      Object.entries(regs).forEach(([k, e]) => e.classList.toggle("on", !!s.reg[k]));
      Object.entries(conds).forEach(([k, e]) => e.classList.toggle("on", !!s.cond[k]));
      Object.entries(nodes).forEach(([k, e]) => e.classList.toggle("on", !!s.node[k]));
      conds.acc.style.display = scn && scn.wpw ? "" : "none";
      conds.lbb.style.strokeDasharray = scn && scn.lbbb ? "3 6" : "";
      conds.purkL.style.strokeDasharray = scn && scn.lbbb ? "3 6" : "";
      dotLayer.innerHTML = "";
      s.dots.forEach(([k, f]) => {
        const p = conds[k], pt = p.getPointAtLength(p.getTotalLength() * f);
        const c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.setAttribute("r", 6);
        c.setAttribute("fill", "#ffd43b"); c.setAttribute("stroke", "#e8590c"); c.setAttribute("stroke-width", 2);
        dotLayer.appendChild(c);
      });
    };
  }

  const STEPS = [
    { title: "1. SA node menembak", body: "Impuls lahir di <b>SA node</b>, di dinding atrium kanan dekat muara vena kava superior. Ia adalah pacemaker alami karena menembak paling cepat (60–100 x/menit).", key: "SA node = “dirigen” orkestra jantung.", w: [0, 25], sp: 40 },
    { title: "2. Menyebar ke kedua atrium", body: "Impuls menyebar dari sel ke sel melalui otot atrium dan jalur internodal ke AV node, serta lewat <b>berkas Bachmann</b> ke atrium kiri. Kedua atrium terdepolarisasi lalu berkontraksi.", key: "Atrium kanan aktif sedikit lebih dulu dari atrium kiri.", w: [0, 100], sp: 80 },
    { title: "3. AV node: rem sebentar", body: "Impuls tiba di <b>AV node</b> lalu <b>diperlambat ±0,1 detik</b>. Sel AV node kecil, gap junction-nya sedikit, dan depolarisasinya oleh Ca²⁺ yang lambat.", key: "Jeda ini memberi waktu atrium memompa darah ke ventrikel sebelum ventrikel berkontraksi.", w: [40, 140], sp: 60 },
    { title: "4. Berkas His menembus rangka fibrosa", body: "Dari AV node, impuls masuk <b>berkas His</b> — satu-satunya jembatan listrik normal melewati rangka fibrosa antara atrium dan ventrikel.", key: "Tidak ada jalan lain (kecuali jalur aksesori yang abnormal).", w: [125, 148], sp: 20 },
    { title: "5. Cabang berkas kanan & kiri", body: "Berkas His terbelah menjadi <b>cabang kanan</b> dan <b>cabang kiri</b> yang turun di kedua sisi septum menuju apeks.", key: "Septum adalah bagian ventrikel yang pertama tereksitasi.", w: [135, 168], sp: 25 },
    { title: "6. Serabut Purkinje: jalan tol", body: "Serabut <b>Purkinje</b> menghantar paling cepat (±4 m/detik) dan menyebar di permukaan dalam (endokardium) ventrikel, dari apeks naik ke basis.", key: "Kecepatan tinggi → seluruh ventrikel aktif hampir serentak.", w: [155, 195], sp: 30 },
    { title: "7. Otot ventrikel berkontraksi", body: "Impuls berpindah ke otot ventrikel: dari <b>apeks ke basis</b> dan dari <b>endokardium ke epikardium</b>. Ventrikel memeras darah ke atas menuju aorta dan arteri pulmonalis — seperti memeras pasta gigi dari bawah.", key: "Urutan apeks → basis mengarahkan darah ke katup keluar di bagian atas.", w: [160, 260], sp: 60 },
    { title: "8. Satu siklus utuh", body: "Lihat seluruh urutan berulang dalam kecepatan lambat. Perhatikan jeda di AV node sebelum ventrikel aktif.", key: "SA → atrium → AV (jeda) → His → cabang berkas → Purkinje → ventrikel.", w: [0, 800], sp: 300 },
  ];

  registerModule({
    id: "a05",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Kabel listrik jantung", emoji: "💡", html: `
          <p>Di A4 kamu belajar ±1% sel jantung adalah <b>sel autoritmik</b>. Sel-sel ini membentuk <b>sistem hantaran</b>: jalur khusus yang membuat dan menyebarkan impuls dengan urutan dan waktu yang tepat.</p>
          <ul class="key-points">
            <li><span class="k-ico">🎯</span><span><b>Urutan</b>: atrium dulu, baru ventrikel.</span></li>
            <li><span class="k-ico">⏸️</span><span><b>Jeda</b> di AV node agar ventrikel terisi penuh.</span></li>
            <li><span class="k-ico">🤝</span><span><b>Serempak</b>: seluruh ventrikel berkontraksi hampir bersamaan berkat Purkinje.</span></li>
          </ul>
          <div class="viz-wrap" style="max-width:340px;margin:12px auto 0"><svg viewBox="0 0 300 290">${K.heartSVG("g")}</svg></div>` ,
          init(el, secEl) {
            const svg = K.$("svg", el), r = makeRenderer(svg); let t = 0;
            K.loop(secEl, (dt) => { t += dt * 600; r(stateAt(SCN.normal, t), SCN.normal); });
          } },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Perjalanan satu impuls", emoji: "⚡", intro: "Setiap langkah diputar dalam gerak lambat. Klik nodus atau jalur untuk penjelasan.",
          viz: `<svg viewBox="0 0 300 290" role="img" aria-label="Sistem hantaran jantung">${K.heartSVG("x")}</svg>
            <div class="readouts" style="margin-top:6px"><div class="readout"><span>Waktu sejak SA node menembak</span><b id="t-ms">0 ms</b></div></div>`,
          steps: STEPS,
          info: {
            sa: ["SA node (nodus sinoatrial)", "Pacemaker utama (60–100 x/menit). Terletak di dinding atrium kanan dekat muara vena kava superior."],
            av: ["AV node (nodus atrioventrikular)", "Di septum atrium bagian bawah. Konduksinya paling lambat (±0,05 m/s) → jeda ±0,1 s. Pacemaker cadangan 40–60 x/menit."],
            his: ["Berkas His", "Menembus rangka fibrosa — satu-satunya penghubung listrik normal atrium–ventrikel."],
            lbb: ["Cabang berkas kiri", "Turun di sisi kiri septum; bercabang lagi menjadi fasikulus anterior dan posterior."],
            rbb: ["Cabang berkas kanan", "Turun di sisi kanan septum menuju apeks ventrikel kanan."],
            purkL: ["Serabut Purkinje", "Konduksi tercepat (±4 m/s), menyebar di endokardium. Pacemaker cadangan terakhir 20–40 x/menit."],
            purkR: ["Serabut Purkinje", "Konduksi tercepat (±4 m/s), menyebar di endokardium. Pacemaker cadangan terakhir 20–40 x/menit."],
            inter: ["Jalur internodal", "Jalur otot atrium yang menghantar impuls dari SA node ke AV node."],
            bach: ["Berkas Bachmann", "Membawa impuls dari atrium kanan ke atrium kiri."],
          },
          onStep(i, s, api) { api._w = s.w; api._sp = s.sp; api._t = s.w[0]; },
          init(api, secEl) {
            const svg = K.$("svg", api.viz), r = makeRenderer(svg);
            K.loop(secEl, (dt) => {
              if (!api._w) return;
              api._t += dt * api._sp;
              if (api._t > api._w[1] + 20) api._t = api._w[0];
              const t = Math.min(api._t, api._w[1]);
              r(stateAt(SCN.normal, t), SCN.normal);
              K.$("#t-ms", api.el).textContent = Math.round(t) + " ms";
            });
          },
        },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { heading: "Kecepatan konduksi tiap bagian", emoji: "🏎️", html: `
          <p>Bandingkan seberapa cepat impuls merambat. Tekan tombol untuk menganimasikan.</p>
          <div id="vel"></div>
          <button class="btn btn-sm btn-primary" id="vel-btn" type="button">📊 Tampilkan</button>
          <div class="callout" style="margin-top:12px"><p>AV node ±80× lebih lambat dari Purkinje. Lambat bukan berarti buruk — <b>lambat di AV node itu disengaja</b>.</p></div>`,
          init(el) {
            const V = [["Otot atrium", 1], ["AV node", .05], ["Berkas His & cabangnya", 2], ["Serabut Purkinje", 4], ["Otot ventrikel", .5]];
            K.$("#vel", el).innerHTML = V.map(([n, v]) => `<div class="bar-row"><div class="bar-label"><span>${n}</span><b>${v} m/s</b></div><div class="bar"><span data-w="${Math.max(1.5, v / 4 * 100)}" style="width:0;background:${n === "AV node" ? "var(--warn)" : "var(--primary)"}"></span></div></div>`).join("");
            K.$("#vel-btn", el).addEventListener("click", () => K.$$("#vel .bar > span", el).forEach((s, i) => { s.style.width = 0; setTimeout(() => s.style.width = s.dataset.w + "%", 100 + i * 150); }));
          } },
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa perlu jeda di AV node?", nodes: ["Atrium dan ventrikel harus berkontraksi bergantian, bukan bersamaan", "AV node memperlambat impuls ±0,1 detik", "Selama jeda, atrium berkontraksi dan mendorong sisa darah ke ventrikel", "Ventrikel terisi penuh sebelum mulai memompa", "Volume sekuncup optimal (kaitan dengan A13)"] },
            { label: "Mengapa Purkinje harus cepat?", nodes: ["Ventrikel adalah massa otot besar", "Jika impuls hanya merambat dari sel ke sel otot (lambat), sebagian ventrikel berkontraksi jauh lebih dulu", "Kontraksi tidak serempak → pemompaan tidak efisien", "Purkinje mengantar impuls ke seluruh endokardium dalam ±0,03 detik", "Seluruh ventrikel berkontraksi hampir bersamaan → tekanan naik kuat"] },
            { label: "Mengapa SA node yang memimpin?", nodes: ["Semua sel autoritmik bisa menembak sendiri, tetapi dengan kecepatan berbeda", "SA node 60–100, AV node 40–60, Purkinje 20–40 x/menit", "SA node mencapai ambang paling dulu dan memicu sel lain sebelum mereka sempat menembak sendiri", "Pacemaker yang lebih lambat “ditekan” (overdrive suppression)", "Jika SA node gagal, pacemaker cadangan berikutnya mengambil alih dengan laju lebih lambat"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator gangguan hantaran", emoji: "🎚️", html: `
          <p>Pilih skenario dan amati jantung serta “strip EKG” sederhananya. Bandingkan dengan kondisi normal.</p>
          <div class="toggle-row" id="scn-btns"></div>
          <div class="two-col">
            <div class="viz-wrap"><svg id="scn-heart" viewBox="0 0 300 290">${K.heartSVG("s")}</svg></div>
            <div>
              <div class="readouts">
                <div class="readout"><span>Laju atrium</span><b id="ro-a">–</b></div>
                <div class="readout"><span>Laju ventrikel</span><b id="ro-v">–</b></div>
              </div>
              <div class="viz-wrap"><svg id="strip" viewBox="0 0 300 110" role="img" aria-label="Strip EKG">
                <line class="svg-grid" x1="0" y1="70" x2="300" y2="70"/>
                <polyline id="strip-line" fill="none" stroke="var(--primary)" stroke-width="2"/>
              </svg><div class="legend"><span>Strip EKG sederhana (lihat A8)</span></div></div>
              <div class="callout" id="scn-msg"></div>
            </div>
          </div>`,
          init(el, secEl) {
            const MSG = {
              normal: "Setiap gelombang P (atrium) selalu diikuti QRS (ventrikel) setelah jeda yang tetap.",
              avb: "Impuls atrium <b>tidak dapat melewati</b> AV node. Atrium tetap dipimpin SA node (±75 x/menit), sedangkan ventrikel dipimpin pacemaker cadangan yang lambat (±40 x/menit). P dan QRS berjalan sendiri-sendiri.",
              sa: "SA node berhenti → tidak ada gelombang P. Pacemaker cadangan di sekitar AV node (junctional) mengambil alih dengan laju ±50 x/menit.",
              lbbb: "Cabang kiri tidak menghantar. Ventrikel kiri harus tereksitasi lewat otot dari sisi kanan — lambat! QRS menjadi <b>lebar</b> dan VKi berkontraksi terlambat.",
              wpw: "Ada <b>jalur aksesori</b> yang melompati AV node. Sebagian VKi teraktivasi lebih awal (praeksitasi) → jarak P–QRS memendek dan QRS awalnya landai (gelombang delta).",
            };
            const btns = K.$("#scn-btns", el);
            btns.innerHTML = Object.entries(SCN).map(([k, v]) => `<button class="btn btn-sm" type="button" data-k="${k}">${v.name}</button>`).join("");
            const r = makeRenderer(K.$("#scn-heart", el));
            let cur = "normal", t = 0; const buf = new Array(300).fill(0);
            function pick(k) {
              cur = k; t = 0; buf.fill(0);
              K.$$("button", btns).forEach((b) => b.classList.toggle("on", b.dataset.k === k));
              const s = SCN[k];
              K.$("#ro-a", el).innerHTML = s.Pa ? `${Math.round(60000 / s.Pa)}<small> x/mnt</small>` : "tidak ada";
              K.$("#ro-v", el).innerHTML = `${Math.round(60000 / (s.linked ? s.Pa : s.Pv))}<small> x/mnt</small>`;
              K.$("#scn-msg", el).className = k === "normal" ? "callout green" : "callout red";
              K.$("#scn-msg", el).innerHTML = `<p>${MSG[k]}</p>`;
            }
            K.$$("button", btns).forEach((b) => b.addEventListener("click", () => pick(b.dataset.k)));
            pick("normal");
            let acc = 0;
            K.loop(secEl, (dt) => {
              const sp = 500; t += dt * sp; acc += dt * sp;
              const s = stateAt(SCN[cur], t);
              r(s, SCN[cur]);
              while (acc >= 10) { acc -= 10; buf.shift(); buf.push(stateAt(SCN[cur], t - acc).ecg); }
              K.$("#strip-line", el).setAttribute("points", buf.map((v, i) => `${i},${(70 - v * 55).toFixed(1)}`).join(" "));
            });
          } },
        { type: "order", heading: "Susun jalur impuls", emoji: "🧩", intro: "Mulai dari SA node. Ketuk struktur berikutnya.",
          items: ["SA node", "Otot atrium", "AV node", "Berkas His", "Cabang berkas kanan & kiri", "Serabut Purkinje", "Otot ventrikel"],
          hints: { "Otot atrium": "Impuls menyebar dulu ke ruang di sekitar SA node.", "AV node": "Pintu gerbang di antara atrium dan ventrikel.", "Berkas His": "Satu-satunya jembatan melewati rangka fibrosa.", "Cabang berkas kanan & kiri": "Berkas His terbelah dua di septum.", "Serabut Purkinje": "Jaringan cepat di endokardium.", "Otot ventrikel": "Tujuan akhir." },
          done: "<b>Tepat!</b> Ingat jedanya: impuls paling lama tertahan di AV node." },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika jalurnya terganggu…", emoji: "🩺", intro: "Tanyakan: di titik mana impuls terhambat, dan siapa yang mengambil alih?",
          items: [
            { icon: "🚧", title: "Blok AV", chain: ["AV node/His tidak menghantar dengan baik", "Derajat ringan: jeda memanjang; derajat berat: sebagian/seluruh impuls tidak sampai ke ventrikel", "Ventrikel dipimpin pacemaker cadangan yang lambat → bradikardia, pusing, pingsan; mungkin butuh alat pacu jantung"] },
            { icon: "↔️", title: "Blok cabang berkas", chain: ["Salah satu cabang berkas tidak menghantar", "Ventrikel sisi itu teraktivasi lewat otot (lambat)", "QRS melebar dan kontraksi kedua ventrikel tidak serempak"] },
            { icon: "🛣️", title: "Jalur aksesori (WPW)", chain: ["Ada jembatan otot tambahan di rangka fibrosa", "Impuls melompati jeda AV node", "Praeksitasi; jalur ganda dapat membentuk sirkuit putar → takikardia mendadak"] },
            { icon: "🕰️", title: "Sick sinus syndrome", chain: ["SA node tidak menembak dengan teratur", "Jeda panjang sampai pacemaker cadangan mengambil alih", "Bradikardia/jeda → lelah, pusing, pingsan"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Apa fungsi utama perlambatan impuls di AV node?",
          options: ["Mencegah atrium berkontraksi", "Memberi waktu atrium mengisi ventrikel sebelum ventrikel berkontraksi", "Mempercepat denyut jantung", "Membuat ventrikel berkontraksi dari basis ke apeks"], answer: 1,
          explain: "Jeda ±0,1 s membuat kontraksi atrium selesai mendorong darah ke ventrikel sebelum ventrikel mulai berkontraksi dan katup AV menutup." },
        { q: "Jika SA node berhenti total, apa yang paling mungkin terjadi?",
          options: ["Jantung langsung berhenti permanen", "AV node/junction mengambil alih dengan laju ±40–60 x/menit", "Purkinje mengambil alih dengan laju 100 x/menit", "Atrium tetap berkontraksi normal"], answer: 1,
          explain: "Pacemaker cadangan berikutnya yang tercepat adalah area AV junction (40–60 x/menit). Jika itu juga gagal, Purkinje (20–40 x/menit)." },
        { q: "Mengapa kontraksi ventrikel dimulai dari apeks menuju basis?",
          options: ["Karena darah lebih berat di apeks", "Karena serabut Purkinje menyebar dari apeks naik ke basis, sehingga darah terperas ke arah katup keluar di atas", "Karena SA node terletak di apeks", "Karena basis tidak punya otot"], answer: 1,
          explain: "Cabang berkas turun ke apeks lalu Purkinje naik ke basis. Aktivasi apeks → basis memeras darah ke atas, ke arah katup aorta dan pulmonal." },
        { q: "Pada blok cabang berkas kiri, mengapa kompleks QRS melebar?",
          options: ["Karena atrium berdepolarisasi lebih lama", "Karena VKi harus diaktivasi lewat otot ventrikel yang konduksinya lambat", "Karena AV node menghantar lebih cepat", "Karena jumlah sel ventrikel bertambah"], answer: 1,
          explain: "Tanpa cabang kiri, impuls dari sisi kanan menyebar ke VKi lewat otot biasa (±0,5 m/s, bukan 4 m/s), sehingga depolarisasi ventrikel butuh waktu lebih lama." },
        { q: "Mengapa impuls atrium normalnya hanya bisa ke ventrikel melalui AV node–berkas His?",
          options: ["Karena otot ventrikel tidak dapat dieksitasi", "Karena rangka fibrosa jantung bersifat isolator listrik", "Karena katup jantung menghalangi impuls", "Karena atrium tidak memiliki gap junction"], answer: 1,
          explain: "Rangka fibrosa memisahkan sinsitium atrium dan ventrikel. Jalur lain hanya ada pada kelainan seperti jalur aksesori (WPW)." },
      ]},
    ],
  });
})();
