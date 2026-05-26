/**
 * GFB — PABX Local Proxy
 * Resolve o CORS para o Power Dialer quando aberto como arquivo local.
 *
 * Como usar:
 *   1. node pabx_proxy.js
 *   2. No Power Dialer → ⚙ Configurações → Proxy URL → http://localhost:8010
 *   3. Clique em "Testar PABX"
 *
 * Requer: Node.js >= 14 (sem npm install)
 */

const http  = require('http');
const https = require('https');

const PORT       = 8010;
const PABX_HOST  = 'pabx2.integravoip.com.br';
const PABX_BASE  = '/suite/api';
const PABX_TOKEN = 'be6e3c68-9013-4701-b09e-e828466f9238';
const PABX_USR   = 'gestao-fitness-brasil-api';

const server = http.createServer((req, res) => {
  // CORS — permite chamadas do browser (qualquer origem)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  if (req.method !== 'POST')    { res.writeHead(405); res.end('Use POST'); return; }

  let rawBody = '';
  req.on('data', chunk => rawBody += chunk.toString());
  req.on('end', () => {
    let payload;
    try { payload = JSON.parse(rawBody); }
    catch { res.writeHead(400); res.end(JSON.stringify({ error: 'JSON inválido' })); return; }

    const { endpoint, method = 'GET', body } = payload;
    if (!endpoint) { res.writeHead(400); res.end(JSON.stringify({ error: 'endpoint obrigatório' })); return; }

    const pabxPath = PABX_BASE + endpoint;
    const bodyStr  = body ? JSON.stringify(body) : null;

    const headers = {
      'accept':  'application/json',
      'usuario': PABX_USR,
      'token':   PABX_TOKEN,
    };
    if (method === 'POST' && bodyStr) {
      headers['Content-Type']   = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    console.log(`[PABX] ${method} ${pabxPath}${bodyStr ? ' ' + bodyStr : ''}`);

    const pabxReq = https.request({ hostname: PABX_HOST, port: 443, path: pabxPath, method, headers }, pabxRes => {
      let data = '';
      pabxRes.on('data', chunk => data += chunk);
      pabxRes.on('end', () => {
        const status = pabxRes.statusCode || 200;
        console.log(`[PABX] ← ${status} ${data.slice(0, 120)}`);
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(data || '{}');
      });
    });

    pabxReq.on('error', err => {
      console.error('[PABX] Erro na requisição:', err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

    if (bodyStr) pabxReq.write(bodyStr);
    pabxReq.end();
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   GFB — PABX Proxy rodando                  ║');
  console.log(`║   http://localhost:${PORT}                       ║`);
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║   No Power Dialer → ⚙ → Proxy URL:          ║');
  console.log(`║   http://localhost:${PORT}                       ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log('Aguardando requisições... (Ctrl+C para parar)');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Porta ${PORT} já está em uso. Encerre o outro processo ou mude o PORT no script.\n`);
  } else {
    console.error('Erro no servidor:', err.message);
  }
  process.exit(1);
});
