/* NUDGE ME · the lead film on the home page and the case-study page.
   Nudge to play: the stage shakes like the old chat window (±18px, 3 cycles, 0.35s) with the poster still showing, then the film appears and plays with sound.
   The film streams as small HLS pieces (assets/nudge/hls: 1080 / 720 / 480). Safari, iOS and most Chromium browsers play them natively;
   Firefox and others use vendor/hls.light.min.js, fetched when the film nears the screen. window.NUDGE_HLS / NUDGE_HLSJS override both (preview builds). */
(function () {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const T = window.T || {}, A = typeof window.anime === 'function';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SMALL = matchMedia('(max-width: 900px)').matches;
  const SAVE = !!(navigator.connection && navigator.connection.saveData);
  const HOME = !!document.getElementById('three-row');
  const WA = 'https://wa.me/60125272682?text=';
  const HLS = window.NUDGE_HLS || 'assets/nudge/hls/master.m3u8';
  const lang = () => (document.documentElement.lang || 'en').startsWith('zh') ? 'zh' : 'en';
  const t = k => { const o = T[k]; return o ? (o[lang()] ?? o.en) : ''; };
  const IO = 'IntersectionObserver' in window;
  const near = (el, fn, margin = '600px 0px', th = 0) => { if (!IO) { fn(); return; } const o = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { o.disconnect(); fn(); } }, { rootMargin: margin, threshold: th }); o.observe(el); };

  /* chapters: video time = song time + 7.2 s of dial-up */
  const CH = [['nudge.c1', 0], ['nudge.c2', 51.26], ['nudge.c3', 84.52], ['nudge.c4', 108.32], ['nudge.c5', 132.48], ['nudge.c6', 142.76], ['nudge.c7', 178.24]];
  const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); // a clock, not a list number

  /* only one film with sound at a time, page-wide (also covers the home page's #player) */
  document.addEventListener('play', e => { const v = e.target; if (!(v instanceof HTMLVideoElement) || v.muted) return;
    $$('video').forEach(o => { if (o !== v && !o.muted && !o.paused) o.pause(); }); }, true);

  /* ---------- streaming ---------- */
  let hlsLoading = null;
  function loadHls() {
    if (window.Hls) return Promise.resolve();
    if (!hlsLoading) hlsLoading = new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'vendor/hls.light.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
    return hlsLoading;
  }
  const native = v => !window.NUDGE_HLSJS && !!v.canPlayType('application/vnd.apple.mpegurl');
  function attach(v, onFail) {
    if (v._att) return v._att;
    if (native(v)) { v.src = HLS; v._att = Promise.resolve(); v.addEventListener('error', onFail); return v._att; }
    v._att = loadHls().then(() => {
      if (!window.Hls || !Hls.isSupported()) throw new Error('no hls');
      const h = new Hls({ capLevelToPlayerSize: true, startLevel: -1 }); v._hls = h;
      h.on(Hls.Events.ERROR, (e, d) => { if (d.fatal) onFail(); });
      h.loadSource(HLS); h.attachMedia(v);
    });
    v._att.catch(onFail);
    return v._att;
  }

  /* ---------- one stage ---------- */
  function stage(root) {
    const st = root.querySelector('.nudge__stage'), frame = root.querySelector('.nudge__frame'), film = root.querySelector('.nudge__film'),
      loop = root.querySelector('.nudge__loop'), go = root.querySelector('.nudge__go'), ch = root.querySelector('.nudge__ch');
    let started = false;

    // posters arrive only as the film nears the screen; phones get the 960px file
    near(st, () => { [film, loop].forEach(v => { if (v && v.dataset.poster) v.poster = SMALL ? v.dataset.poster.replace('.webp', '-960.webp') : v.dataset.poster; });
      if (!native(film)) loadHls().catch(() => {}); });

    // the silent preview: the streetlights come on once, then it holds on the lit street (under 5 s, no endless loop)
    if (loop && !RM && !SAVE && IO) near(st, () => {
      if (started) return; loop.src = SMALL ? loop.dataset.src.replace('.mp4', '-640.mp4') : loop.dataset.src;
      loop.play().then(() => st.classList.add('looping')).catch(() => {}); }, '0px', .4);

    function shake(done) {
      if (RM) { done(); return; }
      if (A) anime({ targets: st, translateX: [0, -18, 18, -18, 18, -18, 18, 0], duration: 350, easing: 'linear', complete: done });
      else { const a = st.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-18px)' }, { transform: 'translateX(18px)' }, { transform: 'translateX(-18px)' }, { transform: 'translateX(18px)' }, { transform: 'translateX(0)' }], { duration: 350 }); a.onfinish = done; }
    }
    const fail = () => { st.classList.remove('playing'); st.classList.add('failed'); go.textContent = t('nudge.retry'); film.controls = false; };
    function start(at) {
      if (st.classList.contains('failed')) { st.classList.remove('failed'); go.textContent = t('nudge.play'); delete film._att; if (film._hls) { film._hls.destroy(); film._hls = null; } film.removeAttribute('src'); }
      const seek = () => { if (typeof at === 'number') { try { film.currentTime = at; } catch (e) {} } };
      film.muted = false;
      // play() stays inside the tap (Safari needs that); the film is revealed once the shake ends
      const p = attach(film, fail);
      if (film.src && native(film)) { if (film.readyState >= 1) seek(); else film.addEventListener('loadedmetadata', seek, { once: true }); film.play().catch(() => {}); }
      else p.then(() => { if (film.readyState >= 1) seek(); else film.addEventListener('loadedmetadata', seek, { once: true }); film.play().catch(() => {}); }).catch(() => {});
      if (started) { st.classList.add('playing'); return; }
      started = true;
      // keep the poster up (with "Loading…") until the film is really playing, so there is never a black frame
      const reveal = () => { if (st.classList.contains('failed') || st.classList.contains('playing')) return; clearTimeout(st._wait); st.classList.remove('loading'); go.textContent = t('nudge.play');
        st.classList.add('playing'); if (loop) loop.pause(); film.controls = true; film.focus({ preventScroll: true }); };
      shake(() => { if (st.classList.contains('failed')) return;
        if (!film.paused && film.readyState >= 3) { reveal(); return; }
        st.classList.add('loading'); go.textContent = t('nudge.loading');
        film.addEventListener('playing', reveal, { once: true }); st._wait = setTimeout(reveal, 15000); });
    }
    go.addEventListener('click', () => start());
    frame.addEventListener('click', e => { if (!st.classList.contains('playing') && !e.target.closest('.nudge__go')) start(); });

    function renderCh() {
      if (!ch) return;
      ch.setAttribute('aria-label', t('nudge.ch'));
      ch.innerHTML = CH.map(([k, s]) => `<button type="button" data-s="${s}"><b>${t(k)}</b><i>${mmss(s)}</i></button>`).join('');
    }
    if (ch) ch.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; start(+b.dataset.s); st.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }); });
    renderCh();
    return { renderCh };
  }

  const stages = $$('.nudge').map(stage);
  function textLang() {
    $$('[data-wa="nudge"]').forEach(a => a.href = WA + encodeURIComponent(t('nudge.wa')));
    $$('[data-ta]').forEach(el => { const v = T[el.dataset.ta]; if (v) el.setAttribute('aria-label', v[lang()] ?? v.en); });
    $$('.nudge__go').forEach(b => { const s = b.closest('.nudge__stage'); b.textContent = t(s.classList.contains('failed') ? 'nudge.retry' : s.classList.contains('loading') ? 'nudge.loading' : 'nudge.play'); });
  }
  textLang();
  document.addEventListener('xs:lang', () => { stages.forEach(s => s.renderCh()); textLang(); });

  if (HOME) return;

  /* ---------- case-study page only: language, reveals, raw-vs-final, grade slider, typed close ---------- */
  let L = 'en';
  try { const s = localStorage.getItem('xs-lang'); L = s || ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'); } catch (e) {}
  function applyLang() {
    document.documentElement.lang = L === 'zh' ? 'zh-Hans' : 'en';
    $$('[data-t]').forEach(el => { const v = T[el.dataset.t]; if (v) el.textContent = v[L] ?? v.en; });
    $$('[data-th]').forEach(el => { const v = T[el.dataset.th]; if (v) el.innerHTML = v[L] ?? v.en; });
    $$('.nav__wa, .foot__cols a[href^="https://wa.me"]').forEach(a => a.href = WA + encodeURIComponent(t('nudge.wa')));
    document.dispatchEvent(new Event('xs:lang'));
  }
  const lb = $('#lang'); if (lb) lb.addEventListener('click', () => { L = L === 'en' ? 'zh' : 'en'; try { localStorage.setItem('xs-lang', L); } catch (e) {} applyLang(); });
  applyLang();
  const nav = $('#nav'); if (nav) addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });

  // reveals: heading, then text, then picture, 70 ms apart; never hidden without script
  document.documentElement.classList.add('js');
  const rv = $$('.rv');
  if (!A || RM || !IO) rv.forEach(el => el.style.opacity = 1);
  else {
    const io = new IntersectionObserver(es => { const vis = es.filter(e => e.isIntersecting).map(e => e.target); if (!vis.length) return; vis.forEach(el => io.unobserve(el));
      anime({ targets: vis, opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(70), duration: 900, easing: 'cubicBezier(.22,.61,.36,1)' }); }, { threshold: .12 });
    rv.forEach(el => io.observe(el));
    setTimeout(() => rv.forEach(el => { if (getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().top < innerHeight) el.style.opacity = 1; }), 2500);
  }

  // raw vs final: both clips play once together when they come into view; tap either to watch again
  const pair = $$('.pair video'), box = $('.pair');
  if (pair.length) {
    if (RM || !IO) pair.forEach(v => { v.src = v.dataset.src; v.controls = true; });
    else {
      const playBoth = () => pair.forEach(v => { if (!v.src) v.src = v.dataset.src; v.currentTime = 0; v.play().catch(() => {}); });
      let seen = false;
      new IntersectionObserver(es => { if (es[0].isIntersecting && !seen) { seen = true; playBoth(); } }, { threshold: .4 }).observe(box);
      pair.forEach(v => v.closest('figure').addEventListener('click', playBoth));
    }
  }

  // the grade: drag anywhere on the picture (touch included) or use the arrow keys
  const cmp = $('.cmp');
  if (cmp) {
    const r = cmp.querySelector('input');
    const set = v => { v = Math.max(0, Math.min(100, Math.round(v))); r.value = v; cmp.style.setProperty('--x', v + '%'); cmp.classList.toggle('lo', v < 20); cmp.classList.toggle('hi', v > 80); r.setAttribute('aria-valuetext', fill(t('nm.grade.vt'), v)); };
    const fill = (s, v) => s.replace('{v}', 100 - v).replace('{g}', v);
    r.addEventListener('input', () => set(+r.value)); set(+r.value);
    document.addEventListener('xs:lang', () => set(+r.value));
    let drag = false;
    const at = e => { const b = cmp.getBoundingClientRect(); set((e.clientX - b.left) / b.width * 100); };
    cmp.addEventListener('pointerdown', e => { drag = true; cmp.setPointerCapture(e.pointerId); at(e); r.focus({ preventScroll: true }); });
    cmp.addEventListener('pointermove', e => { if (drag) at(e); });
    ['pointerup', 'pointercancel'].forEach(n => cmp.addEventListener(n, () => drag = false));
    // a short hint on first view: the line sweeps once to show it moves
    if (A && !RM && IO) near(cmp, () => { const s = { x: 50 }; anime({ targets: s, x: [50, 30, 70, 50], duration: 1800, easing: 'easeInOutSine', update: () => set(s.x) }); }, '0px', .5);
  }

  // the close: "Hey… 你还在吗？" typed slowly, no reply
  const q = $('.close__q');
  if (q && A && !RM && IO) {
    const o = new IntersectionObserver(es => { if (!es[0].isIntersecting) return; o.disconnect();
      const html = q.innerHTML, chars = [...q.textContent]; q.textContent = ''; q.classList.add('typing'); let i = 0;
      const tick = () => { q.textContent = chars.slice(0, ++i).join(''); if (i < chars.length) setTimeout(tick, chars[i - 1] === '…' ? 520 : 95); else { q.classList.remove('typing'); q.innerHTML = html; } };
      setTimeout(tick, 300); }, { threshold: .6 });
    o.observe(q);
  }

  // the WhatsApp button nudges too, on press
  $$('.nm-close .btn').forEach(b => b.addEventListener('click', () => { if (!RM && A) anime({ targets: b, translateX: [0, -10, 10, -10, 10, 0], duration: 350, easing: 'linear' }); }));
})();
