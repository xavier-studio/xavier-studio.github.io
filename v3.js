/* Xavier Studio v3 · one page (work + studio). Anime.js 3 for motion; everything readable without JS. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const A = typeof window.anime === 'function';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubicBezier(.22,.61,.36,1)';
  const WA = 'https://wa.me/60125272682?text=';
  const root = document.documentElement; root.classList.remove('no-js'); root.classList.add('js'); if (RM) root.classList.add('rm');

  /* ---------------- language ---------------- */
  const T = {
    'meta.title': ['Xavier Studio · Brand, product, film and print', 'Xavier Studio · 品牌、产品、影片与印刷'],
    'meta.desc': ['A three-person studio for brand, product visuals, film and print. AI where it is faster, craft where it counts. English and 中文.', '三人工作室，做品牌、产品视觉、影片与印刷。能用 AI 更快的地方用 AI，需要手艺的地方靠手艺。中英双语。'],
    'wa.hi': ['Hi Xavier Studio, I would like to talk about a project.', '你好 Xavier Studio，我想聊聊一个项目。'],
    'wa.wsq': ['Hi Xavier Studio, about the AI workshop: ', '你好 Xavier Studio，关于 AI 工作坊：'],
    'wa.ws': ['Hi Xavier Studio, I would like to ask about the AI workshop. Team size: ', '你好 Xavier Studio，我想了解 AI 工作坊。团队人数：'],
    'nav.work': ['Work', '作品'], 'nav.studio': ['Studio', '工作室'], 'nav.wa': ['WhatsApp', 'WhatsApp'],
    'intro.h': ['We direct the AI.<br>You get the <em>brand.</em>', '我们驾驭 AI，<br>你得到<em>品牌。</em>'],
    'intro.p': ['Brand, product, film and print, made by a three-person studio. AI where it is faster, craft where it counts.', '品牌、产品、影片与印刷，由三人工作室完成。能用 AI 更快的地方用 AI，需要手艺的地方靠手艺。'],
    'f.feat': ['Featured', '精选'], 'f.all': ['All', '全部'], 'more.btn': ['See {n} more projects', '再看 {n} 个项目'], 'f.brand': ['Brand', '品牌'], 'f.product': ['Product & campaign', '产品与广告'], 'f.film': ['Film & music', '影片与音乐'], 'f.print': ['Posters & print', '海报与印刷'],
    'feat.h': ['Selected work', '精选作品'], 'wall.h': ['More projects.', '更多项目。'], 'pieces': ['pieces', '件'],
    'wall.p': ['One tile per project. Click or tap any of them to see the full set.', '每格一个项目，点击即可查看全套作品。'],
    'empty': ['Nothing in this filter yet.', '这个分类暂时没有作品。'],
    'play': ['Film', '影片'], 'watch': ['Watch with sound', '打开声音观看'], 'case': ['Read the case', '查看案例'], 'client': ['Client', '客户'], 'close': ['Close', '关闭'],
    'motto': ['People set the direction.<br>AI sets the <em>pace.</em>', '人定方向，<br>AI <em>提速。</em>'],
    'lm.note': ['Logo motion, built in code by the studio', '标志动态，由工作室用代码制作'],
    'band.h': ['Have a project <em>in mind?</em>', '有项目<em>想聊聊？</em>'],
    'band.p': ['Tell us what you sell and who buys it. We reply the same day, usually with a first idea.', '告诉我们你卖什么、卖给谁。我们当天回复，通常会附上第一个想法。'],
    'proof.q': ['“Tq so much able to help me rush in last min.”', '“Tq so much able to help me rush in last min.”<br><small>译：谢谢你在最后关头帮我赶出来。</small>'],
    'proof.by': ['Suvana, handbag label · delivered in one day', 'Suvana 手袋品牌 · 一天交付'],
    'th.k': ['On Threads', 'Threads 上的留言'],
    'th.q1': ['“I was looking something like this!”', '“I was looking something like this!”'],
    'th.c1': ['A Threads user looking for a housing-launch video, about our <a href="#laman-senja">Laman Senja teaser</a>', '<span class="th-tr">译：我正在找这样的东西！</span>一位在找楼盘宣传片的 Threads 用户，看了我们的 <a href="#laman-senja">Laman Senja 预告</a>'],
    'th.q2': ['“Coffee, toast and the receipt on one table: it feels like breakfast just arrived. The concept has everyday warmth straight away.”', '“咖啡、吐司和小票放在同一張桌面上，很有一份早餐剛端上來的感覺。這個品牌概念一下就有了日常的溫度。”'],
    'th.c2': ['<span class="th-tr">Translated from Chinese</span>A reader, about our <a href="#tiga-sudu">Tiga Sudu film</a>', '一位读者，看了我们的 <a href="#tiga-sudu">Tiga Sudu 短片</a>'],
    'band.btn': ['Message us on WhatsApp', '在 WhatsApp 联系我们'], 'band.mail': ['or email xavierstudio666@gmail.com', '或发邮件至 xavierstudio666@gmail.com'],
    'foot.c': ['© 2026 Xavier Studio', '© 2026 Xavier Studio'],
    's.cap': ['The studio', '工作室'],
    'sf.k1': ['Team', '团队'], 'sf.v1': ['Three people', '三个人'],
    'sf.k2': ['Languages', '语言'], 'sf.v2': ['English · 中文 · Malay · Cantonese', '英文 · 中文 · 马来文 · 粤语'],
    'sf.k3': ['Reply', '回复'], 'sf.v3': ['Same day, on WhatsApp', '当天回复，WhatsApp 联系'],
    'sf.k4': ['Files', '文件'], 'sf.v4': ['Print-ready and editable', '可直接印刷，也可编辑'],
    's.h': ['Three people. AI where it is faster, Adobe where it needs a <em>craftsman</em>, a story in every cut.', '三个人。<span class="nw">AI 让事情更快，</span><span class="nw">Adobe 交给<em>手艺人</em>，</span><span class="nw">每一个镜头都有故事。</span>'],
    's.p': ['Every piece on this site was made by the three of us. Melvin leads your project from first message to final file; Christopher and Mulder make sure nothing leaves the studio unfinished.', '网站上的每一件作品都出自我们三人之手。Melvin 从第一条讯息负责到最终文件，Christopher 与 Mulder 确保每件作品都完整出品。'],
    'p1.r': ['Founder · Creative Director, AI', '创始人 · 创意总监（AI）'],
    'p1.p': ['Directs the AI: product visuals, brand films and campaigns. Leads every client in English, 中文, Malay and Cantonese.', '主导 AI 创作：产品视觉、品牌影片与广告。以英语、中文、马来语与粤语对接每一位客户。'],
    'p2.r': ['Partner · Design', '合伙人 · 设计'],
    'p2.p': ['Traditional design in Adobe: logos, signage, print and layout, delivered with editable source files.', '以 Adobe 完成传统设计：标志、招牌、印刷与排版，交付可编辑的原始文件。'],
    'p3.r': ['Partner · Video & Story', '合伙人 · 影片与叙事'],
    'p3.p': ['Editing and storytelling: turns raw footage into reels and films with a beginning, a middle and an end.', '剪辑与叙事：把原始素材剪成有起承转合的短片与影片。'],
    'make.h': ['Six things, done properly.', '六件事，认真做好。'],
    'm1.h': ['Brand & identity', '品牌与识别'], 'm1.p': ['Names, logos, colour and type, packaging and the guidelines that hold it together.', '命名、标志、色彩与字体、包装，以及把一切统一起来的规范。'],
    'm2.h': ['Product & campaign visuals', '产品与广告视觉'], 'm2.p': ['AI product images, models and campaign visuals, checked against your real product.', 'AI 产品图像、模特与广告画面，并与你的实物逐一核对。'],
    'm3.h': ['Film, motion & music', '影片、动态与音乐'], 'm3.p': ['Brand films, reels, trailers, LED screens and original music, cut to the beat.', '品牌影片、短视频、预告、LED 屏幕影片与原创音乐，踩点剪辑。'],
    'm4.h': ['Posters, print & signage', '海报、印刷与招牌'], 'm4.p': ['Posters, menus, cards and shop signs, with print-ready Adobe files.', '海报、菜单、卡片与店铺招牌，附可直接印刷的 Adobe 文件。'],
    'm5.h': ['Websites', '网站'], 'm5.p': ['Landing pages and site fixes, built to load quickly and make it easy to message you.', '着陆页与网站修整：加载快，访客容易联系你。'],
    'm6.h': ['AI training for teams', '团队 AI 培训'], 'm6.p': ['Hands-on online workshops in the tools we use every day.', '用我们每天在用的工具，带你的团队上手的线上实操课。'],
    'see': ['See the work', '看作品'], 'talk': ['Ask us', '问我们'],
    'how.h': ['Four steps.', '四个步骤。'],
    'st1.h': ['Message us', '联系我们'], 'st1.p': ['WhatsApp or email. Tell us the product, the audience and the deadline.', 'WhatsApp 或邮件，告诉我们产品、受众与期限。'],
    'st2.h': ['We show you the direction', '先让你看到方向'], 'st2.p': ['Depending on the job, a short sample or a written plan, so you see where it is going before you commit.', '视项目而定，先给你一个小样或一份书面方案，确定之前先看到方向。'],
    'st3.h': ['A quote built around your budget', '按预算报价'], 'st3.p': ['A clear quote in your currency, with what is included and what is not.', '以你的货币清楚报价，列明包含与不包含的内容。'],
    'st4.h': ['Build and hand over', '制作与交付'], 'st4.p': ['We agree the terms with you, then build, revise and hand over final files, ready to post, print or publish.', '与你确认合作条款后开工，修改完成后交付最终文件，可直接发布或印刷。'],
    'tr.h': ['AI video and image workshops for teams', '团队 AI 影片与图像工作坊'],
    'tr.p': ['Live online and hands-on, shaped around what your team wants to learn. AI makes the work faster; the ideas and the final call stay with your people. You direct the AI; it does not decide for you.', '线上直播，实操为主，内容按团队想学的来定。AI 让工作更快更省力，但创意和最后的决定仍在人手上：你驾驭 AI，不是 AI 替你做决定。'],
    'tr.lead': ['Teams often ask', '团队常问'],
    'tr.meta': ['Scheduled around your team · English or 中文 · Team or public classes', '时间按团队安排 · 英语或中文 · 团队包班或公开班'],
    'tr.l1': ['How do we edit videos with AI?', '怎么用 AI 剪辑影片？'],
    'tr.l2': ['How do we make product images with AI?', '怎么用 AI 做产品图片？'],
    'tr.l3': ['Why do our AI images look fake, and how do we fix it?', '为什么我们的 AI 图片看起来很假、AI 味很重？怎么改？'],
    'tr.l4': ['How do we keep our product looking the same in every image?', '怎么让产品在每张图片里都保持一致？'],
    'see.ws': ['See the workshop', '看工作坊'],
    'tr.btn': ['Ask about a workshop', '咨询工作坊']
  };
  /* three languages: en · zh (简体) · tw (繁體). Traditional text comes from tw.js, generated by _tw.py from the Simplified text */
  const TW = window.XS_TW || { t: {}, w: {} };
  let L = 'en';
  try {
    const s = localStorage.getItem('xs-lang'), n = (navigator.language || '').toLowerCase();
    L = ['en', 'zh', 'tw'].includes(s) ? s : /^zh-(tw|hk|mo|hant)/.test(n) ? 'tw' : n.startsWith('zh') ? 'zh' : 'en';
  } catch (e) {}
  const t = k => { const v = T[k]; if (!v) return ''; if (L === 'tw') return TW.t[k] != null ? TW.t[k] : v[1]; return v[L === 'zh' ? 1 : 0]; };
  function applyLang() {
    root.lang = L === 'zh' ? 'zh-Hans' : L === 'tw' ? 'zh-Hant' : 'en';
    document.title = t('meta.title');
    const md = $('meta[name=description]'); if (md) md.content = t('meta.desc');
    $$('[data-t]').forEach(el => { el.innerHTML = t(el.dataset.t); });
    $$('.lang [data-l]').forEach(b => { const on = b.dataset.l === L; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    $$('[data-wa]').forEach(a => { const w = a.dataset.wa; a.href = WA + encodeURIComponent(/^tr\.l\d$/.test(w) ? t('wa.wsq') + t(w) : t(w === 'workshop' ? 'wa.ws' : 'wa.hi')); });
    if (window.WORKS && $('#feat')) render();
    document.dispatchEvent(new CustomEvent('xs:lang', { detail: L }));
  }
  $$('.lang [data-l]').forEach(b => b.addEventListener('click', () => { L = b.dataset.l; try { localStorage.setItem('xs-lang', L); } catch (e) {} applyLang(); }));

  /* ---------------- nav ---------------- */
  const nav = $('#nav'); const solid = () => nav && nav.classList.toggle('solid', scrollY > 30); addEventListener('scroll', solid, { passive: true }); solid();

  /* ---------------- media helpers ---------------- */
  const P = it => it.k === 'f' ? { loop: `assets/films/${it.s}-loop.mp4`, poster: `assets/films/${it.s}.webp`, full: `assets/films/${it.s}.mp4` }
    : it.k === 'v' ? { loop: `assets/${it.s}-loop.mp4`, poster: `assets/${it.s}.jpg`, full: it.f ? `assets/${it.s}.mp4` : `assets/${it.s}-loop.mp4` }
    : { img: `assets/${it.s}.webp`, sm: `assets/${it.s}-s.webp` };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  function mediaHTML(it, label, sizes) {
    const p = P(it);
    const d = (window.DIMS || {})[it.k === 'f' ? 'films/' + it.s : it.s], st = [d ? `aspect-ratio:${d[0]}/${d[1]}` : '', it.pos ? `object-position:${it.pos}` : ''].filter(Boolean).join(';'),
      wh = (d ? ` width="${d[0]}" height="${d[1]}"` : '') + (st ? ` style="${st}"` : '');
    if (it.k === 'i') return `<img src="${p.sm}"${wh} srcset="${p.sm} 800w, ${p.img} 1600w" sizes="${sizes}" alt="${esc(label)}" loading="lazy" decoding="async">`;
    return `<video muted playsinline loop preload="none"${wh} poster="${p.poster}" data-src="${p.loop}" aria-label="${esc(label)}"></video>`;
  }
  const tw = (w, f) => (TW.w[w.id] && TW.w[w.id][f] != null) ? TW.w[w.id][f] : w[f];
  const name = w => L === 'zh' ? w.zh : L === 'tw' ? tw(w, 'zh') : w.name,
    type = w => L === 'zh' ? w.tzh : L === 'tw' ? tw(w, 'tzh') : w.type,
    line = w => L === 'zh' ? (w.lzh || '') : L === 'tw' ? (tw(w, 'lzh') || '') : (w.line || '');
  const label = w => `${name(w)} · ${type(w)}`;

  /* ---------------- work: featured cases + one archive tile per project ---------------- */
  const WORKS = (window.WORKS || []).filter(w => !w.hide);
  /* default view = the 8 featured cases only (short page); "All" opens the archive */
  let filter = 'featured', firstRender = true;
  const FILTERS = ['featured', 'all', 'brand', 'product', 'film', 'print'];
  const CHRIS = (window.WORKS_CHRIS || []).filter(c => c.ok).map(c => ({ id: 'chris-' + c.s, name: c.name, zh: c.zh, type: c.type, tzh: c.tzh, cat: c.cat, items: [{ k: 'i', s: 'v3/chris/' + c.s }] }));
  const hasFilm = w => w.items.some(it => it.k !== 'i');
  /* film is read from the items, so a still never counts as film */
  const cats = w => [...(w.cat || []).filter(c => c !== 'film'), ...(hasFilm(w) ? ['film'] : [])];
  const match = w => filter === 'all' || filter === 'featured' || cats(w).includes(filter);
  const coverIdx = w => { if (filter === 'film') { const i = w.items.findIndex(it => it.k !== 'i'); if (i >= 0) return i; } return w.feat ? 0 : (w.cover || 0); };
  function archive() { /* one Chris piece after every second studio project, so his work runs through the archive */
    const rest = WORKS.filter(w => !w.feat), out = []; let c = 0;
    rest.forEach((w, i) => { out.push(w); if (i % 2 === 1 && CHRIS[c]) out.push(CHRIS[c++]); });
    while (CHRIS[c]) out.push(CHRIS[c++]);
    return out;
  }
  function render() {
    const F = $('#feat'), W = $('#wall'); if (!F) return;
    const feats = WORKS.filter(w => w.feat && match(w)), arch = filter === 'featured' ? [] : archive().filter(match);
    F.innerHTML = feats.map(w => {
      const ci = coverIdx(w), it = w.items[ci], vid = it.k !== 'i';
      return `<button class="card" type="button" data-p="${w.id}" data-i="${ci}">
        <div class="card__media">${mediaHTML(it, label(w), '(max-width:900px) 100vw, 50vw')}${vid ? `<span class="card__play">▶ ${t('play')}</span>` : ''}</div>
        <div class="card__cap"><span class="card__t">${name(w)}</span><span class="card__type">${w.client ? `<span class="card__c">${t('client')}</span> · ` : ''}${type(w)}</span><span class="card__l">${line(w)}</span></div></button>`;
    }).join('');
    W.innerHTML = arch.map(w => {
      const ci = coverIdx(w), it = w.items[ci], n = w.items.length;
      return `<button class="tile" type="button" data-p="${w.id}" data-i="${ci}">
        <span class="tile__m">${mediaHTML(it, label(w), '(max-width:900px) 50vw, 33vw')}${it.k !== 'i' ? `<span class="tile__vid">▶ ${t('play')}</span>` : ''}</span>
        <span class="tile__cap"><b>${name(w)}</b><i>${type(w)}${n > 1 ? ` · ${n} ${t('pieces')}` : ''}</i></span></button>`;
    }).join('');
    F.classList.toggle('filtered', filter !== 'all' && filter !== 'featured');
    const wl = $('.wall'); if (wl) wl.classList.toggle('is-closed', filter === 'featured');
    const more = $('#wall-more'); if (more) { more.hidden = filter !== 'featured'; const mb = more.querySelector('button'); mb.textContent = t('more.btn').replace('{n}', archive().length); mb.onclick = () => setFilter('all'); }
    $('#empty').classList.toggle('hide', feats.length + arch.length > 0);
    $$('.chip').forEach(c => {
      const f = c.dataset.f; c.setAttribute('aria-pressed', f === filter);
      const k = f === 'featured' ? WORKS.filter(w => w.feat).length : [...WORKS, ...CHRIS].filter(w => f === 'all' || cats(w).includes(f)).length;
      const sp = c.querySelector('span'); if (sp) sp.textContent = k;
    });
    $$('[data-p]').forEach(b => b.onclick = () => open(b.dataset.p, b.dataset.i));
    observeVideos();
    if (firstRender) { firstRender = false; cardsIn(); } else $$('#feat .card').forEach(c => c.classList.remove('pre'));
  }
  function setFilter(f, scroll) {
    filter = f; render();
    try { history.replaceState(null, '', f === 'featured' ? location.pathname : '#' + f); } catch (e) {}
    if (scroll) { const w = $('#work'); if (w) w.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }
  }
  $$('.chip').forEach(c => c.addEventListener('click', () => setFilter(c.dataset.f)));
  addEventListener('hashchange', () => { const h = location.hash.slice(1); if (FILTERS.includes(h)) setFilter(h, true); else if (find(h)) open(h); });
  const hf = (location.hash || '').slice(1); if (FILTERS.includes(hf)) filter = hf;

  /* videos play only while on screen */
  let vio;
  function observeVideos() {
    if (RM || !('IntersectionObserver' in window)) return;
    vio = vio || new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); }), { threshold: .3 });
    $$('#feat video, #wall video').forEach(v => vio.observe(v));
  }

  /* ---------------- lightbox (focus stays inside while open) ---------------- */
  const LB = $('#lb'); let cur = null, idx = 0, lastFocus = null;
  function find(id) { return id ? (WORKS.find(w => w.id === id) || CHRIS.find(w => w.id === id)) : null; }
  function show() {
    const it = cur.items[idx], p = P(it), st = $('#lb-stage');
    st.querySelectorAll('img,video').forEach(e => e.remove());
    let el;
    if (it.k === 'i') { el = new Image(); el.src = p.img; el.alt = label(cur); }
    else { el = document.createElement('video'); el.src = p.full; el.poster = p.poster; el.controls = true; el.playsInline = true; el.autoplay = true; el.setAttribute('aria-label', label(cur)); }
    st.prepend(el);
    $('#lb-title').textContent = name(cur); $('#lb-type').textContent = type(cur);
    $('#lb-line').textContent = line(cur);
    $('#lb-count').textContent = `${idx + 1} / ${cur.items.length}`;
    $('#lb-case').classList.toggle('hide', !cur.url); if (cur.url) $('#lb-case').href = cur.url;
    $$('.lb__nav').forEach(b => b.classList.toggle('hide', cur.items.length < 2));
    if (A && !RM) anime({ targets: el, opacity: [0, 1], duration: 380, easing: EASE });
  }
  function open(id, i) {
    cur = find(id); if (!cur) return; idx = i == null ? coverIdx(cur) : +i || 0;
    if (!LB.classList.contains('open')) lastFocus = document.activeElement;
    LB.classList.add('open'); document.body.style.overflow = 'hidden'; show(); $('#lb-x').focus();
  }
  function close() { LB.classList.remove('open'); document.body.style.overflow = ''; $('#lb-stage').querySelectorAll('video').forEach(v => v.pause()); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function step(d) { idx = (idx + d + cur.items.length) % cur.items.length; show(); }
  if (LB) {
    $('#lb-x').addEventListener('click', close);
    $('.lb__prev').addEventListener('click', () => step(-1)); $('.lb__next').addEventListener('click', () => step(1));
    addEventListener('keydown', e => {
      if (!LB.classList.contains('open')) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        const f = [...LB.querySelectorAll('button, a[href], video[controls]')].filter(x => !x.closest('.hide') && x.offsetParent !== null);
        if (!f.length) return; const a = f[0], z = f[f.length - 1];
        if (!LB.contains(document.activeElement)) { e.preventDefault(); a.focus(); }
        else if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    let x0 = null; LB.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
    LB.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; });
  }

  /* ---------------- motion ----------------
     Content is visible by default; JS only hides what it is about to animate (class "pre").
     Featured cases: the picture opens like a shutter, then the caption settles (one at a time, as each arrives).
     Studio statement, team and contact headline: a short fade-up. Everything else stays still. */
  const canAnimate = A && !RM && 'IntersectionObserver' in window;
  function watch(els, play) {
    if (!canAnimate) { els.forEach(el => el.classList.remove('pre')); return; }
    els.forEach(el => el.classList.add('pre'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); play(e.target); }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
    setTimeout(() => els.forEach(el => { if (el.classList.contains('pre') && el.getBoundingClientRect().top < innerHeight) el.classList.remove('pre'); }), 4000);
  }
  function cardsIn() {
    watch($$('#feat .card'), card => {
      const m = card.querySelector('.card__media'), media = m.querySelector('img,video'), cap = card.querySelector('.card__cap');
      card.classList.remove('pre');
      anime.timeline({ easing: 'cubicBezier(.16,1,.3,1)' })
        .add({ targets: m, clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'], duration: 1000 })
        .add({ targets: media, scale: [1.08, 1], duration: 1400, complete: () => { media.style.transform = ''; } }, 0)
        .add({ targets: cap, opacity: [0, 1], translateY: [10, 0], duration: 600, complete: () => { cap.style.transform = ''; } }, 450);
    });
  }
  function reveal() {
    watch($$('.rv'), el => { el.classList.remove('pre'); anime({ targets: el, opacity: [0, 1], translateY: [18, 0], duration: 700, easing: EASE, complete: () => { el.style.transform = ''; } }); });
  }

  /* ---------------- intro: loader once per session, under 0.6 s ---------------- */
  function heroIn() {
    if (!canAnimate) return;
    anime({ targets: $$('.hero-rv'), opacity: [0, 1], translateY: [22, 0], duration: 800, delay: anime.stagger(90), easing: EASE });
  }
  const loader = $('#loader');
  function boot() {
    applyLang(); reveal();
    let seen = false; try { seen = !!sessionStorage.getItem('xs-intro'); sessionStorage.setItem('xs-intro', '1'); } catch (e) {}
    const h = (location.hash || '').slice(1); if (find(h)) setTimeout(() => open(h), 50);
    if (!loader) return;
    if (seen || !A || RM) { loader.remove(); return; }
    const t0 = performance.now(), MIN = 350, CAP = 600;
    anime({ targets: '#loader .loader__bar i', scaleX: [0, 1], duration: 500, easing: 'easeOutQuad' });
    let done = false;
    const go = () => { if (done) return; done = true; heroIn(); anime({ targets: loader, opacity: [1, 0], duration: 300, easing: EASE, complete: () => loader.remove() }); };
    const ready = () => setTimeout(go, Math.max(0, MIN - (performance.now() - t0)));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
    setTimeout(go, CAP);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
