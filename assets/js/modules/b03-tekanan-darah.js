/* Modul B3 — Tekanan Darah */
(function () {
  /** gelombang tekanan arteri satu denyut (fase 0..1) → nilai 0..1 (0 = diastolik, 1 = sistolik) */
  function wave(f) {
    f = ((f % 1) + 1) % 1;
    if (f < 0.12) return Math.sin(f / 0.12 * Math.PI / 2);
    if (f < 0.36) return 1 - 0.35 * ((f - 0.12) / 0.24);
    if (f < 0.39) return 0.65 - 0.08 * ((f - 0.36) / 0.03);
    if (f < 0.43) return 0.57 + 0.08 * ((f - 0.39) / 0.04);
    return 0.65 * Math.exp(-(f - 0.43) * 3.2) - 0.65 * Math.exp(-0.57 * 3.2) * ((f - 0.43) / 0.57);
  }
  const bp = (f, s, d) => d + (s - d) * Math.max(0, wave(f));
  // Klasifikasi PERHI 2019 (mengacu ESH/ESC 2018)
  const classify = (s, d) => s >= 180 || d >= 110 ? ["Hipertensi derajat 3 (≥180/≥110)", "red"] : s >= 160 || d >= 100 ? ["Hipertensi derajat 2 (160–179 / 100–109)", "red"] : s >= 140 && d < 90 ? ["Hipertensi sistolik terisolasi (≥140 / <90)", "warn"] : s >= 140 || d >= 90 ? ["Hipertensi derajat 1 (140–159 / 90–99)", "warn"] : s >= 130 || d >= 85 ? ["Normal-tinggi (130–139 / 85–89)", "warn"] : s < 90 || d < 60 ? ["Hipotensi (<90/60)", "warn"] : s < 120 && d < 80 ? ["Optimal (<120/<80)", "green"] : ["Normal (120–129 / 80–84)", "green"];

  const SX = (t) => 40 + t / 2 * 370, SY = (p) => 190 - (p - 50) / 90 * 170;
  const VIZ = `<svg viewBox="0 0 420 260" role="img" aria-label="Gelombang tekanan arteri">
      <line class="svg-axis" x1="40" y1="15" x2="40" y2="195"/>
      <g class="svg-label small" style="font-size:9.5px">${[60, 80, 100, 120, 140].map((p) => `<text x="36" y="${SY(p) + 3}" text-anchor="end">${p}</text><line class="svg-grid" x1="40" y1="${SY(p)}" x2="410" y2="${SY(p)}"/>`).join("")}</g>
      <path id="bp-tr" fill="none" stroke="var(--o2-rich)" stroke-width="3"/>
      <g class="bp-el" data-e="sys"><line x1="40" x2="410" y1="${SY(120)}" y2="${SY(120)}" stroke="var(--primary)" stroke-width="2" stroke-dasharray="6 4"/><text class="svg-label small" x="408" y="${SY(120) - 5}" text-anchor="end" style="fill:var(--primary);font-weight:700">Sistolik 120</text></g>
      <g class="bp-el" data-e="dia"><line x1="40" x2="410" y1="${SY(80)}" y2="${SY(80)}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4"/><text class="svg-label small" x="408" y="${SY(80) + 14}" text-anchor="end" style="fill:var(--accent);font-weight:700">Diastolik 80</text></g>
      <g class="bp-el" data-e="map"><line x1="40" x2="410" y1="${SY(93)}" y2="${SY(93)}" stroke="var(--ok)" stroke-width="2.5"/><text class="svg-label small" x="250" y="${SY(93) - 5}" style="fill:var(--ok);font-weight:700">MAP ≈ 93</text></g>
      <g class="bp-el" data-e="pp"><line x1="${SX(0.12)}" x2="${SX(0.12)}" y1="${SY(120)}" y2="${SY(80)}" stroke="var(--warn)" stroke-width="3" marker-start="url(#ppa)" marker-end="url(#ppa)"/><text class="svg-label small" x="${SX(0.12) + 6}" y="${SY(100)}" style="fill:var(--warn);font-weight:700">tekanan nadi 40</text></g>
      <g class="bp-el" data-e="notch"><circle cx="${SX(0.39)}" cy="${SY(bp(.39, 120, 80))}" r="7" fill="none" stroke="var(--text)" stroke-width="2"/><text class="svg-label small" x="${SX(0.39) + 10}" y="${SY(bp(.39, 120, 80)) - 8}">insisura (katup aorta menutup)</text></g>
      <defs><marker id="ppa" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--warn)"/></marker></defs>
      <circle id="bp-dot" r="5" fill="var(--o2-rich)" stroke="#fff" stroke-width="2"/>
      <!-- Windkessel -->
      <g transform="translate(0 205)">
        <text class="svg-label small" x="40" y="12">Aorta:</text>
        <rect id="wk-ao" x="90" y="18" width="220" height="22" rx="11" fill="var(--o2-rich)" opacity=".5"/>
        <text id="wk-t" class="svg-label small" x="318" y="34"></text>
      </g>
    </svg>`;

  const STEPS = [
    { title: "Apa itu tekanan darah?", body: "Tekanan darah adalah <b>gaya dorong darah pada dinding arteri</b>, diukur dalam mmHg. Tekanan inilah yang mendorong darah mengalir dari arteri menuju kapiler dan vena (dari tekanan tinggi ke rendah).", key: "Tanpa gradien tekanan, tidak ada aliran.", e: [] },
    { title: "Tekanan sistolik", body: "Puncak tekanan saat ventrikel kiri <b>memompa darah</b> ke aorta (ejeksi, A10). Normal ±<b>120 mmHg</b>. Dipengaruhi terutama oleh <b>stroke volume</b> dan <b>kekakuan</b> arteri.", key: "Sistolik = puncak.", e: ["sys"] },
    { title: "Tekanan diastolik", body: "Tekanan terendah sebelum denyut berikutnya, ±<b>80 mmHg</b>. Tidak turun ke 0 karena aorta yang elastis <b>mengerut kembali</b> (recoil) dan terus mendorong darah — lihat animasi aorta di bawah grafik.", key: "Diastolik terutama mencerminkan resistensi perifer & elastisitas arteri.", e: ["dia", "notch"] },
    { title: "Tekanan nadi (pulse pressure)", body: "<b>Tekanan nadi = sistolik − diastolik</b> = 120 − 80 = <b>40 mmHg</b>. Inilah “denyutan” yang teraba di nadi. Membesar bila SV besar atau arteri kaku.", key: "PP = SBP − DBP.", e: ["sys", "dia", "pp"] },
    { title: "Tekanan arteri rata-rata (MAP)", body: "Tekanan rata-rata sepanjang satu siklus. Karena diastol lebih lama dari sistol, MAP lebih dekat ke diastolik: <b>MAP ≈ DBP + ⅓ PP</b> = 80 + 13 ≈ <b>93 mmHg</b>.", key: "MAP = tekanan yang benar-benar “mendorong” perfusi organ.", e: ["map", "dia", "pp"] },
    { title: "Apa yang menentukan MAP?", body: "<div class='callout red'><p style='text-align:center;font-size:1.1rem'><b>MAP = CO × TPR</b></p></div>CO = HR × SV (A11–A13). TPR = resistensi perifer total, terutama dari arteriol (B4). Naiknya salah satu akan menaikkan tekanan darah.", key: "Semua regulasi tekanan darah (B6) bekerja lewat CO atau TPR.", e: ["map"] },
    { title: "Cara mengukur: bunyi Korotkoff", body: "Manset dipompa di atas sistolik → arteri tertutup, sunyi. Saat manset dikempiskan dan tekanannya turun di bawah sistolik, darah menyembur turbulen → <b>bunyi pertama = sistolik</b>. Saat di bawah diastolik, aliran kembali lancar → <b>bunyi hilang = diastolik</b>.", key: "Coba sendiri di bagian Interaksi!", e: ["sys", "dia"] },
  ];

  registerModule({
    id: "b03",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Angka “120/80” itu apa?", emoji: "💡", html: `
          <p>Dari B2 kamu tahu tekanan tertinggi ada di aorta dan menurun sepanjang pembuluh. Tekanan darah yang diukur di lengan menggambarkan tekanan di <b>arteri besar</b>.</p>
          <ul class="key-points">
            <li><span class="k-ico">⬆️</span><span><b>Sistolik</b> — puncak saat jantung memompa.</span></li>
            <li><span class="k-ico">⬇️</span><span><b>Diastolik</b> — terendah saat jantung relaksasi.</span></li>
            <li><span class="k-ico">↕️</span><span><b>Tekanan nadi</b> = selisihnya; <b>MAP</b> = rata-ratanya.</span></li>
            <li><span class="k-ico">🧮</span><span>Penentunya: <b>MAP = CO × TPR</b>.</span></li>
          </ul>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Membaca gelombang tekanan arteri", emoji: "📈", intro: "Elemen grafik yang dibahas akan muncul dan disorot.",
          viz: VIZ, steps: STEPS,
          onStep(i, s, api) { K.$$(".bp-el", api.viz).forEach((g) => { g.style.transition = "opacity .3s"; g.style.opacity = s.e.includes(g.dataset.e) ? 1 : 0; }); },
          init(api, secEl) {
            const v = api.viz;
            K.$("#bp-tr", v).setAttribute("d", K.plot((t) => bp(t, 120, 80), 0, 2, SX, SY, 400));
            let t = 0;
            K.loop(secEl, (dt) => {
              t = (t + dt * .5) % 2;
              const p = bp(t, 120, 80), d = K.$("#bp-dot", v); d.setAttribute("cx", SX(t)); d.setAttribute("cy", SY(p));
              const f = t % 1, w = Math.max(0, wave(f));
              const a = K.$("#wk-ao", v); const h = 18 + w * 14; a.setAttribute("height", h); a.setAttribute("y", 29 - h / 2);
              K.$("#wk-t", v).textContent = f < .36 ? "meregang (sistol)" : "recoil (diastol)";
            });
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa lansia sering hipertensi sistolik terisolasi?", nodes: ["Seiring usia, serat elastin aorta berkurang dan digantikan kolagen", "Aorta menjadi kaku (compliance ↓)", "Saat sistol, aorta tidak bisa meregang menampung darah → sistolik melonjak", "Saat diastol, recoil lemah → diastolik turun", "Tekanan nadi melebar; mis. 160/70 mmHg"] },
            { label: "Bagaimana CO dan TPR menaikkan MAP?", nodes: ["MAP = CO × TPR", "CO naik (HR ↑ atau SV ↑) → lebih banyak darah masuk ke arteri per menit", "TPR naik (arteriol menyempit) → darah lebih sulit keluar dari arteri", "Keduanya menambah volume darah di arteri pada satu saat", "Tekanan arteri rata-rata naik"] },
            { label: "Mengapa MAP lebih dekat ke diastolik?", nodes: ["Saat istirahat, sistol ±⅓ siklus dan diastol ±⅔ siklus", "Tekanan lebih lama berada di kisaran diastolik", "Rata-rata terhadap waktu condong ke nilai diastolik", "MAP ≈ DBP + ⅓(SBP − DBP)", "Saat HR sangat tinggi, rumus ini kurang tepat karena porsi sistol membesar"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator penentu tekanan darah", emoji: "🎚️", html: `
          <p>Ubah cardiac output, resistensi perifer, dan kelenturan arteri. Lihat tekanan sistolik, diastolik, tekanan nadi, dan MAP berubah.</p>
          <div class="slider-row"><label for="b-co">Cardiac output <output id="b-co-o"></output></label><input type="range" id="b-co" min="2.5" max="10" step=".1" value="5"></div>
          <div class="slider-row"><label for="b-tpr">Resistensi perifer total <output id="b-tpr-o"></output></label><input type="range" id="b-tpr" min="50" max="200" value="100"></div>
          <div class="slider-row"><label for="b-c">Kelenturan (compliance) arteri <output id="b-c-o"></output></label><input type="range" id="b-c" min="40" max="150" value="100"></div>
          <div class="viz-wrap"><svg id="b-svg" viewBox="0 0 420 200" role="img" aria-label="Gelombang tekanan hasil simulasi" style="max-width:600px;margin:auto"></svg></div>
          <div class="readouts"><div class="readout big"><span>Tekanan darah</span><b id="b-bp"></b></div><div class="readout"><span>Tekanan nadi</span><b id="b-pp"></b></div><div class="readout"><span>MAP</span><b id="b-map"></b></div></div>
          <div class="callout" id="b-cls"></div>`,
          init(el) {
            const co = K.$("#b-co", el), tpr = K.$("#b-tpr", el), c = K.$("#b-c", el);
            const Y = (p) => 180 - (p - 30) / 170 * 165, Xs = (t) => 30 + t / 2 * 380;
            function upd() {
              const CO = +co.value, R = +tpr.value / 100, C = +c.value / 100;
              const map = CO * 18.6 * R, sv = CO / 5 * 70 / (CO > 6 ? Math.sqrt(CO / 6) : 1), pp = sv / 1.75 / C;
              const s = map + 2 / 3 * pp, d = map - 1 / 3 * pp;
              K.$("#b-co-o", el).textContent = CO.toFixed(1).replace(".", ",") + " L/menit"; K.$("#b-tpr-o", el).textContent = Math.round(R * 100) + "%"; K.$("#b-c-o", el).textContent = Math.round(C * 100) + "%";
              K.$("#b-svg", el).innerHTML = `${[60, 100, 140, 180].map((p) => `<line class="svg-grid" x1="30" x2="410" y1="${Y(p)}" y2="${Y(p)}"/><text class="svg-label small" x="26" y="${Y(p) + 3}" text-anchor="end" style="font-size:9.5px">${p}</text>`).join("")}
                <path d="${K.plot((t) => bp(t, 120, 80), 0, 2, Xs, Y, 300)}" fill="none" stroke="var(--text-soft)" stroke-width="1.5" stroke-dasharray="4 4"/>
                <path d="${K.plot((t) => bp(t, s, d), 0, 2, Xs, Y, 300)}" fill="none" stroke="var(--o2-rich)" stroke-width="3"/>
                <line x1="30" x2="410" y1="${Y(map)}" y2="${Y(map)}" stroke="var(--ok)" stroke-width="2"/><text class="svg-label small" x="408" y="${Y(map) - 4}" text-anchor="end" style="fill:var(--ok)">MAP</text>
                <text class="svg-label small" x="408" y="16" text-anchor="end">— — normal 120/80</text>`;
              K.$("#b-bp", el).innerHTML = `${Math.round(s)}/${Math.round(d)}<small> mmHg</small>`;
              K.$("#b-pp", el).innerHTML = `${Math.round(pp)}<small> mmHg</small>`; K.$("#b-map", el).innerHTML = `${Math.round(map)}<small> mmHg</small>`;
              const [txt, col] = classify(s, d);
              const why = [];
              if (R > 1.2) why.push("TPR ↑ → MAP ↑ (terutama diastolik naik)"); if (R < .8) why.push("TPR ↓ (vasodilatasi) → MAP ↓");
              if (CO > 6) why.push("CO ↑ → MAP ↑ dan SV besar memperlebar tekanan nadi"); if (CO < 4) why.push("CO ↓ → MAP ↓");
              if (C < .8) why.push("arteri kaku → sistolik ↑, diastolik ↓, tekanan nadi melebar"); if (C > 1.2) why.push("arteri lentur → tekanan nadi menyempit");
              K.$("#b-cls", el).className = "callout " + col;
              K.$("#b-cls", el).innerHTML = `<p><b>Kategori (PERHI 2019): ${txt}.</b> ${why.length ? why.join("; ") + "." : "Semua parameter normal."}</p>`;
            }
            [co, tpr, c].forEach((x) => x.addEventListener("input", upd)); upd();
          } },
        { heading: "Ukur tekanan darah (simulasi Korotkoff)", emoji: "🩺", html: `
          <p>Pompa manset, lalu kempiskan perlahan. Dengarkan (🔊) dan perhatikan indikator bunyi. Tekan <b>“Catat sistolik”</b> saat bunyi pertama muncul dan <b>“Catat diastolik”</b> saat bunyi menghilang.</p>
          <div class="btn-row"><button class="btn btn-primary btn-sm" id="k-pump" type="button">🎈 Pompa manset ke 180</button><button class="btn btn-sm" id="k-sys" type="button">Catat sistolik</button><button class="btn btn-sm" id="k-dia" type="button">Catat diastolik</button><button class="btn btn-sm" id="k-snd" type="button">🔊 Suara: ON</button></div>
          <div class="two-col" style="margin-top:10px">
            <div class="viz-wrap"><svg id="k-svg" viewBox="0 0 240 200" role="img" aria-label="Manometer dan arteri brakialis" style="max-width:320px;margin:auto">
              <circle cx="80" cy="85" r="70" fill="var(--surface)" stroke="var(--border)" stroke-width="3"/>
              ${[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300].map((p) => { const a = (-225 + p / 300 * 270) * Math.PI / 180; return `<line x1="${80 + 58 * Math.cos(a)}" y1="${85 + 58 * Math.sin(a)}" x2="${80 + 66 * Math.cos(a)}" y2="${85 + 66 * Math.sin(a)}" stroke="var(--text)"/>${p % 40 === 0 ? `<text class="svg-label small" x="${80 + 46 * Math.cos(a)}" y="${88 + 46 * Math.sin(a)}" text-anchor="middle" style="font-size:9px">${p}</text>` : ""}`; }).join("")}
              <line id="k-needle" x1="80" y1="85" x2="80" y2="30" stroke="var(--bad)" stroke-width="3" stroke-linecap="round"/><circle cx="80" cy="85" r="5" fill="var(--bad)"/>
              <text id="k-val" class="svg-label" x="80" y="125" text-anchor="middle"></text>
              <rect x="170" y="20" width="50" height="160" rx="20" fill="var(--primary-soft)" stroke="var(--primary)"/>
              <rect id="k-cuff" x="160" y="70" width="70" height="50" rx="8" fill="var(--accent)" opacity=".35"/>
              <rect id="k-art" x="190" y="20" width="10" height="160" fill="var(--o2-rich)"/>
              <text id="k-note" class="svg-label small" x="120" y="195" text-anchor="middle"></text>
            </svg></div>
            <div><div class="readouts"><div class="readout"><span>Bunyi</span><b id="k-sound" style="font-size:1rem">—</b></div><div class="readout"><span>Catatanmu</span><b id="k-rec" style="font-size:1rem">—/—</b></div></div><div id="k-msg" class="callout"><p>Tekan “Pompa manset”.</p></div></div>
          </div>`,
          init(el, secEl) {
            let cuff = 0, deflating = false, sys = 0, dia = 0, recS = null, recD = null, beatT = 0, snd = true, flash = 0;
            function newPatient() { sys = 100 + Math.round(Math.random() * 60); dia = Math.round(sys * (0.55 + Math.random() * .15)); }
            newPatient();
            K.$("#k-pump", el).addEventListener("click", () => { newPatient(); cuff = 180; deflating = true; recS = recD = null; K.$("#k-rec", el).textContent = "—/—"; K.$("#k-msg", el).className = "callout"; K.$("#k-msg", el).innerHTML = "<p>Manset mengempis ±3 mmHg/detik… dengarkan.</p>"; });
            K.$("#k-snd", el).addEventListener("click", (e) => { snd = !snd; e.target.textContent = `🔊 Suara: ${snd ? "ON" : "OFF"}`; });
            K.$("#k-sys", el).addEventListener("click", () => { if (!deflating && !cuff) return; recS = Math.round(cuff); show(); });
            K.$("#k-dia", el).addEventListener("click", () => { if (recS == null) return; recD = Math.round(cuff); deflating = false; show(true); });
            function show(done) {
              K.$("#k-rec", el).textContent = `${recS ?? "—"}/${recD ?? "—"}`;
              if (done) {
                const ok = Math.abs(recS - sys) <= 6 && Math.abs(recD - dia) <= 6;
                K.$("#k-msg", el).className = ok ? "callout green" : "callout warn";
                K.$("#k-msg", el).innerHTML = `<p>Tekanan sebenarnya: <b>${sys}/${dia} mmHg</b>. ${ok ? "✅ Pengukuranmu akurat!" : "Masih meleset — perhatikan saat bunyi PERTAMA muncul dan saat bunyi benar-benar HILANG."}</p>`;
              }
            }
            K.loop(secEl, (dt) => {
              if (deflating) { cuff = Math.max(0, cuff - dt * 3.2); if (cuff <= 0) deflating = false; }
              const a = (-225 + cuff / 300 * 270) * Math.PI / 180, n = K.$("#k-needle", el);
              n.setAttribute("x2", 80 + 52 * Math.cos(a)); n.setAttribute("y2", 85 + 52 * Math.sin(a));
              K.$("#k-val", el).textContent = Math.round(cuff) + " mmHg";
              const state = cuff > sys ? "closed" : cuff > dia ? "turb" : "open";
              const art = K.$("#k-art", el); art.setAttribute("width", state === "closed" ? 2 : state === "turb" ? 6 : 10); art.setAttribute("x", state === "closed" ? 194 : state === "turb" ? 192 : 190);
              K.$("#k-cuff", el).style.opacity = .15 + cuff / 180 * .5;
              K.$("#k-note", el).textContent = !cuff ? "" : state === "closed" ? "arteri tertutup → sunyi" : state === "turb" ? "aliran turbulen → bunyi Korotkoff" : "aliran lancar → sunyi";
              beatT += dt;
              if (beatT > .85) { beatT = 0; if (cuff && state === "turb") { flash = .25; if (snd) K.thump(70, .08, .7); } }
              flash = Math.max(0, flash - dt);
              K.$("#k-sound", el).textContent = flash > 0 ? "🔊 “tuk!”" : "—";
            });
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika tekanan darah berubah…", emoji: "🩺", intro: "Gunakan MAP = CO × TPR dan konsep compliance.",
          items: [
            { icon: "📈", title: "Hipertensi esensial", chain: ["TPR meningkat (arteriol menyempit/kaku) dan/atau volume darah ↑", "MAP naik terus-menerus", "Beban VKi ↑ (afterload, A13) dan pembuluh organ rusak (otak, ginjal, mata)"] },
            { icon: "📉", title: "Syok", chain: ["CO turun (perdarahan, gagal pompa) atau TPR turun drastis (sepsis, anafilaksis)", "MAP turun di bawah batas perfusi organ (±65 mmHg)", "Organ kekurangan O₂ → gagal organ bila tidak segera ditangani"] },
            { icon: "👴", title: "Hipertensi sistolik terisolasi (lansia)", chain: ["Aorta kaku", "Sistolik tinggi, diastolik normal/rendah", "Tekanan nadi lebar → beban jantung & pembuluh otak ↑"] },
            { icon: "↩️", title: "Regurgitasi aorta", chain: ["Darah bocor balik dari aorta ke VKi saat diastol", "Diastolik turun tajam; SV yang dipompa besar → sistolik tinggi", "Tekanan nadi sangat lebar (nadi “memukul”)"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Tekanan darah seseorang 130/70 mmHg. Berapa tekanan nadi dan MAP-nya (perkiraan)?",
          options: ["PP 60, MAP ±90", "PP 200, MAP ±100", "PP 60, MAP ±100", "PP 70, MAP ±130"], answer: 0,
          explain: "PP = 130 − 70 = 60. MAP ≈ DBP + ⅓PP = 70 + 20 = 90 mmHg." },
        { q: "Mengapa tekanan diastolik tidak turun ke 0 mmHg?",
          options: ["Karena vena memompa darah balik", "Karena recoil dinding arteri yang elastis terus mendorong darah dan arteriol menahan aliran keluar", "Karena katup aorta tetap terbuka", "Karena jantung tidak pernah relaksasi"], answer: 1,
          explain: "Arteri elastis menyimpan energi saat sistol dan melepaskannya saat diastol; resistensi arteriol memperlambat pengosongan arteri." },
        { q: "Pada pengukuran manual, tekanan sistolik dicatat saat…",
          options: ["Manset mulai dipompa", "Bunyi Korotkoff pertama terdengar", "Bunyi Korotkoff menghilang", "Denyut nadi radial pertama hilang saat memompa"], answer: 1,
          explain: "Saat tekanan manset turun sedikit di bawah sistolik, darah mulai menyembur melewati arteri yang tertekan → turbulensi → bunyi pertama." },
        { q: "Obat vasodilator arteriol akan menurunkan tekanan darah terutama karena…",
          options: ["Menurunkan HR", "Menurunkan TPR sehingga MAP = CO × TPR turun", "Menurunkan volume darah", "Menambah compliance vena"], answer: 1,
          explain: "Arteriol yang melebar menurunkan resistensi perifer total. Dengan CO tetap, MAP turun." },
        { q: "Mengapa lansia cenderung memiliki tekanan nadi yang lebar?",
          options: ["Karena HR mereka sangat tinggi", "Karena arteri besar menjadi kaku (compliance ↓)", "Karena volume darah berkurang", "Karena kapiler menyempit"], answer: 1,
          explain: "Arteri yang kaku tidak mampu meregang saat sistol (sistolik ↑) dan recoil-nya lemah saat diastol (diastolik ↓) → tekanan nadi melebar." },
      ]},
    ],
  });
})();
