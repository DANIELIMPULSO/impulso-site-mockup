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
| `post-opcoes.css`, `post.js` | Estilos e comportamento da página de artigo do blog, feitos à mão (ver "Página de artigo"). |
| Todas as outras `.html` (exceto as de comparação abaixo) | Geradas por `_build/build.js`. Não editar à mão: a próxima geração sobrescreve. |

Páginas geradas: `sobre`, `portfolio`, `case-<slug>` (30), `publicidade`, `institucional`, `conteudo`, `capacitacao`, `autorais`, `autoral-<slug>` (9), `clientes`, `blog`, `post-<slug>` (119), `orcamento`, `trabalhe-conosco`, `politica`.

### Páginas de comparação (não fazem parte do site)

| Arquivo | O que compara | Escolha |
|---|---|---|
| `case.html`, `case-opcao2.html` | layouts da página de case | opção 3 (a que o gerador usa) |
| `servico.html`, `servico-opcao1.html` | layouts da página de solução | opção 2 (a que o gerador usa) |
| `opcoes-cartoes.html` | destaque dos cartões de soluções da home | opção 1, moldura interna sem número |
| `opcoes-orcamento.html` | formatos da caixa de orçamento da home | opção 1, tudo em uma tela |
| `post-opcao1.html` a `post-opcao11.html` | layouts da página de artigo do blog (geradas por `_build/opcoes-post.js`) | opção 8, capa em tela cheia + índice afastado |
| `post-capa.html` | quatro formas de resolver a capa do artigo | capa 2, degradê no topo |
| `post-texto.html` | hierarquia do texto dentro de cada passo | texto 1, recuo em degraus |
| `post-lista.html` | marcadores de lista | lista 1, ponto |
| `post-modelo.html` | página de referência do artigo aprovado, sem seletores | é o layout que o gerador usa |
| `case-estudo.html` | página de CASE (por que nos procurou, desafio, entrega, resultado), separada da página simples de portfólio; seis layouts no botão "Case 1 a 6" (gerada por `_build/case-estudo.js`, com `case-estudo.css` e `case-estudo.js`) | em aberto |
| `autorais-opcao2.html` | listagem de projetos autorais em formato de catálogo (capas em fila e fileiras, com `flix.js`) | rejeitada; ficou a grade de cartazes |
| `autoral-opcao1.html` | página de filme antiga, com "Sobre o filme" | substituída por "Exibições e licenciamentos" + láureas |

## Como regenerar

Precisa do Node e do pacote `cheerio` instalado em alguma pasta (fora do Drive, para não sincronizar `node_modules`).

```bash
NODE_PATH=/caminho/para/node_modules node _build/scrape.js   # lê o site no ar e grava _build/data.json
NODE_PATH=/caminho/para/node_modules node _build/build.js    # gera as páginas a partir de data.json
```

- `_build/scrape.js`: coleta cases, projetos autorais, soluções, sobre, formulários, política e posts (pela API do WordPress).
- `_build/fixas.js`: conteúdo das páginas Clientes, Projetos autorais e Capacitação.
- `_build/build.js`: modelos de todas as páginas, menu e rodapé.
- `_build/artigo.js`: marcações do corpo dos artigos do blog (índice, introdução, passos, checklist, "Leia também"), usado por `build.js`.
- `_build/opcoes-post.js`: gera só as páginas de comparação do artigo (`post-opcao*.html`, `post-capa.html`, `post-texto.html`, `post-lista.html`, `post-modelo.html`).
- `_build/imagens-posts.js`: completa em `data.json` a imagem dos posts que a API devolve sem imagem destacada (o `scrape.js` já faz isso nas próximas coletas).
- `_build/preparar.js`, `_build/patch-pages-js.js`, `_build/form-home.js`: passos únicos já executados; ficam só como registro.

## Página de artigo (blog)

Layout fechado em 2026-10-12. A referência visual é `post-modelo.html`; os 119 artigos (`post-<slug>.html`) são gerados com ele.

| Parte | Como ficou |
|---|---|
| Capa | Foto de destaque em tela cheia atrás do menu, 20% mais escura, com degradê escuro no topo e na base. Título por cima, com no máximo 3 linhas em tela larga. Três setinhas animadas no centro da base indicam que há mais conteúdo; somem ao rolar. |
| Índice "Neste artigo" | À esquerda, bem afastado do texto, preso na tela. Marca a seção em leitura e cai para 32% de opacidade quando a leitura começa; volta com o mouse em cima. No celular vira uma lista antes do texto. Só aparece em artigos com duas seções ou mais. |
| Texto | Dentro de um box mais claro (`#383838`). Corpo de 16 a 17,5px conforme a tela; fotos e vídeos sempre na largura exata do texto. |
| Introdução | Tudo o que vem antes do primeiro título entra sob o chapéu amarelo "O que você vai encontrar neste artigo" (14px, negrito), em letra menor (13px). Clicar no chapéu recolhe o bloco e a setinha vira para a direita. |
| Títulos de seção (h2) | Anton, até 32px, com o fio de traço amarelo acima. |
| Subtítulos (h3) | Work Sans 600, até 22px. Quando começam com número ("2. Defina..."), o número sai do texto e vira um marcador amarelo na margem; o texto do passo alinha com o subtítulo e as listas entram mais um degrau. |
| Listas | Marcador em ponto amarelo, itens 1px menores que o corpo, sempre com respiro acima e abaixo. |
| "Leia também" | Bloco próprio entre dois fios, separado do texto. |
| Checklist | Linhas que começam com ☐ viram caixas que se marcam, uma a uma, conforme a página rola. |
| Legendas | 14px abaixo das fotos e 26px abaixo dos vídeos (os cantos de visor saem do player). |

Como está montado:

- As classes `po po8 f-box capa-2 txt-1 bul-1` no `<body>` ligam o layout em `post-opcoes.css`. Artigos sem foto de destaque recebem também `sem-capa`, e os sem seções, `sem-indice`.
- `post-opcoes.css` guarda, em camadas, todas as opções testadas e os ajustes feitos por cima delas. Funciona, mas não é o CSS que deve ir para o tema: ao escrever o tema WordPress, reescrever só as regras do layout final, usando `post-modelo.html` como gabarito.
- As marcações do corpo (`details.chamada`, `h3.num` com `span.h3-n`, `section.passo`, `ul.check`, `ul.leia`, `p.anuncia`, ids nos `h2`) são feitas por `_build/artigo.js`. No WordPress, o mesmo trabalho precisa de um filtro em `the_content`.
- O WordPress entrega títulos com negrito embutido (`<h2><b>...</b></h2>`). A Anton só tem um peso, e o navegador engrossa a letra artificialmente; `extra.css` e `post-opcoes.css` têm regras que fazem esse negrito herdar o peso do título. Manter isso no tema.

## Front-end aprovado em 2026-10-13

Daniel aprovou o front-end do mockup. O que entrou depois da página de artigo:

| Página | O que ficou |
|---|---|
| Página de CASE (`case-estudo.html`, gerada por `_build/case-estudo.js`) | Tipo novo de página de projeto, além da página simples de portfólio. Formato 6: filme e resumo na primeira tela, três cartões (desafio, o que fizemos, resultado), a história em três partes que abrem em "Ler a história completa" só quando o texto não cabe, resultado com gráfico animado de antes e depois e lista "Na prática", números do projeto e depoimento com foto do filme ao lado e retrato pequeno junto do nome. |
| Projetos autorais, listagem | Grade de cartazes com filtros Curta, Longa, Ficção, Documentário e Outros; ao passar o mouse o cartaz cresce, ganha cantos de visor e a faixa "Ver o filme". Sem "Book de projetos". |
| Projetos autorais, filme | "Exibições e licenciamentos" no lugar de "Sobre o filme": listas em blocos de 6 com setas, contadores e quadro de láureas (ramo em contorno, branco, uma linha que gira quando passa de seis). Depois vêm ficha técnica e bastidores. Sem "Quero apoiar". |
| Soluções | Em "Como funciona", um vídeo bem discreto atrás do número de cada etapa. |
| Clientes | Título "Quem já confiou sua marca à Impulso"; depoimento com foto grande e anel animados em camadas separadas. |
| Sobre | Título ao lado do vídeo; números centralizados entre os fios. |
| Home | Cartões de depoimento maiores, em itálico e entre aspas. |
| Todas | Foto ampliada com cursor por cima, setas e contador; botão do WhatsApp com a logo em branco; títulos da abertura quebram só entre palavras. |

Conteúdo provisório que NÃO deve ir para o site:

- **Brasiliana:** exibições, licenciamentos e láureas de teste (bloco `EXEMPLO_CIRCUITO` em `_build/build.js`). São reais só a licença Curta!/Itaú Cultural e as láureas Brasil Cinemundi 2017 e Edital BRDE/FSA 2018.
- **Case SKA:** o gráfico de antes e depois usa números de exemplo; o retrato da cliente mostra as iniciais até existir `fotos/gabriele-bitello.jpg`; a página do projeto diz 12 cidades e o artigo do blog diz 14 (o case usa 14).
- **Soluções:** o vídeo das etapas é o da home, um trecho por etapa.
- **Publicidade:** o texto da etapa "Captação" foi emprestado de Vídeo institucional.

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
- Layout da página de artigo do blog fechado (ver "Página de artigo").

### Ainda em aberto

- Versão em inglês: prevista para uma segunda fase.
- Vídeos de fundo: Clientes e Sobre usam o vídeo da home como marcador de lugar.
- Listas de pontos de Publicidade e Conteúdo: saem dos negritos do texto atual e algumas ficam truncadas.
- Texto da Política: foi alterado para apontar ao formulário; convém validar com a parte jurídica.

O prompt para abrir a conversa do WordPress está em `../PROXIMA-ETAPA.md`.

### Problemas do site atual notados no caminho

- A página do case SKA está com a descrição para o Google de outro case (Usina Jatiboca); vale checar os demais no Rank Math.
- O case "ArcelorMittal: MasterChef" não tem link de vídeo legível.
