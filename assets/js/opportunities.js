/* Opportunities explorer — client-side filtering over mock data */
(function () {
  'use strict';
  const { TYPES, GOVS, opportunities: ALL, fmt, money } = window.NF_DATA;
  const { icon, toast, initCards } = window.NF;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* per-viewer conveniences (saved / applied) — safe if storage is unavailable */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  const saved = new Set(store.get('nf-proto-saved'));
  const applied = new Set(store.get('nf-proto-applied'));

  const params = new URLSearchParams(location.search);
  const state = {
    type: TYPES[params.get('type')] ? params.get('type') : 'all',
    q: '', gov: '', modes: new Set(), level: '', deadline: 0,
    featured: false, savedOnly: false, sort: 'new', view: 'grid'
  };

  const LEVELS = [...new Set(ALL.map(o => o.level))];
  const MODES = [...new Set(ALL.map(o => o.mode))];
  const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const highlight = text => {
    const t = escapeHtml(text);
    if (!state.q) return t;
    const q = state.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return t.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
  };

  /* ---------- Build filter controls ---------- */
  $('#gov').insertAdjacentHTML('beforeend', ['عن بعد', ...GOVS].map(g => `<option value="${g}">${g}</option>`).join(''));
  $('#modes').innerHTML = MODES.map(m => `<label class="check"><input type="checkbox" value="${m}"> ${m} <em>${fmt(ALL.filter(o => o.mode === m).length)}</em></label>`).join('');
  $('#levels').innerHTML = `<button data-v="" class="on">الكل</button>` + LEVELS.map(l => `<button data-v="${l}">${l}</button>`).join('');
  $('#totalLabel').textContent = `${fmt(ALL.length)} فرصة متاحة الآن`;

  /* ---------- Filtering ---------- */
  function matches(o, ignoreType) {
    if (!ignoreType && state.type !== 'all' && o.type !== state.type) return false;
    if (state.q) {
      const hay = [o.title, o.org, o.gov, o.mode, ...o.tags].join(' ').toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    if (state.gov && o.gov !== state.gov) return false;
    if (state.modes.size && !state.modes.has(o.mode)) return false;
    if (state.level && o.level !== state.level) return false;
    if (state.deadline && o.deadline > state.deadline) return false;
    if (state.featured && !o.featured) return false;
    if (state.savedOnly && !saved.has(o.id)) return false;
    return true;
  }
  const sorters = {
    new: (a, b) => a.posted - b.posted,
    deadline: (a, b) => a.deadline - b.deadline,
    pay: (a, b) => b.max - a.max,
    popular: (a, b) => b.applicants - a.applicants
  };

  function cardHTML(o, i) {
    const T = TYPES[o.type];
    const urgent = o.deadline <= 7;
    const pct = Math.max(6, 100 - (o.deadline / 30) * 100);
    return `
    <article class="xcard opp t-${o.type}" data-id="${o.id}" tabindex="0" style="--d:${Math.min(i, 12) * 0.04}s" aria-label="${escapeHtml(o.title)}">
      <div class="opp-top">
        <span class="chip ${T.chip}">${icon(T.icon)} ${T.label}</span>
        ${o.featured ? `<span class="badge-feat">${icon('star')} مميزة</span>` : ''}
        ${applied.has(o.id) ? `<span class="applied-tag">${icon('check')} تم التقديم</span>` : ''}
        <button class="bm ${saved.has(o.id) ? 'on' : ''}" data-bm="${o.id}" aria-pressed="${saved.has(o.id)}" aria-label="حفظ الفرصة">${icon('bookmark')}</button>
      </div>
      <h3>${highlight(o.title)}</h3>
      <div class="org"><span class="org-av">${o.org.replace(/^(شركة|مجموعة|مؤسسة|شبكة|دار|هيئة|منصة|عيادات|مختبرات|أبراج|سحابة)\s*/, '').charAt(0)}</span>${highlight(o.org)}</div>
      <div class="meta">
        <span>${icon('pin')} ${highlight(o.gov)}</span>
        <span>${icon('clock')} ${o.mode}</span>
        <span>${icon('trend')} ${o.level}</span>
        <span>${icon('users')} ${fmt(o.applicants)} متقدّم</span>
      </div>
      <div class="tags">${o.tags.map(t => `<span>${highlight(t)}</span>`).join('')}</div>
      <div class="opp-foot">
        <div class="pay"><small>${o.type === 'tender' ? 'القيمة التقديرية' : o.type === 'free' ? 'الميزانية' : 'الراتب الشهري'}</small><strong>${money(o)}</strong></div>
        <div class="due">
          <small class="${urgent ? 'urgent' : ''}">${urgent ? 'ينتهي قريباً · ' : ''}متبقٍ ${fmt(o.deadline)} يوم</small>
          <div class="bar ${urgent ? 'urgent' : ''}"><span style="--w:${pct}%"></span></div>
        </div>
      </div>
    </article>`;
  }

  function render() {
    const list = ALL.filter(o => matches(o)).sort(sorters[state.sort]);
    const cards = $('#cards');
    cards.className = `cards ${state.view === 'list' ? 'list' : ''}`;
    cards.innerHTML = list.map(cardHTML).join('');
    $('#empty').hidden = list.length > 0;
    $('#resultCount').textContent = fmt(list.length);

    // tab counts reflect all filters except type
    const base = ALL.filter(o => matches(o, true));
    $$('[data-count-type]').forEach(b => {
      const t = b.dataset.countType;
      b.textContent = fmt(t === 'all' ? base.length : base.filter(o => o.type === t).length);
    });
    renderChips();
    initCards(cards);
  }

  /* ---------- Active filter chips ---------- */
  function renderChips() {
    const chips = [];
    if (state.q) chips.push(['q', `بحث: ${state.q}`]);
    if (state.gov) chips.push(['gov', state.gov]);
    state.modes.forEach(m => chips.push(['mode:' + m, m]));
    if (state.level) chips.push(['level', state.level]);
    if (state.deadline) chips.push(['deadline', `خلال ${fmt(state.deadline)} يوم`]);
    if (state.featured) chips.push(['featured', 'مميزة']);
    if (state.savedOnly) chips.push(['savedOnly', 'المحفوظة']);
    $('#activeChips').innerHTML = chips.map(([k, l]) => `<span class="chip">${escapeHtml(l)}<button data-rm="${escapeHtml(k)}" aria-label="إزالة ${escapeHtml(l)}">${icon('x')}</button></span>`).join('');
    const fc = $('.fcount');
    const n = chips.filter(c => c[0] !== 'q').length;
    fc.hidden = !n; fc.textContent = fmt(n);
  }
  $('#activeChips').addEventListener('click', e => {
    const b = e.target.closest('[data-rm]'); if (!b) return;
    const k = b.dataset.rm;
    if (k === 'q') { state.q = ''; $('#q').value = ''; }
    else if (k === 'gov') { state.gov = ''; $('#gov').value = ''; }
    else if (k.startsWith('mode:')) { state.modes.delete(k.slice(5)); syncModes(); }
    else if (k === 'level') { state.level = ''; syncPills('#levels', ''); }
    else if (k === 'deadline') { state.deadline = 0; syncPills('#deadline', '0'); }
    else if (k === 'featured') { state.featured = false; $('#featuredOnly').checked = false; }
    else if (k === 'savedOnly') { state.savedOnly = false; $('#savedOnly').checked = false; }
    render();
  });
  const syncPills = (sel, v) => $$(`${sel} button`).forEach(b => b.classList.toggle('on', b.dataset.v === v));
  const syncModes = () => $$('#modes input').forEach(i => { i.checked = state.modes.has(i.value); });

  /* ---------- Tabs ---------- */
  const tabColor = { all: 'var(--brand)', job: 'var(--c-job)', free: 'var(--c-free)', tender: 'var(--c-tender)' };
  function moveIndicator() {
    const active = $(`.tabs button[data-type="${state.type}"]`);
    const ind = $('.tab-ind');
    ind.style.left = active.offsetLeft + 'px';
    ind.style.width = active.offsetWidth + 'px';
    ind.style.setProperty('--tab-c', tabColor[state.type]);
  }
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    state.type = b.dataset.type;
    $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    moveIndicator(); render();
    const url = new URL(location); state.type === 'all' ? url.searchParams.delete('type') : url.searchParams.set('type', state.type);
    history.replaceState(null, '', url);
  }));
  addEventListener('resize', moveIndicator);
  document.fonts && document.fonts.ready.then(moveIndicator);

  /* ---------- Controls ---------- */
  let qTimer;
  $('#q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 160); });
  addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('#q').focus(); }
    if (e.key === 'Escape') { closeDrawer(); closeFilters(); }
  });
  $$('.suggest button').forEach(b => b.addEventListener('click', () => {
    $('#q').value = b.dataset.q; state.q = b.dataset.q; render();
    $('.tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  $('#gov').addEventListener('change', e => { state.gov = e.target.value; render(); });
  $('#modes').addEventListener('change', e => { e.target.checked ? state.modes.add(e.target.value) : state.modes.delete(e.target.value); render(); });
  $('#levels').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; state.level = b.dataset.v; syncPills('#levels', state.level); render(); });
  $('#deadline').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; state.deadline = +b.dataset.v; syncPills('#deadline', b.dataset.v); render(); });
  $('#featuredOnly').addEventListener('change', e => { state.featured = e.target.checked; render(); });
  $('#savedOnly').addEventListener('change', e => { state.savedOnly = e.target.checked; render(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $$('.view-toggle button').forEach(b => b.addEventListener('click', () => {
    state.view = b.dataset.view; $$('.view-toggle button').forEach(x => x.classList.toggle('on', x === b)); render();
  }));
  function resetAll() {
    Object.assign(state, { q: '', gov: '', level: '', deadline: 0, featured: false, savedOnly: false });
    state.modes.clear();
    $('#q').value = ''; $('#gov').value = ''; $('#featuredOnly').checked = false; $('#savedOnly').checked = false;
    syncModes(); syncPills('#levels', ''); syncPills('#deadline', '0');
    render();
  }
  $('#resetFilters').addEventListener('click', resetAll);
  $('#emptyReset').addEventListener('click', resetAll);
  $('#saveAlert').addEventListener('click', () => toast('تم حفظ التنبيه — سنُبلغك بالفرص الجديدة (تجريبي)', 'bell'));

  /* mobile filter drawer */
  const openFilters = () => { $('#filters').classList.add('open'); document.body.classList.add('filters-open'); };
  function closeFilters() { $('#filters').classList.remove('open'); document.body.classList.remove('filters-open'); }
  $('.open-filters').addEventListener('click', openFilters);
  $('.close-filters').addEventListener('click', closeFilters);
  $('.filters-backdrop').addEventListener('click', closeFilters);

  /* ---------- Cards: bookmark + open detail ---------- */
  function toggleSave(id, btn) {
    saved.has(id) ? saved.delete(id) : saved.add(id);
    store.set('nf-proto-saved', [...saved]);
    if (btn) { btn.classList.toggle('on', saved.has(id)); btn.setAttribute('aria-pressed', saved.has(id)); btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse'); }
    toast(saved.has(id) ? 'تمت إضافة الفرصة إلى المحفوظات' : 'تمت إزالة الفرصة من المحفوظات', 'bookmark');
    if (state.savedOnly) render();
  }
  $('#cards').addEventListener('click', e => {
    const bm = e.target.closest('[data-bm]');
    if (bm) { e.stopPropagation(); toggleSave(+bm.dataset.bm, bm); return; }
    const card = e.target.closest('.opp'); if (card) openDrawer(+card.dataset.id);
  });
  $('#cards').addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('opp')) { e.preventDefault(); openDrawer(+e.target.dataset.id); }
  });

  /* ---------- Drawer ---------- */
  let lastFocus;
  function openDrawer(id) {
    const o = ALL.find(x => x.id === id); if (!o) return;
    const T = TYPES[o.type];
    const isApplied = applied.has(o.id);
    const reqs = {
      job: ['مؤهل جامعي في تخصص ذي صلة', 'خبرة عملية مناسبة للمستوى المطلوب', 'إجادة اللغتين العربية والإنجليزية'],
      free: ['معرض أعمال يوضح مشاريع مشابهة', 'الالتزام بالجدول الزمني المتفق عليه', 'تسليم الملفات المصدرية كاملة'],
      tender: ['سجل تجاري ساري المفعول', 'شهادة تسجيل لدى الجهات المختصة', 'ضمان بنكي ابتدائي بنسبة ١٪ من قيمة العرض']
    }[o.type];
    $('#drawerBody').innerHTML = `
      <div class="d-hero t-${o.type}">
        <button class="btn btn-icon d-close" aria-label="إغلاق">${icon('x')}</button>
        <span class="chip ${T.chip}" style="justify-self:start">${icon(T.icon)} ${T.label}</span>
        <h2 id="dTitle">${escapeHtml(o.title)}</h2>
        <div class="org"><span class="org-av">${icon('building')}</span>${escapeHtml(o.org)}</div>
      </div>
      <div class="d-facts">
        <div><small>${o.type === 'tender' ? 'القيمة التقديرية' : o.type === 'free' ? 'الميزانية' : 'الراتب الشهري'}</small><strong>${money(o)}</strong></div>
        <div><small>الموقع</small><strong>${o.gov}</strong></div>
        <div><small>نمط العمل</small><strong>${o.mode}</strong></div>
        <div><small>آخر موعد</small><strong>بعد ${fmt(o.deadline)} يوم</strong></div>
      </div>
      <div class="d-sec"><h3>الوصف</h3><p>${o.desc}</p></div>
      <div class="d-sec"><h3>المتطلبات</h3><ul>${reqs.map(r => `<li>${r}</li>`).join('')}</ul></div>
      <div class="d-sec"><h3>المهارات</h3><div class="tags">${o.tags.map(t => `<span>${t}</span>`).join('')}</div></div>
      <div class="d-actions">
        <button class="btn btn-primary btn-lg ${isApplied ? 'applied' : ''}" id="applyBtn" ${isApplied ? 'disabled' : ''}>
          ${isApplied ? icon('check') + ' تم التقديم' : `<span class="flip"><span>${o.type === 'tender' ? 'تقديم عرض' : 'قدّم الآن'}</span><span>${o.type === 'tender' ? 'تقديم عرض' : 'قدّم الآن'}</span></span>${icon('send')}`}
        </button>
        <button class="btn btn-lg btn-icon ${saved.has(o.id) ? 'saved' : ''}" id="dSave" aria-label="حفظ">${icon('bookmark')}</button>
      </div>`;
    lastFocus = document.activeElement;
    $('#backdrop').hidden = false;
    requestAnimationFrame(() => { $('#backdrop').classList.add('show'); $('#drawer').classList.add('open'); });
    $('#drawer').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('.d-close').focus();
    $('.d-close').addEventListener('click', closeDrawer);
    $('#dSave').addEventListener('click', () => { toggleSave(o.id); render(); });
    const apply = $('#applyBtn');
    apply.addEventListener('click', () => {
      if (applied.has(o.id)) return;
      apply.disabled = true;
      apply.innerHTML = 'جارٍ الإرسال…';
      setTimeout(() => {
        applied.add(o.id); store.set('nf-proto-applied', [...applied]);
        apply.classList.add('applied');
        apply.innerHTML = icon('check') + ' تم التقديم';
        toast(o.type === 'tender' ? 'تم استلام عرضك بنجاح (تجريبي)' : 'تم إرسال طلبك بنجاح (تجريبي)');
        render();
      }, 900);
    });
  }
  function closeDrawer() {
    const d = $('#drawer'); if (!d.classList.contains('open')) return;
    d.classList.remove('open'); d.setAttribute('aria-hidden', 'true');
    $('#backdrop').classList.remove('show');
    setTimeout(() => { $('#backdrop').hidden = true; }, 350);
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $('#backdrop').addEventListener('click', closeDrawer);

  /* ---------- Init ---------- */
  $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x.dataset.type === state.type));
  render();
  requestAnimationFrame(moveIndicator);
})();
