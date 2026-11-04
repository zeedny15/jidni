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
  const groupName = (typeof GROUP_SHORT !== "undefined" && GROUP_SHORT[meta.group]) || "KardioBelajar";
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
        ${c.note === "" ? "" : `<div class="callout warn" style="margin-top:14px"><p>${c.note || "Fokus modul ini tetap fisiologi. Detail diagnosis & terapi dipelajari di blok klinis."}</p></div>`}`;
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
    case "flash":
      body = `<div class="flash-bar"><span class="small muted flash-count"></span>
          <span class="btn-row"><button class="btn btn-sm" data-act="shuffle" type="button">🔀 Acak</button><button class="btn btn-sm" data-act="flipall" type="button">↺ Tutup semua</button></span></div>
        <div class="flash-grid">${c.cards.map(([f, b], i) => `<button type="button" class="flash" data-i="${i}"><span class="flash-in"><span class="flash-f">${f}</span><span class="flash-b">${b}</span></span></button>`).join("")}</div>`;
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
  else if (c.type === "flash") initFlash(c, el);
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
    if (s.viz !== undefined && viz._cur !== s.viz) { viz.innerHTML = s.viz; viz._cur = s.viz; bindInfo(); }
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

  function bindInfo() {
    if (!c.info) return;
    K.$$("[data-info]", viz).forEach((part) => {
      part.classList.add("part");
      if (!part.hasAttribute("tabindex")) part.setAttribute("tabindex", "0");
      const show = () => { const [t, d] = c.info[part.dataset.info] || ["", ""]; api.info(t, d); if (c.onInfo) c.onInfo(part.dataset.info, api); };
      part.addEventListener("click", show);
      part.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
    });
  }
  bindInfo();
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

/* ---------- Partikel yang bergerak di sepanjang path SVG ---------- */
K.flow = function (layer) {
  const NS = "http://www.w3.org/2000/svg";
  let items = [], clock = 0;
  return {
    /** paths: [{ el, color (string atau fungsi f→warna), n, speed, r }] */
    set(paths) {
      layer.innerHTML = ""; items = [];
      paths.forEach((p) => {
        const len = p.el.getTotalLength();
        const n = p.n || Math.max(2, Math.round(len / 40));
        for (let i = 0; i < n; i++) {
          const c = document.createElementNS(NS, "circle");
          c.setAttribute("r", p.r || 4.5);
          c.setAttribute("stroke", "#fff"); c.setAttribute("stroke-width", "1.2");
          layer.appendChild(c);
          items.push({ c, p, len, off: (i / n) * len });
        }
      });
      this.tick(0);
    },
    tick(dt) {
      clock += dt;
      items.forEach((it) => {
        const d = (it.off + clock * (it.p.speed || 50)) % it.len;
        const pt = it.p.el.getPointAtLength(d);
        it.c.setAttribute("cx", pt.x); it.c.setAttribute("cy", pt.y);
        const col = typeof it.p.color === "function" ? it.p.color(d / it.len) : (it.p.color || K.css("--o2-rich"));
        it.c.setAttribute("fill", col);
      });
    },
  };
};

/* ---------- Ilustrasi jantung (potongan frontal) dengan sistem hantaran ----------
   region: data-r = ra | la | rv | lv | sep
   jalur hantaran: data-c = inter | bach | his | lbb | rbb | purkL | purkR | acc
   nodus: data-n = sa | av                                                        */
K.heartSVG = function (uid, opts = {}) {
  const outline = "M150,34 C118,18 66,26 56,76 C46,130 78,196 150,276 C222,196 254,130 244,76 C234,26 182,18 150,34 Z";
  const lbl = opts.labels !== false;
  return `
  <defs><clipPath id="hc-${uid}"><path d="${outline}"/></clipPath></defs>
  <g clip-path="url(#hc-${uid})">
    <rect data-r="ra" x="0" y="0" width="147" height="124" class="h-reg"/>
    <rect data-r="la" x="153" y="0" width="147" height="124" class="h-reg"/>
    <rect data-r="rv" x="0" y="130" width="145" height="170" class="h-reg"/>
    <rect data-r="lv" x="155" y="130" width="145" height="170" class="h-reg"/>
    <rect data-r="sep" x="145" y="130" width="10" height="170" class="h-reg"/>
    <rect x="0" y="124" width="300" height="6" fill="var(--text-soft)" opacity=".7"/>
    <rect x="147" y="0" width="6" height="124" fill="var(--text-soft)" opacity=".4"/>
  </g>
  <path d="${outline}" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
  <g fill="none" stroke-linecap="round" class="h-cond">
    <path data-c="inter" data-info="inter" d="M96,60 C112,84 126,100 140,120"/>
    <path data-c="bach" data-info="bach"  d="M96,60 C140,46 182,52 214,72"/>
    <path data-c="acc" data-info="acc"   d="M226,96 C232,112 236,124 236,150" stroke-dasharray="4 3" style="display:none"/>
    <path data-c="his" data-info="his"   d="M141,121 L150,142"/>
    <path data-c="lbb" data-info="lbb"   d="M150,142 C157,182 159,222 156,256"/>
    <path data-c="rbb" data-info="rbb"   d="M150,142 C143,182 141,222 144,256"/>
    <path data-c="purkL" data-info="purkL" d="M156,256 C188,248 226,208 238,150"/>
    <path data-c="purkR" data-info="purkR" d="M144,256 C112,248 74,208 62,150"/>
  </g>
  <circle data-n="sa" data-info="sa" cx="96" cy="60" r="8"/>
  <circle data-n="av" data-info="av" cx="141" cy="120" r="7"/>
  <g class="h-dots"></g>
  ${lbl ? `
  <text class="svg-label small" x="70" y="44">SA</text>
  <text class="svg-label small" x="112" y="139">AV</text>
  <text class="svg-label small" x="88" y="104" text-anchor="middle">AK</text>
  <text class="svg-label small" x="212" y="104" text-anchor="middle">AKi</text>
  <text class="svg-label small" x="100" y="190" text-anchor="middle">VKa</text>
  <text class="svg-label small" x="200" y="190" text-anchor="middle">VKi</text>` : ""}`;
};

/* ---------- Flashcard hafalan ---------- */
function initFlash(c, el) {
  const grid = K.$(".flash-grid", el), cnt = K.$(".flash-count", el);
  const seen = new Set();
  const upd = () => { cnt.textContent = `Sudah dibuka: ${seen.size}/${c.cards.length} — ketuk kartu untuk membalik`; };
  K.$$(".flash", grid).forEach((b) => b.addEventListener("click", () => { b.classList.toggle("flipped"); seen.add(b.dataset.i); upd(); }));
  K.$('[data-act="flipall"]', el).addEventListener("click", () => K.$$(".flash", grid).forEach((b) => b.classList.remove("flipped")));
  K.$('[data-act="shuffle"]', el).addEventListener("click", () => { shuffleArr(K.$$(".flash", grid)).forEach((b) => { b.classList.remove("flipped"); grid.appendChild(b); }); });
  upd();
}

/* ---------- Generator murmur sederhana (WebAudio) ----------
   shape: "holo" | "ejection" | "earlydia" | "middia" | "continuous" | "click" | "none"
   opts: { beats, cycle, s1, s2, split } (s1/s2 = kekerasan 0..1)                        */
K.playMurmur = function (shape, opts = {}) {
  try {
    if (!K.audio) K.audio = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = K.audio; if (ctx.state === "suspended") ctx.resume();
    if (!K._noise) {
      const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      K._noise = b;
    }
    const beats = opts.beats || 4, C = opts.cycle || 0.9, s2t = 0.34 * C / 0.9 + 0.0;
    const t0 = ctx.currentTime + 0.05;
    const seg = (a, b, fn, freq, q, gain) => {
      const src = ctx.createBufferSource(); src.buffer = K._noise;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q || 1;
      const g = ctx.createGain(); const n = 64, curve = new Float32Array(n);
      for (let i = 0; i < n; i++) curve[i] = Math.max(0.0001, fn(i / (n - 1)) * gain);
      g.gain.setValueAtTime(0.0001, a); g.gain.setValueCurveAtTime(curve, a, b - a);
      src.connect(f).connect(g).connect(ctx.destination); src.start(a); src.stop(b + .02);
    };
    for (let k = 0; k < beats; k++) {
      const b = t0 + k * C, sys = b + 0.04, s2 = b + s2t;
      K.thump(55, .12, .9 * (opts.s1 ?? 1), b - ctx.currentTime);
      K.thump(80, .08, .75 * (opts.s2 ?? 1), s2 - ctx.currentTime);
      if (opts.split) K.thump(72, .07, .6, s2 + 0.05 - ctx.currentTime);
      if (shape === "holo") seg(sys, s2, () => 1, 350, 0.8, .25);
      if (shape === "ejection") seg(b + .07, s2 - .04, (x) => Math.sin(Math.PI * x), 300, 1, .32);
      if (shape === "earlydia") seg(s2 + .01, s2 + .3, (x) => 1 - x, 600, 1.2, .22);
      if (shape === "middia") { seg(s2 + .12, b + C - .12, (x) => .6 + .4 * Math.sin(Math.PI * x), 90, 2.5, .5); seg(b + C - .12, b + C - .01, (x) => .4 + .6 * x, 90, 2.5, .6); K.thump(140, .04, .45, s2 + .07 - ctx.currentTime); }
      if (shape === "continuous") seg(sys, b + C - .02, (x) => x < .4 ? .3 + 1.75 * x : 1 - (x - .4) * 1.4, 250, .7, .3);
      if (shape === "click") { K.thump(300, .03, .6, b + .18 - ctx.currentTime); seg(b + .2, s2 - .01, (x) => .3 + .7 * x, 400, 1, .18); }
    }
    return beats * C;
  } catch (e) { return 0; }
};
