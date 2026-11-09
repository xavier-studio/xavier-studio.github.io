/* Xavier Studio · logo motion in the contact band.
   Design Library K16 (construction-drawing mark) + K12 (light sweep) + S12 (particles) + VZ282 (square type tunnel).
   Everything plays inside one square panel; the motto sits beside it.
   1. The construction grid draws itself: guides, the 49.3° diagonals, the S circle, measured points.
   2. ~700 particles (gold and ivory, sampled from the real logo paths) fly in on curved paths and become the mark.
   3. The crisp vector mark takes over, a light sweep crosses it, XAVIER wipes in, the gold rules open, STUDIO settles.
   4. The motto sets word by word the first time; after that it stays put.
   Behind the lockup: a square type tunnel. The logo's own XAVIER STUDIO lettering sits on four walls (top upright,
   sides turned, bottom upside down), nested squares fly out from the centre of the panel, fast while the mark
   builds, then a slow drift. Rings fade out behind the mark and at the panel edge, so nothing is cut off.
   Loop: hold 12 s, the mark breaks back into particles and rebuilds. A pause button stops all of it (WCAG 2.2.2).
   Reduced motion or no JS: the finished logo, grid and motto, no movement. Anime.js 3 drives the timeline. */
(function () {
  'use strict';
  const stage = document.getElementById('logo-anim');
  if (!stage) return;
  const A = typeof window.anime === 'function';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => stage.querySelector(s), $$ = s => [...stage.querySelectorAll(s)];
  const panel = $('.lmx__panel'), svg = $('.lmx__svg'), canvas = $('.lmx__c'), motto = $('.motto'), pp = $('.lmx__pp');
  const VB = { w: 3194, h: 2852 };
  const GOLD = '#BD964D', IVORY = '#F4EFE6';
  const ctx = canvas.getContext('2d');
  let dpr = 1, W = 0, H = 0, parts = [], dust = [], prog = 0, dustOn = false, inView = false, played = false, shown = false;
  let tl = null, raf = 0, paused = false, phase = 'idle', lastT = 0, lastDraw = 0;
  let px = 0, py = 0, tx = 0, ty = 0; /* pointer lean */
  const tun = { v: 0, a: 0, p: 0, cx: 0, cy: 0, R: 0 }; /* tunnel: speed (rings/s), opacity, phase, centre, outer half-size */

  /* ---------- motto: split into words (EN) or characters (中文); screen readers get the whole line ---------- */
  function splitMotto() {
    if (motto.querySelector('.lmx-sr')) return; /* already split for this language */
    const out = [];
    const tmp = document.createElement('p'); tmp.innerHTML = motto.innerHTML.replace(/<br\s*\/?>/gi, ' ');
    const said = tmp.textContent.replace(/\s+/g, ' ').trim();
    const walk = (node, wrapEm) => {
      node.childNodes.forEach(n => {
        if (n.nodeType === 3) {
          const cjk = /[㐀-鿿]/.test(n.textContent);
          const bits = cjk ? n.textContent.match(/[㐀-鿿][，。、]?|[^㐀-鿿]+/g) || [] : n.textContent.split(/(\s+)/);
          bits.forEach(b => { if (!b) return; if (/^\s+$/.test(b)) { out.push(document.createTextNode(b)); return; }
            const sp = document.createElement('span'); sp.className = 'mw'; sp.textContent = b; sp.setAttribute('aria-hidden', 'true');
            if (wrapEm) { const em = document.createElement('em'); em.appendChild(sp); out.push(em); } else out.push(sp); });
        } else if (n.nodeName === 'EM') walk(n, true);
        else if (n.nodeName === 'BR') out.push(document.createElement('br'));
      });
    };
    walk(motto, false);
    motto.textContent = ''; out.forEach(n => motto.appendChild(n));
    const sr = document.createElement('span'); sr.className = 'lmx-sr'; sr.textContent = said; motto.appendChild(sr);
    if (shown || RM || !A) $$('.mw').forEach(w => { w.style.opacity = 1; w.style.filter = 'none'; w.style.transform = 'none'; });
  }
  /* pause button label follows the page language */
  const LBL = { en: ['Pause logo motion', 'Play logo motion'], 'zh-Hans': ['暂停标志动态', '播放标志动态'], 'zh-Hant': ['暫停標誌動態', '播放標誌動態'] };
  const label = () => { const l = LBL[document.documentElement.lang] || LBL.en; pp.setAttribute('aria-label', l[paused ? 1 : 0]); };
  document.addEventListener('xs:lang', () => setTimeout(() => { splitMotto(); label(); }, 0));
  splitMotto(); label();

  const STATIC = RM || !A || !('IntersectionObserver' in window);
  if (STATIC) stage.classList.add('is-static');

  /* ---------- geometry ---------- */
  function measure() {
    const r = panel.getBoundingClientRect(), s = svg.getBoundingClientRect();
    dpr = Math.min(1.5, window.devicePixelRatio || 1); W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    return { ox: s.left - r.left, oy: s.top - r.top, k: s.width / VB.w };
  }
  /* sample the X and S paths into particle targets */
  function sample(g) {
    const off = document.createElement('canvas'), sw = Math.round(VB.w * g.k), sh = Math.round(VB.h * g.k * 0.7);
    off.width = Math.max(1, sw); off.height = Math.max(1, sh);
    const o = off.getContext('2d'); o.scale(g.k, g.k);
    o.fillStyle = '#f00'; o.fill(new Path2D($('.lmx-x').getAttribute('d')));
    o.fillStyle = '#0f0'; o.fill(new Path2D($('.lmx-s').getAttribute('d')));
    const d = o.getImageData(0, 0, off.width, off.height).data, pts = [];
    const step = Math.max(2, Math.round(Math.sqrt(sw * sh / 4200)));
    for (let y = 0; y < off.height; y += step) for (let x = 0; x < off.width; x += step) {
      const i = (y * off.width + x) * 4; if (d[i + 3] < 128) continue;
      pts.push({ x: g.ox + x + (Math.random() - .5) * step * .5, y: g.oy + y + (Math.random() - .5) * step * .5, c: d[i] > d[i + 1] ? GOLD : IVORY });
    }
    return { pts, step };
  }
  function build() {
    const g = measure(), sm = sample(g), cx = g.ox + VB.w * g.k * .48, cy = g.oy + VB.h * g.k * .33;
    tun.cx = W / 2; tun.cy = H / 2; tun.R = W / 2;
    parts = sm.pts.map(p => {
      const ang = Math.random() * Math.PI * 2, rad = W * (.42 + Math.random() * .3);
      const sx = cx + Math.cos(ang) * rad, sy = cy + Math.sin(ang) * rad;
      /* curve: a perpendicular bow that collapses as the particle lands */
      const dx = p.x - sx, dy = p.y - sy, len = Math.hypot(dx, dy) || 1, bow = (Math.random() - .5) * len * .45;
      return { sx, sy, tx: p.x, ty: p.y, nx: -dy / len * bow, ny: dx / len * bow, c: p.c,
        r: sm.step * (.32 + Math.random() * .22), delay: (p.x - g.ox) / (VB.w * g.k) * .38 + Math.random() * .12 };
    });
    dust = Array.from({ length: Math.round(W * H / 7000) }, () => ({ x: Math.random() * W, y: Math.random() * H, v: .06 + Math.random() * .16, r: .5 + Math.random() * 1.1, a: .08 + Math.random() * .26, ph: Math.random() * 6.28 }));
  }
  const easeOut = t => 1 - Math.pow(1 - t, 4);
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  /* ---------- the tunnel lettering: the logo's own XAVIER + STUDIO paths, drawn once into two sprites ---------- */
  let spr = null;
  function sprites() {
    const bw = $('.lmx-w').getBBox(), bs = $('.lmx-st').getBBox();
    const capS = bw.height / bs.height, gap = bw.height * .9;      /* STUDIO scaled to XAVIER's cap height */
    const wu = bw.width + gap + bs.width * capS, hu = bw.height;  /* word size in logo units */
    const PX = 1400, k = PX / wu, cw = Math.ceil(wu * k) + 4, ch = Math.ceil(hu * k) + 4;
    const make = col => {
      const c = document.createElement('canvas'); c.width = cw; c.height = ch; const o = c.getContext('2d'); o.fillStyle = col;
      o.save(); o.translate(2, 2); o.scale(k, k); o.translate(-bw.x, -bw.y); o.fill(new Path2D($('.lmx-w').getAttribute('d'))); o.restore();
      o.save(); o.translate(2 + (bw.width + gap) * k, 2); o.scale(k * capS, k * capS); o.translate(-bs.x, -bs.y);
      o.fill(new Path2D($('.lmx-st').getAttribute('d'))); o.restore();
      return c;
    };
    spr = { ivory: make(IVORY), gold: make(GOLD), ratio: cw / ch };
  }

  /* ---------- the square type tunnel ---------- */
  const K = .82, RINGS = 18;
  function drawTunnel(dt) {
    tun.p += tun.v * dt;
    const f = tun.p % 1, cx = tun.cx + px * .8, cy = tun.cy + py * .8;
    for (let i = RINGS; i >= 0; i--) {
      const s = Math.pow(K, i + f), r = tun.R * s;                  /* rings grow outward as p rises */
      if (r < 4) continue;
      /* fade in from the centre (hidden behind the mark), fade out before the panel edge */
      const a = tun.a * (.12 + .88 * smooth(.42, .7, s)) * smooth(.08, .3, s) * (1 - smooth(.86, 1, s));
      if (a < .004) continue;
      const len = 2 * r * .9, h = len / spr.ratio;                   /* the word fills 90% of each wall */
      for (let w = 0; w < 4; w++) {
        const ang = w * Math.PI / 2, c = Math.cos(ang), sn = Math.sin(ang);
        /* rotate about the centre, then step out to the wall */
        ctx.setTransform(dpr * c, dpr * sn, -dpr * sn, dpr * c, dpr * cx, dpr * cy);
        ctx.globalAlpha = a * (w === 0 ? .34 : .2);
        ctx.drawImage(w === 0 ? spr.gold : spr.ivory, -len / 2, -r + h * .15, len, h);
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1;
  }

  /* ---------- canvas loop: particles while building, tunnel + dust always; 30 fps once settled ---------- */
  let fade = 1; /* particles fade out once the vector mark is in */
  function frame(t) {
    raf = 0; if (!inView || document.hidden || paused) return;
    raf = requestAnimationFrame(frame);
    const settled = phase === 'hold';
    if (settled && t - lastDraw < 32) return;
    lastDraw = t;
    const dt = lastT ? Math.min(.06, (t - lastT) / 1000) : 0; lastT = t;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    px += (tx - px) * .12; py += (ty - py) * .12;
    if (Math.abs(tx - px) + Math.abs(ty - py) > .02) svg.style.transform = `translate3d(${px.toFixed(2)}px,${py.toFixed(2)}px,0)`;
    if (tun.a > .001) drawTunnel(dt);
    if (dustOn) {
      ctx.fillStyle = GOLD;
      for (const d of dust) {
        d.y -= d.v * 60 * dt; d.x += Math.sin(t / 1900 + d.ph) * .1; if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
        ctx.globalAlpha = d.a * (.6 + .4 * Math.sin(t / 900 + d.ph));
        ctx.fillRect(d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
      }
    }
    if (fade > 0 && prog > 0) {
      for (const p of parts) {
        const q = Math.min(1, Math.max(0, (prog - p.delay) / .5));
        if (q <= 0) continue;
        const e = easeOut(q), bow = Math.sin(q * Math.PI);
        const x = p.sx + (p.tx - p.sx) * e + p.nx * bow * (1 - e), y = p.sy + (p.ty - p.sy) * e + p.ny * bow * (1 - e);
        ctx.globalAlpha = (.3 + .7 * q) * fade; ctx.fillStyle = p.c;
        ctx.fillRect(x - p.r, y - p.r, p.r * 2, p.r * 2);
      }
    }
    ctx.globalAlpha = 1;
  }
  const loop = () => { if (!raf && !paused) { lastT = 0; lastDraw = 0; raf = requestAnimationFrame(frame); } };

  /* ---------- the timeline ---------- */
  const guides = $$('.lmx-guides .gd'), pts = $$('.lmx-guides .gd-pt, .lmx-guides .gd-t');
  const mark = $('.lmx-mark'), sheen = $('.lmx-sheen'), rw = $('.lmx-rw'), rl = $('.lmx-rl'), st = $('.lmx-st');
  guides.forEach(l => l.setAttribute('pathLength', 1));
  function reset() {
    if (tl) tl.pause(); prog = 0; fade = 1; dustOn = false;
    guides.forEach(l => { l.style.strokeDasharray = '1'; l.style.strokeDashoffset = '1'; l.style.opacity = ''; });
    pts.forEach(p => { p.style.opacity = 0; });
    mark.style.opacity = 0; sheen.setAttribute('x', -1400); rw.setAttribute('width', 0); rl.setAttribute('x', 1597); rl.setAttribute('width', 0);
    st.style.opacity = 0;
    if (!shown) $$('.mw').forEach(w => { w.style.opacity = 0; w.style.filter = 'blur(8px)'; w.style.transform = 'translateY(14px)'; });
    stage.classList.remove('is-done');
  }
  function play() {
    if (!spr) sprites();
    build(); reset(); phase = 'build'; loop();
    const E = 'cubicBezier(.16,1,.3,1)', st8 = { p: 0 };
    tl = anime.timeline({ easing: E });
    tun.v = 2.2; tun.a = 0;
    tl.add({ targets: tun, a: [0, 1], duration: 500, easing: 'linear' }, 0)
      .add({ targets: tun, v: [2.2, .14], duration: 2800, easing: 'cubicBezier(.22,.61,.36,1)' }, 0)
      .add({ targets: tun, a: [1, .7], duration: 1600, easing: 'easeOutQuad' }, 2200);
    tl.add({ targets: guides, strokeDashoffset: [1, 0], duration: 1100, delay: anime.stagger(55), easing: 'cubicBezier(.65,0,.35,1)' }, 0)
      .add({ targets: pts, opacity: [0, 1], duration: 500, delay: anime.stagger(60) }, 500)
      .add({ targets: st8, p: [0, 1], duration: 1900, easing: 'linear', update: () => { prog = st8.p; } }, 350)
      .add({ targets: mark, opacity: [0, 1], duration: 450, easing: 'easeOutQuad' }, 2000)
      .add({ targets: { f: 1 }, f: [1, 0], duration: 450, easing: 'easeOutQuad', update: a => { fade = a.animations[0].currentValue; } }, 2150)
      .add({ targets: sheen, x: [-1400, 4200], duration: 1100, easing: 'cubicBezier(.65,0,.35,1)' }, 2250)
      .add({ targets: rw, width: [0, 3080], duration: 700 }, 2300)
      .add({ targets: rl, x: [1597, 0], width: [0, 3194], duration: 800 }, 2550)
      .add({ targets: st, opacity: [0, 1], duration: 600, easing: 'linear' }, 2700);
    if (!shown) tl.add({ targets: $$('.mw'), opacity: [0, 1], filter: ['blur(8px)', 'blur(0px)'], translateY: [14, 0], duration: 900, delay: anime.stagger(110) }, 2900);
    tl.add({ targets: guides, opacity: [1, .35], duration: 1200, easing: 'easeOutQuad' }, 3300)
      .add({ targets: {}, duration: 1, complete: () => {
        played = shown = true; dustOn = true; stage.classList.add('is-done');
        $$('.mw').forEach(w => { w.style.filter = 'none'; w.style.transform = 'none'; w.style.opacity = 1; });
        phase = 'hold'; holdThenLoop(); } }, 4200);
  }
  /* loop: hold the finished lockup, then the mark breaks back into particles and everything rebuilds */
  let holdT = 0, holdLeft = 12000, holdStart = 0, sheenT = 0;
  function holdThenLoop() {
    clearTimeout(holdT); clearTimeout(sheenT); holdStart = performance.now();
    holdT = setTimeout(() => { holdLeft = 12000; if (inView && !document.hidden && !paused) outro(); else phase = 'waiting'; }, holdLeft);
    /* one light sweep in the middle of the hold */
    if (holdLeft > 7000) sheenT = setTimeout(() => { if (phase === 'hold' && !paused && inView && !document.hidden) anime({ targets: sheen, x: [-1400, 4200], duration: 1400, easing: 'cubicBezier(.65,0,.35,1)' }); }, holdLeft - 6000);
  }
  function outro() {
    phase = 'outro'; loop();
    const st8 = { p: 1 };
    fade = 1; prog = 1;
    tl = anime.timeline({ easing: 'cubicBezier(.65,0,.35,1)' });
    tl.add({ targets: tun, v: [tun.v, 2.6], duration: 1500, easing: 'cubicBezier(.7,0,.84,0)' }, 0)
      .add({ targets: tun, a: [tun.a, 0], duration: 700, easing: 'easeInQuad' }, 1200);
    tl.add({ targets: st, opacity: [1, 0], duration: 400 }, 0)
      .add({ targets: rl, x: [0, 1597], width: [3194, 0], duration: 600 }, 0)
      .add({ targets: rw, width: [3080, 0], duration: 600 }, 100)
      /* particles start moving before the vector mark fades, so the mark never sits as grain */
      .add({ targets: st8, p: [1, 0], duration: 1400, easing: 'cubicBezier(.55,0,.75,.2)', update: () => { prog = st8.p; } }, 350)
      .add({ targets: mark, opacity: [1, 0], duration: 300, easing: 'linear' }, 550)
      .add({ targets: guides, strokeDashoffset: [0, 1], duration: 900, delay: anime.stagger(40) }, 700)
      .add({ targets: pts, opacity: [1, 0], duration: 400 }, 700)
      .add({ targets: {}, duration: 1, complete: () => { played = false; play(); } }, 1900);
  }

  /* ---------- pause / play ---------- */
  pp.addEventListener('click', () => {
    paused = !paused; pp.setAttribute('aria-pressed', String(paused)); label();
    if (paused) {
      if (tl) tl.pause(); clearTimeout(holdT); clearTimeout(sheenT);
      if (phase === 'hold') holdLeft = Math.max(1500, holdLeft - (performance.now() - holdStart));
      cancelAnimationFrame(raf); raf = 0;
    } else {
      loop();
      if (phase === 'hold') holdThenLoop(); else if (phase === 'waiting') outro(); else if (tl) tl.play();
    }
  });

  /* reduced motion / no Anime.js: one still frame of the tunnel behind the finished logo, no movement */
  if (STATIC) {
    let rs = 0;
    const still = () => { if (!spr) sprites(); measure(); tun.cx = W / 2; tun.cy = H / 2; tun.R = W / 2; tun.a = .7; tun.p = .45;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); drawTunnel(0); };
    still(); addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(still, 200); });
    return;
  }
  reset();
  new IntersectionObserver(es => {
    inView = es[0].isIntersecting;
    if (!inView || paused) return;
    if (phase === 'idle') play(); else { loop(); if (phase === 'waiting') outro(); }
  }, { threshold: .35 }).observe(panel);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && inView && !paused) { loop(); if (phase === 'waiting') outro(); } });
  if (matchMedia('(pointer: fine)').matches) {
    stage.closest('.band').addEventListener('pointermove', e => { const r = panel.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width - .5)) * 8; ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height - .5)) * 6; }, { passive: true });
  }
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (phase !== 'idle') build(); }, 200); });
  /* safety net: if timers are paused (background tab) never leave the logo hidden */
  setTimeout(() => { if (!played && panel.getBoundingClientRect().top < innerHeight && mark.style.opacity === '0' && tl) tl.seek(tl.duration); }, 9000);
})();
