// Mockup da home: dados reais do site atual, carregados direto de impulsofilmes.com.br
const UP = 'https://www.impulsofilmes.com.br/wp-content/uploads/';

const CASES = [
  ['Vídeo institucional', 'Usina Jatiboca', '2023/12/v2-640x360.png', 'usina-jatiboca'],
  ['Publicidade', 'Tractian México', '2024/12/Captura-de-tela-2024-12-09-125457-640x360.png', 'tractian-mexico-confissiones-de-un-inge'],
  ['Vídeo institucional', 'SKA', '2026/02/image-3-640x360.jpg', 'ska-institucional'],
  ['Conteúdo de marca', 'ArcelorMittal: MasterChef', '2024/06/Captura-de-tela-2024-06-24-114035-640x360.png', 'arcelormittal-masterchef-juiz-de-fora'],
  ['Publicidade', 'Plasc: 40 anos', '2024/12/STILL-640x360.png', 'plasc-40-anos'],
  ['Vídeo institucional', 'Supporte', '2026/05/image-22-640x360.jpg', 'supporte'],
  ['Conteúdo de marca', 'Universal Robots: Usiminas', '2024/04/USIMINAS-640x360.png', 'universal-robots-usiminas'],
  ['Publicidade', 'Camesa: Linha Floral', '2024/12/Captura-de-tela-2024-10-17-163450-640x360.png', 'camesa-linha-floral'],
  ['Conteúdo de marca', 'Unimed: Se liga!', '2024/04/Captura-de-tela-2024-06-11-114128-640x360.png', 'unimed-se-liga'],
];

const LOGOS = [
  '2024/05/ARCELORMITTAL_LOGO-1', '2024/05/UNIMED_LOGO', '2024/05/SAUDALI_LOGO', '2024/05/SUPPORTE_LOGO',
  '2024/05/UR_LOGO', '2024/05/TR_LOGO', '2024/05/FUNDACAO_ESTUDAR_LOGO', '2024/05/CANAL_BRASIL_LOGO',
  '2024/05/CURTA_LOGO', '2024/05/CODEMIG_LOGO', '2024/05/CBA_LOGO', '2024/05/UAU_HUB_LOGO',
  '2024/05/logo-dispetral', '2024/05/ORALUNIC_LOGO-2', '2024/05/NEXINVOICE_LOGO', '2024/05/CALHADAS_LOGO',
];

// Portfólio: tenta a imagem original e cai para a miniatura se ela não existir
const work = document.getElementById('work');
CASES.forEach(([cat, nome, img, slug]) => {
  const a = document.createElement('a');
  a.className = 'case reveal';
  a.dataset.cursor = 'VER';
  a.dataset.cat = cat;
  a.href = 'case-' + slug + '.html';
  const im = new Image();
  im.loading = 'lazy';
  im.alt = '';
  im.onerror = () => { im.onerror = null; im.src = UP + img; };
  im.src = UP + img.replace('-640x360', '');
  const info = document.createElement('div');
  info.className = 'case-info';
  info.innerHTML = '<span></span><strong></strong>';
  info.children[0].textContent = cat;
  info.children[1].textContent = nome;
  a.append(im, info);
  work.append(a);
});

document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
  work.querySelectorAll('.case').forEach(c => { c.hidden = b.dataset.f !== 'todos' && c.dataset.cat !== b.dataset.f; });
}));

// Faixa de clientes (lista duplicada para o movimento contínuo)
const logos = document.getElementById('logos');
[...LOGOS, ...LOGOS].forEach(l => {
  const im = new Image();
  im.loading = 'lazy';
  im.alt = '';
  im.src = UP + l + '-90x90.png';
  if (/CALHADAS|UNIMED|dispetral/.test(l)) im.className = 'fill'; // logos com fundo cheio não viram silhueta
  logos.append(im);
});

// Hero: índice de palavras, com letras separadas para reagirem ao mouse
// Portfólio completo (categoria, nome, miniatura) para a prévia rotativa
const P = "Publicidade", I = "Vídeo institucional", C = "Conteúdo de marca";
const PORT = [
  [I, "Supporte", "2026/05/image-22"], [I, "SKA", "2026/02/image-3"], [I, "Usina Jatiboca", "2023/12/v2"],
  [P, "Tractian México", "2024/12/Captura-de-tela-2024-12-09-125457"], [P, "Camesa: Linha Floral", "2024/12/Captura-de-tela-2024-10-17-163450"],
  [P, "Array", "2024/12/Captura-de-tela-2024-12-03-180505"], [P, "Plasc: 40 anos", "2024/12/STILL"],
  [C, "ArcelorMittal: MasterChef", "2024/06/Captura-de-tela-2024-06-24-114035"], [C, "Editora Abril: Jovens Inspiradores", "2024/04/Captura-de-tela-2024-02-21-140555"],
  [C, "TR Capacita", "2024/04/Conteudo-Thomson-Reuters-Capacita"], [C, "Shopping Alameda: Futuro de Presente", "2024/04/Captura-de-tela-2024-04-19-154406"],
  [C, "Unimed: Se liga!", "2024/04/Captura-de-tela-2024-06-11-114128"], [C, "Plasc: Vida que Segue", "2024/04/Plasc-Transplante"],
  [C, "Universal Robots: Usiminas", "2024/04/USIMINAS"], [C, "Reportei", "2024/04/Captura-de-tela-2024-04-19-150856"],
  [C, "Tractian: Smart Trac Pro", "2024/04/Captura-de-tela-2024-06-27-135512"], [I, "Camesa", "2024/04/Captura-de-tela-2024-04-19-141149"],
  [I, "Indústria Kerus", "2024/04/Captura-de-tela-2024-04-19-140657"], [I, "Santa Casa: 167 anos", "2024/04/Captura-de-tela-2024-04-19-161910"],
  [I, "Pet Farma", "2024/04/Captura-de-tela-2024-04-18-154314"], [P, "Tractian: Vida de Manutenção", "2024/04/Tractian"],
  [P, "Plasc: Superação", "2024/04/Captura-de-tela-2024-04-18-152458"], [P, "Mr. Tugas: Vikings", "2024/04/Captura-de-tela-2024-06-20-162639"],
  [P, "Cesama: 60 anos", "2024/03/Captura-de-tela-2024-03-15-175159"], [P, "CONFEF", "2024/03/Captura-de-tela-2024-03-15-174108"],
  [I, "Frigorífico Saudali", "2023/12/Captura-de-tela-2024-05-29-105748"], [P, "DOX", "2023/12/Captura-de-tela-2024-12-09-115223"],
  [I, "Plasc: 37 anos", "2023/12/v1"], [P, "Oral Unic", "2024/04/Captura-de-tela-2024-06-26-142744"],
].map(([cat, nome, img]) => ({ cat, nome, src: UP + img + "-640x360." + (img.includes("image-") ? "jpg" : "png") }));
// Cada palavra do hero roda os projetos da sua categoria; "Portfólio" roda todos
const WORD_CATS = [P, I, C, null];
const words = [...document.querySelectorAll(".bigwords a")];
words.forEach((a, n) => {
  const w = a.querySelector(".word");
  a.setAttribute("aria-label", w.textContent);
  a.querySelector(".idx").textContent = String(n + 1).padStart(2, "0");
  w.innerHTML = [...w.textContent].map((c, k) => "<i style=\"--n:" + k + "\">" + c + "</i>").join("");
});

// Cabeçalho e menu
const header = document.querySelector('.top');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));
menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

// Entrada dos blocos ao rolar
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Formulário: neste mockup nada é enviado
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  e.target.querySelector('.form-note').textContent = 'Mockup: o formulário ainda não envia nada.';
});

// ---------- Interações com o mouse (só em telas com mouse e sem redução de movimento) ----------
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Sem mouse (ou em tela estreita) o índice do hero roda sozinho
const autoIndex = !finePointer || innerWidth <= 900;

// Timecode do hero, a 24 quadros por segundo
if (!calm) {
  const tc = document.getElementById('tc');
  const t0 = performance.now();
  const p2 = n => String(n).padStart(2, '0');
  setInterval(() => {
    const f = Math.floor((performance.now() - t0) / (1000 / 24));
    tc.textContent = [Math.floor(f / 86400), Math.floor(f / 1440) % 60, Math.floor(f / 24) % 60, f % 24].map(p2).join(':');
  }, 1000 / 24);
}

if (finePointer && !calm) {
  document.body.classList.add('has-cursor');
  const ring = document.querySelector('.cursor');
  const dot = document.querySelector('.dot');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const t = e.target.closest('[data-cursor], a, button, input, select, textarea');
    const field = t && /INPUT|SELECT|TEXTAREA/.test(t.tagName);
    ring.classList.toggle('off', !!field);
    ring.classList.toggle('label', !!t && !!t.dataset.cursor);
    ring.classList.toggle('link', !!t && !t.dataset.cursor && !field);
    ring.textContent = t && t.dataset.cursor ? t.dataset.cursor : '';
  }, { passive: true });

  // O anel segue o ponto com um pequeno atraso
  (function follow() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  // Hero: um foco de luz acompanha o mouse sobre o vídeo
  const hero = document.querySelector('.hero');
  const shade = document.querySelector('.hero-shade');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    shade.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    shade.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // Imagens dos cartões se deslocam levemente na direção oposta ao mouse
  document.querySelectorAll('.case, .solution, .reel').forEach(card => {
    const img = card.querySelector('img');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      img.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * -18 + 'px');
      img.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * -18 + 'px');
    }, { passive: true });
    card.addEventListener('mouseleave', () => { img.style.removeProperty('--px'); img.style.removeProperty('--py'); });
  });

  // Botões principais são atraídos pelo mouse
  document.querySelectorAll('.btn.solid, .cta').forEach(b => {
    b.classList.add('magnet');
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}

if (finePointer && !calm && !autoIndex) {
  // Letras esticam conforme a proximidade do mouse
  const list = document.querySelector(".bigwords");
  const letters = [...list.querySelectorAll(".word i")];
  list.addEventListener("mousemove", e => {
    letters.forEach(l => {
      const r = l.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), (e.clientY - (r.top + r.height / 2)) * 1.6);
      l.style.setProperty("--k", (1 + .42 * Math.max(0, 1 - d / 190) ** 2).toFixed(3));
    });
  }, { passive: true });
  list.addEventListener("mouseleave", () => letters.forEach(l => l.style.removeProperty("--k")));

  // Cartão de prévia: segue o mouse e inclina conforme a velocidade
  const peek = document.querySelector(".peek");
  const peekImg = peek.querySelector("img");
  const peekCap = peek.querySelector("figcaption");
  let tx = 0, ty = 0, px = 0, py = 0;
  // Carrega as miniaturas depois da página, para a troca ser imediata
  addEventListener("load", () => PORT.forEach(p => { new Image().src = p.src; }));
  const STEP = 1100; // tempo de cada projeto na prévia, em milissegundos
  peek.style.setProperty("--step", STEP + "ms");
  let timer = null;
  const p2d = n => String(n).padStart(2, "0");
  function show(list, i) {
    const item = list[i % list.length];
    peekImg.src = item.src;
    peekCap.children[0].textContent = item.nome;
    peekCap.children[1].textContent = p2d(i % list.length + 1) + " / " + p2d(list.length);
    peek.classList.remove("tick");
    void peek.offsetWidth; // reinicia as animações de entrada e da barra de tempo
    peek.classList.add("tick");
  }
  words.forEach((a, n) => {
    const list = PORT.filter(p => !WORD_CATS[n] || p.cat === WORD_CATS[n]);
    a.addEventListener("mouseenter", () => {
      let i = 0;
      peekCap.innerHTML = "<span></span><span></span>";
      show(list, i);
      peek.classList.add("on");
      clearInterval(timer);
      timer = setInterval(() => show(list, ++i), STEP);
    });
    a.addEventListener("mouseleave", () => { clearInterval(timer); peek.classList.remove("on"); });
  });
  addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function drift() {
    const vx = tx - px;
    px += vx * .12; py += (ty - py) * .12;
    peek.style.transform = "translate(" + (px - 340) + "px, " + (py - 110) + "px) rotate(" + Math.max(-9, Math.min(9, vx * .06)) + "deg)";
    requestAnimationFrame(drift);
  })();
}

if (autoIndex) {
  // Celular e tablet: a prévia fica fixa acima do índice e as palavras se revezam sozinhas
  const list = document.querySelector(".bigwords");
  const peek = document.querySelector(".peek");
  const img = peek.querySelector("img");
  const cap = peek.querySelector("figcaption");
  const box = document.createElement("div");
  box.className = "index";
  list.before(box);
  box.append(peek, list);
  peek.classList.add("inline");
  list.classList.add("auto");
  cap.innerHTML = "<span></span><span></span>";

  const STEP = 1300;      // tempo de cada projeto
  const PER_WORD = 4;     // projetos mostrados antes de passar para a próxima palavra
  const lists = WORD_CATS.map(c => PORT.filter(p => !c || p.cat === c));
  const pos = lists.map(() => 0);
  const p2d = n => String(n).padStart(2, "0");
  let w = 0, shown = 0, timer = null;

  function show() {
    const l = lists[w], item = l[pos[w] % l.length];
    img.src = item.src;
    cap.children[0].textContent = item.nome;
    cap.children[1].textContent = p2d(pos[w] % l.length + 1) + " / " + p2d(l.length);
    peek.style.setProperty("--step", STEP + "ms");
    peek.classList.remove("tick");
    void peek.offsetWidth;
    peek.classList.add("tick");
  }
  function activate(n) {
    w = n; shown = 0;
    words.forEach((a, k) => a.classList.toggle("active", k === w));
    show();
  }
  function next() {
    pos[w]++;
    if (++shown >= PER_WORD) activate((w + 1) % words.length); else show();
  }
  const play = () => { if (!calm && !timer) timer = setInterval(next, STEP); };
  const pause = () => { clearInterval(timer); timer = null; };

  // Primeiro toque escolhe a palavra; tocar de novo na palavra ativa segue o link
  words.forEach((a, n) => a.addEventListener("click", e => {
    if (n === w) return;
    e.preventDefault();
    activate(n);
    pause(); play();
  }));

  activate(0);
  addEventListener("load", () => PORT.forEach(p => { new Image().src = p.src; }));
  // Só roda enquanto o hero está na tela
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? play() : pause()), { threshold: .1 }).observe(box);
}

// ---------- Animações discretas ao rolar ----------
// Cartões de uma mesma grade entram em sequência
document.querySelectorAll('.solutions, .work, .quotes, .posts').forEach(grid => {
  [...grid.children].forEach((el, k) => { el.style.transitionDelay = Math.min(k, 5) * 90 + 'ms'; });
});

if (!calm) {
  const root = document.documentElement;
  const heroEl = document.querySelector('.hero');
  const budget = document.querySelector('.budget');
  const outline = document.querySelector('.outline');
  let queued = false;
  function onScroll() {
    queued = false;
    const vh = innerHeight;
    // Linha de progresso no topo
    root.style.setProperty('--p', (scrollY / Math.max(1, root.scrollHeight - vh)).toFixed(4));
    // Hero: o vídeo aproxima e o texto some aos poucos ao sair da tela
    heroEl.style.setProperty('--hs', Math.min(1, scrollY / heroEl.offsetHeight).toFixed(3));
    // "Orçamento" em contorno desliza de lado enquanto a seção passa
    const r = budget.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) outline?.style.setProperty('--ox', ((r.top - vh * .3) * .14).toFixed(1));
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
}
