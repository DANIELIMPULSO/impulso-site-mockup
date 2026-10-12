// Layout final da página de artigo do blog (fechado em 2026-10-12: opção 8, capa com degradê no topo, recuo em degraus, listas com ponto).
// Recebe o HTML já limpo de um post e devolve o corpo marcado para o layout, mais o índice de seções.
// No tema WordPress, as mesmas marcações terão de ser feitas por um filtro em the_content (ver LEIA-ME.md, "Página de artigo").
const cheerio = require("cheerio");

const dois = k => String(k).padStart(2, "0");

function montar(html) {
  const $ = cheerio.load(html, null, false);

  // 1. Índice: cada h2 ganha um id
  const indice = [];
  $.root().children("h2").each((k, h) => { const id = "s" + (k + 1); $(h).attr("id", id); indice.push([id, $(h).text().trim()]); });

  // 2. Introdução: tudo o que vem antes do primeiro h2 entra, recolhível, sob o chapéu "O que você vai encontrar neste artigo"
  const filhos = $.root().children().toArray();
  const primeiroH2 = filhos.findIndex(el => el.tagName === "h2");
  const intro = primeiroH2 > 0 ? filhos.slice(0, primeiroH2) : [];
  if (intro.length && $(intro).text().trim()) {
    const caixa = $('<details class="chamada" open><summary><span>O que você vai encontrar neste artigo</span></summary></details>');
    $(intro[0]).before(caixa);
    intro.forEach(el => caixa.append(el));
  }

  // 3. Subtítulos que começam com número ("2. Defina...") : o número sai do texto e vira marcador amarelo
  $.root().children("h3").each((_, h) => {
    const primeiro = $(h).contents().first();
    const alvo = primeiro.length && primeiro[0].type === "tag" && /^(b|strong)$/.test(primeiro[0].name) ? primeiro : $(h);
    const no = alvo.contents().first();
    const m = no.length && no[0].type === "text" && no[0].data.match(/^\s*(\d{1,2})\.\s+/);
    if (!m) return;
    no[0].data = no[0].data.slice(m[0].length);
    $(h).addClass("num").prepend(`<span class="h3-n" aria-hidden="true">${dois(m[1])}</span>`);
  });

  // 4. Passos: cada h3 e o que vem depois dele, até o próximo h3 ou h2, viram um bloco (permite recuar o texto sob o subtítulo)
  let bloco = null;
  $.root().children().toArray().forEach(el => {
    if (el.tagName === "h2") { bloco = null; return; }
    if (el.tagName === "details") return;
    if (el.tagName === "h3") { bloco = $('<section class="passo"></section>'); $(el).before(bloco); }
    if (bloco) bloco.append(el);
  });

  // 5. Checklist: parágrafo com linhas "☐ item" separadas por <br> vira lista de caixas, marcadas ao rolar a página
  $("p").each((_, p) => {
    const linhas = ($(p).html() || "").split(/<br\s*\/?>/).map(l => l.trim()).filter(Boolean);
    if (linhas.length > 1 && linhas.every(l => /^☐/.test(l))) $(p).replaceWith(`<ul class="check">${linhas.map(l => `<li>${l.replace(/^☐\s*/, "")}</li>`).join("")}</ul>`);
  });

  // 6. Listas: "Leia também" vira bloco à parte; a frase terminada em ":" que anuncia uma lista fica marcada
  $("ul").each((_, ul) => {
    const itens = $(ul).children("li");
    if (itens.length === 1 && /^\s*Leia também/i.test(itens.text())) $(ul).addClass("leia");
    else if (/:\s*$/.test($(ul).prev("p").text())) $(ul).prev("p").addClass("anuncia");
  });

  return { corpo: $.html(), indice };
}

// Classes do body que ligam o layout em post-opcoes.css
const CLASSES = "po po8 f-box capa-2 txt-1 bul-1";

const toc = indice => indice.length < 2 ? "" :
  `<nav class="toc" aria-label="Neste artigo"><p class="eyebrow">Neste artigo</p><ol>${indice.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("")}</ol></nav>`;

module.exports = { montar, toc, CLASSES };
