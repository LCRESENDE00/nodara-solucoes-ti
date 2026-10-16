# Nodara Soluções em TI

Site institucional da Nodara Soluções em TI: manutenção e upgrade de computadores, eletrônica, manutenção e peças de impressoras 3D, infraestrutura para pequenas empresas, redes residenciais, orçamentos de equipamentos e intermediação de venda.

Página única em HTML, CSS e JavaScript puros, sem build. Publicada pelo GitHub Pages a partir da branch `main`.

## Contato

Os dados de contato ficam no objeto `CONFIG`, no início do `<script>` em `index.html`:

```js
const CONFIG = {
  cidade: "Belo Horizonte – MG",
  whatsapp: "",   // só números, com 55 e DDD. Ex.: 5531999999999
  email: "",
  instagram: ""
};
```

Com o WhatsApp preenchido, o formulário de orçamento ganha o botão que abre a conversa já com o pedido escrito.
