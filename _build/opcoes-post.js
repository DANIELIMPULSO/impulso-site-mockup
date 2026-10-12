// Gera as opções de layout para a página de artigo do blog (post-opcao1.html ... post-opcaoN.html),
// usando um post real e inserindo fotos e um vídeo de exemplo ao longo do texto.
// Uso: NODE_PATH=<pasta com node_modules contendo cheerio> node _build/opcoes-post.js
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const data = require("./data.json");

const OUT = path.join(__dirname, "..");
const UP = "https://www.impulsofilmes.com.br/wp-content/uploads/";
const WA = "https://wa.me/553235124803";
const post = data.posts.find(p => p.slug === "briefing-de-video-institucional") || data.posts[0];
const categoria = (data.categorias.find(c => post.categorias.includes(c.id)) || {}).nome || "Blog";
const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const d = new Date(post.data);
const dataBr = `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`;

// ---------- corpo do artigo: limpa o HTML do WordPress e insere mídia de exemplo ----------
const $ = cheerio.load(post.html, null, false);
$("#ez-toc-container, script, style, noscript").remove();
$("*").each((_, el) => { for (const a of Object.keys(el.attribs || {})) if (/^(style|class|id|data-|on|width|height|srcset|sizes|decoding|fetchpriority|loading)/.test(a)) $(el).removeAttr(a); });
$("span").each((_, el) => { $(el).replaceWith($(el).contents()); });
$("p, h2, h3, li").each((_, el) => { if (!$(el).text().trim() && !$(el).find("img, iframe").length) $(el).remove(); });
$("a[href]").attr("href", "#");

const foto = (n, legenda, cls = "") => `<figure class="${cls}"><button type="button" data-full="${UP}2026/02/image-${n}.jpg" aria-label="Ampliar foto"><img loading="lazy" src="${UP}2026/02/image-${n}.jpg" alt=""></button><figcaption>${legenda}</figcaption></figure>`;
const indice = [];
$("h2").each((k, h) => { const id = "s" + (k + 1); $(h).attr("id", id); indice.push([id, $(h).text().trim()]); });
const h2 = $("h2").toArray();
$("p").first().addClass("abre");
if (h2[0]) $(h2[0]).nextAll("p").first().after(foto(4, "Foto de exemplo dentro do texto, com legenda. Clique para ampliar.", "wide"));
if (h2[1]) $(h2[1]).nextAll("p").first().after(`<blockquote class="pull">Um bom briefing não precisa ser perfeito. Precisa deixar claro o objetivo do projeto.</blockquote>`);
if (h2[2]) $(h2[2]).before(`<figure class="wide video"><div class="player" data-embed="https://player.vimeo.com/video/1161449329?autoplay=1&title=0&byline=0&portrait=0"><button class="player-poster" type="button" data-cursor="PLAY" aria-label="Assistir ao vídeo"><img loading="lazy" src="${UP}2026/02/image-3.jpg" alt=""><span class="play" aria-hidden="true"></span></button></div><figcaption>Vídeo de exemplo dentro do texto. Ele só carrega quando a pessoa aperta o play.</figcaption></figure>`);
if (h2[3]) $(h2[3]).nextAll("p").first().after(`<div class="duo">${foto(6, "Duas fotos lado a lado.")}${foto(8, "Cada uma com sua legenda.")}</div>`);
if (h2[5]) $(h2[5]).before(foto(9, "Foto de exemplo em largura normal, alinhada ao texto."));
const corpo = $.html();
// Mesmo corpo, dividido em capítulos: cada h2 vai para a margem, ao lado do seu texto (opção 11)
const $c = cheerio.load(corpo, null, false);
const partes = [{ h: null, nos: [] }];
$c.root().children().each((_, el) => { if (el.tagName === "h2") partes.push({ h: el, nos: [] }); else partes[partes.length - 1].nos.push(el); });
const dois = k => String(k).padStart(2, "0");
const htmlDe = nos => nos.map(n => $c.html(n)).join("");
const corpoCaps = toc => partes.map((p, k) => k === 0
  ? `<section class="cap cap-abre"><div class="cap-h">${toc}</div><div class="prose">${htmlDe(p.nos)}</div></section>`
  : `<section class="cap"><header class="cap-h"><span class="cap-n" aria-hidden="true">${dois(k)}</span>${$c.html(p.h)}</header><div class="prose">${htmlDe(p.nos)}</div></section>`).join("\n");
const minutos = Math.max(1, Math.round($.text().split(/\s+/).length / 200));

// ---------- peças comuns ----------
const crumbs = `<nav class="crumbs" aria-label="Você está em"><a href="blog.html">Blog</a><span aria-hidden="true">/</span><a href="blog.html">${categoria}</a></nav>`;
const meta = `<p class="post-meta"><time datetime="${post.data}">${dataBr}</time><span>${minutos} min de leitura</span></p>`;
const capa = post.imagem || `${UP}2026/02/image-9.jpg`;
const toc = `<nav class="toc" aria-label="Neste artigo"><p class="eyebrow">Neste artigo</p><ol>${indice.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("")}</ol></nav>`;
// Opção 8: nos subtítulos que começam com número ("2. Defina...") o número sai do texto e vira um marcador amarelo
const numerar = html => html.replace(/<h3>((?:<(?:b|strong)>)?)\s*(\d+)\.\s*/g, (_, abre, k) => `<h3 class="num"><span class="h3-n" aria-hidden="true">${dois(k)}</span>${abre}`);
// Opção 8: cada subtítulo (h3) e o texto que vem depois dele, até o próximo h3 ou h2, viram um bloco <section class="passo">,
// para o conteúdo poder ser recuado em relação ao subtítulo
const agrupar = html => {
  const $g = cheerio.load(html, null, false);
  let bloco = null;
  $g.root().children().toArray().forEach(el => {
    if (el.tagName === "h2") { bloco = null; return; }
    if (el.tagName === "h3") { bloco = $g('<section class="passo"></section>'); $g(el).before(bloco); }
    if (bloco) bloco.append(el);
  });
  // checklist: parágrafo com linhas "☐ item" separadas por <br> vira uma lista de caixas de marcar
  $g("p").each((_, p) => {
    const linhas = ($g(p).html() || "").split(/<br\s*\/?>/).map(l => l.trim()).filter(Boolean);
    if (linhas.length > 1 && linhas.every(l => /^☐/.test(l))) $g(p).replaceWith(`<ul class="check">${linhas.map(l => `<li>${l.replace(/^☐\s*/, "")}</li>`).join("")}</ul>`);
  });
  // listas: "Leia também" vira um bloco à parte; a frase terminada em ":" que anuncia uma lista fica marcada para colar nela
  $g("ul").each((_, ul) => {
    const itens = $g(ul).children("li");
    if (itens.length === 1 && /^\s*Leia também/i.test(itens.text())) $g(ul).addClass("leia");
    else if (/:\s*$/.test($g(ul).prev("p").text())) $g(ul).prev("p").addClass("anuncia");
  });
  return $g.html();
};
// Opção 8: a introdução do próprio artigo (tudo antes do primeiro h2) entra, em letra menor, sob o chapéu amarelo
const corpoChamada = `<details class="chamada" open><summary><span>O que você vai encontrar neste artigo</span></summary>${htmlDe(partes[0].nos)}</details>${agrupar(numerar(partes.slice(1).map(p => $c.html(p.h) + htmlDe(p.nos)).join("")))}`;
const fim = `
<section class="block rule art-fim">
  <div class="statement reveal"><h2>Quer transformar isso em vídeo?</h2><p>Conte o que a sua empresa precisa e fale com um especialista.</p>
  <div class="actions"><a class="btn solid" href="orcamento.html">Fale com um especialista</a><a class="btn ghost" href="blog.html">Ver todos os artigos</a></div></div>
</section>`;

const OPCOES = [
  ["Capa ao lado do título", "Título à esquerda e foto de destaque à direita, na mesma tela. Texto em uma coluna central, estreita, e as mídias mais largas que o texto.",
    `<header class="po-head">
      <div>${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      <figure class="capa"><img src="${capa}" alt=""></figure>
    </header>
    <div class="po-body"><div class="prose">${corpo}</div></div>`],
  ["Capa em tela cheia", "A foto de destaque ocupa a largura toda, com o título por cima. É a mais cinematográfica; o texto vem depois, em coluna central.",
    `<header class="po-head">
      <img class="capa-bg" src="${capa}" alt="">
      <div class="po-head-in">${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
    </header>
    <div class="po-body"><div class="prose">${corpo}</div></div>`],
  ["Índice lateral", "Título e foto dividem o topo. Ao lado do texto fica um índice fixo, que marca a seção em leitura e leva a qualquer parte do artigo.",
    `<header class="po-head">
      <div>${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      <figure class="capa"><img src="${capa}" alt=""></figure>
    </header>
    <div class="po-body">${toc}<div class="prose">${corpo}</div></div>`],
  ["Resumo no topo e notas na margem", "Depois do título, a foto de destaque e um quadro com o que o artigo cobre. No texto, as citações em destaque saem para a margem direita.",
    `<header class="po-head">
      <div class="po-head-top">${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      <figure class="capa"><img src="${capa}" alt=""></figure>
      ${toc}
    </header>
    <div class="po-body"><div class="prose">${corpo}</div></div>`],
  ["Capa fixa ao lado", "A tela se divide: a foto de destaque com o título fica parada à esquerda e o texto rola à direita. No celular, vira capa em cima e texto embaixo.",
    `<div class="po-split">
      <header class="po-head">
        <img class="capa-bg" src="${capa}" alt="">
        <div class="po-head-in">${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      </header>
      <div class="po-body"><div class="prose">${corpo}</div></div>
    </div>`],
  ["Índice afastado e discreto", "Como a opção 3, mas com bem mais espaço entre o índice e o texto. Quando a leitura começa, o índice se apaga e só volta a acender ao passar o mouse. Fotos e vídeos têm exatamente a largura do texto.",
    `<header class="po-head">
      <div>${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      <figure class="capa"><img src="${capa}" alt=""></figure>
    </header>
    <div class="po-body">${toc}<div class="prose">${corpo}</div></div>`],
  ["Uma coluna só", "Sem coluna lateral: título e foto no topo, e abaixo uma única coluna central. O índice vira um quadro recolhível no começo do texto. Tudo, texto, fotos e vídeos, tem a mesma largura.",
    `<header class="po-head">
      <div>${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      <figure class="capa"><img src="${capa}" alt=""></figure>
    </header>
    <div class="po-body"><div class="prose"><details class="toc-box"><summary>Neste artigo · ${indice.length} seções</summary>${toc}</details>${corpo}</div></div>`],
  ["Capa em tela cheia + índice afastado", "A capa da opção 2 com o corpo da opção 6: foto de destaque em tela cheia com o título por cima, índice bem afastado que se apaga durante a leitura, e fotos e vídeos na largura exata do texto. Use o botão “Fundo”, no canto, para comparar o texto dentro de um box mais claro, sobre uma faixa mais clara ou direto no fundo do site.",
    `<header class="po-head">
      <img class="capa-bg" src="${capa}" alt="">
      <div class="po-head-in">${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
    <span class="rolar" aria-hidden="true"><i></i><i></i><i></i></span>
    </header>
    <div class="po-body">${toc}<div class="leitura"><div class="prose">${corpoChamada}</div></div></div>`],
  ["Uma coluna com barra de leitura", "Título, foto de destaque, texto, fotos e vídeos em uma única coluna, todos com a mesma largura. O índice vira uma barra fina presa no topo, que mostra em que seção a pessoa está e abre a lista completa com um toque. Funciona igual no celular. As seções ganham número.",
    `<header class="po-head"><div class="po-col">${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}<figure class="capa"><img src="${capa}" alt=""></figure></div></header>
    <details class="barra"><summary><span class="b-n">01 / ${dois(indice.length)}</span><span class="b-t">${indice[0] ? indice[0][1] : ""}</span><span class="b-i">Índice</span></summary>${toc}</details>
    <div class="po-body"><div class="prose">${corpo}</div></div>`],
  ["Folha clara", "O topo continua escuro, com título e foto de destaque lado a lado. O texto fica em uma folha clara, como papel, com letra escura: é o extremo da ideia de clarear o fundo. Índice recolhível no começo da folha; fotos e vídeos na largura do texto.",
    `<header class="po-head">
      <div>${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      <figure class="capa"><img src="${capa}" alt=""></figure>
    </header>
    <div class="po-body"><div class="folha"><div class="prose"><details class="toc-box"><summary>Neste artigo · ${indice.length} seções</summary>${toc}</details>${corpo}</div></div></div>`],
  ["Títulos na margem", "Não há índice fixo: o número e o título de cada seção ficam na margem esquerda e acompanham a leitura até a seção acabar. O texto corre à direita, sempre na mesma coluna, com fotos e vídeos na mesma largura. A lista completa aparece só uma vez, no começo.",
    `<header class="po-head">
      <div>${crumbs}<h1 class="post-title">${post.titulo}</h1>${meta}</div>
      <figure class="capa"><img src="${capa}" alt=""></figure>
    </header>
    <div class="po-body">${corpoCaps(toc)}</div>`],
];

const NAV = fs.readFileSync(path.join(OUT, "sobre.html"), "utf8").match(/<nav id="menu"[\s\S]*?<\/nav>(?=\s*<\/header>)/)[0];
const FOOT = fs.readFileSync(path.join(OUT, "sobre.html"), "utf8").match(/<footer class="foot">[\s\S]*?<\/footer>/)[0];

OPCOES.forEach(([nome, texto, html], k) => {
  const n = k + 1;
  const seletor = `<nav class="opts" aria-label="Opções de layout do artigo"><span>Artigo</span>${OPCOES.map((_, i) => `<a href="post-opcao${i + 1}.html"${i === k ? ' aria-current="page"' : ""}>${i + 1}</a>`).join("")}</nav>`;
  const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Artigo, opção ${n}: ${nome} · Impulso Filmes (mockup)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;600&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="pages.css">
<link rel="stylesheet" href="case.css">
<link rel="stylesheet" href="extra.css">
<link rel="stylesheet" href="post-opcoes.css">
</head>
<body class="po po${n}${n === 8 ? " f-box" : ""}">

<div class="progress" aria-hidden="true"></div>

<header class="top" id="top">
  <a class="logo" href="index.html" aria-label="Impulso Filmes, início">
    <img src="${UP}2023/12/cropped-logo.png" alt="Impulso Filmes" width="240" height="80">
  </a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
  ${NAV}
</header>

<main>
<p class="po-nota"><b>Opção ${n} · ${nome}.</b> ${texto}</p>
<article class="art">
    ${html}
</article>
${fim}
</main>

${FOOT}

<a class="zap" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
${seletor}
${n === 8 ? `<div class="opts fundo" role="group" aria-label="Fundo atrás do texto"><span>Fundo</span><button type="button" data-f="box" aria-pressed="true">Box</button><button type="button" data-f="faixa" aria-pressed="false">Faixa</button><button type="button" data-f="sem" aria-pressed="false">Sem</button></div>` : ""}

<dialog class="lightbox" id="lightbox" aria-label="Foto ampliada"><img alt=""><button type="button">Fechar</button></dialog>
<div class="cursor" aria-hidden="true"></div><div class="dot" aria-hidden="true"></div>

<script src="pages.js"></script>
<script>
  // Índice: marca a seção que está em leitura
  const links = [...document.querySelectorAll('.toc a')];
  if (links.length) {
    const alvos = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
    const barra = document.querySelector('.barra');
    const marcar = () => {
      let atual = 0;
      alvos.forEach((h, i) => { if (h && h.getBoundingClientRect().top < innerHeight * .35) atual = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === atual));
      // Opção 9: a barra presa no topo mostra a seção em leitura
      if (barra) {
        barra.querySelector('.b-n').textContent = String(atual + 1).padStart(2, '0') + ' / ' + String(links.length).padStart(2, '0');
        barra.querySelector('.b-t').textContent = links[atual].textContent;
      }
    };
    if (barra) {
      links.forEach(a => a.addEventListener('click', () => { barra.open = false; }));
      addEventListener('click', e => { if (barra.open && !barra.contains(e.target)) barra.open = false; });
    }
    addEventListener('scroll', marcar, { passive: true });
    marcar();
  }
  // Opções 6 e 8: depois que a leitura começa, o índice se apaga (acende de novo com o mouse)
  const texto = document.querySelector('.prose');
  const lendo = () => document.body.classList.toggle('lendo', texto.getBoundingClientRect().top < innerHeight * .3);
  addEventListener('scroll', lendo, { passive: true });
  lendo();
  // Opção 8: os itens do checklist vão sendo marcados conforme sobem na tela
  const itens = document.querySelectorAll('.prose ul.check li');
  if (itens.length) {
    const ver = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ok'); ver.unobserve(e.target); } }), { rootMargin: '0px 0px -38% 0px' });
    itens.forEach(li => ver.observe(li));
  }
  // Opção 8: troca o fundo atrás do texto (box, faixa ou nenhum)
  document.querySelectorAll('.fundo button').forEach(b => b.addEventListener('click', () => {
    document.body.classList.remove('f-box', 'f-faixa', 'f-sem');
    document.body.classList.add('f-' + b.dataset.f);
    document.querySelectorAll('.fundo button').forEach(o => o.setAttribute('aria-pressed', o === b));
  }));
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, `post-opcao${n}.html`), pagina);
  // Opção escolhida (8): cópia limpa, sem a faixa de explicação nem os seletores, com o fundo em box
  if (n === 8) {
    const limpa = pagina
      .replace(/<p class="po-nota">[\s\S]*?<\/p>\n/, "")
      .replace(/<nav class="opts"[\s\S]*?<\/nav>\n/, "")
      .replace(/<div class="opts fundo"[\s\S]*?<\/div>\n/, "")
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${post.titulo} · Impulso Filmes (mockup)</title>`)
      .replace('<body class="po po8 f-box">', '<body class="po po8 f-box capa-2 txt-1 bul-1">');
    fs.writeFileSync(path.join(OUT, "post-modelo.html"), limpa);
    // Mesma página, com um botão para comparar quatro formas de resolver a capa (classes capa-1 a capa-4 no body)
    const CAPAS = ["Abaixo do menu", "Degradê no topo", "Emoldurada", "Título fora da foto"];
    fs.writeFileSync(path.join(OUT, "post-texto.html"), limpa
      .replace('capa-2 txt-0', 'capa-2 txt-1')
      .replace("</body>", `<div class="opts textos" role="group" aria-label="Opções de hierarquia do texto"><span>Texto</span>${["Como estava", "Recuo em degraus", "Lista em quadro", "Passo com trilho"].map((t, i) => `<button type="button" data-t="${i}" title="${t}" aria-pressed="${i === 1}">${i}</button>`).join("")}<span class="txt-nome">Recuo em degraus</span></div>
<script>
  document.querySelectorAll('.textos button').forEach(b => b.addEventListener('click', () => {
    document.body.className = document.body.className.replace(/txt-\\d/, 'txt-' + b.dataset.t);
    document.querySelectorAll('.textos button').forEach(o => o.setAttribute('aria-pressed', o === b));
    document.querySelector('.txt-nome').textContent = b.title;
  }));
</script>
</body>`));
    // post-lista.html: comparação dos marcadores de lista (classes bul-0 a bul-3 no body)
    const BULS = ["Traço", "Ponto", "Anel", "Seta fina"];
    fs.writeFileSync(path.join(OUT, "post-lista.html"), limpa

      .replace("</body>", `<div class="opts listas" role="group" aria-label="Opções de marcador de lista"><span>Lista</span>${BULS.map((t, i) => `<button type="button" data-b="${i}" title="${t}" aria-pressed="${i === 1}">${i}</button>`).join("")}<span class="txt-nome">${BULS[1]}</span></div>
<script>
  document.querySelectorAll('.listas button').forEach(b => b.addEventListener('click', () => {
    document.body.className = document.body.className.replace(/bul-\\d/, 'bul-' + b.dataset.b);
    document.querySelectorAll('.listas button').forEach(o => o.setAttribute('aria-pressed', o === b));
    document.querySelector('.listas .txt-nome').textContent = b.title;
  }));
</script>
</body>`));
    // post-capa.html: comparação das quatro capas (escolhida: 2, degradê no topo)
    fs.writeFileSync(path.join(OUT, "post-capa.html"), limpa
      .replace("</body>", `<div class="opts capas" role="group" aria-label="Opções de capa"><span>Capa</span>${CAPAS.map((t, i) => `<button type="button" data-c="${i + 1}" title="${t}" aria-pressed="${i === 1}">${i + 1}</button>`).join("")}<span class="capa-nome">${CAPAS[1]}</span></div>
<script>
  document.querySelectorAll('.capas button').forEach(b => b.addEventListener('click', () => {
    document.body.className = document.body.className.replace(/capa-\\d/, 'capa-' + b.dataset.c);
    document.querySelectorAll('.capas button').forEach(o => o.setAttribute('aria-pressed', o === b));
    document.querySelector('.capa-nome').textContent = b.title;
    scrollTo({ top: 0 });
  }));
</script>
</body>`));
  }
});
console.log(OPCOES.length + " opções de artigo geradas a partir de:", post.slug, "| seções:", indice.length);
