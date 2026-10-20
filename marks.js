/* Brand Machine — mark generator. Every mark is built from non-overlapping filled polygons in a 100×100 box and
   written as ONE even-odd path, so the same `d` renders as a 2D logo and extrudes cleanly into 3D (SVGLoader). */
window.MARKS = (function () {
  const TAU = Math.PI * 2;
  const circ = (cx, cy, r, n = 72, a0 = 0, a1 = TAU) => { const p = []; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / (a1 - a0 === TAU ? n : n - 1); p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; };
  const ell = (cx, cy, rx, ry, rot = 0, n = 48) => { const p = []; const c = Math.cos(rot), s = Math.sin(rot); for (let i = 0; i < n; i++) { const a = TAU * i / n, x = rx * Math.cos(a), y = ry * Math.sin(a); p.push([cx + x * c - y * s, cy + x * s + y * c]); } return p; };
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const rrect = (x0, y0, x1, y1, r, n = 8) => { const p = []; const cs = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]];
    cs.forEach(([cx, cy, a]) => { for (let i = 0; i <= n; i++) { const t = a + (Math.PI / 2) * i / n; p.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } }); return p; };
  const rot = (pts, a, cx = 0, cy = 0) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };
  const bar = (x0, y0, x1, y1, w) => { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2; return [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]]; };
  const chaikin = (pts, k = 3) => { let p = pts; for (let j = 0; j < k; j++) { const q = []; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; q.push([.75 * a[0] + .25 * b[0], .75 * a[1] + .25 * b[1]], [.25 * a[0] + .75 * b[0], .25 * a[1] + .75 * b[1]]); } p = q; } return p; };
  const drop = (cx, cy, s, n = 64) => { const p = []; for (let i = 0; i < n; i++) { const t = TAU * i / n; p.push([cx + s * .62 * Math.sin(t) * Math.sin(t / 2), cy - s * Math.cos(t)]); } return p; };
  const band = (x0, x1, yc, th, amp, freq, phase = 0, n = 40) => { const top = [], bot = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = yc + amp * Math.sin(freq * Math.PI * (x - x0) / (x1 - x0) + phase); top.push([x, y - th / 2]); bot.push([x, y + th / 2]); } return top.concat(bot.reverse()); };
  const leafHalf = (side, gap = .05, w = .45, n = 30) => { const p = []; for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; p.push([side * (gap + w * Math.sin(t)), -Math.cos(t)]); } p.push([side * gap, 1]); p.push([side * gap, -1]); return p; };

  /* motifs: unit space, centred on (0,0), roughly within radius 1 */
  const M = {
    cup: () => { const body = []; for (let i = 0; i <= 24; i++) { const t = Math.PI * i / 24; body.push([.55 * Math.cos(t), .02 + .55 * Math.sin(t)]); } body.push([-.55, -.05], [.55, -.05]);
      return [body.reverse(), rrect(-.82, .66, .82, .78, .05), ...[-.3, 0, .3].map(x => band(-.95, -.25, x, .09, .07, 2).map(([a, b]) => [b, a]))]; },
    bean: () => { const rx = .52, ry = .82, g = .06, out = []; [-1, 1].forEach(s => { const p = []; for (let i = 0; i <= 30; i++) { const th = (s < 0 ? Math.PI / 2 : -Math.PI / 2) + Math.PI * i / 30; p.push([rx * Math.cos(th), ry * Math.sin(th)]); }
        for (let i = 0; i <= 20; i++) { const y = (s < 0 ? -ry : ry) - (s < 0 ? -1 : 1) * 2 * ry * i / 20; p.push([.14 * Math.sin(Math.PI * y / ry) + s * g, y]); } out.push(rot(p, .45)); }); return out; },
    sun: () => { const out = [], d = []; for (let i = 0; i <= 36; i++) { const t = Math.PI + Math.PI * i / 36; d.push([.42 * Math.cos(t), .38 + .42 * Math.sin(t)]); } out.push(d);
      for (let k = 0; k < 7; k++) { const a = Math.PI + Math.PI * (k + .5) / 7; out.push(bar(.56 * Math.cos(a), .38 + .56 * Math.sin(a), .92 * Math.cos(a), .38 + .92 * Math.sin(a), .11)); }
      out.push(rrect(-.9, .5, .9, .62, .05)); return out; },
    spark: () => { const p = []; for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + Math.PI * i / 4, r = i % 2 ? .2 : 1; p.push([r * Math.cos(a), r * Math.sin(a)]); } return [chaikin(p, 1)]; },
    wheat: () => { const out = [rect(-.035, -.35, .035, 1)]; [-.15, .15, .45].forEach(y => { [-1, 1].forEach(s => out.push(ell(s * .24, y, .13, .26, s * .6))); }); out.push(ell(0, -.62, .13, .26, 0)); return out; },
    crescent: () => { const R = .85, r = .72, d = .36, xi = (R * R - r * r + d * d) / (2 * d), yi = Math.sqrt(Math.max(0, R * R - xi * xi)), ti = Math.atan2(yi, xi), fi = Math.atan2(yi, xi - d), p = [];
      for (let i = 0; i <= 48; i++) { const t = ti + (TAU - 2 * ti) * i / 48; p.push([R * Math.cos(t), R * Math.sin(t)]); }
      for (let i = 0; i <= 40; i++) { const t = (TAU - fi) - (TAU - 2 * fi) * i / 40; p.push([d + r * Math.cos(t), r * Math.sin(t)]); } return [rot(p, -.5)]; },
    arch: () => { const a = (w, top, bot) => { const p = [[w, bot], [-w, bot]]; for (let i = 0; i <= 30; i++) { const t = Math.PI + Math.PI * i / 30; p.push([w * Math.cos(t), top + w + w * Math.sin(t)]); } return p; };
      return [a(.62, -.9, .95), a(.44, -.68, .95).reverse().map(([x, y]) => [x, y === .95 ? .8 : y]), circ(0, .32, .16, 32)]; },
    bowl: () => { const b = []; for (let i = 0; i <= 30; i++) { const t = Math.PI * i / 30; b.push([.78 * Math.cos(t), .05 + .62 * Math.sin(t)]); } b.push([-.85, .05], [.85, .05]);
      return [b, bar(-.1, -.12, .55, -.95, .09), bar(.12, -.12, .8, -.82, .09)]; },
    flame: () => [drop(0, 0, .95), drop(0, .32, .45).reverse()],
    drop: () => [drop(0, .05, .95)],
    leaf: () => { const half = side => { const q = []; for (let i = 0; i <= 30; i++) { const t = Math.PI * i / 30; q.push([side * (.05 + .46 * Math.pow(Math.sin(t), 1.35) * (1 + .18 * Math.cos(t))), -.8 * Math.cos(t) - .12]); } q.push([side * .05, .68]); q.push([side * .05, -.92]); return q; }; return [rot(half(-1), .55), rot(half(1), .55), rot(rect(-.035, .64, .035, .98), .55)]; },
    glass: () => [[[-.42, -.55], [.42, -.55], [.32, .95], [-.32, .95]], bar(.08, -.66, .42, -1.02, .08), circ(-.08, .55, .09, 24).reverse(), circ(.12, .3, .07, 24).reverse()],
    drop2: () => [drop(0, 0, .95)],
    wave: () => [-.5, 0, .5].map(y => band(-.9, .9, y, .17, .12, 3)),
    petal: () => { const out = [circ(0, 0, .2, 36)]; for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + TAU * k / 5; out.push(ell(.6 * Math.cos(a), .6 * Math.sin(a), .2, .36, a + Math.PI / 2)); } return out; },
    comb: () => { const out = [rrect(-.82, -.6, .82, -.32, .1)]; for (let i = 0; i < 9; i++) { const x = -.72 + i * .18; out.push(rrect(x - .045, -.24, x + .045, .6, .04, 4)); } return out; },
    plus: () => [chaikin([[-.22, -.85], [.22, -.85], [.22, -.22], [.85, -.22], [.85, .22], [.22, .22], [.22, .85], [-.22, .85], [-.22, .22], [-.85, .22], [-.85, -.22], [-.22, -.22]], 1)],
    tooth: () => [chaikin([[-.6, -.35], [-.45, -.72], [-.2, -.78], [0, -.62], [.2, -.78], [.45, -.72], [.6, -.35], [.52, .05], [.42, .75], [.25, .84], [.14, .4], [0, .28], [-.14, .4], [-.25, .84], [-.42, .75], [-.52, .05]], 3)],
    plate: () => { const out = [circ(0, 0, .88, 72), circ(0, 0, .26, 40).reverse()]; for (let k = 0; k < 6; k++) { const a = TAU * k / 6 + .26; out.push(rot(rrect(-.07, -.13, .07, .13, .05, 4), a + Math.PI / 2).map(([x, y]) => [x + .58 * Math.cos(a), y + .58 * Math.sin(a)]).reverse()); } return out; },
    bolt: () => [[[.18, -1], [-.58, .12], [-.06, .12], [-.22, 1], [.58, -.16], [.06, -.16]]],
    arrow: () => [[[-.75, -.7], [-.35, -.7], [.1, 0], [-.35, .7], [-.75, .7], [-.3, 0]], [[-.05, -.7], [.35, -.7], [.8, 0], [.35, .7], [-.05, .7], [.4, 0]]],
    check: () => { const out = [], s = .23, p = .52; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if ((i + j + 2) % 2 === 0) out.push(rect(i * p - s, j * p - s, i * p + s, j * p + s)); return out; },
    gem: () => [[[-.8, -.2], [-.5, -.6], [-.22, -.6], [-.32, -.2]], [[-.24, -.2], [-.14, -.6], [.14, -.6], [.24, -.2]], [[.32, -.2], [.22, -.6], [.5, -.6], [.8, -.2]], [[-.8, -.12], [.8, -.12], [0, .92]]],
    key: () => [circ(0, -.5, .4, 48), circ(0, -.5, .18, 32).reverse(), [[-.07, -.05], [.07, -.05], [.07, .5], [.34, .5], [.34, .62], [.07, .62], [.07, .72], [.28, .72], [.28, .84], [.07, .84], [.07, .95], [-.07, .95]]],
    tower: () => { const out = [rrect(-.34, -.95, .34, .95, .05, 4)]; for (let i = 0; i < 5; i++) { const y0 = -.8 + i * .34, x0 = i % 2 ? -.24 : .04; out.push(rect(x0, y0, x0 + .2, y0 + .2).reverse()); } return out; },
    window: () => { const s = .36, g = .08; return [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => rrect(i > 0 ? g : -g - 2 * s, j > 0 ? g : -g - 2 * s, i > 0 ? g + 2 * s : -g, j > 0 ? g + 2 * s : -g, .1)); },
    book: () => [[[-.92, -.48], [-.06, -.32], [-.06, .68], [-.92, .52]], [[.92, -.48], [.06, -.32], [.06, .68], [.92, .52]]],
    sprout: () => [rect(-.04, -.05, .04, .95), rot(leafHalf(-1, 0, .3).map(([x, y]) => [x * .9, y * .5]), -1.0).map(([x, y]) => [x - .38, y - .3]), rot(leafHalf(1, 0, .3).map(([x, y]) => [x * .9, y * .5]), 1.0).map(([x, y]) => [x + .38, y - .42])],
    paw: () => [ell(0, .38, .42, .34), ell(-.58, -.12, .15, .21, -.4), ell(-.2, -.5, .15, .21, -.12), ell(.2, -.5, .15, .21, .12), ell(.58, -.12, .15, .21, .4)],
    node: () => { const v = [0, 1, 2].map(k => { const a = -Math.PI / 2 + TAU * k / 3; return [.66 * Math.cos(a), .66 * Math.sin(a)]; }); const out = v.map(([x, y]) => circ(x, y, .2, 32));
      for (let k = 0; k < 3; k++) { const [a, b] = [v[k], v[(k + 1) % 3]], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), u = [dx / L, dy / L]; out.push(bar(a[0] + u[0] * .3, a[1] + u[1] * .3, b[0] - u[0] * .3, b[1] - u[1] * .3, .07)); } return out; },
    basket: () => { const body = [[-.85, 0], [.85, 0], [.62, .8], [-.62, .8]]; const h = []; for (let i = 0; i <= 30; i++) { const t = Math.PI + Math.PI * i / 30; h.push([.64 * Math.cos(t), -.08 + .64 * Math.sin(t)]); }
      for (let i = 30; i >= 0; i--) { const t = Math.PI + Math.PI * i / 30; h.push([.5 * Math.cos(t), -.08 + .5 * Math.sin(t)]); } return [body, h, rrect(-.6, .22, .6, .3, .04, 3).reverse(), rrect(-.55, .46, .55, .54, .04, 3).reverse()]; }
  };

  /* containers in the 100 box */
  const C = {
    circle: () => ({ outer: circ(50, 50, 46, 96), c: [50, 50], k: 25 }),
    roundsq: () => ({ outer: rrect(6, 6, 94, 94, 18), c: [50, 50], k: 27 }),
    arch: () => { const p = [[88, 95], [12, 95]]; for (let i = 0; i <= 40; i++) { const t = Math.PI + Math.PI * i / 40; p.push([50 + 38 * Math.cos(t), 43 + 38 * Math.sin(t)]); } return { outer: p, c: [50, 56], k: 24 }; },
    tag: () => ({ outer: [[50, 2], [86, 22], [86, 96], [14, 96], [14, 22]].map(([x, y]) => [x, y]), hole: circ(50, 20, 5, 28).reverse(), c: [50, 62], k: 22 }),
    seal: () => { const p = []; for (let i = 0; i < 144; i++) { const a = TAU * i / 144, r = 44 + 2.6 * Math.cos(18 * a); p.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]); } return { outer: p, c: [50, 50], k: 23 }; },
    shield: () => ({ outer: chaikin([[10, 8], [90, 8], [90, 52], [50, 96], [10, 52]], 2), c: [50, 44], k: 23 })
  };
  const shrink = (pts, c, f) => pts.map(([x, y]) => [c[0] + (x - c[0]) * f, c[1] + (y - c[1]) * f]);
  const toD = polys => polys.map(p => 'M' + p.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z').join('');

  /* build: motif + container + style → { d, motif, container, style } */
  function build(motif, container, style) {
    const m = (M[motif] || M.spark)();
    if (container === 'none' || style === 'solo') { const polys = m.map(p => p.map(([x, y]) => [50 + x * 42, 50 + y * 42])); return { d: toD(polys), motif, container: 'none', style: 'solo' }; }
    const box = C[container]();
    if (style === 'ring' && container !== 'tag') {
      const inner = shrink(box.outer, box.c, .86).reverse(), k = box.k * .86;
      const polys = [box.outer, inner, ...m.map(p => p.map(([x, y]) => [box.c[0] + x * k, box.c[1] + y * k]))];
      return { d: toD(polys), motif, container, style: 'ring' };
    }
    const polys = [box.outer]; if (box.hole) polys.push(box.hole);
    m.forEach(p => polys.push(p.map(([x, y]) => [box.c[0] + x * box.k, box.c[1] + y * box.k])));
    return { d: toD(polys), motif, container, style: 'knock' };
  }
  return { build, motifs: Object.keys(M), containers: Object.keys(C) };
})();
