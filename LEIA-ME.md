# Mockup do novo site da Impulso Filmes

Protótipo estático do redesign de www.impulsofilmes.com.br. Serve para validar visual e organização antes de virar tema do WordPress. Nada aqui altera o site no ar.

- Publicado em: https://danielimpulso.github.io/impulso-site-mockup/
- Repositório: https://github.com/DANIELIMPULSO/impulso-site-mockup
- Para ver localmente: abrir a pasta com um servidor estático (por exemplo `npx serve mockup -l 4321`).

## O que é feito à mão e o que é gerado

| Arquivo | Origem |
|---|---|
| `index.html`, `script.js`, `style.css` | Home, feita à mão. O gerador só atualiza menu, rodapé, links e os 3 posts recentes. |
| `pages.css`, `case.css`, `servico.css`, `extra.css`, `pages.js` | Estilos e comportamento das páginas internas, feitos à mão. |
| `case.html`, `case-opcao2.html`, `servico.html`, `servico-opcao1.html` | Opções de layout guardadas para comparação (têm um seletor no canto inferior esquerdo). |
| Todas as outras `.html` | Geradas por `_build/build.js`. Não editar à mão: a próxima geração sobrescreve. |

Páginas geradas: `sobre`, `portfolio`, `case-<slug>` (30), `publicidade`, `institucional`, `conteudo`, `capacitacao`, `autorais`, `autoral-<slug>` (9), `clientes`, `blog`, `post-<slug>` (119), `orcamento`, `trabalhe-conosco`, `politica`.

## Como regenerar

Precisa do Node e do pacote `cheerio` instalado em alguma pasta (fora do Drive, para não sincronizar `node_modules`).

```bash
NODE_PATH=/caminho/para/node_modules node _build/scrape.js   # lê o site no ar e grava _build/data.json
NODE_PATH=/caminho/para/node_modules node _build/build.js    # gera as páginas a partir de data.json
```

- `_build/scrape.js`: coleta cases, projetos autorais, soluções, sobre, formulários, política e posts (pela API do WordPress).
- `_build/fixas.js`: conteúdo das páginas Clientes, Projetos autorais e Capacitação.
- `_build/build.js`: modelos de todas as páginas.
- `_build/preparar.js` e `_build/patch-pages-js.js`: passos únicos já executados; ficam só como registro.

## Limites do mockup

- Imagens e vídeos são carregados direto do site no ar.
- Os formulários não enviam nada.
- As páginas têm `noindex` para não aparecer no Google.
