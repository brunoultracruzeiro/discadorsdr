// ============================================================
// Vercel Serverless Function — PABX IntegraVoip Proxy
// Salve como: api/pabx.js no repositório
// Deploy via GitHub → Vercel automático
// ============================================================

const PABX_BASE    = 'https://pabx2.integravoip.com.br/suite/api';
const PABX_TOKEN   = 'be6e3c68-9013-4701-b09e-e828466f9238';
const PABX_USUARIO = 'gestao-fitness-brasil-api';

export default async function handler(req, res) {
  // CORS — permite chamadas do browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST' }); return;
  }

  const { endpoint, method = 'GET', body } = req.body || {};
  if (!endpoint) { res.status(400).json({ error: 'endpoint obrigatório' }); return; }

  const pabxHeaders = {
    'accept':   'application/json',
    'usuario':  PABX_USUARIO,
    'token':    PABX_TOKEN,
  };
  if (method === 'POST') pabxHeaders['Content-Type'] = 'application/json';

  try {
    const pabxRes = await fetch(PABX_BASE + endpoint, {
      method,
      headers: pabxHeaders,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const text = await pabxRes.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(pabxRes.status).send(text || '{}');
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
