// Lê o conteúdo do site no ar (www.impulsofilmes.com.br) e grava _build/data.json.
// Uso: NODE_PATH=<pasta com node_modules contendo cheerio> node _build/scrape.js
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SITE = "https://www.impulsofilmes.com.br";
const get = async (url, tries = 3) => {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url.startsWith("http") ? url : SITE + url, { headers: { "user-agent": "Mozilla/5.0 (mockup-impulso)" } });
      if (r.ok) return r;
      if (r.status === 404) throw new Error("404 " + url);
    } catch (e) { if (i === tries - 1) throw e; }
    await new Promise(r => setTimeout(r, 800 * (i + 1)));
  }
};
const html = async url => cheerio.load(await (await get(url)).text());
const clean = s => (s || "").replace(/\s+/g, " ").trim();
const rel = u => (u || "").trim().replace(SITE, "");
const slugOf = u => rel(u).replace(/\/$/, "").split("/").pop();
// Mantém só negrito e itálico do HTML de um parágrafo
const inline = ($, el) => clean($(el).html() || "")
  .replace(/<(\/?)(b|strong)\b[^>]*>/gi, "<$1strong>")
  .replace(/<(\/?)(i|em)\b[^>]*>/gi, "<$1em>")
  .replace(/<(?!\/?(strong|em)\b)[^>]+>/gi, "")
  .replace(/<strong>\s*<\/strong>|<em>\s*<\/em>/g, "")
  .trim();
const paras = ($, scope) => $(scope).find("p").map((_, p) => inline($, p)).get().filter(t => clean(t.replace(/<[^>]+>/g, "")).length > 1);
const embed = url => {
  url = (url || "").trim();
  let m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return "https://player.vimeo.com/video/" + m[1] + "?autoplay=1&title=0&byline=0&portrait=0";
  m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (m) return "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0";
  return "";
};
const pool = async (items, n, fn) => {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k).catch(e => ({ erro: String(e) })); } }));
  return out;
};

(async () => {
  const data = { geradoEm: new Date().toISOString() };

  // ---------- Portfólio ----------
  let $ = await html("/portfolios/");
  data.portfolioIntro = paras($, "article")[0] || "";
  const lista = [];
  $("article a[href*='/portifolio/']").each((_, a) => {
    const href = rel($(a).attr("href")), img = $(a).find("img").attr("src") || $(a).find("img").attr("data-src");
    if (img && !lista.find(x => x.href === href)) lista.push({ href, thumb: img });
  });
  data.cases = await pool(lista, 5, async item => {
    const $ = await html(item.href);
    const art = $("article");
    const video = art.find(".video .image").first();
    return {
      slug: slugOf(item.href), thumb: item.thumb,
      categoria: clean(art.find(".text h3").first().text()),
      titulo: clean(art.find(".text h1").first().text()),
      resumo: inline($, art.find(".text p").first()),
      embed: embed(video.attr("href")), poster: video.find("img").attr("src") || item.thumb,
      texto: art.find(".description p").map((_, p) => inline($, p)).get().filter(t => clean(t.replace(/<[^>]+>/g, "")).length > 1),
      ficha: art.find(".cast li").map((_, li) => clean($(li).text())).get().filter(Boolean),
      bastidores: art.find(".backstage a[href]").map((_, a) => ({ full: $(a).attr("href"), thumb: $(a).find("img").attr("src") })).get().filter(b => b.thumb),
    };
  });

  // ---------- Projetos autorais ----------
  $ = await html("/projetos-autorais/");
  const filmes = [];
  $("article a[href*='/autoral/']").each((_, a) => {
    const href = rel($(a).attr("href")), img = $(a).find("img").attr("src");
    if (img && !filmes.find(x => x.href === href)) filmes.push({ href, poster: img });
  });
  data.autorais = await pool(filmes, 4, async item => {
    const $ = await html(item.href);
    const art = $("article");
    const video = art.find(".image[href]").first();
    const creditos = [], notas = [];
    art.find("li").each((_, li) => {
      const lab = clean($(li).find("strong, b").first().text());
      const txt = clean($(li).text());
      if (!txt) return;
      if (lab) creditos.push({ funcao: lab.replace(/:$/, ""), nome: clean(txt.replace(lab, "")) });
      else notas.push(txt);
    });
    const h1 = art.find("h1").first();
    return {
      slug: slugOf(item.href), poster: item.poster,
      titulo: clean(h1.text()),
      meta: clean(h1.prevAll("h3").first().text() || art.find("h3").first().text()),
      embed: embed(video.attr("href")), still: video.find("img").attr("src") || "",
      texto: paras($, art).filter(t => !/^Estreia|^<strong>Festivais/i.test(t)),
      extras: art.find("p").map((_, p) => clean($(p).text())).get().filter(t => /^(Estreia|Festivais)/i.test(t)),
      creditos, notas,
      bastidores: art.find("img[src*='-480x360']").map((_, i) => $(i).attr("src")).get(),
    };
  });

  // ---------- Soluções ----------
  data.servicos = await pool(["publicidade", "institucional", "conteudo"], 3, async slug => {
    const $ = await html("/" + slug + "/");
    const art = $("article");
    const steps = [];
    art.find(".work .tab-pane, .work .tab-content > div").each((_, d) => {
      const h = clean($(d).find("h3").first().text());
      if (h) steps.push({ nome: h, texto: paras($, d).join(" ") });
    });
    if (!steps.length) art.find(".work h3").each((_, h) => steps.push({ nome: clean($(h).text()), texto: inline($, $(h).nextAll("p").first()) }));
    const serv = art.find(".services");
    return {
      slug, titulo: clean(art.find("h1").first().text()),
      nome: clean(art.find(".textimg h2").first().text()),
      intro: paras($, art.find(".textimg")),
      video: art.find(".textimg video source").attr("src") || art.find(".textimg video").attr("src") || "",
      banner: art.find(".banner img").attr("src") || "",
      etapas: steps,
      pergunta: serv.find("h2").map((_, h) => clean($(h).text())).get().filter(Boolean).join(" "),
      subtitulo: clean(serv.find("h3").first().text()),
      porque: paras($, serv),
      cases: [...new Set(art.find(".portifolio a[href*='/portifolio/']").map((_, a) => slugOf($(a).attr("href"))).get())],
    };
  });

  // ---------- Sobre ----------
  $ = await html("/sobre/");
  {
    const art = $("article");
    const ps = paras($, art);
    data.sobre = {
      textos: ps,
      video: embed(art.find(".callabout").attr("href")),
      fotos: art.find("img[src*='-640x420']").map((_, i) => $(i).attr("src")).get(),
    };
  }

  // ---------- Orçamento e Trabalhe conosco (campos dos formulários) ----------
  const campos = ($, form) => $(form).find("input, select, textarea").map((_, el) => {
    const e = $(el), type = el.tagName === "select" ? "select" : el.tagName === "textarea" ? "textarea" : (e.attr("type") || "text");
    if (["hidden", "submit"].includes(type) || /^_wpcf7|ak_hp/.test(e.attr("name") || "")) return null;
    return { name: e.attr("name"), type, rotulo: e.attr("placeholder") || "", opcoes: e.find("option").map((_, o) => clean($(o).text())).get() };
  }).get().filter(Boolean);
  $ = await html("/orcamento/");
  data.orcamento = { titulo: clean($("article h1").first().text()), texto: paras($, "article")[0] || "", campos: campos($, $("article form").first()) };
  // rótulos dos selects do orçamento vêm do texto ao redor
  $("article form select").each((i, s) => {
    const lab = clean($(s).closest("p, label, div").text()).replace(clean($(s).text()), "").trim();
    const c = data.orcamento.campos.find(c => c.name === $(s).attr("name"));
    if (c && !c.rotulo) c.rotulo = lab;
  });
  $ = await html("/");
  {
    const m = $("#workModal");
    data.trabalhe = { titulo: clean(m.find("h1, h2, h3, h4, .modal-title").first().text()), texto: paras($, m), campos: campos($, m.find("form").first()) };
  }

  // ---------- Páginas de texto (política) e blog, pela API do WordPress ----------
  const api = async p => (await get("/wp-json/wp/v2/" + p)).json();
  const pol = await api("pages?slug=politica-de-privacidade-e-cookies&_fields=title,content");
  data.politica = { titulo: pol[0].title.rendered, html: pol[0].content.rendered };
  const cats = await api("categories?per_page=100&_fields=id,name,slug");
  data.categorias = cats.filter(c => c.slug !== "sem-categoria").map(c => ({ id: c.id, nome: c.name, slug: c.slug }));
  data.posts = [];
  for (let pg = 1; pg <= 3; pg++) {
    let lote;
    try { lote = await api("posts?per_page=50&page=" + pg + "&_embed=wp:featuredmedia&_fields=slug,title,date,excerpt,content,categories,_links,_embedded"); } catch (e) { break; }
    if (!lote.length) break;
    for (const p of lote) {
      const media = p._embedded && p._embedded["wp:featuredmedia"] && p._embedded["wp:featuredmedia"][0];
      const sizes = media && media.media_details && media.media_details.sizes || {};
      data.posts.push({
        slug: p.slug, titulo: p.title.rendered, data: p.date, categorias: p.categories,
        resumo: clean(cheerio.load(p.excerpt.rendered).text()),
        imagem: media ? media.source_url : "",
        thumb: (sizes.medium_large || sizes.large || sizes.medium || {}).source_url || (media ? media.source_url : ""),
        html: p.content.rendered,
      });
    }
    if (lote.length < 50) break;
  }
  // A API às vezes devolve o post sem a imagem destacada; nesses casos usa a imagem de compartilhamento da página
  for (const p of data.posts.filter(p => !p.imagem)) {
    try {
      const pagina = await (await get("/" + p.slug + "/")).text();
      const m = pagina.match(/property="og:image"s+content="([^"]+)"/);
      if (m) p.imagem = p.thumb = m[1];
    } catch (e) { /* segue sem imagem */ }
  }

  fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data, null, 1));
  console.log("cases", data.cases.length, "| autorais", data.autorais.length, "| servicos", data.servicos.map(s => s.slug + ":" + s.etapas.length).join(","), "| posts", data.posts.length, "| fotos sobre", data.sobre.fotos.length);
})().catch(e => { console.error(e); process.exit(1); });
