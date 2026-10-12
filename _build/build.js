// Gera todas as páginas do mockup a partir de _build/data.json (criado por scrape.js).
// Uso: NODE_PATH=<pasta com node_modules contendo cheerio> node _build/build.js
// A home (index.html) é feita à mão: aqui ela só recebe o menu, o rodapé, os links e os 3 posts mais recentes.
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const fixas = require("./fixas.js");
const artigo = require("./artigo.js");
const data = require("./data.json");

const OUT = path.join(__dirname, "..");
const SITE = "https://www.impulsofilmes.com.br";
const UP = SITE + "/wp-content/uploads/";
const WA = "https://wa.me/553235124803";
const p2 = n => String(n).padStart(2, "0");
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = s => String(s || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const written = [];
const write = (file, html) => { fs.writeFileSync(path.join(OUT, file), html); written.push(file); };

// ---------------------------------------------------------------- moldura comum
const NAV = `<nav id="menu" aria-label="Principal">
    <a href="sobre.html">Sobre</a>
    <a href="portfolio.html">Portfólio</a>
    <div class="sub">
      <a href="institucional.html" aria-haspopup="true">Soluções</a>
      <div class="sub-menu">
        <a href="publicidade.html">Publicidade</a>
        <a href="institucional.html">Institucional</a>
        <a href="conteudo.html">Conteúdo</a>
      </div>
    </div>
    <a href="capacitacao.html">Capacitação</a>
    <a href="autorais.html">Autorais</a>
    <a href="clientes.html">Clientes</a>
    <a href="blog.html">Blog</a>
    <a class="cta" href="orcamento.html">Orçamento</a>
  </nav>`;

const FOOT = `<footer class="foot">
  <img class="foot-logo" src="${UP}2023/12/cropped-logo.png" alt="Impulso Filmes" width="240" height="80">
  <div>
    <a href="tel:553235124803">(32) 3512-4803</a>
    <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
  </div>
  <div>
    <a href="sobre.html">Sobre</a>
    <a href="portfolio.html">Portfólio</a>
    <a href="clientes.html">Clientes</a>
    <a href="blog.html">Blog</a>
    <a href="trabalhe-conosco.html">Trabalhe conosco</a>
    <a href="orcamento.html">Orçamento</a>
  </div>
  <div>
    <a href="https://www.instagram.com/impulsofilmes" target="_blank" rel="noopener">Instagram</a>
    <a href="https://br.linkedin.com/company/impulsofilmes" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://vimeo.com/impulsofilmes" target="_blank" rel="noopener">Vimeo</a>
    <a href="https://www.youtube.com/@ImpulsoFilmes" target="_blank" rel="noopener">YouTube</a>
  </div>
  <p class="legal">© Impulso Filmes · Todos os direitos reservados · CNPJ 20.843.669/0001-52 · <a href="politica.html">Política de Privacidade e Cookies</a></p>
</footer>`;

// o = { cls: classes do body, css: folhas de estilo extras, js: scripts extras } (usado pela página de artigo)
const page = (title, main, o = {}) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)} · Impulso Filmes (mockup)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;600&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="pages.css">
<link rel="stylesheet" href="case.css">
<link rel="stylesheet" href="servico.css">
<link rel="stylesheet" href="extra.css">${(o.css || []).map(f => `\n<link rel="stylesheet" href="${f}">`).join("")}
</head>
<body${o.cls ? ` class="${o.cls}"` : ""}>

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

<dialog class="lightbox" id="lightbox" aria-label="Foto ampliada"><img alt=""><button type="button">Fechar</button></dialog>
<div class="cursor" aria-hidden="true"></div><div class="dot" aria-hidden="true"></div>

<script src="pages.js"></script>${(o.js || []).map(f => `\n<script src="${f}"></script>`).join("")}
</body>
</html>
`;

const HOME_VIDEO = `<video class="p-bg" autoplay muted loop playsinline aria-hidden="true" src="${UP}2024/08/IMPULSOBANNER2024_05.mp4"></video>`;
const hero = fixas.hero;
const cta = fixas.cta;
const lhero = ({ chapeu, titulo, texto = "", small = false }) => `
<section class="l-hero">
  <p class="eyebrow">${chapeu}</p>
  <h1 class="l-title${small ? " small" : ""}">${titulo}</h1>
  ${texto ? `<p class="l-intro">${texto}</p>` : ""}
</section>`;

// ---------------------------------------------------------------- portfólio
const CAT = { "Vídeo Institucional": "Vídeo institucional", "Conteúdo de Marca": "Conteúdo de marca", "Publicidade": "Publicidade" };
const CAT_PAGE = { "Vídeo institucional": "institucional.html", "Conteúdo de marca": "conteudo.html", "Publicidade": "publicidade.html" };
const cases = data.cases.filter(c => !c.erro).map(c => ({ ...c, categoria: CAT[c.categoria] || c.categoria }));
const caseBySlug = Object.fromEntries(cases.map(c => [c.slug, c]));
const caseCard = c => `<a class="case reveal" data-cat="${esc(c.categoria)}" data-cursor="VER" href="case-${c.slug}.html"><img loading="lazy" src="${c.thumb}" alt=""><div class="case-info"><span>${esc(c.categoria)}</span><strong>${esc(c.titulo)}</strong></div></a>`;

write("portfolio.html", page("Portfólio", lhero({ chapeu: "Portfólio · " + cases.length + " projetos", titulo: "Portfólio", texto: data.portfolioIntro }) + `
<section class="block">
  <div class="filters" role="group" aria-label="Filtrar portfólio" data-filter="#grid">
    <button type="button" aria-pressed="true" data-f="todos">Todos</button>
    ${Object.keys(CAT_PAGE).map(c => `<button type="button" aria-pressed="false" data-f="${c}">${c}</button>`).join("\n    ")}
  </div>
  <div class="grid-3" id="grid">
    ${cases.map(caseCard).join("\n    ")}
  </div>
</section>
` + cta("Quer um filme assim para a sua empresa?", "Conte o que você precisa e receba um orçamento personalizado.")));

const ficha = (linhas, extra = []) => {
  const itens = [...extra, ...linhas.map(l => { const i = l.indexOf(":"); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : ["Equipe", l]; })].filter(x => x[1]);
  return itens.length ? `
<section class="block c-credits reveal" aria-label="Ficha técnica">
  <p class="eyebrow">Ficha técnica</p>
  <dl>
    ${itens.map(([a, b]) => `<div><dt>${esc(a.replace(/Assitentes/, "Assistentes"))}</dt><dd>${esc(b)}</dd></div>`).join("\n    ")}
  </dl>
</section>` : "";
};
const shots = (fotos, titulo) => fotos.length ? `
<section class="block c-back">
  <div class="statement reveal"><h2>${titulo}</h2></div>
  <ul class="shots">
    ${fotos.map((b, k) => `<li class="reveal"><button type="button" data-full="${b.full}" aria-label="Ampliar foto ${k + 1} de ${fotos.length}"><img loading="lazy" src="${b.thumb}" alt="Bastidores, foto ${k + 1}"></button></li>`).join("\n    ")}
  </ul>
</section>` : "";
const player = (embed, poster, nome) => `<div class="player${embed ? "" : " still"}" data-embed="${esc(embed)}">
    <button class="player-poster" type="button"${embed ? ` data-cursor="PLAY" aria-label="Assistir a ${esc(nome)}"` : ` tabindex="-1" aria-hidden="true"`}>
      <img src="${poster}" alt="">
      ${embed ? `<span class="play" aria-hidden="true"></span>` : ""}
    </button>
  </div>`;

cases.forEach((c, k) => {
  const mesma = cases.filter(x => x.categoria === c.categoria && x.slug !== c.slug);
  const i = mesma.findIndex(x => cases.indexOf(x) > k);
  const rel = [...mesma.slice(Math.max(i, 0)), ...mesma].slice(0, 3);
  write(`case-${c.slug}.html`, page(c.titulo + " · " + c.categoria, `
<section class="c-hero">
  ${player(c.embed, c.poster, "filme " + c.titulo)}
  <div class="c-side">
    <nav class="crumbs" aria-label="Você está em">
      <a href="portfolio.html">Portfólio</a><span aria-hidden="true">/</span><a href="${CAT_PAGE[c.categoria] || "portfolio.html"}">${esc(c.categoria)}</a>
    </nav>
    <h1${c.titulo.length > 12 ? ' class="long"' : ""}>${esc(c.titulo)}</h1>
    <p class="c-lead">${c.resumo}</p>
    ${c.texto.map(t => `<p>${t}</p>`).join("\n    ")}
    <a class="c-link" href="orcamento.html">Quero um filme assim <span aria-hidden="true">→</span></a>
  </div>
</section>
${ficha(c.ficha, [["Formato", c.categoria]])}
${shots(c.bastidores, "Bastidores do projeto.")}

<section class="block c-related">
  <div class="c-related-head">
    <div class="statement reveal"><h2>Veja outros trabalhos.</h2></div>
    <a class="btn ghost" href="portfolio.html">Ver portfólio completo</a>
  </div>
  <div class="related">
    ${rel.map(caseCard).join("\n    ")}
  </div>
</section>
` + cta("Quer um filme assim para a sua empresa?", "Conte o que você precisa e receba um orçamento personalizado.")));
});

// ---------------------------------------------------------------- soluções
const SERV = {
  publicidade: { linhas: ["Publicidade"], n: 1, cat: "Publicidade", pergunta: "Um filme publicitário pode ajudar a sua empresa?" },
  institucional: { linhas: ["Vídeo", "institucional"], n: 2, cat: "Vídeo institucional", pergunta: "Um filme institucional pode ajudar a sua empresa?" },
  conteudo: { linhas: ["Conteúdo", "de marca"], n: 3, cat: "Conteúdo de marca", pergunta: "Conteúdos de marca podem ajudar a sua empresa?" },
};
const longos = arr => arr.filter(t => plain(t).length > 60);
data.servicos.forEach(s => {
  const cfg = SERV[s.slug];
  const intro = longos(s.intro).join(" ");
  // primeira frase em destaque, o resto em corpo menor
  const corte = intro.search(/[.!?]\s+(?=[A-ZÀ-Ú])/);
  const lead = corte > 0 ? intro.slice(0, corte + 1) : intro, sub = corte > 0 ? intro.slice(corte + 1).trim() : "";
  const porque = longos(s.porque);
  const pontos = [...new Set(porque.join(" ").match(/<strong>(.*?)<\/strong>/g) || [])].map(plain)
    .filter(t => t.length > 8 && !new RegExp("^(" + cfg.cat + "s?|v[ií]deos? institucionais|filmes? publicit[aá]rios?|conte[uú]dos? de marca|branded content)$", "i").test(t)).slice(0, 5);
  const etapas = s.etapas.map(e => ({ nome: cap(e.nome.toLowerCase()), texto: e.texto }));
  const trabalhos = (s.cases.map(x => caseBySlug[x]).filter(Boolean).length ? s.cases.map(x => caseBySlug[x]).filter(Boolean) : cases.filter(c => c.categoria === cfg.cat)).slice(0, 6);
  const outros = Object.entries(SERV).filter(([k]) => k !== s.slug);
  write(`${s.slug}.html`, page(cfg.cat, hero({
    chapeu: `Soluções · ${p2(cfg.n)} de 03`,
    linhas: cfg.linhas,
    texto: `<p class="lead">${lead}</p>${sub ? `\n      <p class="p-sub">${sub}</p>` : ""}`,
    botoes: `<a class="btn solid" href="orcamento.html">Fale com um especialista</a><a class="btn ghost" href="#processo">Como funciona</a>`,
    midia: s.video ? `<video class="p-bg" autoplay muted loop playsinline aria-hidden="true" poster="${s.banner}" src="${s.video}"></video>` : `<img class="p-bg" src="${s.banner}" alt="" aria-hidden="true">`,
  }) + `

<section class="proc" id="processo" aria-label="Como funciona" style="height: calc(${etapas.length} * 70vh + 100vh)">
  <div class="proc-pin">
    <div class="proc-head">
      <h2>Como funciona</h2>
      <p class="proc-tc" aria-hidden="true">ETAPA <span id="proc-n">01</span> / ${p2(etapas.length)}</p>
    </div>
    <div class="proc-stage">
      <p class="proc-num" id="proc-num" aria-hidden="true">01</p>
      <ol class="proc-steps" id="proc-steps">
        ${etapas.map((e, k) => `<li${k ? "" : ' class="on"'}>
          <h3>${esc(e.nome)}</h3>
          <p>${e.texto}</p>
        </li>`).join("\n        ")}
      </ol>
    </div>
    <div class="tl" aria-hidden="true"><div class="tl-track"></div><span class="tl-head"></span></div>
  </div>
</section>

<section class="block s-why">
  <div class="statement reveal">
    <h2>${cfg.pergunta}</h2>
  </div>
  <div class="s-why-body reveal">
    ${porque.map(t => `<p class="s-big">${t}</p>`).join("\n    ")}
    ${pontos.length ? `<ul class="s-points">
      ${pontos.map((t, k) => `<li><span>${p2(k + 1)}</span>${esc(cap(t))}</li>`).join("\n      ")}
    </ul>` : ""}
  </div>
</section>

<section class="block s-port">
  <div class="s-port-head">
    <div class="statement reveal">
      <h2>Portfólio.</h2>
      <p>Conheça alguns dos principais trabalhos de ${cfg.cat.toLowerCase()} criados pela Impulso.</p>
    </div>
    <a class="btn ghost" href="portfolio.html">Ver portfólio completo</a>
  </div>
  <div class="s-grid">
    ${trabalhos.map(caseCard).join("\n    ")}
  </div>
</section>

<section class="block s-others" aria-label="Outras soluções">
  <p class="eyebrow">Outras soluções</p>
  ${outros.map(([k, o]) => `<a href="${k}.html" data-cursor="VER"><span class="idx">${p2(o.n)}</span><strong>${o.cat}</strong></a>`).join("\n  ")}
</section>
` + cta("Solicite um orçamento.", "Conte o que a sua empresa precisa e fale com um especialista.")));
});

// ---------------------------------------------------------------- projetos autorais
const filmes = data.autorais.filter(a => !a.erro).map(a => {
  const [genero, dur, ...resto] = a.meta.split(",").map(x => x.trim());
  return { ...a, genero, dur, ano: resto.join(", "),
    texto: a.texto.filter(t => plain(t).length > 20 && !/^Além dos trabalhos comerciais|^Book de projetos/i.test(plain(t))) };
});
const posterCard = (a, k) => `<a class="poster reveal" data-cat="${esc(a.genero)}" data-cursor="VER" href="autoral-${a.slug}.html">
      <span class="poster-art"><img loading="lazy" src="${a.poster}" alt="Cartaz de ${esc(a.titulo)}"><i aria-hidden="true"></i></span>
      <span class="poster-meta">${p2(k + 1)} · ${esc(a.genero)} · ${esc(a.dur)}</span>
      <strong>${esc(a.titulo)}</strong>
      <span class="poster-year${/^Em /.test(a.ano) ? " soon" : ""}">${esc(a.ano)}</span>
    </a>`;
write("autorais.html", page("Projetos autorais", fixas.autorais(filmes.map(posterCard).join("\n    "))));

filmes.forEach((a, k) => {
  const [lead, ...resto] = a.texto;
  const lado = resto.slice(0, 1), abaixo = resto.slice(1);
  const outros = [...filmes.slice(k + 1), ...filmes.slice(0, k)].slice(0, 4);
  write(`autoral-${a.slug}.html`, page(a.titulo + " · Projetos autorais", `
<section class="c-hero">
  ${player(a.embed, a.still || a.poster, a.titulo)}
  <div class="c-side">
    <nav class="crumbs" aria-label="Você está em">
      <a href="autorais.html">Projetos autorais</a><span aria-hidden="true">/</span><a href="autorais.html">${esc(a.genero)}</a>
    </nav>
    <h1${a.titulo.length > 12 ? ' class="long"' : ""}>${esc(a.titulo)}</h1>
    <p class="c-meta">${esc([a.genero, a.dur, a.ano].filter(Boolean).join(" · "))}</p>
    ${lead ? `<p class="c-lead">${lead}</p>` : ""}
    ${lado.map(t => `<p>${t}</p>`).join("\n    ")}
    <a class="c-link" href="autorais.html#apoio">Quero apoiar <span aria-hidden="true">→</span></a>
  </div>
</section>
${a.creditos.length ? ficha([], a.creditos.map(c => [c.funcao, c.nome])) : ""}
${abaixo.length || a.notas.length || a.extras.length ? `
<section class="block rule support">
  <div class="statement reveal"><h2>Sobre o filme.</h2></div>
  <div class="support-body reveal">
    ${abaixo.map(t => `<p>${t}</p>`).join("\n    ")}
    ${a.extras.map(t => `<p>${esc(t)}</p>`).join("\n    ")}
    ${a.notas.length ? `<ul class="points">
      ${a.notas.map((t, i) => `<li><span>${p2(i + 1)}</span>${esc(t)}</li>`).join("\n      ")}
    </ul>` : ""}
  </div>
</section>` : ""}
${shots(a.bastidores.map(t => ({ thumb: t, full: t.replace("-480x360", "") })), "Bastidores do projeto.")}

<section class="block rule">
  <div class="sec-head">
    <div class="statement reveal"><h2>Outros projetos.</h2></div>
    <a class="btn ghost" href="autorais.html">Ver todos</a>
  </div>
  <div class="posters">
    ${outros.map(posterCard).join("\n    ")}
  </div>
</section>
` + cta("Tem um projeto para tirar do papel?", "Fale com a gente sobre parcerias, coproduções e apoio.")));
});

// ---------------------------------------------------------------- clientes e capacitação (conteúdo fixo)
write("clientes.html", page("Clientes", fixas.clientes));
write("capacitacao.html", page("Capacitação", fixas.capacitacao));

// ---------------------------------------------------------------- sobre
{
  const t = data.sobre.textos;
  const acha = re => t.find(x => re.test(plain(x))) || "";
  const t1 = acha(/No mercado desde 2013/), t2 = acha(/abrangência nacional/i), t3 = acha(/núcleo criativo/i), t4 = acha(/estrutura própria/i), t5 = acha(/Do roteiro à finalização/i);
  const corte = t1.search(/\.\s+(?=<strong>|[A-ZÀ-Ú])/);
  const fotos = data.sobre.fotos;
  write("sobre.html", page("Sobre", hero({
    chapeu: "Sobre",
    linhas: ["Muito prazer,", "somos a Impulso Filmes"],
    texto: `<p class="lead">${corte > 0 ? t1.slice(0, corte + 1) : t1}</p>${corte > 0 ? `\n      <p class="p-sub">${t1.slice(corte + 1).trim()}</p>` : ""}`,
    botoes: `<a class="btn solid" href="orcamento.html">Fale com um especialista</a><a class="btn ghost" href="#historia">Nossa história</a>`,
    midia: HOME_VIDEO,
  }) + `

<section class="block rule support">
  <div class="statement reveal"><h2>Soluções para empresas e indústrias.</h2></div>
  <div class="support-body reveal">
    <p>${t2}</p>
    <p style="margin-top:1em">${t3}</p>
    <ul class="points">
      <li><span>01</span>Filmes publicitários</li>
      <li><span>02</span>Vídeos institucionais e corporativos</li>
      <li><span>03</span>Conteúdo de marca (Branded Content)</li>
    </ul>
  </div>
</section>

<section class="block rule" id="historia">
  <div class="statement reveal"><h2>Aperte o play e conheça nossa história.</h2></div>
  <div class="player wide" data-embed="${esc(data.sobre.video)}">
    <button class="player-poster" type="button" data-cursor="PLAY" aria-label="Assistir à história da Impulso Filmes">
      <img src="${SITE}/wp-content/themes/impulso/assets/images/bannerc.png" alt="">
      <span class="play" aria-hidden="true"></span>
    </button>
  </div>
  <ul class="facts inline reveal">
    <li><strong data-from="2013" data-to="ano">2026</strong><span><b data-anos>13</b> anos de história</span></li>
    <li><strong data-to="25" data-prefix="+" data-suffix="M">+25M</strong><span>de visualizações dos nossos projetos</span></li>
    <li><strong data-to="480" data-prefix="+">+480</strong><span>projetos produzidos</span></li>
    <li><strong data-to="70" data-prefix="+">+70</strong><span>clientes no Brasil e no mundo</span></li>
  </ul>
</section>

<section class="block rule">
  <div class="support" style="margin:0;padding:0">
    <div class="statement reveal"><h2>Uma produtora completa.</h2></div>
    <div class="support-body reveal">
      <p>${t4}</p>
      <p style="margin-top:1em">${t5}</p>
    </div>
  </div>
  <div class="mosaic">
    ${[0, 1, 2, 3].map(c => `<div class="mosaic-col">
      ${fotos.filter((_, k) => k % 4 === c).map(src => `<button type="button" class="reveal" data-full="${src.replace("-640x420", "")}" aria-label="Ampliar foto"><img loading="lazy" src="${src}" alt="Estrutura e equipe da Impulso Filmes"></button>`).join("\n      ")}
    </div>`).join("\n    ")}
  </div>
</section>
` + cta("Vamos conversar sobre o seu filme?", "Conte o que a sua empresa precisa e fale com um especialista.")));
}

// ---------------------------------------------------------------- blog
const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const dataBr = iso => { const d = new Date(iso); return `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`; };
const catNome = Object.fromEntries(data.categorias.map(c => [c.id, c.nome]));
const posts = data.posts.map(p => ({ ...p, cats: p.categorias.map(id => catNome[id]).filter(Boolean) }));
const postSlugs = new Set(posts.map(p => p.slug));
const postCard = p => `<a class="post reveal" data-cat="${esc(p.cats.join("|"))}" data-cursor="LER" href="post-${p.slug}.html">
      ${p.thumb ? `<img loading="lazy" src="${p.thumb}" alt="">` : `<span class="ph"></span>`}
      <time datetime="${p.data}">${dataBr(p.data)}</time>
      <h3>${p.titulo}</h3>
    </a>`;
{
  const [dest, ...demais] = posts;
  write("blog.html", page("Blog", lhero({ chapeu: "Blog · " + posts.length + " artigos", titulo: "Dicas e novidades", small: true }) + `
<section class="block">
  <a class="blog-lead reveal" href="post-${dest.slug}.html" data-cursor="LER">
    ${dest.imagem ? `<img src="${dest.imagem}" alt="">` : `<span class="ph"></span>`}
    <div>
      <time datetime="${dest.data}">${dataBr(dest.data)} · ${esc(dest.cats[0] || "Blog")}</time>
      <h2>${dest.titulo}</h2>
      <p>${esc(dest.resumo.replace(/\s*\[?(&hellip;|…)\]?\s*$/, "…"))}</p>
      <span class="c-link">Ler artigo <span aria-hidden="true">→</span></span>
    </div>
  </a>
</section>

<section class="block rule">
  <div class="filters" role="group" aria-label="Filtrar artigos" data-filter="#posts">
    <button type="button" aria-pressed="true" data-f="todos">Todos</button>
    ${data.categorias.map(c => `<button type="button" aria-pressed="false" data-f="${esc(c.nome)}">${esc(c.nome)}</button>`).join("\n    ")}
  </div>
  <div class="posts all" id="posts" data-page="12">
    ${demais.map(postCard).join("\n    ")}
  </div>
  <p class="more-wrap"><button class="btn ghost" type="button" data-more="#posts">Carregar mais artigos</button></p>
</section>
` + cta("Quer transformar isso em vídeo?", "Conte o que a sua empresa precisa e fale com um especialista.")));
}

const PAGINAS = { sobre: "sobre.html", portfolios: "portfolio.html", portifolio: "portfolio.html", orcamento: "orcamento.html", blog: "blog.html", clientes: "clientes.html", publicidade: "publicidade.html", institucional: "institucional.html", conteudo: "conteudo.html", capacitacao: "capacitacao.html", "projetos-autorais": "autorais.html", "politica-de-privacidade-e-cookies": "politica.html" };
const limpar = html => {
  const $ = cheerio.load(html, null, false);
  $("#ez-toc-container, script, style, noscript").remove();
  $("*").each((_, el) => {
    for (const a of Object.keys(el.attribs || {})) if (/^(style|class|id|data-|onload|onclick|width|height|srcset|sizes|decoding|fetchpriority|loading)/.test(a)) $(el).removeAttr(a);
  });
  $("img").attr("loading", "lazy");
  $("span").each((_, el) => { $(el).replaceWith($(el).contents()); });
  $("a[href]").each((_, a) => {
    const h = $(a).attr("href");
    const m = h.match(/^https?:\/\/(?:www\.)?impulsofilmes\.com\.br\/(?:(portifolio|autoral)\/)?([^\/?#]*)\/?(#.*)?$/);
    if (!m) { if (/^https?:/.test(h)) $(a).attr({ target: "_blank", rel: "noopener" }); return; }
    const [, tipo, slug, hash = ""] = m;
    if (tipo === "portifolio" && caseBySlug[slug]) $(a).attr("href", `case-${slug}.html`);
    else if (tipo === "autoral") $(a).attr("href", filmes.find(f => f.slug === slug) ? `autoral-${slug}.html` : "autorais.html");
    else if (!slug) $(a).attr("href", "index.html");
    else if (postSlugs.has(slug)) $(a).attr("href", `post-${slug}.html${hash}`);
    else if (PAGINAS[slug]) $(a).attr("href", PAGINAS[slug]);
  });
  $("p, h2, h3, h4, li").each((_, el) => { if (!$(el).text().trim() && !$(el).find("img, iframe, video").length) $(el).remove(); });
  $("table").each((_, t) => { $(t).wrap('<div class="prose-wrap"></div>'); });
  return $.html();
};

posts.forEach((p, k) => {
  // Layout do artigo: ver _build/artigo.js (marcações do corpo) e post-opcoes.css (classes po8 capa-2 txt-1 bul-1)
  const { corpo, indice } = artigo.montar(limpar(p.html));
  const minutos = Math.max(1, Math.round(plain(corpo).split(" ").length / 200));
  const indiceHtml = artigo.toc(indice);
  const rel = [...posts.filter((x, i) => i > k && x.cats[0] === p.cats[0]), ...posts.filter(x => x.slug !== p.slug)].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
  write(`post-${p.slug}.html`, page(plain(p.titulo), `
<article class="art">
  <header class="po-head">
    ${p.imagem ? `<img class="capa-bg" src="${p.imagem}" alt="">` : ""}
    <div class="po-head-in">
      <nav class="crumbs" aria-label="Você está em">
        <a href="blog.html">Blog</a>${p.cats[0] ? `<span aria-hidden="true">/</span><a href="blog.html">${esc(p.cats[0])}</a>` : ""}
      </nav>
      <h1 class="post-title">${p.titulo}</h1>
      <p class="post-meta"><time datetime="${p.data}">${dataBr(p.data)}</time><span>${minutos} min de leitura</span></p>
    </div>
    ${p.imagem ? `<span class="rolar" aria-hidden="true"><i></i><i></i><i></i></span>` : ""}
  </header>
  <div class="po-body">
    ${indiceHtml}
    <div class="leitura"><div class="prose">
      ${corpo}
    </div></div>
  </div>
</article>

<section class="block rule">
  <div class="sec-head">
    <div class="statement reveal"><h2>Continue lendo.</h2></div>
    <a class="btn ghost" href="blog.html">Ver todos os artigos</a>
  </div>
  <div class="posts all">
    ${rel.map(postCard).join("\n    ")}
  </div>
</section>
` + cta("Quer transformar isso em vídeo?", "Conte o que a sua empresa precisa e fale com um especialista."),
    { cls: artigo.CLASSES + (p.imagem ? "" : " sem-capa") + (indiceHtml ? "" : " sem-indice"), css: ["post-opcoes.css"], js: ["post.js"] }));
});

// ---------------------------------------------------------------- formulários e política
const campo = (c, wide = false) => {
  const obrig = /name|email|telefone/.test(c.name) ? " required" : "";
  if (c.type === "select") return `<label${wide ? ' class="wide"' : ""}>${esc(c.opcoes[0])}<select name="${c.name}"><option value="">Selecione</option>${c.opcoes.slice(1).map(o => `<option>${esc(o)}</option>`).join("")}</select></label>`;
  if (c.type === "textarea") return `<label class="wide">${esc(c.rotulo)}<textarea name="${c.name}" rows="5"></textarea></label>`;
  if (c.type === "checkbox") return `<label class="check wide"><input type="checkbox" name="${c.name}"> Aceito receber comunicações da empresa.</label>`;
  const auto = { "your-name": "name", "your-email": "email", telefone: "tel", nomeempresa: "organization", siteempresa: "url" }[c.name];
  return `<label${wide ? ' class="wide"' : ""}>${esc(c.rotulo)}<input type="${c.type}" name="${c.name}"${auto ? ` autocomplete="${auto}"` : ""}${obrig}></label>`;
};
const contato = `<aside class="contact-card" aria-label="Outros contatos">
      <a href="${WA}" target="_blank" rel="noopener"><span>WhatsApp</span>Chamar agora</a>
      <a href="tel:553235124803"><span>Telefone</span>(32) 3512-4803</a>
    </aside>`;
{
  const c = Object.fromEntries(data.orcamento.campos.map(x => [x.name, x]));
  // Orçamento em uma tela só (opção 1 da comparação), na mesma ordem da caixa da home
  const ordem = ["your-name", "your-email", "telefone", "nomeempresa", "siteempresa", "porte", "cargo", "area", "servicoprocurado", "investimento"];
  write("orcamento.html", page("Orçamento", lhero({ chapeu: "Orçamento", titulo: esc(data.orcamento.titulo), texto: esc(data.orcamento.texto), small: true }) + `
<section class="block">
  <div class="form-grid">
    <form class="one-form" novalidate>
      ${ordem.map(n => c[n]).filter(Boolean).map(x => campo(x)).join("\n      ")}
      ${c["your-message"] ? campo(c["your-message"]).replace('class="wide"', 'class="span2"').replace('rows="5"', 'rows="2"') : ""}
      <div class="step-actions"><button class="btn solid" type="submit">Pedir orçamento</button></div>
      <p class="form-note" role="status"></p>
    </form>
    ${contato}
  </div>
</section>
`));

  write("trabalhe-conosco.html", page("Trabalhe conosco", lhero({ chapeu: "Carreiras", titulo: "Trabalhe conosco", texto: "Envie seus dados e o link do seu portfólio.", small: true }) + `
<section class="block">
  <div class="form-grid">
    <form class="plain-form" novalidate>
      ${data.trabalhe.campos.map(x => campo(x, x.name === "portifolio")).join("\n      ")}
      <div class="step-actions wide"><button class="btn solid" type="submit">Enviar</button></div>
      <p class="form-note wide" role="status"></p>
    </form>
    ${contato}
  </div>
</section>
`));

  write("politica.html", page("Política de Privacidade e Cookies", lhero({ chapeu: "Institucional", titulo: "Política de Privacidade e Cookies", small: true }) + `
<section class="block">
  <div class="prose">
    ${limpar(data.politica.html)
      // o e-mail sai do texto: os pedidos sobre dados pessoais passam a ser feitos pelo formulário desta página
      .replace(/pelo e-mail:?\s*<a[^>]*mailto:[^>]*>[^<]*<\/a>/gi, 'pelo <a href="#dados">formulário de solicitação sobre dados pessoais</a>')
      .replace(/<a[^>]*mailto:[^>]*>[^<]*<\/a>/gi, '<a href="#dados">formulário de solicitação sobre dados pessoais</a>')}
  </div>
</section>

<section class="block rule" id="dados">
  <div class="form-grid">
    <div>
      <div class="statement reveal">
        <h2>Solicitação sobre dados pessoais.</h2>
        <p>Use este formulário para consultar, corrigir ou pedir a exclusão dos seus dados, ou para tirar dúvidas sobre esta política.</p>
      </div>
      <form class="plain-form" novalidate style="margin-top:32px">
        <label>Nome<input type="text" name="nome" autocomplete="name" required></label>
        <label>E-mail para resposta<input type="email" name="email" autocomplete="email" required></label>
        <label class="wide">Tipo de solicitação<select name="tipo"><option>Confirmar se vocês têm dados meus</option><option>Acessar meus dados</option><option>Corrigir meus dados</option><option>Excluir meus dados</option><option>Revogar um consentimento</option><option>Outra dúvida sobre privacidade</option></select></label>
        <label class="wide">Detalhes do pedido<textarea name="msg" rows="4"></textarea></label>
        <div class="step-actions wide"><button class="btn solid" type="submit">Enviar solicitação</button></div>
        <p class="form-note wide" role="status"></p>
      </form>
    </div>
  </div>
</section>
`));
}

// ---------------------------------------------------------------- home: menu, rodapé, links e posts recentes
{
  let h = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
  h = h.replace(/<nav id="menu"[\s\S]*?<\/nav>(?=\s*<\/header>)/, () => NAV);
  h = h.replace(/<footer class="foot">[\s\S]*?<\/footer>/, () => FOOT);
  // índice de palavras da abertura
  const alvos = ["publicidade.html", "institucional.html", "conteudo.html", "portfolio.html"];
  let n = 0;
  h = h.replace(/<li><a href="[^"]*"><span class="idx">00<\/span><span class="word">([^<]*)<\/span><\/a><\/li>/g, (m, w) => `<li><a href="${alvos[n++]}"><span class="idx">00</span><span class="word">${w === "Portfólio" ? "Cases" : w}</span></a></li>`);
  n = 0;
  h = h.replace(/<a class="solution reveal" href="[^"]*"/g, () => `<a class="solution reveal" href="${alvos[n++]}"`);
  h = h.replace(/href="https:\/\/www\.impulsofilmes\.com\.br\/portfolios\/" target="_blank" rel="noopener"/, 'href="portfolio.html"');
  h = h.replace(/<div class="posts">[\s\S]*?<\/div>\s*<p class="more">[\s\S]*?<\/p>/, () => `<div class="posts">
    ${posts.slice(0, 3).map(postCard).join("\n    ")}
  </div>
  <p class="more"><a class="btn ghost" href="blog.html">Ver todos os artigos</a></p>`);
  h = h.replace(/<a class="btn ghost" href="#portfolio">Ver portfólio<\/a>/, '<a class="btn ghost" href="portfolio.html">Ver portfólio</a>');
  fs.writeFileSync(path.join(OUT, "index.html"), h);
  let j = fs.readFileSync(path.join(OUT, "script.js"), "utf8");
  j = j.replace(/  a\.href = 'case\.html';[^\n]*/, "  a.href = 'case-' + slug + '.html';");
  fs.writeFileSync(path.join(OUT, "script.js"), j);
}

console.log(written.length + " páginas geradas");
