# Próxima etapa: levar o novo site para o WordPress

Este arquivo guarda o prompt para abrir a próxima conversa e o que precisa estar em mãos antes dela.

## Antes de começar

Colocar nesta pasta (`05_BETA`), se possível:

1. `tema-atual/`: cópia de `wp-content/themes/impulso`, baixada pelo Gerenciador de Arquivos da Hostinger.
2. `marca/`: logo em vetor (SVG, AI ou PDF) e manual de marca, se existir.

E ter as respostas para:

3. Qual é o plano da Hostinger (aparece no painel) e se há ambiente de testes (staging).
4. Se o RD Station está em uso nos formulários.
5. Quem mantém o site hoje (a I2W ainda atende?) e quem terá acesso ao painel do WordPress.

## Prompt para colar na nova conversa

```text
Vamos começar a etapa de WordPress do novo site da Impulso Filmes.

Contexto: o redesign já foi aprovado em um mockup estático, que está na pasta
mockup/ e publicado em https://danielimpulso.github.io/impulso-site-mockup/.
Leia primeiro mockup/LEIA-ME.md e este PROXIMA-ETAPA.md: eles descrevem a
identidade aprovada, o que é gerado, as escolhas feitas e o que ficou decidido.

O site atual (www.impulsofilmes.com.br) roda em WordPress na Hostinger, com um
tema próprio chamado "impulso" (base Odin), sem construtor de páginas. O
conteúdo, as URLs e o painel devem continuar os mesmos; a ideia é trocar só o
tema. O portfólio usa /portifolio/ e isso não pode mudar. O blog é o principal
motor de SEO.

O que eu trouxe para esta conversa:
- [ ] tema atual em tema-atual/  (sim / não)
- [ ] logo em vetor em marca/    (sim / não)
- plano da Hostinger e staging: ...
- RD Station em uso: ...
- quem mantém o site e quem acessa o painel: ...

Não mexa em nada no site que está no ar sem me perguntar antes.

Quero que você:
1. Analise o tema atual e me diga como cada tipo de conteúdo está guardado
   (portfólio, projetos autorais, soluções e suas etapas, clientes,
   depoimentos, home, formulários) e quais plugins o tema exige.
2. Compare com o mockup e liste o que já existe no WordPress, o que precisa
   de campo novo (por exemplo, os números animados da home) e o que hoje está
   fixo no mockup e precisa virar editável no painel.
3. Proponha o plano de construção do tema novo, em etapas que eu consiga
   aprovar uma a uma, incluindo onde ele será desenvolvido e testado antes de
   ir ao ar, como será a virada e como voltar atrás se algo der errado.
4. Aponte os riscos para o SEO (URLs, títulos, descrições, dados estruturados,
   velocidade) e como cada um será tratado.
5. Diga como levar a página de artigo do blog para o tema (filtro no conteúdo
   dos posts e CSS limpo, conforme a seção "Página de artigo" do LEIA-ME).
6. Diga o que os formulários precisam para funcionar de verdade (orçamento em
   uma tela, trabalhe conosco, solicitação sobre dados pessoais), inclusive a
   integração com o RD Station, se houver.

Comece pela análise (itens 1 e 2) e me mostre o resultado antes de planejar.
```

## Decisões já tomadas (não reabrir)

- Fundo `#2D2D2D`, amarelo `#FDB813`; Anton, IBM Plex Mono e Work Sans.
- Contatos do site: formulário e WhatsApp. Sem e-mail exposto. O telefone fixo fica no rodapé.
- Orçamento em uma tela só, na home e na página Orçamento.
- Política de Privacidade com formulário próprio para pedidos sobre dados pessoais.
- Filtro animado na home e na página Portfólio.
- Textos novos do mockup e números da faixa animada (+25M, +480, +70) aprovados.
- Página de artigo do blog: layout fechado em 2026-10-12 (capa em tela cheia com degradê, índice afastado que se apaga, texto em box, recuo em degraus, listas com ponto). Descrição completa em `mockup/LEIA-ME.md`, seção "Página de artigo"; gabarito em `mockup/post-modelo.html`.
- Versão em inglês fica para uma segunda fase.

## Pontos que a etapa do WordPress precisa resolver

- Vídeos de fundo de Clientes e Sobre usam o vídeo da home como marcador de lugar.
- As listas de pontos de Publicidade e Conteúdo saem dos negritos do texto atual e algumas ficam truncadas; no tema novo devem virar campo editável.
- O texto da Política foi alterado para apontar ao formulário; convém a parte jurídica validar.
- Página de artigo: o mockup marca o corpo dos posts por script (`mockup/_build/artigo.js`): introdução recolhível, número dos subtítulos, blocos de passo, checklist, "Leia também". No tema novo isso vira um filtro em `the_content`, e o CSS do artigo deve ser reescrito limpo a partir do gabarito, porque `post-opcoes.css` acumula as opções testadas.
- A introdução do artigo usa o que vem antes do primeiro título do post. Vale decidir se continua assim ou se passa a usar o campo de resumo do WordPress.
- Títulos em Anton nunca podem ficar em negrito: o editor do WordPress costuma embutir negrito nos títulos, e o tema precisa neutralizar isso.
- Problemas do site atual: descrição errada no case SKA (checar os demais no Rank Math), case "ArcelorMittal: MasterChef" sem link de vídeo legível.
