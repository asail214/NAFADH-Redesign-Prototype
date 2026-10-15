/* User dashboard — renders mock data, charts and interactions */
(function () {
  'use strict';
  const { TYPES, opportunities: OPPS, user: U, STAGES, fmt, money } = window.NF_DATA;
  const { icon, toast, initCards, initReveal } = window.NF;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const byId = id => OPPS.find(o => o.id === id);
  const svgNS = 'http://www.w3.org/2000/svg';

  /* ---------- Profile ---------- */
  const h = new Date().getHours();
  $('#greetTime').textContent = h < 12 ? 'صباح الخير' : 'مساء الخير';
  $('#userFirst').textContent = U.first;
  $('#nameTop').textContent = U.name.split(' ')[0] + ' ' + U.name.split(' ').slice(-1);
  $('#roleTop').textContent = U.role;
  $('#nameBig').textContent = U.name;
  $('#roleBig').textContent = `${U.role} · ${U.gov}`;
  $('#avTop').textContent = $('#avBig').textContent = U.first.charAt(0);
  $('#skills').innerHTML = U.skills.map(s => `<span>${s}</span>`).join('');
  const C = 2 * Math.PI * 52;
  setTimeout(() => { $('#ringVal').style.strokeDashoffset = C * (1 - U.completion / 100); }, 200);

  let savedCount = 0;
  try { savedCount = JSON.parse(localStorage.getItem('nf-proto-saved') || '[]').length; } catch (e) { /* ignore */ }
  if (savedCount) $('#savedKpi').dataset.count = savedCount;

  /* ---------- KPI sparklines ---------- */
  $$('svg[data-spark]').forEach(svg => {
    const v = svg.dataset.spark.split(',').map(Number);
    const max = Math.max(...v), min = Math.min(...v), W = 120, H = 36;
    // RTL: oldest point on the right, newest on the left
    const pts = v.map((y, i) => [W - (i / (v.length - 1)) * W, H - ((y - min) / (max - min || 1)) * (H - 4) - 2]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    svg.innerHTML = `<path class="area" d="${d} L0 ${H} L${W} ${H} Z"/><path class="line" d="${d}"/>`;
  });

  /* ---------- Bar chart (single series → no legend; title names it) ---------- */
  const tip = $('#chartTip');
  function showTip(x, y, html) { tip.innerHTML = html; tip.hidden = false; tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
  function hideTip() { tip.hidden = true; }

  function drawBars(range) {
    const host = $('#barChart');
    const data = U.weekly.slice(-range);
    const ago = i => range - i - 1;
    const labels = data.map((_, i) => ago(i) === 0 ? 'الحالي' : `-${fmt(ago(i))}`);
    const longLabels = data.map((_, i) => ago(i) === 0 ? 'الأسبوع الحالي' : ago(i) === 1 ? 'الأسبوع الماضي' : `قبل ${fmt(ago(i))} أسابيع`);
    const W = host.clientWidth || 600, H = host.clientHeight || 260;
    const pad = { t: 24, r: 8, b: 30, l: 28 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const max = Math.ceil(Math.max(...data) / 2) * 2 || 2;
    const step = iw / data.length;
    const bw = Math.min(36, step * 0.56);
    const maxIdx = data.indexOf(Math.max(...data));
    const narrow = W < 480;

    let g = `<g class="grid">`;
    for (let k = 0; k <= max; k += 2) {
      const y = pad.t + ih - (k / max) * ih;
      g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/>`;
    }
    g += `</g><g class="axis">`;
    for (let k = 0; k <= max; k += 2) {
      const y = pad.t + ih - (k / max) * ih;
      g += `<text x="${pad.l - 8}" y="${y + 4}" text-anchor="end">${fmt(k)}</text>`;
    }
    g += `</g><g class="bars">`;
    data.forEach((v, i) => {
      // RTL time axis: newest bar on the left
      const cx = W - pad.r - step * (i + 0.5);
      const bh = Math.max(2, (v / max) * ih);
      const x = cx - bw / 2, y = pad.t + ih - bh;
      const r = Math.min(4, bw / 2);
      const path = `M${x} ${pad.t + ih} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + bw - r} Q${x + bw} ${y} ${x + bw} ${y + r} V${pad.t + ih} Z`;
      g += `<rect class="hit" data-i="${i}" x="${cx - step / 2}" y="${pad.t}" width="${step}" height="${ih}"/>`;
      g += `<path class="bar" data-i="${i}" d="${path}" style="transform-origin:${cx}px ${pad.t + ih}px"/>`;
      if (i === data.length - 1 || i === maxIdx) g += `<text class="val" x="${cx}" y="${y - 8}" text-anchor="middle">${fmt(v)}</text>`;
      if (!narrow || i % 2 === (data.length - 1) % 2) g += `<text class="axis-l" x="${cx}" y="${H - 8}" text-anchor="middle" fill="var(--muted)" font-size="11.5" font-weight="600" font-family="Cairo, sans-serif">${labels[i]}</text>`;
    });
    g += `</g>`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="${svgNS}">${g}</svg>`;

    // grow-in animation
    host.querySelectorAll('.bar').forEach((b, i) => {
      b.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 700, delay: i * 45, easing: 'cubic-bezier(.22,.8,.24,1)', fill: 'backwards' });
    });
    host.querySelectorAll('.hit').forEach(hit => {
      const i = +hit.dataset.i;
      const bar = host.querySelector(`.bar[data-i="${i}"]`);
      hit.addEventListener('mousemove', () => {
        host.classList.add('hovering'); bar.classList.add('hl');
        const r = bar.getBoundingClientRect();
        showTip(r.left + r.width / 2, r.top, `${fmt(data[i])} طلبات<small>${longLabels[i]}</small>`);
      });
      hit.addEventListener('mouseleave', () => { host.classList.remove('hovering'); bar.classList.remove('hl'); hideTip(); });
    });
    $('#barTable').innerHTML = `<thead><tr><th>الأسبوع</th><th>عدد الطلبات</th></tr></thead><tbody>${data.map((v, i) => `<tr><td>${longLabels[i]}</td><td>${fmt(v)}</td></tr>`).join('')}</tbody>`;
  }
  let range = 12;
  $$('[data-range]').forEach(b => b.addEventListener('click', () => {
    range = +b.dataset.range; $$('[data-range]').forEach(x => x.classList.toggle('on', x === b)); drawBars(range);
  }));
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => drawBars(range), 150); });

  /* ---------- Stacked bar + legend (categorical: fixed order job → free → tender) ---------- */
  const total = Object.values(U.byType).reduce((a, b) => a + b, 0);
  const order = ['job', 'free', 'tender'];
  const colorVar = { job: 'var(--c-job)', free: 'var(--c-free)', tender: 'var(--c-tender)' };
  $('#stack').innerHTML = order.map(t => `<span data-t="${t}" style="background:${colorVar[t]}" data-w="${(U.byType[t] / total) * 100}"></span>`).join('');
  $('#legend').innerHTML = order.map(t => `<li data-t="${t}"><i style="background:${colorVar[t]}"></i>${TYPES[t].plural}<b>${fmt(U.byType[t])}</b><em>${fmt(Math.round(U.byType[t] / total * 100))}٪</em></li>`).join('');
  const linkHover = (t, on) => {
    $$(`#legend li`).forEach(li => li.classList.toggle('hl', on && li.dataset.t === t));
    $$('#stack span').forEach(s => { s.style.opacity = on && s.dataset.t !== t ? .4 : 1; });
  };
  $$('#stack span, #legend li').forEach(el => {
    el.addEventListener('mouseenter', e => {
      linkHover(el.dataset.t, true);
      if (el.tagName === 'SPAN') { const r = el.getBoundingClientRect(); showTip(r.left + r.width / 2, r.top, `${TYPES[el.dataset.t].plural}: ${fmt(U.byType[el.dataset.t])}`); }
    });
    el.addEventListener('mouseleave', () => { linkHover(null, false); hideTip(); });
  });

  /* ---------- Applications ---------- */
  const STEP_LABELS = ['تقديم', 'مراجعة', 'مقابلة', 'عرض'];
  function renderApps(filter = 'all', q = '') {
    const rows = U.applications.filter(a => {
      if (filter === 'active') return ['submitted', 'review', 'interview'].includes(a.stage);
      if (filter === 'interview') return a.stage === 'interview';
      if (filter === 'closed') return ['offer', 'rejected'].includes(a.stage);
      return true;
    }).filter(a => !q || byId(a.opp).title.includes(q) || byId(a.opp).org.includes(q));
    $('#appList').innerHTML = rows.length ? rows.map((a, i) => {
      const o = byId(a.opp), S = STAGES[a.stage], T = TYPES[o.type];
      const tone = a.stage === 'rejected' ? 'bad' : a.stage === 'offer' ? 'ok' : '';
      return `
      <div class="app-row" style="--d:${i * 0.05}s">
        <span class="app-ico t-${o.type}" title="${T.label}">${icon(T.icon)}</span>
        <div class="app-main"><strong>${o.title}</strong><small>${o.org} · ${T.label} · ${a.date}</small></div>
        <div class="app-prog">
          <div class="stepper ${tone}" aria-label="المرحلة ${a.step} من 4">${[1, 2, 3, 4].map(s => `<i class="${s <= a.step ? 'on' : ''}" style="--sd:${0.2 + s * 0.12}s"></i>`).join('')}</div>
          <div class="step-lbl">${STEP_LABELS.map(l => `<span>${l}</span>`).join('')}</div>
        </div>
        <span class="app-st"><span class="status ${S.tone}">${icon(S.icon)} ${S.label}</span></span>
        <button class="more" aria-label="تفاصيل الطلب" data-toast="تفاصيل الطلب: ${o.title} (تجريبي)">${icon('arrow')}</button>
      </div>`;
    }).join('') : `<div class="app-empty">لا توجد طلبات في هذا التصنيف</div>`;
  }
  let appF = 'all';
  $('#appFilter').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    appF = b.dataset.f; $$('#appFilter button').forEach(x => x.classList.toggle('on', x === b));
    renderApps(appF, $('#dq').value.trim());
  });
  $('#dq').addEventListener('input', e => {
    renderApps(appF, e.target.value.trim());
    if (e.target.value.trim()) $('#applications').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Recommended ---------- */
  const appliedIds = new Set(U.applications.map(a => a.opp));
  const recs = OPPS.filter(o => !appliedIds.has(o.id)).map(o => {
    const overlap = o.tags.filter(t => U.skills.some(s => s.toLowerCase() === t.toLowerCase())).length;
    const score = Math.min(97, 62 + overlap * 14 + (o.gov === U.gov || o.gov === 'عن بعد' ? 10 : 0) + (o.featured ? 5 : 0) + (o.id % 7));
    return { ...o, score };
  }).sort((a, b) => b.score - a.score).slice(0, 4);
  const MC = 2 * Math.PI * 22;
  $('#recList').innerHTML = recs.map(o => `
    <div class="xcard rec t-${o.type}">
      <div class="rec-top">
        <span class="chip ${TYPES[o.type].chip}">${icon(TYPES[o.type].icon)} ${TYPES[o.type].label}</span>
        <div class="match" style="--off:${MC * (1 - o.score / 100)}" title="نسبة التطابق"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="t" cx="26" cy="26" r="22"/><circle class="v" cx="26" cy="26" r="22"/></svg><span>${fmt(o.score)}٪</span></div>
      </div>
      <strong>${o.title}</strong>
      <small>${o.org} · ${o.gov}</small>
      <span class="pay">${money(o)}</span>
      <a class="btn btn-sm" href="opportunities.html?type=${o.type}">عرض الفرصة ${icon('arrow', 'arrow')}</a>
    </div>`).join('');

  /* ---------- Timeline + notifications ---------- */
  $('#timeline').innerHTML = U.activity.map((a, i) => `
    <li style="--d:${i * 0.07}s"><span class="status ${a.tone}">${icon(a.icon)}</span><div><p>${a.text}</p><small>${a.time}</small></div></li>`).join('');
  $('#notifList').innerHTML = U.activity.slice(0, 4).map((a, i) => `
    <li class="${i < 3 ? 'unread' : ''}"><span class="status ${a.tone}">${icon(a.icon)}</span><div>${a.text}<small>${a.time}</small></div></li>`).join('');
  const bell = $('#bell'), pop = $('#notifPop');
  bell.addEventListener('click', e => {
    e.stopPropagation();
    pop.hidden = !pop.hidden; bell.setAttribute('aria-expanded', !pop.hidden);
  });
  document.addEventListener('click', e => { if (!pop.hidden && !e.target.closest('.notif')) { pop.hidden = true; bell.setAttribute('aria-expanded', 'false'); } });
  $('#markRead').addEventListener('click', () => {
    $$('#notifList li').forEach(li => li.classList.remove('unread'));
    $('.ping').classList.add('off');
    toast('تم تعليم جميع الإشعارات كمقروءة');
  });

  /* ---------- Misc buttons ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toast]'); if (t) toast(t.dataset.toast, 'sparkles');
    const m = e.target.closest('[data-mock-link]'); if (m) { e.preventDefault(); toast(`صفحة «${m.dataset.mockLink}» خارج نطاق هذا النموذج`, 'layers'); }
  });

  /* ---------- Sidebar: mobile toggle + scroll-spy ---------- */
  const app = document.body;
  $('.side-toggle').addEventListener('click', () => app.classList.toggle('side-open'));
  $('.side-backdrop').addEventListener('click', () => app.classList.remove('side-open'));
  const spyLinks = $$('.side-nav a[href^="#"]').filter(a => a.getAttribute('href').length > 1);
  spyLinks.forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    app.classList.remove('side-open');
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
  }));
  const sections = spyLinks.map(a => document.querySelector(a.getAttribute('href')))
    .filter(s => s && s.id !== 'profile')
    .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  function spy() {
    let cur = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top < 140) cur = s; });
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = sections[sections.length - 1];
    spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id));
    $('.topbar').classList.toggle('scrolled', scrollY > 8);
  }
  addEventListener('scroll', spy, { passive: true });

  /* ---------- Init ---------- */
  renderApps();
  document.addEventListener('DOMContentLoaded', () => {
    drawBars(range);
    $$('#stack span').forEach(s => requestAnimationFrame(() => { s.style.width = s.dataset.w + '%'; }));
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .3 });
    $$('.match').forEach(m => io.observe(m));
    initCards(); initReveal(); spy();
  });
})();
