// Páginas de comparação do making of: troca de opção (botão do canto) e abas "Filme / Making of". Carregado depois de pages.js.
(() => {
  const nome = document.querySelector('.mk-nome');
  const botoes = [...document.querySelectorAll('.mk-op button')];
  botoes.forEach(b => b.addEventListener('click', () => {
    document.body.className = document.body.className.replace(/mk-\d/, 'mk-' + b.dataset.m);
    botoes.forEach(o => o.setAttribute('aria-pressed', o === b));
    nome.textContent = b.title;
  }));

  // Abas no player (opção 2): mostra o filme ou o making of no mesmo lugar
  document.querySelectorAll('.mk-palco').forEach(palco => {
    const abas = [...palco.querySelectorAll('.mk-abas button')];
    abas.forEach(a => a.addEventListener('click', () => {
      palco.classList.toggle('ver-mk', a.dataset.ver === 'mk');
      abas.forEach(o => o.setAttribute('aria-pressed', o === a));
    }));
  });
})();
