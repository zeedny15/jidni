/* Modul C1 — Kelainan Jantung Kongenital (Kuliah 6) */
(function () {
  const HEART = `<svg viewBox="0 0 420 300" role="img" aria-label="Skema jantung dengan defek">
    <rect class="ch" data-c="ra" x="40" y="80" width="165" height="72" rx="16" fill="var(--o2-poor)" opacity=".75"/>
    <rect class="ch" data-c="la" x="215" y="80" width="165" height="72" rx="16" fill="var(--o2-rich)" opacity=".75"/>
    <rect class="ch" data-c="rv" x="40" y="160" width="165" height="120" rx="20" fill="var(--o2-poor)" opacity=".9"/>
    <rect class="ch" data-c="lv" x="215" y="160" width="165" height="120" rx="20" fill="var(--o2-rich)" opacity=".9"/>
    <g class="svg-label small" style="fill:#fff;font-weight:700"><text x="122" y="122" text-anchor="middle">AK</text><text x="297" y="122" text-anchor="middle">AKi</text><text x="122" y="226" text-anchor="middle">VKa</text><text x="297" y="226" text-anchor="middle">VKi</text></g>
    <rect id="pa" x="10" y="20" width="24" height="210" rx="10" fill="var(--o2-poor)" opacity=".6"/><text class="svg-label small" x="6" y="14">a. pulmonalis → paru</text>
    <rect id="ps" x="8" y="196" width="28" height="12" fill="var(--text)" style="display:none"/>
    <rect id="ao" x="386" y="20" width="24" height="210" rx="10" fill="var(--o2-rich)" opacity=".6"/><text class="svg-label small" x="414" y="14" text-anchor="end">aorta → tubuh</text>
    <rect id="ao-ovr" x="196" y="20" width="28" height="160" rx="10" fill="var(--vein)" opacity=".75" style="display:none"/>
    <rect id="pda" x="34" y="44" width="352" height="12" rx="6" fill="var(--vein)" opacity=".7" style="display:none" data-info="pda"/>
    <text id="pda-t" class="svg-label small" x="210" y="40" text-anchor="middle" style="display:none">duktus arteriosus paten</text>
    <rect id="asd" x="200" y="100" width="20" height="30" rx="6" fill="var(--surface-2)" stroke="var(--warn)" stroke-width="2" style="display:none" data-info="asd"/>
    <rect id="vsd" x="200" y="168" width="20" height="30" rx="6" fill="var(--surface-2)" stroke="var(--warn)" stroke-width="2" style="display:none" data-info="vsd"/>
    <path id="sh-asd" d="M232,115 H188" fill="none"/><path id="sh-vsd" d="M232,183 H188" fill="none"/><path id="sh-pda" d="M380,50 H40" fill="none"/>
    <path id="sh-tof" d="M150,200 C180,190 205,175 210,60" fill="none"/>
    <g class="sh-layer"></g>
    <text id="load-t" class="svg-label small" x="210" y="296" text-anchor="middle"></text>
  </svg>`;

  const DEF = {
    none: { n: "Normal", murmur: "none", load: [], txt: "Tidak ada hubungan abnormal. Darah kanan & kiri terpisah." },
    vsd: { n: "VSD", murmur: "holo", load: ["la", "lv"], txt: "Lubang di septum ventrikel. Tekanan VKi > VKa → darah mengalir <b>VKi → VKa</b> saat sistol → paru kebanjiran → AKi & VKi kelebihan volume.", m: "Holosistolik, kasar, di <b>ICS 3–4 parasternal kiri</b>; sering disertai thrill." },
    asd: { n: "ASD", murmur: "ejection", load: ["ra", "rv"], txt: "Lubang di septum atrium. Darah <b>AKi → AK</b> → AK, VKa, dan a. pulmonalis kelebihan volume.", m: "Ejeksi sistolik lembut di <b>ICS 2 parasternal kiri</b> (aliran berlebih lewat katup pulmonal) + <b>split S2 lebar & menetap (fixed)</b>." },
    pda: { n: "PDA", murmur: "continuous", load: ["la", "lv"], txt: "Duktus arteriosus tetap terbuka. Tekanan aorta > a. pulmonalis sepanjang siklus → darah <b>aorta → a. pulmonalis</b> terus-menerus → paru & jantung kiri kelebihan volume.", m: "<b>Kontinu “seperti mesin”</b> (machinery) di infraklavikula kiri; tekanan nadi lebar." },
    tof: { n: "Tetralogi Fallot", murmur: "ejection", load: ["rv"], txt: "Stenosis pulmonal menghambat aliran ke paru → tekanan VKa tinggi → darah miskin O₂ dari VKa masuk aorta lewat VSD (<b>kanan → kiri</b>) → <b>sianosis</b>.", m: "Ejeksi sistolik di <b>ICS 2–3 parasternal kiri</b> karena <b>stenosis pulmonal</b> (makin berat stenosis, murmur makin pendek)." },
  };

  function makeHeart(root, secEl) {
    const svg = K.$("svg", root), fl = K.flow(K.$(".sh-layer", svg));
    K.loop(secEl, (dt) => fl.tick(dt));
    return function set(d, pvr = 1) {
      const D = DEF[d];
      const eis = d !== "tof" && d !== "none" && pvr >= 6;
      ["asd", "vsd", "pda", "pda-t"].forEach((id) => K.$("#" + id, svg).style.display = d === id.replace("-t", "") || (d === "tof" && id === "vsd") ? "" : "none");
      K.$("#ps", svg).style.display = d === "tof" ? "" : "none";
      K.$("#ao-ovr", svg).style.display = d === "tof" ? "" : "none";
      K.$$(".ch", svg).forEach((c) => { const L = (eis ? (d === "asd" ? ["ra", "rv"] : ["rv"]) : D.load).includes(c.dataset.c); c.setAttribute("stroke", L ? K.css("--warn") : "none"); c.setAttribute("stroke-width", L ? 6 : 0); });
      const rvT = d === "tof" || eis; const rv = K.$('[data-c="rv"]', svg); if (rvT) { rv.setAttribute("stroke", K.css("--text")); rv.setAttribute("stroke-width", 10); }
      const qpqs = d === "none" ? 1 : d === "tof" ? 0.6 : eis ? 0.8 : 1 + 1.6 * (1 - (pvr - 1) / 5);
      K.$("#pa", svg).setAttribute("width", 14 + 10 * qpqs); K.$("#pa", svg).setAttribute("x", 22 - (14 + 10 * qpqs) / 2);
      const pathId = d === "tof" ? "sh-tof" : "sh-" + d;
      const rev = eis;
      if (d === "none") fl.set([]);
      else {
        const p = K.$("#" + pathId, svg);
        const reversedPath = { "sh-asd": "M188,115 H232", "sh-vsd": "M188,183 H232", "sh-pda": "M40,50 H380" }[pathId];
        if (rev) p.setAttribute("d", reversedPath); else p.setAttribute("d", { "sh-asd": "M232,115 H188", "sh-vsd": "M232,183 H188", "sh-pda": "M380,50 H40", "sh-tof": "M150,200 C180,190 205,175 210,60" }[pathId]);
        fl.set([{ el: p, color: d === "tof" || rev ? K.css("--o2-poor") : K.css("--o2-rich"), n: 4, speed: d === "pda" ? 120 : 40, r: 5 }]);
      }
      K.$("#load-t", svg).textContent = d === "none" ? "" : eis ? "Sindrom Eisenmenger: shunt berbalik kanan → kiri" : d === "tof" ? "garis hitam tebal = hipertrofi VKa · ungu = aorta menunggang" : "garis oranye = ruang yang kelebihan volume";
      return { qpqs, cyan: d === "tof" || eis, eis };
    };
  }

  const STEPS = [
    { title: "Peta besar: shunt kiri→kanan vs kanan→kiri", body: "Jantung kiri bertekanan lebih tinggi. Jika ada lubang, darah normalnya mengalir <b>kiri → kanan</b> → paru kebanjiran, bayi <b>tidak biru</b> (asianotik): <b>VSD, ASD, PDA</b>. Jika ada hambatan di kanan, darah mengalir <b>kanan → kiri</b> → darah miskin O₂ masuk sistemik → bayi <b>biru</b> (sianotik): <b>Tetralogi Fallot</b>.", key: "Tanya selalu: ke mana arah shunt, dan ruang mana yang kelebihan beban?", d: "none" },
    { title: "VSD (Ventricular Septal Defect)", body: "Kelainan jantung bawaan <b>tersering</b>; paling sering di bagian <b>membranosa/perimembranosa</b> (D1). Darah VKi → VKa saat sistol → aliran paru ↑ → darah balik ke AKi & VKi ↑ → <b>beban volume jantung kiri</b>. VSD kecil bisa menutup spontan; VSD besar → gagal jantung, gagal tumbuh.", key: "VSD kecil justru murmurnya keras (gradien tekanan besar).", d: "vsd" },
    { title: "ASD (Atrial Septal Defect)", body: "Tipe tersering: <b>ostium sekundum</b> (D1). Darah AKi → AK → <b>beban volume jantung kanan</b> & paru. Sering tanpa gejala sampai dewasa. Ciri auskultasi: <b>split S2 lebar dan menetap</b> (tidak berubah dengan napas) karena VKa selalu kelebihan volume.", key: "Split S2 menetap (fixed split) = kata kunci ASD.", d: "asd" },
    { title: "PDA (Patent Ductus Arteriosus)", body: "Duktus arteriosus gagal menutup setelah lahir (D1) — sering pada <b>bayi prematur</b> dan <b>rubela kongenital</b>. Aliran aorta → a. pulmonalis terjadi saat sistol <b>dan</b> diastol → murmur <b>kontinu</b>; diastolik aorta turun → <b>tekanan nadi lebar</b>, nadi keras (bounding).", key: "Prematur: ditutup dengan indometasin/ibuprofen (menghambat prostaglandin).", d: "pda" },
    { title: "Tetralogi Fallot (ToF)", body: "Empat komponen akibat <b>septum infundibular bergeser ke anterior</b>: ① <b>stenosis pulmonal</b> (obstruksi alur keluar VKa), ② <b>VSD</b>, ③ <b>aorta menunggang</b> (overriding), ④ <b>hipertrofi VKa</b>. Derajat sianosis ditentukan terutama oleh beratnya stenosis pulmonal.", key: "Kelainan jantung bawaan sianotik tersering setelah masa neonatus. Foto toraks: jantung “sepatu bot”.", d: "tof" },
    { title: "Spell sianotik & posisi jongkok (squatting)", body: "Saat menangis/beraktivitas, resistensi sistemik turun atau spasme infundibulum → shunt kanan→kiri ↑ → sianosis mendadak (<b>tet spell</b>). Anak secara naluriah <b>jongkok</b>: arteri femoralis tertekuk → <b>resistensi sistemik ↑</b> → shunt kanan→kiri ↓ → lebih banyak darah ke paru.", key: "Jongkok = menaikkan afterload kiri untuk “mendorong” darah ke paru.", d: "tof" },
    { title: "Sindrom Eisenmenger", body: "Shunt kiri→kanan yang besar dan lama (VSD, ASD, PDA) membuat pembuluh paru menebal → <b>resistensi paru ↑ (hipertensi pulmonal)</b>. Saat tekanan kanan melampaui kiri, shunt <b>berbalik kanan→kiri</b> → sianosis, jari tabuh, polisitemia. Kondisi ini umumnya ireversibel.", key: "Itu sebabnya defek besar perlu ditutup sebelum resistensi paru menetap. Coba slider di bagian Interaksi.", d: "vsd", pvr: 8 },
  ];

  registerModule({
    id: "c01",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Ketika pembentukan jantung tidak sempurna", emoji: "💡", html: `
          <p>Di D1 kamu melihat langkah pembentukan sekat dan penutupan jalan pintas janin. Kelainan jantung kongenital = <b>salah satu langkah itu gagal</b>.</p>
          <div class="table-wrap"><table class="table"><thead><tr><th>Kelainan</th><th>Langkah yang gagal</th><th>Arah shunt</th><th>Sianosis?</th></tr></thead><tbody>
            <tr><td><b>VSD</b></td><td>Septum IV (bagian membranosa)</td><td>Kiri → kanan</td><td>Tidak*</td></tr>
            <tr><td><b>ASD</b></td><td>Septum atrium (ostium sekundum)</td><td>Kiri → kanan</td><td>Tidak*</td></tr>
            <tr><td><b>PDA</b></td><td>Penutupan duktus arteriosus</td><td>Aorta → a. pulmonalis</td><td>Tidak*</td></tr>
            <tr><td><b>Tetralogi Fallot</b></td><td>Pergeseran septum infundibular</td><td>Kanan → kiri</td><td><b>Ya</b></td></tr></tbody></table></div>
          <p class="small muted">*Bisa menjadi sianotik bila terjadi sindrom Eisenmenger. Level SKDI: 2 (mendiagnosis & merujuk).</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Melihat aliran shunt", emoji: "🎬", intro: "Partikel menunjukkan arah aliran abnormal. Garis oranye = ruang yang kelebihan volume. Klik defek untuk penjelasan.",
          viz: HEART + `<div class="btn-row" style="margin-top:8px"><button class="btn btn-sm" id="ex-snd" type="button">🔊 Dengarkan murmurnya</button><span class="small muted" id="ex-m"></span></div>`,
          steps: STEPS, autoplayMs: 7000,
          info: { asd: ["ASD", "Lubang di septum atrium; tipe sekundum tersering."], vsd: ["VSD", "Lubang di septum ventrikel; perimembranosa tersering."], pda: ["PDA", "Duktus arteriosus yang tetap terbuka."] },
          onStep(i, s, api) { api._set(s.d, s.pvr || 1); api._d = s.d; K.$("#ex-m", api.viz).innerHTML = DEF[s.d].m ? "Murmur: " + DEF[s.d].m : ""; },
          init(api, secEl) {
            api._set = makeHeart(api.viz, secEl);
            K.$("#ex-snd", api.viz).addEventListener("click", () => K.playMurmur(DEF[api._d].murmur, { split: api._d === "asd", beats: 4 }));
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "VSD besar → gagal jantung bayi", nodes: ["Resistensi paru turun beberapa minggu setelah lahir", "Shunt VKi → VKa makin besar", "Aliran paru bisa 2–3× aliran sistemik (Qp:Qs ↑)", "AKi & VKi menerima volume berlebih → dilatasi", "Bayi sesak, berkeringat saat menyusu, gagal tumbuh"] },
            { label: "Mengapa split S2 menetap pada ASD?", nodes: ["Normalnya inspirasi menambah aliran ke kanan → P2 terlambat (A9)", "Pada ASD, aliran ke VKa sudah selalu besar karena shunt", "Saat inspirasi, aliran balik vena ↑ tetapi shunt AKi→AK berkurang (saling mengimbangi)", "Volume VKa hampir sama di inspirasi maupun ekspirasi", "P2 selalu terlambat → split lebar & menetap"] },
            { label: "Mengapa anak ToF jongkok?", nodes: ["Saat aktivitas, resistensi sistemik turun", "Darah VKa lebih mudah lari ke aorta (kanan→kiri) daripada melewati stenosis pulmonal", "Sianosis memburuk", "Jongkok menekuk a. femoralis → resistensi sistemik ↑ & aliran balik vena berubah", "Shunt kanan→kiri ↓ → lebih banyak darah ke paru → sianosis membaik"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator shunt", emoji: "🎚️", html: `
          <p>Pilih kelainan, lalu naikkan <b>resistensi pembuluh paru</b>. Amati arah shunt, rasio aliran paru:sistemik (Qp:Qs), dan sianosis.</p>
          <div class="toggle-row" id="cs-btns"></div>
          <div class="slider-row"><label for="cs-pvr">Resistensi pembuluh paru <output id="cs-pvr-o"></output></label><input type="range" id="cs-pvr" min="1" max="10" step=".5" value="1"></div>
          <div id="cs-heart" class="viz-wrap"></div>
          <div class="readouts"><div class="readout"><span>Arah shunt</span><b id="cs-dir" style="font-size:1rem"></b></div><div class="readout"><span>Qp : Qs</span><b id="cs-q"></b></div><div class="readout"><span>Sianosis</span><b id="cs-cy"></b></div></div>
          <div class="btn-row"><button class="btn btn-sm" id="cs-snd" type="button">🔊 Dengarkan murmur</button></div>
          <div class="callout" id="cs-msg"></div>`,
          init(el, secEl) {
            K.$("#cs-heart", el).innerHTML = HEART;
            const set = makeHeart(K.$("#cs-heart", el), secEl); let d = "vsd";
            K.$("#cs-btns", el).innerHTML = Object.entries(DEF).map(([k, v]) => `<button class="btn btn-sm" data-k="${k}" type="button">${v.n}</button>`).join("");
            K.$$("#cs-btns button", el).forEach((b) => b.addEventListener("click", () => { d = b.dataset.k; upd(); }));
            const pvr = K.$("#cs-pvr", el);
            function upd() {
              K.$$("#cs-btns button", el).forEach((b) => b.classList.toggle("on", b.dataset.k === d));
              const r = set(d, +pvr.value);
              K.$("#cs-pvr-o", el).textContent = (+pvr.value).toFixed(1).replace(".", ",") + "× normal";
              K.$("#cs-dir", el).textContent = d === "none" ? "—" : d === "tof" || r.eis ? "Kanan → kiri" : "Kiri → kanan";
              K.$("#cs-q", el).textContent = r.qpqs.toFixed(1).replace(".", ",") + " : 1";
              K.$("#cs-cy", el).textContent = r.cyan ? "Ya 💙" : "Tidak";
              const m = K.$("#cs-msg", el);
              m.className = r.cyan ? "callout red" : d === "none" ? "callout" : "callout warn";
              m.innerHTML = `<p>${DEF[d].txt}${DEF[d].m ? "<br><b>Murmur:</b> " + DEF[d].m : ""}${r.eis ? "<br><b>Eisenmenger:</b> resistensi paru kini melebihi sistemik — shunt berbalik, murmur shunt melemah, P2 keras. " + (d === "pda" ? "Pada PDA terjadi <b>sianosis diferensial</b> (kaki biru, tangan merah muda) karena darah kanan masuk aorta desendens." : "") : ""}${d === "tof" ? "<br>Resistensi paru tidak banyak berpengaruh — hambatan utamanya stenosis pulmonal." : ""}</p>`;
            }
            pvr.addEventListener("input", upd);
            K.$("#cs-snd", el).addEventListener("click", () => K.playMurmur(DEF[d].murmur, { split: d === "asd", beats: 4 }));
            upd();
          } },
        { type: "match", heading: "Kata kunci → kelainan", emoji: "🧩", intro: "Ketuk kata kunci, lalu kelainannya.",
          pairs: [["Murmur kontinu seperti mesin, tekanan nadi lebar", "PDA"], ["Split S2 lebar & menetap", "ASD"], ["Murmur holosistolik kasar di parasternal kiri bawah", "VSD"], ["Sianosis, jongkok, jantung sepatu bot", "Tetralogi Fallot"], ["Shunt berbalik akibat hipertensi pulmonal", "Sindrom Eisenmenger"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Komponen ToF “<b>PROV</b>e”: <b>P</b>ulmonal stenosis · <b>R</b>ight ventricular hypertrophy · <b>O</b>verriding aorta · <b>V</b>SD.</p></div>
            <div class="callout"><p class="mnemo">Asianotik “<b>3D</b>” = 3 <b>D</b>efek “kiri ke kanan”: <b>V</b>SD · <b>A</b>SD · <b>P</b>DA → “<b>VAP</b> tidak biru”.</p></div>
            <div class="callout green"><p class="mnemo">Bunyi khas: <b>V</b>SD = <b>V</b>ertikal penuh (holosistolik) · <b>A</b>SD = <b>A</b>badi split (fixed) · <b>P</b>DA = <b>P</b>abrik/mesin (kontinu).</p></div>
            <div class="callout warn"><p class="mnemo">ASD → beban <b>kanan</b> (AK, VKa) · VSD & PDA → beban <b>kiri</b> (AKi, VKi). “<b>A</b>trium bocor, <b>A</b>wasi kanan.”</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Kelainan jantung bawaan tersering", "VSD (perimembranosa)"], ["Tipe ASD tersering", "Ostium sekundum"], ["Murmur PDA", "Kontinu (machinery), infraklavikula kiri"], ["Faktor risiko PDA", "Prematuritas, rubela kongenital"], ["Obat menutup PDA pada prematur", "Indometasin / ibuprofen (penghambat COX)"], ["Obat mempertahankan PDA terbuka", "Prostaglandin E₁ (alprostadil)"], ["4 komponen ToF", "Stenosis pulmonal, VSD, aorta overriding, hipertrofi VKa"], ["Penentu derajat sianosis ToF", "Beratnya stenosis pulmonal"], ["Mengapa anak ToF jongkok?", "Resistensi sistemik ↑ → shunt kanan→kiri ↓"], ["Sindrom Eisenmenger", "Shunt kiri→kanan lama → hipertensi pulmonal → shunt berbalik → sianosis"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Baca kasusnya, tebak diagnosis dan mekanismenya, lalu buka kartu.", note: "Kasus untuk latihan penalaran. Penegakan diagnosis memakai ekokardiografi; tata laksana mengikuti spesialis.",
          items: [
            { icon: "👶", title: "Bayi 2 bulan sulit menyusu, berkeringat, murmur holosistolik kasar di parasternal kiri bawah", chain: ["Resistensi paru menurun setelah lahir → shunt besar", "VSD dengan shunt kiri→kanan besar", "Gagal jantung kongestif → gagal tumbuh"] },
            { icon: "👩", title: "Perempuan 30 tahun mudah lelah, split S2 menetap, EKG RBBB inkomplet", chain: ["Beban volume jantung kanan bertahun-tahun", "ASD sekundum yang baru terdeteksi saat dewasa", "Risiko aritmia atrium & hipertensi pulmonal bila tidak ditutup"] },
            { icon: "🍼", title: "Bayi prematur 30 minggu, nadi keras, murmur kontinu", chain: ["Duktus arteriosus belum menutup (PGE₂ masih tinggi, respons O₂ belum matang)", "PDA dengan aliran aorta → a. pulmonalis", "Dapat dicoba indometasin/ibuprofen"] },
            { icon: "🧒", title: "Anak 3 tahun biru, jari tabuh, suka jongkok setelah bermain", chain: ["Obstruksi alur keluar VKa + VSD", "Shunt kanan→kiri → hipoksemia kronik, polisitemia", "Tetralogi Fallot; spell diatasi dengan posisi lutut-dada, O₂, dan rujukan"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Pada ASD tanpa komplikasi, ruang jantung yang mengalami beban volume terutama adalah…",
          options: ["Atrium kiri dan ventrikel kiri", "Atrium kanan dan ventrikel kanan", "Hanya aorta", "Ventrikel kiri saja"], answer: 1,
          explain: "Darah mengalir dari AKi ke AK, lalu melewati VKa dan a. pulmonalis — semuanya di sisi kanan." },
        { q: "Murmur kontinu “seperti mesin” disertai tekanan nadi lebar paling khas untuk…",
          options: ["VSD", "ASD", "PDA", "Tetralogi Fallot"], answer: 2,
          explain: "Tekanan aorta > a. pulmonalis baik saat sistol maupun diastol → aliran dan murmur kontinu; kebocoran saat diastol menurunkan tekanan diastolik." },
        { q: "Mengapa anak dengan Tetralogi Fallot merasa lebih baik saat jongkok?",
          options: ["Jongkok menurunkan resistensi sistemik", "Jongkok menaikkan resistensi sistemik sehingga shunt kanan→kiri berkurang", "Jongkok melebarkan stenosis pulmonal", "Jongkok menutup VSD"], answer: 1,
          explain: "Resistensi sistemik ↑ membuat darah VKa lebih banyak menuju a. pulmonalis daripada ke aorta lewat VSD." },
        { q: "Seorang pasien VSD besar yang tidak diobati menjadi sianotik di usia remaja. Mekanismenya adalah…",
          options: ["VSD menutup spontan", "Hipertensi pulmonal menyebabkan shunt berbalik menjadi kanan→kiri (Eisenmenger)", "Terjadi PDA baru", "Katup aorta menyempit"], answer: 1,
          explain: "Aliran paru berlebih jangka panjang memicu remodeling arteriol paru → resistensi paru > sistemik → shunt berbalik." },
        { q: "Sianosis diferensial (kaki biru, tangan merah muda) paling khas pada…",
          options: ["ASD dengan Eisenmenger", "PDA dengan Eisenmenger", "VSD kecil", "Tetralogi Fallot"], answer: 1,
          explain: "Pada PDA, darah miskin O₂ dari a. pulmonalis masuk aorta di distal a. subklavia kiri, sehingga tubuh bagian bawah lebih biru." },
      ]},
    ],
  });
})();
