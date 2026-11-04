/* Modul A12 — Pengaturan Denyut Jantung */
(function () {
  const VIZ = `<svg viewBox="0 0 420 320" role="img" aria-label="Jalur saraf pengatur denyut jantung">
    <g data-g="higher" data-info="higher"><rect x="140" y="6" width="140" height="32" rx="10" fill="var(--accent-soft)" stroke="var(--accent)"/><text class="svg-label small" x="210" y="26" text-anchor="middle">Korteks · limbik · hipotalamus</text></g>
    <path data-g="higher" data-p="hc" d="M210,38 V60" stroke="var(--accent)" stroke-width="3" fill="none"/>
    <g data-g="center" data-info="center">
      <rect x="140" y="60" width="140" height="52" rx="12" fill="var(--surface)" stroke="var(--text-soft)" stroke-width="2"/>
      <line x1="210" y1="60" x2="210" y2="112" stroke="var(--border)"/>
      <text class="svg-label small" x="175" y="82" text-anchor="middle">Kardio-</text><text class="svg-label small" x="175" y="96" text-anchor="middle">inhibitor</text>
      <text class="svg-label small" x="245" y="82" text-anchor="middle">Kardio-</text><text class="svg-label small" x="245" y="96" text-anchor="middle">akselerator</text>
      <text class="svg-label small" x="210" y="124" text-anchor="middle" style="font-size:10px">Pusat kardiovaskular — medula oblongata</text>
    </g>
    <!-- eferen -->
    <path data-g="vagus" data-p="vag" d="M170,112 C150,170 160,222 196,244" fill="none" stroke="var(--o2-poor)" stroke-width="4"/>
    <text data-g="vagus" class="svg-label small" x="120" y="190" style="fill:var(--o2-poor);font-weight:700">n. vagus</text>
    <path data-g="symp" d="M330,112 V222" stroke="var(--border)" stroke-width="10" stroke-linecap="round" fill="none"/>
    <text data-g="symp" class="svg-label small" x="344" y="150">medula</text><text data-g="symp" class="svg-label small" x="344" y="163">spinalis</text><text data-g="symp" class="svg-label small" x="344" y="176">T1–T4</text>
    <path data-g="symp" data-p="sym" d="M250,112 C290,118 330,120 330,150 V200 C330,232 268,248 230,252" fill="none" stroke="var(--warn)" stroke-width="4"/>
    <text data-g="symp" class="svg-label small" x="262" y="240" style="fill:var(--warn);font-weight:700">simpatis</text>
    <!-- jantung -->
    <g data-g="heart" data-info="heart" transform="translate(210 268)">
      <path d="M0,42 C-36,18 -50,-4 -42,-26 C-34,-46 -10,-46 0,-26 C10,-46 34,-46 42,-26 C50,-4 36,18 0,42 Z" fill="var(--primary)" id="a12-heart"/>
      <circle cx="-14" cy="-22" r="5" fill="#ffd43b"/><text class="svg-label small" x="0" y="6" text-anchor="middle" style="fill:#fff">SA</text>
    </g>
    <!-- aferen -->
    <g data-g="baro" data-info="baroC"><circle cx="52" cy="142" r="12" fill="var(--ok)"/><text class="svg-label small" x="52" y="166" text-anchor="middle">sinus karotis</text></g>
    <path data-g="baro" data-p="b1" d="M60,132 C80,104 110,90 140,84" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="5 4"/>
    <text data-g="baro" class="svg-label small" x="70" y="100" style="font-size:10px">n. IX</text>
    <g data-g="baro" data-info="baroA"><circle cx="82" cy="232" r="12" fill="var(--ok)"/><text class="svg-label small" x="82" y="256" text-anchor="middle">arkus aorta</text></g>
    <path data-g="baro" data-p="b2" d="M86,220 C90,170 112,112 142,100" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="5 4"/>
    <text data-g="baro" class="svg-label small" x="96" y="160" style="font-size:10px">n. X</text>
    <g data-g="chemo" data-info="chemo"><rect x="14" y="184" width="40" height="24" rx="8" fill="var(--vein)"/><text class="svg-label small" x="34" y="200" text-anchor="middle" style="fill:#fff">kemo</text></g>
    <path data-g="chemo" data-p="ch" d="M40,184 C46,140 96,80 140,72" fill="none" stroke="var(--vein)" stroke-width="3" stroke-dasharray="5 4"/>
    <g data-g="prop" data-info="prop"><rect x="364" y="270" width="50" height="28" rx="8" fill="var(--text-soft)"/><text class="svg-label small" x="389" y="288" text-anchor="middle" style="fill:#fff">otot</text></g>
    <path data-g="prop" data-p="pr" d="M392,270 C410,170 340,70 282,74" fill="none" stroke="var(--text-soft)" stroke-width="3" stroke-dasharray="5 4"/>
    <g data-g="hormone" data-info="adrenal"><rect x="290" y="290" width="62" height="24" rx="8" fill="var(--warn-soft)" stroke="var(--warn)"/><text class="svg-label small" x="321" y="306" text-anchor="middle">adrenal</text></g>
    <path data-g="hormone" data-p="ad" d="M292,300 C270,306 250,300 240,290" fill="none" stroke="var(--warn)" stroke-width="3" stroke-dasharray="2 4"/>
    <g class="flow-layer"></g>
  </svg>`;

  const STEPS = [
    { title: "Jantung berdenyut sendiri, otak mengatur kecepatan", body: "SA node punya laju intrinsik ±<b>100 x/menit</b> (A6). Sistem saraf otonom bertindak seperti <b>gas</b> (simpatis) dan <b>rem</b> (parasimpatis) yang mengatur laju itu sesuai kebutuhan.", key: "Saat istirahat, rem (vagus) lebih dominan → HR ±70.", g: ["center", "vagus", "symp", "heart"], p: [] },
    { title: "Pusat kardiovaskular di medula", body: "Di <b>medula oblongata</b> ada pusat <b>kardioinhibitor</b> (mengaktifkan vagus) dan <b>kardioakselerator</b> (mengaktifkan simpatis). Pusat ini menerima informasi dari reseptor dan otak bagian atas, lalu memutuskan “gas atau rem”.", key: "Medula = pusat integrasi refleks kardiovaskular.", g: ["center"], p: [] },
    { title: "Parasimpatis: nervus vagus", body: "Vagus melepas <b>asetilkolin</b> → reseptor <b>M2</b> di SA node & AV node → fase 4 lebih landai dan hiperpolarisasi → <b>HR turun</b>; konduksi AV melambat.", key: "Vagus hampir tidak mempersarafi ventrikel → efeknya terutama pada laju, bukan kekuatan.", g: ["center", "vagus", "heart"], p: ["vag"] },
    { title: "Simpatis: saraf kardiak T1–T4", body: "Serabut simpatis turun di medula spinalis, keluar di T1–T4, lalu ke SA node, AV node, dan <b>seluruh miokardium</b>. Melepas <b>norepinefrin</b> → reseptor <b>β1</b> → HR naik, konduksi lebih cepat, dan <b>kontraktilitas naik</b>.", key: "Simpatis = gas untuk laju DAN kekuatan.", g: ["center", "symp", "heart"], p: ["sym"] },
    { title: "Baroreseptor: sensor tekanan", body: "Reseptor regang di <b>sinus karotis</b> (via n. IX) dan <b>arkus aorta</b> (via n. X) terus melapor ke medula. Tekanan naik → dinding teregang → impuls ↑ → vagus ↑, simpatis ↓ → HR turun. Tekanan turun → sebaliknya.", key: "Ini refleks baroreseptor — pengatur tekanan darah detik-ke-detik.", g: ["baro", "center", "vagus", "symp", "heart"], p: ["b1", "b2"] },
    { title: "Kemoreseptor & proprioseptor", body: "<b>Kemoreseptor</b> (badan karotis & aorta, serta di medula) mendeteksi O₂ ↓, CO₂ ↑, H⁺ ↑. <b>Proprioseptor</b> di otot & sendi mendeteksi gerakan — itulah mengapa HR naik di awal olahraga sebelum metabolit menumpuk.", key: "Info kimia & gerakan → simpatis ↑ → HR ↑.", g: ["chemo", "prop", "center", "symp", "heart"], p: ["ch", "pr", "sym"] },
    { title: "Pusat yang lebih tinggi", body: "Emosi (sistem limbik), antisipasi, nyeri, dan suhu (hipotalamus) memengaruhi medula. Contoh: deg-degan sebelum ujian, atau HR naik saat demam.", key: "Pikiran & emosi bisa mengubah HR.", g: ["higher", "center", "symp", "vagus", "heart"], p: ["hc"] },
    { title: "Hormon & faktor lain", body: "<b>Epinefrin</b> dari medula adrenal (β1) → HR & kontraktilitas ↑. <b>Hormon tiroid</b> ↑ → HR ↑. <b>Suhu</b> ↑ → HR ↑. Ion K⁺ dan Ca²⁺ yang abnormal mengganggu ritme. <b>Refleks Bainbridge</b>: atrium teregang (volume ↑) → HR ↑.", key: "Pengaturan HR = saraf (cepat) + hormon & kimia (lebih lambat).", g: ["hormone", "heart"], p: ["ad"] },
  ];

  registerModule({
    id: "a12",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Gas dan rem jantung", emoji: "💡", html: `
          <p>Di A11 kamu belajar CO = HR × SV. Tubuh menaikkan atau menurunkan CO salah satunya dengan mengatur <b>HR</b>. Siapa yang mengatur?</p>
          <ul class="key-points">
            <li><span class="k-ico">📡</span><span><b>Reseptor</b> (sensor) — baroreseptor, kemoreseptor, proprioseptor.</span></li>
            <li><span class="k-ico">🧠</span><span><b>Pusat</b> (pengambil keputusan) — pusat kardiovaskular di medula oblongata, dipengaruhi otak yang lebih tinggi.</span></li>
            <li><span class="k-ico">🔌</span><span><b>Efektor</b> (pelaksana) — saraf <b>vagus</b> (rem) dan <b>simpatis</b> (gas), plus hormon.</span></li>
          </ul>
          <div class="callout"><p>Pola <b>sensor → pusat → efektor</b> ini akan muncul lagi di regulasi tekanan darah (B6).</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Peta kendali denyut jantung", emoji: "🗺️", intro: "Ikuti sinyal dari reseptor ke pusat lalu ke jantung. Klik kotak pada diagram untuk penjelasan.",
          viz: VIZ, steps: STEPS,
          info: {
            higher: ["Pusat yang lebih tinggi", "Korteks (antisipasi), sistem limbik (emosi), hipotalamus (suhu, stres) memodulasi pusat di medula."],
            center: ["Pusat kardiovaskular (medula oblongata)", "Kardioinhibitor → nukleus vagus; kardioakselerator → jalur simpatis. Juga ada pusat vasomotor (B6)."],
            heart: ["Jantung", "SA node menerima persarafan vagus & simpatis; ventrikel terutama dipersarafi simpatis."],
            baroC: ["Baroreseptor sinus karotis", "Reseptor regang di percabangan a. karotis komunis. Saraf aferen: n. glossofaringeus (IX)."],
            baroA: ["Baroreseptor arkus aorta", "Reseptor regang di lengkung aorta. Saraf aferen: n. vagus (X)."],
            chemo: ["Kemoreseptor", "Badan karotis & aorta (perifer) serta kemoreseptor sentral: peka terhadap O₂ ↓, CO₂ ↑, pH ↓."],
            prop: ["Proprioseptor", "Reseptor di otot & sendi. Aktif saat bergerak → HR naik cepat di awal olahraga."],
            adrenal: ["Medula adrenal", "Melepas epinefrin (dan norepinefrin) ke darah saat aktivasi simpatis → efek β1 pada jantung."],
          },
          onStep(i, s, api) {
            const svg = K.$("svg", api.viz);
            K.$$("[data-g]", svg).forEach((e) => { e.style.transition = "opacity .3s"; e.style.opacity = s.g.includes(e.dataset.g) ? 1 : .18; });
            api._flow = api._flow || K.flow(K.$(".flow-layer", svg));
            const col = { vag: "--o2-poor", sym: "--warn", b1: "--ok", b2: "--ok", ch: "--vein", pr: "--text-soft", hc: "--accent", ad: "--warn" };
            api._flow.set(s.p.map((id) => ({ el: K.$(`[data-p="${id}"]`, svg), color: K.css(col[id]), n: 3, speed: 70, r: 4 })));
          },
          init(api, secEl) {
            let t = 0;
            K.loop(secEl, (dt) => { api._flow && api._flow.tick(dt); t += dt; const h = K.$("#a12-heart", api.viz); h.style.transform = (t * 1.2) % 1 < .12 ? "scale(.9)" : ""; h.style.transformOrigin = "center"; h.style.transformBox = "fill-box"; });
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu dan tebak langkah berikutnya.",
          chains: [
            { label: "Berdiri tiba-tiba", nodes: ["Gravitasi menarik ±500 mL darah ke vena tungkai", "Aliran balik vena ↓ → SV ↓ → tekanan darah ↓", "Baroreseptor kurang teregang → impuls ke medula ↓", "Medula: vagus ↓, simpatis ↑", "HR ↑ (dan vasokonstriksi) → tekanan darah pulih dalam beberapa detik"] },
            { label: "Tekanan darah naik mendadak", nodes: ["Dinding sinus karotis & arkus aorta teregang lebih kuat", "Frekuensi impuls baroreseptor ↑", "Pusat kardioinhibitor aktif → vagus ↑; simpatis ↓", "HR ↓ dan kontraktilitas ↓ → CO ↓", "Tekanan darah kembali turun ke normal"] },
            { label: "Awal olahraga", nodes: ["Korteks motorik merencanakan gerakan (komando sentral)", "Proprioseptor otot & sendi langsung aktif saat bergerak", "Medula mengurangi vagus dan menaikkan simpatis", "HR naik dalam hitungan detik", "Selanjutnya kemoreseptor & epinefrin mempertahankan kenaikan"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator refleks baroreseptor", emoji: "🎚️", html: `
          <p>Geser <b>tekanan arteri rata-rata (MAP)</b>. Lihat frekuensi impuls baroreseptor, keluaran vagus/simpatis, dan HR yang dihasilkan. Lalu coba obat.</p>
          <div class="slider-row"><label for="map">Tekanan arteri rata-rata <output id="map-o"></output></label><input type="range" id="map" min="50" max="160" value="93"></div>
          <div class="toggle-row"><button class="btn btn-sm" id="atr" type="button">💉 Atropin (blok vagus)</button><button class="btn btn-sm" id="bb" type="button">💊 Penyekat β (blok simpatis)</button></div>
          <div class="viz-wrap"><svg id="baro-svg" viewBox="0 0 420 120" role="img" aria-label="Impuls baroreseptor"><line class="svg-grid" x1="10" y1="40" x2="410" y2="40"/><g id="spikes"></g><text class="svg-label small" x="10" y="20">Impuls baroreseptor (n. IX/X)</text>
            <text id="hr-ico" x="370" y="100" font-size="30" text-anchor="middle">❤️</text></svg></div>
          <div class="bar-row"><div class="bar-label"><span>🔵 Aktivitas vagus (rem)</span><b id="v-o"></b></div><div class="bar"><span id="v-b" style="background:var(--o2-poor)"></span></div></div>
          <div class="bar-row"><div class="bar-label"><span>🟠 Aktivitas simpatis (gas)</span><b id="s-o"></b></div><div class="bar"><span id="s-b" style="background:var(--warn)"></span></div></div>
          <div class="readouts"><div class="readout big"><span>Denyut jantung</span><b id="hr-o"></b></div></div>
          <div class="btn-row"><button class="btn btn-sm" data-m="93" type="button">😌 Normal</button><button class="btn btn-sm" data-m="68" type="button">🧍 Baru berdiri</button><button class="btn btn-sm" data-m="55" type="button">🩸 Perdarahan</button><button class="btn btn-sm" data-m="140" type="button">📈 Tekanan naik mendadak</button></div>
          <div class="callout" id="baro-msg"></div>`,
          init(el, secEl) {
            const map = K.$("#map", el); let atr = false, bb = false, rate = 0, hr = 72;
            K.$("#atr", el).addEventListener("click", (e) => { atr = !atr; e.target.classList.toggle("on", atr); upd(); });
            K.$("#bb", el).addEventListener("click", (e) => { bb = !bb; e.target.classList.toggle("on", bb); upd(); });
            K.$$("[data-m]", el).forEach((b) => b.addEventListener("click", () => { map.value = b.dataset.m; upd(); }));
            function upd() {
              const M = +map.value, f = 1 / (1 + Math.exp(-(M - 93) / 10));
              let V = 0.15 + 0.7 * f, S = 0.85 - 0.7 * f;
              rate = 2 + f * 16;
              const Ve = atr ? 0 : V, Se = bb ? 0 : S;
              hr = 100 * (1 + 0.9 * Se) / (1 + 2.0 * Ve);
              K.$("#map-o", el).textContent = M + " mmHg";
              K.$("#v-o", el).textContent = Math.round(V * 100) + "%" + (atr ? " (diblok)" : ""); K.$("#v-b", el).style.width = V * 100 + "%"; K.$("#v-b", el).style.opacity = atr ? .25 : 1;
              K.$("#s-o", el).textContent = Math.round(S * 100) + "%" + (bb ? " (diblok)" : ""); K.$("#s-b", el).style.width = S * 100 + "%"; K.$("#s-b", el).style.opacity = bb ? .25 : 1;
              K.$("#hr-o", el).innerHTML = `${Math.round(hr)}<small> x/menit</small>`;
              const m = K.$("#baro-msg", el);
              let txt = M < 80 ? "Tekanan <b>rendah</b> → dinding arteri kurang teregang → impuls baroreseptor <b>jarang</b> → medula mengurangi vagus & menaikkan simpatis → <b>HR naik</b> untuk menaikkan CO dan tekanan." : M > 110 ? "Tekanan <b>tinggi</b> → impuls baroreseptor <b>sering</b> → vagus ↑, simpatis ↓ → <b>HR turun</b> → CO dan tekanan turun." : "Tekanan normal: keseimbangan dengan tonus vagus yang dominan (HR ±70).";
              if (atr && bb) txt += " <b>Dengan kedua blok</b>, jantung berdenyut pada laju intrinsik SA node (±100) — refleks tidak bisa mengubah HR.";
              else if (atr) txt += " <b>Atropin</b> menghilangkan rem vagus → HR tinggi, refleks perlambatan hilang.";
              else if (bb) txt += " <b>Penyekat β</b> menghilangkan gas simpatis → HR rendah, dan HR sulit naik saat tekanan turun.";
              m.innerHTML = `<p>${txt}</p>`;
            }
            map.addEventListener("input", upd); upd();
            let acc = 0, spikes = [], beat = 0;
            K.loop(secEl, (dt) => {
              acc += dt * rate; while (acc > 1) { acc -= 1; spikes.push(410); }
              spikes = spikes.map((x) => x - dt * 140).filter((x) => x > 10);
              K.$("#spikes", el).innerHTML = spikes.map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="18" stroke="var(--ok)" stroke-width="2"/>`).join("");
              beat = (beat + dt * hr / 60) % 1; K.$("#hr-ico", el).setAttribute("font-size", beat < .15 ? 36 : 30);
            });
          } },
        { type: "match", heading: "Cocokkan komponen dengan perannya", emoji: "🧩", intro: "Ketuk item kiri, lalu pasangannya di kanan.",
          pairs: [["Baroreseptor sinus karotis", "Aferen lewat n. glossofaringeus (IX)"], ["Baroreseptor arkus aorta", "Aferen lewat n. vagus (X)"], ["Saraf simpatis kardiak", "Norepinefrin → reseptor β1"], ["Saraf vagus ke jantung", "Asetilkolin → reseptor M2"], ["Kemoreseptor perifer", "Mendeteksi O₂ ↓, CO₂ ↑, H⁺ ↑"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika pengaturannya terganggu…", emoji: "🩺", intro: "Pikirkan: komponen sensor, pusat, atau efektor yang berubah?",
          items: [
            { icon: "😵", title: "Sinkop vasovagal", chain: ["Pemicu (nyeri, melihat darah, berdiri lama) → refleks vagal berlebihan", "HR turun mendadak dan pembuluh melebar", "Tekanan darah turun → aliran ke otak berkurang → pingsan sesaat"] },
            { icon: "🫳", title: "Pijat sinus karotis", chain: ["Tekanan pada sinus karotis meniru tekanan darah tinggi", "Impuls baroreseptor ↑ → vagus ↑", "HR & konduksi AV melambat — kadang dipakai untuk menghentikan takikardia supraventrikular"] },
            { icon: "🍬", title: "Neuropati otonom (mis. diabetes lama)", chain: ["Serabut saraf otonom rusak", "Refleks baroreseptor tidak bekerja baik", "Saat berdiri tekanan darah turun tanpa kenaikan HR yang cukup → hipotensi ortostatik"] },
            { icon: "🫀", title: "Jantung transplantasi", chain: ["Saraf ke jantung terputus", "HR istirahat ±100 (laju intrinsik)", "Saat olahraga HR naik lambat — hanya lewat epinefrin dalam darah"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Seseorang tiba-tiba berdiri dan tekanan darahnya sedikit turun. Respons baroreseptor yang tepat adalah…",
          options: ["Impuls baroreseptor meningkat → HR turun", "Impuls baroreseptor menurun → vagus ↓, simpatis ↑ → HR naik", "Baroreseptor tidak merespons perubahan posisi", "Kemoreseptor menurunkan HR"], answer: 1,
          explain: "Tekanan turun → dinding arteri kurang teregang → impuls berkurang. Medula menafsirkannya sebagai “tekanan rendah” → mengurangi rem vagus dan menambah gas simpatis." },
        { q: "Mengapa simpatis, tetapi bukan vagus, dapat meningkatkan kekuatan kontraksi ventrikel secara bermakna?",
          options: ["Vagus hanya bekerja saat tidur", "Simpatis mempersarafi seluruh miokardium ventrikel, sedangkan vagus terutama ke SA & AV node", "Vagus melepas norepinefrin", "Ventrikel tidak memiliki reseptor β1"], answer: 1,
          explain: "Serabut simpatis tersebar ke seluruh otot ventrikel (β1 → Ca²⁺ ↑ → kontraktilitas ↑). Vagus terutama ke nodus dan atrium." },
        { q: "Pasien diberi atropin. Efek yang diharapkan pada HR istirahat adalah…",
          options: ["Turun karena simpatis diblok", "Naik karena rem vagus dihilangkan", "Tidak berubah", "Berhenti"], answer: 1,
          explain: "Atropin memblokir reseptor muskarinik (M2). Tonus vagus yang biasanya menurunkan HR dari ±100 ke ±70 hilang, sehingga HR naik." },
        { q: "Baroreseptor di arkus aorta mengirim informasi ke medula melalui…",
          options: ["N. glossofaringeus (IX)", "N. vagus (X)", "Saraf simpatis T1–T4", "N. frenikus"], answer: 1,
          explain: "Sinus karotis → n. IX; arkus aorta → n. X. Keduanya berakhir di nukleus traktus solitarius di medula." },
        { q: "HR mulai naik hanya beberapa detik setelah olahraga dimulai, sebelum CO₂ darah meningkat. Penyebab utamanya?",
          options: ["Kemoreseptor perifer", "Komando sentral dari korteks dan input proprioseptor", "Hormon tiroid", "Refleks baroreseptor akibat tekanan tinggi"], answer: 1,
          explain: "Korteks motorik dan proprioseptor otot/sendi langsung memberi sinyal ke medula, sehingga vagus turun dan simpatis naik sangat cepat." },
      ]},
    ],
  });
})();
