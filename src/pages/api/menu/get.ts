import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MENU_BIN_ID = process.env.MENU_BIN_ID || '';
  const JSONBIN_ACCESS_KEY = process.env.JSONBIN_ACCESS_KEY || '';

  if (!MENU_BIN_ID || !JSONBIN_ACCESS_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: missing env variable' });
  }

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`, {
      headers: {
        'X-Access-Key': JSONBIN_ACCESS_KEY
      }
    });
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }
    const data = await response.json();
    return res.status(200).json(data.record.items || []);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
} 