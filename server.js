/*
 * Servidor estático simples — Portaria CEPE
 * Zero dependências. Requer apenas Node.js instalado.
 *
 * Como usar:
 *   node server.js            -> sobe em http://localhost:8080
 *   node server.js 3000       -> sobe na porta 3000
 *
 * Importante: servir por http(s) (e não abrir o arquivo direto) faz a
 * WEBCAM funcionar, pois "localhost" e "https" são contextos seguros.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8080;
const PUBLIC = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '/portaria') urlPath = '/index.html';

  // impede sair da pasta pública
  const filePath = path.join(PUBLIC, path.normalize(urlPath));
  if (!filePath.startsWith(PUBLIC)) { res.writeHead(403); return res.end('Proibido'); }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404</h1><p>Pagina nao encontrada.</p>');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log('====================================================');
  console.log('  Portaria CEPE rodando!');
  console.log('  Local:  http://localhost:' + PORT);
  console.log('  Rede:   http://SEU-IP:' + PORT + '   (outras maquinas)');
  console.log('  (Ctrl+C para parar)');
  console.log('====================================================');
});
