/* Modul A9 — Bunyi Jantung S1 & S2 serta Titik Auskultasi */
(function () {
  const CYCLE = 800, S1 = 130, S2 = 420;
  // status katup pada waktu t (ms)
  function valves(t) {
    t = ((t % CYCLE) + CYCLE) % CYCLE;
    const av = t < S1 || t > 500;            // mitral & trikuspid terbuka saat diastol
    const sl = t > 180 && t < S2;            // aorta & pulmonal terbuka saat ejeksi
    return { mit: av, tri: av, aor: sl, pul: sl };
  }
  const phaseName = (t) => t < 100 ? "Akhir diastol: atrium berkontraksi" : t < S1 ? "Ventrikel mulai berkontraksi" : t < 180 ? "Kontraksi isovolumetrik — semua katup tertutup" : t < S2 ? "Ejeksi — katup aorta & pulmonal terbuka" : t < 500 ? "Relaksasi isovolumetrik — semua katup tertutup" : "Pengisian ventrikel — katup mitral & trikuspid terbuka";

  const HEART = `
    <rect x="125" y="10" width="30" height="125" fill="var(--o2-poor)" opacity=".55"/>
    <rect x="165" y="10" width="30" height="125" fill="var(--o2-rich)" opacity=".55"/>
    <text class="svg-label small" x="140" y="8" text-anchor="middle">a. pulm</text><text class="svg-label small" x="180" y="8" text-anchor="middle">aorta</text>
    <rect x="15" y="30" width="100" height="80" rx="16" fill="var(--o2-poor)" opacity=".75"/>
    <rect x="205" y="30" width="100" height="80" rx="16" fill="var(--o2-rich)" opacity=".75"/>
    <rect x="15" y="130" width="140" height="110" rx="20" fill="var(--o2-poor)" opacity=".9"/>
    <rect x="165" y="130" width="140" height="110" rx="20" fill="var(--o2-rich)" opacity=".9"/>
    <text class="svg-label white" x="65" y="75" text-anchor="middle" style="fill:#fff">AK</text><text class="svg-label white" x="255" y="75" text-anchor="middle" style="fill:#fff">AKi</text>
    <text class="svg-label white" x="80" y="195" text-anchor="middle" style="fill:#fff">VKa</text><text class="svg-label white" x="240" y="195" text-anchor="middle" style="fill:#fff">VKi</text>
    <!-- katup: daun kiri & kanan; tertutup = horizontal, terbuka = miring -->
    <g class="vlv" data-v="tri" data-info="tri"><line class="lf" x1="30" y1="120" x2="65" y2="120"/><line class="rf" x1="100" y1="120" x2="65" y2="120"/></g>
    <g class="vlv" data-v="mit" data-info="mit"><line class="lf" x1="220" y1="120" x2="255" y2="120"/><line class="rf" x1="290" y1="120" x2="255" y2="120"/></g>
    <g class="vlv" data-v="pul" data-info="pul"><line class="lf" x1="125" y1="100" x2="140" y2="100"/><line class="rf" x1="155" y1="100" x2="140" y2="100"/></g>
    <g class="vlv" data-v="aor" data-info="aor"><line class="lf" x1="165" y1="100" x2="180" y2="100"/><line class="rf" x1="195" y1="100" x2="180" y2="100"/></g>
    <text class="svg-label small" x="160" y="125" text-anchor="middle">jalur keluar ↑</text>`;

  const VIZ = `<svg viewBox="0 0 320 250" role="img" aria-label="Jantung dengan empat katup" style="max-width:360px;margin:auto">${HEART}</svg>
    <svg viewBox="0 0 320 90" role="img" aria-label="Fonokardiogram">
      <rect y="10" width="${(S2 - S1) / CYCLE * 300}" height="50" x="${10 + S1 / CYCLE * 300}" fill="var(--primary-soft)" id="sys-band"/>
      <line class="svg-grid" x1="10" y1="40" x2="310" y2="40"/>
      <path id="phono" fill="none" stroke="var(--text)" stroke-width="1.6"/>
      <text class="svg-label small" x="${10 + S1 / CYCLE * 300}" y="78" text-anchor="middle" style="font-weight:700">S1</text>
      <text class="svg-label small" x="${10 + S2 / CYCLE * 300}" y="78" text-anchor="middle" style="font-weight:700">S2</text>
      <text class="svg-label small" x="${10 + 275 / CYCLE * 300}" y="20" text-anchor="middle">sistol</text>
      <text class="svg-label small" x="${10 + 640 / CYCLE * 300}" y="20" text-anchor="middle">diastol</text>
      <line id="ph-cur" y1="8" y2="64" stroke="var(--accent)" stroke-width="2"/>
    </svg>
    <div class="readout"><span>Fase</span><b id="ph-name" style="font-size:.95rem"></b></div>
    <div class="btn-row" style="margin-top:8px"><button class="btn btn-sm" id="snd" type="button">🔊 Dengarkan “lub-dub”</button></div>`;

  function phono(t) {
    const n = (c, w, a) => a * Math.exp(-((t - c) ** 2) / (2 * w * w)) * Math.sin((t - c) * 0.9);
    return n(S1 + 8, 12, 1) + n(S2 + 6, 8, .75);
  }

  const STEPS = [
    { title: "Dari mana bunyi jantung?", body: "Bunyi jantung normal berasal dari <b>getaran saat katup MENUTUP</b>: darah yang tiba-tiba berhenti, daun katup yang menegang, dan dinding jantung ikut bergetar. Pembukaan katup normal tidak berbunyi.", key: "“Lub” = S1, “dub” = S2.", w: [0, 800], sp: 250 },
    { title: "S1 — “lub”: katup AV menutup", body: "Di awal sistol, ventrikel berkontraksi sehingga tekanan ventrikel > tekanan atrium → <b>katup mitral & trikuspid menutup</b>. Inilah S1: lebih panjang dan bernada lebih rendah. Terjadi sesaat setelah QRS.", key: "S1 menandai AWAL sistol ventrikel.", w: [80, 200], sp: 70 },
    { title: "Sistol: katup semilunar terbuka (sunyi)", body: "Tekanan ventrikel melampaui tekanan aorta & a. pulmonalis → katup aorta & pulmonal <b>terbuka</b> dan darah dipompa keluar. Normalnya tidak ada bunyi di antara S1 dan S2.", key: "Bunyi tambahan di fase ini = murmur sistolik.", w: [170, 430], sp: 120 },
    { title: "S2 — “dub”: katup semilunar menutup", body: "Ventrikel relaksasi → tekanannya turun di bawah tekanan aorta → <b>katup aorta & pulmonal menutup</b>. Inilah S2: lebih singkat dan bernada lebih tinggi. Terjadi di sekitar akhir gelombang T.", key: "S2 menandai AKHIR sistol / awal diastol.", w: [380, 480], sp: 60 },
    { title: "Diastol: katup AV terbuka (sunyi)", body: "Tekanan ventrikel turun di bawah atrium → katup mitral & trikuspid terbuka dan ventrikel terisi. Saat istirahat, diastol <b>lebih panjang</b> daripada sistol — jarak S2→S1 lebih panjang dari S1→S2.", key: "Bunyi tambahan di fase ini = murmur diastolik.", w: [480, 800], sp: 150 },
    { title: "S3 dan S4 (bunyi tambahan)", body: "<b>S3</b>: getaran saat pengisian cepat ventrikel di awal diastol — normal pada anak & atlet, tetapi pada orang tua sering menandakan ventrikel yang terlalu penuh. <b>S4</b>: getaran saat atrium mendorong darah ke ventrikel yang kaku, tepat sebelum S1.", key: "Normalnya pada dewasa hanya terdengar S1 dan S2.", w: [0, 800], sp: 250 },
  ];

  registerModule({
    id: "a09",
    sections: [
      { id: "gambaran", title: "Gambaran Besar", cards: [
        { heading: "Mendengar katup bekerja", emoji: "💡", html: `
          <p>Saat menempelkan stetoskop, kamu sebenarnya mendengar <b>katup-katup jantung menutup</b>. Dua bunyi utama:</p>
          <ul class="key-points">
            <li><span class="k-ico">🔈</span><span><b>S1 (“lub”)</b> — katup <b>mitral & trikuspid</b> menutup → awal sistol.</span></li>
            <li><span class="k-ico">🔉</span><span><b>S2 (“dub”)</b> — katup <b>aorta & pulmonal</b> menutup → awal diastol.</span></li>
            <li><span class="k-ico">🧭</span><span>Setiap katup paling jelas didengar di <b>titik auskultasi</b> tertentu di dinding dada — sesuai arah aliran darah setelah melewati katup itu.</span></li>
          </ul>
          <div class="callout"><p><b>Kaitan:</b> katup menutup karena <b>perbedaan tekanan</b>. Hubungan tekanan–katup–bunyi akan dirangkai lengkap di A10 (Diagram Wiggers).</p></div>` },
      ]},
      { id: "tahap", title: "Langkah demi Langkah", cards: [
        { type: "explorer", heading: "Katup, tekanan, dan bunyi", emoji: "🎧", intro: "Perhatikan daun katup terbuka–tertutup. Klik katup untuk penjelasan, dan coba tombol suara.",
          viz: VIZ, steps: STEPS,
          info: {
            mit: ["Katup mitral", "Katup AV kiri (2 daun). Menutup di awal sistol → komponen utama S1 (M1)."],
            tri: ["Katup trikuspid", "Katup AV kanan (3 daun). Menutup hampir bersamaan dengan mitral → bagian S1 (T1)."],
            aor: ["Katup aorta", "Katup semilunar kiri. Menutup di akhir sistol → komponen A2 dari S2."],
            pul: ["Katup pulmonal", "Katup semilunar kanan. Menutup sedikit setelah aorta → komponen P2 dari S2."],
          },
          onStep(i, s, api) { api._w = s.w; api._sp = s.sp; api._t = s.w[0]; },
          init(api, secEl) {
            const v = api.viz;
            const sx = (t) => 10 + t / CYCLE * 300;
            K.$("#phono", v).setAttribute("d", K.plot(phono, 0, CYCLE, sx, (y) => 40 - y * 24, 600));
            const band = K.$("#sys-band", v); band.setAttribute("x", sx(S1)); band.setAttribute("width", sx(S2) - sx(S1));
            let sound = false;
            K.$("#snd", v).addEventListener("click", (e) => { sound = !sound; e.target.textContent = sound ? "🔇 Matikan suara" : "🔊 Dengarkan “lub-dub”"; });
            document.addEventListener("lesson:show", () => { sound = false; K.$("#snd", v).textContent = "🔊 Dengarkan “lub-dub”"; });
            let prev = 0;
            K.loop(secEl, (dt) => {
              if (!api._w) return;
              const t0 = api._t;
              api._t += dt * (sound ? 1000 : api._sp);
              if (api._t > api._w[1]) api._t = api._w[0];
              const t = api._t;
              if (sound && t0 < S1 && t >= S1) K.thump(55, .16, .9);
              if (sound && t0 < S2 && t >= S2) K.thump(80, .1, .7);
              K.$("#ph-cur", v).setAttribute("x1", sx(t)); K.$("#ph-cur", v).setAttribute("x2", sx(t));
              K.$("#ph-name", v).textContent = phaseName(t);
              const st = valves(t);
              K.$$(".vlv", v).forEach((g) => {
                const open = st[g.dataset.v], [lf, rf] = K.$$("line", g);
                if (!g.dataset.x1) { g.dataset.x1 = lf.getAttribute("x1"); g.dataset.xm = lf.getAttribute("x2"); g.dataset.y = lf.getAttribute("y1"); }
                const x1 = +g.dataset.x1, xm = +g.dataset.xm, y = +g.dataset.y;
                const semi = g.dataset.v === "aor" || g.dataset.v === "pul";
                const dy = open ? (semi ? -14 : 22) : 0, shrink = open ? (xm - x1) * .25 : 0;
                lf.setAttribute("x2", xm - shrink); lf.setAttribute("y2", y + dy);
                rf.setAttribute("x2", xm + shrink); rf.setAttribute("y2", y + dy);
                g.style.stroke = open ? K.css("--ok") : K.css("--text");
              });
            });
          },
        },
      ]},
      { id: "sebab", title: "Sebab-Akibat", cards: [
        { type: "chain", heading: "Rantai sebab-akibat", emoji: "🔗", intro: "Buka satu per satu.",
          chains: [
            { label: "Mengapa S1 terjadi?", nodes: ["QRS: ventrikel terdepolarisasi lalu mulai berkontraksi", "Tekanan ventrikel naik dengan cepat", "Begitu tekanan ventrikel > tekanan atrium, darah mendorong daun katup AV ke atas", "Katup mitral & trikuspid menutup; korda tendinea menahannya agar tidak terbalik", "Darah & struktur bergetar → S1"] },
            { label: "Mengapa S2 terdengar “terpisah” saat inspirasi?", nodes: ["Inspirasi → tekanan intratoraks turun → aliran balik vena ke jantung kanan ↑", "Ventrikel kanan terisi lebih banyak → ejeksinya lebih lama", "Katup pulmonal menutup lebih lambat (P2 terlambat)", "Sementara itu A2 tetap/sedikit lebih awal", "S2 terdengar terpisah menjadi A2–P2: split fisiologis"] },
            { label: "Mengapa titik auskultasi tidak tepat di atas katup?", nodes: ["Keempat katup letaknya berdekatan di belakang sternum", "Bunyi menjalar mengikuti arah aliran darah setelah melewati katup", "Bunyi aorta menjalar ke atas-kanan; mitral ke arah apeks", "Maka titik terbaik mendengar katup berada “di hilir” aliran darahnya"] },
          ] },
      ]},
      { id: "interaksi", title: "Interaksi", cards: [
        { heading: "Titik auskultasi", emoji: "🩺", html: `
          <p>Ketuk titik pada dada untuk mengetahui katup yang paling jelas terdengar di sana. Suara diputar dengan penekanan yang sesuai (S1 lebih keras di apeks, S2 lebih keras di basis).</p>
          <div class="two-col">
            <div class="viz-wrap"><svg id="torso" viewBox="0 0 260 300" role="img" aria-label="Titik auskultasi pada dinding dada" style="max-width:320px;margin:auto">
              <path d="M40,20 C80,6 180,6 220,20 L240,290 L20,290 Z" fill="var(--surface)" stroke="var(--border)" stroke-width="2"/>
              <rect x="120" y="30" width="20" height="170" rx="6" fill="var(--surface-2)" stroke="var(--border)"/>
              ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M118,${50 + i * 32} C90,${44 + i * 32} 60,${52 + i * 32} 36,${66 + i * 32}" fill="none" stroke="var(--border)" stroke-width="5"/><path d="M142,${50 + i * 32} C170,${44 + i * 32} 200,${52 + i * 32} 224,${66 + i * 32}" fill="none" stroke="var(--border)" stroke-width="5"/>`).join("")}
              <path d="M128,110 C100,100 80,130 92,170 C104,205 150,232 176,236 C200,200 196,140 170,118 C158,108 140,108 128,110 Z" fill="var(--primary-soft)" opacity=".7"/>
              <text class="svg-label small" x="10" y="14">kanan pasien</text><text class="svg-label small" x="250" y="14" text-anchor="end">kiri pasien</text>
              <line x1="180" y1="20" x2="180" y2="285" stroke="var(--text-soft)" stroke-dasharray="3 4" opacity=".5"/><text class="svg-label small" x="183" y="280">midklavikula</text>
              ${[["A", 106, 66, "aor"], ["P", 154, 66, "pul"], ["E", 154, 98, "erb"], ["T", 146, 160, "tri"], ["M", 182, 196, "mit"]].map(([l, x, y, k]) => `<g class="ausk" data-k="${k}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="14" fill="var(--accent)" stroke="#fff" stroke-width="2"/><text class="svg-label small" x="${x}" y="${y + 4}" text-anchor="middle" style="fill:#fff;font-weight:700">${l}</text></g>`).join("")}
            </svg></div>
            <div><div class="callout" id="ausk-msg"><p>👆 Ketuk salah satu titik.</p></div>
              <div class="table-wrap"><table class="table"><tbody>
                <tr><td><b>A</b></td><td>Aorta — ICS 2 parasternal <b>kanan</b></td></tr>
                <tr><td><b>P</b></td><td>Pulmonal — ICS 2 parasternal <b>kiri</b></td></tr>
                <tr><td><b>E</b></td><td>Titik Erb — ICS 3 parasternal kiri</td></tr>
                <tr><td><b>T</b></td><td>Trikuspid — ICS 4–5 parasternal kiri</td></tr>
                <tr><td><b>M</b></td><td>Mitral — ICS 5 midklavikula kiri (apeks)</td></tr></tbody></table></div></div>
          </div>`,
          init(el) {
            const INFO = {
              aor: ["Area aorta", "ICS 2 linea parasternal kanan. Bunyi katup aorta menjalar mengikuti aorta asendens ke atas-kanan. <b>S2 lebih keras dari S1</b> di sini.", [.5, 1]],
              pul: ["Area pulmonal", "ICS 2 linea parasternal kiri. Tempat terbaik mendengar <b>split S2</b> (A2–P2). S2 lebih keras.", [.5, 1]],
              erb: ["Titik Erb", "ICS 3 parasternal kiri. Area “campuran”; S1 dan S2 kira-kira sama keras. Murmur regurgitasi aorta sering terdengar di sini.", [.75, .75]],
              tri: ["Area trikuspid", "ICS 4–5 parasternal kiri bawah. Bunyi katup trikuspid. <b>S1 lebih keras dari S2</b>.", [1, .5]],
              mit: ["Area mitral (apeks)", "ICS 5 linea midklavikula kiri, tempat iktus kordis. Bunyi katup mitral paling jelas. <b>S1 paling keras</b> di sini.", [1, .45]],
            };
            K.$$(".ausk", el).forEach((g) => g.addEventListener("click", () => {
              const [t, d, [a, b]] = INFO[g.dataset.k];
              K.$$(".ausk circle", el).forEach((c) => c.style.fill = "");
              K.$("circle", g).style.fill = K.css("--primary");
              K.$("#ausk-msg", el).innerHTML = `<p><b>${t}</b><br>${d}</p>`;
              for (let i = 0; i < 3; i++) { K.thump(55, .16, .9 * a, i * .8); K.thump(80, .1, .8 * b, i * .8 + .3); }
            }));
          } },
        { heading: "Split S2 saat bernapas", emoji: "🌬️", html: `
          <p>Amati komponen <b>A2</b> (aorta) dan <b>P2</b> (pulmonal) selama siklus napas.</p>
          <div class="toggle-row"><button class="btn btn-sm" id="breath" type="button">▶ Mulai bernapas</button><button class="btn btn-sm" id="split-snd" type="button">🔊 Suara</button></div>
          <div class="viz-wrap"><svg viewBox="0 0 420 150" style="max-width:560px;margin:auto" role="img" aria-label="Split S2">
            <rect id="lung" x="20" y="20" width="80" height="80" rx="30" fill="var(--accent-soft)" stroke="var(--accent)"/>
            <text id="lung-t" class="svg-label small" x="60" y="120" text-anchor="middle">Ekspirasi</text>
            <line class="svg-grid" x1="130" y1="70" x2="410" y2="70"/>
            <rect x="170" y="50" width="12" height="40" rx="3" fill="var(--text)"/><text class="svg-label small" x="176" y="110" text-anchor="middle">S1</text>
            <rect id="a2" x="300" y="45" width="10" height="50" rx="3" fill="var(--o2-rich)"/><text class="svg-label small" id="a2t" x="305" y="40" text-anchor="middle">A2</text>
            <rect id="p2" x="300" y="52" width="10" height="36" rx="3" fill="var(--o2-poor)"/><text class="svg-label small" id="p2t" x="305" y="110" text-anchor="middle">P2</text>
          </svg></div>
          <div class="callout" id="split-msg"><p>Tekan “Mulai bernapas”.</p></div>`,
          init(el, secEl) {
            let run = false, snd = false, ph = 0, beatT = 0;
            K.$("#breath", el).addEventListener("click", (e) => { run = !run; e.target.textContent = run ? "⏸ Jeda" : "▶ Mulai bernapas"; });
            K.$("#split-snd", el).addEventListener("click", (e) => { snd = !snd; e.target.classList.toggle("on", snd); });
            K.loop(secEl, (dt) => {
              if (!run) return;
              ph = (ph + dt / 5) % 1; // satu napas 5 detik
              const insp = Math.sin(ph * Math.PI * 2) > 0 ? Math.sin(ph * Math.PI * 2) : 0;
              const lung = K.$("#lung", el); const sz = 70 + insp * 22;
              lung.setAttribute("width", sz); lung.setAttribute("height", sz); lung.setAttribute("x", 60 - sz / 2); lung.setAttribute("y", 60 - sz / 2);
              K.$("#lung-t", el).textContent = insp > .05 ? "Inspirasi" : "Ekspirasi";
              const gap = insp * 40;
              K.$("#a2", el).setAttribute("x", 300 - gap * .2); K.$("#a2t", el).setAttribute("x", 305 - gap * .2);
              K.$("#p2", el).setAttribute("x", 300 + gap); K.$("#p2t", el).setAttribute("x", 305 + gap);
              K.$("#split-msg", el).className = insp > .3 ? "callout warn" : "callout";
              K.$("#split-msg", el).innerHTML = insp > .3 ? "<p><b>Inspirasi:</b> aliran balik ke jantung kanan ↑ → ejeksi VKa lebih lama → <b>P2 terlambat</b> → S2 terdengar terbelah (“d-dub”). Ini normal.</p>" : "<p><b>Ekspirasi:</b> A2 dan P2 hampir bersamaan → S2 terdengar tunggal.</p>";
              beatT += dt;
              if (snd && beatT > .85) { beatT = 0; K.thump(55, .15, .8); K.thump(85, .07, .7, .32); K.thump(70, .07, .6, .32 + insp * .06); }
            });
          } },
      ]},
      { id: "klinis", title: "Hubungan Klinis", cards: [
        { type: "clinic", heading: "Jika katupnya bermasalah…", emoji: "🩺", intro: "Murmur = bunyi aliran darah yang turbulen. Kuncinya: KAPAN (sistol/diastol) dan DI MANA terdengar.",
          items: [
            { icon: "🚪", title: "Stenosis aorta", chain: ["Katup aorta menyempit", "Saat sistol darah dipaksa melewati lubang sempit → turbulen", "Murmur <b>sistolik</b> (antara S1–S2), paling jelas di area aorta, menjalar ke leher"] },
            { icon: "↩️", title: "Regurgitasi mitral", chain: ["Katup mitral tidak menutup rapat", "Saat sistol darah bocor balik dari VKi ke AKi", "Murmur <b>sistolik</b> sepanjang sistol, paling jelas di apeks"] },
            { icon: "🔒", title: "Stenosis mitral", chain: ["Katup mitral menyempit", "Saat diastol darah sulit mengalir dari AKi ke VKi", "Murmur <b>diastolik</b> bernada rendah di apeks; tekanan AKi naik → kongesti paru"] },
            { icon: "🫗", title: "S3 pada orang dewasa", chain: ["Ventrikel sudah terlalu penuh/lemah (mis. gagal jantung)", "Darah yang masuk cepat di awal diastol membuat dinding bergetar", "Terdengar bunyi ketiga setelah S2 (“ken-tuc-ky”)"] },
          ] },
      ]},
      { type: "quiz", questions: [
        { q: "Bunyi jantung pertama (S1) terutama disebabkan oleh…",
          options: ["Pembukaan katup aorta", "Penutupan katup mitral dan trikuspid", "Kontraksi atrium", "Penutupan katup aorta dan pulmonal"], answer: 1,
          explain: "S1 terjadi saat ventrikel mulai berkontraksi dan tekanannya melebihi tekanan atrium, sehingga katup AV (mitral & trikuspid) menutup." },
        { q: "Murmur yang terdengar di antara S1 dan S2 berarti gangguan terjadi pada fase…",
          options: ["Diastol", "Sistol ventrikel", "Kontraksi atrium", "Relaksasi isovolumetrik saja"], answer: 1,
          explain: "Rentang S1 → S2 adalah sistol ventrikel. Murmur di sini disebut murmur sistolik (mis. stenosis aorta, regurgitasi mitral)." },
        { q: "Mengapa S2 terdengar terbelah (split) saat inspirasi?",
          options: ["Katup aorta menutup lebih lambat", "Aliran balik ke jantung kanan meningkat sehingga ejeksi VKa memanjang dan P2 terlambat", "Paru-paru menutupi suara A2", "Denyut jantung berhenti sesaat"], answer: 1,
          explain: "Inspirasi menurunkan tekanan intratoraks → venous return kanan ↑ → VKa butuh waktu lebih lama untuk ejeksi → katup pulmonal menutup lebih lambat." },
        { q: "Di titik auskultasi manakah S1 terdengar paling keras?",
          options: ["ICS 2 parasternal kanan", "ICS 2 parasternal kiri", "ICS 5 midklavikula kiri (apeks)", "Di atas klavikula"], answer: 2,
          explain: "S1 didominasi penutupan katup mitral, yang paling jelas didengar di apeks (area mitral). Di basis (area aorta/pulmonal) S2 lebih keras." },
        { q: "Saat HR meningkat tinggi, bagian mana yang paling banyak memendek?",
          options: ["Jarak S1 → S2 (sistol)", "Jarak S2 → S1 berikutnya (diastol)", "Keduanya sama besar", "Tidak ada yang berubah"], answer: 1,
          explain: "Durasi sistol relatif tetap, sedangkan diastol memendek drastis saat takikardia (lihat juga A2). Di stetoskop, irama lub-dub menjadi hampir sama jaraknya." },
      ]},
    ],
  });
})();
