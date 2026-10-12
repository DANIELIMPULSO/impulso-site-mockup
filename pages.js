// Páginas internas do mockup (Clientes, Projetos autorais, Capacitação).
// Cada bloco só roda se a página tiver o elemento correspondente.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const p2 = n => String(n).padStart(2, '0');
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Título da abertura: letras separadas para reagirem ao mouse ----------
$$('.p-title span').forEach(s => {
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = [...s.textContent].map(c => '<i>' + c + '</i>').join('');
});

// ---------- Clientes: depoimentos ----------
const stage = $('#voice-stage');
if (stage) {
  const voices = $$('.voice', stage);
  const list = $('#voice-list');
  const count = $('#voice-count');
  const DUR = 7000; // tempo de cada depoimento
  stage.style.setProperty('--dur', DUR + 'ms');
  let cur = 0, timer = null;

  const tabs = voices.map((v, k) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<b></b><strong></strong><small></small>';
    b.children[0].textContent = p2(k + 1);
    b.children[1].textContent = v.dataset.nome;
    b.children[2].textContent = v.dataset.emp.split(' · ')[0];
    b.addEventListener('click', () => go(k));
    li.append(b);
    list.append(li);
    return b;
  });

  function go(k) {
    cur = (k + voices.length) % voices.length;
    voices.forEach((v, i) => v.classList.toggle('on', i === cur));
    tabs.forEach((b, i) => b.setAttribute('aria-current', i === cur));
    count.textContent = p2(cur + 1) + ' / ' + p2(voices.length);
    // reinicia a barra de tempo e o avanço automático
    stage.classList.remove('run');
    clearTimeout(timer);
    if (calm) return;
    void stage.offsetWidth;
    stage.classList.add('run');
    timer = setTimeout(() => go(cur + 1), DUR);
  }
  // O avanço para enquanto o mouse está sobre o depoimento e recomeça quando ele sai
  stage.addEventListener('mouseenter', () => clearTimeout(timer));
  stage.addEventListener('mouseleave', () => { if (!calm) go(cur); });
  $$('.voice-nav button').forEach(b => b.addEventListener('click', () => go(cur + Number(b.dataset.dir))));
  go(0);
}

// ---------- Clientes: foco de luz que acompanha o mouse sobre a parede de marcas ----------
const wall = $('#wall');
if (wall && finePointer) {
  wall.addEventListener('mousemove', e => {
    const r = wall.getBoundingClientRect();
    wall.style.setProperty('--wx', (e.clientX - r.left) + 'px');
    wall.style.setProperty('--wy', (e.clientY - r.top) + 'px');
  }, { passive: true });
  wall.addEventListener('mouseleave', () => { wall.style.removeProperty('--wx'); wall.style.removeProperty('--wy'); });
}
$$('.wall li').forEach((li, k) => { li.style.transitionDelay = (k % 6) * 50 + 'ms'; });

// ---------- Autorais: filtro e cartazes que inclinam com o mouse ----------
$$('.filters[data-filter]').forEach(group => {
  const grid = $(group.dataset.filter);
  const items = $$('[data-cat]', grid);
  const more = $('[data-more="' + group.dataset.filter + '"]');
  const PAGE = Number(grid.dataset.page) || 0; // 0 = mostra tudo
  let filtro = 'todos', limite = PAGE || Infinity;
  function aplicar() {
    let vistos = 0, total = 0;
    items.forEach(c => {
      const ok = filtro === 'todos' || c.dataset.cat.split('|').includes(filtro);
      if (ok) total++;
      c.hidden = !ok || ++vistos > limite;
      if (!c.hidden) c.classList.add('in');
    });
    if (more) more.hidden = total <= limite;
  }
  $$('button', group).forEach(b => b.addEventListener('click', () => {
    $$('button', group).forEach(x => x.setAttribute('aria-pressed', x === b));
    filtro = b.dataset.f;
    limite = PAGE || Infinity;
    aplicar();
  }));
  if (more) more.addEventListener('click', () => { limite += PAGE; aplicar(); });
  if (PAGE) aplicar();
});
$$('.poster').forEach((p, k) => {
  p.style.transitionDelay = (k % 4) * 80 + 'ms';
  if (!finePointer || calm) return;
  const art = $('.poster-art', p);
  p.addEventListener('mousemove', e => {
    const r = art.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    art.style.setProperty('--ry', ((x - .5) * 14).toFixed(2) + 'deg');
    art.style.setProperty('--rx', ((.5 - y) * 10).toFixed(2) + 'deg');
    art.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
    art.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
  }, { passive: true });
  p.addEventListener('mouseleave', () => ['--rx', '--ry'].forEach(v => art.style.removeProperty(v)));
});

// ---------- Capacitação: fotos que ampliam ----------
const box = $('#lightbox');
$$('[data-full]').forEach(b => b.addEventListener('click', () => { $('img', box).src = b.dataset.full; box.showModal(); }));
box.addEventListener('click', () => box.close());
const mosaics = $$('.mosaic');
$$('.shots li').forEach((li, k) => { li.style.transitionDelay = (k % 4) * 80 + 'ms'; });
$$('.grid-3 > *, .related > *, .posts.all > *').forEach((el, k) => { el.style.transitionDelay = (k % 3) * 90 + 'ms'; });

// ---------- Player: o vídeo só é carregado quando a pessoa aperta o play ----------
$$('.player[data-embed]').forEach(player => {
  const poster = $('.player-poster', player);
  if (!player.dataset.embed) return;
  poster.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = player.dataset.embed;
    f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    f.allowFullscreen = true;
    f.title = poster.getAttribute('aria-label') || 'Filme';
    player.replaceChildren(f);
  });
});

// ---------- Como funciona: etapas e linha do tempo guiadas pela rolagem ----------
const proc = $('#processo');
let updateProc = () => {};
if (proc) {
  const steps = $$('#proc-steps li');
  const num = $('#proc-num'), numSmall = $('#proc-n');
  const track = $('.tl-track', proc), head = $('.tl-head', proc);
  const clips = steps.map((li, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.innerHTML = '<b></b>';
    b.firstChild.textContent = p2(k + 1);
    b.append($('h3', li).textContent);
    b.addEventListener('click', () => scrollTo({ top: proc.offsetTop + (proc.offsetHeight - innerHeight) * ((k + .5) / steps.length), behavior: calm ? 'auto' : 'smooth' }));
    track.append(b);
    return b;
  });
  let active = -1;
  const setStep = k => {
    if (k === active) return;
    active = k;
    steps.forEach((li, i) => { li.classList.toggle('on', i === k); li.classList.toggle('past', i < k); });
    clips.forEach((b, i) => { b.classList.toggle('on', i === k); b.classList.toggle('done', i < k); });
    num.textContent = numSmall.textContent = p2(k + 1);
    num.classList.remove('flip');
    void num.offsetWidth;
    num.classList.add('flip');
  };
  updateProc = () => {
    const p = Math.max(0, Math.min(.9999, (scrollY - proc.offsetTop) / (proc.offsetHeight - innerHeight)));
    const pos = p * steps.length;
    setStep(Math.floor(pos));
    clips.forEach((b, i) => b.style.setProperty('--f', Math.max(0, Math.min(1, pos - i)).toFixed(3)));
    head.style.setProperty('--x', (p * track.offsetWidth).toFixed(1) + 'px');
  };
  addEventListener('resize', () => updateProc());
}

// ---------- Formulários (no mockup nada é enviado) ----------
$$('.steps-form').forEach(form => {
  const steps = $$('.step', form), bar = $$('.step-bar span', form);
  const back = $('[data-back]', form), next = $('[data-next]', form), send = $('[data-send]', form);
  let cur = 0;
  const show = k => {
    cur = k;
    steps.forEach((s, i) => s.classList.toggle('on', i === k));
    bar.forEach((s, i) => { s.classList.toggle('on', i === k); s.classList.toggle('done', i < k); });
    back.hidden = k === 0;
    next.hidden = k === steps.length - 1;
    send.hidden = k !== steps.length - 1;
  };
  next.addEventListener('click', () => {
    const invalido = $$('input, select, textarea', steps[cur]).find(el => !el.checkValidity());
    if (invalido) { invalido.reportValidity(); return; }
    show(cur + 1);
  });
  back.addEventListener('click', () => show(cur - 1));
  show(0);
});
$$('form').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const note = $('.form-note', form);
  if (note) note.textContent = 'Mockup: o formulário ainda não envia nada.';
}));

// ---------- Cabeçalho, menu e entrada dos blocos ----------
const header = $('.top');
const burger = $('.burger');
const menu = $('#menu');
burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
$$('.reveal').forEach(el => io.observe(el));

// ---------- Rolagem ----------
const hero = $('.p-hero');
let queued = false;
function onScroll() {
  queued = false;
  header.classList.toggle('scrolled', scrollY > 40);
  if (calm) return;
  root.style.setProperty('--p', (scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
  if (hero) hero.style.setProperty('--hs', Math.min(1, scrollY / hero.offsetHeight).toFixed(3));
  updateProc();
  mosaics.forEach(mosaic => {
    // deslocamento relativo ao centro da tela: as colunas se cruzam enquanto a galeria passa
    const r = mosaic.getBoundingClientRect();
    mosaic.style.setProperty('--sy', (((r.top + r.height / 2) - innerHeight / 2) * .12).toFixed(1));
  });
}
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// ---------- Timecode da abertura ----------
if (!calm && $('#tc')) {
  const tc = $('#tc');
  const t0 = performance.now();
  setInterval(() => {
    const f = Math.floor((performance.now() - t0) / (1000 / 24));
    tc.textContent = [Math.floor(f / 86400), Math.floor(f / 1440) % 60, Math.floor(f / 24) % 60, f % 24].map(p2).join(':');
  }, 1000 / 24);
}

// ---------- Mouse: cursor próprio, foco de luz da abertura e botões atraídos ----------
if (finePointer && !calm) {
  document.body.classList.add('has-cursor');
  const ring = $('.cursor');
  const dot = $('.dot');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const t = e.target.closest('[data-cursor], a, button');
    ring.classList.toggle('off', /IFRAME|INPUT|SELECT|TEXTAREA/.test(e.target.tagName));
    ring.classList.toggle('label', !!t && !!t.dataset.cursor);
    ring.classList.toggle('link', !!t && !t.dataset.cursor);
    ring.textContent = t && t.dataset.cursor ? t.dataset.cursor : '';
  }, { passive: true });
  (function follow() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  const shade = $('.p-shade');
  const letters = $$('.p-title i');
  if (hero) hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    shade.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    shade.style.setProperty('--my', (e.clientY - r.top) + 'px');
    letters.forEach(l => {
      const b = l.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (b.left + b.width / 2), (e.clientY - (b.top + b.height / 2)) * 1.4);
      l.style.setProperty('--k', (1 + .22 * Math.max(0, 1 - d / 220) ** 2).toFixed(3));
    });
  }, { passive: true });
  if (hero) hero.addEventListener('mouseleave', () => letters.forEach(l => l.style.removeProperty('--k')));

  $$('.case, .player-poster').forEach(card => {
    const img = $('img', card);
    if (!img) return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      img.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * -18 + 'px');
      img.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * -18 + 'px');
    }, { passive: true });
    card.addEventListener('mouseleave', () => { img.style.removeProperty('--px'); img.style.removeProperty('--py'); });
  });

  $$('.btn.solid, .cta').forEach(b => {
    b.classList.add('magnet');
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}
