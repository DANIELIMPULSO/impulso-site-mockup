// Página de filme autoral: listas em blocos de 6 e láureas que giram quando passam de uma linha. Carregado depois de pages.js.
(() => {
  const dois = n => String(n).padStart(2, '0');
  const POR_BLOCO = 6;

  // ---------- Exibições e licenciamentos: no máximo 6 por bloco, com setas para passar ----------
  document.querySelectorAll('.exib-lista').forEach(lista => {
    const itens = [...lista.children];
    if (itens.length <= POR_BLOCO) return;
    const blocos = Math.ceil(itens.length / POR_BLOCO);
    let atual = 0;
    const nav = document.createElement('div');
    nav.className = 'exib-nav';
    nav.innerHTML = '<span class="count"></span><button type="button" data-dir="-1" aria-label="Bloco anterior">←</button><button type="button" data-dir="1" aria-label="Próximo bloco">→</button>';
    lista.after(nav);
    // a altura fica travada na do primeiro bloco, para a seção não mudar de tamanho ao passar
    lista.style.minHeight = '';
    const mostrar = k => {
      atual = (k + blocos) % blocos;
      itens.forEach((li, i) => { li.hidden = Math.floor(i / POR_BLOCO) !== atual; });
      nav.querySelector('.count').textContent = dois(atual + 1) + ' / ' + dois(blocos);
    };
    mostrar(0);
    lista.style.minHeight = lista.offsetHeight + 'px';
    nav.querySelectorAll('button').forEach(b => b.addEventListener('click', () => mostrar(atual + Number(b.dataset.dir))));
    addEventListener('resize', () => { const k = atual; lista.style.minHeight = ''; mostrar(0); lista.style.minHeight = lista.offsetHeight + 'px'; mostrar(k); });
  });

  // ---------- Láureas: uma linha só; quando não cabem todas, a fila gira sem parar (pausa com o mouse em cima) ----------
  document.querySelectorAll('.laureis-trilho').forEach(trilho => {
    const ul = trilho.querySelector('ul');
    const originais = [...ul.children];
    const medir = () => {
      ul.classList.remove('roda');
      ul.querySelectorAll('.clone').forEach(c => c.remove());
      const cabem = Math.max(1, Math.round(trilho.clientWidth / originais[0].getBoundingClientRect().width));
      if (originais.length <= cabem) return;
      originais.forEach(li => { const c = li.cloneNode(true); c.classList.add('clone'); c.setAttribute('aria-hidden', 'true'); ul.append(c); });
      ul.style.setProperty('--dur', (originais.length * 4.5).toFixed(1) + 's');   // 4,5s por láurea
      ul.classList.add('roda');
    };
    medir();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(medir, 200); });
  });
})();
