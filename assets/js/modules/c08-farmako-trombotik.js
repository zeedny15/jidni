/* Modul C8 — Farmakoterapi Penyakit Trombotik & Dislipidemia (Kuliah 13) */
(function () {
  /* Pembuluh dengan luka endotel & pembentukan trombus. st 0..5, blk: daftar obat yang menghambat */
  function V_THR(st, blk = [], note = "") {
    const B = (k) => blk.includes(k);
    let s = `<rect x="0" y="0" width="420" height="40" fill="#f3a6c4"/><rect x="0" y="40" width="420" height="140" fill="var(--o2-rich)" opacity=".1"/>
      <rect x="150" y="34" width="120" height="10" fill="#ffd8a8"/><text class="svg-label small" x="210" y="22" text-anchor="middle" style="font-weight:700">kolagen terpapar (endotel rusak / plak robek)</text>`;
    const pl = (x, y, act) => act ? `<path d="M${x - 9},${y} l4,-6 l5,4 l5,-6 l4,6 l-4,6 l-5,-4 l-5,6 z" fill="#adb5bd" stroke="#495057"/>` : `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" fill="#ced4da" stroke="#868e96"/>`;
    if (st >= 1) { [170, 190, 210, 230, 250].forEach((x) => { s += pl(x, 52, st >= 2 && !B("asa") && !B("p2y")); s += `<line x1="${x}" y1="44" x2="${x}" y2="48" stroke="var(--accent)" stroke-width="2"/>`; }); s += `<text class="svg-label small" x="280" y="58" style="font-size:9.5px;fill:var(--accent)">vWF ↔ GP Ib (adhesi)</text>`; }
    if (st >= 2) {
      if (!B("asa")) s += `<text class="svg-label small" x="120" y="80" text-anchor="end" style="fill:var(--warn);font-weight:700">TXA₂ ⟶</text>`;
      if (!B("p2y")) s += `<text class="svg-label small" x="300" y="80" style="fill:var(--warn);font-weight:700">⟵ ADP</text>`;
    }
    const aggOK = st >= 3 && !B("gp") && !(B("asa") && B("p2y"));
    const nAgg = st >= 3 ? (B("gp") ? 0 : B("asa") && B("p2y") ? 2 : B("asa") || B("p2y") ? 5 : 9) : 0;
    for (let i = 0; i < nAgg; i++) { const x = 175 + (i % 4) * 22, y = 66 + Math.floor(i / 4) * 14; s += pl(x, y, true); if (aggOK) s += `<line x1="${x}" y1="${y}" x2="${x + 22}" y2="${y}" stroke="#f08c00" stroke-width="1.5" stroke-dasharray="2 2"/>`; }
    if (st >= 3 && nAgg) s += `<text class="svg-label small" x="280" y="92" style="font-size:9.5px;fill:#e67700">GP IIb/IIIa + fibrinogen</text>`;
    if (st >= 4 && !B("tpa")) { s += `<path d="M150,44 C160,${130 - nAgg * 2} 260,${130 - nAgg * 2} 270,44" fill="none" stroke="#c92a2a" stroke-width="1.5"/>`; for (let i = 0; i < 14; i++) s += `<line x1="${150 + i * 9}" y1="44" x2="${160 + i * 7}" y2="${100 + (i % 3) * 10}" stroke="#c92a2a" stroke-width="1"/>`; s += `<ellipse cx="200" cy="105" rx="6" ry="3" fill="#e03131"/><ellipse cx="228" cy="112" rx="6" ry="3" fill="#e03131"/><text class="svg-label small" x="280" y="118" style="font-size:9.5px;fill:#c92a2a">jaring fibrin + eritrosit</text>`; }
    if (st >= 5 || B("tpa")) s += `<text class="svg-label small" x="210" y="160" text-anchor="middle" style="fill:var(--ok);font-weight:700">${B("tpa") ? "plasmin memecah fibrin → trombus larut (FDP, D-dimer)" : ""}</text>`;
    blk.forEach((k, i) => { const lab = { asa: "Aspirin ✕ COX-1/TXA₂", p2y: "Klopidogrel/tikagrelor ✕ P2Y12", gp: "Penghambat GP IIb/IIIa ✕ agregasi", tpa: "Alteplase: plasminogen → plasmin" }[k]; s += `<rect x="10" y="${126 + i * 0}" width="0" height="0"/><text class="svg-label small" x="12" y="${140 + i * 14}" style="fill:var(--bad);font-weight:800">${lab}</text>`; });
    if (note) s += `<text class="svg-label small" x="210" y="176" text-anchor="middle">${note}</text>`;
    return `<svg viewBox="0 0 420 185" role="img" aria-label="Pembentukan trombus">${s}</svg>`;
  }
  /* Hepatosit & statin */
  function V_LIV(intensity = 0, eze = false) {
    const rec = 3 + intensity * 3, ldl = Math.max(3, 14 - intensity * 3 - (eze ? 2 : 0));
    let s = `<rect x="20" y="20" width="230" height="190" rx="30" fill="var(--warn-soft)" stroke="var(--warn)"/><text class="svg-label small" x="135" y="40" text-anchor="middle" style="font-weight:700">Hepatosit</text>
      <g class="svg-label small" style="font-size:10px"><text x="40" y="70">Asetil-KoA</text><text x="40" y="96">HMG-KoA</text><text x="40" y="150">Mevalonat</text><text x="40" y="178">Kolesterol</text></g>
      <line x1="60" y1="74" x2="60" y2="86" stroke="var(--text-soft)"/><line x1="60" y1="100" x2="60" y2="140" stroke="var(--text-soft)" stroke-width="2"/><line x1="60" y1="154" x2="60" y2="168" stroke="var(--text-soft)"/>
      <text class="svg-label small" x="70" y="122" style="font-size:9.5px">HMG-KoA reduktase</text>
      ${intensity ? `<circle cx="60" cy="120" r="11" fill="var(--bad)"/><text x="60" y="125" text-anchor="middle" font-size="13" fill="#fff" font-weight="800">✕</text><text class="svg-label small" x="70" y="136" style="fill:var(--bad);font-weight:800;font-size:9.5px">STATIN</text>` : ""}
      <text class="svg-label small" x="40" y="200" style="font-size:9.5px">${intensity ? "kolesterol intrasel ↓ → SREBP aktif → reseptor LDL ↑" : "kolesterol intrasel cukup"}</text>`;
    for (let i = 0; i < rec; i++) { const y = 50 + i * (150 / Math.max(rec, 1)); s += `<path d="M250,${y} h12 m-6,-6 v12" stroke="var(--ok)" stroke-width="3"/>`; }
    s += `<text class="svg-label small" x="262" y="214" style="fill:var(--ok);font-size:9.5px">reseptor LDL: ${rec}</text>`;
    s += `<rect x="280" y="20" width="130" height="190" rx="14" fill="var(--o2-rich)" opacity=".08" stroke="var(--border)"/><text class="svg-label small" x="345" y="38" text-anchor="middle" style="font-weight:700">Darah</text>`;
    for (let i = 0; i < ldl; i++) s += `<circle cx="${300 + (i % 4) * 28}" cy="${60 + Math.floor(i / 4) * 34}" r="10" fill="#ffd43b" stroke="#f08c00"/><text x="${300 + (i % 4) * 28}" y="${64 + Math.floor(i / 4) * 34}" text-anchor="middle" font-size="7" fill="#7c4a03">LDL</text>`;
    if (eze) s += `<text class="svg-label small" x="345" y="200" text-anchor="middle" style="font-size:9px;fill:var(--accent)">+ ezetimib: absorpsi usus ↓</text>`;
    return `<svg viewBox="0 0 420 225" role="img" aria-label="Kerja statin di hati">${s}</svg>`;
  }

  const STEPS = [
    { title: "Trombus arteri vs vena", body: "Trombus <b>arteri</b> (SKA, stroke iskemik) terbentuk di aliran cepat pada plak yang robek → <b>kaya trombosit</b> (“trombus putih”) → dicegah dengan <b>antiplatelet</b>. Trombus <b>vena</b> (DVT, emboli paru) terbentuk di aliran lambat → <b>kaya fibrin</b> (“trombus merah”) → dicegah dengan <b>antikoagulan</b>. Trombus yang sudah terbentuk dapat <b>dilarutkan</b> dengan <b>trombolitik</b>.", key: "Antiplatelet → arteri. Antikoagulan → vena. Trombolitik → larutkan.", viz: V_THR(0, [], "dinding arteri normal") },
    { title: "① Adhesi trombosit", body: "Plak robek/endotel rusak memaparkan <b>kolagen</b>. <b>Faktor von Willebrand (vWF)</b> menjembatani kolagen dengan reseptor <b>GP Ib</b> trombosit → trombosit menempel.", key: "Adhesi = menempel.", viz: V_THR(1) },
    { title: "② Aktivasi", body: "Trombosit yang menempel berubah bentuk dan melepas penguat: <b>tromboksan A₂</b> (dibuat oleh <b>COX-1</b>) dan <b>ADP</b> (bekerja pada reseptor <b>P2Y12</b>). Keduanya mengaktifkan lebih banyak trombosit — umpan balik positif.", key: "Dua “sirene”: TXA₂ dan ADP.", viz: V_THR(2) },
    { title: "③ Agregasi", body: "Trombosit aktif memunculkan reseptor <b>GP IIb/IIIa</b>; <b>fibrinogen</b> menjembatani antartrombosit → gumpalan trombosit. Kaskade koagulasi lalu membentuk <b>jaring fibrin</b> yang mengikat eritrosit.", key: "GP IIb/IIIa = jalur akhir bersama agregasi.", viz: V_THR(4) },
    { title: "Aspirin", body: "Mengasetilasi <b>COX-1 secara ireversibel</b> → TXA₂ ↓ selama umur trombosit (7–10 hari). Dosis rendah (±75–160 mg/hari) cukup. Efek samping: <b>perdarahan saluran cerna</b>, dispepsia, bronkospasme pada asma sensitif aspirin. Dipakai pada SKA, pencegahan sekunder PJK & stroke iskemik.", key: "Efeknya bertahan ±1 minggu setelah dihentikan.", viz: V_THR(4, ["asa"], "aktivasi lewat TXA₂ hilang, agregasi berkurang") },
    { title: "Penghambat P2Y12", body: "<b>Klopidogrel</b> (prodrug, diaktifkan CYP2C19, ireversibel), <b>prasugrel</b> (ireversibel, lebih kuat), <b>tikagrelor</b> (reversibel, efek samping sesak). Kombinasi aspirin + P2Y12 = <b>antiplatelet ganda (DAPT)</b>, umumnya 12 bulan setelah SKA/pemasangan stent.", key: "DAPT = aspirin + penghambat P2Y12.", viz: V_THR(4, ["asa", "p2y"], "dua jalur aktivasi diblok") },
    { title: "Penghambat GP IIb/IIIa", body: "Abciximab, eptifibatid, tirofiban — <b>intravena</b>, menghambat <b>jalur akhir</b> agregasi. Dipakai terbatas pada PCI dengan beban trombus besar. Risiko perdarahan & trombositopenia.", key: "Paling kuat, paling berisiko perdarahan.", viz: V_THR(4, ["gp"], "agregasi hampir tidak terjadi") },
    { title: "Trombolitik (fibrinolitik)", body: "Mengubah <b>plasminogen → plasmin</b> yang memecah fibrin. <b>Streptokinase</b> (tidak spesifik fibrin, antigenik — tidak diulang), <b>alteplase</b> (rt-PA, spesifik fibrin), tenekteplase, reteplase. Indikasi: <b>STEMI</b> bila PCI primer tidak dapat dilakukan tepat waktu (ideal ≤12 jam onset), <b>stroke iskemik akut</b> (alteplase ≤4,5 jam), <b>emboli paru masif</b>.", key: "Efek samping utama: PERDARAHAN (termasuk intrakranial). Periksa kontraindikasi dulu!", viz: V_THR(4, ["tpa"]) },
    { title: "Dislipidemia & statin", body: "<b>Statin</b> (simvastatin, atorvastatin, rosuvastatin) menghambat <b>HMG-KoA reduktase</b> → sintesis kolesterol hati ↓ → hati memperbanyak <b>reseptor LDL</b> → LDL darah ditarik masuk → <b>LDL plasma turun</b> (intensitas tinggi ≥50%). Efek pleiotropik: <b>menstabilkan plak</b>, antiinflamasi, memperbaiki endotel.", key: "Statin dosis tinggi diberikan pada semua SKA bila tidak ada kontraindikasi.", viz: V_LIV(3) },
    { title: "Efek samping & obat lipid lain", body: "Statin: <b>mialgia/miopati</b>, jarang <b>rabdomiolisis</b> (risiko ↑ bila dikombinasi gemfibrozil, makrolid, antijamur azol — penghambat CYP3A4), <b>transaminase ↑</b>, sedikit risiko DM baru; <b>kontraindikasi hamil</b> & penyakit hati aktif. Tambahan: <b>ezetimib</b> (absorpsi kolesterol usus ↓), <b>penghambat PCSK9</b> (reseptor LDL tidak dihancurkan), <b>fibrat</b> (trigliserida ↓).", key: "Nyeri otot + urin gelap pada pengguna statin = curiga rabdomiolisis (periksa CK).", viz: V_LIV(3, true) },
  ];

  registerModule({
    id: "c08",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Mencegah gumpalan & membersihkan pipa", emoji: "💡", html: `
          <p>Dari C3: SKA = <b>plak robek + trombus</b>. Maka terapinya menyerang dua hal: <b>trombus</b> (antiplatelet, trombolitik) dan <b>plak/kolesterol</b> (statin).</p>
          <div class="table-wrap"><table class="table"><thead><tr><th>Golongan</th><th>Contoh</th><th>Target</th></tr></thead><tbody>
            <tr><td>Antiplatelet</td><td>Aspirin, klopidogrel, tikagrelor</td><td>COX-1, P2Y12, GP IIb/IIIa</td></tr>
            <tr><td>Trombolitik</td><td>Streptokinase, alteplase, tenekteplase</td><td>Plasminogen → plasmin</td></tr>
            <tr><td>Statin</td><td>Simvastatin, atorvastatin, rosuvastatin</td><td>HMG-KoA reduktase</td></tr></tbody></table></div>
          <p class="small muted">Materi untuk belajar mekanisme; dosis & keputusan terapi mengikuti pedoman (PERKI/ESC) dan supervisi.</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Dari trombosit sampai statin", emoji: "🎬", intro: "Ikuti pembentukan trombus, lalu lihat di mana tiap obat memutus rantainya.",
          viz: V_THR(0), steps: STEPS, autoplayMs: 8000 },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa aspirin dosis rendah cukup & efeknya lama?", nodes: ["Trombosit tidak memiliki inti → tidak bisa membuat COX-1 baru", "Aspirin mengasetilasi COX-1 secara ireversibel", "TXA₂ tidak terbentuk selama umur trombosit (7–10 hari)", "Dosis kecil harian sudah cukup memblok trombosit baru", "Sel endotel (berinti) tetap bisa membuat prostasiklin yang bersifat antiagregasi"] },
            { label: "Bagaimana statin menurunkan LDL darah?", nodes: ["Statin menghambat HMG-KoA reduktase di hati", "Kolesterol dalam hepatosit menurun", "Faktor transkripsi SREBP aktif", "Hati memproduksi lebih banyak reseptor LDL", "LDL ditarik dari darah → LDL plasma turun"] },
            { label: "Mengapa klopidogrel bisa “tidak mempan” pada sebagian orang?", nodes: ["Klopidogrel adalah prodrug", "Perlu diaktifkan enzim hati CYP2C19", "Sebagian orang (sering di Asia) punya varian CYP2C19 yang lemah", "Metabolit aktif sedikit → hambatan P2Y12 lemah", "Risiko trombosis stent lebih tinggi → alternatif tikagrelor/prasugrel"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Laboratorium trombus", emoji: "🧪", html: `
          <p>Nyalakan obat dan lihat pengaruhnya pada pembentukan trombus serta risiko perdarahan.</p>
          <div class="toggle-row" id="tl-btns"></div>
          <div class="viz-wrap" id="tl-viz"></div>
          <div class="bar-row"><div class="bar-label"><span>Ukuran trombus</span><b id="tl-s"></b></div><div class="bar"><span id="tl-sb" style="background:#c92a2a"></span></div></div>
          <div class="bar-row"><div class="bar-label"><span>Risiko perdarahan</span><b id="tl-b"></b></div><div class="bar"><span id="tl-bb" style="background:var(--warn)"></span></div></div>
          <div class="callout" id="tl-msg"></div>`,
          init(el) {
            const D = [["asa", "💊 Aspirin"], ["p2y", "💊 Klopidogrel"], ["gp", "💉 GP IIb/IIIa"], ["tpa", "💉 Alteplase"]]; const on = new Set();
            K.$("#tl-btns", el).innerHTML = D.map(([k, n]) => `<button class="btn btn-sm" data-k="${k}" type="button">${n}</button>`).join("");
            function upd() {
              const b = [...on];
              K.$$("#tl-btns button", el).forEach((x) => x.classList.toggle("on", on.has(x.dataset.k)));
              K.$("#tl-viz", el).innerHTML = V_THR(4, b);
              let size = 100; if (on.has("asa")) size -= 30; if (on.has("p2y")) size -= 35; if (on.has("gp")) size -= 60; if (on.has("tpa")) size -= 70; size = Math.max(5, size);
              let bleed = 5 + (on.has("asa") ? 15 : 0) + (on.has("p2y") ? 20 : 0) + (on.has("gp") ? 30 : 0) + (on.has("tpa") ? 45 : 0); bleed = Math.min(100, bleed);
              K.$("#tl-s", el).textContent = size + "%"; K.$("#tl-sb", el).style.width = size + "%"; K.$("#tl-b", el).textContent = bleed > 60 ? "tinggi" : bleed > 30 ? "sedang" : "rendah"; K.$("#tl-bb", el).style.width = bleed + "%";
              K.$("#tl-msg", el).innerHTML = `<p>${!b.length ? "Tanpa obat: trombus tumbuh dan dapat menyumbat arteri." : on.has("tpa") ? "Trombolitik melarutkan fibrin yang sudah terbentuk — tetapi juga melarutkan bekuan pelindung di tempat lain → risiko perdarahan tertinggi." : on.has("asa") && on.has("p2y") ? "DAPT: dua jalur aktivasi terblok — perlindungan lebih kuat dibanding satu obat, dengan risiko perdarahan lebih tinggi." : "Setiap obat menutup satu jalur. Prinsipnya selalu menimbang manfaat (cegah trombosis) vs risiko (perdarahan)."}</p>`;
            }
            K.$$("#tl-btns button", el).forEach((x) => x.addEventListener("click", () => { const k = x.dataset.k; on.has(k) ? on.delete(k) : on.add(k); upd(); }));
            upd();
          } },
        { heading: "Simulator statin", emoji: "🎚️", html: `
          <p>Pilih intensitas statin (dan ezetimib). Lihat reseptor LDL di hati dan partikel LDL di darah.</p>
          <div class="toggle-row" id="st-btns"></div><div class="toggle-row"><button class="btn btn-sm" id="st-eze" type="button">➕ Ezetimib</button></div>
          <div class="viz-wrap" id="st-viz"></div>
          <div class="readouts"><div class="readout"><span>LDL awal</span><b>190 mg/dL</b></div><div class="readout big"><span>Perkiraan LDL</span><b id="st-ldl"></b></div><div class="readout"><span>Penurunan</span><b id="st-pct"></b></div></div>
          <div class="callout" id="st-msg"></div>`,
          init(el) {
            const I = [["Tanpa statin", 0], ["Intensitas rendah (mis. simvastatin 10 mg)", .25], ["Intensitas sedang (mis. atorvastatin 10–20 mg)", .4], ["Intensitas tinggi (atorvastatin 40–80 / rosuvastatin 20–40 mg)", .55]];
            let lv = 0, eze = false;
            K.$("#st-btns", el).innerHTML = I.map(([n], i) => `<button class="btn btn-sm" data-i="${i}" type="button">${n}</button>`).join("");
            function upd() {
              K.$$("#st-btns button", el).forEach((b) => b.classList.toggle("on", +b.dataset.i === lv)); K.$("#st-eze", el).classList.toggle("on", eze);
              const red = 1 - (1 - I[lv][1]) * (eze ? .8 : 1), ldl = Math.round(190 * (1 - red));
              K.$("#st-viz", el).innerHTML = V_LIV(lv, eze);
              K.$("#st-ldl", el).innerHTML = `${ldl}<small> mg/dL</small>`; K.$("#st-pct", el).textContent = Math.round(red * 100) + "%";
              K.$("#st-msg", el).innerHTML = `<p>${lv ? "Semakin kuat hambatan sintesis kolesterol, semakin banyak reseptor LDL dipasang di hati → LDL darah makin rendah. Setiap penggandaan dosis statin hanya menambah penurunan LDL ±6% (“rule of 6”)." : "Tanpa statin, reseptor LDL sedikit dan LDL darah tinggi."}${eze ? " Ezetimib menambah penurunan ±20% dengan mengurangi absorpsi kolesterol di usus." : ""}</p>`;
            }
            K.$$("#st-btns button", el).forEach((b) => b.addEventListener("click", () => { lv = +b.dataset.i; upd(); }));
            K.$("#st-eze", el).addEventListener("click", () => { eze = !eze; upd(); });
            upd();
          } },
        { heading: "Bolehkah diberi trombolitik?", emoji: "✅", html: `
          <p>Pasien STEMI 2 jam, PCI tidak tersedia dalam 120 menit. Centang kondisi yang ada pada pasien.</p>
          <div class="toggle-row" id="ci-btns"></div>
          <div class="callout" id="ci-msg"></div>`,
          init(el) {
            const C = [["Riwayat perdarahan intrakranial kapan pun", "abs"], ["Stroke iskemik dalam 3 bulan terakhir", "abs"], ["Tumor/malformasi vaskular intrakranial", "abs"], ["Perdarahan aktif (bukan menstruasi)", "abs"], ["Curiga diseksi aorta", "abs"], ["Trauma kepala/wajah berat dalam 3 bulan", "abs"], ["Hipertensi tidak terkontrol (>180/110)", "rel"], ["Sedang memakai antikoagulan oral", "rel"], ["Kehamilan", "rel"], ["Resusitasi jantung paru traumatik/lama", "rel"]];
            const on = new Set();
            K.$("#ci-btns", el).innerHTML = C.map(([n], i) => `<button class="btn btn-sm" data-i="${i}" type="button">${n}</button>`).join("");
            function upd() {
              K.$$("#ci-btns button", el).forEach((b) => b.classList.toggle("on", on.has(+b.dataset.i)));
              const abs = [...on].filter((i) => C[i][1] === "abs").length, rel = on.size - abs;
              const m = K.$("#ci-msg", el);
              m.className = abs ? "callout red" : rel ? "callout warn" : "callout green";
              m.innerHTML = `<p>${abs ? `<b>⛔ Ada ${abs} kontraindikasi ABSOLUT</b> → jangan beri trombolitik; rujuk untuk PCI walau terlambat.` : rel ? `<b>⚠️ ${rel} kontraindikasi relatif</b> → timbang manfaat vs risiko perdarahan secara individual.` : "<b>✅ Tidak ada kontraindikasi</b> yang dicentang → fibrinolitik dapat diberikan (idealnya ≤10 menit setelah diagnosis STEMI), lalu rujuk ke pusat PCI."}</p>`;
            }
            K.$$("#ci-btns button", el).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.i; on.has(i) ? on.delete(i) : on.add(i); upd(); }));
            upd();
          } },
        { type: "match", heading: "Obat → target", emoji: "🧩", intro: "Ketuk obat, lalu target kerjanya.",
          pairs: [["Aspirin", "COX-1 (ireversibel) → TXA₂ ↓"], ["Klopidogrel", "Reseptor ADP P2Y12"], ["Eptifibatid", "Reseptor GP IIb/IIIa"], ["Alteplase", "Plasminogen → plasmin (spesifik fibrin)"], ["Atorvastatin", "HMG-KoA reduktase"], ["Ezetimib", "Absorpsi kolesterol di usus (NPC1L1)"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Tiga langkah trombosit “<b>A-A-A</b>”: <b>A</b>dhesi (vWF–GP Ib) → <b>A</b>ktivasi (TXA₂ & ADP) → <b>A</b>gregasi (GP IIb/IIIa + fibrinogen).</p></div>
            <div class="callout"><p class="mnemo">Target antiplatelet: “<b>A</b>spirin = <b>A</b>setilasi COX” · “<b>K</b>lopidogrel = <b>K</b>unci ADP” · “<b>-fiban/-tide/-mab</b> = GP IIb/IIIa”.</p></div>
            <div class="callout green"><p class="mnemo">Statin “<b>MUSKEL</b>”: <b>M</b>iopati · <b>U</b>rin gelap (rabdomiolisis) · <b>S</b>GPT ↑ · <b>K</b>ehamilan ❌ · <b>E</b>nzim CYP3A4 (interaksi) · <b>L</b>DL ↓.</p></div>
            <div class="callout warn"><p class="mnemo">Kontraindikasi absolut trombolitik “<b>PISTOL</b>”: <b>P</b>erdarahan aktif · <b>I</b>ntrakranial (riwayat perdarahan) · <b>S</b>troke iskemik <3 bln · <b>T</b>umor intrakranial · <b>O</b>ld head trauma berat <3 bln · <b>L</b>uka aorta (diseksi).</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Mengapa efek aspirin bertahan ±1 minggu?", "Hambatan COX-1 ireversibel; trombosit tak berinti (umur 7–10 hari)"], ["Klopidogrel diaktifkan oleh", "CYP2C19 (prodrug)"], ["Penghambat P2Y12 yang reversibel", "Tikagrelor"], ["Komponen DAPT", "Aspirin + penghambat P2Y12"], ["Trombolitik yang antigenik", "Streptokinase"], ["Trombolitik spesifik fibrin", "Alteplase, tenekteplase, reteplase"], ["Batas waktu alteplase pada stroke iskemik", "≤4,5 jam sejak onset"], ["Mekanisme statin menurunkan LDL", "HMG-KoA reduktase ↓ → reseptor LDL hati ↑"], ["Efek samping statin yang berbahaya", "Rabdomiolisis (periksa CK)"], ["Obat yang menurunkan absorpsi kolesterol usus", "Ezetimib"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Tebak masalahnya sebelum membuka kartu.", note: "Untuk latihan penalaran farmakologi; bukan pedoman dosis.",
          items: [
            { icon: "🩸", title: "Pengguna aspirin + klopidogrel, BAB hitam & pusing", chain: ["DAPT menekan fungsi trombosit + aspirin mengiritasi mukosa lambung", "Perdarahan saluran cerna atas", "Pertimbangkan PPI sebagai pencegahan pada pasien DAPT risiko tinggi"] },
            { icon: "💪", title: "Pasien simvastatin baru diberi klaritromisin, lalu nyeri otot hebat & urin seperti teh", chain: ["Klaritromisin menghambat CYP3A4 → kadar simvastatin melonjak", "Kerusakan otot rangka masif (rabdomiolisis)", "Hentikan statin, periksa CK & fungsi ginjal"] },
            { icon: "🧠", title: "Setelah streptokinase untuk STEMI: sakit kepala hebat & penurunan kesadaran", chain: ["Plasmin juga melarutkan bekuan pelindung", "Perdarahan intrakranial", "Hentikan infus, CT kepala, pertimbangkan antifibrinolitik (asam traneksamat), kriopresipitat"] },
            { icon: "🔁", title: "Pasien pernah mendapat streptokinase 6 bulan lalu, kini STEMI lagi", chain: ["Streptokinase berasal dari bakteri → memicu antibodi", "Pemberian ulang: alergi & efek kurang", "Pilih fibrinolitik spesifik fibrin (mis. alteplase/tenekteplase) atau PCI"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Aspirin dosis rendah mencegah trombosis arteri dengan cara…",
          options: ["Menghambat reseptor P2Y12", "Mengasetilasi COX-1 trombosit secara ireversibel sehingga TXA₂ berkurang", "Mengaktifkan plasminogen", "Menghambat HMG-KoA reduktase"], answer: 1,
          explain: "Tanpa TXA₂, aktivasi & agregasi trombosit berkurang. Efek bertahan seumur trombosit." },
        { q: "Mengapa trombolitik efektif pada STEMI tetapi tidak dipakai rutin pada NSTEMI?",
          options: ["Karena NSTEMI tidak ada trombus", "Karena pada NSTEMI arteri tidak tersumbat total dan uji klinis tidak menunjukkan manfaat, sementara risiko perdarahan tetap", "Karena NSTEMI selalu ringan", "Karena trombolitik hanya bekerja pada vena"], answer: 1,
          explain: "Manfaat fibrinolisis terbukti pada oklusi total (STEMI). Pada NSTEMI, trombus kaya trombosit & tidak oklusif — antiplatelet/antikoagulan + strategi invasif lebih tepat." },
        { q: "Statin menurunkan LDL plasma terutama karena…",
          options: ["Mengikat LDL di usus", "Meningkatkan jumlah reseptor LDL di hati setelah sintesis kolesterol intrasel dihambat", "Menghancurkan LDL di darah", "Meningkatkan lipoprotein lipase"], answer: 1,
          explain: "Kolesterol intrasel ↓ → SREBP aktif → reseptor LDL ↑ → klirens LDL dari darah ↑." },
        { q: "Kondisi berikut merupakan kontraindikasi ABSOLUT pemberian fibrinolitik:",
          options: ["Usia 70 tahun", "Riwayat perdarahan intrakranial", "Diabetes melitus", "Menstruasi"], answer: 1,
          explain: "Riwayat perdarahan intrakranial (kapan pun) merupakan kontraindikasi absolut karena risiko perdarahan ulang." },
        { q: "Pasien dengan varian CYP2C19 yang lemah kemungkinan mendapat efek antiplatelet yang kurang dari…",
          options: ["Aspirin", "Klopidogrel", "Tikagrelor", "Eptifibatid"], answer: 1,
          explain: "Klopidogrel adalah prodrug yang membutuhkan CYP2C19 untuk diaktifkan; tikagrelor tidak memerlukan aktivasi tersebut." },
      ]},
    ],
  });
})();
