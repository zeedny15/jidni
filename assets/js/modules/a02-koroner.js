/* Modul A2 — Sirkulasi Koroner */
registerModule({
  id: "a02",
  sections: [
    { id: "gambaran", title: "Gambaran Besar", cards: [
      { heading: "Jantung juga butuh “makan”", emoji: "💡", html: `
        <p>Darah yang lewat di dalam ruang jantung <b>tidak</b> memberi makan otot jantung — dindingnya terlalu tebal. Otot jantung (miokardium) mendapat darah dari pembuluh khusus: <b>arteri koroner</b>.</p>
        <ul class="key-points">
          <li><span class="k-ico">🌱</span><span>Arteri koroner <b>kanan</b> dan <b>kiri</b> berasal dari pangkal aorta, tepat di atas katup aorta — jadi merekalah yang <b>pertama</b> mendapat darah kaya O₂.</span></li>
          <li><span class="k-ico">⚡</span><span>Jantung menyedot O₂ sangat rakus: saat istirahat ±<b>70–75%</b> O₂ sudah diambil dari darah koroner (otot rangka hanya ±25%).</span></li>
          <li><span class="k-ico">⏱️</span><span>Ventrikel kiri terutama mendapat aliran saat <b>diastol</b> (relaksasi), karena saat sistol pembuluhnya terjepit oleh otot yang berkontraksi.</span></li>
        </ul>
        <div class="callout"><p><b>Kaitan dengan A1:</b> aliran koroner adalah cabang pertama dari <b>sirkulasi sistemik</b>. Darah baliknya masuk ke <b>atrium kanan</b> lewat sinus koronarius.</p></div>` },
    ]},

    { id: "tahap", title: "Langkah demi Langkah", cards: [
      { type: "explorer", heading: "Peta pembuluh koroner", emoji: "🗺️",
        intro: "Ikuti cabang demi cabang. Klik pembuluh, nodus, atau area yang diwarnai untuk penjelasan.",
        viz: `<svg viewBox="0 0 400 390" role="img" aria-label="Diagram arteri koroner">
          <defs><clipPath id="heartClip"><path d="M115,112 C55,140 62,262 200,360 C338,262 345,140 285,112 C255,98 145,98 115,112 Z"/></clipPath></defs>
          <path d="M115,112 C55,140 62,262 200,360 C338,262 345,140 285,112 C255,98 145,98 115,112 Z" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2"/>
          <g clip-path="url(#heartClip)">
            <ellipse class="terr" data-terr="lad" data-info="t_lad" cx="225" cy="250" rx="60" ry="95" fill="#f08c00" opacity="0"/>
            <ellipse class="terr" data-terr="lcx" data-info="t_lcx" cx="320" cy="200" rx="50" ry="80" fill="#7048e8" opacity="0"/>
            <ellipse class="terr" data-terr="rca" data-info="t_rca" cx="125" cy="235" rx="62" ry="95" fill="#1c7ed6" opacity="0"/>
          </g>
          <!-- aorta -->
          <path d="M200,118 V62 C200,22 285,22 285,62 V96" fill="none" stroke="var(--o2-rich)" stroke-width="22" stroke-linecap="round" data-info="aorta"/>
          <text class="svg-label small" x="245" y="20" text-anchor="middle">Aorta</text>
          <!-- vena -->
          <path class="cor" data-v="vein" d="M238,320 C228,260 245,190 262,145 C285,150 320,165 330,200 C335,250 300,300 250,330 C210,345 170,335 140,320" fill="none" stroke="var(--o2-poor)" stroke-width="4" stroke-dasharray="6 5" data-info="vein" opacity=".25"/>
          <!-- arteri -->
          <path class="cor" data-v="rca" d="M193,120 C165,125 138,138 124,162 C104,202 110,252 140,292" fill="none" stroke="var(--o2-rich)" stroke-width="7" stroke-linecap="round" data-info="rca"/>
          <path class="cor" data-v="rmarg" d="M116,210 C135,235 148,255 160,280" fill="none" stroke="var(--o2-rich)" stroke-width="4" stroke-linecap="round" data-info="rca"/>
          <path class="cor" data-v="pda" d="M140,292 C162,318 182,334 200,350" fill="none" stroke="var(--o2-rich)" stroke-width="5" stroke-dasharray="7 5" stroke-linecap="round" data-info="pda"/>
          <path class="cor" data-v="lmca" d="M208,120 C225,124 240,128 256,134" fill="none" stroke="var(--o2-rich)" stroke-width="9" stroke-linecap="round" data-info="lmca"/>
          <path class="cor" data-v="lad" d="M256,134 C240,182 222,262 200,350" fill="none" stroke="var(--o2-rich)" stroke-width="7" stroke-linecap="round" data-info="lad"/>
          <path class="cor" data-v="diag" d="M243,190 C262,212 276,234 288,258" fill="none" stroke="var(--o2-rich)" stroke-width="4" stroke-linecap="round" data-info="lad"/>
          <path class="cor" data-v="lcx" d="M256,134 C292,140 313,166 318,202 C321,240 304,270 288,292" fill="none" stroke="var(--o2-rich)" stroke-width="7" stroke-linecap="round" data-info="lcx"/>
          <!-- nodus -->
          <circle data-info="sa" cx="150" cy="122" r="8" fill="var(--warn)" stroke="#fff" stroke-width="2"/>
          <text class="svg-label small" x="132" y="100" text-anchor="middle">SA node</text>
          <circle data-info="av" cx="178" cy="205" r="7" fill="var(--warn)" stroke="#fff" stroke-width="2"/>
          <text class="svg-label small" x="178" y="190" text-anchor="middle">AV node</text>
          <!-- label -->
          <text class="svg-label small lbl" data-l="rca" x="62" y="175">RCA</text>
          <text class="svg-label small lbl" data-l="lmca" x="236" y="112">LMCA</text>
          <text class="svg-label small lbl" data-l="lad" x="212" y="300">LAD</text>
          <text class="svg-label small lbl" data-l="lcx" x="330" y="250">LCx</text>
          <text class="svg-label small lbl" data-l="pda" x="120" y="335">PDA (belakang)</text>
          <text class="svg-label small" x="200" y="382" text-anchor="middle">Tampak depan · garis putus = di sisi belakang</text>
        </svg>`,
        info: {
          aorta: ["Pangkal aorta (sinus Valsalva)", "Dua ostium koroner berada di sini, tepat di atas daun katup aorta. Saat diastol, katup aorta menutup dan darah yang “memantul” mengisi ostium koroner."],
          rca: ["Arteri koroner kanan (RCA)", "Berjalan di sulkus atrioventrikular kanan. Memperdarahi atrium kanan, sebagian besar ventrikel kanan, dan pada ±60% orang juga SA node."],
          pda: ["Arteri desendens posterior (PDA)", "Pada ±70–80% orang (dominansi kanan) berasal dari RCA. Memperdarahi dinding inferior VKi dan 1/3 posterior septum, serta AV node."],
          lmca: ["Left main coronary artery (LMCA)", "Batang pendek yang segera bercabang dua: LAD dan LCx. Sumbatan di sini sangat berbahaya karena mengancam sebagian besar VKi."],
          lad: ["Left anterior descending (LAD)", "Turun di sulkus interventrikular anterior menuju apeks. Memperdarahi dinding anterior VKi, apeks, dan 2/3 anterior septum. Cabangnya: diagonal & septal."],
          lcx: ["Left circumflex (LCx)", "Melingkar ke kiri di sulkus AV kiri. Memperdarahi dinding lateral (dan sebagian posterior) VKi serta atrium kiri. Cabangnya: obtuse marginal."],
          vein: ["Vena jantung → sinus koronarius", "Vena kordis magna mengikuti LAD lalu LCx, bermuara ke sinus koronarius di sisi belakang, dan akhirnya masuk ke atrium kanan."],
          sa: ["SA node", "Pacemaker jantung. Diperdarahi cabang nodus SA, berasal dari RCA pada ±60% orang dan dari LCx pada ±40%."],
          av: ["AV node", "Diperdarahi cabang dari PDA — biasanya dari RCA. Itu sebabnya sumbatan RCA sering disertai gangguan hantaran AV."],
          t_lad: ["Wilayah LAD", "Dinding anterior VKi + apeks + 2/3 anterior septum — wilayah terbesar dari VKi."],
          t_lcx: ["Wilayah LCx", "Dinding lateral VKi dan atrium kiri."],
          t_rca: ["Wilayah RCA", "Ventrikel kanan, atrium kanan, dinding inferior VKi (melalui PDA), SA & AV node (pada sebagian besar orang)."],
        },
        steps: [
          { title: "Asal: pangkal aorta", body: "Arteri koroner kanan dan kiri keluar dari <b>sinus aorta</b>, tepat di atas katup aorta. Ini cabang pertama aorta — darahnya paling kaya O₂ dan bertekanan tinggi.", key: "Darah koroner adalah darah sistemik “pertama” yang keluar dari ventrikel kiri.", show: ["aorta"], terr: [] },
          { title: "Arteri koroner kiri (LMCA)", body: "Batang kiri utama (LMCA) pendek, lalu segera bercabang menjadi <b>LAD</b> dan <b>LCx</b>.", key: "LMCA memasok sebagian besar ventrikel kiri — pompa sistemik.", show: ["aorta", "lmca"], terr: [] },
          { title: "LAD: dinding depan & septum", body: "LAD turun di depan, di antara kedua ventrikel, menuju apeks. Ia memperdarahi <b>dinding anterior VKi</b>, <b>apeks</b>, dan <b>2/3 anterior septum</b>.", key: "LAD = arteri dengan wilayah terluas di VKi.", show: ["aorta", "lmca", "lad", "diag"], terr: ["lad"] },
          { title: "LCx: dinding samping", body: "LCx melingkar ke kiri di alur antara atrium dan ventrikel kiri, memperdarahi <b>dinding lateral VKi</b> dan <b>atrium kiri</b>.", key: "Circumflex = “melingkar”.", show: ["aorta", "lmca", "lcx"], terr: ["lcx"] },
          { title: "RCA: jantung kanan & nodus", body: "RCA berjalan di alur AV kanan. Ia memperdarahi <b>atrium & ventrikel kanan</b>, dan pada kebanyakan orang juga <b>SA node</b> serta <b>AV node</b>.", key: "RCA bermasalah → bisa muncul bradikardia atau blok AV.", show: ["aorta", "rca", "rmarg", "sa", "av"], terr: ["rca"] },
          { title: "PDA & dominansi", body: "Di sisi belakang, <b>PDA</b> memperdarahi dinding inferior VKi dan 1/3 posterior septum. Jika PDA berasal dari RCA (±70–80% orang) disebut <b>dominansi kanan</b>.", key: "“Dominan” ditentukan oleh siapa yang memberi PDA, bukan siapa yang lebih besar.", show: ["aorta", "rca", "pda", "av"], terr: ["rca"] },
          { title: "Aliran balik vena", body: "Setelah melewati kapiler miokardium, darah miskin O₂ dikumpulkan vena jantung → <b>sinus koronarius</b> → masuk ke <b>atrium kanan</b>.", key: "Sebagian kecil masuk langsung ke ruang jantung melalui vena Thebesian.", show: ["vein"], terr: [] },
          { title: "Kapan darah mengalir?", body: "Saat <b>sistol</b>, otot VKi menjepit pembuluh di dalam dindingnya → aliran koroner kiri hampir berhenti. Aliran terbesar justru saat <b>diastol</b>. Lihat grafiknya di bagian Interaksi.", key: "Koroner kiri = “makan” saat jantung beristirahat.", show: ["aorta", "lmca", "lad", "lcx", "diag", "rca", "rmarg", "pda"], terr: [], squeeze: true },
        ],
        init(api) {
          const svg = K.$("svg", api.viz);
          api._svg = svg;
        },
        onStep(i, s, api) {
          const svg = K.$("svg", api.viz);
          K.$$(".cor", svg).forEach((p) => { p.style.opacity = s.show.includes(p.dataset.v) ? 1 : (p.dataset.v === "vein" ? .12 : .18); });
          K.$$(".lbl", svg).forEach((t) => { t.style.opacity = s.show.includes(t.dataset.l) ? 1 : .3; });
          K.$$(".terr", svg).forEach((e) => { e.style.transition = "opacity .4s"; e.setAttribute("opacity", s.terr.includes(e.dataset.terr) ? .35 : 0); });
          K.$$('[data-info="sa"], [data-info="av"]', svg).forEach((c) => c.classList.toggle("pulse-hl", s.show.includes(c.dataset.info)));
        },
      },
    ]},

    { id: "sebab", title: "Sebab-Akibat", cards: [
      { type: "chain", heading: "Mengapa begitu?", emoji: "🔗", intro: "Pilih pertanyaan dan buka rantainya satu per satu. Coba tebak dulu langkah berikutnya!",
        chains: [
          { label: "Mengapa koroner kiri mengalir saat diastol?", nodes: [
            "Saat sistol, otot VKi berkontraksi dan tekanan di dalam dindingnya sangat tinggi",
            "Pembuluh koroner yang menembus dinding (intramural) ikut terjepit",
            "Tekanan jaringan > tekanan pembuluh → aliran ke VKi hampir berhenti",
            "Saat diastol, otot relaksasi, jepitan hilang, dan tekanan aorta masih tinggi",
            "Maka ±80% aliran koroner kiri terjadi saat diastol" ] },
          { label: "Bagaimana jantung menambah O₂ saat olahraga?", nodes: [
            "Saat istirahat ekstraksi O₂ jantung sudah ±70–75% (hampir maksimal)",
            "Jadi jantung tidak bisa banyak “memeras” O₂ tambahan dari darah",
            "Satu-satunya cara: menambah ALIRAN darah koroner",
            "Metabolisme ↑ → adenosin, CO₂, H⁺, K⁺, NO ↑ → arteriol koroner berdilatasi",
            "Aliran koroner bisa naik 4–5× lipat (cadangan koroner)" ] },
          { label: "Mengapa subendokardium paling rentan?", nodes: [
            "Lapisan dalam (subendokardium) paling dekat dengan rongga ventrikel bertekanan tinggi",
            "Saat sistol, jepitan paling kuat terjadi di lapisan ini",
            "Pembuluh harus menembus seluruh tebal dinding untuk mencapainya",
            "Jika aliran turun, subendokardium yang pertama kekurangan O₂ (iskemia)" ] },
        ] },
    ]},

    { id: "interaksi", title: "Interaksi", cards: [
      { heading: "Aliran koroner sepanjang siklus jantung", emoji: "🎚️", html: `
        <p>Geser <b>denyut jantung (HR)</b>. Perhatikan apa yang terjadi pada lebar fase <span style="color:var(--accent);font-weight:700">diastol</span> — waktu “makan” bagi ventrikel kiri.</p>
        <div class="slider-row"><label for="hr">Denyut jantung <output id="hr-out">70 x/menit</output></label>
          <input type="range" id="hr" min="50" max="190" value="70"></div>
        <div class="viz-wrap">
          <svg id="cor-graph" viewBox="0 0 420 250" role="img" aria-label="Grafik aliran koroner">
            <g id="cg-bands"></g>
            <line class="svg-axis" x1="40" y1="200" x2="410" y2="200"/>
            <line class="svg-axis" x1="40" y1="20" x2="40" y2="200"/>
            <text class="svg-label small" x="12" y="110" transform="rotate(-90 12 110)" text-anchor="middle">Aliran</text>
            <text class="svg-label small" x="225" y="222" text-anchor="middle">Waktu (2 detik)</text>
            <path id="cg-left" fill="none" stroke="var(--o2-rich)" stroke-width="3"/>
            <path id="cg-right" fill="none" stroke="var(--artery)" stroke-width="2.5" stroke-dasharray="6 4"/>
            <line id="cg-cursor" x1="40" y1="20" x2="40" y2="200" stroke="var(--text)" stroke-width="1.5"/>
            <circle id="cg-dot" r="5" fill="var(--o2-rich)" stroke="#fff" stroke-width="2"/>
          </svg>
          <div class="legend">
            <span><i style="background:var(--o2-rich)"></i>Koroner kiri (ke VKi)</span>
            <span><i style="background:var(--artery)"></i>Koroner kanan (ke VKa)</span>
            <span><i style="background:var(--primary-soft);border:1px solid var(--primary)"></i>Sistol</span>
            <span><i style="background:var(--accent-soft);border:1px solid var(--accent)"></i>Diastol</span>
          </div>
        </div>
        <div class="readouts">
          <div class="readout"><span>Durasi 1 siklus</span><b id="ro-cycle">–</b></div>
          <div class="readout"><span>Sistol / denyut</span><b id="ro-sys">–</b></div>
          <div class="readout"><span>Diastol / denyut</span><b id="ro-dia">–</b></div>
          <div class="readout big"><span>Waktu diastol per menit</span><b id="ro-diamin">–</b></div>
        </div>
        <div class="callout" id="cor-msg"></div>`,
        init(el, secEl) {
          const W0 = 40, W1 = 410, Y0 = 200, Y1 = 30, WIN = 2;
          const sx = (t) => W0 + (t / WIN) * (W1 - W0);
          const sy = (v) => Y0 - (v + 15) / 125 * (Y0 - Y1);
          const hr = K.$("#hr", el);
          let cycle, sys;
          function flowAt(t, side) {
            const ph = t % cycle;
            if (ph < sys) {
              const f = ph / sys;
              return side === "L" ? K.keys([[0, 45], [.15, -12], [.45, 18], [1, 22]], f) : K.keys([[0, 40], [.35, 62], [1, 55]], f);
            }
            const f = (ph - sys) / (cycle - sys);
            return side === "L" ? K.keys([[0, 22], [.1, 100], [.5, 70], [1, 45]], f) : K.keys([[0, 55], [.2, 60], [1, 42]], f);
          }
          function draw() {
            const HR = +hr.value;
            cycle = 60 / HR; sys = 0.16 + 0.18 * cycle;
            const dia = cycle - sys;
            K.$("#hr-out", el).textContent = HR + " x/menit";
            let bands = "";
            for (let t0 = 0; t0 < WIN; t0 += cycle) {
              bands += `<rect x="${sx(t0)}" y="20" width="${Math.max(0, Math.min(sx(t0 + sys), W1) - sx(t0))}" height="180" fill="var(--primary-soft)"/>`;
              if (t0 + sys < WIN) bands += `<rect x="${sx(t0 + sys)}" y="20" width="${Math.max(0, Math.min(sx(t0 + cycle), W1) - sx(t0 + sys))}" height="180" fill="var(--accent-soft)"/>`;
            }
            K.$("#cg-bands", el).innerHTML = bands;
            K.$("#cg-left", el).setAttribute("d", K.plot((t) => flowAt(t, "L"), 0, WIN, sx, sy, 400));
            K.$("#cg-right", el).setAttribute("d", K.plot((t) => flowAt(t, "R"), 0, WIN, sx, sy, 400));
            K.$("#ro-cycle", el).innerHTML = `${(cycle * 1000).toFixed(0)}<small> ms</small>`;
            K.$("#ro-sys", el).innerHTML = `${(sys * 1000).toFixed(0)}<small> ms</small>`;
            K.$("#ro-dia", el).innerHTML = `${(dia * 1000).toFixed(0)}<small> ms</small>`;
            const perMin = HR * dia;
            K.$("#ro-diamin", el).innerHTML = `${perMin.toFixed(0)}<small> detik</small>`;
            const msg = K.$("#cor-msg", el);
            if (HR < 90) { msg.className = "callout green"; msg.innerHTML = `<p>Diastol masih panjang (${Math.round(dia / cycle * 100)}% siklus). VKi punya cukup waktu untuk mendapat aliran koroner.</p>`; }
            else if (HR < 140) { msg.className = "callout warn"; msg.innerHTML = `<p>Diastol memendek (${Math.round(dia / cycle * 100)}% siklus), padahal kebutuhan O₂ jantung naik karena berdenyut lebih cepat. Pada arteri normal, vasodilatasi koroner masih bisa mengompensasi.</p>`; }
            else { msg.className = "callout red"; msg.innerHTML = `<p><b>Takikardia berat:</b> diastol tinggal ${Math.round(dia / cycle * 100)}% siklus. Kebutuhan O₂ ↑ tetapi waktu perfusi ↓ — jika ada penyempitan koroner, mudah terjadi <b>iskemia</b>.</p>`; }
          }
          hr.addEventListener("input", draw);
          draw();
          let tt = 0;
          K.loop(secEl, (dt) => {
            tt = (tt + dt * 0.5) % WIN;
            const x = sx(tt);
            K.$("#cg-cursor", el).setAttribute("x1", x); K.$("#cg-cursor", el).setAttribute("x2", x);
            const d = K.$("#cg-dot", el); d.setAttribute("cx", x); d.setAttribute("cy", sy(flowAt(tt, "L")));
          });
        } },
      { type: "match", heading: "Cocokkan arteri dengan wilayahnya", emoji: "🧩",
        intro: "Ketuk arteri di kiri, lalu wilayah yang diperdarahinya di kanan.",
        pairs: [
          ["LAD", "Dinding anterior VKi + apeks + 2/3 anterior septum"],
          ["LCx", "Dinding lateral VKi + atrium kiri"],
          ["RCA", "Ventrikel kanan + atrium kanan"],
          ["PDA", "Dinding inferior VKi + 1/3 posterior septum"],
          ["Sinus koronarius", "Mengalirkan darah vena jantung ke atrium kanan"],
        ], done: "Semua tepat! Sekarang kamu bisa menebak wilayah otot yang terancam jika arteri tertentu tersumbat." },
    ]},

    { id: "klinis", title: "Hubungan Klinis", cards: [
      { type: "clinic", heading: "Jika mekanismenya terganggu…", emoji: "🩺",
        intro: "Pikirkan dulu: bagian mana yang kekurangan O₂? Lalu buka kartunya.",
        items: [
          { icon: "😣", title: "Penyempitan koroner (angina pektoris)", chain: ["Plak aterosklerosis menyempitkan lumen arteri koroner", "Saat istirahat aliran masih cukup; saat aktivitas kebutuhan O₂ naik tetapi aliran tidak bisa naik", "Ketidakseimbangan suplai–kebutuhan → iskemia → <b>nyeri dada saat aktivitas</b>, hilang dengan istirahat"] },
          { icon: "💔", title: "Sumbatan total LAD (infark anterior)", chain: ["Trombus menutup LAD", "Dinding anterior VKi, apeks, dan septum anterior tidak mendapat O₂", "Otot di wilayah itu mati (infark) → kemampuan pompa VKi turun drastis"] },
          { icon: "🐢", title: "Sumbatan RCA", chain: ["RCA tersumbat", "Nodus SA/AV (yang diperdarahi RCA pada kebanyakan orang) ikut iskemia", "Bisa timbul <b>bradikardia</b> atau <b>blok AV</b>, disertai infark dinding inferior"] },
          { icon: "🏃", title: "Takikardia pada penderita penyakit koroner", chain: ["Denyut jantung meningkat", "Kebutuhan O₂ naik, sementara waktu diastol memendek", "Suplai turun saat kebutuhan naik → angina mudah muncul (itu sebabnya obat penurun HR membantu)"] },
        ] },
    ]},

    { type: "quiz", questions: [
      { q: "Mengapa sebagian besar aliran darah ke ventrikel kiri terjadi saat <b>diastol</b>?",
        options: ["Karena tekanan aorta paling tinggi saat diastol", "Karena saat sistol pembuluh intramural terjepit oleh otot VKi yang berkontraksi", "Karena katup aorta menutup ostium koroner saat diastol", "Karena kebutuhan O₂ jantung lebih tinggi saat diastol"], answer: 1,
        explain: "Saat sistol, tekanan di dalam dinding VKi melebihi tekanan di pembuluh koroner intramural sehingga pembuluh terjepit. Tekanan aorta justru tertinggi saat sistol, dan ostium koroner tidak ditutup oleh daun katup." },
      { q: "Saat olahraga kebutuhan O₂ miokardium naik 3×. Cara utama jantung memenuhinya adalah…",
        options: ["Meningkatkan ekstraksi O₂ dari 25% ke 75%", "Meningkatkan aliran koroner melalui vasodilatasi metabolik", "Beralih ke metabolisme anaerob", "Mengambil O₂ langsung dari darah di rongga ventrikel"], answer: 1,
        explain: "Ekstraksi O₂ jantung sudah ±70–75% saat istirahat, sehingga hampir tidak bisa dinaikkan lagi. Yang tersisa adalah menambah aliran: metabolit seperti adenosin, CO₂, H⁺, K⁺ melebarkan arteriol koroner." },
      { q: "Seorang pasien mengalami sumbatan arteri yang memberi darah ke <b>AV node</b> pada jantung dominan kanan. Arteri yang paling mungkin tersumbat?",
        options: ["LAD", "LCx", "RCA", "Left main"], answer: 2,
        explain: "Pada dominansi kanan, PDA dan cabang nodus AV berasal dari <b>RCA</b>. Itu sebabnya infark inferior akibat sumbatan RCA sering disertai blok AV." },
      { q: "Mengapa takikardia berbahaya bagi pasien dengan penyempitan koroner?",
        options: ["Karena takikardia menurunkan tekanan aorta sistolik", "Karena diastol memendek sehingga waktu perfusi berkurang, sementara kebutuhan O₂ meningkat", "Karena takikardia melebarkan arteri koroner terlalu banyak", "Karena darah lebih lama di kapiler"], answer: 1,
        explain: "Peningkatan HR terutama memendekkan diastol. Waktu perfusi VKi berkurang, padahal jantung yang berdenyut lebih cepat membutuhkan O₂ lebih banyak — suplai turun, kebutuhan naik." },
      { q: "Darah dari kapiler miokardium sebagian besar kembali ke jantung melalui…",
        options: ["Vena kava superior", "Vena pulmonalis", "Sinus koronarius ke atrium kanan", "Langsung ke ventrikel kiri"], answer: 2,
        explain: "Vena-vena jantung (misalnya vena kordis magna) bermuara ke <b>sinus koronarius</b>, yang membuka ke <b>atrium kanan</b>. Jadi darah koroner kembali ke sirkulasi sistemik seperti darah organ lain." },
    ]},
  ],
});
