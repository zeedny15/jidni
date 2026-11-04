/* Modul D3 — Histologi CVS (Kuliah 3) */
(function () {
  // warna gaya pewarnaan H&E
  const PINK = "#f3a6c4", PINK2 = "#e98bb0", PURP = "#6a3d9a", COLL = "#f7c9d9", ELAS = "#c2185b", BG = "#fff7fb";
  const nuc = (x, y, rx = 6, ry = 3.5) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${PURP}"/>`;
  const L = (x, y, t, anchor = "start") => `<text class="svg-label small hl-lbl" x="${x}" y="${y}" text-anchor="${anchor}" style="font-size:10px;font-weight:700">${t}</text>`;
  const scope = (inner, h = 300) => `<div class="btn-row" style="justify-content:flex-end;margin-bottom:6px"><button type="button" class="btn btn-sm lbl-toggle">🙈 Sembunyikan label (latihan)</button></div>
    <svg viewBox="0 0 420 ${h}" role="img" aria-label="Preparat histologi"><defs><clipPath id="lens"><rect x="4" y="4" width="412" height="${h - 8}" rx="24"/></clipPath></defs>
    <rect x="4" y="4" width="412" height="${h - 8}" rx="24" fill="${BG}" stroke="var(--border)" stroke-width="3"/><g clip-path="url(#lens)">${inner}</g></svg>`;
  function myocytes(x0, y0, w, h, rows = 4, discs = true) {
    let s = ""; const rh = h / rows;
    for (let r = 0; r < rows; r++) {
      const y = y0 + r * rh, off = (r % 2) * 30;
      for (let x = x0 - off; x < x0 + w; x += 70) {
        s += `<rect x="${x}" y="${y + 2}" width="66" height="${rh - 4}" rx="6" fill="${PINK}"/>`;
        for (let k = 6; k < 64; k += 5) s += `<line x1="${x + k}" y1="${y + 4}" x2="${x + k}" y2="${y + rh - 4}" stroke="${PINK2}" stroke-width=".8"/>`;
        s += nuc(x + 33, y + rh / 2);
        if (discs) s += `<path d="M${x + 67},${y + 3} l2,${(rh - 6) / 3} l-2,${(rh - 6) / 3} l2,${(rh - 6) / 3}" stroke="${PURP}" stroke-width="2.2" fill="none"/>`;
      }
    }
    return s;
  }
  const fat = (x0, y0, w, h) => { let s = ""; for (let x = x0; x < x0 + w; x += 26) for (let y = y0; y < y0 + h; y += 24) s += `<circle cx="${x + ((y / 24) % 2) * 12}" cy="${y}" r="12" fill="#fff" stroke="${PINK2}"/>`; return s; };
  const endo = (y, x0 = 0, x1 = 420) => { let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${PINK2}" stroke-width="2"/>`; for (let x = x0 + 15; x < x1; x += 45) s += nuc(x, y + 1, 9, 2); return s; };

  /* 1. Dinding jantung */
  const V_WALL = scope(`
    <rect x="0" y="0" width="420" height="40" fill="#fff"/>${L(12, 26, "Lumen ventrikel (darah)")}
    ${endo(42)}<rect x="0" y="44" width="420" height="34" fill="${COLL}"/>
    <rect x="20" y="58" width="40" height="18" rx="5" fill="#fbe3ec" stroke="${PINK2}"/>${nuc(40, 67, 4, 4)}<rect x="300" y="56" width="46" height="20" rx="5" fill="#fbe3ec" stroke="${PINK2}"/>${nuc(323, 66, 4, 4)}
    ${L(410, 58, "ENDOKARDIUM", "end")}${L(410, 72, "endotel + subendotel + subendokardium (Purkinje)", "end")}
    ${myocytes(0, 80, 420, 140, 5)}
    ${L(410, 152, "MIOKARDIUM", "end")}
    <rect x="0" y="222" width="420" height="58" fill="${COLL}"/>${fat(10, 234, 260, 40)}
    <circle cx="330" cy="250" r="20" fill="#fff" stroke="${PINK2}" stroke-width="5"/>${nuc(330, 232, 4, 2)}
    ${endo(282)}
    ${L(410, 246, "EPIKARDIUM", "end")}${L(410, 260, "lemak + a. koroner", "end")}${L(410, 278, "mesotel (= perikardium viseral)", "end")}`);

  /* 2. Atrium vs ventrikel */
  const V_AV = scope(`
    <text class="svg-label small" x="105" y="26" text-anchor="middle" style="font-weight:700">Atrium</text>
    <text class="svg-label small" x="315" y="26" text-anchor="middle" style="font-weight:700">Ventrikel (kiri)</text>
    <line x1="210" y1="10" x2="210" y2="290" stroke="var(--border)" stroke-width="2"/>
    <rect x="10" y="40" width="190" height="16" fill="${COLL}"/>${endo(40, 10, 200)}${L(16, 70, "endokardium lebih tebal")}
    <svg x="10" y="76" width="190" height="60" overflow="hidden">${myocytes(0, 0, 190, 60, 2)}</svg>
    ${[30, 80, 130, 170].map((x) => `<circle cx="${x + 8}" cy="${92}" r="2" fill="#7b1fa2"/><circle cx="${x + 14}" cy="${96}" r="2" fill="#7b1fa2"/>`).join("")}
    ${L(16, 152, "miokardium TIPIS")}${L(16, 166, "• granula atrial (ANP) dekat inti")}
    <rect x="10" y="176" width="190" height="20" fill="${COLL}"/>${L(16, 210, "epikardium")}
    <rect x="220" y="40" width="190" height="8" fill="${COLL}"/>${endo(40, 220, 410)}
    <svg x="220" y="50" width="190" height="220" overflow="hidden">${myocytes(0, 0, 190, 220, 7)}</svg>
    ${L(226, 286, "miokardium SANGAT TEBAL (VKi ±3× VKa)")}`);

  /* 3. Rangka jantung & katup */
  const V_VALVE = scope(`
    <rect x="0" y="0" width="420" height="300" fill="#fff"/>
    <path d="M40,40 C120,60 200,100 330,150 L340,170 C210,130 120,100 40,80 Z" fill="${COLL}" stroke="${PINK2}" stroke-width="1.5"/>
    <path d="M40,46 C120,66 200,106 330,155" stroke="#c48ab4" stroke-width="6" fill="none" opacity=".7"/>
    <path d="M40,62 C120,82 200,118 334,160" stroke="#e8b4cf" stroke-width="8" fill="none" opacity=".8"/>
    <path d="M40,74 C120,94 200,124 336,166" stroke="${ELAS}" stroke-width="3" fill="none" opacity=".7"/>
    ${L(52, 30, "sisi atrium / aliran masuk")}${L(150, 160, "sisi ventrikel")}
    <rect x="0" y="34" width="44" height="60" fill="${PINK2}"/>${L(4, 112, "anulus fibrosus")}
    ${L(250, 106, "fibrosa (inti kolagen padat)")}${L(250, 120, "spongiosa (longgar)")}${L(250, 134, "ventrikularis (elastin)")}
    ${L(150, 54, "endotel di kedua sisi — AVASKULAR")}
    <path d="M330,165 C320,200 300,240 280,270" stroke="${COLL}" stroke-width="6" fill="none"/><path d="M336,168 C340,210 350,240 360,270" stroke="${COLL}" stroke-width="6" fill="none"/>
    ${L(290, 220, "korda tendinea", "end")}${L(290, 234, "(kolagen padat + endotel)", "end")}
    <ellipse cx="320" cy="285" rx="60" ry="20" fill="${PINK}"/>${L(390, 290, "m. papilaris")}`);

  /* 4. Purkinje */
  const V_PURK = scope(`
    ${endo(20)}<rect x="0" y="22" width="420" height="20" fill="${COLL}"/>${L(12, 36, "endokardium")}
    ${[0, 1, 2, 3].map((i) => { const x = 20 + i * 98; return `<rect x="${x}" y="50" width="92" height="90" rx="14" fill="#fde9f1" stroke="${PINK2}"/><rect x="${x}" y="50" width="92" height="8" fill="${PINK}"/><rect x="${x}" y="132" width="92" height="8" fill="${PINK}"/>${nuc(x + 46, 95, 8, 7)}${nuc(x + 30, 95, 6, 5)}`; }).join("")}
    ${L(12, 158, "SERABUT PURKINJE: besar, pucat (kaya glikogen), miofibril sedikit di tepi, sering 2 inti")}
    <rect x="0" y="166" width="420" height="8" fill="${COLL}"/>
    <g transform="translate(0 176)">${myocytes(0, 0, 420, 110, 4)}</g>
    ${L(12, 296, "miokardium biasa (lebih kecil, merah muda pekat, banyak miofibril)")}`);

  /* 5. Pembuluh darah */
  function vessel(cx, cy, r, wall, type) {
    let s = "";
    if (type === "elastic") { s += `<circle cx="${cx}" cy="${cy}" r="${r + wall}" fill="${PINK}"/>`; for (let k = 4; k < wall; k += 4) s += `<circle cx="${cx}" cy="${cy}" r="${r + k}" fill="none" stroke="${ELAS}" stroke-width="1.2" stroke-dasharray="7 3"/>`; }
    if (type === "musc") { s += `<circle cx="${cx}" cy="${cy}" r="${r + wall + 8}" fill="${COLL}"/><circle cx="${cx}" cy="${cy}" r="${r + wall}" fill="${PINK2}"/><circle cx="${cx}" cy="${cy}" r="${r + wall}" fill="none" stroke="${ELAS}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="none" stroke="${ELAS}" stroke-width="2.5" stroke-dasharray="5 2"/>`; for (let a = 0; a < 6.28; a += .5) s += nuc(cx + (r + wall / 2) * Math.cos(a), cy + (r + wall / 2) * Math.sin(a), 4, 1.6); }
    if (type === "vein") { s += `<ellipse cx="${cx}" cy="${cy}" rx="${r + wall + 14}" ry="${(r + wall + 14) * .7}" fill="${COLL}"/><ellipse cx="${cx}" cy="${cy}" rx="${r + wall}" ry="${(r + wall) * .7}" fill="${PINK}"/>`; }
    s += type === "vein" ? `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * .7}" fill="#fff"/><ellipse cx="${cx + 4}" cy="${cy + 4}" rx="${r * .5}" ry="${r * .3}" fill="#e57373" opacity=".7"/>` : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>`;
    return s;
  }
  const V_VES = scope(`
    ${vessel(80, 90, 40, 30, "elastic")}${L(80, 182, "Arteri elastik (aorta)", "middle")}${L(80, 196, "lamina elastik", "middle")}
    ${vessel(220, 90, 18, 18, "musc")}${L(220, 182, "Arteri muskular", "middle")}${L(220, 196, "LEI & LEE jelas", "middle")}
    ${vessel(350, 90, 30, 4, "vein")}${L(350, 182, "Vena", "middle")}${L(350, 196, "adventisia tebal", "middle")}
    <circle cx="80" cy="250" r="14" fill="${PINK}"/><circle cx="80" cy="250" r="6" fill="#fff"/>${nuc(80, 237, 5, 2)}${nuc(80, 263, 5, 2)}${L(80, 286, "Arteriol (1–3 lapis otot)", "middle")}
    <circle cx="220" cy="250" r="8" fill="none" stroke="${PINK2}" stroke-width="2"/><ellipse cx="220" cy="250" rx="5" ry="5" fill="#e57373"/>${nuc(228, 246, 4, 2)}${L(220, 286, "Kapiler (1 lapis endotel)", "middle")}
    <path d="M320,240 Q350,215 380,240" stroke="${PINK2}" stroke-width="3" fill="none"/><path d="M320,240 V270 M380,240 V270" stroke="${PINK2}" stroke-width="3"/><path d="M322,265 Q336,240 350,262 Q364,240 378,265" stroke="${PURP}" stroke-width="2" fill="none"/>${L(350, 286, "Katup vena (lipatan intima)", "middle")}`);

  const STEPS = [
    { title: "Tiga lapisan dinding jantung", body: "Dari dalam ke luar: <b>endokardium</b> (endotel + jaringan ikat subendotel + subendokardium berisi Purkinje), <b>miokardium</b> (otot jantung — paling tebal), dan <b>epikardium</b> (mesotel + jaringan ikat berlemak tempat a. koroner berjalan). Epikardium = perikardium viseral.", key: "Pola sama dengan pembuluh: intima ≈ endokardium, media ≈ miokardium, adventisia ≈ epikardium.", viz: V_WALL },
    { title: "Atrium vs ventrikel", body: "<b>Atrium</b>: miokardium tipis, endokardium relatif lebih tebal, dan sel ototnya mengandung <b>granula atrial</b> berisi <b>ANP</b>. <b>Ventrikel</b>: miokardium tebal (VKi paling tebal), endokardium tipis.", key: "Granula ANP = ciri khas otot atrium (hubungan dengan B6).", viz: V_AV },
    { title: "Struktur khusus: rangka jantung, katup, korda", body: "<b>Rangka jantung</b> = jaringan ikat padat (anulus fibrosus, trigonum fibrosum, septum membranosum): tempat melekat katup & otot, dan <b>isolator listrik</b> antara atrium–ventrikel. <b>Katup</b>: inti jaringan ikat berlapis (fibrosa, spongiosa, ventrikularis/atrialis), dilapisi endotel di kedua sisi, <b>avaskular</b>. <b>Korda tendinea</b>: kolagen padat dilapisi endotel.", key: "Katup avaskular → nutrisi dari difusi darah; infeksi katup sulit dijangkau sistem imun & antibiotik (C5).", viz: V_VALVE },
    { title: "Sistem konduksi", body: "Sel nodus (SA/AV): kecil, pucat, sedikit miofibril, tertanam di jaringan ikat. <b>Serabut Purkinje</b>: di <b>subendokardium</b>, sel <b>besar dan pucat</b> (kaya glikogen), miofibril sedikit dan terdorong ke tepi, inti di tengah (sering 2), banyak gap junction → konduksi cepat.", key: "Cari sel besar pucat tepat di bawah endokardium = Purkinje.", viz: V_PURK },
    { title: "Pembuluh darah", body: "<b>Arteri elastik</b> (aorta): banyak lamina elastik fenestrata di media. <b>Arteri muskular</b>: <b>lamina elastika interna & eksterna</b> jelas, media otot polos tebal. <b>Arteriol</b>: 1–3 lapis otot. <b>Kapiler</b>: 1 lapis endotel + membran basal. <b>Vena</b>: dinding tipis, lumen lebar tidak teratur, <b>adventisia paling tebal</b>, punya <b>katup</b>.", key: "Arteri: media paling tebal. Vena: adventisia paling tebal.", viz: V_VES },
  ];

  const SPEC = [["Dinding jantung (3 lapis)", V_WALL], ["Atrium vs ventrikel", V_AV], ["Katup & korda tendinea", V_VALVE], ["Serabut Purkinje", V_PURK], ["Pembuluh darah", V_VES]];

  function bindToggle(root) {
    root.addEventListener("click", (e) => {
      const b = e.target.closest(".lbl-toggle"); if (!b) return;
      root.classList.toggle("nolabel");
      K.$$(".lbl-toggle", root).forEach((x) => x.textContent = root.classList.contains("nolabel") ? "👁️ Tampilkan label" : "🙈 Sembunyikan label (latihan)");
    });
  }

  registerModule({
    id: "d03",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Melihat jantung di bawah mikroskop", emoji: "💡", html: `
          <p>Histologi menjelaskan <b>mengapa</b> jantung dan pembuluh bisa melakukan tugasnya — dari susunan selnya.</p>
          <ul class="key-points">
            <li><span class="k-ico">🧱</span><span>Dinding jantung = <b>3 lapis</b>: endokardium, miokardium, epikardium.</span></li>
            <li><span class="k-ico">🦴</span><span><b>Rangka jantung</b> dari jaringan ikat padat menopang katup dan menyekat listrik.</span></li>
            <li><span class="k-ico">⚡</span><span><b>Serabut Purkinje</b> = sel otot khusus penghantar cepat.</span></li>
            <li><span class="k-ico">🩸</span><span>Pembuluh = 3 tunika (intima, media, adventisia) dengan proporsi berbeda.</span></li>
          </ul>
          <div class="callout"><p><b>Tips belajar:</b> setiap gambar punya tombol <b>“Sembunyikan label”</b>. Tutup labelnya lalu coba sebutkan sendiri — cara cepat menghafal preparat.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Mikroskop virtual", emoji: "🔬", intro: "Gambar bergaya pewarnaan H&E (merah muda = sitoplasma/kolagen, ungu = inti). Coba sembunyikan label untuk latihan.",
          viz: V_WALL, steps: STEPS, autoplayMs: 7000,
          init(api) { bindToggle(api.viz); } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Struktur → fungsi", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa katup jantung mudah terinfeksi bakteri?", nodes: ["Katup tidak memiliki pembuluh darah (avaskular)", "Sel imun & antibiotik hanya sampai lewat difusi dari darah di permukaan", "Endotel katup yang rusak (mis. akibat demam rematik) memicu deposit trombosit–fibrin", "Bakteri di darah menempel dan berkembang di dalam “sarang” itu", "Vegetasi endokarditis sulit dibasmi → perlu antibiotik lama dosis tinggi (C5)"] },
            { label: "Mengapa Purkinje menghantar paling cepat?", nodes: ["Diameter sel sangat besar → resistensi internal kecil", "Banyak gap junction di diskus interkalaris", "Miofibril sedikit (tugas utamanya bukan berkontraksi)", "Impuls merambat ±4 m/s", "Ventrikel aktif hampir serentak (A5)"] },
            { label: "Mengapa arteri berbeda dengan vena?", nodes: ["Arteri menahan tekanan tinggi & berdenyut", "→ media tebal dengan otot polos dan elastin", "Vena bertekanan rendah dan menampung volume", "→ dinding tipis, lentur, adventisia tebal, katup untuk aliran satu arah", "Bentuk mengikuti beban kerja (B1–B2)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Tebak preparatnya", emoji: "🎯", html: `
          <p>Preparat ditampilkan <b>tanpa label</b>. Preparat apakah ini?</p>
          <div class="viz-wrap nolabel" id="tp-svg"></div>
          <div class="toggle-row" id="tp-opts"></div>
          <div id="tp-msg"></div>
          <div class="btn-row"><button class="btn btn-sm" id="tp-next" type="button">Preparat lain ↻</button><span class="small muted" id="tp-sc"></span></div>`,
          init(el) {
            let cur, done, sc = 0, n = 0;
            const HINT = ["Cari 3 lapisan berurutan: endotel – otot tebal – lemak dengan pembuluh.", "Dua panel: kiri tipis berbintik granula, kanan sangat tebal.", "Lembaran jaringan ikat tanpa pembuluh, dengan tali ke otot di bawah.", "Sel besar pucat di bawah endokardium.", "Lingkaran-lingkaran: lamina elastik bergelombang, otot polos, dinding tipis."];
            K.$("#tp-opts", el).innerHTML = SPEC.map(([n], i) => `<button class="btn btn-sm" data-i="${i}" type="button">${n}</button>`).join("");
            function next() { cur = Math.floor(Math.random() * SPEC.length); done = false; K.$("#tp-svg", el).innerHTML = SPEC[cur][1].replace(/<div class="btn-row"[\s\S]*?<\/div>/, ""); K.$("#tp-msg", el).innerHTML = ""; K.$$("#tp-opts button", el).forEach((b) => b.classList.remove("on")); }
            K.$$("#tp-opts button", el).forEach((b) => b.addEventListener("click", () => {
              if (done) return; done = true; n++; const ok = +b.dataset.i === cur; if (ok) sc++; b.classList.add("on");
              K.$("#tp-svg", el).classList.remove("nolabel");
              K.$("#tp-msg", el).innerHTML = `<div class="callout ${ok ? "green" : "red"}"><p><b>${ok ? "✅ Tepat!" : `❌ Ini “${SPEC[cur][0]}”.`}</b> ${HINT[cur]} (Label kini ditampilkan.)</p></div>`;
              K.$("#tp-sc", el).textContent = `Skor: ${sc}/${n}`;
            }));
            K.$("#tp-next", el).addEventListener("click", () => { K.$("#tp-svg", el).classList.add("nolabel"); next(); });
            next();
          } },
        { type: "match", heading: "Ciri → struktur", emoji: "🧩", intro: "Ketuk ciri di kiri, lalu strukturnya di kanan.",
          pairs: [["Sel besar pucat kaya glikogen di subendokardium", "Serabut Purkinje"], ["Granula berisi ANP", "Otot atrium"], ["Lamina elastika interna & eksterna jelas", "Arteri muskular"], ["Banyak lamina elastik fenestrata", "Aorta (arteri elastik)"], ["Jaringan ikat padat penyekat listrik atrium–ventrikel", "Rangka jantung (anulus fibrosus)"], ["Mesotel + lemak + a. koroner", "Epikardium"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Dinding jantung dari dalam: “<b>E</b>nak <b>M</b>akan <b>E</b>s” → <b>E</b>ndo · <b>M</b>io · <b>E</b>pi (epi = di atas/luar).</p></div>
            <div class="callout"><p class="mnemo">Lapisan katup: “<b>F-S-V</b> = <b>F</b>ondasi <b>S</b>ponsnya <b>V</b>entil” → <b>F</b>ibrosa (inti kuat) · <b>S</b>pongiosa (bantalan) · <b>V</b>entrikularis/atrialis (elastin).</p></div>
            <div class="callout green"><p class="mnemo"><b>Arteri</b> = “<b>M</b>edia <b>M</b>ewah” (media tebal) · <b>Vena</b> = “<b>A</b>dventisia <b>A</b>gak tebal” + katup.</p></div>
            <div class="callout warn"><p class="mnemo"><b>Purkinje</b> = “<b>P</b>ucat, <b>P</b>esar (besar), <b>P</b>inggirnya saja miofibril”.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Lapisan jantung tempat a. koroner besar berjalan", "Epikardium (subepikardial, berlemak)"], ["Letak serabut Purkinje", "Subendokardium"], ["Ciri sel Purkinje", "Besar, pucat (glikogen), miofibril di tepi, 1–2 inti di tengah"], ["Hormon dalam granula otot atrium", "ANP (atrial natriuretic peptide)"], ["Fungsi rangka jantung", "Penopang katup/otot & isolator listrik atrium–ventrikel"], ["Mengapa katup avaskular penting secara klinis?", "Nutrisi & pertahanan hanya lewat difusi → infeksi (endokarditis) sulit diatasi"], ["Penanda khas arteri muskular", "Lamina elastika interna & eksterna jelas"], ["Lapisan tertebal pada vena", "Tunika adventisia"], ["Epikardium sama dengan…", "Lamina viseralis perikardium serosa"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Ketika strukturnya berubah…", emoji: "🩺", intro: "Hubungkan perubahan jaringan dengan penyakitnya.", note: "",
          items: [
            { icon: "🔥", title: "Endokarditis infektif", chain: ["Katup avaskular dengan endotel rusak", "Vegetasi trombosit–fibrin–bakteri terbentuk di permukaan katup", "Katup rusak (regurgitasi) & emboli ke organ lain"] },
            { icon: "🧈", title: "Aterosklerosis", chain: ["Lipid & makrofag menumpuk di tunika intima arteri elastik/muskular", "Otot polos bermigrasi membentuk tudung fibrosa", "Plak menyempitkan lumen; ruptur tudung → trombosis (C3)"] },
            { icon: "🎈", title: "Diseksi aorta", chain: ["Degenerasi tunika media (mis. hipertensi, sindrom Marfan — kelainan fibrilin)", "Robekan intima memungkinkan darah membelah media", "Lumen palsu terbentuk — kegawatdaruratan"] },
            { icon: "🧱", title: "Infark miokard → parut", chain: ["Kardiomiosit mati (nekrosis koagulatif)", "Diganti jaringan granulasi lalu kolagen (fibrosis)", "Parut tidak berkontraksi & tidak menghantar dengan baik → gagal jantung/aritmia"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Sel besar, pucat, kaya glikogen dengan miofibril di tepi dan terletak tepat di bawah endokardium ventrikel adalah…",
          options: ["Sel SA node", "Serabut Purkinje", "Fibroblas", "Kardiomiosit atrium"], answer: 1,
          explain: "Itulah ciri serabut Purkinje di subendokardium — spesialis konduksi cepat." },
        { q: "Granula sitoplasma yang khas pada sel otot atrium mengandung…",
          options: ["Renin", "ANP (atrial natriuretic peptide)", "Glikogen saja", "Katekolamin"], answer: 1,
          explain: "Saat atrium teregang (volume ↑), ANP dilepas → natriuresis & vasodilatasi (B6)." },
        { q: "Perbedaan histologis paling khas arteri muskular dibanding vena sejenis ukurannya adalah…",
          options: ["Arteri memiliki adventisia lebih tebal", "Arteri memiliki media otot polos tebal dengan lamina elastika interna yang jelas", "Vena tidak memiliki endotel", "Arteri memiliki katup"], answer: 1,
          explain: "Arteri: media dominan + LEI jelas. Vena: dinding tipis, adventisia dominan, lumen lebar, bisa ada katup." },
        { q: "Fungsi listrik rangka fibrosa jantung adalah…",
          options: ["Mempercepat konduksi atrium ke ventrikel", "Menyekat atrium dan ventrikel sehingga impuls hanya lewat berkas His", "Membentuk SA node", "Menyimpan glikogen"], answer: 1,
          explain: "Jaringan ikat padat tidak menghantar listrik; karena itu impuls normal hanya melewati AV node–berkas His (A4, A5)." },
        { q: "Mengapa endokarditis pada katup sulit diobati?",
          options: ["Karena katup memiliki banyak pembuluh darah", "Karena katup avaskular sehingga antibiotik & sel imun sulit menembus vegetasi", "Karena katup dilapisi mesotel", "Karena bakteri tidak bisa menempel pada katup"], answer: 1,
          explain: "Tanpa kapiler di dalam katup, obat dan sel imun hanya bergantung pada difusi ke vegetasi yang padat." },
      ]},
    ],
  });
})();
