/* =========================================================
   KardioBelajar — logika bersama
   - Daftar modul (satu sumber kebenaran)
   - Progres belajar (disimpan di localStorage browser)
   - Sidebar navigasi, tema terang/gelap
   - Mesin "langkah pelajaran" dan kuis yang dipakai ulang tiap modul
   ========================================================= */

const MODULES = [
  // A. Fisiologi Jantung
  { id: "a01", group: "A", num: 1, title: "Sirkulasi Sistemik & Pulmonal", file: "a01-sirkulasi.html", ready: true,
    desc: "Perjalanan darah melalui dua sirkuit: paru dan seluruh tubuh." },
  { id: "a02", group: "A", num: 2, title: "Sirkulasi Koroner", file: "a02-koroner.html", ready: true, desc: "Bagaimana otot jantung sendiri mendapat darah." },
  { id: "a03", group: "A", num: 3, title: "Produksi ATP di Otot Jantung", file: "a03-atp.html", desc: "Bahan bakar jantung yang tak pernah berhenti bekerja." },
  { id: "a04", group: "A", num: 4, title: "Ciri & Jenis Sel Otot Jantung", file: "a04-sel-otot.html", desc: "Sel kontraktil vs sel autoritmik, diskus interkalaris." },
  { id: "a05", group: "A", num: 5, title: "Sistem Hantaran Jantung", file: "a05-hantaran.html", desc: "SA node → AV node → Bundle of His → Purkinje." },
  { id: "a06", group: "A", num: 6, title: "Ritme Jantung & Pacemaker Potential", file: "a06-pacemaker.html", desc: "Mengapa jantung bisa berdenyut sendiri." },
  { id: "a07", group: "A", num: 7, title: "Potensial Aksi Sel Kontraktil", file: "a07-potensial-aksi.html", desc: "Fase 0–4 dan peran Na⁺, Ca²⁺, K⁺." },
  { id: "a08", group: "A", num: 8, title: "Elektrokardiogram (EKG)", file: "a08-ekg.html", desc: "Membaca gelombang P, QRS, dan T." },
  { id: "a09", group: "A", num: 9, title: "Bunyi Jantung S1 & S2", file: "a09-bunyi-jantung.html", desc: "Asal bunyi jantung dan titik auskultasi." },
  { id: "a10", group: "A", num: 10, title: "Siklus Jantung & Diagram Wiggers", file: "a10-siklus-wiggers.html", desc: "Tekanan, volume, katup, EKG dalam satu waktu." },
  { id: "a11", group: "A", num: 11, title: "Cardiac Output & Cardiac Reserve", file: "a11-cardiac-output.html", desc: "CO = HR × SV dan kapasitas cadangan jantung." },
  { id: "a12", group: "A", num: 12, title: "Pengaturan Denyut Jantung", file: "a12-pengaturan-hr.html", desc: "Saraf otonom, pusat kardiovaskular, reseptor." },
  { id: "a13", group: "A", num: 13, title: "Stroke Volume & Hukum Frank-Starling", file: "a13-stroke-volume.html", desc: "Preload, kontraktilitas, dan afterload." },
  // B. Fisiologi Vaskular
  { id: "b01", group: "B", num: 1, title: "Jenis Pembuluh Darah", file: "b01-jenis-pembuluh.html", desc: "Arteri, arteriol, kapiler, venula, vena." },
  { id: "b02", group: "B", num: 2, title: "Karakteristik Tiap Pembuluh", file: "b02-karakteristik.html", desc: "Dinding, diameter, kecepatan aliran, tekanan." },
  { id: "b03", group: "B", num: 3, title: "Tekanan Darah", file: "b03-tekanan-darah.html", desc: "Sistolik, diastolik, tekanan nadi, MAP." },
  { id: "b04", group: "B", num: 4, title: "Resistensi Perifer", file: "b04-resistensi.html", desc: "Hukum Poiseuille: jari-jari adalah kunci." },
  { id: "b05", group: "B", num: 5, title: "Faktor Venous Return", file: "b05-venous-return.html", desc: "Pompa otot, pompa respirasi, venokonstriksi." },
  { id: "b06", group: "B", num: 6, title: "Regulasi Tekanan & Aliran Darah", file: "b06-regulasi.html", desc: "Kontrol lokal, neural, dan hormonal." },
];

const GROUPS = { A: "A. Fisiologi Jantung", B: "B. Fisiologi Vaskular" };
const STORE_KEY = "kardiobelajar-progress-v1";

/* ---------- Penyimpanan aman (bisa gagal di mode privat) ---------- */
const Store = {
  load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  },
  save(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* abaikan */ }
  },
};

const Progress = {
  data: Store.load(),
  get(id) { return this.data[id] || { visited: [], total: 0, quizDone: false, score: 0 }; },
  set(id, patch) { this.data[id] = Object.assign(this.get(id), patch); Store.save(this.data); },
  visit(id, sectionIdx, total) {
    const p = this.get(id);
    if (!p.visited.includes(sectionIdx)) p.visited.push(sectionIdx);
    this.set(id, { visited: p.visited, total });
  },
  percent(id) {
    const p = this.get(id);
    if (!p.total) return 0;
    // 80% dari membaca semua bagian, 20% dari menyelesaikan kuis
    const read = Math.min(p.visited.length / p.total, 1) * 80;
    return Math.round(read + (p.quizDone ? 20 : 0));
  },
  isDone(id) { return this.get(id).quizDone && this.percent(id) >= 100; },
  overall() {
    const sum = MODULES.reduce((s, m) => s + this.percent(m.id), 0);
    return Math.round(sum / MODULES.length);
  },
  reset() { this.data = {}; Store.save(this.data); },
};

/* ---------- Tema ---------- */
function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("kardiobelajar-theme"); } catch (e) {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("kardiobelajar-theme", next); } catch (e) {}
    });
  });
}

/* ---------- Sidebar ---------- */
function moduleHref(m, root) {
  return m.ready ? `${root}modul/${m.file}` : null;
}

function renderSidebar() {
  const el = document.getElementById("sidebar");
  if (!el) return;
  const root = document.body.dataset.root || "";
  const current = document.body.dataset.module || "";
  let html = `<a class="nav-item ${current ? "" : "active"}" href="${root}index.html">
      <span class="nav-num">⌂</span> Beranda</a>`;
  for (const g of Object.keys(GROUPS)) {
    html += `<h4>${GROUPS[g]}</h4>`;
    MODULES.filter((m) => m.group === g).forEach((m) => {
      const href = moduleHref(m, root);
      const cls = ["nav-item", m.id === current ? "active" : "", Progress.isDone(m.id) ? "done" : "", href ? "" : "locked"].join(" ");
      const pct = Progress.percent(m.id);
      const tag = !href ? "segera" : pct ? `${pct}%` : "";
      const num = Progress.isDone(m.id) ? "✓" : m.num;
      html += href
        ? `<a class="${cls}" href="${href}"><span class="nav-num">${num}</span><span>${m.title}</span><span class="nav-tag">${tag}</span></a>`
        : `<div class="${cls}" aria-disabled="true"><span class="nav-num">${num}</span><span>${m.title}</span><span class="nav-tag">${tag}</span></div>`;
    });
  }
  el.innerHTML = html;
  if (el.dataset.bound) return;
  el.dataset.bound = "1";

  const menuBtn = document.querySelector(".menu-btn");
  const overlay = document.querySelector(".overlay");
  if (menuBtn) menuBtn.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  if (overlay) overlay.addEventListener("click", () => document.body.classList.remove("nav-open"));
}

/* ---------- Halaman utama ---------- */
function renderHome() {
  const grid = document.getElementById("module-groups");
  if (!grid) return;
  let html = "";
  for (const g of Object.keys(GROUPS)) {
    const mods = MODULES.filter((m) => m.group === g);
    html += `<div class="section-head"><h2>${GROUPS[g]}</h2><span class="muted small">${mods.length} topik</span></div>
      <div class="module-grid">`;
    mods.forEach((m) => {
      const pct = Progress.percent(m.id);
      const done = Progress.isDone(m.id);
      const status = !m.ready
        ? `<span class="chip">Segera hadir</span>`
        : done ? `<span class="chip green">✓ Selesai</span>`
        : pct ? `<span class="chip red">${pct}%</span>` : `<span class="chip blue">Mulai</span>`;
      const inner = `
        <div class="mc-top"><span class="mc-num">${g}${m.num}</span>${status}</div>
        <h3>${m.title}</h3>
        <div class="mc-desc">${m.desc}</div>
        ${m.ready ? `<div class="progress"><span style="width:${pct}%"></span></div>` : ""}`;
      html += m.ready
        ? `<a class="module-card" href="modul/${m.file}">${inner}</a>`
        : `<div class="module-card locked">${inner}</div>`;
    });
    html += `</div>`;
  }
  grid.innerHTML = html;

  const overall = Progress.overall();
  const doneCount = MODULES.filter((m) => Progress.isDone(m.id)).length;
  const readyCount = MODULES.filter((m) => m.ready).length;
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set("stat-overall", overall + "%");
  set("stat-done", `${doneCount}/${MODULES.length}`);
  set("stat-ready", readyCount);
  const bar = document.getElementById("overall-bar");
  if (bar) bar.style.width = overall + "%";

  // tombol "lanjutkan belajar" mengarah ke modul siap pertama yang belum selesai
  const cont = document.getElementById("continue-btn");
  if (cont) {
    const next = MODULES.find((m) => m.ready && !Progress.isDone(m.id)) || MODULES.find((m) => m.ready);
    cont.href = `modul/${next.file}`;
    cont.querySelector("span").textContent = Progress.percent(next.id) ? "Lanjutkan belajar" : "Mulai belajar";
  }

  const reset = document.getElementById("reset-progress");
  if (reset) reset.addEventListener("click", () => {
    if (confirm("Hapus semua progres belajar di perangkat ini?")) { Progress.reset(); location.reload(); }
  });
}

/* ---------- Mesin langkah pelajaran (bagian 1..7 di tiap modul) ---------- */
function initLesson() {
  const moduleId = document.body.dataset.module;
  const sections = [...document.querySelectorAll(".lesson-section")];
  const stepper = document.getElementById("stepper");
  if (!moduleId || !sections.length || !stepper) return;

  const total = sections.length;
  const p = Progress.get(moduleId);
  stepper.innerHTML = sections.map((s, i) =>
    `<button type="button" data-i="${i}"><span class="dot">${i + 1}</span>${s.dataset.title}</button>`).join("");
  const btns = [...stepper.querySelectorAll("button")];
  const prev = document.getElementById("pager-prev");
  const next = document.getElementById("pager-next");
  const bar = document.getElementById("module-bar");
  const pctLabel = document.getElementById("module-pct");

  function refreshProgress() {
    const pr = Progress.get(moduleId);
    btns.forEach((b, i) => b.classList.toggle("visited", pr.visited.includes(i)));
    const pct = Progress.percent(moduleId);
    if (bar) bar.style.width = pct + "%";
    if (pctLabel) pctLabel.textContent = pct + "%";
  }

  function show(i, scroll = true) {
    i = Math.max(0, Math.min(total - 1, i));
    sections.forEach((s, j) => s.classList.toggle("active", j === i));
    btns.forEach((b, j) => b.classList.toggle("current", j === i));
    btns[i].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    Progress.visit(moduleId, i, total);
    refreshProgress();
    prev.disabled = i === 0;
    const mi = MODULES.findIndex((m) => m.id === moduleId);
    const nextMod = MODULES.slice(mi + 1).find((m) => m.ready);
    next.innerHTML = i === total - 1
      ? (nextMod ? `Topik berikutnya: ${nextMod.group}${nextMod.num} →` : "Kembali ke beranda ⌂")
      : `${sections[i + 1].dataset.title} →`;
    next.dataset.home = i === total - 1 ? (nextMod ? `modul/${nextMod.file}` : "index.html") : "";
    current = i;
    try { history.replaceState(null, "", "#" + sections[i].id); } catch (e) {}
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    document.dispatchEvent(new CustomEvent("lesson:show", { detail: { index: i, id: sections[i].id } }));
  }

  let current = 0;
  btns.forEach((b) => b.addEventListener("click", () => show(+b.dataset.i)));
  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => {
    if (next.dataset.home) location.href = (document.body.dataset.root || "") + next.dataset.home;
    else show(current + 1);
  });

  const fromHash = sections.findIndex((s) => "#" + s.id === location.hash);
  show(fromHash >= 0 ? fromHash : 0, false);
  document.addEventListener("progress:changed", refreshProgress);
}

/* ---------- Mesin kuis ---------- */
/**
 * questions: [{ q, options: [..], answer: index, explain: "..." }]
 */
function initQuiz(containerId, moduleId, questions) {
  const box = document.getElementById(containerId);
  if (!box) return;
  const letters = "ABCDE";
  let answered = 0, correct = 0;

  box.innerHTML = questions.map((item, qi) => `
    <div class="quiz-q" data-q="${qi}">
      <div class="q-num">Pertanyaan ${qi + 1} dari ${questions.length}</div>
      <h3>${item.q}</h3>
      <div class="options">
        ${item.options.map((o, oi) => `<button type="button" class="option" data-o="${oi}"><span class="letter">${letters[oi]}</span><span>${o}</span></button>`).join("")}
      </div>
      <div class="explain-slot"></div>
    </div>`).join("") + `<div id="${containerId}-result"></div>`;

  box.querySelectorAll(".quiz-q").forEach((qEl) => {
    const qi = +qEl.dataset.q;
    const item = questions[qi];
    qEl.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const oi = +btn.dataset.o;
        const ok = oi === item.answer;
        qEl.querySelectorAll(".option").forEach((b) => {
          b.disabled = true;
          if (+b.dataset.o === item.answer) b.classList.add("correct");
        });
        if (!ok) btn.classList.add("incorrect");
        answered++; if (ok) correct++;
        qEl.querySelector(".explain-slot").innerHTML = `
          <div class="explain ${ok ? "ok" : "no"}">
            <b>${ok ? "✅ Tepat!" : `❌ Belum tepat. Jawaban yang benar: ${letters[item.answer]}.`}</b><br>${item.explain}
          </div>`;
        if (answered === questions.length) finish();
      });
    });
  });

  function finish() {
    const pct = Math.round((correct / questions.length) * 100);
    Progress.set(moduleId, { quizDone: true, score: Math.max(pct, Progress.get(moduleId).score || 0) });
    document.dispatchEvent(new CustomEvent("progress:changed"));
    const msg = pct === 100 ? "Sempurna! Konsepnya sudah kamu kuasai. 🎉"
      : pct >= 60 ? "Bagus! Tinjau lagi penjelasan soal yang terlewat." : "Tidak apa-apa — ulangi bagian visual lalu coba lagi.";
    document.getElementById(`${containerId}-result`).innerHTML = `
      <div class="card quiz-result">
        <div class="muted small">Skor kamu</div>
        <div class="score">${correct}/${questions.length}</div>
        <p>${msg}</p>
        <div class="btn-row" style="justify-content:center">
          <button class="btn" type="button" id="${containerId}-retry">↺ Ulangi kuis</button>
        </div>
      </div>`;
    document.getElementById(`${containerId}-retry`).addEventListener("click", () => {
      initQuiz(containerId, moduleId, questions);
      box.scrollIntoView({ behavior: "smooth" });
    });
    renderSidebar();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderSidebar();
  renderHome();
  initLesson();
});
