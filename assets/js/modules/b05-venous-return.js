/* Modul B5 — Faktor yang Memengaruhi Venous Return */
(function () {
  const VIZ = `<svg viewBox="0 0 420 300" role="img" aria-label="Pompa otot dan pompa respirasi">
    <!-- tungkai -->
    <g data-g="leg"><text class="svg-label small" x="90" y="292" text-anchor="middle">Vena tungkai</text></g>
    <rect class="mus" id="mus-l" data-g="muscle" data-info="muscle" x="36" y="120" width="34" height="120" rx="14" fill="var(--primary)" opacity=".55"/>
    <rect class="mus" id="mus-r" data-g="muscle" data-info="muscle" x="110" y="120" width="34" height="120" rx="14" fill="var(--primary)" opacity=".55"/>
    <rect id="vein" data-g="leg" x="76" y="30" width="28" height="250" rx="12" fill="var(--o2-poor)" opacity=".35"/>
    ${[230, 170, 110, 55].map((y, i) => `<g class="vv" data-g="valve" data-info="valve" data-y="${y}"><line x1="78" y1="${y}" x2="90" y2="${y - 10}" stroke="var(--text)" stroke-width="3"/><line x1="102" y1="${y}" x2="90" y2="${y - 10}" stroke="var(--text)" stroke-width="3"/></g>`).join("")}
    <path id="vein-path" d="M90,278 V30" fill="none"/>
    <path id="vein-back" d="M90,140 V200" fill="none"/>
    <!-- toraks -->
    <g data-g="thorax" data-info="thorax">
      <ellipse id="thx" cx="300" cy="120" rx="95" ry="80" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
      <ellipse id="lungL" cx="262" cy="115" rx="28" ry="50" fill="var(--surface)" stroke="var(--accent)"/>
      <ellipse id="lungR" cx="338" cy="115" rx="28" ry="50" fill="var(--surface)" stroke="var(--accent)"/>
      <path id="dia" d="M210,190 Q300,150 390,190" fill="none" stroke="var(--warn)" stroke-width="4"/>
      <text class="svg-label small" x="300" y="30" text-anchor="middle">Rongga toraks</text>
      <text id="thx-p" class="svg-label small" x="300" y="218" text-anchor="middle"></text>
    </g>
    <path id="ivc" data-g="thorax" d="M300,280 V100" stroke="var(--o2-poor)" stroke-width="12" stroke-linecap="round" opacity=".55" fill="none"/>
    <g data-g="heart" data-info="ra"><circle cx="300" cy="88" r="16" fill="var(--o2-poor)"/><text class="svg-label small" x="300" y="92" text-anchor="middle" style="fill:#fff">AK</text></g>
    <text class="svg-label small" x="312" y="270">v. kava inferior</text>
    <g class="flow-layer"></g>
    <text id="vr-label" class="svg-label" x="300" y="294" text-anchor="middle" style="font-weight:700"></text>
  </svg>`;

  const STEPS = [
    { title: "Venous return = aliran balik ke jantung", body: "<b>Venous return (VR)</b> adalah volume darah yang kembali ke atrium kanan per menit. Dalam keadaan stabil, <b>VR = CO</b> — jantung hanya bisa memompa darah yang kembali kepadanya (Frank-Starling, A13).", key: "VR menentukan preload.", g: ["leg", "thorax", "heart"], mode: "rest" },
    { title: "Pendorong utama: gradien tekanan", body: "Tekanan di venula ±15 mmHg, di atrium kanan ±0–4 mmHg. Gradien kecil inilah yang mendorong darah pulang. <b>Tekanan atrium kanan ↑ → gradien ↓ → VR ↓</b>.", key: "Gradiennya kecil, jadi vena butuh “pembantu”.", g: ["leg", "heart"], mode: "rest" },
    { title: "Pompa otot rangka", body: "Saat otot betis berkontraksi, vena di antaranya <b>terperas</b> dan darah terdorong ke atas. Saat otot relaksasi, vena terisi lagi dari bawah.", key: "Berjalan = memompa darah pulang. Berdiri diam = darah menggenang.", g: ["leg", "muscle", "valve"], mode: "muscle" },
    { title: "Katup vena: satu arah", body: "Katup di vena tungkai <b>menutup</b> bila darah mencoba turun dan <b>membuka</b> bila darah naik. Tanpa katup, perasan otot akan mendorong darah ke dua arah.", key: "Katup rusak → darah mengalir balik → varises.", g: ["valve", "leg", "muscle"], mode: "muscle" },
    { title: "Pompa respirasi", body: "Saat <b>inspirasi</b>, diafragma turun: tekanan di toraks <b>turun</b> (lebih negatif) dan tekanan abdomen <b>naik</b>. Darah “tersedot” dari vena abdomen ke vena toraks dan atrium kanan.", key: "Napas dalam meningkatkan VR, terutama ke jantung kanan (ingat split S2, A9).", g: ["thorax", "heart"], mode: "breath" },
    { title: "Venokonstriksi simpatis", body: "Vena menampung ±60–70% darah (B1). Saraf simpatis mengerutkan otot polos vena → kapasitas vena berkurang → darah cadangan <b>berpindah ke jantung</b>.", key: "Seperti memeras spons: volume darah sama, tetapi lebih banyak yang kembali.", g: ["leg", "heart"], mode: "constrict" },
    { title: "Volume darah & gravitasi", body: "<b>Volume darah ↑</b> (cairan, transfusi) → VR ↑; <b>perdarahan</b> → VR ↓. <b>Berdiri</b> membuat ±500 mL darah menggenang di tungkai → VR ↓; <b>berbaring</b> atau mengangkat kaki → VR ↑.", key: "Posisi tubuh mengubah VR dalam hitungan detik.", g: ["leg", "heart"], mode: "rest" },
  ];

  registerModule({
    id: "b05",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Bagaimana darah pulang ke jantung?", emoji: "💡", html: `
          <p>Saat sampai di vena, tekanan darah tinggal ±10–15 mmHg (B2). Padahal darah dari kaki harus <b>naik melawan gravitasi</b> ke jantung. Bagaimana bisa?</p>
          <ul class="key-points">
            <li><span class="k-ico">📉</span><span><b>Gradien tekanan</b> vena → atrium kanan.</span></li>
            <li><span class="k-ico">💪</span><span><b>Pompa otot rangka</b> + <b>katup vena</b>.</span></li>
            <li><span class="k-ico">🌬️</span><span><b>Pompa respirasi</b>.</span></li>
            <li><span class="k-ico">🧽</span><span><b>Venokonstriksi</b> simpatis & <b>volume darah</b>.</span></li>
            <li><span class="k-ico">🧍</span><span><b>Gravitasi/posisi</b> tubuh.</span></li>
          </ul>
          <div class="callout"><p><b>Kaitan:</b> VR = preload (A13). Semua faktor di sini akhirnya memengaruhi SV dan CO.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Mesin-mesin aliran balik", emoji: "🎬", intro: "Perhatikan otot, katup, dan diafragma bergerak. Klik bagian diagram untuk penjelasan.",
          viz: VIZ, steps: STEPS,
          info: {
            muscle: ["Otot betis (pompa otot)", "Kontraksi memeras vena dalam; sering disebut “jantung kedua”."],
            valve: ["Katup vena", "Lipatan endotel berbentuk kantong; menutup bila darah mengalir balik."],
            thorax: ["Rongga toraks", "Tekanan intratoraks ±−5 mmHg saat istirahat, lebih negatif saat inspirasi."],
            ra: ["Atrium kanan", "Tujuan venous return. Tekanannya (±0–4 mmHg) = tekanan vena sentral."],
          },
          onStep(i, s, api) {
            K.$$("[data-g]", api.viz).forEach((e) => { e.style.transition = "opacity .3s"; e.style.opacity = s.g.includes(e.dataset.g) ? 1 : .2; });
            api._mode = s.mode;
          },
          init(api, secEl) {
            const v = api.viz, fl = K.flow(K.$(".flow-layer", v));
            fl.set([{ el: K.$("#vein-path", v), color: K.css("--o2-poor"), n: 8, speed: 30, r: 4 }, { el: K.$("#ivc", v), color: K.css("--o2-poor"), n: 5, speed: 30, r: 4 }]);
            let t = 0, clock = 0;
            K.loop(secEl, (dt) => {
              t += dt;
              const mode = api._mode;
              const musc = mode === "muscle" ? Math.max(0, Math.sin(t * 2.4)) : 0;
              const breath = mode === "breath" ? Math.max(0, Math.sin(t * 1.3)) : 0;
              const con = mode === "constrict" ? 1 : 0;
              K.$("#mus-l", v).setAttribute("x", 36 + musc * 6); K.$("#mus-r", v).setAttribute("x", 110 - musc * 6);
              K.$("#vein", v).setAttribute("width", 28 - musc * 10 - con * 8); K.$("#vein", v).setAttribute("x", 76 + musc * 5 + con * 4);
              K.$$(".vv", v).forEach((g) => { const [a, b] = K.$$("line", g), y = +g.dataset.y, open = musc > .1; a.setAttribute("x2", open ? 84 : 90); b.setAttribute("x2", open ? 96 : 90); a.setAttribute("y2", y - (open ? 16 : 10)); b.setAttribute("y2", y - (open ? 16 : 10)); });
              K.$("#dia", v).setAttribute("d", `M210,${190 + breath * 12} Q300,${150 + breath * 30} 390,${190 + breath * 12}`);
              ["#lungL", "#lungR"].forEach((id) => K.$(id, v).setAttribute("ry", 50 + breath * 10));
              K.$("#thx-p", v).textContent = mode === "breath" ? (breath > .1 ? "Inspirasi: tekanan toraks ↓ (−8 mmHg) → darah tersedot masuk" : "Ekspirasi: tekanan toraks ±−5 mmHg") : "";
              const sp = 25 + musc * 160 + breath * 70 + con * 45;
              clock += dt;
              fl.tick(dt * sp / 30);
              K.$("#vr-label", v).textContent = `Venous return: ${(5 * (1 + musc * .6 + breath * .25 + con * .2)).toFixed(1).replace(".", ",")} L/mnt`;
            });
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa tentara yang berdiri lama bisa pingsan?", nodes: ["Berdiri diam → otot tungkai tidak berkontraksi (pompa otot mati)", "Gravitasi membuat darah menggenang di vena tungkai", "VR ↓ → preload ↓ → SV ↓ → CO ↓", "Tekanan darah & aliran ke otak turun", "Pingsan → tubuh jatuh horizontal → VR pulih (cara alami tubuh “menolong diri”)"] },
            { label: "Bagaimana olahraga menaikkan VR?", nodes: ["Otot berkontraksi ritmis → pompa otot bekerja kuat", "Napas lebih dalam & cepat → pompa respirasi ↑", "Simpatis → venokonstriksi → darah cadangan dimobilisasi", "VR naik sehingga preload ↑", "CO dapat naik berlipat (A11)"] },
            { label: "Mengapa gagal jantung kanan memperlambat VR?", nodes: ["Ventrikel kanan lemah → tidak mampu mengosongkan atrium kanan", "Tekanan atrium kanan (tekanan vena sentral) naik", "Gradien vena → atrium kanan mengecil", "VR turun dan darah menumpuk di vena sistemik", "JVP meningkat, edema tungkai (A1)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Simulator venous return", emoji: "🎚️", html: `
          <p>Atur faktor-faktornya dan lihat venous return. Grafik kanan adalah <b>kurva venous return</b>: VR turun saat tekanan atrium kanan naik.</p>
          <div class="two-col">
            <div>
              <div class="slider-row"><label for="vr-vol">🩸 Volume darah <output id="vr-vol-o"></output></label><input type="range" id="vr-vol" min="60" max="130" value="100"></div>
              <div class="slider-row"><label for="vr-ton">🧽 Tonus vena (simpatis) <output id="vr-ton-o"></output></label><input type="range" id="vr-ton" min="60" max="150" value="100"></div>
              <div class="slider-row"><label for="vr-rap">🫀 Tekanan atrium kanan <output id="vr-rap-o"></output></label><input type="range" id="vr-rap" min="-2" max="12" value="2"></div>
              <b class="small">Posisi & aktivitas</b>
              <div class="toggle-row" id="vr-pos"><button class="btn btn-sm" data-p="lie" type="button">🛌 Berbaring</button><button class="btn btn-sm on" data-p="sit" type="button">🪑 Duduk</button><button class="btn btn-sm" data-p="stand" type="button">🧍 Berdiri diam</button><button class="btn btn-sm" data-p="walk" type="button">🚶 Berjalan</button></div>
              <div class="toggle-row"><button class="btn btn-sm" id="vr-br" type="button">🌬️ Napas dalam</button></div>
            </div>
            <div class="viz-wrap"><svg id="vr-curve" viewBox="0 0 260 232" role="img" aria-label="Kurva venous return"></svg></div>
          </div>
          <div class="readouts"><div class="readout big"><span>Venous return (= CO)</span><b id="vr-out"></b></div><div class="readout"><span>Tekanan pengisian sistemik rata-rata</span><b id="vr-pms"></b></div></div>
          <div class="callout" id="vr-msg"></div>`,
          init(el) {
            const s = (id) => K.$("#" + id, el); let pos = "sit", br = false;
            K.$$("#vr-pos button", el).forEach((b) => b.addEventListener("click", () => { pos = b.dataset.p; K.$$("#vr-pos button", el).forEach((x) => x.classList.toggle("on", x === b)); upd(); }));
            s("vr-br").addEventListener("click", (e) => { br = !br; e.target.classList.toggle("on", br); upd(); });
            const X = (p) => 30 + (p + 4) / 18 * 220, Y = (q) => 195 - q / 10 * 180;
            function upd() {
              const vol = +s("vr-vol").value / 100, ton = +s("vr-ton").value / 100, rap = +s("vr-rap").value;
              const posAdj = { lie: .8, sit: 0, stand: -2, walk: .6 }[pos], brAdj = br ? .6 : 0;
              const pms = Math.max(0.5, 7 * (1 + (vol - 1) * 2.2) * (1 + (ton - 1) * .7) + posAdj + brAdj);
              const vr = (r) => Math.max(0, pms - Math.max(r, 0)) / 1.0;
              s("vr-vol-o").textContent = Math.round(vol * 100) + "%"; s("vr-ton-o").textContent = Math.round(ton * 100) + "%"; s("vr-rap-o").textContent = rap + " mmHg";
              const V = vr(rap);
              s("vr-out").innerHTML = `${V.toFixed(1).replace(".", ",")}<small> L/menit</small>`; s("vr-pms").innerHTML = `${pms.toFixed(1).replace(".", ",")}<small> mmHg</small>`;
              const base = (r) => Math.max(0, 7 - Math.max(r, 0));
              s("vr-curve").innerHTML = `<line class="svg-axis" x1="30" y1="10" x2="30" y2="195"/><line class="svg-axis" x1="30" y1="195" x2="255" y2="195"/>
                <text class="svg-label small" x="142" y="228" text-anchor="middle">Tekanan atrium kanan (mmHg)</text><text class="svg-label small" x="10" y="100" transform="rotate(-90 10 100)" text-anchor="middle">VR (L/menit)</text>
                ${[0, 4, 8, 12].map((p) => `<text class="svg-label small" x="${X(p)}" y="206" text-anchor="middle" style="font-size:9px">${p}</text>`).join("")}
                <path d="${K.plot(base, -4, 14, X, Y, 100)}" fill="none" stroke="var(--text-soft)" stroke-width="2" stroke-dasharray="5 4"/>
                <path d="${K.plot(vr, -4, 14, X, Y, 100)}" fill="none" stroke="var(--o2-poor)" stroke-width="3"/>
                <circle cx="${X(rap)}" cy="${Y(V)}" r="6" fill="var(--primary)" stroke="#fff" stroke-width="2"/>
                <text class="svg-label small" x="${X(pms)}" y="188" text-anchor="middle" style="font-size:9px">Pms</text>`;
              const m = s("vr-msg"), notes = [];
              if (vol < .85) notes.push("Volume darah ↓ (perdarahan) → tekanan pengisian ↓ → VR ↓");
              if (vol > 1.15) notes.push("Volume ↑ → VR ↑");
              if (ton > 1.15) notes.push("Venokonstriksi memindahkan darah dari vena ke jantung → VR ↑");
              if (pos === "stand") notes.push("Berdiri diam: darah menggenang di tungkai → VR ↓");
              if (pos === "walk") notes.push("Berjalan: pompa otot aktif → VR ↑");
              if (pos === "lie") notes.push("Berbaring: efek gravitasi hilang → VR ↑");
              if (br) notes.push("Napas dalam: pompa respirasi → VR ↑");
              if (rap > 6) notes.push("Tekanan atrium kanan tinggi (mis. gagal jantung kanan, tamponade) → gradien mengecil → VR ↓");
              if (rap <= 0) notes.push("Atrium kanan ≤ 0 mmHg: vena besar di toraks kolaps sehingga VR tidak bisa naik lagi (kurva mendatar)");
              m.className = V < 4 ? "callout red" : V > 6 ? "callout green" : "callout";
              m.innerHTML = `<p>${notes.join(". ") || "Kondisi istirahat duduk: VR ±5 L/menit"}.</p>`;
            }
            ["vr-vol", "vr-ton", "vr-rap"].forEach((id) => s(id).addEventListener("input", upd)); upd();
          } },
        { type: "match", heading: "Naik atau turun?", emoji: "🧩", intro: "Ketuk kondisi di kiri, lalu efeknya pada venous return di kanan.",
          pairs: [["Berjalan kaki", "VR ↑ — pompa otot aktif"], ["Berdiri diam lama", "VR ↓ — darah menggenang di tungkai"], ["Inspirasi dalam", "VR ↑ — tekanan intratoraks turun"], ["Perdarahan 1 liter", "VR ↓ — volume darah berkurang"], ["Tamponade jantung", "VR ↓ — tekanan atrium kanan naik"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika aliran balik terganggu…", emoji: "🩺", intro: "Cari faktor mana yang hilang atau berubah.",
          items: [
            { icon: "🦵", title: "Varises", chain: ["Katup vena tungkai tidak kompeten", "Pompa otot tidak efektif; darah mengalir balik", "Vena melebar, tungkai berat & bengkak, terutama saat berdiri lama"] },
            { icon: "🛏️", title: "Trombosis vena dalam (imobilisasi)", chain: ["Tirah baring lama / perjalanan jauh → pompa otot tidak bekerja", "Aliran vena melambat (stasis)", "Bekuan terbentuk di vena dalam; bisa lepas → emboli paru"] },
            { icon: "😵‍💫", title: "Hipotensi ortostatik", chain: ["Berdiri → darah menggenang di tungkai", "Bila refleks baroreseptor/venokonstriksi lemah (lansia, obat, neuropati), VR tetap rendah", "Tekanan darah turun → pusing atau pingsan saat berdiri"] },
            { icon: "🫀", title: "Tamponade jantung / pneumotoraks tension", chain: ["Tekanan di sekitar jantung atau di toraks naik", "Tekanan atrium kanan naik dan pengisian jantung terhambat", "VR & CO turun drastis → syok obstruktif"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Dalam keadaan stabil, hubungan venous return dengan cardiac output adalah…",
          options: ["VR selalu dua kali CO", "VR = CO", "VR tidak berhubungan dengan CO", "VR = CO − SV"], answer: 1,
          explain: "Karena sirkulasi tertutup, dalam jangka waktu tertentu jumlah darah yang kembali ke jantung harus sama dengan yang dipompa." },
        { q: "Mengapa berjalan membantu mengembalikan darah dari tungkai ke jantung?",
          options: ["Karena berjalan menurunkan volume darah", "Karena kontraksi otot memeras vena dan katup memastikan darah bergerak ke atas", "Karena berjalan meningkatkan tekanan atrium kanan", "Karena arteri tungkai melebar"], answer: 1,
          explain: "Pompa otot rangka + katup vena satu arah adalah mekanisme utama aliran balik dari tungkai saat tegak." },
        { q: "Saat inspirasi, venous return ke jantung kanan meningkat karena…",
          options: ["Tekanan intratoraks naik", "Tekanan intratoraks turun dan tekanan abdomen naik, menghasilkan gradien ke arah toraks", "Diafragma naik", "Katup trikuspid menutup"], answer: 1,
          explain: "Diafragma turun: toraks menjadi lebih negatif, abdomen lebih positif → darah terdorong dari vena abdomen ke vena toraks dan atrium kanan." },
        { q: "Tekanan atrium kanan seorang pasien meningkat menjadi 15 mmHg. Efek pada venous return?",
          options: ["Meningkat karena tekanan lebih tinggi", "Menurun karena gradien tekanan vena–atrium kanan mengecil", "Tidak berubah", "Menjadi dua kali lipat"], answer: 1,
          explain: "VR digerakkan oleh selisih tekanan pengisian sistemik dan tekanan atrium kanan. Semakin tinggi tekanan atrium kanan, semakin kecil selisihnya." },
        { q: "Pada perdarahan, venokonstriksi simpatis membantu karena…",
          options: ["Menambah jumlah sel darah merah", "Mengurangi kapasitas vena sehingga darah cadangan berpindah ke jantung", "Menurunkan tekanan atrium kanan", "Menghentikan perdarahan secara langsung"], answer: 1,
          explain: "Vena adalah reservoir darah. Saat dindingnya mengerut, darah yang tersimpan didorong kembali ke sirkulasi sentral → VR & preload terjaga." },
      ]},
    ],
  });
})();
