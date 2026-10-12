// Gera clientes.html, autorais.html e capacitacao.html no mockup, unifica o menu em todas as páginas
// e remove a palavra gigante de fundo ("Orçamento" etc.) de todas elas.
const fs = require("fs");
const path = require("path");
const dir = __dirname;
const f = n => path.join(dir, n);
const UP = "https://www.impulsofilmes.com.br/wp-content/uploads/";

const NAV = `<nav id="menu" aria-label="Principal">
    <a href="index.html#sobre">Sobre</a>
    <a href="index.html#portfolio">Portfólio</a>
    <a href="servico.html">Soluções</a>
    <a href="capacitacao.html">Capacitação</a>
    <a href="autorais.html">Autorais</a>
    <a href="clientes.html">Clientes</a>
    <a href="index.html#blog">Blog</a>
    <a class="cta" href="orcamento.html">Orçamento</a>
  </nav>`;

const page = (title, main) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title} · Impulso Filmes (mockup)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="pages.css">
</head>
<body>

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

<footer class="foot">
  <img class="foot-logo" src="${UP}2023/12/cropped-logo.png" alt="Impulso Filmes" width="240" height="80">
  <div>
    <a href="tel:553235124803">(32) 3512-4803</a>
    <a href="mailto:atendimento@impulsofilmes.com.br">atendimento@impulsofilmes.com.br</a>
  </div>
  <div>
    <a href="https://www.instagram.com/impulsofilmes" target="_blank" rel="noopener">Instagram</a>
    <a href="https://br.linkedin.com/company/impulsofilmes" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://vimeo.com/impulsofilmes" target="_blank" rel="noopener">Vimeo</a>
    <a href="https://www.youtube.com/@ImpulsoFilmes" target="_blank" rel="noopener">YouTube</a>
  </div>
  <p class="legal">© Impulso Filmes · Todos os direitos reservados · <a href="https://www.impulsofilmes.com.br/politica-de-privacidade-e-cookies" target="_blank" rel="noopener">Política de Privacidade e Cookies</a></p>
</footer>

<a class="zap" href="https://wa.me/553235124803" target="_blank" rel="noopener">WhatsApp</a>

<dialog class="lightbox" id="lightbox" aria-label="Foto ampliada"><img alt=""><button type="button">Fechar</button></dialog>
<div class="cursor" aria-hidden="true"></div><div class="dot" aria-hidden="true"></div>

<script src="pages.js"></script>
</body>
</html>
`;

// Abertura padrão: título de um lado, texto do outro, mídia de fundo
const hero = ({ chapeu, linhas, texto, botoes, midia }) => `
<section class="p-hero">
  ${midia}
  <div class="p-shade"></div>
  <p class="timecode" aria-hidden="true"><span class="rec"></span>REC <span id="tc">00:00:00:00</span></p>
  <div class="p-inner">
    <div>
      <p class="eyebrow">${chapeu}</p>
      <h1 class="p-title" aria-label="${linhas.join(" ")}">${linhas.map(l => `<span>${l}</span>`).join("")}</h1>
    </div>
    <div class="p-intro">
      ${texto}
      <div class="actions">${botoes}</div>
    </div>
  </div>
</section>`;

const HOME_VIDEO = `<video class="p-bg" autoplay muted loop playsinline aria-hidden="true" src="${UP}2024/08/IMPULSOBANNER2024_05.mp4"></video>`;

const cta = (titulo, texto) => `
<section class="p-cta">
  <div class="statement reveal">
    <h2>${titulo}</h2>
    <p>${texto}</p>
    <div class="actions">
      <a class="btn solid" href="orcamento.html">Fale com um especialista</a>
      <a class="btn ghost" href="https://wa.me/553235124803" target="_blank" rel="noopener">Chamar no WhatsApp</a>
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------- CLIENTES
const LOGOS = ["2024/05/SAUDALI_LOGO", "2024/05/SUPPORTE_LOGO", "2023/12/m4", "2023/12/m5", "2023/12/m6", "2024/05/ARCELORMITTAL_LOGO-1", "2023/12/m7", "2023/12/m8", "2023/12/m9", "2023/12/m10", "2023/12/m11", "2024/05/FUNDACAO_ESTUDAR_LOGO", "2024/05/CALHADAS_LOGO", "2024/05/NEXINVOICE_LOGO", "2024/05/UNIMED_LOGO", "2024/05/TR_LOGO", "2024/05/CODEMIG_LOGO", "2024/05/CANAL_BRASIL_LOGO", "2024/05/UR_LOGO", "2024/05/ORALUNIC_LOGO-2", "2024/05/UAU_HUB_LOGO", "2024/05/CURTA_LOGO", "2024/05/logo-dispetral", "2024/05/CBA_LOGO"];
const VOZES = [
  ["Marcos Villas Boas", "República Comunicação · Juiz de Fora (MG)", "2024/06/MARCOS", "Seguramente, boa parte dos melhores filmes que a República produziu tem a assinatura da Impulso. Direção de fotografia impecável, produção cuidadosa, edição primorosa e um set leve e ágil são algumas das características dessa nossa parceria que já dura mais de 15 anos. No processo de construção de cada filme, a troca de ideias é sempre rica e muito produtiva. Tudo é muito estudado, detalhado, pensado para evitar surpresas. E quando elas aparecem (o que é inevitável em produção), a Impulso sempre tem uma boa solução."],
  ["Gabriel Veagnoli", "Tractian · São Paulo (SP)", "2023/12/people", "Minha experiência com a Impulso foi excelente. A equipe foi atenciosa desde o início, desenvolvendo ideias juntos e trazendo melhorias para o projeto. São altamente experientes e técnicos, além de serem divertidos e amigáveis. A nossa integração facilitou bastante, tornando todo o processo agradável e garantindo bons resultados para nossa campanha. Recomendo a Impulso para quem busca excelência, e gosta de se divertir no caminho."],
  ["Claudia Gentile", "ArcelorMittal · Juiz de Fora (MG)", "2024/07/CLAUDINHA", "A equipe da Impulso atende a demandas da nossa Comunicação em campanhas internas e externas, sempre em conformidade com os escopos elaborados para cada objetivo de engajamento."],
  ["Esmeralda Canazart", "Saudali · Ponte Nova (MG)", "2024/07/ESMERALDA", "Acredito que um filme retrata uma história, propósitos e valores de uma marca, produto ou serviço. E foi assim que a Impulso fez, traduziu nossos projetos e ideias em filmes publicitários e institucionais repletos de emoções. Entregas que somam muito à apresentação da marca Saudali."],
  ["Ana Tereza Maito", "UAU!HUB · Curitiba (PR)", "2024/08/ANA-TEREZA-1", "Trabalhar com a Impulso foi excelente. A equipe mostrou grande profissionalismo e habilidade em traduzir nossa visão em conteúdo de alta qualidade. A dedicação e competência de cada membro foram notáveis, atendendo às nossas expectativas e às do cliente. A atenção aos detalhes, criatividade e adaptação foram fundamentais para o sucesso do projeto. Recomendo para qualquer empresa ou marca em busca de resultados incríveis e uma parceria de confiança."],
  ["Dimitre Lima", "Medical Indicators (USA) · Marketing Manager", "2026/08/Dimitre-Lima-Prova-Social", "Todos da equipe Impulso foram extremamente solícitos e entenderam todas as necessidades que precisávamos para a criação de uma série de vídeos indicando a utilização correta dos nossos produtos. Procurávamos um visual mais moderno, cativante, adequado ao nosso orçamento. Ficamos muito felizes com as entregas e os resultados de todos os processos."],
  ["Iago Moreira", "Supporte Logística · Uberlândia (MG)", "2024/09/IAGO", "Descobrimos a Impulso Filmes durante nossa busca por um parceiro para produzir um vídeo em comemoração aos 25 anos da empresa, além de um institucional. Desde o primeiro contato, o atendimento foi excepcional e se manteve assim até a entrega final do projeto. O que mais nos surpreendeu foi a dedicação e o empenho da equipe, que se dedicou a ir a fundo no conceito do nosso negócio para garantir que isso fosse claramente refletido no vídeo. Ao contrário de muitas outras empresas, a Impulso fez questão de ir além para atender nossas necessidades."],
  ["Jaqueline Machado", "OS3 Comunicação · Ponte Nova (MG)", "2024/05/JAQUE", "As boas parcerias não nascem do acaso. Elas são feitas de conexões: de ideias, princípios e boa vontade. Assim, conectados com as expectativas de nossos clientes, encontramos na Impulso a parceria ideal para contar ao mundo as suas histórias. Agilidade, presteza e pontualidade são apenas algumas das qualidades que admiramos nessa galera e, sempre que pensamos em grandes projetos, a luz que clareia nossas ideias vem acompanhada de um nome: Impulso. Obrigada, pessoal. Vocês são 10!"],
  ["Fernanda Caputo", "Dispetral · Juiz de Fora (MG)", "2024/05/FERNANDA", "Sensibilidade ao contar histórias, atenção aos detalhes, criatividade e competência técnica são características que certamente vão encontrar nessa equipe desde o primeiro contato. Seja nas reuniões de alinhamento, nas gravações até a entrega dos materiais. Em todos os processos nos deparamos com excelência em atendimento, em produção, em contar histórias com sentimento e identidade. Impulso é sinônimo de parceria de sucesso!"],
  ["Gihana Fava", "E-Dialog · Juiz de Fora (MG)", "2024/05/GIHANA", "A Impulso nos atendeu com muita qualidade em todos os processos. Fiquei positivamente surpresa com o texto do roteiro porque conseguiram expressar de forma muito original nossos valores e intenções, sem perder a nossa identidade. O resultado superou nossas expectativas!"],
];
const p2 = n => String(n).padStart(2, "0");

const clientes = hero({
  chapeu: "Clientes",
  linhas: ["Veja quem confiou", "sua marca à Impulso"],
  texto: `<p class="lead">Na Impulso Filmes, atendemos <strong>clientes de diferentes setores</strong>, tanto no Brasil quanto no exterior.</p>
      <p class="p-sub">Nossa expertise abrange tecnologia, saúde, educação, varejo e indústria, oferecendo <strong>soluções audiovisuais personalizadas</strong> que impulsionam o sucesso de cada projeto.</p>`,
  botoes: `<a class="btn solid" href="orcamento.html">Quero um orçamento</a><a class="btn ghost" href="#vozes">O que dizem sobre nós</a>`,
  midia: HOME_VIDEO,
}) + `

<!-- Parede de marcas: logos em branco que ganham a cor original ao passar o mouse -->
<section class="block rule p-wall-sec">
  <div class="sec-head">
    <div class="statement reveal"><h2>Conheça alguns de nossos clientes.</h2></div>
    <p class="count">${LOGOS.length} marcas</p>
  </div>
  <ul class="wall" id="wall">
${LOGOS.map((l, k) => `    <li class="reveal"><span>${p2(k + 1)}</span><img loading="lazy"${/CALHADAS|UNIMED|dispetral/.test(l) ? ' class="fill"' : ""} src="${UP}${l}.png" alt="Logo de cliente ${k + 1}"></li>`).join("\n")}
  </ul>
</section>

<!-- Depoimentos: um por vez, escolhido pela lista de nomes -->
<section class="block rule voices" id="vozes">
  <div class="sec-head">
    <div class="statement reveal"><h2>Veja o que nossos clientes dizem sobre nós.</h2></div>
    <div class="voice-nav">
      <span class="count" id="voice-count">01 / ${p2(VOZES.length)}</span>
      <button type="button" data-dir="-1" aria-label="Depoimento anterior">←</button>
      <button type="button" data-dir="1" aria-label="Próximo depoimento">→</button>
    </div>
  </div>
  <div class="voice-grid">
    <ol class="voice-list" id="voice-list" aria-label="Escolher depoimento"></ol>
    <div class="voice-stage" id="voice-stage">
      <span class="voice-bar" aria-hidden="true"></span>
${VOZES.map(([nome, emp, foto, txt], k) => `      <figure class="voice${k ? "" : " on"}" data-nome="${nome}" data-emp="${emp}">
        <blockquote>${txt}</blockquote>
        <figcaption><img loading="lazy" src="${UP}${foto}-128x128.png" alt=""><span><b>${nome}</b>${emp}</span></figcaption>
      </figure>`).join("\n")}
    </div>
  </div>
</section>
` + cta("Sua marca pode ser a próxima.", "Conte o que a sua empresa precisa e receba um orçamento personalizado.");

// ---------------------------------------------------------------- PROJETOS AUTORAIS
const FILMES = [
  ["Aqueles cinco segundos", "Ficção", "15'", "2015", "2023/12/c1.png", "aqueles-cinco-segundos"],
  ["Barbante", "Ficção", "20'", "2016", "2023/12/c2.png", "barbante-curta-metragem"],
  ["Brasiliana", "Documentário", "90'", "Em finalização", "2023/12/brasiliana.png", "brasiliana-documentario"],
  ["Bulha", "Documentário", "13'", "2021", "2023/12/Bulha-Cor-web-691x1024.jpg.png", "bulha-documentario"],
  ["Doze Dias", "Documentário", "90'", "Em pré-produção", "2024/06/DOZEDIAS.png", "doze-dias-rua-das-margaridas-sequestro-documentario"],
  ["Escola de Cinema Dilermando Cruz", "Documentário", "27'", "2017", "2024/05/escola_cinema_dilermando-cruz.jpg", "escola-de-cinema-dilermando-cruz"],
  ["Piranga: O herói taciturno", "Documentário", "15'", "2022", "2024/05/PIRANGA.png", "piranga-o-heroi-taciturno-documentario"],
  ["Primeiro Ensaio", "Documentário", "5'", "2016", "2024/05/primeiro_ensaio.jpg", "primeiro-ensaio-curta-documentario"],
  ["Vinil, Poeira e Groove", "Documentário", "70'", "2018", "2024/05/VINIL.png", "vinil-poeira-e-groove-documentario"],
];
const TXT_AUTORAL = "Além dos trabalhos comerciais, a Impulso atua como núcleo criativo para o desenvolvimento de projetos autorais em televisão, cinema e outras mídias, visando editais e linhas de financiamento públicos e privados.";
const TXT_AUTORAL2 = "Curtas, médias e longa-metragens em cinema, documentários, web-séries e conteúdo para tv estão entre os trabalhos que desenvolvemos atualmente.";

const autorais = hero({
  chapeu: "Projetos autorais",
  linhas: ["Nosso maior", "impulso"],
  texto: `<p class="lead">${TXT_AUTORAL}</p>
      <p class="p-sub">${TXT_AUTORAL2}</p>`,
  botoes: `<a class="btn solid" href="#filmes">Ver os filmes</a><a class="btn ghost" href="#apoio">Quero apoiar</a>`,
  midia: `<img class="p-bg" src="${UP}2023/12/bgproject.png" alt="" aria-hidden="true">`,
}) + `

<!-- Cartazes: inclinam conforme o mouse, como um cartaz na mão -->
<section class="block rule" id="filmes">
  <div class="sec-head">
    <div class="statement reveal"><h2>Filmografia.</h2></div>
    <div class="filters" role="group" aria-label="Filtrar filmes" data-filter="#posters">
      <button type="button" aria-pressed="true" data-f="todos">Todos</button>
      <button type="button" aria-pressed="false" data-f="Ficção">Ficção</button>
      <button type="button" aria-pressed="false" data-f="Documentário">Documentário</button>
    </div>
  </div>
  <div class="posters" id="posters">
    @@POSTERS@@
  </div>
</section>

<!-- Incentivo -->
<section class="block rule support" id="apoio">
  <div class="statement reveal">
    <h2>Incentivo aos projetos.</h2>
  </div>
  <div class="support-body reveal">
    <p>${TXT_AUTORAL} ${TXT_AUTORAL2}</p>
    <ul class="points">
      <li><span>01</span>Editais e linhas de financiamento públicos</li>
      <li><span>02</span>Linhas de financiamento privadas</li>
      <li><span>03</span>Cinema, televisão, web-séries e outras mídias</li>
    </ul>
    <div class="actions"><a class="btn solid" href="orcamento.html">Quero apoiar</a></div>
  </div>
</section>

<!-- Book de projetos -->
<section class="block rule book">
  <a class="book-link reveal" href="#" data-cursor="ABRIR">
    <span class="eyebrow">Em desenvolvimento</span>
    <strong>Book de projetos</strong>
    <span class="book-go">Ver book <span aria-hidden="true">→</span></span>
  </a>
</section>
` + cta("Tem um projeto para tirar do papel?", "Fale com a gente sobre parcerias, coproduções e apoio.");

// ---------------------------------------------------------------- CAPACITAÇÃO
const FOTOS = ["9a5fc6c08ba8791d5210348360e51313-1024x768-1", "13221012_1405694983063323_6966019850839141307_n", "13239431_1405695003063321_825918095014493256_n", "13418571_1406831146283040_6071191598813825704_o-1024x682-1", "13433376_1406831756282979_4550723306804310571_o-1024x682-1", "IMG_8661-1024x683-1", "capacitacao-impulso", "novo_osvaudio-capa-1024x576-1", "novo_cursos-capa-1024x576-1", "impulso-capacitacao", "IMG_4118-scaled", "novo_11998846_879480135438346_811754795046366965_n"];

const capacitacao = hero({
  chapeu: "Capacitação",
  linhas: ["Audiovisual", "transforma"],
  texto: `<p class="lead">Acreditamos que <strong>aprender novas técnicas</strong>, <strong>discutir caminhos</strong> e <strong>trocar experiências</strong> movimentam nossa criatividade.</p>
      <p class="p-sub">Por isso, oferecemos cursos de capacitação em linguagem audiovisual, por meio de oficinas, workshops, eventos e palestras com grandes nomes do mercado.</p>`,
  botoes: `<a class="btn solid" href="orcamento.html">Fale com um especialista</a><a class="btn ghost" href="#oficinas">Ver projetos e oficinas</a>`,
  midia: `<video class="p-bg" autoplay muted loop playsinline aria-hidden="true" src="${UP}2024/06/CAPACITACAO_02.mp4"></video>`,
}) + `

<!-- O que move a capacitação -->
<section class="block rule support">
  <div class="statement reveal">
    <h2>Formar uma rede de pessoas.</h2>
  </div>
  <div class="support-body reveal">
    <p>Além de produções de qualidade, a Impulso Filmes objetiva formar uma rede de pessoas, expandir os limites do conhecimento audiovisual e fomentar o mercado local e nacional.</p>
    <ul class="points">
      <li><span>01</span>Aprender novas técnicas</li>
      <li><span>02</span>Discutir caminhos</li>
      <li><span>03</span>Trocar experiências</li>
    </ul>
    <ul class="chips" aria-label="Formatos">
      <li>Oficinas</li><li>Workshops</li><li>Eventos</li><li>Palestras</li>
    </ul>
  </div>
</section>

<!-- Galeria: colunas que andam em velocidades diferentes ao rolar -->
<section class="block rule" id="oficinas">
  <div class="sec-head">
    <div class="statement reveal">
      <h2>Projetos e oficinas.</h2>
      <p>Confira alguns projetos e oficinas realizados pela Impulso.</p>
    </div>
    <p class="count">${FOTOS.length} registros</p>
  </div>
  <div class="mosaic" id="mosaic">
${[0, 1, 2, 3].map(c => `    <div class="mosaic-col">
${FOTOS.filter((_, k) => k % 4 === c).map(n => `      <button type="button" class="reveal" data-full="${UP}2024/06/${n}.jpg" aria-label="Ampliar foto"><img loading="lazy" src="${UP}2024/06/${n}-480x360.jpg" alt="Registro de oficina da Impulso"></button>`).join("\n")}
    </div>`).join("\n")}
  </div>
</section>
` + cta("Quer levar uma oficina para a sua equipe?", "Cursos, workshops e palestras sobre linguagem audiovisual.");


module.exports = { hero, cta, clientes, capacitacao, autorais: cartazes => autorais.replace("@@POSTERS@@", cartazes) };
