// Gera case-estudo.html: proposta de página de CASE (estudo de caso), separada da página simples de portfólio (case.html).
// Conteúdo real: vem da página do projeto SKA e do artigo "Videocase industrial: como a SKA fortaleceu sua autoridade..." do blog.
// O gráfico de "antes e depois" usa DADOS DE EXEMPLO, marcados como tal na página; trocar pelos números reais de cada cliente.
// Uso: node _build/case-estudo.js   (não precisa de cheerio)
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..");
const UP = "https://www.impulsofilmes.com.br/wp-content/uploads/";
const WA = "https://wa.me/553235124803";
const base = fs.readFileSync(path.join(OUT, "sobre.html"), "utf8");
const NAV = base.match(/<nav id="menu"[\s\S]*?<\/nav>(?=\s*<\/header>)/)[0];
const FOOT = base.match(/<footer class="foot">[\s\S]*?<\/footer>/)[0];

const ato = (n, rotulo, titulo, corpo) => `
<section class="block rule ce-ato">
  <header class="ce-ato-h">
    <span class="ce-n" aria-hidden="true">${n}</span>
    <p class="eyebrow">${rotulo}</p>
    <h2>${titulo}</h2>
  </header>
  <div class="ce-ato-c">${corpo}</div>
  <button class="ce-mais" type="button" aria-expanded="false">Ler a história completa</button>
</section>`;

const FOTOS = [3, 2, 4, 5, 6, 7, 8, 9];
const FICHA = [["Cliente", "SKA"], ["Formato", "Vídeo institucional"], ["Direção e fotografia", "Kiko Barbosa"], ["Assistentes de câmera", "Jhonatas Amaral e Yuri Fagundes"], ["Produção", "Marília Ribeiro"], ["Montagem", "João Pedro Aguilar"], ["Finalização", "Daniel Couto"], ["Marketing SKA", "Gabrielle Bitelo, Maria Eduarda Weschenfelder"]];

const main = `
<!-- ABERTURA: o cliente, a frase que resume o case e os dados de contexto -->
<section class="ce-hero">
  <img class="ce-bg" src="${UP}2026/02/image-3.jpg" alt="">
  <div class="ce-hero-in">
    <div class="ce-hero-txt">
      <nav class="crumbs" aria-label="Você está em"><a href="portfolio.html">Portfólio</a><span aria-hidden="true">/</span><a href="portfolio.html">Case</a></nav>
      <h1 class="ce-title">SKA</h1>
      <p class="ce-sub">Como uma empresa de tecnologia para a indústria transformou a experiência dos seus clientes em autoridade de marca.</p>
    </div>
    <div class="ce-slot" id="slot-hero">
      <figure class="ce-topo"><div class="player" data-embed="https://player.vimeo.com/video/1161449329?autoplay=1&title=0&byline=0&portrait=0"><button class="player-poster" type="button" data-cursor="PLAY" aria-label="Assistir ao filme SKA"><img src="${UP}2026/02/image-3.jpg" alt=""><span class="play" aria-hidden="true"></span></button></div></figure>
    </div>
    <dl class="ce-facts">
      <div><dt>Cliente</dt><dd>SKA</dd></div>
      <div><dt>Setor</dt><dd>Tecnologia para a indústria</dd></div>
      <div><dt>Escopo</dt><dd>Filme institucional, videocases, cobertura de eventos e banco de imagens</dd></div>
      <div><dt>Onde</dt><dd>14 cidades, em 6 estados</dd></div>
    </dl>
  </div>
  <span class="ce-rolar" aria-hidden="true"><i></i><i></i><i></i></span>
</section>

<!-- RESUMO EM UMA TELA (opção 6): o case inteiro em três cartões -->
<section class="block ce-resumo" aria-label="O case em resumo">
  <article><p class="eyebrow">O desafio</p><p>Padronizar vídeos gravados em regiões diferentes do país, entregar mais rápido e deixar de depender de bancos de imagens genéricos.</p></article>
  <article><p class="eyebrow">O que fizemos</p><p>Filme institucional em 14 cidades, 15 videocases com clientes, cobertura de eventos e um banco de imagens próprio.</p></article>
  <article><p class="eyebrow">O resultado</p><p>Uma só linguagem visual em todo o país, mais tempo para o marketing e imagens que nenhum concorrente tem.</p></article>
</section>

<div class="ce-corpo"><div class="ce-palco" id="slot-split"></div><div class="ce-atos">
${ato("01", "Por que nos procurou", "A comunicação precisava acompanhar o crescimento.", `
    <p class="ce-lead">A SKA fornece engenharia e tecnologia para a indústria: de softwares de CAD e simulação a hardware de manufatura aditiva e plataformas próprias de gestão industrial, como o SKA MES.</p>
    <p>Com a expansão da empresa e a internacionalização, pela união com a Go Engineer, os vídeos deixaram de ser apenas registros institucionais. Passaram a ser ferramentas de marketing, de vendas e de posicionamento.</p>
    <p>A empresa produzia videocases desde 2012. O que faltava era uma produção mais estratégica, padronizada e capaz de crescer junto com a operação.</p>`)}
${ato("02", "O desafio", "Transformar experiências de clientes em autoridade de marca.", `
    <p class="ce-lead">Gravar em regiões diferentes do país sem perder a unidade, entregar mais rápido e parar de depender de bancos de imagens genéricos.</p>
    <ul class="ce-req">
      <li><b>Consistência visual</b>em produções feitas em diferentes regiões do país</li>
      <li><b>Agilidade</b>nos fluxos de entrega</li>
      <li><b>Qualidade técnica</b>mais alta em todos os materiais</li>
      <li><b>Prova social</b>mais forte para a marca</li>
      <li><b>Materiais versáteis</b>para campanhas, eventos, equipe comercial e redes sociais</li>
      <li><b>Identidade própria</b>com imagens reais das operações e dos clientes</li>
    </ul>`)}
${ato("03", "O que entregamos", "Uma estratégia audiovisual contínua, não um vídeo isolado.", `
    <p class="ce-lead">Para traduzir a essência da SKA, percorremos o país gravando o manifesto institucional que mostra como a empresa conecta pessoas, processos e tecnologia para impulsionar a indústria.</p>
    <figure class="ce-filme">
      <div class="player" data-embed="https://player.vimeo.com/video/1161449329?autoplay=1&title=0&byline=0&portrait=0"><button class="player-poster" type="button" data-cursor="PLAY" aria-label="Assistir ao filme SKA"><img loading="lazy" src="${UP}2026/02/image-3.jpg" alt=""><span class="play" aria-hidden="true"></span></button></div>
      <figcaption>Filme institucional SKA. O vídeo só carrega quando a pessoa aperta o play.</figcaption>
    </figure>
    <ol class="ce-entregas">
      <li><b>Filme institucional</b><span>Gravado em 14 cidades e 6 estados, percorrendo operações e realidades diferentes.</span></li>
      <li><b>15 videocases</b><span>Histórias de clientes da SKA em vários segmentos da indústria, usadas pelo comercial e pelo marketing.</span></li>
      <li><b>Cobertura de eventos</b><span>Conteúdo institucional, palestras, networking e ativações dos eventos estratégicos da marca.</span></li>
      <li><b>Banco de imagens próprio</b><span>Imagens reais das operações, dos clientes e dos ambientes industriais da SKA.</span></li>
    </ol>`)}
</div></div>

<!-- RESULTADO: números em gráfico animado e ganhos qualitativos em "antes e depois" -->
<section class="block rule ce-res">
  <header class="ce-ato-h ce-res-h">
    <span class="ce-n" aria-hidden="true">04</span>
    <p class="eyebrow">O resultado</p>
    <h2>Mais tempo, mais padrão e uma imagem que ninguém mais tem.</h2>
  </header>

  <div class="ce-res-grid">
    <!-- quantitativo -->
    <figure class="ce-grafico" id="grafico">
      <figcaption>
        <p class="eyebrow">Em números</p>
        <span class="ce-exemplo">Dados de exemplo</span>
      </figcaption>
      <div class="ce-barras" role="img" aria-label="Gráfico de exemplo comparando antes e depois em três indicadores">
        <div class="ce-grupo"><div class="ce-par"><i style="--v:38" data-v="38"></i><i class="d" style="--v:92" data-v="92"></i></div><span>Visualizações dos vídeos</span></div>
        <div class="ce-grupo"><div class="ce-par"><i style="--v:24" data-v="24"></i><i class="d" style="--v:71" data-v="71"></i></div><span>Contatos pelo comercial</span></div>
        <div class="ce-grupo"><div class="ce-par"><i style="--v:52" data-v="52"></i><i class="d" style="--v:100" data-v="100"></i></div><span>Materiais reaproveitados</span></div>
      </div>
      <p class="ce-legenda"><span><i></i>Antes</span><span><i class="d"></i>Depois da parceria</span></p>
      <p class="ce-nota">Este gráfico mostra como os números de um case podem aparecer. Os valores acima são ilustrativos e devem ser trocados pelos dados reais do cliente.</p>
    </figure>

    <!-- qualitativo -->
    <div class="ce-quali">
      <p class="eyebrow">Na prática</p>
      <ul class="ce-troca">
        <li><s>Banco de imagens genérico, igual ao do concorrente</s><b>Banco de imagens próprio, com o chão de fábrica da SKA</b></li>
        <li><s>Vídeos com padrões diferentes a cada região</s><b>A mesma linguagem visual em todo o país</b></li>
        <li><s>Tempo do marketing gasto alinhando fornecedores</s><b>Um parceiro fixo, e mais tempo para a estratégia</b></li>
        <li><s>Vídeo como registro institucional</s><b>Vídeo como ferramenta de vendas e de posicionamento</b></li>
      </ul>
    </div>
  </div>

  <!-- números do projeto: contam de zero até o valor quando entram na tela -->
  <div class="ce-nums" aria-label="O projeto em números">
    <div class="ce-num"><b data-conta="15">15</b><span>videocases com clientes da SKA</span></div>
    <div class="ce-num"><b data-conta="14">14</b><span>cidades percorridas no filme institucional</span></div>
    <div class="ce-num"><b data-conta="6">6</b><span>estados do Brasil</span></div>
    <div class="ce-num"><b data-conta="35">35</b><span>anos de história da SKA contados no filme</span></div>
  </div>

  <!-- a voz do cliente: foto do filme ao lado e retrato pequeno de quem fala junto do nome.
       O retrato é lido de fotos/gabriele-bitello.png; enquanto o arquivo não existir, aparecem as iniciais. -->
  <figure class="ce-voz">
    <div class="ce-voz-txt">
      <blockquote>
        <p>Com a Impulso conseguimos formar um banco de imagem próprio. Antes a gente pegava muito banco de imagem e às vezes via um comercial de um concorrente nosso que usava a mesma imagem.</p>
        <p class="ce-destaque">Hoje é o nosso chão de fábrica, ninguém tem igual.</p>
      </blockquote>
      <figcaption><span class="ce-avatar" data-iniciais="GB"><img src="fotos/gabriele-bitello.png" alt="" onerror="this.remove()"></span><span><b>Gabriele Bitello</b>Analista Sênior de Marketing e Criação · SKA</span></figcaption>
    </div>
    <div class="ce-voz-foto ce-voz-b" aria-hidden="true"><img loading="lazy" src="${UP}2026/02/image-5.jpg" alt=""></div>
  </figure>
</section>

<!-- FICHA TÉCNICA -->
<section class="block c-credits reveal" aria-label="Ficha técnica">
  <p class="eyebrow">Ficha técnica</p>
  <dl>
    ${FICHA.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("\n    ")}
  </dl>
</section>

<!-- BASTIDORES -->
<section class="block c-back">
  <div class="statement reveal"><h2>Bastidores do projeto.</h2></div>
  <ul class="shots">
    ${FOTOS.map((n, k) => `<li class="reveal"><button type="button" data-full="${UP}2026/02/image-${n}.jpg" aria-label="Ampliar foto ${k + 1} de ${FOTOS.length}"><img loading="lazy" src="${UP}2026/02/image-${n}-480x360.jpg" alt="Bastidores da gravação, foto ${k + 1}"></button></li>`).join("\n    ")}
  </ul>
</section>

<!-- CHAMADA FINAL -->
<section class="c-cta">
  <div class="statement reveal">
    <h2>Quer um resultado assim para a sua empresa?</h2>
    <p>Conte o que você precisa e receba um orçamento personalizado.</p>
    <div class="actions">
      <a class="btn solid" href="orcamento.html">Quero um orçamento</a>
      <a class="btn ghost" href="${WA}" target="_blank" rel="noopener">Chamar no WhatsApp</a>
    </div>
  </div>
</section>
`;

const MAKING_OF_PROVISORIO = `<li class="mk-tile reveal"><div class="player mk-player" data-embed="https://player.vimeo.com/video/1192056690?h=af350fdea5&amp;autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0"><button class="player-poster" type="button" data-cursor="PLAY" aria-label="Assistir ao making of"><img loading="lazy" src="${UP}2026/02/image-6.jpg" alt=""><span class="play" aria-hidden="true"></span></button></div><span class="mk-selo">Making of</span></li>`;
const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Case SKA · Impulso Filmes (mockup)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;600&family=Work+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="pages.css">
<link rel="stylesheet" href="case.css">
<link rel="stylesheet" href="extra.css">
<link rel="stylesheet" href="case-estudo.css">
</head>
<body class="ce cv-6 dep-b">

<div class="progress" aria-hidden="true"></div>

<header class="top" id="top">
  <a class="logo" href="index.html" aria-label="Impulso Filmes, início">
    <img src="${UP}2023/12/cropped-logo.png" alt="Impulso Filmes" width="240" height="80">
  </a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
  ${NAV}
</header>

<main>
${main}
</main>

${FOOT}

<a class="zap" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
<div class="opts casos" role="group" aria-label="Opções de página de case"><span>Case</span>${["História longa, foto na abertura", "Filme em tela cheia", "Filme com resumo ao lado", "Título, filme e números", "Filme preso ao lado", "Resumo em uma tela"].map((t, i) => `<button type="button" data-v="${i + 1}" title="${t}" aria-pressed="${i === 5}">${i + 1}</button>`).join("")}<span class="cv-nome">Resumo em uma tela</span><a href="case-ska-simples.html">Página simples</a></div>

<dialog class="lightbox" id="lightbox" aria-label="Foto ampliada"><img alt=""><button type="button">Fechar</button></dialog>
<div class="cursor" aria-hidden="true"></div><div class="dot" aria-hidden="true"></div>

<script src="pages.js"></script>
<script src="case-estudo.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, "case-estudo.html"), pagina);
// Página oficial do projeto SKA: o mesmo case, no formato escolhido (6), sem o botão de comparação
fs.writeFileSync(path.join(OUT, "case-ska-institucional.html"), pagina.replace(/<div class="opts casos"[\s\S]*?<\/div>\n/, "").replace("<title>Case SKA · Impulso Filmes (mockup)</title>", "<title>SKA · Case · Impulso Filmes (mockup)</title>")
  // making of PROVISÓRIO (outro filme da SKA, só para ver o layout): primeiro quadro da grade de bastidores
  .replace('<ul class="shots">', '<ul class="shots">\n    ' + MAKING_OF_PROVISORIO)
  .replace('<body class="ce cv-6 dep-b">', '<body class="ce cv-6 dep-b mk-3">')
  .replace("</head>", '<link rel="stylesheet" href="makingof.css">\n</head>'));

console.log("case-estudo.html e case-ska-institucional.html gerados");
