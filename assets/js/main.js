/* NAFADH prototype — shared interactions (no dependencies) */
(function () {
  'use strict';

  /* ---------- Inline icon set (Lucide-style, 24px stroke) ---------- */
  const P = {
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    laptop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    arrow: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M21 5h-4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-3"/>',
    filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    x_social: '<path d="M4 4l16 16M20 4 4 20"/>',
    linkedin: '<rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    headset: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><path d="M21 14a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 14a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>'
  };
  const icon = (name, cls = '') =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
  function hydrateIcons(root = document) {
    root.querySelectorAll('i[data-i]').forEach(el => {
      el.outerHTML = icon(el.dataset.i, el.className);
    });
  }

  /* ---------- Theme ---------- */
  const THEME_KEY = 'nf-proto-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-theme-toggle]').forEach(b => {
      b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
      b.setAttribute('aria-label', t === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن');
    });
    document.dispatchEvent(new CustomEvent('nf:theme', { detail: t }));
  }
  function initTheme() {
    const t = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(t);
    document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
      applyTheme(next);
    }));
  }

  /* ---------- Header / nav / progress ---------- */
  function initHeader() {
    const header = document.querySelector('.site-header');
    const progress = document.querySelector('.scroll-progress');
    const onScroll = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 24);
      if (progress) {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.innerHTML = icon(open ? 'x' : 'menu');
        toggle.setAttribute('aria-expanded', open);
      });
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('open'); toggle.innerHTML = icon('menu');
      }));
    }
  }

  /* ---------- Reveal on scroll (AOS-like) ---------- */
  let revealObserver;
  function initReveal(root = document) {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    root.querySelectorAll('[data-reveal]:not(.in)').forEach(el => revealObserver.observe(el));
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const dur = parseInt(el.dataset.duration || '1800', 10);
    const t0 = performance.now();
    const fmt = new Intl.NumberFormat('ar-OM', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt.format(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function initCounters(root = document) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    root.querySelectorAll('[data-count]').forEach(el => io.observe(el));
  }

  /* ---------- Magnetic buttons ---------- */
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function initMagnetic(root = document) {
    if (!finePointer || reduceMotion) return;
    root.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Spotlight + tilt cards ---------- */
  function initCards(root = document) {
    root.querySelectorAll('.xcard').forEach(card => {
      if (card.dataset.bound) return;
      card.dataset.bound = '1';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
        if (card.hasAttribute('data-tilt') && finePointer && !reduceMotion) {
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      if (!card.querySelector('.corner')) {
        card.insertAdjacentHTML('beforeend', '<span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span>');
      }
    });
  }

  /* ---------- Toast ---------- */
  function toast(msg, ic = 'check') {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('role', 'status'); document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = icon(ic) + `<span>${msg}</span>`;
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 2800);
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear().toLocaleString('ar-OM', { useGrouping: false }); });
  }

  /* ---------- Fake form submits ---------- */
  function initForms() {
    document.querySelectorAll('form[data-mock]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      toast(f.dataset.mock || 'تم الإرسال (نموذج تجريبي)');
      f.reset();
    }));
  }

  /* ---------- Network mesh (TRA identity element: triangulated ribbon) ---------- */
  // Official identity colours read from CSS tokens, so JS never hard-codes the palette.
  function token(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function seeded(seed) { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  function rampColor(stops, t) {
    const n = stops.length - 1, k = Math.min(n - 1, Math.floor(t * n)), f = t * n - k;
    const a = hexToRgb(stops[k]), b = hexToRgb(stops[k + 1]);
    return a.map((v, i) => Math.round(v + (b[i] - v) * f));
  }
  // Bowyer–Watson Delaunay triangulation → unique edge list
  function delaunayEdges(pts) {
    const n = pts.length;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
    const dm = Math.max(maxX - minX, maxY - minY) * 20, mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
    const P = pts.concat([{ x: mx - dm, y: my - dm }, { x: mx, y: my + dm }, { x: mx + dm, y: my - dm }]);
    const circ = (a, b, c) => {
      const A = P[a], B = P[b], C = P[c];
      const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) || 1e-9;
      const ux = ((A.x ** 2 + A.y ** 2) * (B.y - C.y) + (B.x ** 2 + B.y ** 2) * (C.y - A.y) + (C.x ** 2 + C.y ** 2) * (A.y - B.y)) / d;
      const uy = ((A.x ** 2 + A.y ** 2) * (C.x - B.x) + (B.x ** 2 + B.y ** 2) * (A.x - C.x) + (C.x ** 2 + C.y ** 2) * (B.x - A.x)) / d;
      return { v: [a, b, c], x: ux, y: uy, r2: (A.x - ux) ** 2 + (A.y - uy) ** 2 };
    };
    let tris = [circ(n, n + 1, n + 2)];
    for (let i = 0; i < n; i++) {
      const p = P[i], bad = [], keep = [];
      tris.forEach(t => ((p.x - t.x) ** 2 + (p.y - t.y) ** 2 < t.r2 ? bad : keep).push(t));
      const count = new Map();
      bad.forEach(t => [[0, 1], [1, 2], [2, 0]].forEach(([a, b]) => {
        const e = [t.v[a], t.v[b]].sort((x, y) => x - y).join(',');
        count.set(e, (count.get(e) || 0) + 1);
      }));
      tris = keep;
      count.forEach((c, e) => { if (c === 1) { const [a, b] = e.split(',').map(Number); tris.push(circ(a, b, i)); } });
    }
    const edges = new Set();
    tris.forEach(t => [[0, 1], [1, 2], [2, 0]].forEach(([a, b]) => {
      if (t.v[a] < n && t.v[b] < n) edges.add([t.v[a], t.v[b]].sort((x, y) => x - y).join(','));
    }));
    return [...edges].map(e => e.split(',').map(Number));
  }
  // Points scattered inside a band around a cubic Bézier → ribbon mesh like the identity PDF
  function ribbonMesh({ curve, band, count, maxEdge, seed = 7 }) {
    const rnd = seeded(seed);
    const bez = (t, i) => { const u = 1 - t; return u * u * u * curve[0][i] + 3 * u * u * t * curve[1][i] + 3 * u * t * t * curve[2][i] + t * t * t * curve[3][i]; };
    const pts = [];
    for (let k = 0; k < count; k++) {
      const t = rnd();
      const x = bez(t, 0), y = bez(t, 1);
      const dx = bez(Math.min(1, t + 0.01), 0) - bez(Math.max(0, t - 0.01), 0);
      const dy = bez(Math.min(1, t + 0.01), 1) - bez(Math.max(0, t - 0.01), 1);
      const len = Math.hypot(dx, dy) || 1;
      const w = band * (0.55 + 0.45 * Math.sin(Math.PI * (t * 2.2 + 0.3)) ** 2);
      const off = (rnd() * 2 - 1) * w;
      const faint = rnd() < 0.28;
      pts.push({ x: x - (dy / len) * off, y: y + (dx / len) * off, t, faint, r: faint ? 1 + rnd() * 1.4 : 1.4 + rnd() * 2.2, ph: rnd() * Math.PI * 2 });
    }
    const edges = delaunayEdges(pts).filter(([a, b]) => Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y) < maxEdge);
    return { pts, edges };
  }
  // Static SVG rendering for decorative corners (footer, section corners)
  function meshSVG({ width, height, curve, band, count, maxEdge, seed, stops, opacity = 1, cls = '' }) {
    const { pts, edges } = ribbonMesh({ curve, band, count, maxEdge, seed });
    const col = t => `rgb(${rampColor(stops, t).join(',')})`;
    const lines = edges.map(([a, b]) => {
      const A = pts[a], B = pts[b], f = A.faint || B.faint;
      return `<line x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}" x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}" stroke="${col((A.t + B.t) / 2)}" stroke-opacity="${f ? 0.25 : 0.6}" stroke-width="0.8"/>`;
    }).join('');
    const dots = pts.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${col(p.t)}" fill-opacity="${p.faint ? 0.35 : 0.95}"/>`).join('');
    return `<svg class="${cls}" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false" style="opacity:${opacity}">${lines}${dots}</svg>`;
  }
  function initMeshDecor(root = document) {
    root.querySelectorAll('[data-mesh]').forEach(el => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const kind = el.dataset.mesh === 'auto' ? (dark ? 'on-dark' : 'light') : el.dataset.mesh;
      const stops = kind === 'on-dark'
        ? [token('--tra-cyan'), token('--tra-teal'), token('--tra-green')]
        : [token('--tra-cyan'), token('--tra-teal'), token('--tra-blue'), token('--tra-navy')];
      el.innerHTML = meshSVG({
        width: 520, height: 300, seed: +(el.dataset.seed || 11), stops,
        curve: [[-20, 20], [160, -10], [300, 280], [540, 250]], band: 46, count: 120, maxEdge: 58
      });
    });
  }

  window.NF = { icon, hydrateIcons, initReveal, initCards, initCounters, initMagnetic, toast, finePointer, reduceMotion, token, rampColor, ribbonMesh, meshSVG };

  document.addEventListener('DOMContentLoaded', () => {
    hydrateIcons();
    initTheme();
    initHeader();
    initReveal();
    initCounters();
    initMagnetic();
    initCards();
    initMeshDecor();
    document.addEventListener('nf:theme', () => initMeshDecor());
    initYear();
    initForms();
    document.dispatchEvent(new Event('nf:ready'));
  });
})();
