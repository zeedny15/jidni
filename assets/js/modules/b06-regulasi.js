/* Modul B6 — Regulasi Tekanan Darah & Aliran Darah: lokal, neural, hormonal */
(function () {
  /* Arteriol memanjang: dinding otot polos + lumen yang berubah */
  const ART = `<svg viewBox="0 0 420 200" style="max-width:600px;margin:auto" role="img" aria-label="Arteriol yang menyempit dan melebar">
    <rect id="ar-top" x="20" y="40" width="380" height="26" rx="10" fill="var(--primary)" opacity=".55"/>
    <rect id="ar-bot" x="20" y="134" width="380" height="26" rx="10" fill="var(--primary)" opacity=".55"/>
    <rect id="ar-lum" x="20" y="66" width="380" height="68" fill="var(--o2-rich)" opacity=".15"/>
    <g id="ar-p"></g>
    <text class="svg-label small" x="22" y="30">otot polos arteriol</text>
    <text id="ar-t" class="svg-label" x="210" y="188" text-anchor="middle" style="font-size:12.5px"></text>
  </svg>
  <div class="readouts"><div class="readout"><span>Jari-jari arteriol</span><b id="ar-r"></b></div><div class="readout big"><span>Aliran ke jaringan (∝ r⁴)</span><b id="ar-q"></b></div></div>`;

  function makeArteriole(root, secEl) {
    const NS = "http://www.w3.org/2000/svg", g = K.$("#ar-p", root), parts = [];
    for (let i = 0; i < 36; i++) { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", 3.5); g.appendChild(c); parts.push({ c, x: Math.random(), y: Math.random() * 2 - 1 }); }
    let r = 1, target = 1;
    K.loop(secEl, (dt) => {
      r += (target - r) * Math.min(1, dt * 3);
      const half = 34 * r;
      K.$("#ar-top", root).setAttribute("height", 26 + (1 - r) * 20);
      K.$("#ar-top", root).setAttribute("y", 100 - half - (26 + (1 - r) * 20));
      K.$("#ar-bot", root).setAttribute("y", 100 + half); K.$("#ar-bot", root).setAttribute("height", 26 + (1 - r) * 20);
      K.$("#ar-lum", root).setAttribute("y", 100 - half); K.$("#ar-lum", root).setAttribute("height", 2 * half);
      const Q = Math.pow(r, 4), sp = 60 * Q / (r * r);
      parts.forEach((p, i) => { const on = i < Math.round(36 * Math.min(1, r * r)); p.c.style.display = on ? "" : "none"; p.x = (p.x + dt * sp / 380 * (1.4 - p.y * p.y)) % 1; p.c.setAttribute("cx", 20 + p.x * 380); p.c.setAttribute("cy", 100 + p.y * (half - 5)); p.c.setAttribute("fill", K.css("--o2-rich")); });
      K.$("#ar-r", root).textContent = Math.round(r * 100) + "%";
      K.$("#ar-q", root).textContent = Math.round(Q * 100) + "%";
    });
    return { set(v, label) { target = v; K.$("#ar-t", root).innerHTML = label || ""; } };
  }

  const STEPS = [
    { title: "Tiga lapis pengaturan", body: "<ul class='key-points'><li><span class='k-ico'>📍</span><span><b>Lokal</b> — tiap jaringan mengatur alirannya sendiri (detik–menit).</span></li><li><span class='k-ico'>⚡</span><span><b>Neural</b> — pusat vasomotor & simpatis, refleks baroreseptor (detik).</span></li><li><span class='k-ico'>🧪</span><span><b>Hormonal</b> — epinefrin, angiotensin II, ADH, aldosteron, ANP (menit–hari).</span></li></ul>", key: "Lokal → mengatur ALIRAN ke organ; neural & hormonal → menjaga TEKANAN sistemik (MAP).", r: 1, l: "kondisi basal (tonus istirahat)" },
    { title: "Lokal: autoregulasi metabolik", body: "Saat jaringan aktif, O₂ ↓ dan CO₂, H⁺, K⁺, <b>adenosin</b>, serta panas ↑. Zat-zat ini melemaskan otot polos arteriol → <b>vasodilatasi</b> → aliran naik sesuai kebutuhan (<b>hiperemia aktif</b>).", key: "Contoh: otot saat olahraga, jantung (A2), otak saat berpikir.", r: 1.35, l: "metabolit ↑ → vasodilatasi" },
    { title: "Lokal: hiperemia reaktif", body: "Jika aliran dihentikan sementara (mis. manset dipompa), metabolit menumpuk. Saat aliran dibuka, terjadi <b>lonjakan aliran</b> melebihi normal untuk “membayar utang” O₂.", key: "Kulit memerah setelah tekanan dilepas.", r: 1.45, l: "setelah sumbatan dilepas → aliran melonjak" },
    { title: "Lokal: autoregulasi miogenik", body: "Bila tekanan arteri naik, dinding arteriol <b>teregang</b> → otot polos membalas dengan <b>berkontraksi</b> → jari-jari mengecil. Hasilnya aliran ke organ (otak, ginjal) tetap relatif konstan pada MAP ±60–160 mmHg.", key: "Regang → kontraksi. Melindungi kapiler dari tekanan berlebih.", r: 0.85, l: "tekanan ↑ → dinding teregang → kontraksi" },
    { title: "Lokal: endotel", body: "Endotel melepas <b>NO</b> (nitric oxide) saat terkena gesekan aliran (shear stress) → vasodilatasi; juga <b>prostasiklin</b> (dilatasi). Sebaliknya <b>endotelin</b> → vasokonstriksi kuat.", key: "Endotel sehat = cenderung vasodilatasi & antitrombosis.", r: 1.2, l: "NO dari endotel → vasodilatasi" },
    { title: "Neural: pusat vasomotor & simpatis", body: "Pusat vasomotor di medula mengirim impuls simpatis terus-menerus (<b>tonus vasomotor</b>). Norepinefrin → reseptor <b>α1</b> → vasokonstriksi arteriol (TPR ↑) dan vena (VR ↑). Refleks baroreseptor (A12) menyesuaikan tonus ini detik demi detik.", key: "Simpatis ↑ → konstriksi; simpatis ↓ → dilatasi (tidak ada serabut “dilatasi” khusus untuk sebagian besar arteriol).", r: 0.75, l: "norepinefrin (α1) → vasokonstriksi" },
    { title: "Hormonal cepat", body: "<b>Epinefrin</b> (adrenal): α1 konstriksi di kulit/usus, tetapi <b>β2 dilatasi</b> di otot rangka & koroner. <b>Angiotensin II</b>: vasokonstriktor kuat. <b>ADH/vasopresin</b> dosis tinggi: vasokonstriksi.", key: "Bekerja dalam menit, memperkuat refleks saraf.", r: 0.7, l: "angiotensin II → vasokonstriksi kuat" },
    { title: "Hormonal lambat: volume darah", body: "Untuk jangka panjang, tekanan darah diatur lewat <b>volume</b> oleh ginjal: <b>RAAS</b> (renin → angiotensin II → aldosteron → retensi Na⁺ & air), <b>ADH</b> (retensi air), dan <b>ANP</b> dari atrium yang teregang (buang Na⁺ & air, vasodilatasi).", key: "Ginjal = pengatur tekanan darah jangka panjang.", r: 1, l: "volume darah diatur ginjal (jam–hari)" },
  ];

  registerModule({
    id: "b06",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Siapa yang mengatur semuanya?", emoji: "💡", html: `
          <p>Ini topik penutup yang menyatukan semua materi: <b>MAP = CO × TPR</b> (B3). Tubuh mengatur tekanan dan aliran darah dengan mengubah <b>HR</b> & <b>SV</b> (A11–A13), <b>jari-jari arteriol</b> (B4), <b>tonus vena</b> (B5), dan <b>volume darah</b>.</p>
          <ul class="key-points">
            <li><span class="k-ico">🎯</span><span>Dua tujuan: <b>aliran cukup ke tiap organ</b> sesuai kebutuhan, dan <b>MAP stabil</b> agar semua organ terperfusi.</span></li>
            <li><span class="k-ico">⏱️</span><span>Tiga kecepatan: <b>detik</b> (saraf), <b>menit</b> (hormon cepat), <b>jam–hari</b> (ginjal & volume).</span></li>
          </ul>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Arteriol di bawah kendali", emoji: "🎬", intro: "Setiap mekanisme mengubah jari-jari arteriol. Perhatikan efeknya pada aliran (∝ r⁴).",
          viz: ART, steps: STEPS,
          onStep(i, s, api) { api._art && api._art.set(s.r, s.l); },
          init(api, secEl) { api._art = makeArteriole(api.viz, secEl); } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { heading: "Autoregulasi: aliran tetap walau tekanan berubah", emoji: "📈", html: `
          <p>Pada organ seperti otak & ginjal, aliran hampir konstan dalam rentang MAP yang lebar berkat mekanisme miogenik & metabolik. Geser MAP.</p>
          <div class="slider-row"><label for="au-map">MAP <output id="au-o"></output></label><input type="range" id="au-map" min="30" max="200" value="93"></div>
          <div class="viz-wrap"><svg id="au-svg" viewBox="0 0 420 200" role="img" aria-label="Kurva autoregulasi" style="max-width:600px;margin:auto"></svg></div>
          <div class="callout" id="au-msg"></div>`,
          init(el) {
            const X = (p) => 40 + (p - 20) / 190 * 370, Y = (q) => 175 - q / 2 * 155;
            const flow = (p) => p < 60 ? p / 60 : p <= 160 ? 1 + (p - 60) * .001 : 1.1 + (p - 160) / 60;
            const m = K.$("#au-map", el);
            function upd() {
              const p = +m.value, q = flow(p);
              K.$("#au-o", el).textContent = p + " mmHg";
              K.$("#au-svg", el).innerHTML = `<rect x="${X(60)}" y="10" width="${X(160) - X(60)}" height="165" fill="var(--ok-soft)"/><text class="svg-label small" x="${(X(60) + X(160)) / 2}" y="24" text-anchor="middle" style="fill:var(--ok)">rentang autoregulasi</text>
                <line class="svg-axis" x1="40" y1="10" x2="40" y2="175"/><line class="svg-axis" x1="40" y1="175" x2="410" y2="175"/>
                ${[50, 100, 150, 200].map((v) => `<text class="svg-label small" x="${X(v)}" y="190" text-anchor="middle" style="font-size:9.5px">${v}</text>`).join("")}
                <text class="svg-label small" x="14" y="95" transform="rotate(-90 14 95)" text-anchor="middle">Aliran organ</text>
                <path d="${K.plot((x) => x / 93, 20, 200, X, Y, 50)}" fill="none" stroke="var(--text-soft)" stroke-dasharray="4 4"/>
                <path d="${K.plot(flow, 20, 200, X, Y, 200)}" fill="none" stroke="var(--primary)" stroke-width="3"/>
                <circle cx="${X(p)}" cy="${Y(q)}" r="6" fill="var(--primary)" stroke="#fff" stroke-width="2"/>
                <text class="svg-label small" x="405" y="${Y(200 / 93) + 12}" text-anchor="end">— — tanpa autoregulasi (pipa kaku)</text>`;
              const msg = K.$("#au-msg", el);
              msg.className = p < 60 || p > 160 ? "callout red" : "callout green";
              msg.innerHTML = `<p>${p < 60 ? "Di bawah ±60 mmHg arteriol sudah dilatasi maksimal — aliran turun mengikuti tekanan → risiko iskemia otak/ginjal (syok)." : p > 160 ? "Di atas ±160 mmHg konstriksi miogenik tak mampu lagi menahan → aliran & tekanan kapiler naik → risiko kerusakan (mis. ensefalopati hipertensi)." : "Dalam rentang ini, tekanan ↑ → arteriol menyempit; tekanan ↓ → arteriol melebar. Aliran organ hampir konstan."}</p>`;
            }
            m.addEventListener("input", upd); upd();
          } },
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "RAAS saat tekanan darah turun", nodes: ["Tekanan/aliran ke ginjal turun dan simpatis ↑", "Sel jukstaglomerulus melepas renin", "Renin: angiotensinogen → angiotensin I → (ACE di paru) → angiotensin II", "Angiotensin II: vasokonstriksi + merangsang aldosteron, ADH, dan rasa haus", "Aldosteron: retensi Na⁺ & air → volume darah ↑ → MAP pulih"] },
            { label: "Mengapa otot mendapat lebih banyak darah saat olahraga?", nodes: ["Otot aktif → metabolit (adenosin, K⁺, CO₂, H⁺) menumpuk", "Arteriol otot berdilatasi secara lokal (mengalahkan konstriksi simpatis)", "Epinefrin lewat β2 menambah dilatasi", "Sementara itu simpatis menyempitkan arteriol ginjal, usus, kulit", "Aliran dialihkan ke otot dan MAP tetap terjaga"] },
            { label: "ANP: rem dari jantung", nodes: ["Volume darah berlebih → atrium teregang", "Sel atrium melepas ANP (atrial natriuretic peptide)", "ANP: ginjal membuang Na⁺ & air, menghambat renin & aldosteron", "ANP juga menyebabkan vasodilatasi", "Volume & tekanan darah turun kembali"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Laboratorium arteriol", emoji: "🧪", html: `
          <p>Nyalakan satu atau beberapa rangsangan. Lihat efek gabungannya pada jari-jari arteriol dan aliran.</p>
          <div class="toggle-row" id="st-btns"></div>
          ${ART.replace(/id="ar-/g, 'id="ar-')}
          <div class="callout" id="st-msg"></div>`,
          init(el, secEl) {
            const S = [
              ["met", "🔥 Metabolit ↑ (adenosin, CO₂)", 1.35, "vasodilatasi metabolik"], ["no", "🫧 NO endotel", 1.2, "vasodilatasi oleh NO"],
              ["ne", "⚡ Simpatis (NE → α1)", 0.75, "vasokonstriksi α1"], ["ang", "🧪 Angiotensin II", 0.72, "vasokonstriksi kuat"],
              ["adh", "💧 ADH / vasopresin", 0.85, "vasokonstriksi (dosis tinggi)"], ["et", "🧱 Endotelin", 0.7, "vasokonstriksi kuat"],
              ["epi", "💉 Epinefrin (di otot rangka, β2)", 1.15, "vasodilatasi β2 di otot rangka"], ["myo", "🎈 Regangan (tekanan ↑)", 0.85, "kontraksi miogenik"],
            ];
            const on = new Set();
            K.$("#st-btns", el).innerHTML = S.map(([k, n]) => `<button class="btn btn-sm" data-k="${k}" type="button">${n}</button>`).join("");
            const art = makeArteriole(el, secEl);
            function upd() {
              let r = 1; const eff = [];
              S.forEach(([k, n, f, d]) => { if (on.has(k)) { r *= f; eff.push(d); } });
              r = K.clamp(r, .45, 1.6);
              art.set(r, eff.length ? "" : "tonus basal");
              K.$$("#st-btns button", el).forEach((b) => b.classList.toggle("on", on.has(b.dataset.k)));
              const m = K.$("#st-msg", el);
              m.className = r > 1.05 ? "callout green" : r < .95 ? "callout red" : "callout";
              m.innerHTML = `<p>${eff.length ? `Efek aktif: ${eff.join(", ")}. ` : ""}Jari-jari ${Math.round(r * 100)}% → aliran ${Math.round(r ** 4 * 100)}% dari basal. ${on.has("met") && on.has("ne") ? "Perhatikan: pada otot aktif, metabolit lokal dapat <b>mengalahkan</b> konstriksi simpatis (functional sympatholysis)." : ""}</p>`;
            }
            K.$$("#st-btns button", el).forEach((b) => b.addEventListener("click", () => { const k = b.dataset.k; on.has(k) ? on.delete(k) : on.add(k); upd(); }));
            upd();
          } },
        { heading: "Linimasa kompensasi perdarahan", emoji: "⏱️", html: `
          <p>Seseorang kehilangan ±20% volume darah. Putar waktu dan lihat mekanisme mana yang bekerja serta bagaimana MAP pulih.</p>
          <div class="slider-row"><label for="hm-t">Waktu setelah perdarahan <output id="hm-o"></output></label><input type="range" id="hm-t" min="0" max="100" value="0"></div>
          <div class="btn-row" style="margin-bottom:8px"><button class="btn btn-sm btn-primary" id="hm-play" type="button">▶ Putar</button></div>
          <div class="viz-wrap"><svg id="hm-svg" viewBox="0 0 420 190" role="img" aria-label="Pemulihan MAP" style="max-width:600px;margin:auto"></svg></div>
          <div id="hm-list" class="key-points" style="display:grid;gap:8px;margin-top:10px"></div>`,
          init(el, secEl) {
            // skala waktu logaritmik: 0 = detik 0, 100 = 14 hari
            const tSec = (x) => x === 0 ? 0 : Math.pow(10, x / 100 * Math.log10(14 * 86400));
            const fmt = (s) => s < 1 ? "0 detik" : s < 60 ? Math.round(s) + " detik" : s < 3600 ? Math.round(s / 60) + " menit" : s < 86400 ? Math.round(s / 3600) + " jam" : Math.round(s / 86400) + " hari";
            const MAP = (s) => 93 - (s < 1 ? 28 : 28 * (0.55 * Math.exp(-s / 20) + 0.25 * Math.exp(-s / 1800) + 0.15 * Math.exp(-s / 86400) + 0.05 * Math.exp(-s / 600000)));
            const M = [
              { t: [1, 1e9], n: "⚡ Refleks baroreseptor", d: "Detik: HR ↑, kontraktilitas ↑, vasokonstriksi arteriol & vena (A12)." },
              { t: [30, 1e9], n: "💉 Epinefrin adrenal", d: "Detik–menit: memperkuat efek simpatis." },
              { t: [600, 1e9], n: "🧪 Angiotensin II & ADH", d: "Menit: vasokonstriksi kuat; ADH mulai menahan air." },
              { t: [600, 86400 * 2], n: "⚖️ Pergeseran cairan kapiler", d: "Menit–jam: tekanan kapiler ↓ → reabsorpsi cairan interstisial ke plasma (Starling, B2)." },
              { t: [3600, 1e9], n: "🫘 Aldosteron & haus", d: "Jam–hari: retensi Na⁺ & air oleh ginjal; minum ↑ → volume plasma pulih." },
              { t: [86400 * 3, 1e9], n: "🩸 Eritropoietin", d: "Hari–minggu: produksi sel darah merah ↑ untuk mengganti yang hilang." },
            ];
            const X = (x) => 40 + x / 100 * 370, Y = (p) => 170 - (p - 55) / 45 * 150;
            const s = K.$("#hm-t", el); let playing = false;
            function upd() {
              const x = +s.value, sec = tSec(x);
              K.$("#hm-o", el).textContent = fmt(sec);
              K.$("#hm-svg", el).innerHTML = `<line class="svg-axis" x1="40" y1="15" x2="40" y2="170"/><line class="svg-axis" x1="40" y1="170" x2="410" y2="170"/>
                <line class="svg-grid" x1="40" x2="410" y1="${Y(93)}" y2="${Y(93)}"/><text class="svg-label small" x="44" y="${Y(93) - 4}">MAP normal 93</text>
                ${[["1 dtk", 1], ["1 mnt", 60], ["1 jam", 3600], ["1 hari", 86400], ["14 hr", 14 * 86400]].map(([l, v]) => { const xx = Math.log10(v) / Math.log10(14 * 86400) * 100; return `<text class="svg-label small" x="${X(xx)}" y="184" text-anchor="middle" style="font-size:9.5px">${l}</text>`; }).join("")}
                <path d="${K.plot((xx) => MAP(tSec(xx)), 0, 100, X, Y, 200)}" fill="none" stroke="var(--primary)" stroke-width="3"/>
                <line x1="${X(x)}" x2="${X(x)}" y1="15" y2="170" stroke="var(--accent)" stroke-width="2"/>
                <circle cx="${X(x)}" cy="${Y(MAP(sec))}" r="6" fill="var(--primary)" stroke="#fff" stroke-width="2"/>
                <text class="svg-label small" x="${Math.min(X(x) + 8, 360)}" y="${Y(MAP(sec)) - 8}">${Math.round(MAP(sec))} mmHg</text>`;
              K.$("#hm-list", el).innerHTML = M.map((m) => { const act = sec >= m.t[0] && sec <= m.t[1]; return `<div style="display:flex;gap:10px;padding:10px 12px;border-radius:10px;background:${act ? "var(--ok-soft)" : "var(--surface-2)"};opacity:${act ? 1 : .5}"><b style="min-width:12px">${act ? "✓" : "·"}</b><span><b>${m.n}</b> — ${m.d}</span></div>`; }).join("");
            }
            s.addEventListener("input", () => { playing = false; K.$("#hm-play", el).textContent = "▶ Putar"; upd(); });
            K.$("#hm-play", el).addEventListener("click", (e) => { playing = !playing; if (playing && +s.value >= 100) s.value = 0; e.target.textContent = playing ? "⏸ Jeda" : "▶ Putar"; });
            K.loop(secEl, (dt) => { if (!playing) return; s.value = Math.min(100, +s.value + dt * 8); upd(); if (+s.value >= 100) { playing = false; K.$("#hm-play", el).textContent = "▶ Putar"; } });
            upd();
          } },
        { type: "match", heading: "Cocokkan zat dengan efeknya", emoji: "🧩", intro: "Ketuk zat di kiri, lalu efek utamanya di kanan.",
          pairs: [["Adenosin & CO₂", "Vasodilatasi lokal sesuai metabolisme"], ["Nitric oxide (NO)", "Vasodilatasi dari endotel"], ["Angiotensin II", "Vasokonstriksi & merangsang aldosteron"], ["Aldosteron", "Retensi Na⁺ & air di ginjal"], ["ANP", "Ekskresi Na⁺ & air, vasodilatasi"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika regulasinya terganggu…", emoji: "🩺", intro: "Hubungkan obat & penyakit dengan mekanisme yang kamu pelajari.",
          items: [
            { icon: "💊", title: "ACE inhibitor / ARB", chain: ["Menghambat pembentukan atau kerja angiotensin II", "Vasokonstriksi & aldosteron berkurang", "TPR & volume turun → tekanan darah turun (dipakai pada hipertensi & gagal jantung)"] },
            { icon: "🩹", title: "Nitrogliserin pada angina", chain: ["Diubah menjadi NO", "Vena & arteri koroner berdilatasi", "Preload ↓ (kebutuhan O₂ jantung ↓) dan suplai koroner ↑ → nyeri berkurang"] },
            { icon: "🫘", title: "Stenosis arteri renalis", chain: ["Aliran ke ginjal berkurang", "Ginjal “mengira” tekanan darah rendah → renin ↑", "Angiotensin II & aldosteron ↑ → hipertensi sekunder"] },
            { icon: "🦠", title: "Syok septik", chain: ["Mediator inflamasi → produksi NO berlebihan", "Vasodilatasi luas, arteriol kurang responsif terhadap vasokonstriktor", "TPR & MAP turun drastis → butuh vasopresor"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Saat otot rangka berkontraksi berat, aliran darahnya bisa naik 20×. Mekanisme utama yang paling langsung adalah…",
          options: ["Peningkatan tonus simpatis α1 di otot", "Vasodilatasi lokal oleh metabolit (adenosin, K⁺, CO₂, H⁺)", "Peningkatan viskositas darah", "Pelepasan endotelin"], answer: 1,
          explain: "Hiperemia aktif: metabolit dari otot yang bekerja melemaskan arteriol setempat, mengalahkan konstriksi simpatis." },
        { q: "Mengapa aliran darah ke otak tetap relatif konstan walaupun MAP naik dari 80 ke 140 mmHg?",
          options: ["Karena otak tidak memiliki arteriol", "Karena autoregulasi miogenik & metabolik menyempitkan arteriol saat tekanan naik", "Karena simpatis berhenti bekerja", "Karena viskositas darah turun"], answer: 1,
          explain: "Tekanan ↑ meregang dinding arteriol → otot polos berkontraksi (miogenik) sehingga resistensi naik dan aliran tetap." },
        { q: "Urutan yang benar dari sistem renin–angiotensin–aldosteron adalah…",
          options: ["Aldosteron → renin → angiotensin II", "Renin → angiotensin I → (ACE) → angiotensin II → aldosteron", "ACE → renin → angiotensin I", "Angiotensin II → renin → angiotensinogen"], answer: 1,
          explain: "Renin memecah angiotensinogen menjadi angiotensin I; ACE (banyak di paru) mengubahnya menjadi angiotensin II, yang merangsang aldosteron." },
        { q: "Mekanisme mana yang bekerja PALING CEPAT saat tekanan darah tiba-tiba turun?",
          options: ["Aldosteron", "Refleks baroreseptor", "Eritropoietin", "ANP"], answer: 1,
          explain: "Refleks baroreseptor bekerja dalam hitungan detik melalui saraf otonom. Aldosteron & eritropoietin butuh jam hingga hari." },
        { q: "Pada keadaan kelebihan volume darah, atrium teregang dan melepas ANP. Efeknya adalah…",
          options: ["Retensi Na⁺ dan vasokonstriksi", "Ekskresi Na⁺ & air serta vasodilatasi", "Meningkatkan renin", "Meningkatkan aldosteron"], answer: 1,
          explain: "ANP bekerja berlawanan dengan RAAS: natriuresis, diuresis, menghambat renin/aldosteron, dan vasodilatasi." },
      ]},
    ],
  });
})();
