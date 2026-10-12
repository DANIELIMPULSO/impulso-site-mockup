// Mockup da página de serviço (Vídeo institucional), com o conteúdo real da página atual
const UP = 'https://www.impulsofilmes.com.br/wp-content/uploads/';
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const p2 = n => String(n).padStart(2, '0');
const root = document.documentElement;

// ---------- Título da abertura: letras separadas para reagirem ao mouse ----------
document.querySelectorAll('.s-title span').forEach(s => {
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = [...s.textContent].map(c => '<i>' + c + '</i>').join('');
});

// ---------- Como funciona: etapas e linha do tempo guiadas pela rolagem ----------
const proc = document.getElementById('processo');
const steps = [...document.querySelectorAll('#proc-steps li')];
const num = document.getElementById('proc-num');
const numSmall = document.getElementById('proc-n');
const tl = document.getElementById('tl');
const track = tl.querySelector('.tl-track');
const head = tl.querySelector('.tl-head');

// Um "clipe" na linha do tempo para cada etapa
const clips = steps.map((li, k) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.tabIndex = -1;
  b.innerHTML = '<b></b>';
  b.firstChild.textContent = p2(k + 1);
  b.append(li.querySelector('h3').textContent);
  b.addEventListener('click', () => {
    const span = proc.offsetHeight - innerHeight;
    scrollTo({ top: proc.offsetTop + span * ((k + .5) / steps.length), behavior: calm ? 'auto' : 'smooth' });
  });
  track.append(b);
  return b;
});

let active = -1;
function setStep(k) {
  if (k === active) return;
  active = k;
  steps.forEach((li, i) => { li.classList.toggle('on', i === k); li.classList.toggle('past', i < k); });
  clips.forEach((b, i) => { b.classList.toggle('on', i === k); b.classList.toggle('done', i < k); });
  num.textContent = numSmall.textContent = p2(k + 1);
  num.classList.remove('flip');
  void num.offsetWidth;
  num.classList.add('flip');
}

function updateProc() {
  const span = proc.offsetHeight - innerHeight;
  const p = Math.max(0, Math.min(.9999, (scrollY - proc.offsetTop) / span));
  const pos = p * steps.length;
  setStep(Math.floor(pos));
  // Preenchimento de cada clipe e posição da agulha
  clips.forEach((b, i) => b.style.setProperty('--f', Math.max(0, Math.min(1, pos - i)).toFixed(3)));
  head.style.setProperty('--x', (p * track.offsetWidth).toFixed(1) + 'px');
}

// ---------- Portfólio da categoria ----------
const WORKS = [
  ['Camesa', '2024/04/Captura-de-tela-2024-04-19-141149.png'],
  ['Pet Farma', '2024/04/Captura-de-tela-2024-04-18-154314.png'],
  ['Frigorífico Saudali', '2023/12/Captura-de-tela-2024-05-29-105748.png'],
  ['Indústria Kerus', '2024/04/Captura-de-tela-2024-04-19-140657.png'],
  ['Plasc: 37 anos', '2023/12/v1.png'],
  ['Usina Jatiboca', '2023/12/v2.png'],
];
const grid = document.getElementById('grid');
WORKS.forEach(([nome, img], k) => {
  const a = document.createElement('a');
  a.className = 'case reveal';
  a.dataset.cursor = 'VER';
  a.href = 'case.html';
  a.style.transitionDelay = (k % 3) * 90 + 'ms';
  const im = new Image();
  im.loading = 'lazy';
  im.alt = '';
  im.src = UP + img;
  const info = document.createElement('div');
  info.className = 'case-info';
  info.innerHTML = '<span>Vídeo institucional</span><strong></strong>';
  info.children[1].textContent = nome;
  a.append(im, info);
  grid.append(a);
});

// ---------- Cabeçalho, menu e entrada dos blocos ----------
const header = document.querySelector('.top');
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Rolagem ----------
const hero = document.querySelector('.s-hero');
const cta = document.querySelector('.s-cta');
const outline = cta.querySelector('.outline');
let queued = false;
function onScroll() {
  queued = false;
  header.classList.toggle('scrolled', scrollY > 40);
  if (calm) return;
  updateProc();
  root.style.setProperty('--p', (scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
  hero.style.setProperty('--hs', Math.min(1, scrollY / hero.offsetHeight).toFixed(3));
  const r = cta.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) outline?.style.setProperty('--ox', ((r.top - innerHeight * .3) * .14).toFixed(1));
}
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
if (!calm) setStep(0);
onScroll();

// ---------- Timecode da abertura ----------
if (!calm) {
  const tc = document.getElementById('tc');
  const t0 = performance.now();
  setInterval(() => {
    const f = Math.floor((performance.now() - t0) / (1000 / 24));
    tc.textContent = [Math.floor(f / 86400), Math.floor(f / 1440) % 60, Math.floor(f / 24) % 60, f % 24].map(p2).join(':');
  }, 1000 / 24);
}

// ---------- Mouse ----------
if (finePointer && !calm) {
  document.body.classList.add('has-cursor');
  const ring = document.querySelector('.cursor');
  const dot = document.querySelector('.dot');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const t = e.target.closest('[data-cursor], a, button');
    ring.classList.toggle('label', !!t && !!t.dataset.cursor);
    ring.classList.toggle('link', !!t && !t.dataset.cursor);
    ring.textContent = t && t.dataset.cursor ? t.dataset.cursor : '';
  }, { passive: true });
  (function follow() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  // Abertura: foco de luz e letras do título esticando perto do mouse
  const shade = document.querySelector('.s-shade');
  const letters = [...document.querySelectorAll('.s-title i')];
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    shade.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    shade.style.setProperty('--my', (e.clientY - r.top) + 'px');
    letters.forEach(l => {
      const b = l.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (b.left + b.width / 2), (e.clientY - (b.top + b.height / 2)) * 1.4);
      l.style.setProperty('--k', (1 + .22 * Math.max(0, 1 - d / 260) ** 2).toFixed(3));
    });
  }, { passive: true });
  hero.addEventListener('mouseleave', () => letters.forEach(l => l.style.removeProperty('--k')));

  document.querySelectorAll('.case').forEach(card => {
    const img = card.querySelector('img');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      img.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * -18 + 'px');
      img.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * -18 + 'px');
    }, { passive: true });
    card.addEventListener('mouseleave', () => { img.style.removeProperty('--px'); img.style.removeProperty('--py'); });
  });

  document.querySelectorAll('.btn.solid, .cta').forEach(b => {
    b.classList.add('magnet');
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}
