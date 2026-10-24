# Nodara Soluções em TI

Três áreas de uma mesma marca, com navegação integrada:

| Área | Pasta | Produção (exemplo) |
|---|---|---|
| Página principal da marca, Sobre e Contato | `/`, `sobre/`, `contato/` | `nodara.com.br` |
| **Nodara Support**: suporte tecnológico para pessoas e empresas | `support/` | `support.nodara.com.br` |
| **Nodara Hardware**: manutenção, diagnóstico e soluções para equipamentos | `hardware/` | `hardware.nodara.com.br` |

Os domínios são exemplos de arquitetura: troque pelos registrados.

HTML, CSS e JavaScript puros, sem build.

## Estrutura

```
index.html            página principal da marca
sobre/  contato/      páginas institucionais
support/index.html    Nodara Support (serviços, planos, formulário de diagnóstico)
hardware/index.html   Nodara Hardware (impressão 3D, computadores, formulário de orçamento)
shared/nodara.css     identidade visual, botões, cabeçalho, rodapé e componentes comuns
shared/nodara.js      <nodara-header>, <nodara-footer>, endereços entre áreas, formulários
equipamentos.html     redireciona o endereço antigo para hardware/
dev-server.mjs        servidor local que simula os subdomínios
_redirects            regras de subdomínio para produção (Netlify)
```

Cada página diz onde está com `<html data-pagina="marca|sobre|contato|support|hardware">`,
usa `<nodara-header>` e `<nodara-footer>` e só define no próprio `<style>` o tema da área
(tokens `--accent*`) e os componentes exclusivos dela.

## Links entre áreas

Todo link para outra área é escrito assim:

```html
<a href="../hardware/#contato" data-site="hardware" data-hash="#contato">Pedir orçamento</a>
```

O `href` relativo funciona direto no GitHub Pages e em qualquer servidor estático. O
`shared/nodara.js` troca esse endereço pelo certo para o ambiente:

- **subdomínios de produção** (`CONFIG.dominios`): `https://hardware.nodara.com.br/#contato`
- **subdomínios locais** (`CONFIG.dominiosLocais`): `http://hardware.localhost:5173/#contato`
- **por caminho** (qualquer outro endereço, inclusive `file://`): `.../hardware/#contato`

## Rodando localmente

```bash
npm run dev
```

- `http://localhost:5173/` – as três áreas por caminho
- `http://nodara.localhost:5173/`, `http://support.localhost:5173/`, `http://hardware.localhost:5173/` – como em produção, um subdomínio por área

## Publicação

- **GitHub Pages** (atual): publica a branch `main`; as áreas ficam em `/support/` e `/hardware/`.
- **Subdomínios**: publique o repositório inteiro num projeto do Netlify, aponte os três
  domínios para ele e ajuste os domínios em `_redirects` e em `CONFIG.dominios`
  (`shared/nodara.js`). As regras servem `support/` e `hardware/` na raiz de cada subdomínio.

## Contato e pedidos

Cidade, WhatsApp e e-mail ficam no objeto `CONFIG` no início de `shared/nodara.js`. Com eles
preenchidos, a página de contato mostra os canais.

Os formulários do Support e do Hardware montam o pedido e copiam o texto, já identificando a
área (`Área: Support` ou `Área: Hardware`), para que um painel futuro saiba de onde veio cada solicitação.
