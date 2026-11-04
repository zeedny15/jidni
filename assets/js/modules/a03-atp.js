/* Modul A3 — Produksi ATP di Otot Jantung */
(function () {
  const VIZ = `<svg viewBox="0 0 420 320" role="img" aria-label="Diagram produksi ATP di sel otot jantung">
    <rect x="6" y="20" width="34" height="290" rx="12" fill="var(--o2-rich)" opacity=".15"/>
    <text class="svg-label small" x="23" y="14" text-anchor="middle">Kapiler</text>
    <rect x="52" y="22" width="362" height="286" rx="24" fill="var(--surface)" stroke="var(--border)" stroke-width="2"/>
    <text class="svg-label small" x="70" y="40">Sel otot jantung (kardiomiosit)</text>

    <!-- mitokondria -->
    <g data-g="mito" data-info="mito">
      <ellipse cx="245" cy="185" rx="78" ry="104" fill="var(--warn-soft)" stroke="var(--warn)" stroke-width="2"/>
      <text class="svg-label small" x="245" y="96" text-anchor="middle">Mitokondria</text>
    </g>
    <g data-g="beta" data-info="beta"><rect x="200" y="104" width="90" height="26" rx="8" fill="var(--surface)" stroke="var(--warn)"/>
      <text class="svg-label small" x="245" y="121" text-anchor="middle">β-oksidasi</text></g>
    <g data-g="acoa" data-info="acoa"><rect x="205" y="150" width="80" height="24" rx="12" fill="var(--warn)"/>
      <text class="svg-label small white" x="245" y="166" text-anchor="middle" style="fill:#fff">Asetil-KoA</text></g>
    <g data-g="krebs" data-info="krebs"><circle cx="245" cy="212" r="24" fill="none" stroke="var(--warn)" stroke-width="3"/>
      <text class="svg-label small" x="245" y="216" text-anchor="middle">Krebs</text></g>
    <g data-g="etc" data-info="etc"><rect x="190" y="248" width="110" height="20" rx="6" fill="var(--accent)"/>
      <text class="svg-label small" x="245" y="262" text-anchor="middle" style="fill:#fff">Rantai elektron</text></g>

    <g data-g="glyco" data-info="glyco"><rect x="84" y="114" width="86" height="30" rx="8" fill="var(--surface-2)" stroke="var(--text-soft)"/>
      <text class="svg-label small" x="127" y="133" text-anchor="middle">Glikolisis</text></g>
    <g data-g="pyr" data-info="pyr"><circle cx="190" cy="160" r="6" fill="var(--text-soft)"/><text class="svg-label small" x="150" y="152">piruvat</text></g>

    <!-- substrat -->
    <text class="svg-label small" data-g="fa" x="56" y="56">Asam lemak</text>
    <text class="svg-label small" data-g="glu" x="56" y="108">Glukosa</text>
    <text class="svg-label small" data-g="lac" x="56" y="182">Laktat</text>
    <text class="svg-label small" data-g="ket" x="56" y="220">Keton</text>
    <text class="svg-label small" data-g="o2" x="56" y="285">O₂</text>

    <!-- konsumen -->
    <g data-g="use" data-info="myosin"><rect x="336" y="58" width="72" height="44" rx="10" fill="var(--primary-soft)" stroke="var(--primary)"/>
      <text class="svg-label small" x="372" y="77" text-anchor="middle">Miosin</text><text class="svg-label small" x="372" y="92" text-anchor="middle">kontraksi</text></g>
    <g data-g="use" data-info="serca"><rect x="336" y="128" width="72" height="44" rx="10" fill="var(--primary-soft)" stroke="var(--primary)"/>
      <text class="svg-label small" x="372" y="147" text-anchor="middle">SERCA</text><text class="svg-label small" x="372" y="162" text-anchor="middle">relaksasi</text></g>
    <g data-g="use" data-info="nak"><rect x="336" y="198" width="72" height="44" rx="10" fill="var(--primary-soft)" stroke="var(--primary)"/>
      <text class="svg-label small" x="372" y="217" text-anchor="middle">Na⁺/K⁺</text><text class="svg-label small" x="372" y="232" text-anchor="middle">pompa ion</text></g>
    <g data-g="pcr" data-info="pcr"><rect x="318" y="262" width="90" height="34" rx="10" fill="var(--ok-soft)" stroke="var(--ok)"/>
      <text class="svg-label small" x="363" y="283" text-anchor="middle">Kreatin-P</text></g>

    <!-- jalur (untuk partikel) -->
    <g fill="none" stroke-width="2.5" stroke-dasharray="4 4" opacity=".6">
      <path data-p="fa"   data-g="fa"   d="M40,64 H120 C170,64 200,80 212,104" stroke="var(--warn)"/>
      <path data-p="glu"  data-g="glu"  d="M40,116 H70 C80,116 82,124 86,128" stroke="var(--text-soft)"/>
      <path data-p="gly"  data-g="glyco" d="M170,130 C182,132 186,146 190,156" stroke="var(--text-soft)"/>
      <path data-p="lac"  data-g="lac"  d="M40,190 H130 C160,190 176,180 186,166" stroke="var(--text-soft)"/>
      <path data-p="ket"  data-g="ket"  d="M40,228 H150 C180,228 200,200 212,174" stroke="var(--text-soft)"/>
      <path data-p="pyr"  data-g="pyr"  d="M196,160 C200,162 203,162 206,162" stroke="var(--text-soft)"/>
      <path data-p="beta" data-g="beta" d="M245,130 V150" stroke="var(--warn)"/>
      <path data-p="krb"  data-g="krebs" d="M245,188 a24,24 0 1,1 -0.1,0" stroke="var(--warn)"/>
      <path data-p="o2"   data-g="o2"   d="M40,292 H170 C190,292 200,282 210,268" stroke="var(--o2-rich)"/>
      <path data-p="atp1" data-g="atp"  d="M300,256 C326,246 324,100 336,82" stroke="var(--ok)"/>
      <path data-p="atp2" data-g="atp"  d="M300,258 C326,248 326,160 336,152" stroke="var(--ok)"/>
      <path data-p="atp3" data-g="atp"  d="M300,260 C322,256 326,228 336,222" stroke="var(--ok)"/>
      <path data-p="pcr"  data-g="pcr"  d="M300,264 C310,272 314,278 318,279" stroke="var(--ok)"/>
    </g>
    <g class="flow-layer"></g>
  </svg>`;

  const STEPS = [
    { title: "Mesin yang tak pernah istirahat", body: "Jantung berdenyut ±100.000 kali per hari. Setiap kontraksi dan relaksasi butuh <b>ATP</b>. Cadangan ATP di sel hanya cukup untuk <b>beberapa detik</b>, jadi ATP harus dibuat terus-menerus.", key: "Jantung memproduksi & memakai ATP ±6 kg per hari — lebih dari berat jantung itu sendiri!", g: ["use", "atp"], p: ["atp1", "atp2", "atp3"] },
    { title: "Bahan bakar: “omnivora”", body: "Jantung bisa memakai hampir semua bahan bakar dari darah: <b>asam lemak</b> (60–70% saat istirahat), <b>glukosa</b>, <b>laktat</b>, dan <b>badan keton</b>.", key: "Fleksibel: bahan bakar dipilih sesuai yang paling tersedia di darah.", g: ["fa", "glu", "lac", "ket"], p: ["fa", "glu", "lac", "ket"] },
    { title: "Asam lemak → β-oksidasi", body: "Asam lemak masuk ke mitokondria dan dipotong-potong (β-oksidasi) menjadi banyak <b>asetil-KoA</b>. Satu molekul palmitat menghasilkan ±106 ATP.", key: "Asam lemak = bahan bakar paling “padat energi”, tetapi butuh O₂ lebih banyak per ATP.", g: ["fa", "mito", "beta", "acoa"], p: ["fa", "beta"] },
    { title: "Glukosa & laktat → piruvat", body: "Glukosa dipecah lewat <b>glikolisis</b> di sitosol menjadi piruvat. Laktat dari darah (misal dari otot rangka saat olahraga) diubah kembali menjadi piruvat oleh LDH. Piruvat lalu masuk mitokondria → asetil-KoA.", key: "Jantung sehat justru MEMAKAI laktat, bukan menghasilkannya.", g: ["glu", "glyco", "lac", "pyr", "acoa", "ket"], p: ["glu", "gly", "lac", "pyr", "ket"] },
    { title: "Siklus Krebs", body: "Asetil-KoA masuk <b>siklus Krebs</b>, menghasilkan NADH dan FADH₂ — “baterai” berisi elektron berenergi tinggi — serta CO₂.", key: "Semua jalur bahan bakar bertemu di asetil-KoA.", g: ["mito", "acoa", "krebs"], p: ["krb"] },
    { title: "Fosforilasi oksidatif: butuh O₂", body: "Elektron dari NADH/FADH₂ dialirkan di <b>rantai transpor elektron</b>; <b>O₂</b> adalah penerima elektron terakhir. Energinya dipakai ATP sintase membuat ATP. Lebih dari <b>95%</b> ATP jantung berasal dari sini.", key: "Tanpa O₂, mesin utama ATP berhenti dalam hitungan detik.", g: ["mito", "etc", "o2"], p: ["o2"] },
    { title: "Kreatin fosfat: kurir & cadangan", body: "ATP dari mitokondria memindahkan fosfatnya ke kreatin → <b>kreatin fosfat (PCr)</b>. PCr berdifusi ke miofibril dan mengisi ulang ATP di sana. PCr juga cadangan darurat yang habis pertama kali saat iskemia.", key: "PCr = “power bank” kecil yang menyangga ATP.", g: ["pcr", "etc"], p: ["pcr"] },
    { title: "Siapa yang memakai ATP?", body: "±60–70% ATP dipakai <b>miosin</b> untuk kontraksi. Sisanya untuk <b>pompa ion</b>: SERCA (memompa Ca²⁺ kembali ke retikulum sarkoplasma → relaksasi) dan Na⁺/K⁺-ATPase.", key: "Relaksasi pun butuh ATP! Tanpa ATP, jantung sulit berelaksasi.", g: ["use", "atp", "etc"], p: ["atp1", "atp2", "atp3"] },
  ];

  registerModule({
    id: "a03",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Energi untuk pompa seumur hidup", emoji: "💡", html: `
          <p>Dari A2 kamu tahu jantung sangat rakus O₂. <b>Untuk apa O₂ itu?</b> Untuk membuat <b>ATP</b> — “mata uang energi” yang dipakai untuk berkontraksi dan berelaksasi.</p>
          <ul class="key-points">
            <li><span class="k-ico">🏭</span><span>Otot jantung adalah mesin <b>aerob</b>: ±30% volume selnya berisi <b>mitokondria</b> (otot rangka hanya ±2–5%).</span></li>
            <li><span class="k-ico">⛽</span><span>Bahan bakarnya fleksibel: <b>asam lemak</b> (utama), glukosa, laktat, keton.</span></li>
            <li><span class="k-ico">🔋</span><span>Cadangan ATP sangat kecil → produksi harus terus berjalan, dan sangat bergantung pada <b>pasokan O₂ koroner</b>.</span></li>
          </ul>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Dari bahan bakar menjadi ATP", emoji: "🎬", intro: "Ikuti jalurnya langkah demi langkah. Klik kotak pada diagram untuk penjelasan.",
          viz: VIZ, steps: STEPS,
          info: {
            mito: ["Mitokondria", "Pabrik ATP aerob. Menempati ±30% volume kardiomiosit, tersusun rapat di antara miofibril supaya ATP dekat dengan pemakainya."],
            beta: ["β-oksidasi", "Pemotongan rantai asam lemak menjadi unit 2-karbon (asetil-KoA) di matriks mitokondria."],
            acoa: ["Asetil-KoA", "Titik temu semua bahan bakar sebelum masuk siklus Krebs."],
            krebs: ["Siklus Krebs (asam sitrat)", "Mengoksidasi asetil-KoA → CO₂, menghasilkan NADH & FADH₂ sebagai pembawa elektron."],
            etc: ["Rantai transpor elektron + ATP sintase", "Elektron dialirkan ke O₂ (menjadi H₂O). Gradien proton yang terbentuk memutar ATP sintase. Sumber >95% ATP jantung."],
            glyco: ["Glikolisis", "Glukosa → 2 piruvat di sitosol, menghasilkan 2 ATP. Tidak butuh O₂, tetapi hasilnya kecil."],
            pyr: ["Piruvat", "Jika O₂ cukup → masuk mitokondria jadi asetil-KoA. Jika O₂ kurang → diubah menjadi laktat (anaerob)."],
            myosin: ["Miosin ATPase", "Kepala miosin memecah ATP untuk menarik aktin (power stroke). ATP baru juga dibutuhkan untuk MELEPAS miosin dari aktin."],
            serca: ["SERCA", "Pompa Ca²⁺ di retikulum sarkoplasma. Menarik Ca²⁺ kembali dari sitosol sehingga otot berelaksasi."],
            nak: ["Na⁺/K⁺-ATPase", "Menjaga gradien Na⁺ dan K⁺ yang diperlukan untuk potensial aksi (topik A7)."],
            pcr: ["Kreatin fosfat", "Kreatin kinase memindahkan fosfat dari ATP mitokondria ke kreatin, lalu di miofibril mengembalikannya ke ADP → ATP."],
          },
          onStep(i, s, api) {
            const svg = K.$("svg", api.viz);
            K.$$("[data-g]", svg).forEach((e) => { e.style.transition = "opacity .3s"; e.style.opacity = s.g.includes(e.dataset.g) ? 1 : .22; });
            const fl = api._flow || (api._flow = K.flow(K.$(".flow-layer", svg)));
            fl.set(s.p.map((id) => {
              const el = K.$(`[data-p="${id}"]`, svg);
              const color = id.startsWith("atp") || id === "pcr" ? K.css("--ok") : id === "o2" ? K.css("--o2-rich") : K.css("--warn");
              return { el, color, speed: 40, n: Math.max(2, Math.round(el.getTotalLength() / 35)), r: 4 };
            }));
          },
          init(api, secEl) { K.loop(secEl, (dt) => api._flow && api._flow.tick(dt)); },
        },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Pilih pertanyaan, lalu buka satu per satu.",
          chains: [
            { label: "Mengapa jantung harus aerob?", nodes: [
              "Jantung bekerja terus-menerus, tanpa periode istirahat panjang",
              "Butuh ATP dalam jumlah besar dan stabil setiap detik",
              "Glikolisis anaerob hanya menghasilkan 2 ATP/glukosa; jalur aerob ±30–32 ATP",
              "Hanya jalur aerob (mitokondria + O₂) yang sanggup memenuhi kebutuhan",
              "Jantung tidak bisa “berutang O₂” seperti otot rangka → sangat bergantung pada aliran koroner" ] },
            { label: "Mengapa relaksasi butuh ATP?", nodes: [
              "Relaksasi terjadi bila Ca²⁺ dikeluarkan dari sitosol",
              "SERCA memompa Ca²⁺ kembali ke retikulum sarkoplasma — memakai ATP",
              "Kepala miosin juga butuh ATP untuk lepas dari aktin",
              "Jika ATP turun (iskemia), Ca²⁺ tertahan & miosin “lengket”",
              "Akibatnya ventrikel kaku dan sulit terisi — gangguan relaksasi muncul paling awal" ] },
            { label: "Mengapa glukosa lebih hemat O₂?", nodes: [
              "Asam lemak menghasilkan ATP lebih banyak per molekul",
              "Tetapi asam lemak butuh O₂ lebih banyak untuk tiap ATP yang dihasilkan",
              "Glukosa menghasilkan ±10–15% lebih banyak ATP per molekul O₂",
              "Saat O₂ terbatas (iskemia), memakai glukosa lebih efisien" ] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator bahan bakar", emoji: "🎚️", html: `
          <p>Pilih kondisi tubuh. Lihat bagaimana campuran bahan bakar jantung berubah, dan apa yang terjadi pada produksi ATP.</p>
          <div class="toggle-row" id="fuel-btns"></div>
          <div class="two-col">
            <div>
              <div class="bar-row"><div class="bar-label"><span>🧈 Asam lemak</span><b id="f-fa"></b></div><div class="bar"><span id="b-fa" style="background:var(--warn)"></span></div></div>
              <div class="bar-row"><div class="bar-label"><span>🍬 Glukosa</span><b id="f-glu"></b></div><div class="bar"><span id="b-glu" style="background:var(--accent)"></span></div></div>
              <div class="bar-row"><div class="bar-label"><span>🥛 Laktat</span><b id="f-lac"></b></div><div class="bar"><span id="b-lac" style="background:var(--vein)"></span></div></div>
              <div class="bar-row"><div class="bar-label"><span>🍋 Keton</span><b id="f-ket"></b></div><div class="bar"><span id="b-ket" style="background:var(--ok)"></span></div></div>
            </div>
            <div>
              <div class="readouts">
                <div class="readout"><span>Pasokan O₂</span><b id="r-o2"></b></div>
                <div class="readout big"><span>Produksi ATP</span><b id="r-atp"></b></div>
                <div class="readout"><span>Laktat</span><b id="r-lac" style="font-size:1rem"></b></div>
              </div>
            </div>
          </div>
          <div class="callout" id="fuel-msg"></div>` ,
          init(el) {
            const C = {
              rest: { label: "😴 Istirahat (puasa semalam)", fa: 65, glu: 20, lac: 12, ket: 3, o2: "Cukup", atp: "100%", lacs: "dipakai", msg: "Asam lemak mendominasi karena kadarnya di darah relatif tinggi saat puasa semalam." },
              meal: { label: "🍚 Setelah makan", fa: 40, glu: 45, lac: 12, ket: 3, o2: "Cukup", atp: "100%", lacs: "dipakai", msg: "Insulin ↑ → lebih banyak transporter GLUT4 di membran → jantung beralih ke glukosa." },
              exer: { label: "🏃 Olahraga", fa: 38, glu: 20, lac: 39, ket: 3, o2: "Cukup (aliran ↑)", atp: "↑↑ (kebutuhan ↑)", lacs: "dipakai banyak", msg: "Otot rangka melepas laktat ke darah; jantung memakainya sebagai bahan bakar. Aliran koroner naik untuk memenuhi O₂." },
              fast: { label: "🌙 Puasa lama / DM tak terkontrol", fa: 75, glu: 7, lac: 8, ket: 10, o2: "Cukup", atp: "100%", lacs: "dipakai", msg: "Insulin rendah → asam lemak & keton tinggi di darah; pemakaian glukosa turun. Efisiensi O₂ sedikit menurun." },
              isch: { label: "⚠️ Iskemia (O₂ kurang)", fa: 10, glu: 85, lac: 5, ket: 0, o2: "Sangat rendah", atp: "↓↓ 10–20%", lacs: "DIPRODUKSI", msg: "Tanpa O₂, mitokondria berhenti. Hanya glikolisis anaerob (2 ATP/glukosa) yang tersisa → ATP anjlok, laktat & H⁺ menumpuk (asidosis), kontraksi melemah." },
            };
            const btns = K.$("#fuel-btns", el);
            btns.innerHTML = Object.entries(C).map(([k, v]) => `<button class="btn btn-sm" type="button" data-k="${k}">${v.label}</button>`).join("");
            function show(k) {
              const c = C[k];
              K.$$("button", btns).forEach((b) => b.classList.toggle("on", b.dataset.k === k));
              ["fa", "glu", "lac", "ket"].forEach((f) => { K.$("#f-" + f, el).textContent = c[f] + "%"; K.$("#b-" + f, el).style.width = c[f] + "%"; });
              K.$("#r-o2", el).textContent = c.o2;
              K.$("#r-atp", el).textContent = c.atp;
              K.$("#r-lac", el).textContent = c.lacs;
              const m = K.$("#fuel-msg", el);
              m.className = k === "isch" ? "callout red" : "callout";
              m.innerHTML = `<p>${c.msg}${k === "isch" ? " <i>(Pada iskemia, % menggambarkan jalur yang masih berjalan, bukan jumlah energi.)</i>" : ""}</p>`;
            }
            K.$$("button", btns).forEach((b) => b.addEventListener("click", () => show(b.dataset.k)));
            show("rest");
          } },
        { heading: "Apa yang terjadi jika O₂ berhenti?", emoji: "⏱️", html: `
          <p>Tekan tombol untuk menghentikan aliran koroner pada sepotong otot jantung, lalu amati 60 detik pertama.</p>
          <div class="btn-row"><button class="btn btn-primary btn-sm" id="isch-go" type="button">⛔ Hentikan O₂</button><button class="btn btn-sm" id="isch-reset" type="button">↺ Pulihkan</button></div>
          <div class="viz-wrap" style="margin-top:10px">
            <svg viewBox="0 0 420 200" role="img" aria-label="Grafik ATP, kreatin fosfat, dan kekuatan kontraksi">
              <line class="svg-axis" x1="40" y1="170" x2="410" y2="170"/><line class="svg-axis" x1="40" y1="20" x2="40" y2="170"/>
              <text class="svg-label small" x="36" y="24" text-anchor="end">100%</text><text class="svg-label small" x="36" y="172" text-anchor="end">0</text>
              <text class="svg-label small" x="225" y="192" text-anchor="middle">detik setelah O₂ berhenti (0–60 s)</text>
              <path id="ln-atp" fill="none" stroke="var(--accent)" stroke-width="3"/>
              <path id="ln-pcr" fill="none" stroke="var(--ok)" stroke-width="3"/>
              <path id="ln-con" fill="none" stroke="var(--primary)" stroke-width="3"/>
            </svg>
            <div class="legend"><span><i style="background:var(--accent)"></i>ATP</span><span><i style="background:var(--ok)"></i>Kreatin fosfat</span><span><i style="background:var(--primary)"></i>Kekuatan kontraksi</span></div>
          </div>
          <div class="callout" id="isch-msg"><p>Tekan “Hentikan O₂”.</p></div>`,
          init(el, secEl) {
            const sx = (t) => 40 + t / 60 * 370, sy = (v) => 170 - v * 1.5;
            const atp = (t) => 100 - 12 * (1 - Math.exp(-t / 40));
            const pcr = (t) => 100 * Math.exp(-t / 10) + 8;
            const con = (t) => t < 2 ? 100 : 100 * Math.exp(-(t - 2) / 12);
            let t = 0, running = false;
            function draw() {
              const T = Math.max(t, 0.01);
              K.$("#ln-atp", el).setAttribute("d", K.plot(atp, 0, T, sx, sy, 80));
              K.$("#ln-pcr", el).setAttribute("d", K.plot((x) => Math.min(100, pcr(x)), 0, T, sx, sy, 80));
              K.$("#ln-con", el).setAttribute("d", K.plot(con, 0, T, sx, sy, 80));
              const m = K.$("#isch-msg", el);
              if (!running && t === 0) return;
              if (t < 8) m.innerHTML = "<p><b>Detik awal:</b> mitokondria berhenti. Kreatin fosfat langsung dipakai untuk mengisi ulang ATP → <b>PCr turun cepat</b>, ATP masih bertahan.</p>";
              else if (t < 30) m.innerHTML = "<p><b>Belasan detik:</b> kekuatan kontraksi sudah <b>turun tajam</b>, padahal ATP total belum habis. Penumpukan fosfat anorganik & H⁺ (asidosis) menghambat interaksi aktin–miosin.</p>";
              else m.innerHTML = "<p><b>1 menit:</b> area iskemik hampir berhenti berkontraksi. Jika berlanjut ±20–40 menit, sel mulai mati permanen (infark). Itulah mengapa “waktu adalah otot”.</p>";
            }
            K.$("#isch-go", el).addEventListener("click", () => { running = true; });
            K.$("#isch-reset", el).addEventListener("click", () => { running = false; t = 0; draw(); K.$("#isch-msg", el).innerHTML = "<p>Tekan “Hentikan O₂”.</p>"; });
            K.loop(secEl, (dt) => { if (running && t < 60) { t = Math.min(60, t + dt * 8); draw(); } });
            draw();
          } },
        { type: "order", heading: "Susun jalur glukosa → ATP", emoji: "🧩", intro: "Mulai dari glukosa. Ketuk tahap berikutnya sesuai urutan.",
          items: ["Glukosa masuk sel", "Glikolisis (sitosol)", "Piruvat", "Asetil-KoA (mitokondria)", "Siklus Krebs", "NADH & FADH₂", "Rantai elektron + O₂", "ATP sintase → ATP"],
          hints: { "Glikolisis (sitosol)": "Langkah pertama pemecahan glukosa terjadi di luar mitokondria.", "Piruvat": "Hasil akhir glikolisis.", "Asetil-KoA (mitokondria)": "Piruvat diubah sebelum masuk siklus Krebs.", "Siklus Krebs": "Asetil-KoA masuk ke siklus…", "NADH & FADH₂": "Siklus Krebs menghasilkan pembawa elektron.", "Rantai elektron + O₂": "Pembawa elektron menyerahkan elektronnya ke…", "ATP sintase → ATP": "Langkah terakhir." },
          done: "<b>Tepat!</b> Perhatikan: O₂ baru dibutuhkan di tahap rantai elektron — tetapi tanpa itu, seluruh jalur di atasnya ikut macet." },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika produksi energi terganggu…", emoji: "🩺", intro: "Ingat: tanpa O₂ → tanpa ATP aerob → kontraksi dan relaksasi terganggu.",
          items: [
            { icon: "💥", title: "Iskemia miokard", chain: ["Aliran koroner turun", "Metabolisme beralih ke glikolisis anaerob → laktat & H⁺ menumpuk", "Kontraksi melemah dalam hitungan detik; metabolit merangsang saraf → <b>nyeri dada</b>"] },
            { icon: "😴", title: "Miokardium “stunned”", chain: ["Iskemia singkat lalu aliran pulih", "Sel tidak mati, tetapi pemulihan mesin kontraksi butuh waktu", "Kontraksi tetap lemah selama berjam-jam hingga beberapa hari, lalu pulih"] },
            { icon: "🍩", title: "Diabetes", chain: ["Insulin kurang/resisten → jantung sulit memakai glukosa", "Jantung hampir sepenuhnya memakai asam lemak", "Kebutuhan O₂ per ATP lebih tinggi → jantung lebih rentan saat O₂ terbatas"] },
            { icon: "🔋", title: "Gagal jantung: “mesin kehabisan bahan bakar”", chain: ["Fungsi mitokondria & sistem kreatin fosfat menurun", "Cadangan energi (rasio PCr/ATP) turun", "Kemampuan jantung meningkatkan kerja saat aktivitas berkurang"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Mengapa jantung tidak dapat mengandalkan metabolisme anaerob seperti otot rangka saat sprint?",
          options: ["Karena jantung tidak memiliki enzim glikolisis", "Karena glikolisis anaerob menghasilkan ATP terlalu sedikit untuk kerja jantung yang terus-menerus", "Karena laktat tidak dapat dibentuk di jantung", "Karena jantung tidak menyimpan glukosa"], answer: 1,
          explain: "Jantung punya enzim glikolisis dan bisa membentuk laktat, tetapi glikolisis anaerob hanya menghasilkan 2 ATP/glukosa vs ±30–32 ATP secara aerob. Kerja jantung yang terus-menerus hanya bisa dipenuhi jalur aerob." },
        { q: "Pada keadaan istirahat setelah puasa semalam, bahan bakar utama jantung adalah…",
          options: ["Glukosa", "Asam lemak", "Asam amino", "Glikogen"], answer: 1,
          explain: "Asam lemak menyumbang ±60–70% ATP jantung saat istirahat. Setelah makan (insulin tinggi), porsi glukosa meningkat." },
        { q: "Saat iskemia, gangguan relaksasi ventrikel sering muncul. Penjelasan yang paling tepat?",
          options: ["Relaksasi terjadi pasif sehingga tidak dipengaruhi ATP", "SERCA butuh ATP untuk memompa Ca²⁺ kembali dan miosin butuh ATP untuk lepas dari aktin", "Iskemia menambah jumlah Ca²⁺ di retikulum sarkoplasma", "Laktat menyebabkan otot memanjang"], answer: 1,
          explain: "Relaksasi adalah proses <b>aktif</b>: SERCA memakai ATP untuk menurunkan Ca²⁺ sitosol, dan ATP diperlukan agar kepala miosin lepas dari aktin. Kekurangan ATP membuat otot “kaku”." },
        { q: "Saat olahraga, kadar laktat darah meningkat. Apa yang dilakukan jantung yang sehat terhadap laktat tersebut?",
          options: ["Membuang laktat ke vena koroner", "Mengubahnya menjadi piruvat untuk dioksidasi sebagai bahan bakar", "Menyimpannya sebagai glikogen", "Tidak memengaruhi jantung"], answer: 1,
          explain: "Jantung yang cukup O₂ mengambil laktat dari darah, mengubahnya menjadi piruvat (LDH), lalu mengoksidasinya di mitokondria. Jantung baru <b>memproduksi</b> laktat bila iskemik." },
        { q: "Pada 10 detik pertama setelah aliran koroner berhenti, zat yang kadarnya turun paling cepat adalah…",
          options: ["ATP", "Kreatin fosfat", "Glukosa darah", "Asam lemak"], answer: 1,
          explain: "Kreatin fosfat berperan sebagai penyangga: ia mengisi ulang ATP dari ADP. Karena itu PCr turun cepat lebih dulu, sementara ATP relatif dipertahankan pada awalnya." },
      ]},
    ],
  });
})();
