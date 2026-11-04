/* =========================================================
   KardioBelajar — Mesin Modul
   Setiap modul cukup memanggil registerModule({...}) dengan
   data bagian-bagiannya. Mesin ini membangun kerangka halaman
   (header, sidebar, stepper, pager) dan komponen standar:
   explorer (langkah + visual), rantai sebab-akibat, kartu klinis,
   game urutan, game pasangan, dan kuis.
   ========================================================= */

const K = {
  css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); },
  $(sel, root = document) { return root.querySelector(sel); },
  $$(sel, root = document) { return [...root.querySelectorAll(sel)]; },
  clamp(v, a, b) { return Math.max(a, Math.min(b, v)); },
  lerp(a, b, t) { return a + (b - a) * t; },
  /** Interpolasi halus (kosinus) di antara titik kunci [[t, v], ...] */
  keys(points, t) {
    if (t <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
      const [t1, v1] = points[i];
      if (t <= t1) {
        const [t0, v0] = points[i - 1];
        const f = (t - t0) / (t1 - t0 || 1);
        return v0 + (v1 - v0) * (1 - Math.cos(Math.PI * f)) / 2;
      }
    }
    return points[points.length - 1][1];
  },
  /** Buat atribut d untuk path SVG dari fungsi y(x) */
  plot(fn, x0, x1, sx, sy, n = 200) {
    let d = "";
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n;
      d += (i ? "L" : "M") + sx(x).toFixed(1) + "," + sy(fn(x)).toFixed(1);
    }
    return d;
  },
  mixHex(a, b, t) {
    const h = (x) => { const m = /^#?([0-9a-f]{6})$/i.exec(x); if (!m) return null; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const pa = h(a), pb = h(b);
    if (!pa || !pb) return t < .5 ? a : b;
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  },
  /** Suara "dug" sederhana dengan WebAudio (untuk bunyi jantung, Korotkoff) */
  audio: null,
  thump(freq = 60, dur = .12, gain = .9, when = 0) {
    try {
      if (!K.audio) K.audio = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = K.audio;
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime + when;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq * 1.6, t);
      o.frequency.exponentialRampToValueAtTime(freq, t + dur * .5);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + .01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + .02);
    } catch (e) { /* audio tidak tersedia */ }
  },
  /** Loop animasi yang otomatis berhenti saat bagiannya tidak terlihat */
  loop(sectionEl, fn) {
    let last = null;
    function frame(t) {
      if (last == null) last = t;
      const dt = Math.min((t - last) / 1000, .1);
      last = t;
      if (!document.hidden && sectionEl.classList.contains("active")) fn(dt, t / 1000);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  },
  onTheme(fn) {
    K.$$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => setTimeout(fn, 0)));
  },
};

const _inits = [];

function registerModule(spec) {
  const meta = MODULES.find((m) => m.id === spec.id) || {};
  const groupName = meta.group === "B" ? "Fisiologi Vaskular" : "Fisiologi Jantung";
  document.body.dataset.module = spec.id;
  document.body.dataset.root = "../";
  document.title = `${meta.group}${meta.num} · ${meta.title} — KardioBelajar`;

  const sectionsHtml = spec.sections.map((s) => {
    if (s.type === "quiz") {
      return `<section class="lesson-section" id="${s.id || "kuis"}" data-title="${s.title || "Cek Pemahaman"}">
        <div class="card" style="margin-bottom:16px">
          <h2><span class="emoji">✅</span> Cek Pemahaman</h2>
          <p class="muted" style="margin:0">Jawab dulu dengan logikamu sendiri. Penjelasan muncul setelah kamu memilih.</p>
        </div>
        <div id="quiz"></div>
      </section>`;
    }
    const cards = (s.cards || []).map((c, ci) => renderCard(c, s, ci)).join("");
    return `<section class="lesson-section" id="${s.id}" data-title="${s.title}">${cards}</section>`;
  }).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="topbar">
      <button class="icon-btn menu-btn" type="button" aria-label="Buka menu">☰</button>
      <a class="brand" href="../index.html"><span class="brand-logo">♥</span> KardioBelajar</a>
      <span class="spacer"></span>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Ganti tema terang/gelap">🌓</button>
    </header>
    <div class="overlay"></div>
    <div class="layout">
      <nav class="sidebar" id="sidebar" aria-label="Daftar materi"></nav>
      <main class="main">
        <div class="container">
          <div class="module-head">
            <div class="eyebrow">${groupName} · Topik ${meta.group}${meta.num}</div>
            <h1>${meta.title}</h1>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="progress" style="flex:1"><span id="module-bar" style="width:0%"></span></div>
              <span class="small muted" id="module-pct">0%</span>
            </div>
          </div>
          <div class="stepper" id="stepper" role="tablist"></div>
          ${sectionsHtml}
          <div class="pager">
            <button class="btn" id="pager-prev" type="button">← Sebelumnya</button>
            <button class="btn btn-primary" id="pager-next" type="button">Selanjutnya →</button>
          </div>
        </div>
        <footer class="footer">KardioBelajar · Topik ${meta.group}${meta.num}</footer>
      </main>
    </div>`);

  // Inisialisasi setelah app.js memasang tema, sidebar, dan stepper
  document.addEventListener("DOMContentLoaded", () => {
    spec.sections.forEach((s) => {
      if (s.type === "quiz") { initQuiz("quiz", spec.id, s.questions); return; }
      const secEl = document.getElementById(s.id);
      (s.cards || []).forEach((c, ci) => {
        const cardEl = secEl.querySelector(`[data-card="${ci}"]`);
        try { initCard(c, cardEl, secEl); } catch (e) { console.error(e); }
      });
      if (s.init) s.init(secEl);
    });
    _inits.forEach((f) => f());
  });
}

function renderCard(c, s, ci) {
  if (typeof c === "string") c = { html: c };
  const head = c.heading ? `<h2>${c.emoji ? `<span class="emoji">${c.emoji}</span>` : ""}${c.heading}</h2>` : "";
  const sub = c.subheading ? `<h3 style="font-size:1.05rem">${c.subheading}</h3>` : "";
  const intro = c.intro ? `<p class="${c.type === "explorer" ? "muted small" : ""}">${c.intro}</p>` : "";
  let body = "";
  switch (c.type) {
    case "explorer":
      body = `<div class="explorer">
          <div class="explorer-text">
            <div class="step-counter"></div>
            <div class="step-body"></div>
          </div>
          <div class="explorer-ctrl">
            <div class="step-dots"></div>
            <div class="controls">
              <button class="btn btn-sm" data-act="prev" type="button">← Sebelumnya</button>
              <button class="btn btn-sm btn-primary" data-act="next" type="button">Selanjutnya →</button>
              ${c.noPlay ? "" : `<button class="btn btn-sm" data-act="play" type="button">▶ Putar otomatis</button>`}
            </div>
          </div>
          <div class="explorer-viz">
            <div class="viz-wrap">${c.viz}</div>
            ${c.info ? `<div class="info-panel">👆 <span class="muted">${c.infoHint || "Klik bagian diagram untuk melihat penjelasannya."}</span></div>` : ""}
          </div>
        </div>`;
      break;
    case "chain":
      body = `<div class="chain-tabs"></div><div class="chain"></div>
        <button class="btn btn-sm" data-act="chain-next" type="button">Tampilkan langkah berikutnya ↓</button>`;
      break;
    case "clinic":
      body = `<div class="clinic-grid">${c.items.map((it) => `
        <details class="clinic-card"><summary>${it.icon || "🩺"} ${it.title}</summary>
          <div class="clinic-body"><div class="chain">${it.chain.map((t, i, a) =>
            `${i ? '<div class="chain-arrow">↓</div>' : ""}<div class="chain-node ${i === 0 ? "cause" : i === a.length - 1 ? "effect" : ""}">${t}</div>`).join("")}</div></div>
        </details>`).join("")}</div>
        <div class="callout warn" style="margin-top:14px"><p>Fokus modul ini tetap fisiologi. Detail diagnosis & terapi dipelajari di blok klinis.</p></div>`;
      break;
    case "order":
      body = `<div class="route-slots"></div><div class="token-pool"></div>
        <div class="small route-msg" style="margin-top:10px"></div>
        <div class="btn-row" style="margin-top:10px"><button class="btn btn-sm" data-act="reset" type="button">↺ Ulangi</button></div>`;
      break;
    case "match":
      body = `<div class="match-grid"><div class="match-col" data-side="l"></div><div class="match-col" data-side="r"></div></div>
        <div class="small match-msg" style="margin-top:10px"></div>
        <div class="btn-row" style="margin-top:10px"><button class="btn btn-sm" data-act="reset" type="button">↺ Ulangi</button></div>`;
      break;
    default:
      body = c.html || "";
  }
  return `<div class="card" data-card="${ci}">${head}${sub}${intro}${body}</div>`;
}

function initCard(c, el, secEl) {
  if (typeof c === "string") return;
  if (c.type === "explorer") initExplorer(c, el, secEl);
  else if (c.type === "chain") initChainCard(c, el);
  else if (c.type === "order") initOrder(c, el);
  else if (c.type === "match") initMatch(c, el);
  if (c.init && c.type !== "explorer") c.init(el, secEl);
}

/* ---------- Explorer: langkah + visual ---------- */
function initExplorer(c, el, secEl) {
  const steps = c.steps;
  let idx = 0, playing = false, timer = null;
  const body = K.$(".step-body", el), counter = K.$(".step-counter", el), dots = K.$(".step-dots", el);
  const prev = K.$('[data-act="prev"]', el), next = K.$('[data-act="next"]', el), play = K.$('[data-act="play"]', el);
  const viz = K.$(".viz-wrap", el);
  dots.innerHTML = steps.map((_, i) => `<button type="button" aria-label="Langkah ${i + 1}"></button>`).join("");
  const dotBtns = K.$$("button", dots);

  const api = {
    el, viz, get index() { return idx; },
    go, stop,
    info(title, text) { const p = K.$(".info-panel", el); if (p) p.innerHTML = `<b>${title}</b><br>${text}`; },
  };

  function go(i) {
    idx = (i + steps.length) % steps.length;
    const s = steps[idx];
    counter.textContent = `Langkah ${idx + 1} dari ${steps.length}`;
    body.innerHTML = `<h3 class="step-title">${s.title}</h3>${s.body.startsWith("<") ? s.body : `<p>${s.body}</p>`}${s.key ? `<div class="callout green"><p>🔑 ${s.key}</p></div>` : ""}`;
    body.style.animation = "none"; void body.offsetWidth; body.style.animation = "";
    dotBtns.forEach((b, j) => b.classList.toggle("on", j === idx));
    prev.disabled = idx === 0 && !playing;
    next.textContent = idx === steps.length - 1 ? "↺ Dari awal" : "Selanjutnya →";
    if (c.onStep) c.onStep(idx, s, api);
  }
  function stop() {
    playing = false; clearInterval(timer);
    if (play) play.textContent = "▶ Putar otomatis";
  }
  function start() {
    playing = true;
    if (play) play.textContent = "⏸ Jeda";
    timer = setInterval(() => go(idx + 1), c.autoplayMs || 5000);
  }
  prev.addEventListener("click", () => { stop(); go(idx - 1); });
  next.addEventListener("click", () => { stop(); go(idx + 1); });
  if (play) play.addEventListener("click", () => { if (playing) stop(); else { if (idx === steps.length - 1) go(0); start(); } });
  dotBtns.forEach((b, j) => b.addEventListener("click", () => { stop(); go(j); }));
  document.addEventListener("lesson:show", (e) => { if (e.detail.id !== secEl.id) stop(); });

  if (c.info) {
    K.$$("[data-info]", viz).forEach((part) => {
      part.classList.add("part");
      if (!part.hasAttribute("tabindex")) part.setAttribute("tabindex", "0");
      const show = () => { const [t, d] = c.info[part.dataset.info] || ["", ""]; api.info(t, d); if (c.onInfo) c.onInfo(part.dataset.info, api); };
      part.addEventListener("click", show);
      part.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
    });
  }
  if (c.init) c.init(api, secEl);
  go(0);
}

/* ---------- Rantai sebab-akibat ---------- */
function initChainCard(c, el) {
  const tabs = K.$(".chain-tabs", el), box = K.$(".chain", el), btn = K.$('[data-act="chain-next"]', el);
  let ci = 0, shown = 1;
  tabs.innerHTML = c.chains.map((ch, i) => `<button class="btn btn-sm" type="button" data-c="${i}">${ch.label}</button>`).join("");
  if (c.chains.length === 1) tabs.style.display = "none";
  function render() {
    const ch = c.chains[ci];
    K.$$("button", tabs).forEach((b, i) => b.classList.toggle("btn-primary", i === ci));
    box.innerHTML = ch.nodes.slice(0, shown).map((n, i) => {
      const [k, t] = Array.isArray(n) ? n : [i === 0 ? "cause" : i === ch.nodes.length - 1 ? "effect" : "", n];
      return `${i ? '<div class="chain-arrow">↓</div>' : ""}<div class="chain-node ${k}">${t}</div>`;
    }).join("");
    btn.textContent = shown >= ch.nodes.length ? "↺ Ulangi rantai ini" : "Tampilkan langkah berikutnya ↓";
  }
  K.$$("button", tabs).forEach((b) => b.addEventListener("click", () => { ci = +b.dataset.c; shown = 1; render(); }));
  btn.addEventListener("click", () => { shown = shown >= c.chains[ci].nodes.length ? 1 : shown + 1; render(); });
  render();
}

/* ---------- Game urutan ---------- */
function shuffleArr(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function initOrder(c, el) {
  const slots = K.$(".route-slots", el), pool = K.$(".token-pool", el), msg = K.$(".route-msg", el);
  const items = c.items, start = c.startWithFirst !== false ? 1 : 0;
  let pos;
  function reset() {
    pos = start;
    slots.innerHTML = start ? `<span class="token placed">${items[0]}</span>` : `<span class="placeholder">Urutan kamu akan muncul di sini…</span>`;
    pool.innerHTML = shuffleArr(items.slice(start)).map((t) => `<button type="button" class="token" data-t="${t}">${t}</button>`).join("");
    msg.innerHTML = `<span class="muted">${start ? `Apa yang terjadi setelah <b>${items[0]}</b>?` : "Ketuk item pertama."}</span>`;
    K.$$(".token", pool).forEach((b) => b.addEventListener("click", () => pick(b)));
  }
  function pick(b) {
    const t = b.dataset.t;
    if (t === items[pos]) {
      if (pos === 0) slots.innerHTML = "";
      b.classList.add("used");
      slots.insertAdjacentHTML("beforeend", `${pos ? '<span class="arrow">→</span>' : ""}<span class="token placed">${t}</span>`);
      pos++;
      msg.innerHTML = pos === items.length
        ? `<div class="callout green"><p>🎉 ${c.done || "<b>Sempurna!</b> Urutannya tepat."}</p></div>`
        : `<span style="color:var(--ok)">✓ Benar.</span> <span class="muted">Lanjut: setelah <b>${t}</b>?</span>`;
    } else {
      b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
      const hint = c.hints && c.hints[items[pos]];
      msg.innerHTML = `<span style="color:var(--bad)">✗ Belum tepat.</span> ${hint ? "Petunjuk: " + hint : "Coba pikirkan sebab-akibatnya."}`;
    }
  }
  K.$('[data-act="reset"]', el).addEventListener("click", reset);
  reset();
}

/* ---------- Game pasangan ---------- */
function initMatch(c, el) {
  const L = K.$('[data-side="l"]', el), R = K.$('[data-side="r"]', el), msg = K.$(".match-msg", el);
  let sel = null, done = 0;
  function reset() {
    sel = null; done = 0;
    L.innerHTML = c.pairs.map((p, i) => `<button type="button" class="token" data-i="${i}">${p[0]}</button>`).join("");
    R.innerHTML = shuffleArr(c.pairs.map((p, i) => [p[1], i])).map(([t, i]) => `<button type="button" class="token" data-i="${i}">${t}</button>`).join("");
    msg.innerHTML = `<span class="muted">Ketuk satu item di kiri, lalu pasangannya di kanan.</span>`;
    K.$$(".token", L).forEach((b) => b.addEventListener("click", () => {
      if (b.classList.contains("placed")) return;
      K.$$(".token", L).forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected"); sel = b;
    }));
    K.$$(".token", R).forEach((b) => b.addEventListener("click", () => {
      if (!sel || b.classList.contains("placed")) { if (!sel) msg.innerHTML = `<span class="muted">Pilih dulu item di kolom kiri.</span>`; return; }
      if (b.dataset.i === sel.dataset.i) {
        b.classList.add("placed"); sel.classList.add("placed"); sel.classList.remove("selected"); sel = null; done++;
        msg.innerHTML = done === c.pairs.length
          ? `<div class="callout green"><p>🎉 ${c.done || "Semua pasangan tepat!"}</p></div>`
          : `<span style="color:var(--ok)">✓ Cocok!</span>`;
      } else {
        b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
        msg.innerHTML = `<span style="color:var(--bad)">✗ Belum cocok.</span> Coba lagi.`;
      }
    }));
  }
  K.$('[data-act="reset"]', el).addEventListener("click", reset);
  reset();
}
