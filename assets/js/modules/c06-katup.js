/* Modul C6 — Kelainan Katup Jantung (Kuliah 11) */
(function () {
  const C = 800;
  const BASE = {
    lv: [[0, 6], [60, 8], [100, 10], [110, 12], [160, 82], [230, 120], [270, 118], [380, 96], [420, 40], [460, 6], [480, 3], [580, 4], [800, 6]],
    ao: [[0, 84], [110, 81], [160, 80], [230, 118], [270, 117], [380, 98], [388, 93], [402, 99], [460, 96], [800, 85]],
    la: [[0, 6], [60, 10], [110, 7], [130, 9], [170, 4], [380, 12], [460, 14], [520, 6], [580, 5], [800, 6]],
  };
  const LES = {
    normal: { n: "Normal", murmur: "none", s1: 1, s2: 1, P: BASE, big: [], thick: [] },
    ms: { n: "Stenosis mitral (MS)", murmur: "middia", s1: 1.4, s2: 1, big: ["la", "rv"], thick: [], valve: "mit", kind: "stenosis",
      P: { lv: BASE.lv, ao: BASE.ao, la: [[0, 24], [60, 30], [110, 22], [170, 18], [380, 26], [460, 30], [520, 26], [700, 24], [800, 24]] }, shade: "la-lv", shadeW: [460, 800],
      time: "Diastolik (mid-diastolik, “rumble”) + opening snap, S1 keras", loc: "Apeks, posisi dekubitus lateral kiri, bell stetoskop", why: "Lubang mitral sempit → tekanan AKi harus tinggi untuk mengisi VKi → <b>gradien AKi > VKi saat diastol</b>. AKi membesar → <b>fibrilasi atrium</b>, trombus; tekanan diteruskan ke paru → sesak, hipertensi pulmonal → beban VKa.", cause: "Hampir selalu akibat <b>penyakit jantung reumatik</b> (C5)." },
    mr: { n: "Regurgitasi mitral (MR)", murmur: "holo", s1: .7, s2: 1, big: ["la", "lv"], thick: [], valve: "mit", kind: "regurgitasi",
      P: { lv: BASE.lv, ao: BASE.ao, la: [[0, 8], [110, 10], [170, 18], [300, 38], [420, 40], [470, 20], [560, 10], [800, 8]] }, shade: "v", shadeW: [160, 420],
      time: "Holosistolik (pansistolik), meniup (blowing)", loc: "Apeks, menjalar ke aksila kiri", why: "Saat sistol sebagian darah VKi <b>bocor balik ke AKi</b> → gelombang v besar. Volume bolak-balik → <b>AKi & VKi kelebihan volume</b> → dilatasi.", cause: "Prolaps katup mitral, PJR, iskemia/ruptur m. papilaris, dilatasi VKi, endokarditis." },
    as: { n: "Stenosis aorta (AS)", murmur: "ejection", s1: 1, s2: .5, big: [], thick: ["lv"], valve: "aor", kind: "stenosis",
      P: { lv: [[0, 8], [60, 10], [110, 14], [160, 110], [260, 180], [330, 160], [390, 110], [430, 40], [470, 8], [800, 10]], ao: [[0, 76], [110, 72], [170, 72], [300, 108], [380, 104], [400, 96], [460, 92], [800, 78]], la: [[0, 10], [60, 16], [110, 10], [380, 14], [460, 16], [560, 9], [800, 10]] }, shade: "lv-ao", shadeW: [170, 380],
      time: "Ejeksi sistolik crescendo–decrescendo (bentuk berlian), S2 lemah", loc: "ICS 2 parasternal kanan (area aorta), menjalar ke karotis", why: "Katup aorta sempit → VKi harus membangun tekanan jauh lebih tinggi dari aorta (<b>gradien VKi > aorta saat sistol</b>) → <b>hipertrofi konsentrik</b> VKi (beban tekanan). Nadi kecil & lambat naik (<b>pulsus parvus et tardus</b>).", cause: "Kalsifikasi degeneratif (lansia), katup bikuspid kongenital (lebih muda), PJR." },
    ar: { n: "Regurgitasi aorta (AR)", murmur: "earlydia", s1: 1, s2: .8, big: ["lv"], thick: [], valve: "aor", kind: "regurgitasi",
      P: { lv: [[0, 22], [60, 24], [110, 26], [160, 70], [230, 150], [270, 148], [380, 110], [420, 40], [460, 12], [560, 18], [800, 22]], ao: [[0, 52], [110, 48], [160, 70], [230, 150], [270, 146], [380, 112], [400, 100], [460, 80], [600, 62], [800, 52]], la: BASE.la }, shade: "ao-lv", shadeW: [400, 800],
      time: "Diastolik dini (early diastolic), decrescendo, meniup", loc: "Titik Erb (ICS 3 parasternal kiri), duduk condong ke depan, ekspirasi", why: "Saat diastol darah aorta <b>bocor balik ke VKi</b> → diastolik aorta turun, SV total besar → <b>tekanan nadi sangat lebar</b> (nadi “water-hammer”). VKi kelebihan volume → <b>dilatasi eksentrik</b>.", cause: "Dilatasi pangkal aorta (hipertensi, Marfan), katup bikuspid, endokarditis, PJR." },
    mvp: { n: "Prolaps katup mitral (MVP)", murmur: "click", s1: 1, s2: 1, big: [], thick: [], valve: "mit", kind: "prolaps", P: BASE,
      time: "Klik mid-sistolik ± murmur sistolik akhir", loc: "Apeks", why: "Daun mitral “menggelembung” ke AKi saat sistol (degenerasi miksomatosa). Korda tiba-tiba menegang → <b>klik</b>; bila bocor → murmur MR akhir sistol.", cause: "Degenerasi miksomatosa; sering pada perempuan muda; terkait sindrom Marfan." },
  };

  const X = (t) => 30 + t / C * 180, Y = (p) => 150 - p / 190 * 135;
  function pressSVG(L) {
    const k = (arr) => (t) => K.keys(arr, t);
    const P = L.P;
    let shade = "";
    if (L.shade) {
      const top = L.shade === "la-lv" ? k(P.la) : L.shade === "lv-ao" ? k(P.lv) : L.shade === "ao-lv" ? k(P.ao) : k(P.la);
      const bot = L.shade === "la-lv" ? k(P.lv) : L.shade === "lv-ao" ? k(P.ao) : L.shade === "ao-lv" ? k(P.lv) : (t) => 12;
      const [a, b] = L.shadeW; let d = "";
      for (let i = 0; i <= 40; i++) { const t = a + (b - a) * i / 40; d += (i ? "L" : "M") + X(t) + "," + Y(top(t)); }
      for (let i = 40; i >= 0; i--) { const t = a + (b - a) * i / 40; d += "L" + X(t) + "," + Y(bot(t)); }
      shade = `<path d="${d}Z" fill="var(--warn)" opacity=".35"/>`;
    }
    return `<svg viewBox="0 0 220 170" role="img" aria-label="Kurva tekanan"><line class="svg-axis" x1="30" y1="10" x2="30" y2="150"/><line class="svg-axis" x1="30" y1="150" x2="215" y2="150"/>
      ${[0, 50, 100, 150].map((p) => `<text class="svg-label small" x="26" y="${Y(p) + 3}" text-anchor="end" style="font-size:8px">${p}</text>`).join("")}
      ${shade}<path d="${K.plot(k(P.ao), 0, C, X, Y, 150)}" fill="none" stroke="var(--o2-rich)" stroke-width="2"/><path d="${K.plot(k(P.lv), 0, C, X, Y, 150)}" fill="none" stroke="var(--text)" stroke-width="2"/><path d="${K.plot(k(P.la), 0, C, X, Y, 150)}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      <text class="svg-label small" x="120" y="166" text-anchor="middle" style="font-size:8.5px"><tspan style="fill:var(--o2-rich)">Aorta</tspan> · <tspan>VKi</tspan> · <tspan style="fill:var(--accent)">AKi</tspan> · <tspan style="fill:var(--warn)">gradien</tspan></text></svg>`;
  }
  function phonoSVG(shape) {
    const amp = (f) => {
      const s1 = Math.exp(-((f - .05) ** 2) / .0003), s2 = Math.exp(-((f - .4) ** 2) / .0002);
      let m = 0;
      if (shape === "holo") m = f > .07 && f < .39 ? .45 : 0;
      if (shape === "ejection") m = f > .09 && f < .36 ? .7 * Math.sin(Math.PI * (f - .09) / .27) : 0;
      if (shape === "earlydia") m = f > .41 && f < .7 ? .5 * (1 - (f - .41) / .29) : 0;
      if (shape === "middia") m = (f > .52 && f < .9 ? .35 : 0) + (f > .9 && f < .99 ? .35 + (f - .9) * 4 : 0) + Math.exp(-((f - .47) ** 2) / .00008) * .8;
      if (shape === "click") m = Math.exp(-((f - .22) ** 2) / .00006) * .9 + (f > .24 && f < .39 ? .15 + (f - .24) * 2 : 0);
      return Math.max(s1 * (shape === "middia" ? 1 : .9), s2 * .75, m);
    };
    let d = "";
    for (let i = 0; i <= 800; i++) { const f = (i / 400) % 1, a = amp(f) * (i % 2 ? 1 : -1) * (.6 + .4 * Math.abs(Math.sin(i * 1.7))); d += (i ? "L" : "M") + (10 + i / 800 * 400).toFixed(1) + "," + (40 - a * 30).toFixed(1); }
    return `<svg viewBox="0 0 420 80" role="img" aria-label="Fonokardiogram"><line class="svg-grid" x1="10" y1="40" x2="410" y2="40"/><path d="${d}" fill="none" stroke="var(--text)" stroke-width="1"/>
      ${[0, 1].map((c) => `<text class="svg-label small" x="${10 + (c * .5 + .025) * 400}" y="78" text-anchor="middle" style="font-size:9px">S1</text><text class="svg-label small" x="${10 + (c * .5 + .2) * 400}" y="78" text-anchor="middle" style="font-size:9px">S2</text>`).join("")}
      <text class="svg-label small" x="${10 + .12 * 400}" y="10" text-anchor="middle" style="font-size:9px">sistol</text><text class="svg-label small" x="${10 + .35 * 400}" y="10" text-anchor="middle" style="font-size:9px">diastol</text></svg>`;
  }
  function heartSVG(L) {
    const big = (c) => L.big.includes(c) ? 14 : 0, th = (c) => L.thick.includes(c);
    const R = (c, x, y, w, h, col, lab) => `<rect x="${x - big(c) / 2}" y="${y - big(c) / 2}" width="${w + big(c)}" height="${h + big(c)}" rx="14" fill="${col}" opacity=".8" stroke="${th(c) ? "var(--text)" : L.big.includes(c) ? "var(--warn)" : "none"}" stroke-width="${th(c) ? 10 : 4}"/><text class="svg-label small" x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" style="fill:#fff;font-weight:700">${lab}</text>`;
    const vmark = L.valve ? (L.valve === "mit" ? `<rect x="150" y="76" width="60" height="8" rx="3" fill="var(--bad)"/>` : `<rect x="166" y="2" width="34" height="8" rx="3" fill="var(--bad)"/>`) : "";
    return `<svg viewBox="0 0 220 170" role="img" aria-label="Skema ruang jantung">${R("ra", 20, 20, 80, 52, "var(--o2-poor)", "AK")}${R("la", 120, 20, 80, 52, "var(--o2-rich)", "AKi")}${R("rv", 20, 88, 80, 72, "var(--o2-poor)", "VKa")}${R("lv", 120, 88, 80, 72, "var(--o2-rich)", "VKi")}${vmark}
      <text class="svg-label small" x="110" y="168" text-anchor="middle" style="font-size:8.5px">oranye = membesar · hitam = hipertrofi</text></svg>`;
  }
  function panel(k) {
    const L = LES[k];
    return `<div class="two-col" style="gap:8px"><div class="viz-wrap">${heartSVG(L)}</div><div class="viz-wrap">${pressSVG(L)}</div></div>
      <div class="viz-wrap" style="margin-top:8px">${phonoSVG(L.murmur)}</div>
      <div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary snd" data-k="${k}" type="button">🔊 Dengarkan</button><span class="small muted">${L.time || ""}</span></div>`;
  }
  const txt = (k) => { const L = LES[k]; return `<p><b>Penyebab:</b> ${L.cause}</p><p><b>Patofisiologi:</b> ${L.why}</p><p><b>Murmur:</b> ${L.time}.<br><b>Lokasi:</b> ${L.loc}.</p>`; };

  const STEPS = [
    { title: "Dua cara katup bermasalah", body: "<b>Stenosis</b> = katup <b>gagal membuka</b> penuh → ruang di belakangnya menanggung <b>beban tekanan</b>. <b>Regurgitasi/insufisiensi</b> = katup <b>gagal menutup</b> → darah bolak-balik → <b>beban volume</b>. Murmur muncul saat aliran turbulen melewati katup: <b>sistolik</b> bila katup keluar menyempit atau katup AV bocor; <b>diastolik</b> bila katup AV menyempit atau katup semilunar bocor.", key: "Sistolik: MR & AS. Diastolik: MS & AR (lihat Hafalan).", viz: panel("normal") },
    { title: "Stenosis mitral", body: txt("ms"), key: "Opening snap + rumble diastolik di apeks = MS.", viz: panel("ms") },
    { title: "Regurgitasi mitral", body: txt("mr"), key: "Holosistolik di apeks menjalar ke aksila = MR.", viz: panel("mr") },
    { title: "Stenosis aorta", body: txt("as") + "<p>Trias gejala: <b>angina, sinkop, sesak (gagal jantung)</b> — bila muncul, prognosis buruk tanpa penggantian katup.</p>", key: "Murmur ejeksi di ICS 2 kanan menjalar ke leher = AS.", viz: panel("as") },
    { title: "Regurgitasi aorta", body: txt("ar") + "<p>Tanda tekanan nadi lebar: nadi Corrigan (water-hammer), de Musset (kepala mengangguk), Quincke (pulsasi kapiler kuku).</p>", key: "Diastolik dini di titik Erb + tekanan nadi lebar = AR.", viz: panel("ar") },
    { title: "Kelainan katup lainnya", body: txt("mvp") + "<p><b>Regurgitasi trikuspid</b>: holosistolik di parasternal kiri bawah, <b>makin keras saat inspirasi</b> (tanda Carvallo), JVP gelombang v besar — sering akibat hipertensi pulmonal atau endokarditis pada penasun. <b>Stenosis pulmonal</b>: ejeksi sistolik di ICS 2 kiri (C1). <b>Stenosis trikuspid</b>: jarang, umumnya reumatik.</p>", key: "Murmur jantung kanan makin keras saat inspirasi.", viz: panel("mvp") },
    { title: "Manuver yang mengubah murmur", body: "<ul class='key-points'><li><span class='k-ico'>🌬️</span><span><b>Inspirasi</b> → aliran balik kanan ↑ → murmur <b>sisi kanan</b> (TR, PS) lebih keras.</span></li><li><span class='k-ico'>✊</span><span><b>Handgrip</b> (afterload ↑) → MR, AR, VSD lebih keras; AS lebih lemah.</span></li><li><span class='k-ico'>😤</span><span><b>Valsalva / berdiri</b> (preload ↓) → kebanyakan murmur melemah, KECUALI <b>kardiomiopati hipertrofik</b> & <b>MVP</b> yang menguat (C7).</span></li><li><span class='k-ico'>🧎</span><span><b>Jongkok</b> (preload & afterload ↑) → kebanyakan murmur menguat; HCM melemah.</span></li></ul>", key: "Manuver = memainkan preload & afterload (A13).", viz: panel("normal") },
  ];

  registerModule({
    id: "c06",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Pintu satu arah yang rusak", emoji: "💡", html: `
          <p>Dari A9–A10: katup membuka dan menutup mengikuti perbedaan tekanan. Bila katup <b>sempit</b> atau <b>bocor</b>, terjadi aliran turbulen (murmur) dan beban tambahan pada ruang jantung.</p>
          <div class="table-wrap"><table class="table"><thead><tr><th>Lesi</th><th>Waktu murmur</th><th>Beban</th><th>Ruang yang berubah</th></tr></thead><tbody>
            <tr><td><b>MS</b></td><td>Diastolik</td><td>Tekanan</td><td>AKi membesar → paru → VKa</td></tr>
            <tr><td><b>MR</b></td><td>Sistolik (holo)</td><td>Volume</td><td>AKi & VKi dilatasi</td></tr>
            <tr><td><b>AS</b></td><td>Sistolik (ejeksi)</td><td>Tekanan</td><td>VKi hipertrofi konsentrik</td></tr>
            <tr><td><b>AR</b></td><td>Diastolik (dini)</td><td>Volume</td><td>VKi dilatasi eksentrik</td></tr></tbody></table></div>
          <p class="small muted">Level SKDI: 2. 🔊 Suara murmur di modul ini adalah sintesis sederhana untuk mengenali pola waktu, bukan rekaman pasien.</p>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Lesi demi lesi", emoji: "🎧", intro: "Setiap langkah: ruang jantung yang berubah, kurva tekanan (area oranye = gradien abnormal), fonokardiogram, dan tombol suara.",
          viz: panel("normal"), steps: STEPS, autoplayMs: 9000,
          init(api) { api.viz.addEventListener("click", (e) => { const b = e.target.closest(".snd"); if (b) { const L = LES[b.dataset.k]; K.playMurmur(L.murmur, { s1: L.s1, s2: L.s2, beats: 4 }); } }); } },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Stenosis mitral → sesak & fibrilasi atrium", nodes: ["Orifisium mitral menyempit (PJR)", "AKi butuh tekanan tinggi untuk mengisi VKi", "AKi melebar → serabut atrium teregang → fibrilasi atrium", "Tekanan AKi diteruskan ke vena & kapiler paru → kongesti, sesak", "Takikardia memperpendek diastol → gradien ↑ → sesak memburuk (A2, A10)"] },
            { label: "Stenosis aorta → angina, sinkop, gagal jantung", nodes: ["Afterload VKi meningkat hebat", "Hipertrofi konsentrik → kebutuhan O₂ ↑ & perfusi subendokardium ↓ → angina", "Saat aktivitas, CO tidak bisa naik melewati katup sempit + vasodilatasi otot → TD turun → sinkop", "Lama-lama VKi gagal memompa → sesak/gagal jantung", "Penggantian katup diperlukan begitu gejala muncul"] },
            { label: "Regurgitasi aorta → tekanan nadi lebar", nodes: ["Saat diastol darah aorta kembali ke VKi", "Tekanan diastolik aorta turun drastis", "VKi menerima darah dari AKi + dari aorta → EDV ↑", "Frank-Starling → SV sangat besar → sistolik naik", "Sistolik tinggi + diastolik rendah = tekanan nadi lebar (nadi water-hammer)"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Tebak murmurnya!", emoji: "🎯", html: `
          <p>Tekan <b>Putar</b>, dengarkan dan lihat fonokardiogramnya, lalu tebak lesinya.</p>
          <div class="btn-row"><button class="btn btn-sm btn-primary" id="gm-play" type="button">🔊 Putar</button><button class="btn btn-sm" id="gm-new" type="button">Soal baru ↻</button><span class="small muted" id="gm-sc"></span></div>
          <div class="viz-wrap" id="gm-phono" style="margin-top:8px"></div>
          <div class="toggle-row" id="gm-opts"></div>
          <div id="gm-msg"></div>`,
          init(el) {
            const keys = ["ms", "mr", "as", "ar", "mvp"]; let cur, done, sc = 0, n = 0;
            K.$("#gm-opts", el).innerHTML = keys.map((k) => `<button class="btn btn-sm" data-k="${k}" type="button">${LES[k].n}</button>`).join("");
            function nw() { cur = keys[Math.floor(Math.random() * keys.length)]; done = false; K.$("#gm-phono", el).innerHTML = phonoSVG(LES[cur].murmur); K.$("#gm-msg", el).innerHTML = ""; K.$$("#gm-opts button", el).forEach((b) => b.classList.remove("on")); }
            K.$("#gm-play", el).addEventListener("click", () => { const L = LES[cur]; K.playMurmur(L.murmur, { s1: L.s1, s2: L.s2, beats: 4 }); });
            K.$("#gm-new", el).addEventListener("click", nw);
            K.$$("#gm-opts button", el).forEach((b) => b.addEventListener("click", () => {
              if (done) return; done = true; n++; const ok = b.dataset.k === cur; if (ok) sc++; b.classList.add("on");
              K.$("#gm-msg", el).innerHTML = `<div class="callout ${ok ? "green" : "red"}"><p><b>${ok ? "✅ Tepat!" : `❌ Ini ${LES[cur].n}.`}</b> ${LES[cur].time}. Lokasi: ${LES[cur].loc}.</p></div>`;
              K.$("#gm-sc", el).textContent = `Skor: ${sc}/${n}`;
            }));
            nw();
          } },
        { heading: "Simulator manuver", emoji: "🎚️", html: `
          <p>Pilih lesi dan manuver. Apakah murmurnya menguat atau melemah?</p>
          <div class="toggle-row" id="mv-les"></div><div class="toggle-row" id="mv-man"></div>
          <div class="callout" id="mv-msg"></div>`,
          init(el) {
            const LS = { as: "AS", mr: "MR", ar: "AR", ms: "MS", tr: "TR", hcm: "HCM", mvp: "MVP" };
            const MN = { insp: ["🌬️ Inspirasi", "aliran balik kanan ↑"], grip: ["✊ Handgrip", "afterload ↑"], vals: ["😤 Valsalva / berdiri", "preload ↓"], squat: ["🧎 Jongkok", "preload & afterload ↑"] };
            const R = {
              insp: { tr: 1, as: 0, mr: 0, ar: 0, ms: 0, hcm: 0, mvp: 0 },
              grip: { mr: 1, ar: 1, as: -1, hcm: -1, ms: 0, tr: 0, mvp: -1 },
              vals: { as: -1, mr: -1, ar: -1, ms: -1, tr: -1, hcm: 1, mvp: 1 },
              squat: { as: 1, mr: 1, ar: 1, ms: 1, tr: 1, hcm: -1, mvp: -1 },
            };
            let l = "as", m = "grip";
            K.$("#mv-les", el).innerHTML = Object.entries(LS).map(([k, n]) => `<button class="btn btn-sm" data-l="${k}" type="button">${n}</button>`).join("");
            K.$("#mv-man", el).innerHTML = Object.entries(MN).map(([k, [n]]) => `<button class="btn btn-sm" data-m="${k}" type="button">${n}</button>`).join("");
            function upd() {
              K.$$("#mv-les button", el).forEach((b) => b.classList.toggle("on", b.dataset.l === l)); K.$$("#mv-man button", el).forEach((b) => b.classList.toggle("on", b.dataset.m === m));
              const r = R[m][l];
              const why = l === "hcm" || l === "mvp" ? "Pada HCM/MVP, ventrikel yang lebih kecil (preload ↓) memperparah obstruksi/prolaps — kebalikan dari lesi lain." : m === "grip" && l === "as" ? "Afterload ↑ mengurangi gradien VKi–aorta → aliran melewati katup ↓." : m === "insp" ? "Hanya murmur sisi kanan yang menguat saat inspirasi." : "Lebih banyak volume/tekanan melewati katup yang bermasalah → turbulensi ↑.";
              K.$("#mv-msg", el).className = r > 0 ? "callout red" : r < 0 ? "callout green" : "callout";
              K.$("#mv-msg", el).innerHTML = `<p><b>${LS[l]} + ${MN[m][0]} (${MN[m][1]}) → ${r > 0 ? "🔊 MENGUAT" : r < 0 ? "🔉 MELEMAH" : "↔ tidak banyak berubah"}.</b> ${why}</p>`;
            }
            K.$$("#mv-les button", el).forEach((b) => b.addEventListener("click", () => { l = b.dataset.l; upd(); }));
            K.$$("#mv-man button", el).forEach((b) => b.addEventListener("click", () => { m = b.dataset.m; upd(); }));
            upd();
          } },
        { type: "match", heading: "Tanda khas → lesi", emoji: "🧩", intro: "Ketuk tanda, lalu lesinya.",
          pairs: [["Opening snap + rumble diastolik di apeks", "Stenosis mitral"], ["Holosistolik menjalar ke aksila", "Regurgitasi mitral"], ["Pulsus parvus et tardus, murmur ke karotis", "Stenosis aorta"], ["Nadi water-hammer, diastolik dini di Erb", "Regurgitasi aorta"], ["Klik mid-sistolik", "Prolaps katup mitral"], ["Holosistolik makin keras saat inspirasi", "Regurgitasi trikuspid"]] },
      ]},
      { id: "hafalan", title: "Hafalan", cards: [
        { heading: "Jembatan keledai", emoji: "🧠", html: `
          <div style="display:grid;gap:8px">
            <div class="callout red"><p class="mnemo">Murmur sistolik “<b>MR. ASS</b>”: <b>MR</b> · <b>A</b>ortic <b>S</b>tenosis = <b>S</b>istolik. Murmur diastolik “<b>MS. ARD</b>”: <b>MS</b> · <b>A</b>ortic <b>R</b>egurgitation = <b>D</b>iastolik.</p></div>
            <div class="callout"><p class="mnemo">Stenosis = <b>tekanan</b> (pintu macet, harus mendorong keras) · Regurgitasi = <b>volume</b> (darah bolak-balik, ruang melar).</p></div>
            <div class="callout green"><p class="mnemo">Trias AS “<b>SAD</b>”: <b>S</b>inkop · <b>A</b>ngina · <b>D</b>ispnea (gagal jantung).</p></div>
            <div class="callout warn"><p class="mnemo">Manuver: “<b>Inspirasi → Kanan</b>” · “<b>Valsalva melemahkan semua, kecuali HCM & MVP</b>”.</p></div>
          </div>` },
        { type: "flash", heading: "Flashcard", emoji: "🃏", intro: "Jawab dalam hati, lalu balik.",
          cards: [["Penyebab tersering stenosis mitral", "Penyakit jantung reumatik"], ["Komplikasi aritmia khas MS", "Fibrilasi atrium (AKi membesar)"], ["Murmur MS", "Opening snap + rumble mid-diastolik di apeks"], ["Murmur MR", "Holosistolik di apeks, menjalar ke aksila"], ["Penyebab AS pada lansia", "Kalsifikasi degeneratif"], ["Penyebab AS usia 40–60-an", "Katup aorta bikuspid"], ["Trias gejala AS", "Angina, sinkop, sesak"], ["Remodeling VKi pada AS vs AR", "AS: hipertrofi konsentrik · AR: dilatasi eksentrik"], ["Nadi khas AR", "Water-hammer / Corrigan (tekanan nadi lebar)"], ["Murmur yang menguat dengan Valsalva", "Kardiomiopati hipertrofik & MVP"]] },
      ]},
      { id: "klinis", title: "Kasus Klinis", cards: [
        { type: "clinic", heading: "Latihan kasus", emoji: "🩺", intro: "Tebak lesinya sebelum membuka kartu.", note: "Untuk latihan penalaran. Diagnosis pasti dengan ekokardiografi.",
          items: [
            { icon: "👩", title: "Perempuan 28 tahun, riwayat demam rematik, sesak saat hamil, irama tidak teratur", chain: ["Kehamilan menaikkan volume & HR → gradien mitral ↑", "Stenosis mitral reumatik + fibrilasi atrium", "Risiko edema paru & stroke emboli (antikoagulan!)"] },
            { icon: "👴", title: "Pria 78 tahun, pingsan saat jalan cepat, murmur ejeksi kasar di ICS 2 kanan menjalar ke leher", chain: ["Kalsifikasi katup aorta", "Stenosis aorta berat — CO tidak bisa naik saat aktivitas", "Sinkop = gejala berat → evaluasi penggantian katup (bedah/TAVI)"] },
            { icon: "💔", title: "Pasien infark inferior hari ke-3, tiba-tiba sesak berat, murmur holosistolik baru di apeks", chain: ["Ruptur m. papilaris posteromedial (diperdarahi satu arteri)", "Regurgitasi mitral akut", "Edema paru akut — kegawatdaruratan bedah"] },
            { icon: "🧍", title: "Pria tinggi, lengan panjang, tekanan nadi lebar, murmur diastolik dini", chain: ["Sindrom Marfan → dilatasi pangkal aorta", "Regurgitasi aorta", "Waspadai diseksi aorta"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Murmur rumble mid-diastolik di apeks dengan opening snap paling khas untuk…",
          options: ["Regurgitasi mitral", "Stenosis mitral", "Stenosis aorta", "Regurgitasi aorta"], answer: 1,
          explain: "Darah mengalir turbulen melewati mitral sempit saat diastol; opening snap = daun katup kaku yang terbuka tiba-tiba." },
        { q: "Stenosis aorta kronik menyebabkan remodeling VKi berupa…",
          options: ["Dilatasi eksentrik", "Hipertrofi konsentrik", "Atrofi", "Tidak ada perubahan"], answer: 1,
          explain: "Beban tekanan → sarkomer ditambah paralel → dinding menebal, rongga relatif kecil." },
        { q: "Pada regurgitasi aorta, tekanan nadi lebar terjadi karena…",
          options: ["Sistolik turun dan diastolik naik", "Diastolik aorta turun (darah bocor balik) dan SV besar menaikkan sistolik", "HR sangat lambat", "Katup mitral menutup terlalu cepat"], answer: 1,
          explain: "Kebocoran saat diastol menurunkan tekanan diastolik; volume ekstra di VKi menghasilkan SV besar (Frank-Starling) sehingga sistolik naik." },
        { q: "Murmur yang menguat saat handgrip dan melemah saat Valsalva, holosistolik di apeks menjalar ke aksila, adalah…",
          options: ["Stenosis aorta", "Kardiomiopati hipertrofik", "Regurgitasi mitral", "Stenosis pulmonal"], answer: 2,
          explain: "Handgrip menaikkan afterload sehingga lebih banyak darah bocor ke AKi; Valsalva menurunkan preload sehingga murmur melemah." },
        { q: "Komplikasi stenosis mitral yang paling sering menyebabkan stroke adalah…",
          options: ["Endokarditis", "Fibrilasi atrium dengan trombus di atrium kiri", "Hipertrofi VKi", "Blok AV"], answer: 1,
          explain: "AKi yang membesar → fibrilasi atrium → stasis darah di aurikula kiri → trombus → emboli ke otak." },
      ]},
    ],
  });
})();
