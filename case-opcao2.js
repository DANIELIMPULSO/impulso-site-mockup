// Mockup da página de case (SKA), com o conteúdo real da página atual
const UP = 'https://www.impulsofilmes.com.br/wp-content/uploads/';
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const p2 = n => String(n).padStart(2, '0');

// Player: o Vimeo só é carregado quando a pessoa aperta o play
const player = document.querySelector(".player");
player.querySelector(".player-poster").addEventListener("click", () => {
  const f = document.createElement("iframe");
  f.src = "https://player.vimeo.com/video/" + player.dataset.vimeo + "?autoplay=1&title=0&byline=0&portrait=0";
  f.allow = "autoplay; fullscreen; picture-in-picture";
  f.allowFullscreen = true;
  f.title = "Filme SKA";
  player.replaceChildren(f);
  document.querySelector(".c-hero").classList.add("playing"); // o título sai de cima do filme e vai para baixo dele
});

// Bastidores: grade de fotos que ampliam ao clicar
const shots = document.getElementById("shots");
const SHOTS = [3, 2, 4, 5, 6, 7, 8, 9].map(n => "2026/02/image-" + n);
const box = document.getElementById("lightbox");
SHOTS.forEach((s, k) => {
  const li = document.createElement("li");
  li.className = "reveal";
  li.style.transitionDelay = (k % 4) * 80 + "ms";
  const b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-label", "Ampliar foto " + (k + 1) + " de " + SHOTS.length);
  const im = new Image();
  im.loading = "lazy";
  im.alt = "Bastidores da gravação, foto " + (k + 1);
  im.src = UP + s + "-480x360.jpg";
  b.append(im);
  b.addEventListener("click", () => { box.querySelector("img").src = UP + s + ".jpg"; box.showModal(); });
  li.append(b);
  shots.append(li);
});
box.addEventListener("click", () => box.close());

// Outros trabalhos da mesma categoria
const RELATED = [
  ['Usina Jatiboca', '2023/12/v2.png'],
  ['Frigorífico Saudali', '2023/12/Captura-de-tela-2024-05-29-105748.png'],
  ['Indústria Kerus', '2024/04/Captura-de-tela-2024-04-19-140657.png'],
];
const related = document.getElementById('related');
RELATED.forEach(([nome, img]) => {
  const a = document.createElement('a');
  a.className = 'case reveal';
  a.dataset.cursor = 'VER';
  a.href = 'case.html';
  const im = new Image();
  im.loading = 'lazy';
  im.alt = '';
  im.src = UP + img;
  const info = document.createElement('div');
  info.className = 'case-info';
  info.innerHTML = '<span>Vídeo institucional</span><strong></strong>';
  info.children[1].textContent = nome;
  a.append(im, info);
  related.append(a);
});
[...related.children].forEach((el, k) => { el.style.transitionDelay = k * 90 + 'ms'; });

// Cabeçalho e menu
const header = document.querySelector('.top');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));

// Entrada dos blocos ao rolar
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Rolagem: linha de progresso e título em contorno deslizando
if (!calm) {
  const root = document.documentElement;
  const cta = document.querySelector('.c-cta');
  const outline = cta.querySelector('.outline');
  let queued = false;
  function onScroll() {
    queued = false;
    root.style.setProperty('--p', (scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
    const r = cta.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) outline?.style.setProperty('--ox', ((r.top - innerHeight * .3) * .14).toFixed(1));
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
}

// Mouse: cursor próprio, imagens que acompanham e botões atraídos
if (finePointer && !calm) {
  document.body.classList.add('has-cursor');
  const ring = document.querySelector('.cursor');
  const dot = document.querySelector('.dot');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const t = e.target.closest('[data-cursor], a, button, iframe');
    ring.classList.toggle('off', !!t && t.tagName === 'IFRAME');
    ring.classList.toggle('label', !!t && !!t.dataset.cursor);
    ring.classList.toggle('link', !!t && !t.dataset.cursor && t.tagName !== 'IFRAME');
    ring.textContent = t && t.dataset.cursor ? t.dataset.cursor : '';
  }, { passive: true });
  (function follow() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll('.case, .player-poster').forEach(card => {
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
