/* Modul B4 — Resistensi Perifer */
(function () {
  const etaFromHt = (ht) => Math.exp(0.025 * (ht - 45));
  const R = (r, L, eta) => eta * L / Math.pow(r, 4);          // relatif terhadap normal (=1)

  const VIZ = `<svg viewBox="0 0 420 210" role="img" aria-label="Aliran melalui tabung">
    <text class="svg-label small" x="10" y="20">ΔP tetap (tekanan masuk – keluar)</text>
    <rect x="6" y="40" width="40" height="120" rx="8" fill="var(--o2-rich)" opacity=".3"/><text class="svg-label small" x="26" y="176" text-anchor="middle">P tinggi</text>
    <rect id="r4-tube" x="46" y="70" width="320" height="60" fill="var(--o2-rich)" opacity=".18" stroke="var(--o2-rich)"/>
    <rect x="370" y="80" width="40" height="40" rx="8" fill="var(--o2-poor)" opacity=".3"/><text class="svg-label small" x="390" y="140" text-anchor="middle">P rendah</text>
    <g id="r4-parts"></g>
    <text id="r4-f" class="svg-label" x="210" y="196" text-anchor="middle" style="font-size:13px"></text>
  </svg>
  <div class="readouts"><div class="readout"><span>Resistensi (relatif)</span><b id="r4-R"></b></div><div class="readout big"><span>Aliran (relatif)</span><b id="r4-Q"></b></div></div>`;

  const STEPS = [
    { title: "Aliran = beda tekanan ÷ resistensi", body: "Seperti hukum Ohm: <b>Q = ΔP / R</b>. Darah mengalir karena ada <b>beda tekanan</b>; <b>resistensi</b> adalah hambatannya. Dengan ΔP yang sama, resistensi lebih besar → aliran lebih kecil.", key: "Untuk seluruh sirkulasi: CO = MAP / TPR  ⇔  MAP = CO × TPR (B3).", p: [1, 1, 45] },
    { title: "Hukum Poiseuille", body: "<div class='callout red'><p style='text-align:center;font-size:1.1rem'><b>R = 8 η L / (π r⁴)</b></p></div>Resistensi naik bila darah lebih <b>kental</b> (η), pembuluh lebih <b>panjang</b> (L), dan — paling penting — pembuluh lebih <b>sempit</b> (r).", key: "Jari-jari dipangkatkan 4!", p: [1, 1, 45] },
    { title: "Jari-jari: faktor terkuat", body: "Jika jari-jari tinggal <b>setengah</b>, resistensi menjadi 2⁴ = <b>16×</b> lipat dan aliran tinggal 1/16. Inilah mengapa sedikit vasokonstriksi atau vasodilatasi arteriol sangat besar pengaruhnya.", key: "r ↓ 50% → R ×16 → Q ÷16.", p: [0.5, 1, 45] },
    { title: "Panjang pembuluh", body: "Pembuluh 2× lebih panjang → resistensi 2×. Namun panjang pembuluh di tubuh relatif tetap (kecuali bertambah saat tubuh tumbuh atau berat badan naik banyak).", key: "Pengaruh panjang linear, bukan pangkat 4.", p: [1, 2, 45] },
    { title: "Viskositas darah", body: "Viskositas terutama ditentukan oleh <b>hematokrit</b>. Polisitemia (Ht tinggi) → darah kental → resistensi ↑. Anemia (Ht rendah) → darah encer → resistensi ↓.", key: "Viskositas juga relatif stabil — tidak dipakai untuk regulasi cepat.", p: [1, 1, 65] },
    { title: "Resistensi perifer total (TPR)", body: "TPR adalah resistensi gabungan seluruh pembuluh sistemik. Sumbangan terbesar dari <b>arteriol</b>, karena kecil dan ototnya dapat mengubah diameter. Saraf simpatis, hormon, dan zat lokal mengatur TPR dengan mengatur jari-jari arteriol.", key: "Mengatur TPR = mengatur r arteriol.", p: [0.84, 1, 45] },
    { title: "Organ tersusun paralel", body: "Arteri ke otak, jantung, ginjal, usus, otot, dan kulit bercabang <b>paralel</b> dari aorta. Pada susunan paralel, resistensi total <b>lebih kecil</b> dari resistensi cabang mana pun, dan aliran ke tiap organ bisa diatur <b>sendiri-sendiri</b>.", key: "1/R total = 1/R₁ + 1/R₂ + … (lihat simulator organ).", p: [1, 1, 45] },
    { title: "Laminar vs turbulen", body: "Normalnya aliran <b>laminar</b> (berlapis, sunyi). Pada kecepatan tinggi, penyempitan mendadak, atau darah encer, aliran menjadi <b>turbulen</b> (berpusar, berbunyi) — dasar bunyi bruit, murmur, dan Korotkoff.", key: "Turbulensi = energi terbuang + bunyi.", p: [0.6, 1, 30] },
  ];

  registerModule({
    id: "b04",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Hambatan terhadap aliran", emoji: "💡", html: `
          <p>Di B3: <b>MAP = CO × TPR</b>. Sekarang kita bedah <b>TPR (total peripheral resistance)</b> — hambatan yang harus dilawan darah saat mengalir dari arteri ke vena.</p>
          <ul class="key-points">
            <li><span class="k-ico">📏</span><span>Resistensi ditentukan oleh <b>jari-jari</b>, <b>panjang</b>, dan <b>kekentalan</b> (hukum Poiseuille).</span></li>
            <li><span class="k-ico">🔑</span><span><b>Jari-jari</b> adalah faktor paling kuat dan paling mudah diubah tubuh.</span></li>
            <li><span class="k-ico">🚦</span><span>Tempat pengaturan utamanya: <b>arteriol</b> (B1, B2).</span></li>
          </ul>
          <div class="callout"><p>Analogi: minum lewat sedotan. Sedotan kecil (r ↓) jauh lebih berat daripada sedotan panjang (L ↑), dan jus kental (η ↑) lebih berat daripada air.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Bermain dengan tabung", emoji: "🧪", intro: "Lihat bagaimana bentuk tabung dan kekentalan darah memengaruhi jumlah partikel yang mengalir.",
          viz: VIZ, steps: STEPS,
          onStep(i, s, api) { api._p = s.p; api._turb = i === 7; },
          init(api, secEl) {
            const v = api.viz, NS = "http://www.w3.org/2000/svg", g = K.$("#r4-parts", v), parts = [];
            for (let i = 0; i < 50; i++) { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", 3.5); g.appendChild(c); parts.push({ c, x: Math.random(), y: Math.random() * 2 - 1, ph: Math.random() * 6 }); }
            K.loop(secEl, (dt) => {
              if (!api._p) return;
              const [r, L, ht] = api._p, eta = etaFromHt(ht), Rr = R(r, L, eta), Q = 1 / Rr;
              const h = 60 * r, len = 320 * Math.min(L, 1.15) / 1.15 * (L >= 1 ? 1 : 1), tube = K.$("#r4-tube", v);
              tube.setAttribute("height", h); tube.setAttribute("y", 100 - h / 2); tube.setAttribute("width", 320);
              const op = K.clamp(.3 + (ht - 20) / 60 * .7, .3, 1);
              const nVis = Math.round(K.clamp(50 * Math.pow(r, 2) * Math.min(1, Math.sqrt(Q) + .1), 6, 50));
              const speed = 120 * Q / (r * r) / L;   // kecepatan rata-rata ~ Q/A
              parts.forEach((p, i) => {
                const on = i < nVis; p.c.style.display = on ? "" : "none"; if (!on) return;
                const prof = 1 - p.y * p.y;                     // profil laminar
                p.x = (p.x + dt * K.clamp(speed * (api._turb ? 1 : prof * 1.5), 2, 600) / 320) % 1;
                const yy = api._turb ? p.y + .35 * Math.sin(p.ph + p.x * 25) : p.y;
                p.c.setAttribute("cx", 46 + p.x * 320); p.c.setAttribute("cy", 100 + K.clamp(yy, -1, 1) * (h / 2 - 4));
                p.c.setAttribute("fill", K.css("--o2-rich")); p.c.setAttribute("opacity", op);
              });
              K.$("#r4-f", v).textContent = `r = ${r.toFixed(2).replace(".", ",")}×   L = ${L}×   Ht = ${ht}%   ${api._turb ? "· aliran turbulen" : ""}`;
              K.$("#r4-R", v).textContent = Rr >= 10 ? Rr.toFixed(0) + "×" : Rr.toFixed(2).replace(".", ",") + "×";
              K.$("#r4-Q", v).textContent = Q >= 10 ? Q.toFixed(0) + "×" : Q.toFixed(2).replace(".", ",") + "×";
            });
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Vasokonstriksi arteriol → tekanan darah", nodes: ["Simpatis melepas norepinefrin → reseptor α1 otot polos arteriol", "Otot polos berkontraksi → jari-jari arteriol mengecil", "Resistensi naik sebanding 1/r⁴ (sangat besar)", "TPR naik", "Dengan CO tetap, MAP = CO × TPR naik"] },
            { label: "Mengapa susunan paralel menguntungkan?", nodes: ["Tiap organ menerima darah dari cabang aorta sendiri", "Semua organ mendapat tekanan arteri yang sama tingginya", "Organ dapat mengatur alirannya sendiri tanpa mengganggu organ lain (mis. otot saat olahraga)", "Resistensi total lebih kecil dari cabang mana pun", "Jantung tidak perlu menghasilkan tekanan sangat tinggi"] },
            { label: "Mengapa stenosis 50% sangat berbahaya?", nodes: ["Plak menyempitkan jari-jari arteri menjadi setengahnya", "Resistensi segmen itu naik ±16×", "Pada istirahat, arteriol hilir melebar untuk mengompensasi", "Saat kebutuhan naik (aktivitas), cadangan dilatasi sudah habis", "Aliran tidak cukup → iskemia (mis. angina, klaudikasio)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Laboratorium Poiseuille", emoji: "🎚️", html: `
          <p>ΔP dibuat tetap. Ubah jari-jari, panjang, dan hematokrit. Perhatikan betapa kuatnya pengaruh jari-jari.</p>
          <div class="slider-row"><label for="p-r">Jari-jari (r) <output id="p-r-o"></output></label><input type="range" id="p-r" min="0.4" max="1.5" step="0.01" value="1"></div>
          <div class="slider-row"><label for="p-l">Panjang (L) <output id="p-l-o"></output></label><input type="range" id="p-l" min="0.5" max="2" step="0.05" value="1"></div>
          <div class="slider-row"><label for="p-h">Hematokrit (viskositas) <output id="p-h-o"></output></label><input type="range" id="p-h" min="20" max="70" value="45"></div>
          <div class="bar-row"><div class="bar-label"><span>Resistensi</span><b id="p-R"></b></div><div class="bar"><span id="p-Rb" style="background:var(--warn)"></span></div></div>
          <div class="bar-row"><div class="bar-label"><span>Aliran</span><b id="p-Q"></b></div><div class="bar"><span id="p-Qb" style="background:var(--primary)"></span></div></div>
          <div class="callout" id="p-msg"></div>`,
          init(el) {
            const r = K.$("#p-r", el), l = K.$("#p-l", el), h = K.$("#p-h", el);
            function upd() {
              const rv = +r.value, lv = +l.value, hv = +h.value, eta = etaFromHt(hv), Rr = R(rv, lv, eta), Q = 1 / Rr;
              K.$("#p-r-o", el).textContent = rv.toFixed(2).replace(".", ",") + "×"; K.$("#p-l-o", el).textContent = lv.toFixed(2).replace(".", ",") + "×"; K.$("#p-h-o", el).textContent = hv + "% (η " + eta.toFixed(2).replace(".", ",") + "×)";
              K.$("#p-R", el).textContent = Rr.toFixed(2).replace(".", ",") + "×"; K.$("#p-Q", el).textContent = Q.toFixed(2).replace(".", ",") + "×";
              K.$("#p-Rb", el).style.width = K.clamp(Rr / 10 * 100, 1, 100) + "%"; K.$("#p-Qb", el).style.width = K.clamp(Q / 5 * 100, 1, 100) + "%";
              K.$("#p-msg", el).innerHTML = `<p>r⁴ = ${Math.pow(rv, 4).toFixed(2).replace(".", ",")} → ${rv < 1 ? `mengecilkan jari-jari ${Math.round((1 - rv) * 100)}% menaikkan resistensi ${Rr.toFixed(1).replace(".", ",")}×` : rv > 1 ? `melebarkan jari-jari ${Math.round((rv - 1) * 100)}% menaikkan aliran ${Q.toFixed(1).replace(".", ",")}×` : "jari-jari normal"}.</p>`;
            }
            [r, l, h].forEach((x) => x.addEventListener("input", upd)); upd();
          } },
        { heading: "Simulator organ paralel", emoji: "🫁", html: `
          <p>Ketuk organ untuk mengubah arteriolnya: <b>normal → dilatasi → konstriksi</b>. CO dianggap tetap 5 L/menit. Lihat TPR, MAP, dan pembagian aliran.</p>
          <div class="toggle-row" id="org-btns"></div>
          <div class="btn-row" style="margin-bottom:8px"><button class="btn btn-sm" id="org-ex" type="button">🏃 Pola olahraga</button><button class="btn btn-sm" id="org-sh" type="button">🩸 Pola syok (simpatis)</button><button class="btn btn-sm" id="org-n" type="button">↺ Normal</button></div>
          <div id="org-bars"></div>
          <div class="readouts"><div class="readout"><span>TPR (relatif)</span><b id="org-tpr"></b></div><div class="readout big"><span>MAP (CO tetap)</span><b id="org-map"></b></div></div>
          <div class="callout" id="org-msg"></div>`,
          init(el) {
            const O = [["🧠 Otak", .75], ["🫀 Jantung", .25], ["🫘 Ginjal", 1.1], ["🍽️ Saluran cerna", 1.3], ["💪 Otot rangka", 1.0], ["🖐️ Kulit & lain", .6]]; // aliran normal (L/menit)
            const st = O.map(() => 0); // 0 normal, 1 dilatasi, 2 konstriksi
            const baseG = O.map(([, q]) => q / 93);    // konduktansi agar MAP 93
            K.$("#org-btns", el).innerHTML = O.map(([n], i) => `<button class="btn btn-sm" data-i="${i}" type="button">${n}</button>`).join("");
            K.$$("#org-btns button", el).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.i; st[i] = (st[i] + 1) % 3; upd(); }));
            const setAll = (arr) => { arr.forEach((v, i) => st[i] = v); upd(); };
            K.$("#org-ex", el).addEventListener("click", () => setAll([0, 1, 2, 2, 1, 1]));
            K.$("#org-sh", el).addEventListener("click", () => setAll([0, 0, 2, 2, 2, 2]));
            K.$("#org-n", el).addEventListener("click", () => setAll([0, 0, 0, 0, 0, 0]));
            function upd() {
              const exercise = st[4] === 1;
              const shock = st.filter((x) => x === 2).length >= 4; const CO = exercise && st[1] === 1 ? 15 : shock ? 2.5 : 5;
              const G = baseG.map((g, i) => g * (st[i] === 1 ? (i === 4 ? 8 : 2.2) : st[i] === 2 ? .35 : 1));
              const Gt = G.reduce((a, b) => a + b, 0), TPR = 1 / Gt, MAP = CO * TPR;
              K.$$("#org-btns button", el).forEach((b, i) => { b.classList.toggle("on", st[i] === 1); b.style.borderColor = st[i] === 2 ? "var(--bad)" : ""; b.title = ["normal", "dilatasi", "konstriksi"][st[i]]; b.textContent = O[i][0] + (st[i] === 1 ? " ⬆" : st[i] === 2 ? " ⬇" : ""); });
              K.$("#org-bars", el).innerHTML = O.map(([n], i) => { const q = MAP * G[i]; return `<div class="bar-row"><div class="bar-label"><span>${n} <span class="muted small">${["normal", "dilatasi", "konstriksi"][st[i]]}</span></span><b>${q.toFixed(2).replace(".", ",")} L/mnt</b></div><div class="bar"><span style="width:${K.clamp(q / 12 * 100, 1, 100)}%;background:${st[i] === 1 ? "var(--ok)" : st[i] === 2 ? "var(--bad)" : "var(--primary)"}"></span></div></div>`; }).join("");
              K.$("#org-tpr", el).textContent = (TPR / (1 / baseG.reduce((a, b) => a + b, 0))).toFixed(2).replace(".", ",") + "×";
              K.$("#org-map", el).innerHTML = `${Math.round(MAP)}<small> mmHg</small>`;
              K.$("#org-msg", el).innerHTML = `<p>${CO > 5 ? "Pola olahraga: CO naik 3× (15 L/menit). Otot & jantung berdilatasi, usus & ginjal berkonstriksi → aliran dialihkan ke otot, MAP tetap terjaga." : shock ? "Pola syok perdarahan: CO turun ke 2,5 L/menit, tetapi vasokonstriksi simpatis menaikkan TPR sehingga MAP tetap terjaga. Aliran ke otak & jantung dipertahankan; ginjal, usus, otot, dan kulit dikorbankan." : MAP > 100 ? "Banyak organ berkonstriksi → TPR ↑ → MAP ↑." : MAP < 85 ? "Banyak organ berdilatasi tanpa kenaikan CO → TPR ↓ → MAP turun. Inilah yang terjadi pada syok septik/anafilaksis." : "Ubah organ satu per satu: dilatasi satu cabang menambah alirannya sendiri dan sedikit menurunkan TPR."}</p>`;
            }
            upd();
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika resistensi berubah…", emoji: "🩺", intro: "Selalu tanyakan: jari-jari, panjang, atau viskositas yang berubah?",
          items: [
            { icon: "🧈", title: "Aterosklerosis & stenosis", chain: ["Plak mengecilkan jari-jari arteri", "Resistensi naik sangat besar (r⁴)", "Aliran ke organ turun terutama saat kebutuhan naik; aliran turbulen → bruit"] },
            { icon: "🩸", title: "Polisitemia", chain: ["Hematokrit tinggi → viskositas ↑", "Resistensi ↑ → aliran melambat, beban jantung ↑", "Risiko trombosis dan hipertensi"] },
            { icon: "🦠", title: "Syok septik", chain: ["Mediator inflamasi melebarkan arteriol di seluruh tubuh", "TPR turun drastis", "MAP turun meskipun CO normal/tinggi"] },
            { icon: "💊", title: "Obat antihipertensi vasodilator", chain: ["Merelaksasi otot polos arteriol (mis. penghambat kanal Ca²⁺)", "Jari-jari ↑ → TPR ↓", "MAP turun"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Jari-jari sebuah arteriol berkurang menjadi setengahnya. Jika ΔP tetap, aliran melalui arteriol tersebut menjadi…",
          options: ["½ kali", "¼ kali", "1/16 kali", "2 kali"], answer: 2,
          explain: "R ∝ 1/r⁴. r menjadi ½ → R menjadi 16× → Q = ΔP/R menjadi 1/16." },
        { q: "Mengapa arteriol, bukan kapiler, yang menjadi penentu utama TPR padahal kapiler lebih sempit?",
          options: ["Karena kapiler tidak memiliki resistensi", "Karena kapiler tersusun paralel dalam jumlah sangat banyak, dan arteriol memiliki otot polos yang dapat mengubah jari-jarinya", "Karena arteriol lebih panjang", "Karena darah di arteriol lebih kental"], answer: 1,
          explain: "Banyaknya kapiler paralel menurunkan resistensi totalnya. Arteriol jumlahnya lebih sedikit, resistensinya besar, dan yang terpenting bisa diatur." },
        { q: "Menurut MAP = CO × TPR, apa yang terjadi bila TPR turun 50% dan CO tidak berubah?",
          options: ["MAP naik 2×", "MAP turun ±50%", "MAP tetap", "CO turun 50%"], answer: 1,
          explain: "Jika CO tetap dan TPR menjadi ½, MAP menjadi ½. Tubuh biasanya mengompensasi dengan menaikkan CO (refleks baroreseptor)." },
        { q: "Pasien anemia berat (Ht 20%). Efek langsung pada resistensi vaskular adalah…",
          options: ["Naik karena darah lebih kental", "Turun karena viskositas darah berkurang", "Tidak berubah", "Naik karena jari-jari mengecil"], answer: 1,
          explain: "Hematokrit rendah → viskositas ↓ → resistensi ↓. Bersama vasodilatasi akibat hipoksia, ini ikut menyebabkan CO tinggi pada anemia." },
        { q: "Saat olahraga, aliran darah ke otot meningkat besar, sedangkan aliran ke usus menurun. Hal ini dimungkinkan karena…",
          options: ["Organ tersusun seri", "Organ tersusun paralel sehingga resistensi tiap cabang dapat diatur sendiri", "Viskositas darah berubah di tiap organ", "Panjang pembuluh otot bertambah"], answer: 1,
          explain: "Dengan susunan paralel, dilatasi arteriol otot dan konstriksi arteriol usus mengalihkan aliran tanpa mengubah tekanan aorta secara besar." },
      ]},
    ],
  });
})();
