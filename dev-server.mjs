// Servidor local sem dependências para testar a navegação entre as três áreas.
//   http://localhost:5173/            -> tudo por caminho (/, /support/, /hardware/), como no GitHub Pages
//   http://nodara.localhost:5173/     -> página da marca          (simula nodara.com.br)
//   http://support.localhost:5173/    -> Nodara Support           (simula support.nodara.com.br)
//   http://hardware.localhost:5173/   -> Nodara Hardware          (simula hardware.nodara.com.br)
// As regras de subdomínio são as mesmas do arquivo _redirects usado em produção.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));
const porta = Number(process.env.PORT) || 5173;
const tipos = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon'
};

// subdomínio -> pasta da área; /shared/ é servido igual em todos os hosts
function pastaDoHost(host = '') {
  const nome = host.split(':')[0];
  if (nome.startsWith('support.')) return '/support';
  if (nome.startsWith('hardware.')) return '/hardware';
  return '';
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  let caminho = decodeURIComponent(pathname);
  if (!caminho.startsWith('/shared/')) caminho = pastaDoHost(req.headers.host) + caminho;

  const arquivo = normalize(join(raiz, caminho));
  if (!arquivo.startsWith(raiz.endsWith(sep) ? raiz : raiz + sep)) { res.writeHead(403).end(); return; }

  try {
    let alvo = arquivo;
    if ((await stat(alvo)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' }).end(); return; }
      alvo = join(alvo, 'index.html');
    }
    const corpo = await readFile(alvo);
    res.writeHead(200, { 'Content-Type': tipos[extname(alvo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(corpo);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><meta charset="utf-8"><title>404</title><p>Página não encontrada. <a href="/">Voltar à Nodara</a></p>');
  }
}).listen(porta, () => {
  console.log('Nodara em desenvolvimento:');
  console.log(`  por caminho   http://localhost:${porta}/`);
  console.log(`  marca         http://nodara.localhost:${porta}/`);
  console.log(`  support       http://support.localhost:${porta}/`);
  console.log(`  hardware      http://hardware.localhost:${porta}/`);
});
