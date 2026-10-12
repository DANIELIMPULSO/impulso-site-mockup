// Comportamento da página de artigo do blog (carregado depois de pages.js)
(() => {
  // Índice "Neste artigo": marca a seção que está em leitura
  const links = [...document.querySelectorAll('.toc a')];
  if (links.length) {
    const alvos = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
    const marcar = () => {
      let atual = 0;
      alvos.forEach((h, i) => { if (h && h.getBoundingClientRect().top < innerHeight * .35) atual = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === atual));
    };
    addEventListener('scroll', marcar, { passive: true });
    marcar();
  }

  // Depois que a leitura começa, o índice se apaga (volta a acender com o mouse em cima)
  const texto = document.querySelector('.prose');
  if (texto) {
    const lendo = () => document.body.classList.toggle('lendo', texto.getBoundingClientRect().top < innerHeight * .3);
    addEventListener('scroll', lendo, { passive: true });
    lendo();
  }

  // Checklist: os itens vão sendo marcados conforme sobem na tela
  const itens = document.querySelectorAll('.prose ul.check li');
  if (itens.length) {
    const ver = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ok'); ver.unobserve(e.target); } }), { rootMargin: '0px 0px -38% 0px' });
    itens.forEach(li => ver.observe(li));
  }
})();
