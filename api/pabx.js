/**
 * Vercel Serverless Function — Proxy PABX
 * Rota: /api/pabx  (POST)
 *
 * Recebe do front-end: { endpoint, method, body }
 * Repassa para o PABX com autenticação e retorna a resposta.
 */

const https = require('https');
const url   = require('url');

const PABX_BASE  = 'https://pabx2.integravoip.com.br/suite/api';
const PABX_USR   = 'gestao-fitness-brasil-api';
const PABX_TOKEN = 'be6e3c68-9013-4701-b09e-e828466f9238';

function pabxRequest(endpoint, method, bodyObj) {
  return new Promise((resolve, reject) => {
    const parsed  = url.parse(PABX_BASE + endpoint);
    const bodyStr = (method === 'POST' && bodyObj) ? JSON.stringify(bodyObj) : null;

    const options = {
      hostname: parsed.hostname,
      port:     443,
      path:     parsed.path,
      method:   method || 'GET',
      headers: {
        'accept':         'application/json',
        'usuario':        PABX_USR,
        'token':          PABX_TOKEN,
        'Content-Type':   'application/json',
      },
    };

    if (bodyStr) options.headers['Content-Length'] = Buffer.byteLength(bodyStr);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try   { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: { raw: data } }); }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // CORS — permite o proprio dominio Vercel e localhost para testes
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Metodo nao permitido' }); return; }

  const { endpoint, method = 'GET', body: pabxBody } = req.body || {};

  if (!endpoint) {
    res.status(400).json({ error: 'Campo "endpoint" obrigatorio' });
    return;
  }

  try {
    const result = await pabxRequest(endpoint, method, pabxBody);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[proxy-pabx]', err.message);
    res.status(502).json({ error: 'Falha ao contatar PABX', detail: err.message });
  }
};
