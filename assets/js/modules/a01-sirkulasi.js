/* =========================================================
   Modul A1 — Sirkulasi Sistemik & Pulmonal
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ---------------------------------------------------------
     1. DATA: segmen pembuluh & langkah-langkah
     o2: "poor" | "rich" | "p2r" (miskin→kaya) | "r2p" (kaya→miskin)
     type: jenis pembuluh untuk mode warna arteri/vena
     --------------------------------------------------------- */
  const SEGMENTS = {
    vc:    { o2: "poor", type: "vein" },
    ra_rv: { o2: "poor", type: "chamber" },
    pa:    { o2: "poor", type: "artery" },
    lung:  { o2: "p2r",  type: "cap" },
    pv:    { o2: "rich", type: "vein" },
    la_lv: { o2: "rich", type: "chamber" },
    ao:    { o2: "rich", type: "artery" },
    body:  { o2: "r2p",  type: "cap" },
  };
  const ORDER = ["vc", "ra_rv", "pa", "lung", "pv", "la_lv", "ao", "body"];

  const STEPS = [
    { title: "Darah pulang dari tubuh",
      body: `Darah yang sudah “dipakai” jaringan kini <b>miskin O₂</b> dan kaya CO₂. Ia kembali melalui <b>vena kava superior & inferior</b> lalu masuk ke <b>atrium kanan</b>.`,
      key: "Atrium kanan = ruang tunggu darah dari seluruh tubuh.",
      segs: ["vc"], hl: ["vc", "RA", "body"], valves: [] },
    { title: "Atrium kanan → ventrikel kanan",
      body: `Darah turun dari atrium kanan ke <b>ventrikel kanan</b> melewati <b>katup trikuspid</b>. Katup ini terbuka ke arah bawah saja, jadi darah tidak bisa balik ke atas.`,
      key: "Katup = pintu satu arah. Arah aliran selalu dijaga katup.",
      segs: ["ra_rv"], hl: ["RA", "RV", "tri"], valves: ["tri"] },
    { title: "Ventrikel kanan memompa ke paru",
      body: `Ventrikel kanan berkontraksi, <b>katup pulmonal</b> terbuka, dan darah didorong ke <b>arteri pulmonalis</b> menuju paru-paru.`,
      key: "Arteri pulmonalis membawa darah MISKIN O₂ — karena “arteri” artinya menjauhi jantung.",
      segs: ["pa"], hl: ["RV", "pa", "pul"], valves: ["pul"] },
    { title: "Pertukaran gas di kapiler paru",
      body: `Di kapiler paru yang menyelimuti alveolus, <b>CO₂ keluar</b> dari darah ke alveolus dan <b>O₂ masuk</b> ke darah. Perhatikan warna partikel berubah dari biru ke merah.`,
      key: "Inilah satu-satunya tujuan sirkulasi pulmonal: mengisi O₂ & membuang CO₂.",
      segs: ["lung"], hl: ["lungs", "lung"], valves: [] },
    { title: "Kembali ke jantung kiri",
      body: `Darah yang kini <b>kaya O₂</b> kembali melalui <b>vena pulmonalis</b> dan masuk ke <b>atrium kiri</b>.`,
      key: "Vena pulmonalis membawa darah KAYA O₂ — karena “vena” artinya menuju jantung.",
      segs: ["pv"], hl: ["pv", "LA"], valves: [] },
    { title: "Atrium kiri → ventrikel kiri",
      body: `Darah turun ke <b>ventrikel kiri</b> melalui <b>katup mitral</b> (bikuspid). Sirkulasi pulmonal selesai; sirkulasi sistemik dimulai.`,
      key: "Ventrikel kiri = pompa terkuat jantung, dindingnya paling tebal.",
      segs: ["la_lv"], hl: ["LA", "LV", "mit"], valves: ["mit"] },
    { title: "Ventrikel kiri memompa ke seluruh tubuh",
      body: `Ventrikel kiri berkontraksi kuat, <b>katup aorta</b> terbuka, dan darah dipompa ke <b>aorta</b> dengan tekanan tinggi (≈120 mmHg saat sistol), lalu bercabang ke seluruh arteri tubuh.`,
      key: "Tekanan tinggi diperlukan karena sirkuit sistemik panjang dan resistensinya besar.",
      segs: ["ao"], hl: ["LV", "ao", "aor"], valves: ["aor"] },
    { title: "Pertukaran di kapiler jaringan",
      body: `Di kapiler jaringan, <b>O₂ dan nutrien berpindah ke sel</b>, sedangkan <b>CO₂ dan sisa metabolisme masuk ke darah</b>. Partikel berubah dari merah ke biru, lalu masuk vena… dan siklus berulang.`,
      key: "Satu putaran penuh di tubuh saat istirahat hanya butuh sekitar 1 menit.",
      segs: ["body"], hl: ["body"], valves: [] },
    { title: "Gambaran utuh: dua sirkuit seri",
      body: `Sekarang lihat semuanya sekaligus. <b>Kanan</b> → paru → <b>kiri</b> → tubuh → <b>kanan</b> lagi. Darah selalu melewati <b>dua kapiler</b> dalam satu putaran penuh: kapiler paru dan kapiler jaringan.`,
      key: "Karena seri, volume yang dipompa VKa per menit = volume yang dipompa VKi per menit.",
      segs: ORDER, hl: ["RA", "RV", "LA", "LV", "lungs", "body", ...ORDER, "tri", "pul", "mit", "aor"], valves: ["tri", "pul", "mit", "aor"] },
  ];

  const INFO = {
    RA: ["Atrium kanan", "Menampung darah miskin O₂ dari vena kava (dan dari sinus koronarius). Dindingnya tipis karena hanya mendorong darah ke ventrikel di bawahnya."],
    RV: ["Ventrikel kanan", "Memompa darah ke paru. Cukup dengan tekanan rendah (≈25 mmHg saat sistol), sehingga dindingnya lebih tipis daripada ventrikel kiri."],
    LA: ["Atrium kiri", "Menerima darah kaya O₂ dari 4 vena pulmonalis lalu meneruskannya ke ventrikel kiri."],
    LV: ["Ventrikel kiri", "Pompa utama sirkulasi sistemik. Membangkitkan tekanan ≈120 mmHg saat sistol; dindingnya ±3× lebih tebal dari ventrikel kanan."],
    lungs: ["Kapiler paru", "Tempat pertukaran gas dengan alveolus. Resistensinya rendah sehingga tekanan di sirkulasi paru juga rendah."],
    body: ["Kapiler jaringan (sistemik)", "Tempat O₂ dan nutrien dilepas ke sel, serta CO₂ dan sisa metabolisme diambil. Ada di semua organ: otak, otot, ginjal, usus, kulit…"],
    vc: ["Vena kava superior & inferior", "Vena terbesar tubuh. Membawa darah miskin O₂ dari tubuh bagian atas (superior) dan bawah (inferior) ke atrium kanan."],
    pa: ["Arteri pulmonalis", "Satu-satunya arteri (selain arteri umbilikalis janin) yang membawa darah miskin O₂. Disebut arteri karena alirannya menjauhi jantung."],
    pv: ["Vena pulmonalis", "Membawa darah kaya O₂ dari paru ke atrium kiri. Disebut vena karena alirannya menuju jantung."],
    ao: ["Aorta", "Arteri terbesar tubuh. Menerima darah dari ventrikel kiri dan membaginya ke seluruh arteri sistemik."],
    lung: ["Kapiler paru", "Darah biru (miskin O₂) masuk, darah merah (kaya O₂) keluar."],
    tri: ["Katup trikuspid", "Katup atrioventrikular kanan (3 daun). Mencegah aliran balik dari ventrikel kanan ke atrium kanan saat ventrikel berkontraksi."],
    mit: ["Katup mitral (bikuspid)", "Katup atrioventrikular kiri (2 daun). Mencegah aliran balik ke atrium kiri saat ventrikel kiri berkontraksi."],
    pul: ["Katup pulmonal", "Katup semilunar di pangkal arteri pulmonalis. Mencegah darah kembali ke ventrikel kanan saat ventrikel relaksasi."],
    aor: ["Katup aorta", "Katup semilunar di pangkal aorta. Mencegah darah kembali ke ventrikel kiri saat ventrikel relaksasi."],
  };

  /* ---------------------------------------------------------
     2. DIAGRAM SIRKULASI + ANIMASI PARTIKEL
     --------------------------------------------------------- */
  const svg = document.getElementById("circ-svg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const particleLayer = document.getElementById("particles");
  const segEls = {};
  svg.querySelectorAll(".vessel").forEach((p) => {
    segEls[p.dataset.seg] = { el: p, len: p.getTotalLength() };
  });

  let colorMode = "o2";
  let stepIdx = 0;
  let playing = false;
  let playTimer = null;

  function mix(a, b, t) {
    const pa = hexToRgb(a), pb = hexToRgb(b);
    if (!pa || !pb) return t < .5 ? a : b;
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }
  function hexToRgb(h) {
    const m = /^#?([0-9a-f]{6})$/i.exec(h);
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function paintVessels() {
    const rich = css("--o2-rich"), poor = css("--o2-poor");
    for (const [id, { el }] of Object.entries(segEls)) {
      const s = SEGMENTS[id];
      let color;
      if (colorMode === "o2") {
        color = s.o2 === "poor" ? poor : s.o2 === "rich" ? rich : s.o2 === "p2r" ? "url(#lungGrad)" : "url(#bodyGrad)";
      } else {
        color = s.type === "artery" ? css("--artery") : s.type === "vein" ? css("--vein") : css("--text-soft");
      }
      el.style.stroke = color;
    }
    svg.querySelectorAll(".chamber rect").forEach((r) => {
      if (colorMode === "o2") r.style.fill = r.dataset.side === "right" ? poor : rich;
      else r.style.fill = css("--text-soft");
    });
    const legend = document.getElementById("legend");
    legend.innerHTML = colorMode === "o2"
      ? `<span><i style="background:${rich}"></i>Kaya O₂</span><span><i style="background:${poor}"></i>Miskin O₂</span><span>Pembuluh tebal = sedang aktif</span>`
      : `<span><i style="background:${css("--artery")}"></i>Arteri (menjauhi jantung)</span><span><i style="background:${css("--vein")}"></i>Vena (menuju jantung)</span><span class="muted">Partikel tetap menunjukkan kadar O₂</span>`;
  }

  function paintValves(open) {
    svg.querySelectorAll(".valve").forEach((v) => {
      const isOpen = open.includes(v.dataset.valve);
      v.style.fill = isOpen ? css("--ok") : css("--text");
      v.style.opacity = isOpen ? "1" : ".75";
    });
  }

  // Partikel: dibuat ulang setiap pindah langkah
  let particles = [];
  function buildParticles(segIds) {
    particleLayer.innerHTML = "";
    particles = [];
    segIds.forEach((id) => {
      const { len } = segEls[id];
      const n = Math.max(2, Math.round(len / 40));
      for (let i = 0; i < n; i++) {
        const c = document.createElementNS(NS, "circle");
        c.setAttribute("r", "5");
        c.setAttribute("stroke", "#fff");
        c.setAttribute("stroke-width", "1.5");
        particleLayer.appendChild(c);
        particles.push({ el: c, seg: id, offset: (i / n) * len });
      }
    });
  }

  const SPEED = 55; // px per detik
  let lastT = null, clock = 0;
  function frame(t) {
    if (lastT == null) lastT = t;
    const dt = Math.min((t - lastT) / 1000, .1);
    lastT = t;
    if (!document.hidden && isVisible()) clock += dt;
    const rich = css("--o2-rich"), poor = css("--o2-poor");
    particles.forEach((p) => {
      const { el, len } = segEls[p.seg];
      const d = (p.offset + clock * SPEED) % len;
      const pt = el.getPointAtLength(d);
      p.el.setAttribute("cx", pt.x);
      p.el.setAttribute("cy", pt.y);
      const s = SEGMENTS[p.seg].o2;
      const f = d / len;
      const col = s === "poor" ? poor : s === "rich" ? rich : s === "p2r" ? mix(poor, rich, f) : mix(rich, poor, f);
      p.el.setAttribute("fill", col);
    });
    requestAnimationFrame(frame);
  }
  function isVisible() { return document.getElementById("tahap").classList.contains("active"); }

  function highlight(ids) {
    svg.classList.add("dimmed");
    svg.querySelectorAll(".hl").forEach((e) => e.classList.remove("hl"));
    ids.forEach((id) => {
      svg.querySelectorAll(`[data-part="${id}"], [data-seg="${id}"]`).forEach((e) => e.classList.add("hl"));
    });
  }

  const stepBody = document.getElementById("step-body");
  const stepCounter = document.getElementById("step-counter");
  const dots = document.getElementById("step-dots");
  dots.innerHTML = STEPS.map((_, i) => `<button type="button" aria-label="Langkah ${i + 1}" data-i="${i}"></button>`).join("");
  dots.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { stopPlay(); goStep(+b.dataset.i); }));

  function goStep(i) {
    stepIdx = (i + STEPS.length) % STEPS.length;
    const s = STEPS[stepIdx];
    stepCounter.textContent = `Langkah ${stepIdx + 1} dari ${STEPS.length}`;
    stepBody.innerHTML = `<h3 class="step-title">${s.title}</h3><p>${s.body}</p><div class="callout green"><p>🔑 ${s.key}</p></div>`;
    stepBody.style.animation = "none"; void stepBody.offsetWidth; stepBody.style.animation = "";
    dots.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", j === stepIdx));
    document.getElementById("step-prev").disabled = stepIdx === 0 && !playing;
    document.getElementById("step-next").textContent = stepIdx === STEPS.length - 1 ? "↺ Dari awal" : "Selanjutnya →";
    highlight(s.hl);
    paintValves(s.valves);
    buildParticles(s.segs);
  }

  function startPlay() {
    playing = true;
    document.getElementById("step-play").textContent = "⏸ Jeda";
    playTimer = setInterval(() => goStep(stepIdx + 1), 5000);
  }
  function stopPlay() {
    playing = false;
    clearInterval(playTimer);
    document.getElementById("step-play").textContent = "▶ Putar otomatis";
  }

  document.getElementById("step-prev").addEventListener("click", () => { stopPlay(); goStep(stepIdx - 1); });
  document.getElementById("step-next").addEventListener("click", () => { stopPlay(); goStep(stepIdx + 1); });
  document.getElementById("step-play").addEventListener("click", () => {
    if (playing) stopPlay(); else { goStep(stepIdx + 1 === STEPS.length ? 0 : stepIdx); startPlay(); }
  });

  // Klik bagian diagram
  const infoPanel = document.getElementById("info-panel");
  svg.querySelectorAll(".part").forEach((part) => {
    const show = () => {
      const [t, d] = INFO[part.dataset.part] || ["", ""];
      infoPanel.innerHTML = `<b>${t}</b><br>${d}`;
    };
    part.addEventListener("click", show);
    part.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
  });

  // Mode warna
  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    colorMode = b.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("on", x === b));
    paintVessels();
    if (colorMode === "type") {
      infoPanel.innerHTML = `<b>Perhatikan!</b> Arteri pulmonalis berwarna <span style="color:${css("--artery")}">oranye (arteri)</span> padahal isinya darah <span style="color:${css("--o2-poor")}">miskin O₂</span>. Nama pembuluh ditentukan oleh <b>arah aliran</b>, bukan kadar O₂.`;
    }
  }));

  // Tema berubah → warna ulang
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => setTimeout(() => { paintVessels(); paintValves(STEPS[stepIdx].valves); }, 0)));
  document.addEventListener("lesson:show", (e) => { if (e.detail.id !== "tahap") stopPlay(); });

  paintVessels();
  goStep(0);
  requestAnimationFrame(frame);

  /* ---------------------------------------------------------
     3. PEMBANDING & RANTAI SEBAB-AKIBAT
     --------------------------------------------------------- */
  const compareBtn = document.getElementById("compare-btn");
  compareBtn.addEventListener("click", () => {
    document.querySelectorAll("#compare .bar > span").forEach((s, i) => {
      s.style.width = "0";
      setTimeout(() => { s.style.width = s.dataset.w + "%"; }, 80 + (i % 4) * 150);
    });
    compareBtn.textContent = "↺ Ulangi animasi";
  });

  const CHAINS = [
    { label: "Mengapa dinding VKi lebih tebal?", nodes: [
      ["cause", "Sirkuit sistemik sangat panjang & bercabang ke seluruh organ"],
      ["", "Total resistensi pembuluhnya jauh lebih besar dibanding sirkuit paru"],
      ["", "Untuk mendorong 5 L/menit melawan resistensi besar, dibutuhkan tekanan tinggi (≈120 mmHg)"],
      ["", "VKi harus bekerja jauh lebih keras setiap denyut"],
      ["effect", "Otot VKi beradaptasi → dindingnya ±3× lebih tebal dari VKa"],
    ]},
    { label: "Mengapa output kanan = kiri?", nodes: [
      ["cause", "Sirkuit pulmonal dan sistemik tersusun SERI (berurutan)"],
      ["", "Semua darah yang dipompa VKa harus melewati paru lalu masuk ke VKi"],
      ["", "Jika satu pompa terus lebih kuat, darah akan menumpuk di salah satu sirkuit"],
      ["effect", "Maka dalam jangka panjang, output VKa ≈ output VKi (≈5 L/menit saat istirahat)"],
    ]},
    { label: "Mengapa arteri pulmonalis berisi darah “biru”?", nodes: [
      ["cause", "Nama arteri/vena ditentukan oleh ARAH aliran, bukan kadar O₂"],
      ["", "Arteri = membawa darah MENJAUHI jantung; vena = MENUJU jantung"],
      ["", "Arteri pulmonalis membawa darah dari VKa ke paru — darah ini baru pulang dari tubuh"],
      ["effect", "Jadi arteri pulmonalis berisi darah miskin O₂, sedangkan vena pulmonalis berisi darah kaya O₂"],
    ]},
  ];
  const chainEl = document.getElementById("chain");
  const chainTabs = document.getElementById("chain-tabs");
  const chainNext = document.getElementById("chain-next");
  let chainIdx = 0, chainShown = 0;
  chainTabs.innerHTML = CHAINS.map((c, i) => `<button class="btn btn-sm" type="button" data-c="${i}">${c.label}</button>`).join("");
  function renderChain() {
    const c = CHAINS[chainIdx];
    chainTabs.querySelectorAll("button").forEach((b, i) => b.classList.toggle("btn-primary", i === chainIdx));
    chainEl.innerHTML = c.nodes.slice(0, chainShown).map(([k, t], i) =>
      `${i ? '<div class="chain-arrow">↓</div>' : ""}<div class="chain-node ${k}">${t}</div>`).join("");
    const done = chainShown >= c.nodes.length;
    chainNext.textContent = done ? "↺ Ulangi rantai ini" : "Tampilkan langkah berikutnya ↓";
  }
  chainTabs.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { chainIdx = +b.dataset.c; chainShown = 1; renderChain(); }));
  chainNext.addEventListener("click", () => {
    chainShown = chainShown >= CHAINS[chainIdx].nodes.length ? 1 : chainShown + 1;
    renderChain();
  });
  chainShown = 1; renderChain();

  /* ---------------------------------------------------------
     4. GAME SUSUN RUTE
     --------------------------------------------------------- */
  const ROUTE = ["Vena kava", "Atrium kanan", "Katup trikuspid", "Ventrikel kanan", "Katup pulmonal", "Arteri pulmonalis",
    "Kapiler paru", "Vena pulmonalis", "Atrium kiri", "Katup mitral", "Ventrikel kiri", "Katup aorta", "Aorta", "Kapiler jaringan"];
  const HINTS = {
    "Atrium kanan": "Darah dari vena kava selalu masuk ke ruang penampung di sisi kanan.",
    "Katup trikuspid": "Sebelum masuk ventrikel kanan, darah harus melewati katup AV kanan.",
    "Ventrikel kanan": "Setelah katup trikuspid, darah masuk ke ruang pompa kanan.",
    "Katup pulmonal": "Ventrikel kanan mendorong darah keluar melewati katup semilunar kanan.",
    "Arteri pulmonalis": "Pembuluh yang membawa darah dari jantung kanan ke paru.",
    "Kapiler paru": "Di mana darah mengambil O₂?",
    "Vena pulmonalis": "Pembuluh yang membawa darah kaya O₂ kembali ke jantung.",
    "Atrium kiri": "Darah dari paru masuk ke ruang penampung sisi kiri.",
    "Katup mitral": "Katup AV kiri, antara atrium kiri dan ventrikel kiri.",
    "Ventrikel kiri": "Pompa terkuat jantung.",
    "Katup aorta": "Katup semilunar kiri.",
    "Aorta": "Arteri terbesar tubuh.",
    "Kapiler jaringan": "Tempat O₂ dilepaskan ke sel.",
  };
  const slots = document.getElementById("route-slots");
  const pool = document.getElementById("token-pool");
  const routeMsg = document.getElementById("route-msg");
  let routePos = 0;

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function resetRoute() {
    routePos = 1;
    slots.innerHTML = `<span class="token placed">${ROUTE[0]}</span>`;
    pool.innerHTML = shuffle(ROUTE.slice(1)).map((t) => `<button type="button" class="token" data-t="${t}">${t}</button>`).join("");
    routeMsg.innerHTML = `<span class="muted">Struktur berikutnya setelah <b>vena kava</b>?</span>`;
    pool.querySelectorAll(".token").forEach((b) => b.addEventListener("click", () => pick(b)));
  }
  function pick(btn) {
    const t = btn.dataset.t;
    if (t === ROUTE[routePos]) {
      btn.classList.add("used");
      slots.insertAdjacentHTML("beforeend", `<span class="arrow">→</span><span class="token placed">${t}</span>`);
      routePos++;
      if (routePos === ROUTE.length) {
        routeMsg.innerHTML = `<div class="callout green"><p>🎉 <b>Sempurna!</b> Dari kapiler jaringan, darah masuk venula → vena → kembali ke vena kava. Satu putaran lengkap melewati <b>4 ruang</b>, <b>4 katup</b>, dan <b>2 jaringan kapiler</b>.</p></div>`;
      } else {
        routeMsg.innerHTML = `<span style="color:var(--ok)">✓ Benar.</span> <span class="muted">Lanjut: setelah <b>${t}</b>?</span>`;
      }
    } else {
      btn.classList.remove("wrong"); void btn.offsetWidth; btn.classList.add("wrong");
      routeMsg.innerHTML = `<span style="color:var(--bad)">✗ Belum tepat.</span> Petunjuk: ${HINTS[ROUTE[routePos]]}`;
    }
  }
  document.getElementById("route-reset").addEventListener("click", resetRoute);
  resetRoute();

  /* ---------------------------------------------------------
     5. SIMULATOR KESEIMBANGAN POMPA
     --------------------------------------------------------- */
  const rIn = document.getElementById("pump-right");
  const lIn = document.getElementById("pump-left");
  const TANK_TOP = 34, TANK_BOTTOM = 180, NORMAL = 0.5; // proporsi isi normal
  function setTank(el, frac) {
    frac = Math.max(.12, Math.min(.98, frac));
    const h = (TANK_BOTTOM - TANK_TOP) * frac;
    el.setAttribute("y", TANK_BOTTOM - h);
    el.setAttribute("height", h);
  }
  function updateBalance() {
    const R = +rIn.value, L = +lIn.value;
    document.getElementById("out-right").textContent = R + "%";
    document.getElementById("out-left").textContent = L + "%";
    const diff = (R - L) / 60; // -1..1
    setTank(document.getElementById("tank-lung"), NORMAL + diff * 0.48);
    setTank(document.getElementById("tank-sys"), NORMAL - diff * 0.48);
    const lw = document.getElementById("lung-warn"), sw = document.getElementById("sys-warn");
    lw.textContent = diff > .15 ? "⚠ Kongesti paru" : "";
    sw.textContent = diff < -.15 ? "⚠ Bendungan vena" : "";
    lw.style.fill = sw.style.fill = css("--bad");
    const msg = document.getElementById("balance-msg");
    if (Math.abs(diff) <= .15) {
      msg.className = "callout green";
      msg.innerHTML = "<p><b>Seimbang.</b> Darah yang keluar dari VKa sama dengan yang dipompa VKi, sehingga tidak ada penumpukan.</p>";
    } else if (diff > 0) {
      msg.className = "callout red";
      msg.innerHTML = "<p><b>VKi lebih lemah dari VKa.</b> Darah terus dikirim ke paru tetapi tidak cukup cepat dipompa keluar oleh VKi → darah <b>menumpuk di pembuluh paru</b>. Pasien akan merasa <b>sesak napas</b>.</p>";
    } else {
      msg.className = "callout red";
      msg.innerHTML = "<p><b>VKa lebih lemah dari VKi.</b> Darah dari tubuh tidak cukup cepat dipompa ke paru → darah <b>menumpuk di vena sistemik</b>: vena leher membesar, <b>tungkai bengkak</b>.</p>";
    }
  }
  rIn.addEventListener("input", updateBalance);
  lIn.addEventListener("input", updateBalance);
  updateBalance();

  /* ---------------------------------------------------------
     6. KUIS
     --------------------------------------------------------- */
  initQuiz("quiz", "a01", [
    { q: "Sebuah sel darah merah sedang berada di <b>vena pulmonalis</b>. Ruang jantung mana yang akan ia masuki pertama kali?",
      options: ["Atrium kanan", "Atrium kiri", "Ventrikel kiri", "Ventrikel kanan"], answer: 1,
      explain: "Vena pulmonalis membawa darah kaya O₂ dari paru <b>menuju</b> jantung kiri, dan pintu masuknya adalah <b>atrium kiri</b>. Darah tidak bisa langsung ke ventrikel kiri tanpa melewati atrium kiri dan katup mitral." },
    { q: "Arteri pulmonalis berisi darah miskin O₂. Mengapa tetap disebut <b>arteri</b>?",
      options: ["Karena dindingnya paling tebal di tubuh", "Karena membawa darah menjauhi jantung", "Karena tekanannya lebih tinggi dari aorta", "Karena berasal dari ventrikel kiri"], answer: 1,
      explain: "Penamaan arteri/vena didasarkan pada <b>arah aliran</b>: arteri menjauhi jantung, vena menuju jantung. Kadar O₂ tidak menentukan nama. Tekanan arteri pulmonalis justru jauh <b>lebih rendah</b> dari aorta, dan ia berasal dari ventrikel <b>kanan</b>." },
    { q: "Dinding ventrikel kiri jauh lebih tebal daripada ventrikel kanan. Penjelasan yang paling tepat adalah…",
      options: ["Ventrikel kiri memompa volume darah lebih banyak per denyut", "Ventrikel kiri harus menghasilkan tekanan lebih tinggi untuk melawan resistensi sistemik yang besar", "Ventrikel kiri menerima darah kaya O₂ sehingga ototnya tumbuh lebih besar", "Ventrikel kiri berkontraksi lebih dulu daripada ventrikel kanan"], answer: 1,
      explain: "Kedua ventrikel memompa <b>volume yang sama</b> (karena sirkuitnya seri). Bedanya ada pada <b>tekanan</b>: sirkuit sistemik punya resistensi jauh lebih besar, sehingga VKi harus membangkitkan tekanan ±120 mmHg vs ±25 mmHg pada VKa. Beban tekanan inilah yang membuat ototnya tebal." },
    { q: "Pada seorang pasien, <b>ventrikel kiri melemah</b> sedangkan ventrikel kanan masih normal. Di mana darah akan menumpuk lebih dulu?",
      options: ["Vena tungkai", "Pembuluh darah paru", "Aorta", "Vena kava inferior"], answer: 1,
      explain: "Darah menumpuk <b>sebelum</b> pompa yang lemah. Sebelum VKi ada atrium kiri → vena pulmonalis → kapiler paru. VKa yang normal terus mengirim darah ke paru, sementara VKi tidak mampu mengeluarkannya → <b>kongesti paru</b> → sesak napas. Penumpukan di vena tungkai lebih khas untuk kelemahan VKa." },
    { q: "Saat istirahat, ventrikel kanan memompa sekitar <b>5 liter darah per menit</b>. Dalam keadaan stabil, berapa yang dipompa ventrikel kiri per menit?",
      options: ["Sekitar 2,5 liter, karena sirkuit paru lebih pendek", "Sekitar 5 liter, sama dengan ventrikel kanan", "Sekitar 10 liter, karena tekanannya lebih tinggi", "Tergantung kadar O₂ darah"], answer: 1,
      explain: "Karena kedua sirkuit tersusun <b>seri</b>, semua darah yang keluar dari VKa pasti masuk ke VKi setelah melewati paru. Jika output keduanya berbeda terus-menerus, darah akan menumpuk di salah satu sirkuit. Tekanan yang lebih tinggi tidak berarti volume lebih banyak." },
  ]);
});
