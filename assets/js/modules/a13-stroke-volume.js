/* Modul A13 — Stroke Volume: Preload, Kontraktilitas, Afterload & Hukum Frank-Starling */
(function () {
  const V0 = 10, EES = 2.2, EA = 1.7;
  /** Model ventrikel sederhana (elastans) */
  function heart(edv, cf = 1, af = 1) {
    const stretch = Math.max(0, (edv - 165) / 70);
    const ees = EES * cf * (1 - 0.45 * Math.min(1, stretch));   // regangan berlebih → kurva mendatar
    const ea = EA * af;
    const esv = (ea * edv + ees * V0) / (ees + ea);
    const sv = edv - esv, pes = ea * sv;
    const edp = 0.8 * (Math.exp(0.022 * (edv - V0)) - 1);
    return { edv, esv, sv, pes, edp, ef: sv / edv, ees, ea, pdia: pes * 0.72 };
  }
  // sarkomer: panjang 1,8–2,4 µm
  const sl = (edv) => K.clamp(1.75 + (edv - 60) / 120 * 0.6, 1.6, 2.5);

  function loopPath(h, PX, PY) {
    const pts = [];
    const edpv = (v) => 0.8 * (Math.exp(0.022 * (v - V0)) - 1);
    for (let i = 0; i <= 20; i++) { const v = h.esv + (h.edv - h.esv) * i / 20; pts.push([v, edpv(v)]); }   // pengisian
    pts.push([h.edv, h.pdia]);                                                                          // kontraksi isovolumetrik
    for (let i = 1; i <= 20; i++) { const f = i / 20, v = h.edv - (h.edv - h.esv) * f; pts.push([v, K.keys([[0, h.pdia], [0.5, h.pes * 1.1], [1, h.pes]], f)]); }
    pts.push([h.esv, edpv(h.esv)]);                                                                     // relaksasi isovolumetrik
    return "M" + pts.map(([v, p]) => PX(v).toFixed(1) + "," + PY(p).toFixed(1)).join("L") + "Z";
  }

  function sarcomere(len) {
    // gambar 1 sarkomer: garis Z di kedua sisi, aktin dari Z, miosin di tengah
    const w = len / 2.5 * 200, x0 = 110 - w / 2, x1 = 110 + w / 2, act = 0.95 / 2.5 * 200, myo = 1.6 / 2.5 * 200;
    let s = `<line x1="${x0}" y1="8" x2="${x0}" y2="62" stroke="var(--text)" stroke-width="3"/><line x1="${x1}" y1="8" x2="${x1}" y2="62" stroke="var(--text)" stroke-width="3"/>`;
    [16, 28, 42, 54].forEach((y) => { s += `<line x1="${x0}" y1="${y}" x2="${Math.min(x0 + act, 110)}" y2="${y}" stroke="var(--o2-rich)" stroke-width="3"/><line x1="${x1}" y1="${y}" x2="${Math.max(x1 - act, 110)}" y2="${y}" stroke="var(--o2-rich)" stroke-width="3"/>`; });
    [22, 35, 48].forEach((y) => { s += `<line x1="${110 - myo / 2}" y1="${y}" x2="${110 + myo / 2}" y2="${y}" stroke="var(--vein)" stroke-width="6" stroke-linecap="round"/>`; });
    return s;
  }
  const overlapText = (l) => l < 1.95 ? "Terlalu pendek: filamen aktin saling bertumpuk → gaya kecil" : l <= 2.3 ? "Mendekati optimal (±2,2 µm): tumpang-tindih aktin–miosin ideal → gaya maksimal" : "Teregang berlebihan: tumpang-tindih berkurang → gaya mulai turun";

  const VIZ = `<svg viewBox="0 0 420 250" role="img" aria-label="Ventrikel dan sarkomer">
      <text class="svg-label small" x="105" y="16" text-anchor="middle">Ventrikel kiri</text>
      <ellipse id="sv-edv" cx="105" cy="125" rx="80" ry="95" fill="none" stroke="var(--text-soft)" stroke-dasharray="5 4"/>
      <ellipse id="sv-lv" cx="105" cy="125" rx="80" ry="95" fill="var(--o2-rich)" opacity=".85"/>
      <text id="sv-vol" class="svg-label" x="105" y="130" text-anchor="middle" style="fill:#fff"></text>
      <text class="svg-label small" x="315" y="16" text-anchor="middle">Satu sarkomer</text>
      <g id="sv-sarc" transform="translate(205 30)"></g>
      <text id="sv-sl" class="svg-label small" x="315" y="112" text-anchor="middle"></text>
      <g transform="translate(220 130)">
        <rect width="190" height="110" rx="12" fill="var(--surface)" stroke="var(--border)"/>
        <text class="svg-label small" x="12" y="22">EDV</text><text id="r-edv" class="svg-label" x="178" y="22" text-anchor="end"></text>
        <text class="svg-label small" x="12" y="46">ESV</text><text id="r-esv" class="svg-label" x="178" y="46" text-anchor="end"></text>
        <text class="svg-label small" x="12" y="72">SV = EDV − ESV</text><text id="r-sv" class="svg-label" x="178" y="72" text-anchor="end" style="fill:var(--primary)"></text>
        <text class="svg-label small" x="12" y="98">EF</text><text id="r-ef" class="svg-label" x="178" y="98" text-anchor="end"></text>
      </g>
    </svg>`;

  const STEPS = [
    { title: "SV = EDV − ESV", body: "Stroke volume adalah selisih volume ventrikel di akhir pengisian (<b>EDV</b>) dan di akhir ejeksi (<b>ESV</b>). Tiga faktor menentukannya: <b>preload</b>, <b>kontraktilitas</b>, dan <b>afterload</b>.", key: "Garis putus-putus = ukuran saat EDV; isi merah mengecil sampai ESV.", p: [130, 1, 1] },
    { title: "Preload = regangan sebelum kontraksi", body: "<b>Preload</b> adalah seberapa teregang serat otot ventrikel di akhir diastol — praktisnya diwakili oleh <b>EDV</b>. Ditentukan oleh aliran balik vena, waktu pengisian (HR), dan kelenturan ventrikel.", key: "Lebih banyak darah masuk → serat lebih teregang (sarkomer lebih panjang).", p: [165, 1, 1] },
    { title: "Hukum Frank-Starling", body: "Semakin teregang serat (hingga batas tertentu), semakin <b>kuat</b> kontraksinya: tumpang-tindih aktin–miosin makin optimal dan sensitivitas troponin terhadap Ca²⁺ meningkat. Hasilnya: <b>EDV ↑ → SV ↑</b>.", key: "“Jantung memompa apa yang diterimanya.” Inilah yang menyamakan output VKa & VKi (A1).", p: [165, 1, 1], cmp: [110, 1, 1] },
    { title: "Kontraktilitas (inotropi)", body: "<b>Kontraktilitas</b> = kekuatan kontraksi pada <b>panjang serat yang sama</b>. Simpatis/epinefrin (β1) menambah Ca²⁺ masuk → kontraksi lebih kuat → <b>ESV ↓ → SV ↑</b>. Hipoksia, asidosis, dan gagal jantung menurunkannya.", key: "Preload sama, kontraktilitas ↑ → ventrikel memeras lebih habis.", p: [130, 1.8, 1] },
    { title: "Afterload = beban saat ejeksi", body: "<b>Afterload</b> adalah tekanan yang harus dilawan ventrikel untuk mengeluarkan darah — terutama tekanan aorta/resistensi perifer. Afterload ↑ → katup aorta lebih lama terbuka, ejeksi berhenti lebih awal → <b>ESV ↑ → SV ↓</b>.", key: "Mendorong pintu yang ditahan dari luar: makin berat, makin sedikit yang lewat.", p: [130, 1, 1.9] },
    { title: "Ringkasan tiga faktor", body: "<ul class='key-points'><li><span class='k-ico'>⬆️</span><span>Preload ↑ → SV ↑ (Frank-Starling)</span></li><li><span class='k-ico'>💪</span><span>Kontraktilitas ↑ → SV ↑</span></li><li><span class='k-ico'>🧱</span><span>Afterload ↑ → SV ↓</span></li></ul>", key: "Ketiganya bisa kamu mainkan di bagian Interaksi.", p: [130, 1, 1] },
  ];

  registerModule({
    id: "a13",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Seberapa banyak darah per denyut?", emoji: "💡", html: `
          <p>Di A11: CO = HR × SV. Di A12 kamu melihat bagaimana HR diatur. Sekarang komponen keduanya: <b>stroke volume</b>.</p>
          <ul class="key-points">
            <li><span class="k-ico">🎈</span><span><b>Preload</b> — seberapa penuh/teregang ventrikel sebelum memompa.</span></li>
            <li><span class="k-ico">💪</span><span><b>Kontraktilitas</b> — seberapa kuat otot memeras.</span></li>
            <li><span class="k-ico">🧱</span><span><b>Afterload</b> — seberapa berat beban yang harus didorong.</span></li>
          </ul>
          <div class="callout"><p>Analogi: <b>ketapel</b>. Ditarik lebih jauh (preload) → lontaran lebih kuat. Karet lebih kuat (kontraktilitas) → lebih kuat lagi. Melontarkan batu berat (afterload) → jarak lebih pendek.</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Tiga penentu stroke volume", emoji: "🎬", intro: "Ventrikel berdenyut dengan parameter tiap langkah. Perhatikan panjang sarkomer dan angka SV.",
          viz: VIZ, steps: STEPS,
          onStep(i, s, api) { api._p = s.p; api._cmp = s.cmp; },
          init(api, secEl) {
            const v = api.viz; let t = 0, alt = 0;
            const R = (vol) => Math.sqrt(vol / 130);
            K.loop(secEl, (dt) => {
              if (!api._p) return;
              t += dt;
              if (api._cmp) alt = Math.floor(t / 2.4) % 2; else alt = 0;
              const p = alt ? api._cmp : api._p, h = heart(p[0], p[1], p[2]);
              const ph = (t * 0.9) % 1;               // fase denyut
              const vol = ph < .35 ? h.edv - (h.edv - h.esv) * Math.sin(ph / .35 * Math.PI / 2) : ph < .45 ? h.esv : h.esv + (h.edv - h.esv) * Math.min(1, (ph - .45) / .4);
              const e = K.$("#sv-lv", v), r = R(vol);
              e.setAttribute("rx", 80 * r * .9); e.setAttribute("ry", 95 * r * .9);
              const d = K.$("#sv-edv", v), rd = R(h.edv); d.setAttribute("rx", 80 * rd * .9); d.setAttribute("ry", 95 * rd * .9);
              K.$("#sv-vol", v).textContent = Math.round(vol) + " mL";
              const L = sl(h.edv) - (ph < .45 ? 0.35 * Math.sin(Math.min(ph / .35, 1) * Math.PI / 2) : 0.35 * (1 - Math.min(1, (ph - .45) / .4)));
              K.$("#sv-sarc", v).innerHTML = sarcomere(L);
              K.$("#sv-sl", v).textContent = `Panjang saat EDV: ${sl(h.edv).toFixed(2).replace(".", ",")} µm${alt ? " (preload rendah)" : ""}`;
              K.$("#r-edv", v).textContent = Math.round(h.edv) + " mL"; K.$("#r-esv", v).textContent = Math.round(h.esv) + " mL";
              K.$("#r-sv", v).textContent = Math.round(h.sv) + " mL"; K.$("#r-ef", v).textContent = Math.round(h.ef * 100) + "%";
            });
          } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa regangan menambah kekuatan?", nodes: ["Aliran balik vena ↑ → EDV ↑", "Serat otot ventrikel teregang → sarkomer memanjang mendekati ±2,2 µm", "Tumpang-tindih aktin–miosin makin optimal & jarak antarfilamen mengecil", "Troponin C lebih peka terhadap Ca²⁺ → lebih banyak jembatan silang", "Kontraksi lebih kuat → SV ↑ (Frank-Starling)"] },
            { label: "Mengapa output VKa = VKi?", nodes: ["Misalkan VKa sesaat memompa lebih banyak", "Lebih banyak darah sampai ke paru lalu ke atrium kiri", "Preload VKi naik → Frank-Starling → SV VKi naik", "VKi memompa lebih banyak sampai sama dengan VKa", "Output kedua ventrikel kembali seimbang secara otomatis"] },
            { label: "Mengapa afterload tinggi menurunkan SV?", nodes: ["Tekanan aorta tinggi (mis. hipertensi)", "Ventrikel butuh tekanan lebih tinggi sebelum katup aorta terbuka", "Sebagian besar energi kontraksi dipakai untuk menaikkan tekanan", "Ejeksi berhenti saat volume masih banyak → ESV ↑", "SV ↓ — dan jangka panjang dinding menebal (hipertrofi)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Laboratorium PV loop & kurva Frank-Starling", emoji: "🎚️", html: `
          <p>Geser ketiga faktor. Loop merah = kondisi sekarang, loop abu-abu = normal. Lebar loop = SV.</p>
          <div class="slider-row"><label for="pre">🎈 Preload (EDV) <output id="pre-o"></output></label><input type="range" id="pre" min="70" max="200" value="130"></div>
          <div class="slider-row"><label for="con">💪 Kontraktilitas <output id="con-o"></output></label><input type="range" id="con" min="40" max="200" value="100"></div>
          <div class="slider-row"><label for="aft">🧱 Afterload <output id="aft-o"></output></label><input type="range" id="aft" min="50" max="220" value="100"></div>
          <div class="btn-row" id="sv-pre" style="margin-bottom:10px"></div>
          <div class="two-col">
            <div class="viz-wrap"><svg id="pvl" viewBox="0 0 300 250" role="img" aria-label="Loop tekanan volume"></svg></div>
            <div class="viz-wrap"><svg id="fs" viewBox="0 0 300 250" role="img" aria-label="Kurva Frank-Starling"></svg></div>
          </div>
          <div class="readouts">
            <div class="readout big"><span>Stroke volume</span><b id="o-sv"></b></div>
            <div class="readout"><span>ESV</span><b id="o-esv"></b></div>
            <div class="readout"><span>EF</span><b id="o-ef"></b></div>
            <div class="readout"><span>Tekanan sistolik akhir</span><b id="o-pes"></b></div>
          </div>
          <div class="callout" id="sv-msg"></div>`,
          init(el) {
            const pre = K.$("#pre", el), con = K.$("#con", el), aft = K.$("#aft", el);
            const PX = (v) => 36 + (v - 0) / 220 * 255, PY = (p) => 222 - p / 200 * 205;
            const FX = (v) => 36 + (v - 50) / 170 * 255, FY = (s) => 222 - s / 160 * 205;
            const axes = (xl, yl) => `<line class="svg-axis" x1="36" y1="12" x2="36" y2="222"/><line class="svg-axis" x1="36" y1="222" x2="295" y2="222"/><text class="svg-label small" x="165" y="244" text-anchor="middle">${xl}</text><text class="svg-label small" x="10" y="118" transform="rotate(-90 10 118)" text-anchor="middle">${yl}</text>`;
            const base = heart(130, 1, 1);
            K.$("#pvl", el).innerHTML = axes("Volume VKi (mL)", "Tekanan VKi (mmHg)") +
              `<path d="${K.plot((v) => 0.8 * (Math.exp(0.022 * (v - V0)) - 1), 10, 215, PX, PY, 60)}" fill="none" stroke="var(--text-soft)" stroke-dasharray="3 4"/>
               <text class="svg-label small" x="${PX(205)}" y="${PY(55)}" text-anchor="end" style="font-size:9.5px">EDPVR</text>
               <path d="${loopPath(base, PX, PY)}" fill="none" stroke="var(--text-soft)" stroke-width="2" stroke-dasharray="5 4"/>
               <line id="espvr" stroke="var(--accent)" stroke-dasharray="4 3"/><text id="espvr-t" class="svg-label small" style="fill:var(--accent);font-size:9.5px">ESPVR (kontraktilitas)</text>
               <line id="ea" stroke="var(--warn)" stroke-dasharray="4 3"/><text id="ea-t" class="svg-label small" style="fill:var(--warn);font-size:9.5px">beban arteri (afterload)</text>
               <path id="loop" fill="var(--primary-soft)" fill-opacity=".6" stroke="var(--primary)" stroke-width="3"/>
               <line id="sv-arrow" stroke="var(--ok)" stroke-width="3"/><text id="sv-t" class="svg-label small" style="fill:var(--ok);font-weight:700" text-anchor="middle">SV</text>`;
            K.$("#fs", el).innerHTML = axes("EDV / preload (mL)", "Stroke volume (mL)") +
              `<path id="fs-base" fill="none" stroke="var(--text-soft)" stroke-width="2" stroke-dasharray="5 4"/>
               <path id="fs-cur" fill="none" stroke="var(--primary)" stroke-width="3"/><circle id="fs-dot" r="6" fill="var(--primary)" stroke="#fff" stroke-width="2"/>
               <text class="svg-label small" x="290" y="20" text-anchor="end">— — normal</text>`;
            K.$("#fs-base", el).setAttribute("d", K.plot((e) => heart(e, 1, 1).sv, 60, 215, FX, FY, 80));
            const PRE = [["🩸 Perdarahan", 85, 100, 100], ["💧 Infus cairan", 165, 100, 100], ["💉 Dobutamin (inotropik +)", 130, 170, 100], ["💔 Gagal jantung", 175, 50, 115], ["📈 Hipertensi", 130, 100, 190], ["🌀 Vasodilator", 130, 100, 65]];
            K.$("#sv-pre", el).innerHTML = PRE.map((p, i) => `<button class="btn btn-sm" data-i="${i}" type="button">${p[0]}</button>`).join("") + `<button class="btn btn-sm" data-i="r" type="button">↺ Normal</button>`;
            K.$$("#sv-pre button", el).forEach((b) => b.addEventListener("click", () => { const p = b.dataset.i === "r" ? [0, 130, 100, 100] : PRE[+b.dataset.i]; pre.value = p[1]; con.value = p[2]; aft.value = p[3]; upd(); }));
            function upd() {
              const E = +pre.value, cf = +con.value / 100, af = +aft.value / 100, h = heart(E, cf, af);
              K.$("#pre-o", el).textContent = E + " mL"; K.$("#con-o", el).textContent = Math.round(cf * 100) + "%"; K.$("#aft-o", el).textContent = Math.round(af * 100) + "%";
              K.$("#loop", el).setAttribute("d", loopPath(h, PX, PY));
              const es = K.$("#espvr", el); es.setAttribute("x1", PX(V0)); es.setAttribute("y1", PY(0)); const vTop = V0 + 195 / h.ees; es.setAttribute("x2", PX(vTop)); es.setAttribute("y2", PY(195));
              K.$("#espvr-t", el).setAttribute("x", Math.min(PX(vTop) + 4, 200)); K.$("#espvr-t", el).setAttribute("y", PY(185));
              const ea = K.$("#ea", el); ea.setAttribute("x1", PX(h.edv)); ea.setAttribute("y1", PY(0)); const vEa = Math.max(5, h.edv - 190 / h.ea); ea.setAttribute("x2", PX(vEa)); ea.setAttribute("y2", PY(h.ea * (h.edv - vEa)));
              K.$("#ea-t", el).setAttribute("x", PX(vEa) - 2); K.$("#ea-t", el).setAttribute("y", PY(h.ea * (h.edv - vEa)) - 4); K.$("#ea-t", el).setAttribute("text-anchor", "start");
              const ar = K.$("#sv-arrow", el); ar.setAttribute("x1", PX(h.esv)); ar.setAttribute("x2", PX(h.edv)); ar.setAttribute("y1", PY(-6) - 2); ar.setAttribute("y2", PY(-6) - 2);
              K.$("#sv-t", el).setAttribute("x", (PX(h.esv) + PX(h.edv)) / 2); K.$("#sv-t", el).setAttribute("y", PY(-6) - 6);
              K.$("#fs-cur", el).setAttribute("d", K.plot((e) => heart(e, cf, af).sv, 60, 215, FX, FY, 80));
              K.$("#fs-dot", el).setAttribute("cx", FX(E)); K.$("#fs-dot", el).setAttribute("cy", FY(h.sv));
              K.$("#o-sv", el).innerHTML = `${Math.round(h.sv)}<small> mL</small>`; K.$("#o-esv", el).innerHTML = `${Math.round(h.esv)}<small> mL</small>`;
              K.$("#o-ef", el).textContent = Math.round(h.ef * 100) + "%"; K.$("#o-pes", el).innerHTML = `${Math.round(h.pes)}<small> mmHg</small>`;
              const msgs = [];
              if (E > 175) msgs.push("Preload sangat tinggi: kurva Frank-Starling mulai <b>mendatar</b> — tambahan regangan hampir tidak menambah SV, sementara tekanan diastolik (EDPVR) naik tajam → risiko kongesti.");
              else if (E > 140) msgs.push("Preload ↑ → serat lebih teregang → <b>SV ↑</b> (bergerak ke kanan di kurva Frank-Starling).");
              else if (E < 110) msgs.push("Preload ↓ → serat kurang teregang → <b>SV ↓</b>.");
              if (cf > 1.15) msgs.push("Kontraktilitas ↑ → garis ESPVR lebih curam → ESV ↓ → <b>SV ↑</b>; kurva Frank-Starling bergeser ke atas.");
              if (cf < .85) msgs.push("Kontraktilitas ↓ → ESPVR landai → ESV ↑ → <b>SV ↓</b>; kurva Frank-Starling bergeser ke bawah.");
              if (af > 1.15) msgs.push("Afterload ↑ → tekanan sistolik akhir lebih tinggi, ejeksi berhenti lebih awal → ESV ↑ → <b>SV ↓</b>.");
              if (af < .85) msgs.push("Afterload ↓ → ejeksi lebih mudah → ESV ↓ → <b>SV ↑</b>.");
              K.$("#sv-msg", el).innerHTML = `<p>${msgs.join(" ") || "Kondisi normal: EDV ±130 mL, ESV ±60 mL, SV ±70 mL, EF ±55%."}</p>`;
            }
            [pre, con, aft].forEach((s) => s.addEventListener("input", upd)); upd();
          } },
        { type: "match", heading: "Faktor mana yang berubah?", emoji: "🧩", intro: "Ketuk kondisi di kiri, lalu faktor utama yang berubah di kanan.",
          pairs: [["Perdarahan hebat", "Preload ↓"], ["Infus cairan cepat", "Preload ↑"], ["Stimulasi simpatis / epinefrin", "Kontraktilitas ↑"], ["Stenosis aorta / hipertensi berat", "Afterload ↑"], ["Infark miokard luas", "Kontraktilitas ↓"]] },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika faktor SV terganggu…", emoji: "🩺", intro: "Gunakan logika preload–kontraktilitas–afterload.",
          items: [
            { icon: "💔", title: "Gagal jantung sistolik", chain: ["Kontraktilitas turun → kurva Frank-Starling bergeser ke bawah", "Untuk mempertahankan SV, tubuh menahan cairan → preload ↑", "Ventrikel sangat teregang; tekanan diastolik tinggi → kongesti paru & edema"] },
            { icon: "🩸", title: "Syok hipovolemik", chain: ["Volume darah berkurang", "Preload (EDV) turun → SV turun (Frank-Starling)", "Penanganan awal: mengembalikan volume (cairan/darah) untuk menaikkan preload"] },
            { icon: "📈", title: "Hipertensi kronik", chain: ["Afterload tinggi terus-menerus", "Ventrikel harus menghasilkan tekanan lebih besar setiap denyut", "Dinding VKi menebal (hipertrofi konsentrik) dan lama-lama bisa gagal"] },
            { icon: "💊", title: "Obat yang menyasar SV", chain: ["Diuretik → preload ↓ (mengurangi kongesti)", "Vasodilator/ACE inhibitor → afterload ↓ (ejeksi lebih mudah)", "Inotropik (mis. dobutamin) → kontraktilitas ↑"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Menurut hukum Frank-Starling, apa yang terjadi bila aliran balik vena meningkat (dalam batas fisiologis)?",
          options: ["SV turun karena ventrikel kelelahan", "EDV ↑ → serat lebih teregang → kontraksi lebih kuat → SV ↑", "HR turun secara otomatis", "Kontraktilitas intrinsik berubah"], answer: 1,
          explain: "Frank-Starling adalah mekanisme intrinsik: peningkatan preload menambah panjang sarkomer menuju optimal dan sensitivitas Ca²⁺, sehingga kekuatan kontraksi dan SV meningkat." },
        { q: "Perbedaan utama antara peningkatan <b>kontraktilitas</b> dan efek Frank-Starling adalah…",
          options: ["Kontraktilitas meningkatkan kekuatan pada panjang serat yang sama", "Kontraktilitas hanya bergantung pada EDV", "Frank-Starling memerlukan saraf simpatis", "Keduanya identik"], answer: 0,
          explain: "Frank-Starling = kekuatan naik karena serat lebih teregang. Kontraktilitas (inotropi) = kekuatan naik pada panjang yang sama, misalnya karena Ca²⁺ lebih banyak akibat β1." },
        { q: "Seorang pasien dengan stenosis aorta berat. Efek langsung pada SV (bila faktor lain tetap)?",
          options: ["SV naik karena afterload turun", "SV turun karena afterload naik sehingga ESV meningkat", "SV tidak berubah", "SV naik karena preload turun"], answer: 1,
          explain: "Katup sempit menambah beban yang harus dilawan saat ejeksi (afterload ↑). Ejeksi berhenti lebih awal → ESV ↑ → SV ↓." },
        { q: "Bagaimana hukum Frank-Starling menjaga agar output VKa dan VKi tetap sama?",
          options: ["Dengan mengubah HR kedua ventrikel secara berbeda", "Bila VKa memompa lebih banyak, preload VKi naik sehingga SV VKi ikut naik", "Dengan menutup katup mitral lebih lama", "Melalui refleks baroreseptor saja"], answer: 1,
          explain: "Kelebihan darah dari VKa tiba di AKi → EDV VKi ↑ → SV VKi ↑ hingga seimbang. Ini mekanisme intrinsik, tanpa perlu saraf." },
        { q: "Mengapa memberikan cairan berlebihan pada jantung yang sudah sangat teregang tidak banyak menaikkan SV?",
          options: ["Karena cairan langsung keluar lewat ginjal", "Karena kurva Frank-Starling mendatar pada preload sangat tinggi, sedangkan tekanan diastolik terus naik", "Karena afterload turun", "Karena kontraktilitas otomatis meningkat"], answer: 1,
          explain: "Di bagian datar kurva, tambahan EDV hampir tidak menambah SV, tetapi EDPVR yang curam membuat tekanan pengisian melonjak → kongesti paru." },
      ]},
    ],
  });
})();
