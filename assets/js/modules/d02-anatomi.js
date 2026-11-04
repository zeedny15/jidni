/* Modul D2 — Anatomi CVS (Kuliah 2) */
(function () {
  const W = (inner, h = 300) => `<svg viewBox="0 0 420 ${h}" role="img" aria-label="Ilustrasi anatomi">${inner}</svg>`;
  const ribs = (cx = 210) => [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${cx - 12},${54 + i * 34} C${cx - 60},${46 + i * 34} ${cx - 110},${56 + i * 34} ${cx - 150},${74 + i * 34}" fill="none" stroke="var(--border)" stroke-width="6"/><path d="M${cx + 12},${54 + i * 34} C${cx + 60},${46 + i * 34} ${cx + 110},${56 + i * 34} ${cx + 150},${74 + i * 34}" fill="none" stroke="var(--border)" stroke-width="6"/><text class="svg-label small" x="${cx + 158}" y="${78 + i * 34}" style="font-size:9px">${i + 1}</text>`).join("");

  /* 1. Proyeksi permukaan */
  const P = { ra: [176, 92], rb: [178, 228], lb: [296, 246], la: [244, 86] };
  const V_SURF = W(`
    <path d="M60,30 C120,14 300,14 360,30 L380,296 L40,296 Z" fill="var(--surface)" stroke="var(--border)" stroke-width="2"/>
    ${ribs()}<rect x="198" y="30" width="24" height="210" rx="6" fill="var(--surface-2)" stroke="var(--border)"/>
    <text class="svg-label small" x="210" y="24" text-anchor="middle" style="font-size:9.5px">sternum</text>
    <path d="M${P.la[0]},${P.la[1]} L${P.ra[0]},${P.ra[1]} C160,150 162,200 ${P.rb[0]},${P.rb[1]} L${P.lb[0]},${P.lb[1]} C320,190 290,120 ${P.la[0]},${P.la[1]} Z" fill="var(--primary)" opacity=".28" stroke="var(--primary)" stroke-width="2"/>
    <path data-info="b_r" d="M${P.ra[0]},${P.ra[1]} C160,150 162,200 ${P.rb[0]},${P.rb[1]}" stroke="var(--o2-poor)" stroke-width="6" fill="none"/>
    <path data-info="b_i" d="M${P.rb[0]},${P.rb[1]} L${P.lb[0]},${P.lb[1]}" stroke="var(--warn)" stroke-width="6" fill="none"/>
    <path data-info="b_l" d="M${P.lb[0]},${P.lb[1]} C320,190 290,120 ${P.la[0]},${P.la[1]}" stroke="var(--o2-rich)" stroke-width="6" fill="none"/>
    <path data-info="b_s" d="M${P.la[0]},${P.la[1]} L${P.ra[0]},${P.ra[1]}" stroke="var(--vein)" stroke-width="6" fill="none"/>
    ${Object.entries(P).map(([k, [x, y]]) => `<circle data-info="p_${k}" cx="${x}" cy="${y}" r="8" fill="var(--text)"/>`).join("")}
    <text class="svg-label small" x="110" y="96" style="font-size:9.5px">ICS 2 kanan</text><text class="svg-label small" x="96" y="232" style="font-size:9.5px">kosta 6 kanan</text>
    <text class="svg-label small" x="306" y="262" style="font-size:9.5px">apeks: ICS 5 MCL kiri</text><text class="svg-label small" x="254" y="76" style="font-size:9.5px">kosta 2 kiri</text>
    <line x1="296" y1="30" x2="296" y2="290" stroke="var(--text-soft)" stroke-dasharray="3 4"/><text class="svg-label small" x="300" y="290" style="font-size:9px">linea midklavikula</text>`);

  /* 2. Perikardium */
  const V_PERI = W(`
    <ellipse cx="210" cy="150" rx="170" ry="125" fill="#e9d8a6" opacity=".5" stroke="var(--text-soft)" stroke-width="3" data-info="fib"/>
    <ellipse cx="210" cy="150" rx="155" ry="112" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" data-info="par"/>
    <ellipse cx="210" cy="150" rx="140" ry="98" fill="var(--accent-soft)" data-info="cav"/>
    <ellipse cx="210" cy="152" rx="122" ry="84" fill="var(--primary-soft)" stroke="var(--ok)" stroke-width="3" data-info="vis"/>
    <path d="M150,180 C130,120 170,90 210,110 C250,90 290,120 270,180 C255,215 210,232 210,232 C210,232 165,215 150,180 Z" fill="var(--primary)" opacity=".8"/>
    <text class="svg-label small" x="210" y="170" text-anchor="middle" style="fill:#fff">Miokardium</text>
    <g class="svg-label small" style="font-size:10px">
      <text x="210" y="20" text-anchor="middle">Perikardium fibrosa (kantong luar, kuat, tidak elastis)</text>
      <text x="60" y="150" text-anchor="end"></text>
      <text x="380" y="70" text-anchor="end" style="fill:var(--accent)">lamina parietalis</text>
      <text x="360" y="100" text-anchor="end" style="fill:var(--accent)">rongga perikardium</text>
      <text x="345" y="240" text-anchor="end" style="fill:var(--ok)">lamina viseralis = epikardium</text>
    </g>
    <rect x="80" y="276" width="260" height="14" rx="6" fill="var(--warn)" opacity=".6"/><text class="svg-label small" x="210" y="298" text-anchor="middle" style="font-size:9.5px">diafragma (tendo sentral) — tempat fiksasi utama</text>`, 305);

  /* 3. Mediastinum */
  const V_MED = W(`
    <path d="M150,20 V280" stroke="var(--text-soft)" stroke-width="10" stroke-linecap="round"/><text class="svg-label small" x="138" y="292" text-anchor="end">sternum</text>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<rect x="330" y="${16 + i * 27}" width="34" height="22" rx="4" fill="var(--surface-2)" stroke="var(--border)"/><text class="svg-label small" x="347" y="${31 + i * 27}" text-anchor="middle" style="font-size:9px">T${i + 1}</text>`).join("")}
    <line data-info="plane" x1="150" y1="72" x2="330" y2="120" stroke="var(--bad)" stroke-width="3" stroke-dasharray="6 4"/>
    <text class="svg-label small" x="160" y="64" style="fill:var(--bad);font-size:9.5px">angulus sternal (Louis) ↔ diskus T4–T5</text>
    <path data-info="sup" d="M152,20 L330,20 L330,120 L152,72 Z" fill="var(--warn)" opacity=".25"/><text class="svg-label small" x="250" y="52" text-anchor="middle" style="font-weight:700">SUPERIOR</text>
    <path data-info="ant" d="M152,76 L180,84 L180,280 L152,280 Z" fill="var(--accent)" opacity=".25"/><text class="svg-label small" x="166" y="250" text-anchor="middle" style="font-size:9px;font-weight:700" transform="rotate(-90 166 250)">ANTERIOR</text>
    <path data-info="mid" d="M180,84 L290,112 L290,280 L180,280 Z" fill="var(--primary)" opacity=".3"/><text class="svg-label small" x="235" y="200" text-anchor="middle" style="font-weight:700">MEDIUS</text><text class="svg-label small" x="235" y="214" text-anchor="middle" style="font-size:9.5px">(jantung + perikardium)</text>
    <path data-info="post" d="M290,112 L330,120 L330,280 L290,280 Z" fill="var(--ok)" opacity=".3"/><text class="svg-label small" x="310" y="250" text-anchor="middle" style="font-size:9px;font-weight:700" transform="rotate(-90 310 250)">POSTERIOR</text>
    <text class="svg-label small" x="20" y="150" style="font-size:9.5px">potongan</text><text class="svg-label small" x="20" y="164" style="font-size:9.5px">sagital</text><text class="svg-label small" x="20" y="178" style="font-size:9.5px">(depan → kiri)</text>`);

  /* 4. Isi mediastinum posterior (potongan melintang T8) */
  const V_POST = W(`
    <ellipse cx="210" cy="160" rx="190" ry="125" fill="var(--surface)" stroke="var(--border)" stroke-width="2"/>
    <text class="svg-label small" x="210" y="28" text-anchor="middle">anterior ↑ (potongan melintang ±T8, dilihat dari bawah)</text>
    <path d="M150,60 C120,40 80,70 100,110 C120,140 210,150 210,150 C210,150 300,140 320,110 C340,70 300,40 270,60 C250,70 230,80 210,90 C190,80 170,70 150,60 Z" fill="var(--primary-soft)" stroke="var(--primary)"/><text class="svg-label small" x="210" y="110" text-anchor="middle">jantung (mediastinum medius)</text>
    <rect x="185" y="215" width="50" height="50" rx="10" fill="var(--surface-2)" stroke="var(--text-soft)"/><text class="svg-label small" x="210" y="245" text-anchor="middle">vertebra</text>
    <circle data-info="eso" cx="205" cy="172" r="15" fill="#ffd8a8" stroke="var(--warn)"/><text class="svg-label small" x="205" y="176" text-anchor="middle" style="font-size:9px">E</text>
    <circle data-info="vag" cx="190" cy="165" r="4" fill="#ffd43b"/><circle data-info="vag" cx="220" cy="180" r="4" fill="#ffd43b"/>
    <circle data-info="ao" cx="240" cy="202" r="17" fill="var(--o2-rich)" opacity=".85"/><text class="svg-label small" x="240" y="206" text-anchor="middle" style="fill:#fff;font-size:9px">Ao</text>
    <circle data-info="az" cx="176" cy="205" r="8" fill="var(--o2-poor)"/><text class="svg-label small" x="160" y="200" text-anchor="end" style="font-size:9px">v. azigos</text>
    <circle data-info="td" cx="210" cy="206" r="5" fill="#fff" stroke="var(--text)"/><text class="svg-label small" x="210" y="198" text-anchor="middle" style="font-size:8.5px">D</text>
    <circle data-info="hz" cx="250" cy="232" r="6" fill="var(--o2-poor)"/>
    <circle data-info="sym" cx="160" cy="250" r="5" fill="var(--ok)"/><circle data-info="sym" cx="260" cy="250" r="5" fill="var(--ok)"/>
    <g class="svg-label small" style="font-size:9.5px"><text x="270" y="170">E = esofagus (+ n. vagus)</text><text x="270" y="200">Ao = aorta desendens</text><text x="270" y="232">v. hemiazigos</text><text x="100" y="270">trunkus simpatikus</text><text x="215" y="290" text-anchor="middle">D = duktus torasikus (di antara aorta & azigos)</text></g>`);

  /* 5. Tampak anterior jantung */
  const V_ANT = W(`
    <rect x="168" y="10" width="26" height="70" rx="8" fill="var(--o2-poor)" opacity=".6" data-info="svc"/><text class="svg-label small" x="150" y="24" text-anchor="end">VCS</text>
    <path d="M215,90 V40 C215,10 285,10 285,40 V70" stroke="var(--o2-rich)" stroke-width="22" fill="none" data-info="aorta"/><text class="svg-label small" x="295" y="30">aorta</text>
    <path d="M232,112 C240,80 265,70 290,64" stroke="var(--o2-poor)" stroke-width="18" fill="none" data-info="pt"/><text class="svg-label small" x="298" y="70">trunkus pulmonalis</text>
    <path data-info="ra" d="M125,95 C105,120 100,200 140,230 L172,225 L176,96 Z" fill="var(--o2-poor)" opacity=".75"/>
    <path data-info="rv" d="M176,96 L172,225 C200,262 240,272 262,268 C280,230 290,170 268,112 C240,96 210,92 176,96 Z" fill="var(--o2-poor)" opacity=".45"/>
    <path data-info="lv" d="M268,112 C290,170 280,230 262,268 C300,262 330,210 320,150 C312,118 292,106 268,112 Z" fill="var(--o2-rich)" opacity=".7"/>
    <path data-info="lau" d="M268,100 C285,86 305,96 302,112 C292,110 278,110 268,112 Z" fill="var(--o2-rich)" opacity=".5"/>
    <g class="svg-label small" style="font-size:10px"><text x="130" y="170" text-anchor="middle" style="fill:#fff">AK</text><text x="220" y="185" text-anchor="middle">VKa</text><text x="300" y="200" text-anchor="middle" style="fill:#fff">VKi</text><text x="320" y="96">aurikula kiri</text><text x="262" y="290" text-anchor="middle">apeks</text></g>
    <path d="M176,100 C190,150 220,220 262,268" stroke="var(--warn)" stroke-width="2" stroke-dasharray="4 3" fill="none"/><text class="svg-label small" x="80" y="290" style="font-size:9.5px">— — sulkus interventrikular anterior (LAD)</text>`);

  /* 6. Bagian dalam 4 ruang */
  const room = (x, y, w, h, fill, id, label) => `<rect data-info="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" opacity=".85"/><text class="svg-label small" x="${x + w / 2}" y="${y + 18}" text-anchor="middle" style="fill:#fff;font-weight:700">${label}</text>`;
  const V_IN = W(`
    ${room(30, 30, 170, 110, "var(--o2-poor)", "i_ra", "Atrium kanan")}${room(220, 30, 170, 110, "var(--o2-rich)", "i_la", "Atrium kiri")}
    ${room(30, 160, 170, 130, "var(--o2-poor)", "i_rv", "Ventrikel kanan")}${room(220, 160, 170, 130, "var(--o2-rich)", "i_lv", "Ventrikel kiri")}
    <g class="svg-label small" style="fill:#fff;font-size:8.6px">
      <text x="44" y="64">• krista terminalis</text><text x="44" y="80">• m. pektinati (aurikula)</text><text x="44" y="96">• fossa ovalis</text><text x="44" y="112">• muara VCS, VCI, sinus kor.</text>
      <text x="234" y="64">• 4 muara v. pulmonalis</text><text x="234" y="80">• dinding hampir seluruhnya halus</text><text x="234" y="96">• aurikula kiri (m. pektinati)</text><text x="234" y="112">• sisi kiri: valvula f. ovalis</text>
      <text x="44" y="196">• trabekula karnea kasar</text><text x="44" y="212">• trabekula septomarginal</text><text x="44" y="226">  (moderator band, bawa RBB)</text><text x="44" y="242">• 3 m. papilaris</text><text x="44" y="258">• infundibulum/konus arteriosus</text><text x="44" y="274">• katup trikuspid & pulmonal</text>
      <text x="234" y="196">• dinding ±3× lebih tebal</text><text x="234" y="212">• trabekula halus/tipis</text><text x="234" y="228">• 2 m. papilaris (ant & post)</text><text x="234" y="244">• vestibulum aorta (halus)</text><text x="234" y="260">• katup mitral & aorta</text>
    </g>`);

  /* 7. Konduksi: segitiga Koch */
  const V_KOCH = W(`
    <rect x="30" y="20" width="360" height="260" rx="30" fill="var(--o2-poor)" opacity=".12" stroke="var(--o2-poor)"/>
    <text class="svg-label small" x="44" y="40">Dinding septal atrium kanan (dibuka dari kanan)</text>
    <circle cx="90" cy="70" r="22" fill="var(--o2-poor)" opacity=".5"/><text class="svg-label small" x="90" y="74" text-anchor="middle">VCS</text>
    <circle data-info="sa" cx="122" cy="80" r="9" fill="var(--warn)" stroke="#fff" stroke-width="2"/><text class="svg-label small" x="136" y="78" style="font-weight:700">SA node</text><text class="svg-label small" x="136" y="92" style="font-size:9.5px">(ujung atas krista terminalis)</text>
    <ellipse cx="270" cy="120" rx="34" ry="24" fill="var(--surface)" stroke="var(--text-soft)"/><text class="svg-label small" x="270" y="124" text-anchor="middle">fossa ovalis</text>
    <path data-info="koch" d="M180,230 L320,170 L320,240 Z" fill="var(--warn)" opacity=".25" stroke="var(--warn)" stroke-width="2"/>
    <line x1="180" y1="230" x2="320" y2="170" stroke="var(--text)" stroke-width="2" stroke-dasharray="5 3"/><text class="svg-label small" x="190" y="186" style="font-size:9.5px" transform="rotate(-23 190 186)">tendo Todaro</text>
    <line x1="180" y1="240" x2="320" y2="240" stroke="var(--o2-poor)" stroke-width="5"/><text class="svg-label small" x="250" y="258" text-anchor="middle" style="font-size:9.5px">daun septal katup trikuspid</text>
    <circle cx="170" cy="250" r="12" fill="var(--o2-poor)" opacity=".6"/><text class="svg-label small" x="150" y="276" text-anchor="middle" style="font-size:9.5px">ostium sinus koronarius</text>
    <circle data-info="av" cx="292" cy="216" r="9" fill="var(--warn)" stroke="#fff" stroke-width="2"/><text class="svg-label small" x="306" y="214" style="font-weight:700">AV node</text>
    <path d="M300,222 C320,230 340,240 360,262" stroke="var(--warn)" stroke-width="4" fill="none"/><text class="svg-label small" x="330" y="276" style="font-size:9.5px">berkas His → septum membranosum</text>
    <text class="svg-label small" x="200" y="160" text-anchor="middle" style="font-weight:700;fill:var(--warn)">Segitiga Koch</text>`);

  /* 8. Vaskularisasi */
  const V_VASC = W(`
    <path d="M115,92 C55,120 62,242 200,290 C338,242 345,120 285,92 C255,78 145,78 115,92 Z" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2"/>
    <path d="M200,98 V50 C200,18 270,18 270,50 V80" stroke="var(--o2-rich)" stroke-width="18" fill="none" opacity=".6"/>
    <path data-info="rca" d="M193,100 C165,105 138,118 124,142 C106,180 110,225 140,262" stroke="var(--o2-rich)" stroke-width="6" fill="none"/>
    <path data-info="pda" d="M140,262 C160,280 182,292 200,300" stroke="var(--o2-rich)" stroke-width="4" stroke-dasharray="6 4" fill="none"/>
    <path data-info="lad" d="M208,100 C226,104 240,108 254,113 C240,160 222,232 200,290" stroke="var(--o2-rich)" stroke-width="6" fill="none"/>
    <path data-info="lcx" d="M254,113 C290,120 310,146 312,180 C314,212 300,236 286,254" stroke="var(--o2-rich)" stroke-width="6" fill="none"/>
    <path data-info="gcv" d="M212,282 C230,230 246,160 262,122 C285,126 320,146 324,180" stroke="var(--o2-poor)" stroke-width="3.5" stroke-dasharray="5 4" fill="none"/>
    <path data-info="acv" d="M118,170 C108,150 110,126 128,112" stroke="var(--o2-poor)" stroke-width="3" fill="none"/>
    <g class="svg-label small" style="font-size:10px"><text x="60" y="150">RCA</text><text x="216" y="250">LAD</text><text x="320" y="230">LCx</text><text x="120" y="296">PDA (posterior)</text><text x="330" y="150" style="fill:var(--o2-poor)">v. kordis magna</text><text x="20" y="120" style="fill:var(--o2-poor)">v. kordis anterior</text></g>`);

  /* 9. Persarafan & nyeri alih */
  const V_NERVE = W(`
    <circle cx="110" cy="40" r="22" fill="var(--surface)" stroke="var(--border)"/><text class="svg-label small" x="110" y="44" text-anchor="middle">otak</text>
    <path data-info="vag" d="M100,62 C90,120 120,170 150,200" stroke="var(--o2-poor)" stroke-width="4" fill="none"/><text class="svg-label small" x="40" y="130" style="fill:var(--o2-poor);font-weight:700">n. vagus (X)</text>
    <rect x="210" y="40" width="16" height="200" rx="8" fill="var(--border)"/><text class="svg-label small" x="232" y="60" style="font-size:9.5px">ganglia servikal</text><text class="svg-label small" x="232" y="150" style="font-size:9.5px">T1–T4/5</text>
    <path data-info="sym" d="M210,60 C190,100 180,160 168,195 M210,150 C195,170 180,190 170,200" stroke="var(--warn)" stroke-width="4" fill="none"/><text class="svg-label small" x="232" y="100" style="fill:var(--warn);font-weight:700">simpatis</text>
    <ellipse data-info="plex" cx="160" cy="210" rx="34" ry="16" fill="var(--accent-soft)" stroke="var(--accent)"/><text class="svg-label small" x="160" y="214" text-anchor="middle" style="font-size:9.5px">pleksus kardiakus</text>
    <path d="M140,230 C130,250 150,280 170,276 C190,272 196,245 180,232 Z" fill="var(--primary)" opacity=".8"/>
    <!-- tubuh untuk nyeri alih -->
    <g data-info="ref"><circle cx="350" cy="40" r="16" fill="var(--surface)" stroke="var(--border)"/>
      <rect x="320" y="60" width="60" height="110" rx="20" fill="var(--surface)" stroke="var(--border)"/>
      <rect x="292" y="66" width="22" height="120" rx="10" fill="var(--surface)" stroke="var(--border)"/><rect x="386" y="66" width="22" height="120" rx="10" fill="var(--surface)" stroke="var(--border)"/>
      <rect x="326" y="80" width="48" height="50" rx="12" fill="var(--bad)" opacity=".35"/><rect x="386" y="80" width="22" height="100" rx="10" fill="var(--bad)" opacity=".35"/>
      <text class="svg-label small" x="350" y="205" text-anchor="middle" style="font-size:9.5px">nyeri alih (dermatom T1–T4):</text><text class="svg-label small" x="350" y="219" text-anchor="middle" style="font-size:9.5px">dada & sisi medial lengan kiri</text></g>`);

  const STEPS = [
    { title: "Anatomi permukaan: 4 titik proyeksi", body: "Jantung diproyeksikan ke dinding dada dengan 4 titik: <b>tepi atas kosta 3 kanan / ICS 2 kanan</b> (±1 cm dari sternum), <b>kosta 6 kanan</b>, <b>apeks di ICS 5 linea midklavikula kiri</b>, dan <b>kosta 2 kiri</b>. Klik tiap batas untuk tahu ruang pembentuknya.", key: "Apeks = tempat iktus kordis teraba.", viz: V_SURF },
    { title: "Batas, pelindung & fiksasi: perikardium", body: "Jantung dibungkus <b>perikardium</b>: lapisan luar <b>fibrosa</b> (kuat, tidak elastis, melekat ke tendo sentral diafragma, sternum, dan tunika adventisia pembuluh besar) dan <b>serosa</b> (lamina parietalis + viseralis/epikardium). Rongga di antaranya berisi ±15–50 mL cairan pelumas. Pelindung luar: sternum, kosta, kartilago kosta, dan vertebra.", key: "Fibrosa tidak bisa melar → cairan berlebih cepat menekan jantung (tamponade).", viz: V_PERI },
    { title: "Pembagian mediastinum", body: "Bidang dari <b>angulus sternal (Louis)</b> ke <b>diskus T4–T5</b> membagi mediastinum <b>superior</b> dan <b>inferior</b>. Inferior dibagi lagi: <b>anterior</b> (depan perikardium), <b>medius</b> (jantung + perikardium), dan <b>posterior</b> (belakang perikardium).", key: "Jantung ada di mediastinum medius.", viz: V_MED },
    { title: "Isi mediastinum posterior", body: "Isi utamanya: <b>aorta torakalis desendens</b>, <b>esofagus</b> (dengan pleksus n. vagus), <b>duktus torasikus</b>, <b>v. azigos & hemiazigos</b>, n. splanknikus, kelenjar limfe; trunkus simpatikus berada di sampingnya (paravertebral). Atrium kiri berbatasan langsung dengan esofagus di belakangnya.", key: "AKi membesar (mis. stenosis mitral) bisa menekan esofagus → disfagia.", viz: V_POST },
    { title: "Tampak anterior & permukaan jantung", body: "Permukaan <b>anterior (sternokostal)</b> sebagian besar dibentuk <b>VKa</b>. <b>Batas kanan</b> = AK, <b>batas kiri</b> = VKi (+ aurikula kiri), <b>apeks</b> = VKi. <b>Basis/posterior</b> = AKi. <b>Permukaan diafragmatika</b> = VKi & VKa.", key: "Klik tiap ruang. Ingat: AKi letaknya paling belakang.", viz: V_ANT },
    { title: "Bagian dalam ruang & fungsinya", body: "Setiap ruang punya ciri khas. Klik tiap ruang untuk mengaitkan strukturnya dengan fungsinya.", key: "Moderator band membawa cabang berkas kanan — jalan pintas ke m. papilaris anterior.", viz: V_IN },
    { title: "Sistem konduksi (letak anatomis)", body: "<b>SA node</b>: di dinding AK pada ujung atas krista terminalis, dekat muara VCS. <b>AV node</b>: di puncak <b>segitiga Koch</b> (tendo Todaro, daun septal trikuspid, ostium sinus koronarius). <b>Berkas His</b> menembus rangka fibrosa ke septum membranosum, lalu bercabang kanan (via moderator band) & kiri.", key: "Segitiga Koch = patokan ahli bedah agar tidak melukai AV node.", viz: V_KOCH },
    { title: "Vaskularisasi jantung", body: "Arteri: <b>RCA</b> (→ marginal kanan, PDA pada dominansi kanan, cabang nodus SA & AV) dan <b>LCA</b> (→ <b>LAD</b> dengan cabang diagonal & septal; <b>LCx</b> dengan obtuse marginal). Vena: <b>v. kordis magna</b> (mengikuti LAD), <b>media</b> (mengikuti PDA), <b>parva</b> (mengikuti marginal kanan) → <b>sinus koronarius</b> → AK; <b>v. kordis anterior</b> langsung ke AK.", key: "Detail fisiologi aliran koroner: lihat A2.", viz: V_VASC },
    { title: "Persarafan jantung", body: "<b>Pleksus kardiakus</b> menerima: <b>simpatis</b> dari ganglia servikal & torakal atas (T1–T4/5) → HR & kontraktilitas ↑; <b>parasimpatis</b> dari <b>n. vagus</b> → HR ↓. Serabut <b>nyeri</b> berjalan bersama simpatis ke T1–T4, sehingga nyeri jantung terasa di dada & lengan kiri (<b>nyeri alih</b>).", key: "Fisiologi pengaturannya: lihat A12.", viz: V_NERVE },
  ];

  const INFO = {
    p_ra: ["Titik kanan atas", "Tepi atas kartilago kosta 3 kanan / ICS 2 kanan, ±1 cm lateral sternum."],
    p_rb: ["Titik kanan bawah", "Kartilago kosta 6 kanan, ±1 cm lateral sternum."],
    p_lb: ["Titik kiri bawah (apeks)", "ICS 5 kiri, linea midklavikula (±9 cm dari garis tengah) — iktus kordis."],
    p_la: ["Titik kiri atas", "Tepi bawah kartilago kosta 2 kiri, ±1–2 cm lateral sternum."],
    b_r: ["Batas kanan", "Dibentuk <b>atrium kanan</b>."], b_i: ["Batas inferior", "Dibentuk terutama <b>ventrikel kanan</b> (sedikit VKi di apeks)."],
    b_l: ["Batas kiri", "Dibentuk <b>ventrikel kiri</b> (dan aurikula kiri di atas)."], b_s: ["Batas superior", "Atrium kanan & kiri serta pembuluh besar."],
    fib: ["Perikardium fibrosa", "Kantong jaringan ikat padat. Fiksasi: tendo sentral diafragma (lig. perikardiofrenika), sternum (lig. sternoperikardial), dan adventisia pembuluh besar. Mencegah jantung melebar berlebihan."],
    par: ["Lamina parietalis (serosa)", "Melapisi bagian dalam perikardium fibrosa."], cav: ["Rongga perikardium", "Berisi ±15–50 mL cairan serosa sebagai pelumas. Ada sinus transversus & sinus obliquus."],
    vis: ["Lamina viseralis = epikardium", "Melekat langsung pada miokardium; mengandung pembuluh koroner & lemak."],
    plane: ["Bidang angulus sternal", "Garis khayal dari angulus sternal (Louis) ke diskus T4–T5. Penanda: bifurkasio trakea, awal & akhir arkus aorta."],
    sup: ["Mediastinum superior", "Timus, arkus aorta & cabangnya, VCS & v. brakiosefalika, trakea, esofagus, n. vagus & n. frenikus, duktus torasikus."],
    ant: ["Mediastinum anterior", "Sisa timus, kelenjar limfe, lemak, lig. sternoperikardial."],
    mid: ["Mediastinum medius", "Jantung, perikardium, pangkal pembuluh besar, n. frenikus."],
    post: ["Mediastinum posterior", "Aorta desendens, esofagus, duktus torasikus, v. azigos/hemiazigos, n. vagus, n. splanknikus."],
    eso: ["Esofagus", "Di belakang atrium kiri; dikelilingi pleksus esofagus n. vagus."], vag: ["N. vagus", "Membentuk pleksus di permukaan esofagus."],
    ao: ["Aorta torakalis desendens", "Di kiri depan vertebra; memberi a. interkostal posterior."], az: ["V. azigos", "Di kanan vertebra; bermuara ke VCS."],
    hz: ["V. hemiazigos", "Di kiri; menyeberang ke v. azigos."], td: ["Duktus torasikus", "Di antara aorta dan v. azigos, di depan vertebra — membawa limfe ke v. subklavia kiri."],
    sym: ["Trunkus simpatikus", "Di samping korpus vertebra (paravertebral)."],
    svc: ["V. kava superior", "Bermuara ke AK; SA node di dekat muaranya."], aorta: ["Aorta", "Keluar dari VKi, di belakang-kanan trunkus pulmonalis."], pt: ["Trunkus pulmonalis", "Keluar dari VKa, paling anterior-kiri di antara pembuluh besar."],
    ra: ["Atrium kanan", "Batas kanan jantung."], rv: ["Ventrikel kanan", "Membentuk sebagian besar permukaan anterior → paling dekat dengan sternum."],
    lv: ["Ventrikel kiri", "Batas kiri & apeks; permukaan diafragmatika & pulmonal kiri."], lau: ["Aurikula kiri", "Satu-satunya bagian AKi yang terlihat dari depan."],
    i_ra: ["Atrium kanan", "Krista terminalis memisahkan bagian halus (sinus venarum, dari sinus venosus) dari bagian kasar m. pektinati (dari atrium primitif)."],
    i_la: ["Atrium kiri", "Menerima 4 v. pulmonalis; sebagian besar dinding halus (berasal dari v. pulmonalis yang diserap)."],
    i_rv: ["Ventrikel kanan", "Trabekula karnea kasar, moderator band (septum → m. papilaris anterior), 3 m. papilaris, infundibulum menuju katup pulmonal."],
    i_lv: ["Ventrikel kiri", "Dinding tertebal (tekanan sistemik); 2 m. papilaris besar untuk katup mitral; vestibulum aorta yang halus."],
    sa: ["SA node", "Di ujung atas sulkus/krista terminalis, dekat muara VCS. Diperdarahi a. nodus SA (RCA ±60%)."],
    av: ["AV node", "Di puncak segitiga Koch, di atas ostium sinus koronarius. Diperdarahi a. nodus AV (umumnya dari RCA/PDA)."],
    koch: ["Segitiga Koch", "Batas: tendo Todaro, daun septal katup trikuspid, ostium sinus koronarius."],
    rca: ["RCA", "Dari sinus aorta kanan, di sulkus koroner kanan."], pda: ["PDA", "Di sulkus interventrikular posterior; dari RCA pada ±70–80% orang."],
    lad: ["LAD", "Di sulkus interventrikular anterior; cabang diagonal & septal."], lcx: ["LCx", "Di sulkus koroner kiri; cabang obtuse marginal."],
    gcv: ["V. kordis magna", "Mengikuti LAD lalu LCx → sinus koronarius."], acv: ["V. kordis anterior", "Bermuara langsung ke atrium kanan."],
    plex: ["Pleksus kardiakus", "Di bawah arkus aorta & di depan bifurkasio trakea; campuran serabut simpatis & parasimpatis."],
    ref: ["Nyeri alih", "Aferen nyeri jantung masuk medula spinalis T1–T4 — segmen yang sama dengan kulit dada & lengan medial kiri."],
  };

  registerModule({
    id: "d02",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Peta lokasi jantung", emoji: "💡", html: `
          <p>Anatomi menjawab <b>“di mana”</b>: di mana jantung berada, apa yang melindunginya, siapa tetangganya, dan bagaimana ia diperdarahi & dipersarafi.</p>
          <ul class="key-points">
            <li><span class="k-ico">📍</span><span>Jantung di <b>mediastinum medius</b>, ⅔ di kiri garis tengah, apeks menghadap kiri-depan-bawah.</span></li>
            <li><span class="k-ico">🛡️</span><span>Dibungkus <b>perikardium</b>, dilindungi sternum, kosta, dan vertebra.</span></li>
            <li><span class="k-ico">🔌</span><span>Punya “kabel” sendiri (sistem konduksi), “pipa” sendiri (koroner), dan “remote” (pleksus kardiakus).</span></li>
          </ul>
          <div class="callout"><p><b>Kaitan:</b> struktur konduksi (A5), koroner (A2), dan saraf (A12) sudah kamu pelajari fungsinya — di sini kita melihat <b>letaknya</b>.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Tur anatomi jantung", emoji: "🗺️", intro: "Gambar berganti mengikuti topik. Klik titik, batas, ruang, dan struktur untuk penjelasan.",
          viz: V_SURF, steps: STEPS, info: INFO, autoplayMs: 7000 },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Anatomi menjelaskan gejala", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa nyeri jantung terasa di lengan kiri?", nodes: ["Iskemia miokard merangsang ujung saraf nyeri viseral", "Serabut aferen berjalan bersama saraf simpatis kardiak", "Masuk ke medula spinalis segmen T1–T4", "Segmen yang sama menerima aferen dari kulit dada & sisi medial lengan", "Otak “salah alamat” → nyeri dirasakan di dada & lengan kiri (nyeri alih)"] },
            { label: "Mengapa tamponade berbahaya?", nodes: ["Cairan/darah menumpuk di rongga perikardium", "Perikardium fibrosa tidak elastis", "Tekanan intraperikardial naik cepat", "Ruang jantung (terutama atrium & VKa yang berdinding tipis) tertekan → pengisian terhambat", "SV & CO turun → syok (Trias Beck: hipotensi, JVP ↑, bunyi jantung menjauh)"] },
            { label: "Mengapa AKi yang membesar menyebabkan sulit menelan?", nodes: ["AKi adalah ruang jantung paling posterior", "Tepat di belakangnya ada esofagus (mediastinum posterior)", "Pada stenosis mitral, tekanan AKi tinggi → AKi melebar", "AKi menekan esofagus", "Disfagia; juga dapat menekan n. laringeus rekuren kiri → suara serak (sindrom Ortner)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Tunjuk strukturnya!", emoji: "🎯", html: `
          <p>Baca pertanyaan, lalu <b>klik bagian jantung</b> yang dimaksud pada gambar tampak anterior.</p>
          <div class="callout" id="pt-q"></div>
          <div class="viz-wrap" id="pt-svg" style="max-width:520px;margin:auto"></div>
          <div class="btn-row" style="margin-top:8px"><button class="btn btn-sm" id="pt-next" type="button">Soal lain ↻</button><span class="small muted" id="pt-score"></span></div>
          <div id="pt-msg" style="margin-top:8px"></div>`,
          init(el) {
            K.$("#pt-svg", el).innerHTML = V_ANT;
            const Q = [["Ruang yang membentuk sebagian besar permukaan anterior (sternokostal) jantung", "rv"], ["Ruang yang membentuk batas kanan jantung", "ra"], ["Ruang yang membentuk apeks & batas kiri", "lv"], ["Bagian atrium kiri yang terlihat dari depan", "lau"], ["Pembuluh yang keluar dari ventrikel kanan", "pt"], ["Pembuluh tempat SA node berada di dekat muaranya", "svc"]];
            let cur, sc = 0, n = 0, done = false;
            function next() { cur = Q[Math.floor(Math.random() * Q.length)]; done = false; K.$("#pt-q", el).innerHTML = `<p><b>❓ ${cur[0]}</b></p>`; K.$("#pt-msg", el).innerHTML = ""; K.$$("[data-info]", el).forEach((p) => p.style.outline = ""); }
            K.$$("#pt-svg [data-info]", el).forEach((p) => { p.style.cursor = "pointer"; p.addEventListener("click", () => {
              if (done) return; done = true; n++; const ok = p.dataset.info === cur[1]; if (ok) sc++;
              const [t, d] = INFO[cur[1]];
              K.$("#pt-msg", el).innerHTML = `<div class="callout ${ok ? "green" : "red"}"><p>${ok ? "✅ Tepat!" : `❌ Itu ${INFO[p.dataset.info][0]}. Jawaban: <b>${t}</b>.`} ${d}</p></div>`;
              K.$("#pt-score", el).textContent = `Skor: ${sc}/${n}`;
            }); });
            K.$("#pt-next", el).addEventListener("click", next); next();
          } },
        { type: "match", heading: "Struktur → ruang jantung", emoji: "🧩", intro: "Ketuk struktur, lalu ruang tempatnya berada.",
          pairs: [["Krista terminalis & fossa ovalis", "Atrium kanan"], ["Moderator band (trabekula septomarginal)", "Ventrikel kanan"], ["4 muara v. pulmonalis", "Atrium kiri"], ["2 m. papilaris besar & vestibulum aorta", "Ventrikel kiri"], ["Ostium sinus koronarius", "Atrium kanan (segitiga Koch)"]] },
        { type: "match", heading: "Arteri ↔ vena pendampingnya", emoji: "🩸", intro: "Vena jantung berjalan berdampingan dengan arteri tertentu.",
          pairs: [["LAD (interventrikular anterior)", "V. kordis magna"], ["PDA (interventrikular posterior)", "V. kordis media"], ["A. marginal kanan", "V. kordis parva"], ["Semua vena besar jantung bermuara ke", "Sinus koronarius → atrium kanan"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Batas jantung: <b>Kanan = AK</b>, <b>Kiri = VKi</b>, <b>Bawah = VKa</b>, <b>Belakang = AKi</b> → “<b>K</b>anan <b>A</b>trium, <b>K</b>iri <b>V</b>entrikel; <b>bawah</b> si <b>Kanan</b>, <b>belakang</b> si <b>Kiri</b>”.</p></div>
            <div class="callout"><p class="mnemo">Isi mediastinum posterior “<b>DAVE</b>”: <b>D</b>uktus torasikus · <b>A</b>orta desendens · <b>V</b>ena azigos/hemiazigos (+ <b>V</b>agus) · <b>E</b>sofagus.</p></div>
            <div class="callout green"><p class="mnemo">Segitiga Koch “<b>T-T-S</b>”: <b>T</b>endo Todaro · <b>T</b>rikuspid (daun septal) · <b>S</b>inus koronarius → AV node di puncaknya.</p></div>
            <div class="callout warn"><p class="mnemo">Vena pendamping: <b>Magna–LAD</b> (“besar ikut yang di depan”), <b>Media–PDA</b> (“tengah ikut yang di belakang”), <b>Parva–marginal</b>.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Letak apeks/iktus kordis", "ICS 5 kiri, linea midklavikula"], ["Batas kanan jantung", "Atrium kanan"], ["Permukaan anterior jantung terutama", "Ventrikel kanan"], ["Ruang jantung paling posterior", "Atrium kiri"], ["Bidang pemisah mediastinum superior–inferior", "Angulus sternal ↔ diskus T4–T5"], ["Lapisan perikardium yang tidak elastis", "Perikardium fibrosa"], ["Volume normal cairan perikardium", "±15–50 mL"], ["Struktur yang membawa RBB ke m. papilaris anterior", "Trabekula septomarginal (moderator band)"], ["Letak AV node", "Puncak segitiga Koch"], ["Segmen medula spinalis untuk nyeri jantung", "T1–T4"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Anatomi di ruang praktik", emoji: "🩺", intro: "Hubungkan letak struktur dengan temuan klinis.", note: "",
          items: [
            { icon: "🫳", title: "Iktus kordis bergeser", chain: ["Iktus normal di ICS 5 linea midklavikula kiri", "VKi membesar (dilatasi/hipertrofi)", "Iktus bergeser ke lateral-bawah dan melebar → tanda kardiomegali"] },
            { icon: "💉", title: "Perikardiosentesis", chain: ["Tamponade perlu cairan dikeluarkan segera", "Jarum masuk dari sudut xifokostal kiri (subxifoid), diarahkan ke bahu kiri", "Jalur ini menghindari a. torakika interna, pleura, dan arteri koroner"] },
            { icon: "🔪", title: "Operasi katup trikuspid / penutupan ASD", chain: ["Ahli bedah bekerja di dinding septal atrium kanan", "AV node berada di segitiga Koch", "Menghindari area itu mencegah blok AV pascaoperasi"] },
            { icon: "🩻", title: "Rontgen toraks", chain: ["Siluet jantung pada foto PA: batas kanan = AK, batas kiri = VKi", "Rasio jantung–toraks normal < 50%", "Pembesaran ruang tertentu mengubah bentuk siluet (mis. AKi besar → pinggang jantung hilang)"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Pada luka tusuk tepat di sebelah kiri sternum ICS 4, ruang jantung yang paling mungkin terkena adalah…",
          options: ["Atrium kiri", "Ventrikel kanan", "Atrium kanan", "Ventrikel kiri di apeks"], answer: 1,
          explain: "Ventrikel kanan membentuk sebagian besar permukaan sternokostal, sehingga paling dekat dengan dinding dada depan." },
        { q: "Bidang yang memisahkan mediastinum superior dan inferior melewati…",
          options: ["Prosesus xifoideus dan T10", "Angulus sternal dan diskus T4–T5", "Klavikula dan T1", "Iktus kordis dan T8"], answer: 1,
          explain: "Bidang angulus sternal (Louis) ↔ diskus T4–T5 juga menandai bifurkasio trakea serta awal & akhir arkus aorta." },
        { q: "AV node terletak di…",
          options: ["Ujung atas krista terminalis", "Puncak segitiga Koch di septum atrium kanan", "Dinding lateral ventrikel kiri", "Muara v. pulmonalis"], answer: 1,
          explain: "Segitiga Koch dibatasi tendo Todaro, daun septal katup trikuspid, dan ostium sinus koronarius. SA node berada di ujung atas krista terminalis." },
        { q: "Mengapa perikardium fibrosa membuat penumpukan cairan akut berbahaya?",
          options: ["Karena menyerap cairan dengan cepat", "Karena tidak elastis sehingga tekanan dalam rongga cepat naik dan menekan jantung", "Karena berisi pembuluh koroner", "Karena melekat ke esofagus"], answer: 1,
          explain: "Kantong yang tidak dapat melar membuat sedikit tambahan cairan akut (±150–200 mL) sudah menaikkan tekanan dan menghambat pengisian jantung (tamponade)." },
        { q: "V. kordis magna berjalan bersama arteri…",
          options: ["PDA", "LAD (interventrikular anterior)", "A. marginal kanan", "A. nodus SA"], answer: 1,
          explain: "V. kordis magna mengikuti LAD di sulkus interventrikular anterior, lalu berbelok ke sulkus koroner kiri menuju sinus koronarius." },
      ]},
    ],
  });
})();
