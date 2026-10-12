// Passo único: troca o formulário da caixa de orçamento da home pela opção 1 da comparação
// (todos os campos do formulário atual em uma tela só, em grade de três colunas).
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const TXT = { nome: ["Nome", "text", "name"], email: ["E-mail", "email", "email"], tel: ["Telefone/WhatsApp", "tel", "tel"], empresa: ["Nome da empresa", "text", "organization"], site: ["Site da empresa", "text", "url"] };
const SEL = {
  servico: ["Serviço procurado", ["Vídeo Institucional", "Publicidade", "Conteúdo de Marca", "Outros"]],
  investimento: ["Investimento disponível", ["10 mil", "10 - 15 mil", "15 - 20 mil", "20 - 30 mil", "30 - 40 mil", "mais de 40 mil"]],
  porte: ["Porte da empresa (pessoas)", ["1 a 30", "31 a 60", "61 a 100", "101 a 200", "201 a 500", "mais de 500"]],
  cargo: ["Qual o seu cargo?", ["Diretor / C-Level / Sócio / Fundador", "Gerente / Head", "Coordenador / Supervisor", "Analista / Especialista", "Assistente / Estagiário", "Empresário / Proprietário", "Outro"]],
  area: ["Área em que você atua", ["Marketing e Comunicação", "Comercial e Vendas", "Administrativo / Operações", "Financeiro / Compras", "Recursos Humanos / Gente e Gestão", "Tecnologia / TI / Produto", "Projetos / Estratégia / Consultoria", "Outro"]],
};
const input = k => `      <label>${TXT[k][0]}<input type="${TXT[k][1]}" name="${k}" autocomplete="${TXT[k][2]}"${/nome|email|tel/.test(k) ? " required" : ""}></label>`;
const select = k => `      <label>${SEL[k][0]}<select name="${k}"><option value="">Selecione</option>${SEL[k][1].map(o => `<option>${esc(o)}</option>`).join("")}</select></label>`;

const form = `<form id="form" novalidate>
${["nome", "email", "tel", "empresa", "site"].map(input).join("\n")}
${["porte", "cargo", "area", "servico", "investimento"].map(select).join("\n")}
      <label class="span2">Faça uma breve descrição do seu projeto<textarea name="msg" rows="2"></textarea></label>
      <button class="btn solid" type="submit">Pedir orçamento</button>
      <p class="form-note" role="status"></p>
    </form>`;

let h = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
const re = /<form id="form" novalidate>[\s\S]*?<\/form>/;
if (!re.test(h)) throw new Error("formulário da home não encontrado");
fs.writeFileSync(path.join(OUT, "index.html"), h.replace(re, () => form));

let c = fs.readFileSync(path.join(OUT, "style.css"), "utf8");
if (!c.includes("/* Caixa de orçamento da home: opção 1")) {
  c += `
/* Caixa de orçamento da home: opção 1 da comparação (todos os campos em uma tela, grade de três colunas) */
.budget-grid { grid-template-columns: minmax(0, .8fr) minmax(0, 2fr); gap: clamp(28px, 5vw, 72px); }
#form { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 16px; }
#form label { font-size: 13.5px; }
#form input, #form select, #form textarea { padding: 12px 13px; }
#form .span2 { grid-column: span 2; }
#form .btn { grid-column: 1; justify-self: start; margin-top: 6px; }
#form .form-note { grid-column: 2 / -1; align-self: center; }
@media (max-width: 900px) {
  .budget-grid { grid-template-columns: 1fr; }
  #form { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  #form { grid-template-columns: 1fr; }
  #form .span2, #form .btn, #form .form-note { grid-column: auto; }
}
`;
  fs.writeFileSync(path.join(OUT, "style.css"), c);
}
console.log("ok");
