// Amplia pages.js para servir a todas as páginas geradas (player, etapas, filtros, formulários).
// Roda uma vez só: se pages.js já estiver ampliado, não faz nada.
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "pages.js");
let s = fs.readFileSync(file, "utf8");
if (s.includes("updateProc")) { console.log("pages.js já estava ampliado"); process.exit(0); }
const swap = (a, b) => { if (!s.includes(a)) throw new Error("não achei: " + a.slice(0, 70)); s = s.replace(a, () => b); }; // função: evita que "$$" e "$'" do texto novo sejam interpretados

// 1) Filtros genéricos (várias categorias por item) com "carregar mais"
swap(`$$('.filters[data-filter]').forEach(group => {
  const items = $$('[data-cat]', $(group.dataset.filter));
  $$('button', group).forEach(b => b.addEventListener('click', () => {
    $$('button', group).forEach(x => x.setAttribute('aria-pressed', x === b));
    items.forEach(c => { c.hidden = b.dataset.f !== 'todos' && c.dataset.cat !== b.dataset.f; });
  }));
});`, `$$('.filters[data-filter]').forEach(group => {
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
});`);

// 2) Fotos que ampliam (qualquer elemento com data-full), player, etapas, formulários
swap(`const box = $('#lightbox');
$$('.mosaic button').forEach(b => b.addEventListener('click', () => { $('img', box).src = b.dataset.full; box.showModal(); }));
box.addEventListener('click', () => box.close());
const mosaic = $('#mosaic');`, `const box = $('#lightbox');
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
}));`);

// 3) Rolagem: abertura opcional, todas as galerias, etapas
swap(`  hero.style.setProperty('--hs', Math.min(1, scrollY / hero.offsetHeight).toFixed(3));
  if (mosaic) {
    // deslocamento relativo ao centro da tela: as colunas se cruzam enquanto a galeria passa
    const r = mosaic.getBoundingClientRect();
    mosaic.style.setProperty('--sy', (((r.top + r.height / 2) - innerHeight / 2) * .12).toFixed(1));
  }`, `  if (hero) hero.style.setProperty('--hs', Math.min(1, scrollY / hero.offsetHeight).toFixed(3));
  updateProc();
  mosaics.forEach(mosaic => {
    // deslocamento relativo ao centro da tela: as colunas se cruzam enquanto a galeria passa
    const r = mosaic.getBoundingClientRect();
    mosaic.style.setProperty('--sy', (((r.top + r.height / 2) - innerHeight / 2) * .12).toFixed(1));
  });`);

// 4) Timecode só onde existe
swap(`if (!calm) {
  const tc = $('#tc');`, `if (!calm && $('#tc')) {
  const tc = $('#tc');`);

// 5) Mouse: abertura opcional e imagens dos cartões acompanhando o cursor
swap(`  const shade = $('.p-shade');
  const letters = $$('.p-title i');
  hero.addEventListener('mousemove', e => {`, `  const shade = $('.p-shade');
  const letters = $$('.p-title i');
  if (hero) hero.addEventListener('mousemove', e => {`);
swap(`  hero.addEventListener('mouseleave', () => letters.forEach(l => l.style.removeProperty('--k')));`,
  `  if (hero) hero.addEventListener('mouseleave', () => letters.forEach(l => l.style.removeProperty('--k')));

  $$('.case, .player-poster').forEach(card => {
    const img = $('img', card);
    if (!img) return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      img.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * -18 + 'px');
      img.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * -18 + 'px');
    }, { passive: true });
    card.addEventListener('mouseleave', () => { img.style.removeProperty('--px'); img.style.removeProperty('--py'); });
  });`);

// 6) Cursor some sobre o vídeo e sobre campos de formulário
swap(`    const t = e.target.closest('[data-cursor], a, button');
    ring.classList.toggle('label', !!t && !!t.dataset.cursor);`, `    const t = e.target.closest('[data-cursor], a, button');
    ring.classList.toggle('off', /IFRAME|INPUT|SELECT|TEXTAREA/.test(e.target.tagName));
    ring.classList.toggle('label', !!t && !!t.dataset.cursor);`);

fs.writeFileSync(file, s);
console.log("pages.js ok");
