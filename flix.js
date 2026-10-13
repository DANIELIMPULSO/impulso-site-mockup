// Projetos autorais: capas em fila (rolagem no estilo do iTunes) e fileiras com rolagem lateral. Carregado depois de pages.js.
(() => {
  // ---------- Capas em fila ----------
  const flow = document.getElementById('flow');
  if (flow) {
    const todos = [...flow.querySelectorAll('.flow-item')];
    let itens = todos;
    const vazio = document.getElementById('flow-vazio');
    const info = document.getElementById('flow-info');
    const conta = document.getElementById('flow-n');
    const dois = n => String(n).padStart(2, '0');
    let atual = Math.min(2, itens.length - 1);

    const escrever = () => {
      const d = itens[atual].dataset;
      info.querySelector('.eyebrow').textContent = d.meta;
      info.querySelector('h3').textContent = d.titulo;
      info.querySelector('p:not(.eyebrow)').textContent = d.lead;
      info.querySelector('a').href = itens[atual].href;
      conta.textContent = dois(atual + 1) + ' / ' + dois(itens.length);
    };
    const arrumar = (trocar = true) => {
      const base = itens[0].offsetWidth;
      const passo = Math.max(46, Math.min(base * .42, flow.clientWidth / 10));
      itens.forEach((el, i) => {
        const d = i - atual, s = Math.sign(d), a = Math.abs(d);
        const x = d === 0 ? 0 : s * (base * .66 + (a - 1) * passo);
        el.style.transform = `translateX(calc(-50% + ${x.toFixed(1)}px)) translateZ(${d === 0 ? 0 : -160 - a * 26}px) rotateY(${d === 0 ? 0 : -s * 58}deg)`;
        el.style.zIndex = 100 - a;
        el.style.opacity = a > 5 ? 0 : 1;
        el.classList.toggle('on', d === 0);
        el.tabIndex = d === 0 ? 0 : -1;
        el.dataset.cursor = d === 0 ? 'VER' : '';
      });
      if (!trocar) { escrever(); return; }
      info.classList.add('troca');
      setTimeout(() => { escrever(); info.classList.remove('troca'); }, 220);
    };
    const ir = k => { const n = Math.max(0, Math.min(itens.length - 1, k)); if (n !== atual) { atual = n; arrumar(); } };

    todos.forEach(el => el.addEventListener('click', e => { const i = itens.indexOf(el); if (i !== atual) { e.preventDefault(); ir(i); } }));
    document.querySelectorAll('.flow-nav button').forEach(b => b.addEventListener('click', () => ir(atual + Number(b.dataset.dir))));
    flow.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); } });
    // rolagem lateral do mouse ou do trackpad passa as capas (a rolagem vertical continua sendo da página)
    let acumulado = 0, trava = 0;
    flow.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      acumulado += e.deltaX;
      if (Math.abs(acumulado) > 60 && Date.now() > trava) { ir(atual + Math.sign(acumulado)); acumulado = 0; trava = Date.now() + 180; }
    }, { passive: false });
    // arrastar com o dedo ou com o mouse
    let x0 = null, arrastou = false;
    flow.addEventListener('pointerdown', e => { x0 = e.clientX; arrastou = false; });
    flow.addEventListener('pointermove', e => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 46) { ir(atual - Math.sign(dx)); x0 = e.clientX; arrastou = true; } });
    addEventListener('pointerup', () => { x0 = null; });
    flow.addEventListener('click', e => { if (arrastou) { e.preventDefault(); arrastou = false; } }, true);
    // filtros: curta, longa, ficção, documentário, outros
    const filtros = [...document.querySelectorAll('#flow-filtros button')];
    filtros.forEach(b => b.addEventListener('click', () => {
      filtros.forEach(o => o.setAttribute('aria-pressed', o === b));
      itens = todos.filter(el => b.dataset.f === 'todos' || el.dataset.tipos.split(' ').includes(b.dataset.f));
      todos.forEach(el => { el.hidden = !itens.includes(el); });
      const tem = itens.length > 0;
      flow.hidden = info.hidden = !tem;
      vazio.hidden = tem;
      conta.textContent = tem ? conta.textContent : '00 / 00';
      if (!tem) return;
      atual = Math.min(Math.floor((itens.length - 1) / 2), 2);
      arrumar(false);
    }));
    addEventListener('resize', () => { if (itens.length) arrumar(false); });
    arrumar(false);
  }

  // ---------- Fileiras: setas que rolam uma "tela" de cartazes ----------
  document.querySelectorAll('.fila').forEach(fila => {
    const trilho = fila.querySelector('.fila-trilho');
    const [ant, prox] = [fila.querySelector('.fila-seta.ant'), fila.querySelector('.fila-seta.prox')];
    if (!ant || !prox) return;
    const estado = () => { ant.disabled = trilho.scrollLeft < 8; prox.disabled = trilho.scrollLeft + trilho.clientWidth > trilho.scrollWidth - 8; };
    ant.addEventListener('click', () => trilho.scrollBy({ left: -trilho.clientWidth * .8, behavior: 'smooth' }));
    prox.addEventListener('click', () => trilho.scrollBy({ left: trilho.clientWidth * .8, behavior: 'smooth' }));
    trilho.addEventListener('scroll', estado, { passive: true });
    addEventListener('resize', estado);
    estado();
  });
})();
