/* Landing page — hero network, scroll-driven effects */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Duplicate marquee content for a seamless loop */
  const track = document.querySelector('.marquee-track');
  if (track) track.innerHTML += track.innerHTML;

  /* Hero network — triangulated ribbon after the TRA identity element
     (cyan → teal → blue → navy), with cursor interaction and travelling signals */
  const canvas = document.querySelector('.hero-net');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const { ribbonMesh, rampColor, token } = window.NF;
    let w, h, dpr, mesh, stops, mouse = { x: -999, y: -999 }, pulses = [], lastPulse = 0, scrollShift = 0;

    function palette() {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      // dark mode drops the navy end (it would vanish on the navy background)
      stops = dark
        ? [token('--tra-cyan'), token('--tra-teal-light'), token('--tra-green'), token('--tra-cyan')]
        : [token('--tra-cyan'), token('--tra-teal'), token('--tra-blue'), token('--tra-navy')];
      return dark;
    }
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const band = Math.max(46, Math.min(110, w * 0.07));
      // two ribbons hugging the edges so the centred headline stays clear
      const a = ribbonMesh({
        curve: [[-0.06 * w, 0.0], [0.3 * w, 0.1 * h], [-0.04 * w, 0.42 * h], [0.12 * w, 0.95 * h]],
        band, count: w < 700 ? 70 : 120, maxEdge: band * 1.15, seed: 2026
      });
      const b = ribbonMesh({
        curve: [[1.06 * w, 0.3 * h], [0.86 * w, 0.42 * h], [1.02 * w, 0.62 * h], [0.84 * w, 0.92 * h]],
        band: band * 0.8, count: w < 700 ? 30 : 60, maxEdge: band * 1.05, seed: 77
      });
      b.pts.forEach(p => { p.t = 1 - p.t * 0.75; });   // right ribbon starts in the navy/blue range
      const off = a.pts.length;
      mesh = { pts: a.pts.concat(b.pts), edges: a.edges.concat(b.edges.map(([i, j]) => [i + off, j + off])) };
      palette();
    }
    // keep the headline area calm: fade the mesh inside an ellipse behind the text
    function textMask(x, y) {
      const dx = (x - w * 0.5) / (w * 0.34), dy = (y - h * 0.3) / (h * 0.3);
      const d = Math.sqrt(dx * dx + dy * dy);
      const base = w < 700 ? 0.4 : 1;   // narrow screens: text spans the width, so keep the mesh quieter
      return base * (d >= 1 ? 1 : 0.18 + 0.82 * d * d);
    }
    function pos(p, time) {
      let x = p.x + Math.sin(time * 0.0006 + p.ph) * 4;
      let y = p.y + Math.cos(time * 0.0005 + p.ph) * 4 - scrollShift;
      const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 150 && d > 0) { const f = (1 - d / 150) * 14; x += (dx / d) * f; y += (dy / d) * f; }
      return [x, y];
    }
    function frame(time = 0) {
      const dark = palette();
      ctx.clearRect(0, 0, w, h);
      const P = mesh.pts.map(p => pos(p, time));
      const lineA = dark ? 0.42 : 0.5;
      ctx.lineWidth = 0.8;
      mesh.edges.forEach(([a, b]) => {
        const A = mesh.pts[a], B = mesh.pts[b];
        const [ax, ay] = P[a], [bx, by] = P[b];
        const mx = (ax + bx) / 2, my = (ay + by) / 2;
        const near = Math.max(0, 1 - Math.hypot(mx - mouse.x, my - mouse.y) / 170);
        const alpha = (A.faint || B.faint ? 0.35 : 1) * lineA * textMask(mx, my) + near * 0.35;
        ctx.strokeStyle = `rgba(${rampColor(stops, (A.t + B.t) / 2).join(',')},${Math.min(1, alpha)})`;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      });
      mesh.pts.forEach((p, i) => {
        const [x, y] = P[i];
        const m = textMask(x, y);
        ctx.fillStyle = `rgba(${rampColor(stops, p.t).join(',')},${(p.faint ? 0.35 : 0.95) * m})`;
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      // travelling signals along random edges (subtle "data in the network" motion)
      if (!reduce && time - lastPulse > 380 && mesh.edges.length) {
        const e = mesh.edges[(Math.random() * mesh.edges.length) | 0];
        pulses.push({ e, t0: time, dur: 900 + Math.random() * 700 });
        lastPulse = time;
      }
      pulses = pulses.filter(pl => time - pl.t0 < pl.dur);
      pulses.forEach(pl => {
        const k = (time - pl.t0) / pl.dur, [a, b] = pl.e;
        const x = P[a][0] + (P[b][0] - P[a][0]) * k, y = P[a][1] + (P[b][1] - P[a][1]) * k;
        const c = rampColor(stops, mesh.pts[a].t).join(',');
        const g = ctx.createRadialGradient(x, y, 0, x, y, 8);
        g.addColorStop(0, `rgba(${c},${0.9 * textMask(x, y)})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
      });
      if (!reduce) requestAnimationFrame(frame);
    }
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
    addEventListener('scroll', () => { scrollShift = Math.min(h, scrollY) * 0.12; if (reduce) frame(); }, { passive: true });
    addEventListener('resize', () => { resize(); if (reduce) frame(); });
    document.addEventListener('nf:theme', () => { if (reduce) frame(); });
    resize(); requestAnimationFrame(frame);
  }

  /* Scroll-driven effects */
  const frameEl = document.querySelector('.banner-frame');
  const banner = document.querySelector('.banner');
  const stepsList = document.querySelector('.steps');
  const stepsLine = document.querySelector('.steps-line');
  const cta = document.querySelector('.cta');
  const pattern = document.querySelector('.pattern-shape');
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  function onScroll() {
    const vh = innerHeight;
    if (frameEl && banner) {
      const r = banner.getBoundingClientRect();
      // 0 when the banner top is at the bottom of the viewport → 1 when it reaches ~20% from top
      const p = reduce ? 1 : clamp((vh - r.top) / (vh * 0.75));
      frameEl.style.setProperty('--rx', `${22 * (1 - p)}deg`);
      frameEl.style.setProperty('--sc', (0.9 + 0.1 * p).toFixed(4));
    }
    if (stepsList && stepsLine) {
      const r = stepsList.getBoundingClientRect();
      stepsLine.style.setProperty('--p', clamp((vh * 0.75 - r.top) / r.height).toFixed(3));
    }
    if (cta && pattern) {
      const r = cta.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height));
      pattern.style.setProperty('--px', `${(p - 0.5) * 600}px`);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* Touch devices: tap a service card to expand its details */
  if (!matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service').forEach(card => card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      card.classList.toggle('open');
    }));
  }
})();
