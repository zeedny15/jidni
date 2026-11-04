/* Modul D1 — Embriologi CVS (Kuliah 1) */
(function () {
  const SEG = [["Trunkus arteriosus", "var(--warn)"], ["Bulbus kordis", "var(--vein)"], ["Ventrikel primitif", "var(--primary)"], ["Atrium primitif", "var(--accent)"], ["Sinus venosus", "var(--ok)"]];
  const wrap = (inner, h = 260) => `<svg viewBox="0 0 420 ${h}" role="img" aria-label="Ilustrasi embriologi">${inner}</svg>`;

  const V_TIME = wrap(`
    <line x1="30" y1="120" x2="400" y2="120" stroke="var(--border)" stroke-width="6" stroke-linecap="round"/>
    ${[["Mg 3", 40, "Area kardiogenik (hari 18–19)"], ["Hari 21–22", 105, "Tabung jantung menyatu"], ["Hari 22–23", 170, "Mulai berdenyut"], ["Hari 23–28", 235, "Pelipatan (looping)"], ["Mg 4–7", 305, "Septasi & katup"], ["Mg 8", 385, "Jantung 4 ruang"]]
      .map(([w, x, t], i) => `<circle cx="${x}" cy="120" r="10" fill="var(--primary)"/><text class="svg-label small" x="${x}" y="${i % 2 ? 160 : 92}" text-anchor="middle" style="font-weight:700">${w}</text><text class="svg-label small" x="${x}" y="${i % 2 ? 176 : 76}" text-anchor="middle" style="font-size:9.5px">${t}</text>`).join("")}
    <text class="svg-label" x="210" y="230" text-anchor="middle">❤️ Jantung = organ pertama yang berfungsi pada embrio</text>`);

  const V_FIELD = wrap(`
    <text class="svg-label small" x="70" y="24" text-anchor="middle">① Area kardiogenik</text>
    <path d="M30,140 C30,60 110,60 110,140" fill="none" stroke="var(--primary)" stroke-width="12" stroke-linecap="round"/>
    <text class="svg-label small" x="70" y="180" text-anchor="middle" style="font-size:9.5px">mesoderm splanknik,</text><text class="svg-label small" x="70" y="193" text-anchor="middle" style="font-size:9.5px">bentuk tapal kuda</text>
    <text class="svg-label" x="140" y="110" text-anchor="middle">→</text>
    <text class="svg-label small" x="210" y="24" text-anchor="middle">② Dua tabung endokardial</text>
    <rect x="180" y="60" width="18" height="100" rx="9" fill="var(--primary)" opacity=".75"/><rect x="222" y="60" width="18" height="100" rx="9" fill="var(--primary)" opacity=".75"/>
    <text class="svg-label small" x="210" y="180" text-anchor="middle" style="font-size:9.5px">lipatan lateral embrio</text><text class="svg-label small" x="210" y="193" text-anchor="middle" style="font-size:9.5px">mendekatkan keduanya</text>
    <text class="svg-label" x="280" y="110" text-anchor="middle">→</text>
    <text class="svg-label small" x="350" y="24" text-anchor="middle">③ Satu tabung jantung</text>
    <rect x="332" y="55" width="36" height="110" rx="18" fill="var(--primary)"/>
    <text class="svg-label small" x="350" y="180" text-anchor="middle" style="font-size:9.5px">menyatu ±hari 21–22,</text><text class="svg-label small" x="350" y="193" text-anchor="middle" style="font-size:9.5px">berdenyut ±hari 22–23</text>`, 210);

  const V_TUBE = wrap(`
    <text class="svg-label small" x="120" y="16" text-anchor="middle">kranial ↑</text>
    ${SEG.map(([n, c], i) => `<rect data-info="seg${i}" x="90" y="${24 + i * 44}" width="60" height="40" rx="12" fill="${c}" opacity=".85"/><text class="svg-label small" x="160" y="${48 + i * 44}">${n}</text>`).join("")}
    <text class="svg-label small" x="120" y="250" text-anchor="middle">kaudal ↓ (aliran darah masuk dari bawah)</text>
    <g class="svg-label small" style="font-size:10px"><text x="300" y="60" text-anchor="middle">Jembatan keledai:</text>
      <text x="300" y="86" text-anchor="middle" style="font-weight:700;fill:var(--primary)">“Tolong Bawa</text><text x="300" y="104" text-anchor="middle" style="font-weight:700;fill:var(--primary)">Vas Antik Saya”</text>
      <text x="300" y="132" text-anchor="middle">T-B-V-A-S</text></g>`);

  const V_LOOP = wrap(`
    <path d="M200,230 C120,220 110,170 160,150 C230,120 270,110 240,70 C220,45 190,40 185,20" fill="none" stroke="var(--border)" stroke-width="30" stroke-linecap="round"/>
    <circle cx="185" cy="28" r="15" fill="var(--warn)"/><circle cx="240" cy="74" r="17" fill="var(--vein)"/><circle cx="175" cy="146" r="22" fill="var(--primary)"/><circle cx="135" cy="200" r="18" fill="var(--accent)"/><circle cx="205" cy="230" r="14" fill="var(--ok)"/>
    <text class="svg-label small" x="206" y="28">Trunkus</text><text class="svg-label small" x="262" y="76">Bulbus (ke kanan-bawah)</text>
    <text class="svg-label small" x="202" y="150">Ventrikel (ke kiri)</text><text class="svg-label small" x="20" y="200">Atrium (ke dorsal-kranial)</text><text class="svg-label small" x="224" y="244">Sinus venosus</text>
    <text class="svg-label small" x="320" y="200" text-anchor="middle">Pelipatan ke KANAN</text><text class="svg-label small" x="320" y="214" text-anchor="middle">(dextral / D-loop)</text>`);

  function atrial(stage) {
    // stage 0..3: septum primum, ostium primum menutup + sekundum, septum sekundum, foramen ovale berfungsi
    const sp = stage === 0 ? "M210,30 V120" : "M210,30 V150 L210,230";
    const os2 = stage >= 1 ? `<rect x="205" y="60" width="10" height="34" fill="var(--surface-2)"/><text class="svg-label small" x="222" y="80" style="font-size:9.5px">ostium sekundum</text>` : "";
    const ss = stage >= 2 ? `<path d="M190,30 V140" stroke="var(--vein)" stroke-width="9" stroke-linecap="round"/><text class="svg-label small" x="96" y="60" style="fill:var(--vein);font-size:10px">septum sekundum</text>` : "";
    const fo = stage >= 2 ? `<text class="svg-label small" x="120" y="170" style="font-size:9.5px">foramen ovale</text><line x1="160" y1="166" x2="188" y2="150" stroke="var(--text-soft)"/>` : "";
    const flow = stage === 3 ? `<path d="M120,190 C170,190 195,170 200,150 C205,110 215,90 260,80" fill="none" stroke="var(--o2-rich)" stroke-width="4" marker-end="url(#ar1)"/><text class="svg-label small" x="250" y="110" style="fill:var(--o2-rich)">darah AK → AKi</text>` : "";
    return wrap(`<defs><marker id="ar1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--o2-rich)"/></marker></defs>
      <rect x="60" y="20" width="300" height="220" rx="30" fill="var(--primary-soft)" stroke="var(--primary)"/>
      <text class="svg-label small" x="110" y="40">Atrium kanan</text><text class="svg-label small" x="250" y="40">Atrium kiri</text>
      <rect x="150" y="220" width="120" height="20" rx="8" fill="var(--warn)" opacity=".7"/><text class="svg-label small" x="210" y="256" text-anchor="middle">bantalan endokardial</text>
      <path d="${sp}" stroke="var(--primary)" stroke-width="7" stroke-linecap="round" fill="none"/>
      ${stage === 0 ? `<text class="svg-label small" x="222" y="180" style="font-size:9.5px">ostium primum</text>` : ""}
      <text class="svg-label small" x="222" y="140" style="fill:var(--primary);font-size:10px">septum primum</text>
      ${os2}${ss}${fo}${flow}`);
  }

  const V_VENT = wrap(`
    <rect x="60" y="100" width="300" height="140" rx="40" fill="var(--primary-soft)" stroke="var(--primary)"/>
    <path d="M210,240 V150" stroke="var(--primary)" stroke-width="12" stroke-linecap="round"/><text class="svg-label small" x="220" y="215" style="fill:var(--primary)">septum muskular (tumbuh dari dasar)</text>
    <rect x="200" y="110" width="20" height="40" fill="var(--warn)" opacity=".8"/><text class="svg-label small" x="226" y="128" style="font-size:9.5px">bagian membranosa</text><text class="svg-label small" x="226" y="141" style="font-size:9.5px">(bantalan + konus) — terakhir menutup</text>
    <text class="svg-label small" x="120" y="180" text-anchor="middle">VKa</text><text class="svg-label small" x="300" y="180" text-anchor="middle">VKi</text>
    <path d="M150,100 C170,60 230,60 250,20" stroke="var(--o2-poor)" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M270,100 C250,60 190,60 170,20" stroke="var(--o2-rich)" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>
    <text class="svg-label small" x="260" y="22">aorta</text><text class="svg-label small" x="110" y="22">a. pulmonalis</text>
    <text class="svg-label small" x="210" y="88" text-anchor="middle" style="font-size:9.5px">septum aortikopulmonal (spiral, dari neural crest)</text>`);

  const V_VALVE = wrap(`
    <text class="svg-label small" x="105" y="20" text-anchor="middle" style="font-weight:700">Katup AV</text>
    <rect x="40" y="40" width="130" height="40" rx="10" fill="var(--warn)" opacity=".7"/><text class="svg-label small" x="105" y="64" text-anchor="middle">bantalan AV</text>
    <path d="M60,80 Q60,150 75,170 M150,80 Q150,150 135,170" stroke="var(--warn)" stroke-width="6" fill="none"/>
    <g stroke="var(--text-soft)" stroke-width="2"><line x1="75" y1="170" x2="85" y2="210"/><line x1="70" y1="160" x2="85" y2="210"/><line x1="135" y1="170" x2="125" y2="210"/><line x1="140" y1="160" x2="125" y2="210"/></g>
    <ellipse cx="85" cy="222" rx="14" ry="14" fill="var(--primary)"/><ellipse cx="125" cy="222" rx="14" ry="14" fill="var(--primary)"/>
    <text class="svg-label small" x="105" y="252" text-anchor="middle" style="font-size:9.5px">daun katup · korda tendinea · m. papilaris</text>
    <text class="svg-label small" x="315" y="20" text-anchor="middle" style="font-weight:700">Katup semilunar</text>
    <circle cx="315" cy="120" r="70" fill="none" stroke="var(--o2-rich)" stroke-width="6"/>
    ${[0, 120, 240].map((a) => { const r = a * Math.PI / 180; return `<path d="M315,120 L${315 + 66 * Math.cos(r - .5)},${120 + 66 * Math.sin(r - .5)} A66,66 0 0,1 ${315 + 66 * Math.cos(r + 1.6)},${120 + 66 * Math.sin(r + 1.6)} Z" fill="var(--primary-soft)" stroke="var(--o2-rich)"/>`; }).join("")}
    <text class="svg-label small" x="315" y="210" text-anchor="middle" style="font-size:9.5px">3 tonjolan jaringan di trunkus</text><text class="svg-label small" x="315" y="224" text-anchor="middle" style="font-size:9.5px">dikeruk → 3 daun berbentuk kantong</text>`);

  const STEPS = [
    { title: "Kapan jantung terbentuk?", body: "Pembentukan jantung dimulai <b>minggu ke-3</b>. Jantung mulai berdenyut ±<b>hari 22–23</b> — organ pertama yang berfungsi, karena embrio yang tumbuh cepat tidak lagi cukup mendapat nutrisi hanya dengan difusi. Septasi berlangsung minggu 4–7, dan jantung 4 ruang terbentuk ±<b>minggu 8</b>.", key: "Periode kritis kelainan jantung kongenital = minggu 3–8.", viz: V_TIME },
    { title: "Dari mesoderm ke tabung", body: "Sel progenitor di <b>mesoderm splanknik</b> membentuk <b>area kardiogenik</b> berbentuk tapal kuda. Terbentuk dua <b>tabung endokardial</b>; lipatan lateral embrio mendekatkan dan <b>menyatukannya</b> menjadi satu tabung jantung primitif.", key: "Dua tabung → satu tabung (±hari 21–22).", viz: V_FIELD },
    { title: "Lima segmen tabung jantung", body: "Dari kranial ke kaudal: <b>trunkus arteriosus, bulbus kordis, ventrikel primitif, atrium primitif, sinus venosus</b>. Darah masuk dari bawah (sinus venosus) dan keluar dari atas (trunkus).", key: "Klik tiap segmen untuk melihat menjadi apa ia kelak.", viz: V_TUBE },
    { title: "Pelipatan (looping)", body: "Tabung memanjang lebih cepat dari rongga perikardium sehingga <b>melipat ke kanan</b> (hari 23–28). Bulbus bergeser ke kanan-bawah, ventrikel ke kiri, atrium ke belakang-atas. Inilah awal posisi ruang jantung dewasa.", key: "Looping ke kiri (L-loop) → posisi jantung abnormal (mis. dekstrokardia).", viz: V_LOOP },
    { title: "Septasi atrium ①: septum primum", body: "Dari atap atrium tumbuh <b>septum primum</b> ke arah bantalan endokardial. Celah di bawahnya disebut <b>ostium primum</b>.", key: "Septum primum = tipis, tumbuh dari atas.", viz: atrial(0) },
    { title: "Septasi atrium ②: ostium sekundum", body: "Sebelum ostium primum tertutup, bagian atas septum primum <b>berlubang</b> (apoptosis) membentuk <b>ostium sekundum</b> — supaya darah tetap bisa mengalir dari kanan ke kiri.", key: "Ostium primum menutup, ostium sekundum terbuka.", viz: atrial(1) },
    { title: "Septasi atrium ③: septum sekundum", body: "Di sisi kanan tumbuh <b>septum sekundum</b> yang lebih tebal tetapi tidak lengkap. Celah oval yang tersisa = <b>foramen ovale</b>.", key: "Septum sekundum = tebal, di kanan, tidak menutup penuh.", viz: atrial(2) },
    { title: "Septasi atrium ④: katup satu arah", body: "Septum primum berfungsi sebagai <b>katup flap</b> di sisi kiri foramen ovale. Karena tekanan AK janin > AKi, darah mendorong flap dan mengalir <b>AK → AKi</b>, tetapi tidak bisa sebaliknya.", key: "Setelah lahir: flap terdorong menempel → fossa ovalis.", viz: atrial(3) },
    { title: "Septasi kanal AV, ventrikel & trunkus", body: "<b>Bantalan endokardial</b> menyatu → membagi kanal AV menjadi kanan & kiri. <b>Septum interventrikular muskular</b> tumbuh dari dasar; celah terakhir ditutup <b>bagian membranosa</b>. Di trunkus, <b>septum aortikopulmonal</b> yang <b>berpilin (spiral)</b> membagi aorta dan a. pulmonalis.", key: "Bagian membranosa = lokasi VSD tersering. Pilinan gagal → transposisi arteri besar.", viz: V_VENT },
    { title: "Pembentukan katup", body: "<b>Katup AV</b> (mitral, trikuspid) dari jaringan bantalan AV yang “dikeruk” dari bawah → tersisa daun katup, <b>korda tendinea</b>, dan <b>m. papilaris</b>. <b>Katup semilunar</b> dari 3 tonjolan jaringan di trunkus yang dikeruk menjadi 3 daun berbentuk kantong.", key: "AV = dari bantalan AV; semilunar = dari tonjolan trunkus.", viz: V_VALVE },
  ];

  /* ---------- Sirkulasi fetus ---------- */
  const FET = `<svg viewBox="0 0 420 370" role="img" aria-label="Sirkulasi fetus">
    <rect x="130" y="6" width="160" height="34" rx="12" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="210" y="27" text-anchor="middle">🧠 Kepala & tubuh atas</text>
    <rect x="12" y="70" width="90" height="56" rx="20" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="57" y="102" text-anchor="middle">🫁 Paru</text>
    <rect x="14" y="250" width="78" height="44" rx="12" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="53" y="277" text-anchor="middle">Hati</text>
    <rect x="300" y="250" width="110" height="40" rx="12" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="355" y="275" text-anchor="middle">Tubuh bawah</text>
    <ellipse cx="40" cy="345" rx="34" ry="18" fill="var(--warn-soft)" stroke="var(--warn)"/><text class="svg-label small" x="40" y="349" text-anchor="middle">Plasenta</text>
    <rect x="125" y="150" width="62" height="45" rx="10" fill="var(--surface)" stroke="var(--o2-poor)"/><text class="svg-label small" x="156" y="177" text-anchor="middle">AK</text>
    <rect x="125" y="202" width="62" height="48" rx="10" fill="var(--surface)" stroke="var(--o2-poor)"/><text class="svg-label small" x="156" y="230" text-anchor="middle">VKa</text>
    <rect x="223" y="150" width="62" height="45" rx="10" fill="var(--surface)" stroke="var(--o2-rich)"/><text class="svg-label small" x="254" y="177" text-anchor="middle">AKi</text>
    <rect x="223" y="202" width="62" height="48" rx="10" fill="var(--surface)" stroke="var(--o2-rich)"/><text class="svg-label small" x="254" y="230" text-anchor="middle">VKi</text>
    <g fill="none" stroke-width="6" stroke-linecap="round" class="fv">
      <path data-s="uv" d="M60,334 C80,326 104,320 110,306"/>
      <path data-s="dv" data-info="dv" d="M110,306 V268"/>
      <path data-s="ivc" d="M110,268 V172 H125"/>
      <path data-s="svc" d="M170,40 V150"/>
      <path data-s="fo" data-info="fo" d="M187,165 H223"/>
      <path data-s="rarv" d="M150,195 V205"/>
      <path data-s="pt" d="M165,205 C175,170 160,130 120,110"/>
      <path data-s="lung" d="M102,98 H120 M102,98"/>
      <path data-s="pv" d="M100,118 C150,140 200,150 232,156"/>
      <path data-s="da" data-info="da" d="M150,135 C200,110 260,100 320,110"/>
      <path data-s="lalv" d="M254,195 V205"/>
      <path data-s="ao" d="M270,205 C280,140 290,80 230,40 M285,100 C310,95 325,105 325,130"/>
      <path data-s="dao" d="M325,110 V250"/>
      <path data-s="ua" data-info="ua" d="M330,290 C320,340 200,360 75,350"/>
    </g>
    <g class="fet-flow"></g>
    <g class="svg-label small" style="font-size:9.5px;font-weight:700">
      <text x="118" y="292" class="lb-dv">duktus venosus</text>
      <text x="205" y="144" text-anchor="middle" class="lb-fo">foramen ovale</text>
      <text x="240" y="98" text-anchor="middle" class="lb-da">duktus arteriosus</text>
      <text x="200" y="366" text-anchor="middle" class="lb-ua">2 a. umbilikalis</text>
      <text x="118" y="330" class="lb-uv">v. umbilikalis</text>
    </g>
  </svg>
  <div class="legend"><span><i style="background:var(--o2-rich)"></i>Kaya O₂</span><span><i style="background:var(--vein)"></i>Campuran</span><span><i style="background:var(--o2-poor)"></i>Miskin O₂</span><span>— — tertutup / jadi ligamen</span></div>`;

  function fetalState(born) {
    const R = K.css("--o2-rich"), M = K.css("--vein"), P = K.css("--o2-poor");
    return born ? {
      uv: null, dv: null, ua: null, fo: null, da: null,
      ivc: P, svc: P, rarv: P, pt: P, lung: P, pv: R, lalv: R, ao: R, dao: R,
    } : { uv: R, dv: R, ivc: R, svc: P, fo: R, rarv: P, pt: P, lung: P, pv: M, da: P, lalv: R, ao: R, dao: M, ua: P };
  }

  registerModule({
    id: "d01",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Dari tabung sederhana menjadi pompa empat ruang", emoji: "💡", html: `
          <p>Jantung dewasa terlihat rumit, tetapi awalnya hanya <b>satu tabung lurus</b>. Tabung itu <b>melipat</b>, lalu <b>dibagi oleh sekat</b> menjadi empat ruang, dan <b>katup</b> dipahat dari jaringan bantalan.</p>
          <ul class="key-points">
            <li><span class="k-ico">1️⃣</span><span><b>Tabung</b> (minggu 3) → 2️⃣ <b>Pelipatan</b> (minggu 4) → 3️⃣ <b>Septasi & katup</b> (minggu 4–7).</span></li>
            <li><span class="k-ico">🤰</span><span>Selama di rahim, paru belum bernapas → janin punya <b>3 jalan pintas</b>: duktus venosus, foramen ovale, duktus arteriosus.</span></li>
            <li><span class="k-ico">👶</span><span>Saat lahir, jalan pintas itu <b>menutup</b> dan sirkulasi menjadi seperti orang dewasa (A1).</span></li>
          </ul>
          <div class="callout"><p><b>Mengapa penting?</b> Hampir semua kelainan jantung bawaan (C1) adalah “langkah pembentukan yang gagal”. Pahami langkahnya, maka kelainannya mudah ditebak.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Pembentukan jantung tahap demi tahap", emoji: "🎬", intro: "Gambar berganti mengikuti tahap. Pada tahap tabung jantung, klik segmen untuk melihat turunannya.",
          viz: V_TIME, steps: STEPS, autoplayMs: 6500,
          info: {
            seg0: ["Trunkus arteriosus →", "Pangkal <b>aorta</b> dan <b>trunkus pulmonalis</b> (setelah dibagi septum aortikopulmonal)."],
            seg1: ["Bulbus kordis →", "Bagian <b>halus</b> ventrikel: konus arteriosus/infundibulum (VKa) dan vestibulum aorta (VKi)."],
            seg2: ["Ventrikel primitif →", "Bagian <b>trabekular</b> ventrikel (terutama VKi)."],
            seg3: ["Atrium primitif →", "Bagian <b>trabekular</b> atrium kanan & kiri, termasuk <b>aurikula</b>."],
            seg4: ["Sinus venosus →", "Kanan: bagian <b>halus</b> atrium kanan (sinus venarum). Kiri: <b>sinus koronarius</b> & v. oblik atrium kiri."],
          } },
        { type: "explorer", heading: "Sirkulasi fetus vs setelah lahir", emoji: "🤰", intro: "Langkah 1–4: sirkulasi janin. Langkah 5: apa yang berubah saat lahir. Klik jalan pintas untuk penjelasan.",
          viz: FET, autoplayMs: 6000,
          steps: [
            { title: "Sumber O₂ janin = plasenta", body: "Darah kaya O₂ dari plasenta dibawa <b>v. umbilikalis</b> (saturasi tertinggi, ±80%). Sebagian besar melewati hati lewat <b>duktus venosus</b> → v. kava inferior → atrium kanan.", key: "Jalan pintas ①: duktus venosus (melewati hati).", hi: ["uv", "dv", "ivc"], born: false },
            { title: "Foramen ovale: langsung ke kiri", body: "Aliran dari VCI diarahkan krista dividens langsung melewati <b>foramen ovale</b> ke atrium kiri → ventrikel kiri → aorta asendens. Darah terbaik ini menuju <b>otak & jantung</b> (arteri koroner, karotis).", key: "Jalan pintas ②: foramen ovale (melewati paru, kanan → kiri).", hi: ["ivc", "fo", "lalv", "ao"], born: false },
            { title: "Duktus arteriosus: lewat atas paru", body: "Darah dari v. kava superior (miskin O₂) masuk AK → VKa → a. pulmonalis. Karena paru janin berisi cairan dan <b>resistensi pembuluh paru sangat tinggi</b>, ±90% darah berbelok lewat <b>duktus arteriosus</b> ke aorta desendens.", key: "Jalan pintas ③: duktus arteriosus (a. pulmonalis → aorta).", hi: ["svc", "rarv", "pt", "da", "dao"], born: false },
            { title: "Kembali ke plasenta", body: "Darah campuran di aorta desendens memperdarahi tubuh bawah, lalu <b>2 a. umbilikalis</b> membawanya kembali ke plasenta untuk mengambil O₂ dan membuang CO₂/sisa metabolisme.", key: "Ingat: 1 vena umbilikalis (kaya O₂), 2 arteri umbilikalis (miskin O₂).", hi: ["dao", "ua"], born: false },
            { title: "Saat lahir: semuanya berubah", body: "<b>Napas pertama</b> → paru mengembang → resistensi paru ↓ → darah mengalir ke paru → tekanan AKi ↑. <b>Tali pusat dipotong</b> → aliran VCI ↓ → tekanan AK ↓. Akibatnya flap foramen ovale menempel (menutup), duktus arteriosus mengerut (O₂ ↑, prostaglandin ↓), dan pembuluh umbilikal menutup.", key: "Lihat jalur yang berubah menjadi garis putus-putus (ligamen).", hi: ["pv", "lalv", "ao", "pt"], born: true },
          ],
          info: {
            dv: ["Duktus venosus", "Menghubungkan v. umbilikalis ke VCI, melewati hati. Setelah lahir → <b>ligamentum venosum</b>."],
            fo: ["Foramen ovale", "Lubang di septum atrium, AK → AKi. Setelah lahir menutup fungsional (menit–jam), anatomis (bulan) → <b>fossa ovalis</b>. ±25% dewasa masih paten (PFO)."],
            da: ["Duktus arteriosus", "a. pulmonalis → aorta. Menutup fungsional 10–15 jam setelah lahir → <b>ligamentum arteriosum</b>. Dipertahankan terbuka oleh prostaglandin E & O₂ rendah."],
            ua: ["A. umbilikalis", "Dari a. iliaka interna ke plasenta. Setelah lahir → <b>ligamentum umbilikale medial</b> (bagian proksimal tetap: a. vesikalis superior)."],
          },
          onStep(i, s, api) {
            const svg = K.$("svg", api.viz), st = fetalState(s.born);
            K.$$(".fv path", svg).forEach((p) => {
              const k = p.dataset.s, c = st[k];
              p.style.stroke = c || K.css("--text-soft");
              p.style.strokeDasharray = c ? "" : "5 6";
              p.style.opacity = c ? (s.hi.includes(k) ? 1 : .35) : .7;
            });
            const lbl = { "lb-dv": "duktus venosus", "lb-fo": "foramen ovale", "lb-da": "duktus arteriosus", "lb-ua": "2 a. umbilikalis", "lb-uv": "v. umbilikalis" };
            const lig = { "lb-dv": "lig. venosum", "lb-fo": "fossa ovalis", "lb-da": "lig. arteriosum", "lb-ua": "lig. umbilikale medial", "lb-uv": "lig. teres hepatis" };
            Object.keys(lbl).forEach((k) => { const t = K.$("." + k, svg); t.textContent = s.born ? lig[k] : lbl[k]; t.style.fill = s.born ? K.css("--text-soft") : ""; });
            api._flow = api._flow || K.flow(K.$(".fet-flow", svg));
            api._flow.set(Object.entries(st).filter(([k, c]) => c && s.hi.includes(k) && k !== "lung").map(([k, c]) => ({ el: K.$(`[data-s="${k}"]`, svg), color: c, n: 3, speed: 45, r: 4 })));
          },
          init(api, secEl) { K.loop(secEl, (dt) => api._flow && api._flow.tick(dt)); } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu dan tebak langkah berikutnya.",
          chains: [
            { label: "Napas pertama → foramen ovale menutup", nodes: ["Bayi menangis/bernapas → alveolus terisi udara", "O₂ alveolus ↑ → pembuluh paru berdilatasi → resistensi paru turun drastis", "Aliran ke paru ↑ → darah balik dari v. pulmonalis ↑ → tekanan AKi naik", "Tali pusat dijepit → aliran VCI ↓ → tekanan AK turun", "Tekanan AKi > AK → flap septum primum terdorong menempel → foramen ovale menutup"] },
            { label: "Mengapa duktus arteriosus menutup?", nodes: ["Selama janin: PO₂ rendah + prostaglandin E₂ tinggi (dari plasenta) → duktus terbuka", "Setelah lahir: PO₂ darah meningkat", "Plasenta hilang & paru memetabolisme prostaglandin → PGE₂ turun", "Otot polos duktus berkontraksi → menutup fungsional dalam 10–15 jam", "Fibrosis dalam 2–3 minggu → ligamentum arteriosum"] },
            { label: "Mengapa darah terbaik menuju otak?", nodes: ["Darah paling kaya O₂ datang lewat VCI", "Krista dividens mengarahkan aliran VCI langsung ke foramen ovale", "Darah itu masuk AKi → VKi → aorta asendens", "Cabang pertama aorta: a. koroner, karotis, subklavia", "Otak & jantung yang paling sensitif mendapat O₂ terbaik"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { type: "order", heading: "Urutkan septasi atrium", emoji: "🧩", intro: "Mulai dari septum primum. Ketuk tahap berikutnya.", items: ["Septum primum tumbuh dari atap atrium", "Ostium primum terbentuk di bawahnya", "Ostium sekundum muncul di septum primum", "Septum sekundum tumbuh di sisi kanan", "Foramen ovale + flap septum primum", "Lahir: flap menempel → fossa ovalis"],
          hints: { "Ostium primum terbentuk di bawahnya": "Celah antara tepi septum primum dan bantalan.", "Ostium sekundum muncul di septum primum": "Lubang baru sebelum ostium primum menutup.", "Septum sekundum tumbuh di sisi kanan": "Septum kedua yang lebih tebal.", "Foramen ovale + flap septum primum": "Celah yang tersisa pada septum sekundum.", "Lahir: flap menempel → fossa ovalis": "Apa yang terjadi saat tekanan AKi > AK?" },
          done: "<b>Tepat!</b> Jika ostium sekundum terlalu besar atau septum sekundum terlalu kecil → <b>ASD sekundum</b> (C1)." },
        { type: "match", heading: "Struktur janin → sisa pada dewasa", emoji: "🔗", intro: "Ketuk struktur janin, lalu sisanya setelah lahir.",
          pairs: [["Duktus arteriosus", "Ligamentum arteriosum"], ["Foramen ovale", "Fossa ovalis"], ["Duktus venosus", "Ligamentum venosum"], ["V. umbilikalis", "Ligamentum teres hepatis"], ["A. umbilikalis", "Ligamentum umbilikale medial"]] },
        { type: "match", heading: "Segmen tabung jantung → turunannya", emoji: "🧬", intro: "Ketuk segmen, lalu struktur dewasa yang berasal darinya.",
          pairs: [["Trunkus arteriosus", "Pangkal aorta & trunkus pulmonalis"], ["Bulbus kordis", "Bagian halus ventrikel (infundibulum)"], ["Ventrikel primitif", "Bagian trabekular ventrikel"], ["Atrium primitif", "Aurikula (bagian trabekular atrium)"], ["Sinus venosus", "Sinus venarum AK & sinus koronarius"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div class="key-points" style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo"><b>T</b>olong <b>B</b>awa <b>V</b>as <b>A</b>ntik <b>S</b>aya → Trunkus · Bulbus · Ventrikel · Atrium · Sinus venosus (kranial → kaudal)</p></div>
            <div class="callout"><p class="mnemo">3 jalan pintas janin: <b>V-O-A</b> → duktus <b>V</b>enosus (lewati hati) · foramen <b>O</b>vale (lewati paru) · duktus <b>A</b>rteriosus (lewati paru)</p></div>
            <div class="callout green"><p class="mnemo">Septum <b>primum</b> = <b>p</b>ertama & <b>p</b>ipis (tipis) → jadi <b>p</b>intu (flap). Septum <b>sekundum</b> = <b>s</b>esudahnya & <b>s</b>olid (tebal).</p></div>
            <div class="callout warn"><p class="mnemo">Pembuluh umbilikal: “<b>1 vena bawa makanan, 2 arteri bawa sampah</b>”.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Coba jawab dalam hati, lalu balik kartunya.",
          cards: [["Kapan jantung mulai berdenyut?", "±Hari 22–23 (minggu ke-4)"], ["Asal sel jantung", "Mesoderm splanknik (area kardiogenik)"], ["Arah looping normal", "Ke kanan (D-loop)"], ["Bagian septum IV yang terakhir menutup", "Bagian membranosa (lokasi VSD tersering)"], ["Septum yang membagi trunkus", "Septum aortikopulmonal (spiral), dari sel neural crest"], ["Asal katup AV", "Bantalan endokardial AV"], ["Shunt janin yang melewati hati", "Duktus venosus"], ["Pemicu penutupan duktus arteriosus", "PO₂ ↑ dan prostaglandin E₂ ↓"], ["Sisa duktus arteriosus", "Ligamentum arteriosum"], ["Sisa v. umbilikalis", "Ligamentum teres hepatis"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika tahap pembentukan gagal…", emoji: "🩺", intro: "Tebak dulu tahap mana yang gagal, lalu buka kartunya.", note: "Detail tiap kelainan dibahas di C1 (Kelainan Jantung Kongenital).",
          items: [
            { icon: "🕳️", title: "Atrial Septal Defect (ASD)", chain: ["Ostium sekundum terlalu besar atau septum sekundum tidak cukup menutup", "Lubang di septum atrium menetap setelah lahir", "Darah mengalir AKi → AK (kiri ke kanan)"] },
            { icon: "🕳️", title: "Ventricular Septal Defect (VSD)", chain: ["Bagian membranosa septum IV gagal terbentuk", "Lubang di antara ventrikel", "Darah VKi → VKa; kelainan jantung bawaan tersering"] },
            { icon: "🌉", title: "Patent Ductus Arteriosus (PDA)", chain: ["Duktus gagal menutup (sering pada bayi prematur, rubela kongenital)", "Darah aorta → a. pulmonalis setelah lahir", "Paru kebanjiran darah; murmur kontinu “seperti mesin”"] },
            { icon: "🔀", title: "Tetralogi Fallot & transposisi", chain: ["Septum aortikopulmonal bergeser ke anterior (ToF) atau tidak berpilin (transposisi)", "ToF: stenosis pulmonal, VSD, aorta “menunggang”, hipertrofi VKa", "Darah miskin O₂ masuk sirkulasi sistemik → bayi biru (sianosis)"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Bagian halus dari dinding atrium kanan (sinus venarum) berasal dari…",
          options: ["Atrium primitif", "Sinus venosus kanan", "Bulbus kordis", "Trunkus arteriosus"], answer: 1,
          explain: "Tanduk kanan sinus venosus diserap ke atrium kanan menjadi bagian halusnya. Bagian trabekular (aurikula) berasal dari atrium primitif." },
        { q: "Mengapa sebagian besar darah di a. pulmonalis janin mengalir ke aorta lewat duktus arteriosus?",
          options: ["Karena tekanan aorta janin lebih tinggi", "Karena resistensi pembuluh paru janin sangat tinggi (paru belum mengembang)", "Karena foramen ovale menutup", "Karena paru janin sudah bernapas"], answer: 1,
          explain: "Paru berisi cairan dan pembuluhnya mengalami vasokonstriksi hipoksik → resistensi tinggi. Darah memilih jalan dengan resistensi lebih rendah: duktus arteriosus ke aorta." },
        { q: "Apa yang menyebabkan foramen ovale menutup secara fungsional saat lahir?",
          options: ["Tekanan AK menjadi lebih tinggi dari AKi", "Tekanan AKi menjadi lebih tinggi dari AK sehingga flap septum primum menempel", "Prostaglandin meningkat", "Duktus venosus terbuka lebih lebar"], answer: 1,
          explain: "Aliran paru ↑ menaikkan tekanan AKi; penjepitan tali pusat menurunkan aliran ke AK. Gradien terbalik menekan flap ke septum sekundum." },
        { q: "Bayi prematur dengan PDA dapat diberi indometasin/ibuprofen. Apa dasarnya?",
          options: ["Meningkatkan prostaglandin", "Menghambat sintesis prostaglandin sehingga duktus berkontraksi menutup", "Meningkatkan resistensi paru", "Membuka foramen ovale"], answer: 1,
          explain: "PGE₂ mempertahankan duktus terbuka. NSAID menghambat COX → PGE₂ ↓ → duktus menutup. (Sebaliknya, PGE₁ diberikan untuk mempertahankan duktus pada kelainan yang bergantung duktus.)" },
        { q: "Sel neural crest yang gagal bermigrasi ke trunkus paling mungkin menyebabkan…",
          options: ["ASD sekundum", "Kelainan septum aortikopulmonal (mis. Tetralogi Fallot, transposisi, trunkus arteriosus persisten)", "Dekstrokardia", "Hipoplasia hati"], answer: 1,
          explain: "Septum aortikopulmonal dibentuk dengan kontribusi sel neural crest. Gangguannya menyebabkan kelainan alur keluar (conotruncal)." },
      ]},
    ],
  });
})();
