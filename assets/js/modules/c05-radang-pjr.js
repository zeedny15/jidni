/* Modul C5 — Radang Dinding Jantung & Penyakit Jantung Reumatik (Kuliah 10) */
(function () {
  /* potongan dinding jantung: perikardium – miokardium – endokardium + katup */
  function V_LAYER(hl = [], o = {}) {
    const on = (k) => hl.includes(k);
    const fl = o.fluid || 0;
    let s = `<rect x="0" y="0" width="420" height="300" fill="var(--surface)"/>
      <rect x="10" y="${Math.max(16, 20 - fl)}" width="400" height="${14}" rx="6" fill="${on("peri") ? "var(--warn)" : "#e9d8a6"}" opacity=".9"/>
      <rect x="10" y="34" width="400" height="${8 + fl * 2}" fill="${fl ? "#fde68a" : "var(--accent-soft)"}"/>
      <rect x="10" y="${42 + fl * 2}" width="400" height="10" fill="${on("peri") ? "var(--warn)" : "#f7c9d9"}" opacity=".9"/>
      <text class="svg-label small" x="16" y="13" style="font-weight:700">Perikardium</text>${fl ? `<text class="svg-label small" x="410" y="${44 + fl}" text-anchor="end" style="font-weight:700;fill:var(--warn)">cairan efusi</text>` : ""}
      <rect x="10" y="${52 + fl * 2}" width="400" height="${130 - fl}" fill="${on("myo") ? "#ff8787" : "#f3a6c4"}"/>
      <text class="svg-label small" x="16" y="${70 + fl * 2}" style="font-weight:700">Miokardium</text>`;
    if (on("myo") && o.infiltrate) for (let i = 0; i < 30; i++) s += `<circle cx="${30 + (i * 53) % 370}" cy="${80 + fl * 2 + (i * 37) % (100 - fl)}" r="4" fill="#3b5bdb"/>`;
    s += `<rect x="10" y="${182 + fl}" width="400" height="12" fill="${on("endo") ? "var(--bad)" : "#f7c9d9"}" opacity=".9"/><text class="svg-label small" x="16" y="${208 + fl}" style="font-weight:700">Endokardium</text>
      <rect x="10" y="${194 + fl}" width="400" height="106" fill="var(--o2-rich)" opacity=".1"/><text class="svg-label small" x="410" y="${290}" text-anchor="end">rongga jantung (darah)</text>
      <path d="M220,${194 + fl} C240,${230 + fl} 270,${250 + fl} 320,${258}" stroke="${on("valve") ? "var(--bad)" : "#f7c9d9"}" stroke-width="${o.thick ? 14 : 8}" fill="none" stroke-linecap="round"/><text class="svg-label small" x="320" y="${248}" text-anchor="middle">daun katup</text>`;
    if (o.veg) s += `<circle cx="300" cy="258" r="11" fill="#a61e4d"/><circle cx="312" cy="252" r="7" fill="#a61e4d"/><circle cx="290" cy="250" r="6" fill="#c2255c"/><text class="svg-label small" x="330" y="280" style="font-weight:700;fill:var(--bad)">vegetasi</text>`;
    if (o.ra) s += `<text class="svg-label small" x="120" y="${250 + fl}" text-anchor="middle" style="fill:var(--bad);font-weight:700">katup menebal, fusi komisura, kalsifikasi</text>`;
    if (o.rub) s += `<text class="svg-label small" x="210" y="${40 + fl}" text-anchor="middle" style="font-weight:700;fill:var(--warn)">⇆ gesekan (friction rub)</text>`;
    return `<svg viewBox="0 0 420 300" role="img" aria-label="Lapisan dinding jantung">${s}</svg>`;
  }
  const g = (x, m, w) => Math.exp(-((x - m) ** 2) / (2 * w * w));
  const beat = (st, pr = 0, concave = true) => (t) => 0.12 * g(t, 40, 14) + (t > 60 && t < 92 ? pr : 0) - .08 * g(t, 95, 4) + g(t, 110, 6) - .2 * g(t, 124, 5) + (t > 128 && t < 300 ? st * (concave ? Math.sin(Math.PI * K.clamp((t - 128) / 200, 0, 1)) * .8 + .2 : 1) * (t < 270 ? 1 : (300 - t) / 30) : 0) + .3 * g(t, 300, 30);
  const ecg = (f, label) => `<svg viewBox="0 0 160 70" role="img" aria-label="EKG"><line class="svg-grid" x1="0" y1="44" x2="160" y2="44"/><path d="${K.plot(f, 0, 400, (t) => t / 400 * 160, (v) => 44 - v * 32, 200)}" fill="none" stroke="var(--primary)" stroke-width="2"/><text class="svg-label small" x="3" y="11" style="font-weight:700">${label}</text></svg>`;

  const STEPS = [
    { title: "Peta: lapisan mana yang meradang?", body: "<b>Endokarditis</b> = radang endokardium, terutama <b>katup</b>. <b>Miokarditis</b> = radang otot jantung. <b>Perikarditis</b> = radang perikardium. <b>Demam rematik</b> dapat mengenai ketiganya sekaligus (<b>pankarditis</b>), dan kerusakan katup menetapnya disebut <b>penyakit jantung reumatik (PJR)</b>.", key: "Hubungkan dengan histologi D3: katup avaskular, perikardium fibrosa tidak elastis.", viz: V_LAYER([]) },
    { title: "Endokarditis infektif: terbentuknya vegetasi", body: "Endotel katup yang rusak (aliran turbulen, katup reumatik/prostetik, kelainan kongenital) → deposit <b>trombosit–fibrin</b> steril. Saat terjadi <b>bakteremia</b> (prosedur gigi, IV drug use, kateter), bakteri menempel dan berkembang → <b>vegetasi</b>. Katup tersering: <b>mitral</b>, lalu aorta; pada pengguna narkoba suntik: <b>trikuspid</b>.", key: "S. aureus → akut, katup normal pun bisa. Strep viridans → subakut, katup yang sudah rusak.", viz: V_LAYER(["endo", "valve"], { veg: true }) },
    { title: "Manifestasi & kriteria Duke", body: "Gejala: demam, murmur baru/berubah, lemah. Vegetasi bisa lepas → <b>emboli</b> (otak, ginjal, limpa, kulit). Tanda klasik: <b>Janeway lesion</b> (makula tidak nyeri di telapak — vaskular), <b>Osler node</b> (nodul nyeri di ujung jari — imunologis), <b>Roth spot</b> (retina), <b>splinter hemorrhage</b> (kuku). Diagnosis dengan <b>kriteria Duke</b>: kultur darah + bukti keterlibatan endokardium (ekokardiografi).", key: "Ambil ≥3 set kultur darah SEBELUM antibiotik.", viz: V_LAYER(["endo", "valve"], { veg: true }) },
    { title: "Miokarditis", body: "Penyebab tersering: <b>virus</b> (coxsackie B, adenovirus, parvovirus B19, influenza, SARS-CoV-2); juga difteri, autoimun, obat. Khas: beberapa hari–minggu <b>setelah infeksi saluran napas/cerna</b> → nyeri dada, sesak, berdebar, aritmia, gagal jantung, bahkan kematian mendadak pada orang muda. <b>Troponin ↑</b>, perubahan ST-T; MRI jantung membantu; biopsi endomiokard = baku emas (infiltrat limfosit + nekrosis).", key: "Hindari olahraga kompetitif ±3–6 bulan (risiko aritmia).", viz: V_LAYER(["myo"], { infiltrate: true }) },
    { title: "Perikarditis akut", body: "Penyebab: idiopatik/virus (tersering), <b>tuberkulosis</b> (penting di Indonesia), uremia, pasca-infark/pasca-bedah jantung, autoimun, keganasan. Diagnosis bila ≥2 dari: ① <b>nyeri dada tajam</b>, memburuk saat berbaring/inspirasi, <b>membaik duduk condong ke depan</b>; ② <b>friction rub</b>; ③ EKG <b>elevasi ST difus cekung + depresi PR</b>; ④ efusi perikardium baru.", key: "Terapi umum: OAINS/aspirin + kolkisin (kecuali penyebab spesifik seperti TB).", viz: V_LAYER(["peri"], { rub: true }) },
    { title: "Efusi & tamponade", body: "Cairan menumpuk di rongga perikardium. Karena perikardium fibrosa tidak elastis (D2), penumpukan <b>cepat</b> → tekanan intraperikardial ↑ → ruang jantung tertekan → pengisian ↓ → <b>tamponade</b>: <b>Trias Beck</b> (hipotensi, JVP ↑, bunyi jantung menjauh), <b>pulsus paradoksus</b> (TD sistolik turun >10 mmHg saat inspirasi), EKG voltase rendah/electrical alternans. Terapi: <b>perikardiosentesis</b>.", key: "Coba simulator tamponade di bagian Interaksi.", viz: V_LAYER(["peri"], { fluid: 18 }) },
    { title: "Demam rematik akut", body: "<b>2–4 minggu setelah faringitis Streptococcus grup A</b>. Antibodi terhadap <b>protein M</b> bakteri bereaksi silang dengan jaringan tubuh (miosin, katup, sendi, otak) = <b>mimikri molekuler</b>. Muncul karditis, poliartritis migrans, korea Sydenham, nodul subkutan, eritema marginatum. Diagnosis: <b>kriteria Jones</b> + bukti infeksi GAS (ASTO ↑, kultur/antigen).", key: "Bukan infeksi langsung di jantung — melainkan reaksi imun.", viz: V_LAYER(["peri", "myo", "endo", "valve"]) },
    { title: "Penyakit jantung reumatik (kronik)", body: "Serangan berulang → katup <b>menebal, komisura menyatu, korda memendek, kalsifikasi</b>. <b>Katup mitral paling sering</b> (stenosis mitral “mulut ikan”), lalu aorta. Pencegahan: <b>primer</b> = obati faringitis GAS dengan penisilin; <b>sekunder</b> = <b>benzatin penisilin G</b> IM setiap 3–4 minggu selama bertahun-tahun.", key: "PJR masih penyebab utama penyakit katup pada orang muda di negara berkembang (C6).", viz: V_LAYER(["valve", "endo"], { thick: true, ra: true }) },
  ];

  registerModule({
    id: "c05",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Radang di tiga lapisan jantung", emoji: "💡", html: `
          <p>Dari D3 kamu tahu dinding jantung punya 3 lapis. Radang di tiap lapis memberi gejala sesuai fungsinya:</p>
          <div class="table-wrap"><table class="table"><thead><tr><th>Lapisan</th><th>Penyakit</th><th>Masalah utama</th></tr></thead><tbody>
            <tr><td>Endokardium & katup</td><td>Endokarditis infektif</td><td>Vegetasi → katup rusak + emboli</td></tr>
            <tr><td>Miokardium</td><td>Miokarditis</td><td>Pompa lemah + aritmia</td></tr>
            <tr><td>Perikardium</td><td>Perikarditis</td><td>Nyeri dada, efusi, tamponade</td></tr>
            <tr><td>Semua lapis</td><td>Demam rematik → PJR</td><td>Reaksi imun pasca-GAS → katup rusak permanen</td></tr></tbody></table></div>
          <p class="small muted">Level SKDI: 2 (diagnosis klinis & merujuk).</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Melihat lapisan yang terkena", emoji: "🎬", intro: "Lapisan yang meradang disorot. Perhatikan vegetasi, infiltrat sel radang, cairan, dan katup yang menebal.",
          viz: V_LAYER([]), steps: STEPS, autoplayMs: 7500 },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Faringitis → katup mitral rusak", nodes: ["Faringitis Streptococcus grup A tidak diobati", "Sistem imun membentuk antibodi & sel T terhadap protein M", "Protein M mirip miosin & glikoprotein katup (mimikri molekuler)", "Reaksi silang → radang katup (valvulitis) & badan Aschoff", "Serangan berulang → fibrosis, fusi komisura → stenosis mitral"] },
            { label: "Vegetasi → stroke & ginjal", nodes: ["Vegetasi rapuh di katup sisi kiri (mitral/aorta)", "Potongan vegetasi lepas ke sirkulasi sistemik", "Emboli menyumbat arteri otak, ginjal, limpa, kulit", "Stroke, infark ginjal/limpa, Janeway lesion", "Kompleks imun juga menyebabkan glomerulonefritis, Osler node, Roth spot"] },
            { label: "Mengapa nyeri perikarditis membaik saat duduk condong?", nodes: ["Lapisan perikardium yang meradang saling bergesekan", "Berbaring & inspirasi menambah tekanan/kontak di perikardium yang dipersarafi n. frenikus", "Duduk condong ke depan menjauhkan jantung dari perikardium posterior", "Gesekan & tarikan berkurang", "Nyeri mereda — pola khas yang membedakan dari angina"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Kalkulator kriteria Jones (demam rematik)", emoji: "🧮", html: `
          <p>Centang temuan pasien. Diagnosis serangan pertama: <b>bukti infeksi GAS</b> + <b>2 mayor</b> atau <b>1 mayor + 2 minor</b>.</p>
          <div class="two-col"><div><b>Mayor</b><div class="toggle-row" id="jm"></div></div><div><b>Minor</b><div class="toggle-row" id="jn"></div></div></div>
          <div class="toggle-row"><button class="btn btn-sm" id="jg" type="button">🦠 Bukti infeksi GAS (ASTO ↑ / kultur / antigen)</button></div>
          <div class="callout" id="j-msg"></div>
          <p class="small muted">Versi populasi risiko rendah (AHA 2015). Pada populasi risiko sedang–tinggi (termasuk Indonesia), monoartritis/poliartralgia dapat dihitung mayor dan ambang minor lebih rendah.</p>`,
          init(el) {
            const MJ = ["❤️ Karditis", "🦵 Poliartritis migrans", "💃 Korea Sydenham", "🔴 Eritema marginatum", "🟤 Nodul subkutan"];
            const MN = ["Poliartralgia", "Demam ≥38,5 °C", "LED ≥60 / CRP ≥3 mg/dL", "Interval PR memanjang"];
            const a = new Set(), b = new Set(); let gas = false;
            K.$("#jm", el).innerHTML = MJ.map((t, i) => `<button class="btn btn-sm" data-i="${i}" type="button">${t}</button>`).join("");
            K.$("#jn", el).innerHTML = MN.map((t, i) => `<button class="btn btn-sm" data-i="${i}" type="button">${t}</button>`).join("");
            const tog = (set, i) => set.has(i) ? set.delete(i) : set.add(i);
            K.$$("#jm button", el).forEach((x) => x.addEventListener("click", () => { tog(a, +x.dataset.i); upd(); }));
            K.$$("#jn button", el).forEach((x) => x.addEventListener("click", () => { tog(b, +x.dataset.i); upd(); }));
            K.$("#jg", el).addEventListener("click", () => { gas = !gas; upd(); });
            function upd() {
              K.$$("#jm button", el).forEach((x) => x.classList.toggle("on", a.has(+x.dataset.i)));
              K.$$("#jn button", el).forEach((x) => x.classList.toggle("on", b.has(+x.dataset.i)));
              K.$("#jg", el).classList.toggle("on", gas);
              // aturan: artralgia tidak dihitung minor bila poliartritis mayor; PR memanjang tidak dihitung bila karditis
              let nMin = b.size; if (a.has(1) && b.has(0)) nMin--; if (a.has(0) && b.has(3)) nMin--;
              const ok = gas && (a.size >= 2 || (a.size === 1 && nMin >= 2));
              const m = K.$("#j-msg", el);
              m.className = ok ? "callout red" : "callout";
              m.innerHTML = `<p>Mayor: <b>${a.size}</b> · Minor dihitung: <b>${nMin}</b> · Bukti GAS: <b>${gas ? "ya" : "belum"}</b><br>${ok ? "✅ <b>Memenuhi kriteria Jones</b> → demam rematik akut." : !gas && (a.size >= 2 || (a.size === 1 && nMin >= 2)) ? "Kriteria klinis terpenuhi, tetapi <b>butuh bukti infeksi GAS</b>." : "Belum memenuhi kriteria."}${a.has(1) && b.has(0) ? "<br><i>Poliartralgia tidak dihitung minor bila poliartritis sudah dihitung mayor.</i>" : ""}${a.has(0) && b.has(3) ? "<br><i>PR memanjang tidak dihitung minor bila karditis sudah dihitung mayor.</i>" : ""}${a.has(2) ? "<br><i>Korea Sydenham saja sudah cukup untuk diagnosis (pengecualian).</i>" : ""}</p>`;
            }
            upd();
          } },
        { heading: "Kalkulator kriteria Duke (endokarditis infektif)", emoji: "🧮", html: `
          <div class="two-col"><div><b>Mayor</b><div class="toggle-row" id="dm"></div></div><div><b>Minor</b><div class="toggle-row" id="dn"></div></div></div>
          <div class="callout" id="d-msg"></div>`,
          init(el) {
            const MJ = ["🧫 Kultur darah positif mikroorganisme khas (≥2 set)", "🫀 Bukti endokardium: vegetasi/abses di ekokardiografi atau regurgitasi baru"];
            const MN = ["Predisposisi (katup rusak, IVDU)", "Demam ≥38 °C", "Fenomena vaskular (emboli, Janeway, perdarahan konjungtiva)", "Fenomena imunologis (Osler, Roth, glomerulonefritis)", "Bukti mikrobiologis yang tidak memenuhi mayor"];
            const a = new Set(), b = new Set();
            K.$("#dm", el).innerHTML = MJ.map((t, i) => `<button class="btn btn-sm" data-i="${i}" type="button">${t}</button>`).join("");
            K.$("#dn", el).innerHTML = MN.map((t, i) => `<button class="btn btn-sm" data-i="${i}" type="button">${t}</button>`).join("");
            const tog = (s, i) => s.has(i) ? s.delete(i) : s.add(i);
            K.$$("#dm button", el).forEach((x) => x.addEventListener("click", () => { tog(a, +x.dataset.i); upd(); }));
            K.$$("#dn button", el).forEach((x) => x.addEventListener("click", () => { tog(b, +x.dataset.i); upd(); }));
            function upd() {
              K.$$("#dm button", el).forEach((x) => x.classList.toggle("on", a.has(+x.dataset.i)));
              K.$$("#dn button", el).forEach((x) => x.classList.toggle("on", b.has(+x.dataset.i)));
              const M = a.size, N = b.size;
              const def = M === 2 || (M === 1 && N >= 3) || N === 5, pos = !def && ((M === 1 && N >= 1) || N >= 3);
              const m = K.$("#d-msg", el); m.className = def ? "callout red" : pos ? "callout warn" : "callout";
              m.innerHTML = `<p>Mayor <b>${M}</b> · Minor <b>${N}</b> → <b>${def ? "IE PASTI (definite)" : pos ? "IE MUNGKIN (possible)" : "Belum memenuhi"}</b><br><span class="small">Pasti: 2 mayor, atau 1 mayor + 3 minor, atau 5 minor. Mungkin: 1 mayor + 1 minor, atau 3 minor.</span></p>`;
            }
            upd();
          } },
        { heading: "EKG: perikarditis vs STEMI", emoji: "📈", html: `
          <div class="two-col">
            <div><b>Perikarditis akut</b><div class="viz-wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${["I", "II", "V2", "V5"].map((l) => ecg(beat(.35, -.07, true), l)).join("")}${ecg(beat(-.15, .08, true), "aVR")}</div>
              <ul class="small"><li>Elevasi ST <b>difus</b> (banyak sadapan), bentuk <b>cekung</b></li><li><b>Depresi PR</b> (aVR: elevasi PR)</li><li>Tanpa gelombang Q, resiprokal hanya di aVR/V1</li></ul></div>
            <div><b>STEMI inferior</b><div class="viz-wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:4px">${["II", "III", "aVF"].map((l) => ecg(beat(.5, 0, false), l)).join("")}${["I", "aVL"].map((l) => ecg(beat(-.25, 0, false), l)).join("")}</div>
              <ul class="small"><li>Elevasi ST di <b>satu wilayah</b> arteri, bentuk <b>cembung</b></li><li><b>Depresi resiprokal</b> di sadapan berlawanan</li><li>Gelombang Q dapat muncul</li></ul></div>
          </div>` },
        { heading: "Simulator tamponade", emoji: "🎚️", html: `
          <p>Tambahkan cairan ke rongga perikardium. Bandingkan penumpukan <b>cepat</b> (trauma, ruptur) dan <b>lambat</b> (TB, keganasan).</p>
          <div class="toggle-row"><button class="btn btn-sm on" id="tp-fast" type="button">⚡ Cepat (akut)</button><button class="btn btn-sm" id="tp-slow" type="button">🐢 Lambat (kronik)</button></div>
          <div class="slider-row"><label for="tp-v">Volume cairan perikardium <output id="tp-v-o"></output></label><input type="range" id="tp-v" min="20" max="1500" step="10" value="40"></div>
          <div class="two-col"><div class="viz-wrap"><svg id="tp-svg" viewBox="0 0 220 200" role="img" aria-label="Jantung dengan efusi" style="max-width:280px;margin:auto"></svg></div>
            <div><div class="readouts"><div class="readout"><span>Tekanan intraperikardial</span><b id="tp-p"></b></div><div class="readout"><span>TD sistolik</span><b id="tp-bp"></b></div><div class="readout"><span>JVP</span><b id="tp-j"></b></div><div class="readout"><span>Pulsus paradoksus</span><b id="tp-pp"></b></div></div></div></div>
          <div class="callout" id="tp-msg"></div>`,
          init(el) {
            let fast = true; const v = K.$("#tp-v", el);
            K.$("#tp-fast", el).addEventListener("click", () => { fast = true; K.$("#tp-fast", el).classList.add("on"); K.$("#tp-slow", el).classList.remove("on"); upd(); });
            K.$("#tp-slow", el).addEventListener("click", () => { fast = false; K.$("#tp-slow", el).classList.add("on"); K.$("#tp-fast", el).classList.remove("on"); upd(); });
            function upd() {
              const V = +v.value, extra = Math.max(0, V - 50);
              const comp = fast ? 120 : 900;     // kurva tekanan–volume perikardium
              const P = Math.min(30, 0.5 + Math.pow(extra / comp, 2.2) * 15);
              const fill = K.clamp(1 - (P - 2) / 22, .2, 1);
              const sbp = Math.round(120 * (0.35 + .65 * fill)), jvp = Math.round(5 + P * .9), pp = Math.round(K.clamp((P - 5) * 1.2, 2, 30));
              K.$("#tp-v-o", el).textContent = V + " mL";
              const r = 34 + Math.min(40, V / 30);
              K.$("#tp-svg", el).innerHTML = `<circle cx="110" cy="100" r="${r + 20}" fill="#e9d8a6" stroke="var(--text-soft)" stroke-width="3"/><circle cx="110" cy="100" r="${r + 17}" fill="#fde68a"/>
                <path d="M110,${100 + 40 * fill} C${110 - 58 * fill},${100 + 10 * fill} ${110 - 50 * fill},${100 - 45 * fill} 110,${100 - 22 * fill} C${110 + 50 * fill},${100 - 45 * fill} ${110 + 58 * fill},${100 + 10 * fill} 110,${100 + 40 * fill} Z" fill="var(--primary)"/>
                <text class="svg-label small" x="110" y="196" text-anchor="middle">perikardium fibrosa + cairan</text>`;
              K.$("#tp-p", el).innerHTML = `${P.toFixed(0)}<small> mmHg</small>`; K.$("#tp-bp", el).innerHTML = `${sbp}<small> mmHg</small>`;
              K.$("#tp-j", el).innerHTML = `${jvp}<small> cmH₂O</small>`; K.$("#tp-pp", el).innerHTML = `${pp}<small> mmHg</small>`;
              const m = K.$("#tp-msg", el), tam = P > 12;
              m.className = tam ? "callout red" : P > 6 ? "callout warn" : "callout green";
              m.innerHTML = `<p>${tam ? `<b>Tamponade!</b> Tekanan perikardium menekan atrium & VKa → pengisian ↓ → SV & TD ↓ (A13), vena terbendung (JVP ↑), pulsus paradoksus ${pp} mmHg (>10). Perlu perikardiosentesis segera.` : P > 6 ? "Tekanan mulai naik — pengisian jantung mulai terganggu." : "Perikardium masih mampu menampung cairan."} ${fast ? "Pada penumpukan cepat, ±150–200 mL saja sudah bisa menyebabkan tamponade." : "Pada penumpukan lambat, perikardium sempat meregang sehingga dapat menampung >1 L sebelum tamponade."}</p>`;
            }
            v.addEventListener("input", upd); upd();
          } },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Mayor Jones “<b>J♥NES</b>”: <b>J</b>oints (poliartritis) · <b>♥</b> karditis · <b>N</b>odul subkutan · <b>E</b>ritema marginatum · <b>S</b>ydenham korea.</p></div>
            <div class="callout"><p class="mnemo">Tanda endokarditis “<b>FROM JANE</b>”: <b>F</b>ever · <b>R</b>oth spot · <b>O</b>sler node · <b>M</b>urmur · <b>J</b>aneway lesion · <b>A</b>nemia · <b>N</b>ail (splinter) hemorrhage · <b>E</b>mboli.</p></div>
            <div class="callout green"><p class="mnemo"><b>O</b>sler = <b>O</b>uch (nyeri, imunologis) · <b>J</b>aneway = <b>J</b>inak/tidak nyeri (vaskular/emboli).</p></div>
            <div class="callout warn"><p class="mnemo">Trias Beck “<b>3 D</b>”: <b>D</b>istant heart sounds · <b>D</b>istended neck veins (JVP ↑) · <b>D</b>ecreased BP.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Penyebab IE akut pada katup normal", "Staphylococcus aureus"], ["Penyebab IE subakut pasca prosedur gigi", "Streptococcus viridans"], ["Katup tersering pada IE pengguna narkoba suntik", "Trikuspid"], ["Penyebab miokarditis tersering", "Virus (coxsackie B, adenovirus, dll.)"], ["EKG khas perikarditis", "Elevasi ST difus cekung + depresi PR"], ["Terapi perikarditis idiopatik/viral", "OAINS/aspirin + kolkisin"], ["Pulsus paradoksus", "Penurunan TD sistolik >10 mmHg saat inspirasi"], ["Jeda faringitis GAS → demam rematik", "±2–4 minggu"], ["Katup tersering pada PJR", "Mitral (stenosis mitral)"], ["Profilaksis sekunder PJR", "Benzatin penisilin G IM tiap 3–4 minggu"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Tebak diagnosisnya sebelum membuka kartu.", note: "Untuk latihan penalaran klinis; tata laksana mengikuti pedoman & supervisi.",
          items: [
            { icon: "💉", title: "Pengguna narkoba suntik, demam tinggi, murmur pansistolik di parasternal kiri bawah yang makin keras saat inspirasi, nodul di paru", chain: ["Bakteremia S. aureus dari jarum", "Endokarditis katup trikuspid (sisi kanan)", "Emboli septik ke paru (bukan ke otak)"] },
            { icon: "🦷", title: "Pasien PJR, 3 minggu setelah cabut gigi: demam subfebris, lemah, splinter hemorrhage", chain: ["Bakteremia Strep viridans dari mulut", "Menempel di katup yang sudah rusak", "Endokarditis subakut → ambil kultur darah, ekokardiografi"] },
            { icon: "🤒", title: "Pemuda 20 tahun, 1 minggu setelah flu: nyeri dada, sesak, troponin ↑, koroner normal", chain: ["Infeksi virus", "Miokarditis akut", "Risiko gagal jantung & aritmia; batasi aktivitas berat"] },
            { icon: "🧒", title: "Anak 9 tahun, nyeri sendi berpindah-pindah, demam, riwayat radang tenggorok 3 minggu lalu, ASTO ↑", chain: ["Mimikri molekuler pasca-GAS", "Demam rematik akut (cek karditis!)", "Penisilin + antiinflamasi; mulai profilaksis sekunder"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Mekanisme kerusakan jantung pada demam rematik akut adalah…",
          options: ["Infeksi langsung bakteri di katup", "Reaksi silang imun (mimikri molekuler) antara protein M Streptococcus dan jaringan jantung", "Toksin difteri", "Emboli dari vegetasi"], answer: 1,
          explain: "Demam rematik adalah penyakit imunologis pasca-infeksi, bukan infeksi langsung pada jantung." },
        { q: "Nodul nyeri di ujung jari pada pasien endokarditis disebut…",
          options: ["Janeway lesion", "Osler node", "Roth spot", "Splinter hemorrhage"], answer: 1,
          explain: "Osler node = nodul nyeri (imunologis). Janeway lesion = makula tidak nyeri di telapak (vaskular/emboli)." },
        { q: "Nyeri dada tajam yang membaik saat duduk condong ke depan, EKG elevasi ST difus dengan depresi PR. Diagnosis paling mungkin…",
          options: ["STEMI anterior", "Perikarditis akut", "Diseksi aorta", "Emboli paru"], answer: 1,
          explain: "Pola nyeri posisional + elevasi ST difus cekung + depresi PR = khas perikarditis akut." },
        { q: "Mengapa 200 mL cairan perikardium yang menumpuk cepat bisa menyebabkan tamponade, sedangkan 1 L yang menumpuk lambat belum tentu?",
          options: ["Karena cairan cepat lebih kental", "Karena perikardium fibrosa butuh waktu untuk meregang; penumpukan cepat langsung menaikkan tekanan", "Karena cairan lambat diserap jantung", "Karena penumpukan lambat menurunkan HR"], answer: 1,
          explain: "Kurva tekanan–volume perikardium curam pada perubahan akut; pada penumpukan kronik, perikardium beradaptasi meregang." },
        { q: "Pencegahan sekunder penyakit jantung reumatik dilakukan dengan…",
          options: ["Aspirin dosis tinggi seumur hidup", "Benzatin penisilin G intramuskular berkala", "Kolkisin", "Vaksin influenza"], answer: 1,
          explain: "Mencegah infeksi GAS berulang yang memicu serangan demam rematik baru dan memperberat kerusakan katup." },
      ]},
    ],
  });
})();
