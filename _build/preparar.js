// Passo único de preparação: cria _build/fixas.js a partir do rascunho das páginas fixas,
// acrescenta ao style.css o menu com submenu / rodapé / logos, e limpa as páginas-modelo antigas.
// Uso: node _build/preparar.js <caminho do rascunho paginas.js>
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..");

// ----- fixas.js -----
let src = fs.readFileSync(process.argv[2], "utf8");
const corte = src.indexOf('fs.writeFileSync(f("clientes.html")');
if (corte < 0) throw new Error("rascunho inesperado");
src = src.slice(0, corte);
const a = src.indexOf('  <div class="posters" id="posters">\n'), b = src.indexOf("\n  </div>\n</section>\n\n<!-- Incentivo -->");
if (a < 0 || b < 0) throw new Error("bloco de cartazes não encontrado");
src = src.slice(0, a) + '  <div class="posters" id="posters">\n    @@POSTERS@@' + src.slice(b);
src = src
  .replace("Financiamento privado e apoio de marcas", "Linhas de financiamento privadas")
  .split("index.html#orcamento").join("orcamento.html")
  .replace("const dir = process.argv[2];", "const dir = __dirname;");
src += `
module.exports = { hero, cta, clientes, capacitacao, autorais: cartazes => autorais.replace("@@POSTERS@@", cartazes) };
`;
fs.writeFileSync(path.join(__dirname, "fixas.js"), src);

// ----- style.css: submenu, rodapé com 4 colunas, logos em branco -----
let css = fs.readFileSync(path.join(OUT, "style.css"), "utf8");
if (!css.includes("/* ---------- Menu com submenu")) {
  css = css.replace(".track img { height: 64px; width: 64px; object-fit: contain; filter: grayscale(1) brightness(1.6); opacity: .75; }",
    ".track img { height: 64px; width: 64px; object-fit: contain; filter: brightness(0) invert(1); opacity: .6; }");
  css += `
/* ---------- Menu com submenu (Soluções) e rodapé com links das páginas ---------- */
.sub { position: relative; }
.sub > a { opacity: .85; }
.sub > a::after { content: "+"; margin-left: 6px; color: var(--yellow); }
.sub-menu { position: absolute; top: 100%; left: -18px; display: grid; gap: 16px; min-width: 190px; padding: 22px 18px 18px; background: rgba(11, 11, 12, .96); border: 1px solid var(--line); border-top: 2px solid var(--yellow); opacity: 0; visibility: hidden; transform: translateY(8px); transition: opacity .2s, transform .2s, visibility .2s; }
.sub:hover .sub-menu, .sub:focus-within .sub-menu { opacity: 1; visibility: visible; transform: none; }
@media (min-width: 1101px) { .foot { grid-template-columns: 1.1fr 1fr 1fr 1fr; } }

/* Com mais itens, o menu vira botão um pouco antes */
@media (max-width: 1100px) {
  .burger { display: block; }
  .top nav { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; align-items: flex-start; gap: 18px; max-height: calc(100svh - 70px); overflow-y: auto; padding: 24px var(--gutter) 28px; background: rgba(11, 11, 12, .97); font-size: 20px; }
  .top nav.open { display: flex; }
  .sub-menu { position: static; opacity: 1; visibility: visible; transform: none; min-width: 0; padding: 14px 0 0 16px; border: 0; background: none; gap: 14px; font-size: 16px; }
  .foot { grid-template-columns: 1fr 1fr; }
  .foot-logo, .legal { grid-column: 1 / -1; }
}
`;
  fs.writeFileSync(path.join(OUT, "style.css"), css);
}

// ----- páginas-modelo antigas: sem a palavra gigante de fundo -----
for (const n of fs.readdirSync(OUT).filter(x => x.endsWith(".html"))) {
  const h = fs.readFileSync(path.join(OUT, n), "utf8");
  const k = h.replace(/\n[ \t]*<p class="outline" aria-hidden="true">[^<]*<\/p>/g, "");
  if (k !== h) fs.writeFileSync(path.join(OUT, n), k);
}
for (const n of fs.readdirSync(OUT).filter(x => x.endsWith(".js"))) {
  const j = fs.readFileSync(path.join(OUT, n), "utf8");
  const k = j.replace(/outline\.style\.setProperty/g, "outline?.style.setProperty");
  if (k !== j) fs.writeFileSync(path.join(OUT, n), k);
}
console.log("preparação ok");
