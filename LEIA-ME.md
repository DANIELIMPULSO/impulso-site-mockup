# Mockup do novo site da Impulso Filmes

Protótipo estático do redesign de www.impulsofilmes.com.br. Serve para validar visual e organização antes de virar tema do WordPress. Nada aqui altera o site no ar.

- Publicado em: https://danielimpulso.github.io/impulso-site-mockup/
- Repositório: https://github.com/DANIELIMPULSO/impulso-site-mockup
- Para ver localmente: abrir a pasta com um servidor estático (por exemplo `npx serve mockup -l 4321`).

## Identidade aprovada

| Item | Definição |
|---|---|
| Fundo | cinza-escuro `#2D2D2D`; faixas e cartões `#383838`; fios `#4A4A4A` |
| Destaque | amarelo da marca `#FDB813` |
| Texto | quase-branco `#F4F2EC`; secundário `#A3A19A` |
| Títulos | Anton, em maiúsculas |
| Chapéus e rótulos | IBM Plex Mono |
| Textos longos | Work Sans |

Elementos recorrentes: letras em contorno amarelo que reagem ao mouse, cursor próprio com ondas de sonar sobre itens clicáveis, cantos de visor de câmera nos players, timecode REC nas aberturas, fio fino com traço amarelo entre seções, lista numerada de pontos, botão de WhatsApp redondo.

## O que é feito à mão e o que é gerado

| Arquivo | Origem |
|---|---|
| `index.html`, `script.js`, `style.css` | Home, feita à mão. O gerador só atualiza menu, rodapé, links e os 3 posts recentes. |
| `pages.css`, `case.css`, `servico.css`, `extra.css`, `pages.js` | Estilos e comportamento das páginas internas, feitos à mão. |
| Todas as outras `.html` (exceto as de comparação abaixo) | Geradas por `_build/build.js`. Não editar à mão: a próxima geração sobrescreve. |

Páginas geradas: `sobre`, `portfolio`, `case-<slug>` (30), `publicidade`, `institucional`, `conteudo`, `capacitacao`, `autorais`, `autoral-<slug>` (9), `clientes`, `blog`, `post-<slug>` (119), `orcamento`, `trabalhe-conosco`, `politica`.

### Páginas de comparação (não fazem parte do site)

| Arquivo | O que compara | Escolha |
|---|---|---|
| `case.html`, `case-opcao2.html` | layouts da página de case | opção 3 (a que o gerador usa) |
| `servico.html`, `servico-opcao1.html` | layouts da página de solução | opção 2 (a que o gerador usa) |
| `opcoes-cartoes.html` | destaque dos cartões de soluções da home | opção 1, moldura interna sem número |
| `opcoes-orcamento.html` | formatos da caixa de orçamento da home | opção 1, tudo em uma tela |

## Como regenerar

Precisa do Node e do pacote `cheerio` instalado em alguma pasta (fora do Drive, para não sincronizar `node_modules`).

```bash
NODE_PATH=/caminho/para/node_modules node _build/scrape.js   # lê o site no ar e grava _build/data.json
NODE_PATH=/caminho/para/node_modules node _build/build.js    # gera as páginas a partir de data.json
```

- `_build/scrape.js`: coleta cases, projetos autorais, soluções, sobre, formulários, política e posts (pela API do WordPress).
- `_build/fixas.js`: conteúdo das páginas Clientes, Projetos autorais e Capacitação.
- `_build/build.js`: modelos de todas as páginas, menu e rodapé.
- `_build/preparar.js`, `_build/patch-pages-js.js`, `_build/form-home.js`: passos únicos já executados; ficam só como registro.

## Como publicar

A pasta do Drive não é um repositório git. Para publicar: clonar o repositório em uma pasta temporária, copiar o conteúdo de `mockup/` por cima, acrescentar `?v=<data>` aos links de CSS e JS dos HTML (o GitHub Pages guarda cache por 10 minutos), fazer commit e push.

## Limites do mockup

- Imagens e vídeos são carregados direto do site no ar.
- Os formulários não enviam nada.
- As páginas têm `noindex` para não aparecer no Google.
- Números da faixa animada (+25M, +480, +70) foram informados e aprovados pela Impulso; não vêm do site atual.
- Alguns textos não existem no site atual (títulos das chamadas finais, alguns títulos de seção, listas de pontos); foram aprovados em 2026-10-12.

## Próxima etapa: levar para o WordPress

O site atual usa um tema próprio (`impulso`, sobre a base Odin), sem construtor de páginas. O caminho previsto é um tema novo que lê o mesmo conteúdo, mantendo todas as URLs (o portfólio usa `/portifolio/`).

### O que falta receber

1. Arquivos do tema atual (`wp-content/themes/impulso`), para saber como os campos de portfólio, soluções, clientes e depoimentos estão guardados.
2. Arquivos da marca em vetor (logo); hoje o mockup inverte o PNG do site para branco.
3. Plano da Hostinger, para saber se há ambiente de testes (staging).
4. Se o RD Station está em uso, para os formulários continuarem enviando os contatos para lá.
5. Quem mantém o site hoje (a I2W ainda atende?).

### Decisões tomadas em 2026-10-12

- Orçamento em uma tela só, na home e na página Orçamento.
- Política de Privacidade sem e-mail: os pedidos sobre dados pessoais usam um formulário na própria página.
- Telefone fixo continua no rodapé; e-mail não aparece em nenhuma página.
- Filtro animado na home e na página Portfólio (também nos filtros do blog e dos projetos autorais).
- Textos novos do mockup e números da faixa animada aprovados.

### Ainda em aberto

- Versão em inglês: prevista para uma segunda fase.
- Vídeos de fundo: Clientes e Sobre usam o vídeo da home como marcador de lugar.
- Listas de pontos de Publicidade e Conteúdo: saem dos negritos do texto atual e algumas ficam truncadas.
- Texto da Política: foi alterado para apontar ao formulário; convém validar com a parte jurídica.

O prompt para abrir a conversa do WordPress está em `../PROXIMA-ETAPA.md`.

### Problemas do site atual notados no caminho

- A página do case SKA está com a descrição para o Google de outro case (Usina Jatiboca); vale checar os demais no Rank Math.
- O case "ArcelorMittal: MasterChef" não tem link de vídeo legível.
- 16 posts do blog estão sem imagem destacada.
