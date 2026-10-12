// Completa em data.json a imagem dos posts que a API do WordPress devolveu sem imagem destacada,
// lendo a imagem de compartilhamento (og:image) da própria página do post.
// Uso: node _build/imagens-posts.js   (o scrape.js já faz isso sozinho nas próximas coletas)
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const SITE = "https://www.impulsofilmes.com.br";
(async () => {
  let achadas = 0;
  for (const p of data.posts.filter(p => !p.imagem)) {
    try {
      const html = await (await fetch(`${SITE}/${p.slug}/`, { headers: { "user-agent": "Mozilla/5.0 (mockup-impulso)" } })).text();
      const m = html.match(/property="og:image"\s+content="([^"]+)"/) || html.match(/content="([^"]+)"\s+property="og:image"/);
      if (m) { p.imagem = p.thumb = m[1]; achadas++; }
    } catch (e) { /* segue sem imagem */ }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 1));
  console.log("imagens recuperadas:", achadas, "| ainda sem imagem:", data.posts.filter(p => !p.imagem).map(p => p.slug).join(", ") || "nenhum");
})();
