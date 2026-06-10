/*
 * Servidor HTTPS — Portaria CEPE (com cadeado, para a webcam funcionar na rede)
 * Requer Node.js e o arquivo cert.pfx (certificado) na mesma pasta.
 *
 * Como usar:
 *   node server-https.js          -> https://localhost:8443
 *   node server-https.js 443      -> usa a porta 443 (precisa admin)
 *
 * Obs.: como o certificado é autoassinado, o navegador mostra um aviso na
 * primeira vez. Clique em "Avançado" -> "Prosseguir". Depois a webcam funciona.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8443;
const PUBLIC = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json',
};

const options = {
  pfx: fs.readFileSync(path.join(__dirname, 'cert.pfx')),
  passphrase: 'portaria',
};

https.createServer(options, (req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '/portaria') urlPath = '/index.html';

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
  console.log('  Portaria CEPE (HTTPS) rodando!');
  console.log('  Local:  https://localhost:' + PORT);
  console.log('  Rede:   https://192.168.100.104:' + PORT);
  console.log('  (1a vez: Avancado -> Prosseguir. Ctrl+C para parar)');
  console.log('====================================================');
});
