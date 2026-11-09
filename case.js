/* Xavier Studio · case-study pages (Pang Pang, Miralune, SERA). Anime.js 3 for motion; EN / 中文 from i18n.js + case-i18n.js.
   Everything is readable without JS; motion only enhances (reduced motion: no movement, content shown at once). */
(function () {
  'use strict';
  const T = window.T || {}, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const A = typeof window.anime === 'function', RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SMALL = matchMedia('(max-width: 900px)').matches, SAVE = !!(navigator.connection && navigator.connection.saveData);
  const EASE = 'cubicBezier(.22,.61,.36,1)';
  document.documentElement.classList.add('js');

  /* ---------- language ---------- */
  let L = 'en';
  try {
    const s = localStorage.getItem('xs-lang'), n = (navigator.language || '').toLowerCase();
    L = ['en', 'zh', 'tw'].includes(s) ? s : /^zh-(tw|hk|mo|hant)/.test(n) ? 'tw' : n.startsWith('zh') ? 'zh' : 'en';
  } catch (e) {}
  /* tw (繁體) comes from case-tw.js; falls back to 简体, then English */
  const tr = k => { const o = T[k]; return o ? (o[L] ?? (L === 'tw' ? o.zh : null) ?? o.en) : null; };
  const TITLE0 = document.title, BRAND0 = TITLE0.split(' · ')[0];
  function applyLang() {
    document.documentElement.lang = L === 'zh' ? 'zh-Hans' : L === 'tw' ? 'zh-Hant' : 'en';
    const hk = $('.cs-hero__hook');
    if (hk && L !== 'en') { const d = document.createElement('p'); d.innerHTML = tr(hk.dataset.th) || ''; document.title = `${BRAND0} · ${d.textContent} · Xavier Studio`; }
    else document.title = TITLE0;
    $$('[data-t]').forEach(el => { const v = tr(el.dataset.t); if (v != null) el.textContent = v; });
    $$('[data-th]').forEach(el => { const v = tr(el.dataset.th); if (v != null) el.innerHTML = v; });
    $$('[data-talt]').forEach(el => { const v = tr(el.dataset.talt); if (v != null) el.alt = v; });
    $$('.lang [data-l]').forEach(b => { const on = b.dataset.l === L; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const name = BRAND0;
    const hi = L === 'zh' ? `你好 Melvin，我看了 ${name} 的案例，想为我的店做一个品牌。` : L === 'tw' ? `你好 Melvin，我看了 ${name} 的案例，想為我的店做一個品牌。` : `Hi Melvin, I saw the ${name} case study and would like a brand for my shop.`;
    $$('[data-wa]').forEach(a => a.href = 'https://wa.me/60125272682?text=' + encodeURIComponent(hi));
    const wa = tr('wa.hi'); if (wa) $$('.nav__wa, .foot__cols a[href^="https://wa.me"]').forEach(a => a.href = 'https://wa.me/60125272682?text=' + encodeURIComponent(wa));
  }
  $$('.lang [data-l]').forEach(b => b.addEventListener('click', () => { L = b.dataset.l; try { localStorage.setItem('xs-lang', L); } catch (e) {} applyLang(); }));
  applyLang();

  /* ---------- nav ---------- */
  const nav = $('#nav'); const solid = () => nav.classList.toggle('solid', scrollY > 40); addEventListener('scroll', solid, { passive: true }); solid();

  /* ---------- the film: a silent loop while it is on screen (desktop), sound on tap ---------- */
  const fig = $('#cs-film'), v = fig && fig.querySelector('video'), go = fig && fig.querySelector('.cs-film__go');
  let full = false;
  if (v) {
    const canLoop = !RM && !SAVE && !SMALL && 'IntersectionObserver' in window;
    if (canLoop) new IntersectionObserver(es => es.forEach(e => {
      if (full) return;
      if (e.isIntersecting) { if (!v.src) { v.muted = true; v.loop = true; v.src = v.dataset.loop; } v.play().catch(() => {}); } else v.pause();
    }), { threshold: .25 }).observe(fig);
    const playFull = () => { if (full) return; full = true; fig.classList.add('playing'); v.loop = false; v.muted = false; v.controls = true; v.src = v.dataset.src; v.play().catch(() => {}); };
    go.addEventListener('click', playFull); v.addEventListener('click', () => { if (!full) playFull(); });
    v.addEventListener('ended', () => { if (full) { v.controls = true; } });
  }

  /* ---------- motion ---------- */
  function boot() {
    const els = $$('.rv');
    if (!A || RM || !('IntersectionObserver' in window)) { document.documentElement.classList.remove('cs-anim'); els.forEach(el => el.style.opacity = 1); return; }
    anime.timeline({ easing: EASE })
      .add({ targets: '.cs-film', opacity: [0, 1], scale: [1.04, 1], duration: 1800 })
      .add({ targets: ['.cs-eyebrow', '.cs-hero__name'], opacity: [0, 1], translateY: [22, 0], duration: 1300, delay: anime.stagger(140) }, 250)
      .add({ targets: '.cs-hero__hook em', color: ['#EFE8DC', '#C9AD7E'], duration: 1500 }, 1100)
      .add({ targets: ['.cs-hero__hook', '.cs-hero__label', '.cs-ledger > div'], opacity: [0, 1], translateY: [14, 0], duration: 1100, delay: anime.stagger(120) }, 700);
    const io = new IntersectionObserver(es => { const vis = es.filter(e => e.isIntersecting).map(e => e.target); if (!vis.length) return; vis.forEach(el => io.unobserve(el));
      anime({ targets: vis, opacity: [0, 1], translateY: [14, 0], duration: 800, delay: anime.stagger(70), easing: EASE }); }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    /* the footer wordmark rises letter by letter */
    const w = $('#footword');
    if (w) { w.innerHTML = w.innerHTML.replace(/>([^<]+)</g, (m, s) => '>' + [...s].map(c => c === ' ' ? ' ' : `<span class="ch">${c}</span>`).join('') + '<');
      $$('#footword .ch').forEach(c => { c.style.transform = 'translateY(60%)'; c.style.opacity = 0; });
      const o = new IntersectionObserver(es => { if (es[0].isIntersecting) { o.disconnect(); anime({ targets: '#footword .ch', translateY: ['60%', '0%'], opacity: [0, 1], duration: 1300, delay: anime.stagger(55), easing: EASE }); } }, { threshold: .2 }); o.observe($('#foot')); }
    /* safety net: paused frames (background tab, slow phone) never leave content hidden */
    setTimeout(() => $$('.rv, .cs-film, .cs-eyebrow, .cs-hero__name, .cs-hero__hook, .cs-hero__label, .cs-ledger > div').forEach(el => {
      if (el.classList.contains('rv') && el.getBoundingClientRect().top > innerHeight) return;
      if (+getComputedStyle(el).opacity < .99) { el.style.opacity = 1; el.style.transform = 'none'; } }), 4500);
  }

  /* ---------- board viewer: tap a board to see it full size; tap again for 1:1 and pan (phones can read the small type) ---------- */
  (function boards() {
    const imgs = $$('.cs-fig img'); if (!imgs.length || !window.HTMLDialogElement) return;
    const LB = { en: ['View full size', 'Close', 'Tap to zoom in or out'], zh: ['查看大图', '关闭', '点按放大或缩小'], tw: ['查看大圖', '關閉', '點按放大或縮小'] };
    const lb = () => LB[L] || LB.en;
    const dlg = document.createElement('dialog'); dlg.className = 'zv';
    dlg.innerHTML = '<div class="zv__scroll"><img alt=""></div><button class="zv__x" type="button"></button><p class="zv__hint"></p>';
    document.body.appendChild(dlg);
    const sc = dlg.querySelector('.zv__scroll'), big = dlg.querySelector('img'), x = dlg.querySelector('.zv__x'), hint = dlg.querySelector('.zv__hint');
    let from = null;
    const label = () => { imgs.forEach(i => i.setAttribute('aria-label', (i.alt ? i.alt + ' · ' : '') + lb()[0])); x.textContent = lb()[1]; hint.textContent = lb()[2]; };
    imgs.forEach(i => {
      i.setAttribute('role', 'button'); i.tabIndex = 0; i.classList.add('zv-open');
      const open = () => { from = i; big.src = i.currentSrc || i.src; big.alt = i.alt; dlg.classList.remove('is-zoom'); dlg.showModal(); sc.scrollTo(0, 0); };
      i.addEventListener('click', open);
      i.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    big.addEventListener('click', e => {
      const r = big.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      dlg.classList.toggle('is-zoom');
      if (dlg.classList.contains('is-zoom')) requestAnimationFrame(() => sc.scrollTo(fx * big.offsetWidth - sc.clientWidth / 2, fy * big.offsetHeight - sc.clientHeight / 2));
    });
    x.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target === sc) dlg.close(); });
    dlg.addEventListener('close', () => { if (from) from.focus(); });
    $$('.lang [data-l]').forEach(b => b.addEventListener('click', label));
    label();
  })();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
