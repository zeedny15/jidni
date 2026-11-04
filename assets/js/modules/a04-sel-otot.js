/* Modul A4 — Ciri Khas & Jenis Sel Otot Jantung */
(function () {
  function striations(x0, x1, y0, y1) {
    let s = "";
    for (let x = x0 + 8; x < x1 - 4; x += 9) s += `<line x1="${x}" y1="${y0 + 4}" x2="${x}" y2="${y1 - 4}" stroke="var(--primary)" stroke-width="1" opacity=".35"/>`;
    return s;
  }
  const VIZ = `<svg viewBox="0 0 420 300" role="img" aria-label="Diagram sel otot jantung">
    <g data-g="cell" data-info="cell">
      <rect class="cellr" x="14" y="50" width="138" height="56" rx="18" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="1.5"/>
      <rect class="cellr" x="156" y="50" width="134" height="56" rx="18" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="1.5"/>
      <rect class="cellr" x="294" y="50" width="112" height="56" rx="18" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="1.5"/>
      <rect class="cellr" x="214" y="110" width="118" height="50" rx="18" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="1.5"/>
      <path d="M230,100 L246,114" stroke="var(--primary)" stroke-width="10" stroke-linecap="round" opacity=".25"/>
      ${striations(14, 152, 50, 106)}${striations(156, 290, 50, 106)}${striations(294, 406, 50, 106)}${striations(214, 332, 110, 160)}
    </g>
    <g data-g="nuc" data-info="nuc">
      <ellipse cx="83" cy="78" rx="14" ry="9" fill="var(--accent)"/>
      <ellipse cx="223" cy="78" rx="14" ry="9" fill="var(--accent)"/>
      <ellipse cx="350" cy="78" rx="14" ry="9" fill="var(--accent)"/>
      <ellipse cx="273" cy="135" rx="14" ry="9" fill="var(--accent)"/>
    </g>
    <g data-g="mito" data-info="mito" fill="var(--warn)">
      <ellipse cx="40" cy="64" rx="7" ry="3.5"/><ellipse cx="120" cy="94" rx="7" ry="3.5"/><ellipse cx="185" cy="92" rx="7" ry="3.5"/>
      <ellipse cx="262" cy="62" rx="7" ry="3.5"/><ellipse cx="320" cy="94" rx="7" ry="3.5"/><ellipse cx="385" cy="62" rx="7" ry="3.5"/><ellipse cx="305" cy="148" rx="7" ry="3.5"/>
    </g>
    <g data-g="tt" data-info="tt" stroke="var(--vein)" stroke-width="2.5">
      <line x1="60" y1="50" x2="60" y2="106"/><line x1="200" y1="50" x2="200" y2="106"/><line x1="335" y1="50" x2="335" y2="106"/>
    </g>
    <g data-g="disc" data-info="disc" fill="none" stroke="var(--text)" stroke-width="3.5" stroke-linejoin="round">
      <path d="M154,50 v10 h-4 v10 h4 v10 h-4 v10 h4 v16"/>
      <path d="M292,50 v10 h-4 v10 h4 v10 h-4 v10 h4 v16"/>
      <path d="M240,108 l6,6 l-4,4 l6,6"/>
    </g>
    <text class="svg-label small" x="210" y="36" text-anchor="middle">Serat otot jantung: bercabang, lurik, tersambung ujung-ke-ujung</text>
    <!-- Lup diskus interkalaris -->
    <g data-g="zoom">
      <line x1="154" y1="106" x2="110" y2="186" stroke="var(--text-soft)" stroke-dasharray="3 3"/>
      <line x1="154" y1="106" x2="310" y2="186" stroke="var(--text-soft)" stroke-dasharray="3 3"/>
      <rect x="20" y="186" width="380" height="104" rx="14" fill="var(--surface)" stroke="var(--border)"/>
      <text class="svg-label small" x="32" y="204">Perbesaran diskus interkalaris</text>
      <rect x="30" y="212" width="160" height="70" rx="6" fill="var(--primary-soft)"/>
      <rect x="230" y="212" width="160" height="70" rx="6" fill="var(--primary-soft)"/>
      <text class="svg-label small" x="60" y="250">Sel 1</text><text class="svg-label small" x="330" y="250">Sel 2</text>
      <g data-g="desmo" data-info="desmo">
        <rect x="186" y="216" width="8" height="22" fill="var(--text)"/><rect x="226" y="216" width="8" height="22" fill="var(--text)"/>
        <g stroke="var(--text)" stroke-width="1.5"><line x1="194" y1="222" x2="226" y2="222"/><line x1="194" y1="227" x2="226" y2="227"/><line x1="194" y1="232" x2="226" y2="232"/></g>
        <path d="M186,220 C170,215 160,225 140,218 M186,234 C170,240 160,230 140,238 M234,220 C250,215 260,225 280,218 M234,234 C250,240 260,230 280,238" stroke="var(--text-soft)" fill="none"/>
        <text class="svg-label small" x="210" y="212" text-anchor="middle">desmosom</text>
      </g>
      <g data-g="gap" data-info="gap">
        <rect x="190" y="250" width="40" height="8" rx="3" fill="var(--ok)"/><rect x="190" y="264" width="40" height="8" rx="3" fill="var(--ok)"/>
        <text class="svg-label small" x="210" y="286" text-anchor="middle">gap junction</text>
        <path id="ion-path" d="M150,261 H270" fill="none"/>
      </g>
      <g class="ion-layer"></g>
    </g>
  </svg>`;

  const STEPS = [
    { title: "Bentuk: lurik dan bercabang", body: "Sel otot jantung tampak <b>lurik</b> (bergaris) seperti otot rangka karena berisi sarkomer. Bedanya: selnya <b>pendek</b> (±100 µm) dan <b>bercabang</b>, sehingga membentuk jaringan seperti anyaman.", key: "Bercabang → satu sel bisa terhubung ke banyak sel lain.", g: ["cell"] },
    { title: "Inti di tengah", body: "Setiap sel biasanya memiliki <b>1 inti (kadang 2) di tengah</b>. Otot rangka memiliki banyak inti di tepi sel.", key: "Sel otot jantung dewasa hampir tidak membelah lagi — tumbuh dengan membesar (hipertrofi).", g: ["cell", "nuc"] },
    { title: "Diskus interkalaris", body: "Ujung-ujung sel disambungkan oleh <b>diskus interkalaris</b> — garis gelap berkelok yang khas otot jantung. Di dalamnya ada dua “alat” penting: <b>desmosom</b> dan <b>gap junction</b>.", key: "Diskus interkalaris = ciri paling khas otot jantung di mikroskop.", g: ["cell", "disc", "zoom"] },
    { title: "Desmosom: perekat mekanis", body: "<b>Desmosom</b> mengikat sel satu dengan lainnya seperti paku keling, sehingga sel tidak terlepas saat jantung berkontraksi kuat ribuan kali per jam.", key: "Desmosom = sambungan MEKANIS.", g: ["zoom", "desmo"] },
    { title: "Gap junction: jalur listrik", body: "<b>Gap junction</b> adalah kanal kecil (koneksin) yang menghubungkan sitoplasma dua sel. Ion dapat langsung mengalir, sehingga potensial aksi menyebar cepat dari satu sel ke sel berikutnya.", key: "Gap junction = sambungan LISTRIK.", g: ["zoom", "gap"], ions: true },
    { title: "Sinsitium fungsional", body: "Berkat gap junction, ribuan sel bekerja seperti <b>satu kesatuan</b> (sinsitium fungsional): jika satu sel tereksitasi, semua ikut. Atrium dan ventrikel adalah dua sinsitium terpisah, dibatasi <b>rangka fibrosa</b>; penghubung satu-satunya adalah AV node.", key: "Prinsip “semua atau tidak sama sekali” untuk seluruh atrium/ventrikel.", g: ["cell", "disc"], wave: true },
    { title: "Tubulus T & retikulum sarkoplasma", body: "<b>Tubulus T</b> membawa potensial aksi masuk ke dalam sel. Ca²⁺ yang masuk dari luar sel memicu pelepasan Ca²⁺ yang jauh lebih besar dari retikulum sarkoplasma (<b>Ca²⁺-induced Ca²⁺ release</b>).", key: "Kontraksi jantung bergantung pada Ca²⁺ ekstraseluler — berbeda dari otot rangka.", g: ["cell", "tt"] },
    { title: "Kaya mitokondria", body: "Mitokondria mengisi ±30% volume sel (lihat A3), tersusun di antara miofibril. Inilah yang membuat jantung tahan lelah, tetapi sangat butuh O₂.", key: "Banyak mitokondria = mesin aerob yang tak kenal lelah.", g: ["cell", "mito"] },
  ];

  registerModule({
    id: "a04",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Otot yang unik", emoji: "💡", html: `
          <p>Otot jantung adalah “campuran” sifat otot rangka dan otot polos, ditambah beberapa keistimewaan sendiri:</p>
          <ul class="key-points">
            <li><span class="k-ico">🦓</span><span><b>Lurik</b> seperti otot rangka, tetapi <b>involunter</b> seperti otot polos.</span></li>
            <li><span class="k-ico">🔗</span><span>Sel-selnya tersambung lewat <b>diskus interkalaris</b>, sehingga bekerja serempak.</span></li>
            <li><span class="k-ico">👥</span><span>Ada <b>dua jenis</b> sel: ±99% <b>sel kontraktil</b> (pekerja) dan ±1% <b>sel autoritmik</b> (pembuat & penghantar impuls).</span></li>
          </ul>
          <div class="callout"><p><b>Kaitan:</b> sel autoritmik akan dibahas di A5–A6 (sistem hantaran & pacemaker), sel kontraktil di A7 (potensial aksi).</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Membedah sel otot jantung", emoji: "🔬", intro: "Ikuti ciri-cirinya satu per satu. Klik bagian diagram untuk penjelasan.",
          viz: VIZ, steps: STEPS,
          info: {
            cell: ["Kardiomiosit", "Sel pendek, bercabang, lurik. Panjang ±100 µm, diameter ±15 µm."],
            nuc: ["Inti sel", "Satu (kadang dua) inti di tengah sel."],
            mito: ["Mitokondria", "±30% volume sel — untuk produksi ATP aerob terus-menerus."],
            tt: ["Tubulus T", "Invaginasi membran pada garis Z yang membawa potensial aksi ke dalam sel, dekat dengan retikulum sarkoplasma."],
            disc: ["Diskus interkalaris", "Sambungan ujung-ke-ujung antarsel; berisi desmosom, fascia adherens, dan gap junction."],
            desmo: ["Desmosom", "Sambungan mekanis kuat yang menahan sel tetap terikat saat berkontraksi."],
            gap: ["Gap junction", "Kanal koneksin yang menghubungkan sitoplasma dua sel; resistensi listrik rendah sehingga impuls cepat menyebar."],
          },
          onStep(i, s, api) {
            const svg = K.$("svg", api.viz);
            K.$$("[data-g]", svg).forEach((e) => { e.style.transition = "opacity .3s"; e.style.opacity = s.g.includes(e.dataset.g) || (e.dataset.g === "zoom" && (s.g.includes("desmo") || s.g.includes("gap"))) ? 1 : .2; });
            if (s.g.includes("desmo") || s.g.includes("gap")) { K.$$('[data-g="desmo"],[data-g="gap"]', svg).forEach((e) => e.style.opacity = s.g.includes(e.dataset.g) ? 1 : .25); }
            api._ions = !!s.ions; api._wave = !!s.wave;
            if (!s.ions) K.$(".ion-layer", svg).innerHTML = "";
            else { api._flow = api._flow || K.flow(K.$(".ion-layer", svg)); api._flow.set([{ el: K.$("#ion-path", svg), color: K.css("--warn"), n: 4, speed: 45, r: 3.5 }]); }
            if (!s.wave) K.$$(".cellr", svg).forEach((r) => r.style.fill = "");
          },
          init(api, secEl) {
            let t = 0;
            K.loop(secEl, (dt) => {
              if (api._ions && api._flow) api._flow.tick(dt);
              if (api._wave) {
                t += dt;
                const svg = K.$("svg", api.viz);
                const ph = (t % 2.4) / 0.25;
                K.$$(".cellr", svg).forEach((r, i) => {
                  const order = [0, 1, 2, 2][i];
                  const on = ph >= order && ph < order + 2.2;
                  r.style.fill = on ? K.css("--primary") : "";
                  r.style.transition = "fill .15s";
                });
              }
            });
          },
        },
        { heading: "Dua jenis sel otot jantung", emoji: "👥", html: `
          <div class="segmented" id="type-tabs" role="group"><button type="button" class="on" data-t="k">Sel kontraktil</button><button type="button" data-t="a">Sel autoritmik</button><button type="button" data-t="s">Bandingkan: otot rangka</button></div>
          <div class="two-col" style="margin-top:12px">
            <div id="type-body"></div>
            <div class="viz-wrap"><svg viewBox="0 0 220 150" role="img" aria-label="Bentuk potensial aksi" style="max-width:320px;margin:auto">
              <line class="svg-axis" x1="20" y1="130" x2="210" y2="130"/><line class="svg-axis" x1="20" y1="10" x2="20" y2="130"/>
              <text class="svg-label small" x="115" y="146" text-anchor="middle">waktu</text>
              <path id="type-ap" fill="none" stroke="var(--primary)" stroke-width="3"/>
              <text id="type-cap" class="svg-label small" x="115" y="20" text-anchor="middle"></text>
            </svg></div>
          </div>`,
          init(el) {
            const T = {
              k: { html: `<ul class="key-points"><li><span class="k-ico">💪</span><span>±99% sel jantung — miokardium atrium & ventrikel.</span></li><li><span class="k-ico">🔋</span><span>Potensial istirahat <b>stabil</b> ±−90 mV; tidak menembak sendiri, menunggu impuls.</span></li><li><span class="k-ico">⚡</span><span>Depolarisasi cepat oleh Na⁺, lalu <b>plateau</b> panjang oleh Ca²⁺.</span></li><li><span class="k-ico">🧵</span><span>Penuh miofibril → tugas utamanya berkontraksi.</span></li></ul>`,
                d: "M20,110 H60 L64,30 L70,38 C90,40 120,42 135,55 C150,80 155,105 165,110 H210", cap: "Plateau panjang (±250 ms)" },
              a: { html: `<ul class="key-points"><li><span class="k-ico">🎵</span><span>±1% sel — SA node, AV node, berkas His, serabut Purkinje.</span></li><li><span class="k-ico">📈</span><span>Potensial istirahat <b>tidak stabil</b>: perlahan naik sendiri (pacemaker potential) hingga ambang.</span></li><li><span class="k-ico">⚡</span><span>Pada SA/AV node, depolarisasi oleh <b>Ca²⁺</b> (lebih lambat).</span></li><li><span class="k-ico">🧵</span><span>Sedikit miofibril → tugasnya membuat & menghantarkan impuls.</span></li></ul>`,
                d: "M20,100 C40,96 55,85 62,72 C66,55 70,45 76,42 C86,50 92,80 100,100 C120,96 135,85 142,72 C146,55 150,45 156,42 C166,50 172,80 180,100 C192,97 200,92 210,86", cap: "Naik sendiri tanpa rangsangan" },
              s: { html: `<ul class="key-points"><li><span class="k-ico">🦴</span><span>Otot rangka: sel panjang, tidak bercabang, banyak inti di tepi.</span></li><li><span class="k-ico">🔌</span><span>Tidak ada gap junction → tiap serat butuh sarafnya sendiri.</span></li><li><span class="k-ico">⏱️</span><span>Potensial aksi sangat singkat (±2 ms) → bisa <b>tetani</b>.</span></li><li><span class="k-ico">🧪</span><span>Ca²⁺ untuk kontraksi hampir seluruhnya dari retikulum sarkoplasma.</span></li></ul>`,
                d: "M20,110 H60 L63,30 L67,110 H210", cap: "Sangat singkat (±2 ms)" },
            };
            function show(k) {
              K.$$("#type-tabs button", el).forEach((b) => b.classList.toggle("on", b.dataset.t === k));
              K.$("#type-body", el).innerHTML = T[k].html;
              K.$("#type-ap", el).setAttribute("d", T[k].d);
              K.$("#type-cap", el).textContent = T[k].cap;
            }
            K.$$("#type-tabs button", el).forEach((b) => b.addEventListener("click", () => show(b.dataset.t)));
            show("k");
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Coba tebak tiap langkah sebelum membukanya.",
          chains: [
            { label: "Mengapa jantung tidak bisa tetani?", nodes: [
              "Potensial aksi sel kontraktil punya plateau panjang (±250 ms)",
              "Selama itu, kanal Na⁺ masih inaktif → periode refrakter efektif juga panjang",
              "Periode refrakter hampir sepanjang kontraksi itu sendiri",
              "Rangsangan baru tidak bisa memicu kontraksi sebelum otot mulai relaksasi",
              "Kontraksi tidak bisa menumpuk (tetani) → jantung selalu sempat relaksasi & terisi darah" ] },
            { label: "Mengapa sel jantung bekerja serempak?", nodes: [
              "Sel-sel tersambung oleh gap junction di diskus interkalaris",
              "Ion mengalir langsung antarsel → resistensi listrik rendah",
              "Potensial aksi menyebar dari sel ke sel tanpa perlu saraf",
              "Seluruh atrium (atau ventrikel) terdepolarisasi hampir bersamaan",
              "Kontraksi terkoordinasi seperti satu otot besar — sinsitium fungsional" ] },
            { label: "Mengapa kontraksi butuh Ca²⁺ dari luar sel?", nodes: [
              "Retikulum sarkoplasma jantung kurang berkembang dibanding otot rangka",
              "Ca²⁺ masuk dari cairan ekstraseluler saat plateau (kanal tipe L)",
              "Ca²⁺ ini memicu reseptor ryanodine membuka → Ca²⁺ dari RS dilepas",
              "Jumlah Ca²⁺ yang masuk menentukan kekuatan kontraksi",
              "Maka kadar Ca²⁺ darah & obat penghambat kanal Ca²⁺ memengaruhi kekuatan jantung" ] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator sinsitium: sebarkan impulsnya!", emoji: "⚡", html: `
          <p>Setiap kotak adalah satu sel. <b>Ketuk satu sel</b> untuk merangsangnya, dan lihat impuls menyebar melalui gap junction. Lalu coba aktifkan rintangan.</p>
          <div class="toggle-row">
            <button class="btn btn-sm" type="button" id="tg-fib">🧱 Tambah jaringan parut (fibrosis)</button>
            <button class="btn btn-sm" type="button" id="tg-sk">🦴 Tampilkan rangka fibrosa + AV node</button>
          </div>
          <div class="viz-wrap"><svg id="grid-svg" viewBox="0 0 400 290" style="max-width:520px;margin:auto" role="img" aria-label="Simulator penyebaran impuls"></svg>
            <div class="legend"><span><i style="background:var(--primary)"></i>Tereksitasi</span><span><i style="background:var(--text-soft)"></i>Refrakter</span><span><i style="background:var(--text)"></i>Tidak dapat menghantar</span><span><i style="background:var(--warn)"></i>AV node (lambat)</span></div>
          </div>
          <div class="callout" id="grid-msg"><p>Ketuk sel mana saja.</p></div>`,
          init(el, secEl) {
            const COLS = 10, ROWS = 7, S = 40;
            const svg = K.$("#grid-svg", el);
            let fib = false, sk = false;
            const st = []; // {state: 0 rest,1 exc,2 refr, t, block, av}
            let html = "";
            for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
              st.push({ s: 0, t: 0, block: false, av: false, r, c });
              html += `<rect data-i="${r * COLS + c}" x="${c * S + 2}" y="${r * S + 4}" width="${S - 4}" height="${S - 4}" rx="7" style="cursor:pointer"/>`;
            }
            html += `<text id="lbl-a" class="svg-label small" x="396" y="16" text-anchor="end"></text><text id="lbl-v" class="svg-label small" x="396" y="286" text-anchor="end"></text>`;
            svg.innerHTML = html;
            const rects = K.$$("rect", svg);
            function layout() {
              st.forEach((x) => { x.block = false; x.av = false; });
              if (fib) [[1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [2, 4], [3, 4]].forEach(([r, c]) => st[r * COLS + c].block = true);
              if (sk) { for (let c = 0; c < COLS; c++) st[2 * COLS + c].block = true; st[2 * COLS + 4].block = false; st[2 * COLS + 4].av = true; }
              K.$("#lbl-a", el).textContent = sk ? "ATRIUM" : "";
              K.$("#lbl-v", el).textContent = sk ? "VENTRIKEL" : "";
              paint();
            }
            function paint() {
              st.forEach((x, i) => {
                rects[i].style.fill = x.block ? K.css("--text") : x.s === 1 ? K.css("--primary") : x.s === 2 ? K.css("--text-soft") : x.av ? K.css("--warn") : K.css("--primary-soft");
                rects[i].style.opacity = x.s === 2 ? .55 : 1;
              });
            }
            rects.forEach((r) => r.addEventListener("click", () => {
              const x = st[+r.dataset.i];
              if (x.block || x.s) return;
              x.s = 1; x.t = 0; paint();
              K.$("#grid-msg", el).innerHTML = "<p>Impuls menyebar ke sel tetangga melalui gap junction, lalu sel menjadi <b>refrakter</b> (abu-abu) sehingga impuls tidak berbalik arah.</p>";
            }));
            let acc = 0;
            K.loop(secEl, (dt) => {
              acc += dt; if (acc < .09) return; acc = 0;
              const toExcite = [];
              st.forEach((x, i) => {
                if (x.s === 1) {
                  x.t++;
                  const delay = x.av ? 5 : 1;
                  if (x.t === delay) {
                    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
                      const r = x.r + dr, c = x.c + dc;
                      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
                      const n = st[r * COLS + c];
                      if (!n.block && n.s === 0) toExcite.push(n);
                    });
                  }
                  if (x.t > delay + 2) { x.s = 2; x.t = 0; }
                } else if (x.s === 2) { x.t++; if (x.t > 8) { x.s = 0; x.t = 0; } }
              });
              toExcite.forEach((n) => { n.s = 1; n.t = 0; });
              paint();
            });
            K.$("#tg-fib", el).addEventListener("click", (e) => { fib = !fib; e.target.classList.toggle("on", fib); layout();
              if (fib) K.$("#grid-msg", el).innerHTML = "<p><b>Jaringan parut</b> tidak punya gap junction fungsional. Impuls harus <b>memutar</b> — jalurnya lebih panjang dan lambat. Pada jantung nyata, jalur memutar seperti ini bisa memicu aritmia (reentri).</p>"; });
            K.$("#tg-sk", el).addEventListener("click", (e) => { sk = !sk; e.target.classList.toggle("on", sk); layout();
              if (sk) K.$("#grid-msg", el).innerHTML = "<p><b>Rangka fibrosa</b> memisahkan sinsitium atrium dan ventrikel. Satu-satunya jalan adalah <b>AV node</b> (oranye) yang menghantar lambat → ventrikel tereksitasi <b>setelah</b> atrium. Ketuk sel di baris atas!</p>"; });
            K.onTheme(paint);
            layout();
          } },
        { type: "match", heading: "Cocokkan struktur dengan fungsinya", emoji: "🧩", intro: "Ketuk struktur di kiri, lalu fungsinya di kanan.",
          pairs: [
            ["Gap junction", "Menyebarkan potensial aksi antarsel"],
            ["Desmosom", "Menahan sel agar tidak lepas saat kontraksi"],
            ["Plateau potensial aksi yang panjang", "Mencegah tetani"],
            ["Banyak mitokondria", "Produksi ATP aerob terus-menerus"],
            ["Tubulus T", "Membawa impuls ke bagian dalam sel"],
          ] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika ciri khas ini terganggu…", emoji: "🩺", intro: "Hubungkan struktur yang rusak dengan fungsinya yang hilang.",
          items: [
            { icon: "🧱", title: "Jaringan parut setelah infark", chain: ["Sel otot jantung dewasa hampir tidak bisa membelah", "Area yang mati diganti jaringan ikat (parut) tanpa gap junction", "Kontraksi area itu hilang dan impuls harus memutar → risiko <b>aritmia</b>"] },
            { icon: "🧬", title: "Kelainan desmosom (mis. kardiomiopati aritmogenik)", chain: ["Protein desmosom abnormal", "Sel mudah terlepas saat stres mekanik, lalu diganti jaringan lemak/ikat", "Konduksi terganggu → aritmia ventrikel, terutama saat olahraga"] },
            { icon: "🏋️", title: "Hipertrofi ventrikel", chain: ["Beban kerja meningkat lama (mis. hipertensi)", "Sel tidak bertambah jumlah, tetapi membesar", "Dinding menebal & kaku; kebutuhan O₂ naik → mudah iskemia"] },
            { icon: "🧪", title: "Hipokalsemia berat", chain: ["Ca²⁺ ekstraseluler rendah", "Ca²⁺ yang masuk saat plateau berkurang → pemicu pelepasan Ca²⁺ RS berkurang", "Kekuatan kontraksi dapat menurun"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Bila satu sel ventrikel tereksitasi, mengapa seluruh ventrikel ikut tereksitasi?",
          options: ["Karena setiap sel dipersarafi saraf simpatis", "Karena gap junction menghubungkan sitoplasma antarsel", "Karena desmosom menghantarkan listrik", "Karena semua sel ventrikel adalah sel pacemaker"], answer: 1,
          explain: "Gap junction memungkinkan ion mengalir langsung antarsel, sehingga potensial aksi menyebar ke seluruh jaringan (sinsitium fungsional). Desmosom bersifat mekanis, bukan listrik." },
        { q: "Ciri potensial aksi otot jantung yang membuatnya <b>tidak bisa tetani</b> adalah…",
          options: ["Amplitudo yang tinggi", "Periode refrakter yang panjang karena plateau", "Potensial istirahat −90 mV", "Depolarisasi yang cepat"], answer: 1,
          explain: "Plateau membuat periode refrakter efektif hampir sepanjang kontraksi, sehingga rangsangan baru tidak dapat memicu kontraksi kedua sebelum relaksasi terjadi." },
        { q: "Mengapa impuls dari atrium tidak langsung menyebar ke ventrikel melalui otot di batas atrium–ventrikel?",
          options: ["Karena otot ventrikel tidak memiliki gap junction", "Karena dipisahkan rangka fibrosa yang tidak menghantar listrik, kecuali lewat AV node", "Karena impuls atrium terlalu lemah", "Karena katup jantung memantulkan impuls"], answer: 1,
          explain: "Rangka fibrosa jantung adalah isolator listrik. Satu-satunya jalur normal adalah AV node–berkas His, yang juga memberikan perlambatan penting." },
        { q: "Sel autoritmik berbeda dari sel kontraktil karena…",
          options: ["Memiliki lebih banyak miofibril", "Potensial membrannya naik sendiri menuju ambang tanpa rangsangan", "Potensial istirahatnya stabil −90 mV", "Tidak memiliki kanal ion"], answer: 1,
          explain: "Sel autoritmik tidak memiliki potensial istirahat yang stabil; potensialnya perlahan naik (pacemaker potential) hingga mencapai ambang dan menembak sendiri." },
        { q: "Seorang pasien mendapat obat penghambat kanal Ca²⁺ tipe L. Efek langsung yang paling mungkin pada sel kontraktil?",
          options: ["Kontraksi lebih kuat", "Kontraksi lebih lemah karena pemicu pelepasan Ca²⁺ dari RS berkurang", "Tidak berpengaruh karena Ca²⁺ hanya dari RS", "Sel menjadi tetani"], answer: 1,
          explain: "Pada otot jantung, Ca²⁺ yang masuk lewat kanal tipe L memicu pelepasan Ca²⁺ dari RS (CICR). Menghambatnya mengurangi Ca²⁺ total di sitosol → kekuatan kontraksi turun." },
      ]},
    ],
  });
})();
