/* Modul A6 — Ritme Jantung & Pacemaker Potential */
(function () {
  /** Bentuk potensial aksi sel SA node; p = {mdp, thr, slope (mV/ms)} → {v(t), period} */
  function saModel(p) {
    const mdp = p.mdp, thr = p.thr, peak = 10;
    const tLate = (thr - mdp) * 0.6 / p.slope;           // fase 4 awal (If)
    const tCa = (thr - mdp) * 0.4 / (p.slope * 1.6);      // fase 4 akhir (Ca-T), lebih curam
    const t4 = tLate + tCa, t0 = 45, t3 = 110;
    const period = t4 + t0 + t3;
    function v(t) {
      t = ((t % period) + period) % period;
      if (t < tLate) return mdp + (thr - mdp) * 0.6 * (t / tLate);
      if (t < t4) return mdp + (thr - mdp) * (0.6 + 0.4 * (t - tLate) / tCa);
      if (t < t4 + t0) { const f = (t - t4) / t0; return thr + (peak - thr) * Math.sin(f * Math.PI / 2); }
      const f = (t - t4 - t0) / t3; return peak + (mdp - peak) * (1 - Math.cos(f * Math.PI)) / 2;
    }
    function phase(t) {
      t = ((t % period) + period) % period;
      return t < tLate ? "4a" : t < t4 ? "4b" : t < t4 + t0 ? "0" : "3";
    }
    return { v, period, phase, t4, tLate };
  }
  const BASE = { mdp: -60, thr: -40, slope: 20 / 600 };

  const VIZ = `<svg viewBox="0 0 420 330" role="img" aria-label="Potensial aksi sel SA node dan kanal ion">
    <line class="svg-axis" x1="44" y1="20" x2="44" y2="160"/><line class="svg-axis" x1="44" y1="160" x2="410" y2="160"/>
    <g class="svg-label small" style="font-size:10px">
      <text x="40" y="40" text-anchor="end">+10</text><text x="40" y="85" text-anchor="end">−20</text><text x="40" y="115" text-anchor="end">−40</text><text x="40" y="145" text-anchor="end">−60</text>
    </g>
    <line class="svg-grid" x1="44" y1="112" x2="410" y2="112"/>
    <text class="svg-label small" x="408" y="108" text-anchor="end">ambang</text>
    <path id="pm-trace" fill="none" stroke="var(--primary)" stroke-width="3"/>
    <path id="pm-hl" fill="none" stroke="var(--warn)" stroke-width="7" stroke-linecap="round" opacity=".55"/>
    <circle id="pm-dot" r="6" fill="var(--warn)" stroke="#fff" stroke-width="2"/>
    <text class="svg-label small" x="14" y="92" transform="rotate(-90 14 92)" text-anchor="middle">mV</text>
    <!-- membran -->
    <text class="svg-label small" x="20" y="196">Luar sel</text>
    <rect x="14" y="214" width="396" height="36" rx="8" fill="var(--warn-soft)" stroke="var(--warn)"/>
    <text class="svg-label small" x="20" y="275">Dalam sel</text>
    <g class="chan" data-ch="hcn" data-info="hcn"><rect x="70" y="206" width="44" height="52" rx="10" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/><text class="svg-label small" x="92" y="236" text-anchor="middle">HCN</text><text class="svg-label small" x="92" y="300" text-anchor="middle">If (Na⁺ masuk)</text></g>
    <g class="chan" data-ch="cat" data-info="cat"><rect x="160" y="206" width="44" height="52" rx="10" fill="var(--surface)" stroke="var(--ok)" stroke-width="2"/><text class="svg-label small" x="182" y="236" text-anchor="middle">Ca-T</text><text class="svg-label small" x="182" y="300" text-anchor="middle">Ca²⁺ masuk</text></g>
    <g class="chan" data-ch="cal" data-info="cal"><rect x="250" y="206" width="44" height="52" rx="10" fill="var(--surface)" stroke="var(--ok)" stroke-width="2"/><text class="svg-label small" x="272" y="236" text-anchor="middle">Ca-L</text><text class="svg-label small" x="272" y="300" text-anchor="middle">Ca²⁺ masuk</text></g>
    <g class="chan" data-ch="k" data-info="k"><rect x="340" y="206" width="44" height="52" rx="10" fill="var(--surface)" stroke="var(--vein)" stroke-width="2"/><text class="svg-label small" x="362" y="236" text-anchor="middle">K⁺</text><text class="svg-label small" x="362" y="300" text-anchor="middle">K⁺ keluar</text></g>
    <path id="ip-hcn" d="M92,180 V285" fill="none"/><path id="ip-cat" d="M182,180 V285" fill="none"/>
    <path id="ip-cal" d="M272,180 V285" fill="none"/><path id="ip-k" d="M362,285 V180" fill="none"/>
    <g class="ion-layer"></g>
  </svg>`;

  const STEPS = [
    { title: "Tidak pernah benar-benar istirahat", body: "Sel SA node tidak punya potensial istirahat yang stabil. Setelah repolarisasi, potensialnya berada di titik terendah ±<b>−60 mV</b> (maximum diastolic potential) lalu <b>langsung naik lagi</b> dengan sendirinya.", key: "Inilah dasar <b>otoritmisitas</b>: menembak tanpa rangsangan luar.", ph: ["4a", "4b", "0", "3"], ch: [] },
    { title: "Fase 4 awal: funny current (If)", body: "Repolarisasi membuka kanal <b>HCN</b> (unik: terbuka saat membran negatif!). Na⁺ masuk perlahan → potensial merayap naik.", key: "Disebut “funny” karena berperilaku terbalik dari kanal biasa.", ph: ["4a"], ch: ["hcn"] },
    { title: "Fase 4 akhir: Ca²⁺ tipe T", body: "Sekitar −50 mV, kanal <b>Ca²⁺ tipe T</b> (transien) terbuka. Ca²⁺ masuk dan mempercepat kenaikan potensial menuju ambang.", key: "Fase 4 = “pacemaker potential”. Kemiringannya menentukan laju denyut.", ph: ["4b"], ch: ["hcn", "cat"] },
    { title: "Fase 0: Ca²⁺ tipe L", body: "Di ambang ±<b>−40 mV</b>, kanal <b>Ca²⁺ tipe L</b> (long-lasting) terbuka lebar. Ca²⁺ masuk deras → depolarisasi. Lebih landai dibanding sel kontraktil karena Ca²⁺ masuk lebih lambat daripada Na⁺.", key: "Di SA node, kenaikan potensial aksi digerakkan Ca²⁺, bukan Na⁺.", ph: ["0"], ch: ["cal"] },
    { title: "Fase 3: repolarisasi oleh K⁺", body: "Kanal Ca²⁺ menutup, kanal <b>K⁺</b> terbuka. K⁺ keluar → potensial turun kembali ke −60 mV. Di titik ini HCN terbuka lagi, dan siklus berulang.", key: "Tidak ada fase 1 dan 2 (plateau) seperti pada sel kontraktil.", ph: ["3"], ch: ["k"] },
    { title: "Satu siklus = satu denyut", body: "Setiap kali SA node mencapai ambang, satu impuls dikirim ke seluruh jantung (A5). Jadi <b>laju denyut jantung = seberapa cepat fase 4 mencapai ambang</b>.", key: "Tiga cara mengubah laju: kemiringan fase 4, titik awal (MDP), dan nilai ambang.", ph: ["4a", "4b", "0", "3"], ch: ["hcn", "cat", "cal", "k"] },
  ];

  registerModule({
    id: "a06",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Jantung yang bisa berdenyut sendiri", emoji: "💡", html: `
          <p>Jantung yang dikeluarkan dari tubuh (misalnya saat transplantasi) masih bisa berdenyut. Itu karena impulsnya dibuat sendiri oleh <b>sel pacemaker</b> di SA node — bukan oleh otak.</p>
          <ul class="key-points">
            <li><span class="k-ico">📈</span><span>Rahasianya: potensial membran sel pacemaker <b>naik perlahan dengan sendirinya</b> (pacemaker potential) sampai mencapai ambang.</span></li>
            <li><span class="k-ico">🎚️</span><span>Saraf otonom tidak <b>membuat</b> denyut, tetapi <b>mengatur kecepatannya</b>.</span></li>
            <li><span class="k-ico">🏅</span><span>Sel yang paling cepat mencapai ambang menjadi pemimpin ritme — normalnya SA node (<b>ritme sinus</b>).</span></li>
          </ul>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Potensial aksi sel SA node", emoji: "📈", intro: "Bagian grafik yang disorot oranye adalah fase yang sedang dibahas. Klik kanal ion untuk penjelasan.",
          viz: VIZ, steps: STEPS,
          info: {
            hcn: ["Kanal HCN (If, funny current)", "Hyperpolarization-activated Cyclic Nucleotide-gated. Terbuka saat membran negatif; dipermudah oleh cAMP (simpatis ↑). Obat ivabradine menghambatnya → HR turun."],
            cat: ["Kanal Ca²⁺ tipe T", "Terbuka sebentar sekitar −50 mV, membantu mendorong potensial ke ambang."],
            cal: ["Kanal Ca²⁺ tipe L", "Penggerak fase 0 di SA & AV node. Dihambat oleh verapamil/diltiazem → laju & konduksi AV melambat."],
            k: ["Kanal K⁺", "Membawa K⁺ keluar untuk repolarisasi. ACh (vagus) membuka kanal K⁺ tambahan (IK-ACh) → membran lebih negatif."],
          },
          onStep(i, s, api) { api._ph = s.ph; api._ch = s.ch; api._setIons && api._setIons(); },
          init(api, secEl) {
            const svg = K.$("svg", api.viz);
            const m = saModel(BASE);
            const sx = (t) => 44 + t / (m.period * 2) * 366, sy = (v) => 145 - (v + 60) * (105 / 70);
            K.$("#pm-trace", svg).setAttribute("d", K.plot(m.v, 0, m.period * 2, sx, sy, 400));
            const fl = K.flow(K.$(".ion-layer", svg));
            const COLOR = { hcn: "--accent", cat: "--ok", cal: "--ok", k: "--vein" };
            api._setIons = () => {
              K.$$(".chan", svg).forEach((g) => g.style.opacity = api._ch.length === 4 || api._ch.includes(g.dataset.ch) ? 1 : .3);
              let hl = "", prevIn = false;
              if (api._ph.length < 4) for (let i = 0; i <= 400; i++) {
                const tt = i / 400 * m.period * 2, on = api._ph.includes(m.phase(tt));
                if (on) hl += (prevIn ? "L" : "M") + sx(tt).toFixed(1) + "," + sy(m.v(tt)).toFixed(1);
                prevIn = on;
              }
              K.$("#pm-hl", svg).setAttribute("d", hl);
              fl.set([]);
            };
            let t = 0;
            K.loop(secEl, (dt) => {
              t += dt * 350;
              const tt = t % (m.period * 2);
              const dot = K.$("#pm-dot", svg);
              dot.setAttribute("cx", sx(tt)); dot.setAttribute("cy", sy(m.v(tt)));
              // ion bergerak hanya untuk kanal yang aktif pada fase saat ini
              const ph = m.phase(tt);
              const act = { "4a": ["hcn"], "4b": ["hcn", "cat"], "0": ["cal"], "3": ["k"] }[ph].filter((c) => api._ch.includes(c));
              const key = act.join();
              if (key !== api._lastKey) {
                api._lastKey = key;
                fl.set(act.map((c) => ({ el: K.$("#ip-" + c, svg), color: K.css(COLOR[c]), n: 3, speed: 70, r: 4.5 })));
              }
              fl.tick(dt);
            });
          },
        },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu dan tebak dulu langkah berikutnya.",
          chains: [
            { label: "Bagaimana simpatis mempercepat HR?", nodes: ["Saraf simpatis melepas norepinefrin", "NE berikatan dengan reseptor β1 di SA node → cAMP ↑", "cAMP membuka lebih banyak kanal HCN (If ↑) dan kanal Ca²⁺ (ICa ↑)", "Fase 4 menjadi lebih curam → ambang tercapai lebih cepat", "Lebih banyak potensial aksi per menit → HR ↑ (kronotropik positif)"] },
            { label: "Bagaimana vagus memperlambat HR?", nodes: ["Nervus vagus melepas asetilkolin (ACh)", "ACh berikatan dengan reseptor M2 → cAMP ↓ dan kanal K⁺-ACh terbuka", "K⁺ keluar → titik terendah (MDP) lebih negatif", "If berkurang → fase 4 lebih landai", "Butuh waktu lebih lama mencapai ambang → HR ↓"] },
            { label: "Mengapa HR istirahat ±70, bukan ±100?", nodes: ["Laju intrinsik SA node tanpa saraf ±100 x/menit", "Saat istirahat, tonus vagus lebih dominan daripada simpatis", "Vagus terus “mengerem” SA node", "Akibatnya HR istirahat normal ±60–80 x/menit", "Pada jantung transplantasi (tanpa saraf), HR istirahat ±100 x/menit"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Atur sendiri SA node", emoji: "🎚️", html: `
          <p>Geser aktivitas <b>simpatis</b> dan <b>parasimpatis (vagus)</b>. Lihat perubahan kemiringan fase 4, titik terendah, dan denyut jantung.</p>
          <div class="slider-row"><label for="sym">Simpatis (norepinefrin) <output id="sym-o">0</output></label><input type="range" id="sym" min="0" max="100" value="0"></div>
          <div class="slider-row"><label for="para">Parasimpatis (asetilkolin) <output id="para-o">0</output></label><input type="range" id="para" min="0" max="100" value="45"></div>
          <div class="viz-wrap"><svg id="live" style="max-width:560px;margin:auto" viewBox="0 0 420 170" role="img" aria-label="Potensial membran SA node berjalan">
            <line class="svg-grid" x1="0" y1="112" x2="420" y2="112"/><text class="svg-label small" x="414" y="106" text-anchor="end">ambang</text>
            <line class="svg-grid" x1="0" y1="145" x2="420" y2="145"/><text class="svg-label small" x="414" y="160" text-anchor="end">−60 mV</text>
            <polyline id="live-line" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
            <text id="heart-ico" x="30" y="40" font-size="30" text-anchor="middle">❤️</text>
          </svg></div>
          <div class="readouts">
            <div class="readout big"><span>Denyut jantung</span><b id="hr-o">–</b></div>
            <div class="readout"><span>Titik terendah (MDP)</span><b id="mdp-o">–</b></div>
            <div class="readout"><span>Kemiringan fase 4</span><b id="slope-o">–</b></div>
          </div>
          <div class="btn-row"><button class="btn btn-sm" data-pre="0,0" type="button">🫀 Denervasi (transplantasi)</button><button class="btn btn-sm" data-pre="0,45" type="button">😌 Istirahat</button><button class="btn btn-sm" data-pre="85,5" type="button">🏃 Olahraga</button><button class="btn btn-sm" data-pre="0,95" type="button">😵 Vagal kuat</button></div>`,
          init(el, secEl) {
            const sym = K.$("#sym", el), para = K.$("#para", el);
            let model; const buf = new Array(210).fill(-60); let t = 0, acc = 0, lastBeat = 0;
            function upd() {
              const S = +sym.value / 100, P = +para.value / 100;
              const p = { mdp: -60 - 8 * P, thr: -40 - 2 * S, slope: BASE.slope * 1.15 * (1 + 1.3 * S) / (1 + 0.8 * P) };
              model = saModel(p);
              K.$("#sym-o", el).textContent = Math.round(S * 100) + "%"; K.$("#para-o", el).textContent = Math.round(P * 100) + "%";
              K.$("#hr-o", el).innerHTML = `${Math.round(60000 / model.period)}<small> x/mnt</small>`;
              K.$("#mdp-o", el).innerHTML = `${p.mdp.toFixed(0)}<small> mV</small>`;
              K.$("#slope-o", el).textContent = p.slope > .06 ? "curam" : p.slope > .033 ? "sedang" : "landai";
            }
            [sym, para].forEach((s) => s.addEventListener("input", upd));
            K.$$("[data-pre]", el).forEach((b) => b.addEventListener("click", () => { const [a, c] = b.dataset.pre.split(","); sym.value = a; para.value = c; upd(); }));
            upd();
            const sy = (v) => 145 - (v + 60) * (105 / 70);
            K.loop(secEl, (dt) => {
              t += dt * 1000; acc += dt * 1000;
              while (acc > 14) { acc -= 14; buf.shift(); buf.push(model.v(t)); }
              K.$("#live-line", el).setAttribute("points", buf.map((v, i) => `${i * 2},${sy(v).toFixed(1)}`).join(" "));
              const ph = (t % model.period) - model.t4;
              const ico = K.$("#heart-ico", el);
              ico.setAttribute("font-size", ph > 0 && ph < 160 ? 38 : 30);
            });
          } },
        { heading: "Perlombaan pacemaker", emoji: "🏁", html: `
          <p>Semua sel autoritmik “berlomba” mencapai ambang. Yang tercepat memicu seluruh jantung dan <b>mereset</b> yang lain. Coba matikan SA node.</p>
          <div class="toggle-row"><button class="btn btn-sm" id="kill-sa" type="button">⛔ Matikan SA node</button><button class="btn btn-sm" id="kill-av" type="button">⛔ Matikan AV node juga</button></div>
          <div class="viz-wrap"><svg id="race" style="max-width:560px;margin:auto" viewBox="0 0 420 200" role="img" aria-label="Perlombaan pacemaker"></svg></div>
          <div class="callout" id="race-msg"></div>`,
          init(el, secEl) {
            const P = [
              { n: "SA node", rate: 75, col: "--primary", y: 55 },
              { n: "AV node", rate: 50, col: "--warn", y: 115 },
              { n: "Purkinje", rate: 30, col: "--vein", y: 175 },
            ];
            const svg = K.$("#race", el);
            svg.innerHTML = P.map((p, i) => `<text class="svg-label small" x="6" y="${p.y - 30}">${p.n} (${p.rate}/mnt)</text>
              <line class="svg-grid" x1="90" y1="${p.y - 30}" x2="415" y2="${p.y - 30}"/>
              <rect x="90" y="${p.y - 30}" width="325" height="30" fill="none" stroke="var(--border)"/>
              <rect class="bar-fill" data-i="${i}" x="90" y="${p.y - 30}" width="0" height="30" fill="var(${p.col})" opacity=".8"/>
              <text class="svg-label small ft" data-i="${i}" x="410" y="${p.y - 10}" text-anchor="end"></text>`).join("");
            let dead = [false, false, false], lv = [0, 0, 0], beats = 0, lastLeader = "";
            function msg() {
              const leader = P.find((p, i) => !dead[i]);
              K.$("#race-msg", el).className = dead[0] ? "callout red" : "callout green";
              K.$("#race-msg", el).innerHTML = `<p>Pemimpin ritme: <b>${leader.n}</b> → HR ±${leader.rate} x/menit. ${dead[0] ? "Pacemaker cadangan mengambil alih dengan laju lebih lambat (ritme <i>escape</i>)." : "SA node selalu mencapai ambang lebih dulu, sehingga AV node & Purkinje tidak pernah sempat menembak sendiri (<i>overdrive suppression</i>)."}</p>`;
            }
            K.$("#kill-sa", el).addEventListener("click", (e) => { dead[0] = !dead[0]; e.target.classList.toggle("on", dead[0]); msg(); });
            K.$("#kill-av", el).addEventListener("click", (e) => { dead[1] = !dead[1]; e.target.classList.toggle("on", dead[1]); msg(); });
            msg();
            K.loop(secEl, (dt) => {
              let fired = -1;
              P.forEach((p, i) => { if (dead[i]) { lv[i] = 0; return; } lv[i] += dt * p.rate / 60 * 0.6; if (lv[i] >= 1 && fired < 0) fired = i; });
              if (fired >= 0) lv = lv.map(() => 0);
              K.$$(".bar-fill", svg).forEach((r, i) => { r.setAttribute("width", Math.min(1, lv[i]) * 325); r.style.opacity = dead[i] ? .15 : .8; });
              K.$$(".ft", svg).forEach((tx, i) => tx.textContent = dead[i] ? "mati" : "");
            });
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika ritmenya terganggu…", emoji: "🩺", intro: "Hubungkan dengan kanal ion dan saraf yang kamu pelajari.",
          items: [
            { icon: "💊", title: "Obat penyekat beta", chain: ["Menghambat reseptor β1", "cAMP di SA node turun → If & ICa berkurang", "Fase 4 lebih landai → HR turun (dipakai pada angina, hipertensi, aritmia)"] },
            { icon: "🧪", title: "Ivabradine", chain: ["Menghambat kanal HCN (If) secara spesifik", "Fase 4 melambat tanpa memengaruhi kekuatan kontraksi", "HR turun → kebutuhan O₂ jantung berkurang"] },
            { icon: "💉", title: "Atropin", chain: ["Memblokir reseptor muskarinik M2", "Efek rem vagus hilang", "HR naik — dipakai pada bradikardia simtomatik"] },
            { icon: "🐌", title: "Bradikardia sinus pada atlet", chain: ["Latihan rutin meningkatkan tonus vagus & volume sekuncup", "SA node lebih “direm”", "HR istirahat bisa 40–50 x/menit dan tetap normal (fisiologis)"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Arus ion yang paling bertanggung jawab atas kenaikan awal fase 4 di SA node adalah…",
          options: ["Na⁺ cepat melalui kanal Na⁺ bergerbang tegangan", "Na⁺ melalui kanal HCN (funny current)", "K⁺ keluar", "Ca²⁺ tipe L"], answer: 1,
          explain: "Kanal HCN terbuka saat membran negatif setelah repolarisasi, membawa Na⁺ masuk perlahan. Ca²⁺ tipe T membantu di akhir fase 4, dan Ca²⁺ tipe L menggerakkan fase 0." },
        { q: "Mengapa fase 0 sel SA node lebih landai dibanding sel kontraktil ventrikel?",
          options: ["Karena digerakkan Ca²⁺ melalui kanal tipe L yang lebih lambat daripada kanal Na⁺ cepat", "Karena sel SA node lebih besar", "Karena K⁺ masuk ke sel", "Karena ambangnya lebih negatif"], answer: 0,
          explain: "Sel kontraktil memakai kanal Na⁺ cepat untuk fase 0. Di SA node, kanal Na⁺ cepat hampir semuanya inaktif (membran tidak cukup negatif), sehingga depolarisasi bergantung pada Ca²⁺ tipe L yang lebih lambat." },
        { q: "Asetilkolin dari vagus menurunkan HR terutama dengan cara…",
          options: ["Menaikkan ambang ke +10 mV", "Membuat MDP lebih negatif dan memperlandai fase 4", "Memperpendek repolarisasi", "Membuka kanal Ca²⁺ tipe L"], answer: 1,
          explain: "ACh membuka kanal K⁺-ACh (hiperpolarisasi → MDP lebih negatif) dan menurunkan cAMP (If berkurang → fase 4 lebih landai). Keduanya memperlama waktu mencapai ambang." },
        { q: "Seorang pasien transplantasi jantung memiliki HR istirahat ±100 x/menit. Penjelasan yang paling tepat?",
          options: ["Jantung donor lebih kecil", "Jantung tanpa persarafan berdenyut pada laju intrinsik SA node, tanpa rem vagus", "Simpatis menjadi lebih aktif", "AV node menjadi pacemaker"], answer: 1,
          explain: "Laju intrinsik SA node ±100 x/menit. Normalnya tonus vagus menurunkannya ke ±70. Jantung transplantasi tidak memiliki persarafan otonom, sehingga “rem” vagus hilang." },
        { q: "Jika SA node gagal, mengapa AV node yang biasanya mengambil alih, bukan Purkinje?",
          options: ["Karena AV node lebih dekat ke ventrikel", "Karena laju intrinsik AV node (40–60) lebih cepat daripada Purkinje (20–40)", "Karena Purkinje tidak memiliki potensial aksi", "Karena AV node dipersarafi simpatis"], answer: 1,
          explain: "Pemimpin ritme adalah sel yang mencapai ambang paling cepat. Setelah SA node, yang tercepat adalah AV junction." },
      ]},
    ],
  });
})();
