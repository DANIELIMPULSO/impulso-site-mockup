// Gera as páginas de comparação do MAKING OF, a partir de páginas já geradas:
//   case-makingof.html         = página simples de portfólio (SKA) com três formas de mostrar o making of
//   case-estudo-makingof.html  = página de case (SKA) com as mesmas três formas
// Nem todo projeto tem making of: no WordPress será um campo opcional do projeto (ligar/desligar + vídeo + capa).
// MARCADOR DE LUGAR: o vídeo usado aqui é outro filme da SKA (aftermovie do SKA Connect), só para ver o layout.
// Uso: node _build/makingof.js   (rodar depois de build.js e de case-estudo.js)
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..");
const UP = "https://www.impulsofilmes.com.br/wp-content/uploads/";
const VIDEO = "https://player.vimeo.com/video/1192056690?h=af350fdea5&autoplay=1&title=0&byline=0&portrait=0";
const CAPA = UP + "2026/02/image-6.jpg";

const player = extra => `<div class="player mk-player${extra}" data-embed="${VIDEO.replace(/&/g, "&amp;")}"><button class="player-poster" type="button" data-cursor="PLAY" aria-label="Assistir ao making of"><img loading="lazy" src="${CAPA}" alt=""><span class="play" aria-hidden="true"></span></button></div>`;
const NOMES = ["Seção própria", "Abas no player", "Junto dos bastidores"];

const montar = (origem, destino, titulo) => {
  let h = fs.readFileSync(path.join(OUT, origem), "utf8");
  const troca = (re, por, nome) => { if (!re.test(h)) throw new Error(origem + ": não achei " + nome); h = h.replace(re, por); };

  // 2. Abas no player: "Filme" e "Making of" trocam o vídeo no mesmo lugar
  troca(/<div class="player" data-embed="[^"]*">[\s\S]*?<\/button>\s*<\/div>/, m => `<div class="mk-palco">
    <div class="mk-abas" role="group" aria-label="Escolher vídeo"><button type="button" data-ver="filme" aria-pressed="true">Filme</button><button type="button" data-ver="mk" aria-pressed="false">Making of</button></div>
    ${m}
    ${player("")}
  </div>`, "o player principal");

  // 1. Seção própria, logo antes dos bastidores: título de um lado, vídeo do outro
  troca(/<section class="block[^"]*c-back">/, m => `<section class="block rule mk-sec" aria-label="Making of">
  <div class="statement reveal"><p class="eyebrow">Making of</p><h2>Por trás das câmeras.</h2><p>Como o filme foi feito, do primeiro dia de gravação à finalização.</p></div>
  ${player(" wide")}
</section>

${m}`, "a seção de bastidores");

  // 3. Junto dos bastidores: o making of é o primeiro quadro da grade, maior que as fotos
  troca(/<ul class="shots"[^>]*>/, m => `${m}
    <li class="mk-tile reveal">${player("")}<span class="mk-selo">Making of</span></li>`, "a grade de bastidores");

  troca(/<body class="([^"]*)">|<body>/, (m, c) => `<body class="${c ? c + " " : ""}mk-3">`, "o body");
  troca(/<\/head>/, `<link rel="stylesheet" href="makingof.css">\n</head>`, "o head");
  troca(/<title>[^<]*<\/title>/, `<title>${titulo} · Impulso Filmes (mockup)</title>`, "o título");
  troca(/<\/body>/, `<div class="opts mk-op" role="group" aria-label="Onde fica o making of"><span>Making of</span>${NOMES.map((t, i) => `<button type="button" data-m="${i + 1}" title="${t}" aria-pressed="${i === 2}">${i + 1}</button>`).join("")}<button type="button" data-m="0" title="Projeto sem making of" aria-pressed="false">Sem</button><span class="mk-nome">${NOMES[2]}</span></div>
<script src="makingof.js"></script>
</body>`, "o fim do body");
  fs.writeFileSync(path.join(OUT, destino), h);
  console.log(destino, "gerado");
};

montar("case-ska-institucional.html", "case-makingof.html", "Página simples com making of");
montar("case-estudo.html", "case-estudo-makingof.html", "Página de case com making of");
