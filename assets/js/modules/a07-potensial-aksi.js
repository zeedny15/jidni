/* Modul A7 — Potensial Aksi Sel Kontraktil */
(function () {
  /** Potensial aksi ventrikel. t dalam ms sejak stimulus; o = {rmp, peak, slowUp} */
  function ap(t, o = {}) {
    const rmp = o.rmp ?? -90, peak = o.peak ?? 22, up = o.slowUp ?? 2;
    if (t < 0) return rmp;
    if (t < up) return rmp + (peak - rmp) * (t / up);
    const cos = (f) => (1 - Math.cos(Math.PI * K.clamp(f, 0, 1))) / 2;
    if (t < 12) return peak + (2 - peak) * cos((t - up) / (12 - up));          // fase 1
    if (t < 22) return 2 + 6 * cos((t - 12) / 10);                             // takik → plateau
    if (t < 190) return 8 - 16 * ((t - 22) / 168) ** 1.6;                      // fase 2
    if (t < 300) return -8 + (rmp + 8) * cos((t - 190) / 110);                 // fase 3
    return rmp;
  }
  const phaseOf = (t) => t < 0 ? "4" : t < 2.5 ? "0" : t < 14 ? "1" : t < 190 ? "2" : t < 300 ? "3" : "4";
  // tegangan otot (0..1) sejak stimulus
  const tension = (t) => t < 20 ? 0 : t < 380 ? K.keys([[20, 0], [190, 1], [380, 0]], t) : 0;

  const T0 = 40, WIN = 420;
  const sx = (t) => 44 + (t + T0) / WIN * 366, sy = (v) => 150 - (v + 90) * (125 / 115);

  const VIZ = `<svg viewBox="0 0 420 330" role="img" aria-label="Potensial aksi sel kontraktil ventrikel">
    <line class="svg-axis" x1="44" y1="15" x2="44" y2="160"/><line class="svg-axis" x1="44" y1="160" x2="410" y2="160"/>
    <g class="svg-label small" style="font-size:10px"><text x="40" y="29" text-anchor="end">+20</text><text x="40" y="52" text-anchor="end">0</text><text x="40" y="101" text-anchor="end">−45</text><text x="40" y="152" text-anchor="end">−90</text></g>
    <line class="svg-grid" x1="44" y1="52" x2="410" y2="52"/>
    <rect id="erp" x="0" y="15" width="0" height="145" fill="var(--bad)" opacity=".08"/>
    <path id="ten" fill="none" stroke="var(--ok)" stroke-width="2.5" stroke-dasharray="6 4" style="display:none"/>
    <path id="ap-trace" fill="none" stroke="var(--primary)" stroke-width="3"/>
    <path id="ap-hl" fill="none" stroke="var(--warn)" stroke-width="8" stroke-linecap="round" opacity=".5"/>
    <circle id="ap-dot" r="6" fill="var(--warn)" stroke="#fff" stroke-width="2"/>
    <g class="svg-label small" id="ph-lbl" style="font-weight:700">
      <text x="${sx(-1) - 8}" y="40">0</text><text x="${sx(8)}" y="16" text-anchor="middle">1</text><text x="${sx(100)}" y="40" text-anchor="middle">2</text><text x="${sx(262)}" y="100">3</text><text x="${sx(330)}" y="142" text-anchor="middle">4</text>
    </g>
    <text class="svg-label small" x="14" y="88" transform="rotate(-90 14 88)" text-anchor="middle">mV</text>
    <text class="svg-label small" x="20" y="196">Luar sel</text>
    <rect x="14" y="214" width="396" height="36" rx="8" fill="var(--warn-soft)" stroke="var(--warn)"/>
    <text class="svg-label small" x="20" y="275">Dalam sel</text>
    <g class="chan" data-ch="na" data-info="na"><rect x="60" y="206" width="56" height="52" rx="10" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/><text class="svg-label small" x="88" y="236" text-anchor="middle">Na⁺</text><text class="svg-label small" x="88" y="300" text-anchor="middle">Na⁺ cepat masuk</text></g>
    <g class="chan" data-ch="ca" data-info="ca"><rect x="182" y="206" width="56" height="52" rx="10" fill="var(--surface)" stroke="var(--ok)" stroke-width="2"/><text class="svg-label small" x="210" y="236" text-anchor="middle">Ca²⁺</text><text class="svg-label small" x="210" y="300" text-anchor="middle">Ca²⁺ (tipe L) masuk</text></g>
    <g class="chan" data-ch="k" data-info="k"><rect x="304" y="206" width="56" height="52" rx="10" fill="var(--surface)" stroke="var(--vein)" stroke-width="2"/><text class="svg-label small" x="332" y="236" text-anchor="middle">K⁺</text><text class="svg-label small" x="332" y="300" text-anchor="middle">K⁺ keluar</text></g>
    <path id="ip-na" d="M88,180 V285" fill="none"/><path id="ip-ca" d="M210,180 V285" fill="none"/><path id="ip-k" d="M332,285 V180" fill="none"/>
    <g class="ion-layer"></g>
  </svg>
  <div class="legend" style="margin-top:4px"><span><i style="background:var(--primary)"></i>Potensial membran</span><span id="lg-ten" style="display:none"><i style="background:var(--ok)"></i>Tegangan otot (kontraksi)</span><span id="lg-erp" style="display:none"><i style="background:var(--bad);opacity:.3"></i>Periode refrakter efektif</span></div>`;

  const STEPS = [
    { title: "Fase 4: istirahat stabil (−90 mV)", body: "Sel kontraktil diam di ±<b>−90 mV</b>. Kanal K⁺ “bocor” (I<sub>K1</sub>) terbuka sehingga potensial mendekati potensial keseimbangan K⁺. Sel menunggu impuls dari sel tetangga (via gap junction).", key: "Berbeda dari SA node: TIDAK naik sendiri.", ph: ["4"], ch: ["k"], ions: { "4": ["k"] } },
    { title: "Fase 0: depolarisasi cepat", body: "Impuls datang → membran mencapai ambang (±−70 mV) → <b>kanal Na⁺ cepat</b> terbuka. Na⁺ menyerbu masuk dan potensial melonjak ke ±+20 mV dalam 1–2 ms.", key: "Kecepatan fase 0 menentukan kecepatan konduksi antarsel.", ph: ["0"], ch: ["na"], ions: { "0": ["na"] } },
    { title: "Fase 1: repolarisasi awal singkat", body: "Kanal Na⁺ <b>inaktif</b> (tertutup dan terkunci sementara). Kanal K⁺ transien (I<sub>to</sub>) terbuka sebentar → potensial turun sedikit membentuk “takik”.", key: "Inaktivasi kanal Na⁺ adalah dasar periode refrakter.", ph: ["1"], ch: ["k"], ions: { "1": ["k"] } },
    { title: "Fase 2: plateau — ciri khas jantung", body: "<b>Kanal Ca²⁺ tipe L</b> terbuka: Ca²⁺ masuk, diimbangi K⁺ yang keluar. Muatan masuk ≈ keluar, sehingga potensial bertahan di sekitar 0 mV selama ±200 ms. Ca²⁺ yang masuk memicu pelepasan Ca²⁺ dari RS → <b>kontraksi</b>.", key: "Plateau = jembatan antara listrik dan kontraksi.", ph: ["2"], ch: ["ca", "k"], ions: { "2": ["ca", "k"] } },
    { title: "Fase 3: repolarisasi", body: "Kanal Ca²⁺ menutup, kanal K⁺ (I<sub>Kr</sub>, I<sub>Ks</sub>) terbuka lebih banyak. K⁺ keluar → potensial kembali ke −90 mV. Kanal Na⁺ pulih dari inaktivasi.", key: "Fase 3 di seluruh ventrikel = gelombang T pada EKG (A8).", ph: ["3"], ch: ["k"], ions: { "3": ["k"] } },
    { title: "Periode refrakter & kontraksi", body: "Dari fase 0 hingga pertengahan fase 3, kanal Na⁺ masih inaktif → <b>tidak ada rangsangan yang bisa memicu potensial aksi baru</b> (periode refrakter efektif). Perhatikan: kontraksi (garis hijau) hampir selesai saat periode refrakter berakhir.", key: "Karena itu otot jantung tidak bisa tetani (lihat A4).", ph: ["0", "1", "2", "3"], ch: ["na", "ca", "k"], ions: { "0": ["na"], "1": ["k"], "2": ["ca", "k"], "3": ["k"], "4": ["k"] }, extra: true },
  ];

  registerModule({
    id: "a07",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Potensial aksi dengan “jeda panjang”", emoji: "💡", html: `
          <p>Sel SA node (A6) membuat impuls. Impuls itu kemudian diterima oleh <b>sel kontraktil</b> atrium dan ventrikel, yang menghasilkan potensial aksi dengan bentuk sangat berbeda:</p>
          <ul class="key-points">
            <li><span class="k-ico">🔋</span><span>Istirahat <b>stabil</b> di −90 mV.</span></li>
            <li><span class="k-ico">⚡</span><span>Naik <b>sangat cepat</b> berkat Na⁺.</span></li>
            <li><span class="k-ico">⏸️</span><span>Ada <b>plateau</b> panjang (±200 ms) berkat Ca²⁺ — inilah yang membuat jantung berkontraksi kuat dan tidak bisa tetani.</span></li>
          </ul>
          <div class="table-wrap" style="margin-top:12px"><table class="table"><thead><tr><th></th><th>Sel SA node</th><th>Sel kontraktil ventrikel</th></tr></thead><tbody>
            <tr><td>Potensial istirahat</td><td>Tidak stabil (−60 → naik)</td><td>Stabil −90 mV</td></tr>
            <tr><td>Fase 0 oleh</td><td>Ca²⁺ (lambat)</td><td>Na⁺ (cepat)</td></tr>
            <tr><td>Plateau</td><td>Tidak ada</td><td>Ada (Ca²⁺)</td></tr>
            <tr><td>Durasi</td><td>±150 ms</td><td>±250–300 ms</td></tr></tbody></table></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Fase demi fase", emoji: "📈", intro: "Bagian yang disorot oranye adalah fase yang dibahas. Partikel menunjukkan ion yang bergerak. Klik kanal untuk penjelasan.",
          viz: VIZ, steps: STEPS,
          info: {
            na: ["Kanal Na⁺ cepat", "Terbuka di ambang, menutup dan inaktif dalam 1–2 ms. Baru bisa dibuka lagi setelah membran kembali negatif (fase 3). Dihambat obat antiaritmia kelas I."],
            ca: ["Kanal Ca²⁺ tipe L", "Terbuka lambat dan lama → plateau. Ca²⁺ yang masuk memicu pelepasan Ca²⁺ dari retikulum sarkoplasma (CICR)."],
            k: ["Kanal K⁺", "Beberapa jenis: I<sub>K1</sub> (istirahat), I<sub>to</sub> (fase 1), I<sub>Kr</sub>/I<sub>Ks</sub> (fase 3). Gangguannya dapat memperpanjang repolarisasi (QT panjang)."],
          },
          onStep(i, s, api) { api._s = s; api._key = null; api._paint && api._paint(); },
          init(api, secEl) {
            const svg = K.$("svg", api.viz);
            K.$("#ap-trace", svg).setAttribute("d", K.plot((t) => ap(t), -T0, WIN - T0, sx, sy, 500));
            K.$("#ten", svg).setAttribute("d", K.plot((t) => tension(t), -T0, WIN - T0, sx, (v) => 150 - v * 80, 300));
            const erp = K.$("#erp", svg); erp.setAttribute("x", sx(0)); erp.setAttribute("width", sx(250) - sx(0));
            const fl = K.flow(K.$(".ion-layer", svg));
            const COL = { na: "--accent", ca: "--ok", k: "--vein" };
            api._paint = () => {
              const s = api._s;
              K.$$(".chan", svg).forEach((g) => g.style.opacity = s.ch.includes(g.dataset.ch) ? 1 : .3);
              let d = "", prev = false;
              if (!s.extra) for (let i = 0; i <= 500; i++) { const t = -T0 + i / 500 * WIN; const on = s.ph.includes(phaseOf(t)); if (on) d += (prev ? "L" : "M") + sx(t).toFixed(1) + "," + sy(ap(t)).toFixed(1); prev = on; }
              K.$("#ap-hl", svg).setAttribute("d", d);
              ["ten", "erp"].forEach((id) => K.$("#" + id, svg).style.display = s.extra ? "" : "none");
              ["lg-ten", "lg-erp"].forEach((id) => K.$("#" + id, api.viz).style.display = s.extra ? "" : "none");
            };
            let t = -T0;
            K.loop(secEl, (dt) => {
              const s = api._s; if (!s) return;
              // putar lebih lambat di fase 0–1 supaya terlihat
              const ph = phaseOf(t);
              t += dt * (ph === "0" || ph === "1" ? 12 : 160);
              if (t > WIN - T0) t = -T0;
              const dot = K.$("#ap-dot", svg); dot.setAttribute("cx", sx(t)); dot.setAttribute("cy", sy(ap(t)));
              const act = (s.ions[phaseOf(t)] || []);
              const key = act.join();
              if (key !== api._key) { api._key = key; fl.set(act.map((c) => ({ el: K.$("#ip-" + c, svg), color: K.css(COL[c]), n: 3, speed: c === "na" ? 140 : 60, r: 4.5 }))); }
              fl.tick(dt);
            });
          },
        },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Dari listrik ke kontraksi", nodes: ["Potensial aksi menyebar ke tubulus T", "Kanal Ca²⁺ tipe L terbuka saat plateau → Ca²⁺ masuk", "Ca²⁺ memicu reseptor ryanodine di RS → Ca²⁺ dilepas besar-besaran", "Ca²⁺ berikatan dengan troponin C → aktin terbuka untuk miosin", "Jembatan silang terbentuk → sarkomer memendek → kontraksi"] },
            { label: "Mengapa ada periode refrakter panjang?", nodes: ["Kanal Na⁺ inaktif segera setelah fase 0", "Kanal baru pulih bila membran kembali negatif (fase 3)", "Plateau menahan membran tetap positif ±200 ms", "Selama itu tidak ada potensial aksi baru yang bisa dipicu", "Jantung pasti relaksasi dan terisi sebelum kontraksi berikutnya"] },
            { label: "Bagaimana relaksasi terjadi?", nodes: ["Fase 3: kanal Ca²⁺ menutup, Ca²⁺ berhenti masuk", "SERCA memompa Ca²⁺ kembali ke RS (butuh ATP — A3)", "Penukar Na⁺/Ca²⁺ membuang sebagian Ca²⁺ ke luar sel", "Ca²⁺ sitosol turun → troponin melepas Ca²⁺", "Aktin tertutup kembali → otot relaksasi"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Uji periode refrakter", emoji: "⏱️", html: `
          <p>Rangsangan pertama diberikan di t = 0. Geser waktu <b>rangsangan kedua</b> dan lihat apakah sel bisa membuat potensial aksi baru — dan apakah kontraksinya bisa menumpuk.</p>
          <div class="slider-row"><label for="s2">Rangsangan kedua pada <output id="s2-o"></output></label><input type="range" id="s2" min="50" max="500" value="150" step="5"></div>
          <div class="viz-wrap"><svg id="ref-svg" style="max-width:600px;margin:auto" viewBox="0 0 420 210" role="img" aria-label="Uji periode refrakter">
            <rect id="r-erp" y="10" height="150" fill="var(--bad)" opacity=".08"/><rect id="r-rrp" y="10" height="150" fill="var(--warn)" opacity=".12"/>
            <line class="svg-axis" x1="30" y1="160" x2="415" y2="160"/>
            <path id="r-ten" fill="none" stroke="var(--ok)" stroke-width="2.5" stroke-dasharray="6 4"/>
            <path id="r-ap" fill="none" stroke="var(--primary)" stroke-width="3"/>
            <line id="r-stim" y1="10" y2="165" stroke="var(--accent)" stroke-width="2"/>
            <text id="r-stim-l" class="svg-label small" y="182" text-anchor="middle">⚡ ke-2</text>
            <text class="svg-label small" x="30" y="182">⚡ ke-1</text>
            <text class="svg-label small" x="222" y="203" text-anchor="middle">waktu (0–700 ms)</text>
          </svg>
          <div class="legend"><span><i style="background:var(--bad);opacity:.35"></i>Refrakter efektif</span><span><i style="background:var(--warn);opacity:.45"></i>Refrakter relatif</span><span><i style="background:var(--ok)"></i>Kontraksi</span></div></div>
          <div class="callout" id="ref-msg"></div>`,
          init(el) {
            const s2 = K.$("#s2", el);
            const X = (t) => 30 + t / 700 * 385, Y = (v) => 150 - (v + 90) * (120 / 115);
            const r = (id) => K.$(id, el);
            r("#r-erp").setAttribute("x", X(0)); r("#r-erp").setAttribute("width", X(250) - X(0));
            r("#r-rrp").setAttribute("x", X(250)); r("#r-rrp").setAttribute("width", X(300) - X(250));
            function draw() {
              const t2 = +s2.value;
              r("#s2-o").textContent = t2 + " ms";
              let resp = "none", amp = 1;
              if (t2 >= 300) resp = "full"; else if (t2 >= 250) { resp = "partial"; amp = (t2 - 250) / 50 * .5 + .4; }
              const V = (t) => resp === "none" || t < t2 ? ap(t) : Math.max(ap(t), ap(t - t2, { peak: -90 + 112 * amp, slowUp: resp === "partial" ? 5 : 2 }));
              const Tn = (t) => tension(t) + (resp === "none" ? 0 : tension(t - t2) * amp);
              r("#r-ap").setAttribute("d", K.plot(V, 0, 700, X, Y, 700));
              r("#r-ten").setAttribute("d", K.plot(Tn, 0, 700, X, (v) => 150 - v * 75, 350));
              r("#r-stim").setAttribute("x1", X(t2)); r("#r-stim").setAttribute("x2", X(t2)); r("#r-stim-l").setAttribute("x", X(t2));
              const m = r("#ref-msg");
              if (resp === "none") { m.className = "callout red"; m.innerHTML = "<p><b>Tidak ada respons.</b> Rangsangan jatuh di periode refrakter <b>efektif</b>: kanal Na⁺ masih inaktif, jadi tidak ada potensial aksi baru — sekuat apa pun rangsangannya.</p>"; }
              else if (resp === "partial") { m.className = "callout warn"; m.innerHTML = "<p><b>Respons lemah.</b> Periode refrakter <b>relatif</b>: sebagian kanal Na⁺ sudah pulih. Potensial aksi yang muncul lebih kecil dan lebih lambat — kondisi yang rawan memicu aritmia.</p>"; }
              else { m.className = "callout green"; m.innerHTML = "<p><b>Potensial aksi normal.</b> Perhatikan: kontraksi pertama sudah hampir selesai, sehingga kontraksi kedua <b>tidak menumpuk</b> menjadi tetani.</p>"; }
            }
            s2.addEventListener("input", draw); draw();
          } },
        { heading: "Kalium darah & potensial istirahat", emoji: "🧪", html: `
          <p>Potensial istirahat ditentukan terutama oleh gradien K⁺. Ubah kadar K⁺ <b>ekstraseluler</b> dan amati.</p>
          <div class="slider-row"><label for="ko">K⁺ darah <output id="ko-o"></output></label><input type="range" id="ko" min="2.5" max="8" value="4" step="0.1"></div>
          <div class="two-col">
            <div class="viz-wrap"><svg id="k-svg" viewBox="0 0 300 170" role="img" aria-label="Potensial aksi pada berbagai kadar kalium">
              <line class="svg-grid" x1="20" y1="150" x2="295" y2="150"/><text class="svg-label small" x="294" y="165" text-anchor="end">−90 mV</text>
              <path id="k-ref" fill="none" stroke="var(--text-soft)" stroke-width="1.5" stroke-dasharray="4 4"/>
              <path id="k-ap" fill="none" stroke="var(--primary)" stroke-width="3"/>
            </svg><div class="legend"><span>— — normal (4 mmol/L)</span></div></div>
            <div><div class="readouts"><div class="readout"><span>Potensial istirahat</span><b id="k-rmp"></b></div><div class="readout"><span>Kanal Na⁺ siap pakai</span><b id="k-na"></b></div></div>
              <div class="callout" id="k-msg"></div></div>
          </div>`,
          init(el) {
            const ko = K.$("#ko", el);
            const X = (t) => 20 + (t + 20) / 340 * 275, Y = (v) => 150 - (v + 90) * (130 / 115);
            K.$("#k-ref", el).setAttribute("d", K.plot((t) => ap(t), -20, 320, X, Y, 300));
            function draw() {
              const k = +ko.value;
              const rmp = 61.5 * Math.log10(k / 140) + 4;
              const avail = K.clamp(1 - (rmp + 88) / 22, 0.05, 1);
              const peak = -90 + 112 * (0.35 + 0.65 * avail);
              K.$("#ko-o", el).textContent = k.toFixed(1) + " mmol/L";
              K.$("#k-rmp", el).innerHTML = `${rmp.toFixed(0)}<small> mV</small>`;
              K.$("#k-na", el).textContent = Math.round(avail * 100) + "%";
              K.$("#k-ap", el).setAttribute("d", K.plot((t) => t < 0 ? rmp : Math.max(ap(t, { rmp, peak, slowUp: 2 + (1 - avail) * 10 }), rmp), -20, 320, X, Y, 300));
              const m = K.$("#k-msg", el);
              if (k > 5.5) { m.className = "callout red"; m.innerHTML = "<p><b>Hiperkalemia:</b> gradien K⁺ mengecil → potensial istirahat <b>kurang negatif</b>. Sebagian kanal Na⁺ terjebak inaktif → fase 0 lebih lambat & kecil → konduksi melambat. Berat: bisa henti jantung.</p>"; }
              else if (k < 3.5) { m.className = "callout warn"; m.innerHTML = "<p><b>Hipokalemia:</b> potensial istirahat lebih negatif, tetapi repolarisasi (fase 3) cenderung memanjang dan sel lebih mudah tereksitasi berlebihan → risiko aritmia.</p>"; }
              else { m.className = "callout green"; m.innerHTML = "<p>Kadar K⁺ normal (3,5–5 mmol/L). Hampir semua kanal Na⁺ siap dipakai.</p>"; }
            }
            ko.addEventListener("input", draw); draw();
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika kanal ionnya terganggu…", emoji: "🩺", intro: "Tanyakan: fase mana yang berubah?",
          items: [
            { icon: "⚡", title: "Hiperkalemia", chain: ["K⁺ darah tinggi (mis. gagal ginjal)", "Potensial istirahat kurang negatif → kanal Na⁺ inaktif", "Konduksi lambat, QRS melebar, bisa henti jantung"] },
            { icon: "📏", title: "Sindrom QT panjang", chain: ["Kanal K⁺ fase 3 lemah (genetik atau obat tertentu)", "Repolarisasi memanjang → QT memanjang di EKG", "Risiko after-depolarization → aritmia ventrikel berbahaya (torsades de pointes)"] },
            { icon: "💊", title: "Penghambat kanal Ca²⁺ (verapamil)", chain: ["Ca²⁺ yang masuk saat plateau berkurang", "Pelepasan Ca²⁺ dari RS berkurang", "Kontraksi melemah; di nodus SA/AV laju & konduksi melambat"] },
            { icon: "🧬", title: "Obat antiaritmia kelas I", chain: ["Menghambat kanal Na⁺ cepat", "Fase 0 lebih lambat", "Konduksi antarsel melambat — dipakai untuk memutus sirkuit aritmia tertentu"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Ion dan kanal yang bertanggung jawab atas <b>plateau (fase 2)</b> adalah…",
          options: ["Na⁺ masuk melalui kanal Na⁺ cepat", "Ca²⁺ masuk melalui kanal tipe L, diimbangi K⁺ keluar", "K⁺ masuk ke dalam sel", "Cl⁻ keluar dari sel"], answer: 1,
          explain: "Saat plateau, arus Ca²⁺ masuk (tipe L) kira-kira seimbang dengan arus K⁺ keluar, sehingga potensial bertahan di sekitar 0 mV." },
        { q: "Rangsangan kedua diberikan 150 ms setelah rangsangan pertama pada sel ventrikel. Apa yang terjadi?",
          options: ["Potensial aksi kedua normal", "Tidak ada potensial aksi baru karena berada di periode refrakter efektif", "Kontraksi kedua menumpuk menjadi tetani", "Sel langsung repolarisasi"], answer: 1,
          explain: "Pada 150 ms sel masih di fase 2 (plateau); kanal Na⁺ masih inaktif sehingga tidak ada potensial aksi baru yang dapat dipicu." },
        { q: "Mengapa hiperkalemia dapat memperlambat konduksi di ventrikel?",
          options: ["Karena K⁺ menghambat kanal Ca²⁺", "Karena potensial istirahat kurang negatif sehingga banyak kanal Na⁺ inaktif dan fase 0 melemah", "Karena potensial istirahat lebih negatif", "Karena K⁺ mempercepat SERCA"], answer: 1,
          explain: "Gradien K⁺ yang mengecil membuat membran lebih positif saat istirahat. Kanal Na⁺ yang terus terdepolarisasi masuk ke keadaan inaktif, sehingga fase 0 lebih lambat → konduksi lambat." },
        { q: "Mengapa fase 0 sel kontraktil jauh lebih curam daripada fase 0 sel SA node?",
          options: ["Sel kontraktil memakai kanal Na⁺ cepat, SA node memakai Ca²⁺ tipe L", "Sel kontraktil lebih kecil", "Sel SA node tidak memiliki K⁺", "Sel kontraktil memiliki plateau"], answer: 0,
          explain: "Kanal Na⁺ cepat membuka dan membawa arus yang sangat besar dalam waktu singkat; Ca²⁺ tipe L lebih lambat dan arusnya lebih kecil." },
        { q: "Obat yang memblokir kanal K⁺ fase 3 akan menyebabkan…",
          options: ["Potensial aksi memendek", "Repolarisasi dan periode refrakter memanjang", "Plateau hilang", "Potensial istirahat menjadi +20 mV"], answer: 1,
          explain: "Kanal K⁺ fase 3 mengembalikan membran ke −90 mV. Jika dihambat, repolarisasi lambat → durasi potensial aksi dan periode refrakter memanjang (QT memanjang)." },
      ]},
    ],
  });
})();
