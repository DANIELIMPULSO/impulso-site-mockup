// Página de CASE (case-estudo.html): animações ligadas à rolagem. Carregado depois de pages.js.
(() => {
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tudo o que tem animação própria recebe a classe "viu" quando entra na tela
  const alvos = document.querySelectorAll('.ce-nums, .ce-req, .ce-entregas, .ce-troca, .ce-voz');
  const ver = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('viu');
    if (e.target.matches('.ce-nums')) e.target.querySelectorAll('[data-conta]').forEach(contar);
    ver.unobserve(e.target);
  }), { rootMargin: '0px 0px -18% 0px' });
  alvos.forEach(a => ver.observe(a));

  // Gráfico: só começa quando a área das barras está quase toda na tela; aí elas crescem uma de cada vez
  const grafico = document.querySelector('.ce-grafico');
  if (grafico) {
    const verGrafico = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      grafico.classList.add('viu');
      grafico.querySelectorAll('.ce-par i').forEach((b, k) => contarBarra(b, k));
      verGrafico.disconnect();
    }), { threshold: .75 });
    verGrafico.observe(grafico.querySelector('.ce-barras'));
  }

  // Números do projeto: contam de zero até o valor
  function contar(el) {
    const fim = Number(el.dataset.conta);
    if (calmo) { el.textContent = fim; return; }
    const t0 = performance.now(), dur = 1300;
    const passo = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passo);
    };
    el.textContent = '0';
    requestAnimationFrame(passo);
  }

  // Gráfico: o valor aparece sobre cada barra enquanto ela sobe
  function contarBarra(barra, k) {
    const fim = Number(barra.dataset.v);
    const rotulo = document.createElement('em');
    barra.append(rotulo);
    if (calmo) { rotulo.textContent = fim; return; }
    const atraso = 200 + k * 620, dur = 800;   // mesma cadência do CSS: uma barra a cada 0,62s
    const t0 = performance.now() + atraso;
    const passo = t => {
      const p = Math.max(0, Math.min(1, (t - t0) / dur));
      rotulo.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passo);
    };
    rotulo.textContent = '0';
    requestAnimationFrame(passo);
  }
})();

// ---------- Opções de layout do case (botão "Case 1 a 6" no canto) ----------
(() => {
  const filme = document.querySelector('.ce-topo');
  const lugares = { hero: document.getElementById('slot-hero'), split: document.getElementById('slot-split') };
  const nome = document.querySelector('.cv-nome');
  const botoes = [...document.querySelectorAll('.casos button')];
  const trocar = v => {
    document.body.className = document.body.className.replace(/cv-\d/, 'cv-' + v);
    // na opção 5 o filme sai da abertura e fica preso ao lado do texto
    (v === '5' ? lugares.split : lugares.hero).append(filme);
    botoes.forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v));
    nome.textContent = botoes.find(b => b.dataset.v === v).title;
    scrollTo({ top: 0 });
  };
  botoes.forEach(b => b.addEventListener('click', () => trocar(b.dataset.v)));
  // opção 6: cada parte da história abre e fecha
  document.querySelectorAll('.ce-mais').forEach(b => b.addEventListener('click', () => {
    const aberto = b.closest('.ce-ato').classList.toggle('aberto');
    b.setAttribute('aria-expanded', aberto);
    b.textContent = aberto ? 'Recolher' : 'Ler a história completa';
  }));
})();

// ---------- Foto ao lado do depoimento: retrato de quem fala (a) ou foto do filme (b) ----------
document.querySelectorAll('.deps button').forEach(b => b.addEventListener('click', () => {
  document.body.className = document.body.className.replace(/dep-[ab]/, 'dep-' + b.dataset.d);
  document.querySelectorAll('.deps button').forEach(o => o.setAttribute('aria-pressed', o === b));
}));

// ---------- Opção 6: "Ler a história completa" só aparece quando o texto não cabe na altura da seção ----------
(() => {
  const atos = [...document.querySelectorAll('.ce-ato')];
  const medir = () => {
    const seis = document.body.classList.contains('cv-6');
    atos.forEach(a => {
      const c = a.querySelector('.ce-ato-c'), h = a.querySelector('.ce-ato-h');
      a.classList.remove('cabe');
      c.style.maxHeight = '';
      if (!seis) return;
      // a altura da seção é a da coluna do título (no celular, onde o título fica em cima, vale um limite fixo)
      const ladoALado = h.getBoundingClientRect().top === c.getBoundingClientRect().top || Math.abs(h.getBoundingClientRect().top - c.getBoundingClientRect().top) < 40;
      const limite = ladoALado ? Math.max(150, h.getBoundingClientRect().height) : 190;
      const cabe = c.scrollHeight <= limite + 12;
      a.classList.toggle('cabe', cabe);
      if (!cabe && !a.classList.contains('aberto')) c.style.maxHeight = limite + 'px';
    });
  };
  document.querySelectorAll('.casos button, .ce-mais').forEach(b => b.addEventListener('click', () => requestAnimationFrame(medir)));
  addEventListener('resize', medir);
  addEventListener('load', medir);
  document.fonts && document.fonts.ready.then(medir);
  medir();
})();
