import type { NextApiRequest, NextApiResponse } from 'next';

// Konstanta dari config.ts
const GALLERY_BIN_ID = process.env.NEXT_PUBLIC_GALLERY_BIN_ID || '6814e26d8a456b7966963283';
const JSONBIN_ACCESS_KEY = process.env.NEXT_PUBLIC_JSONBIN_ACCESS_KEY || '$2a$10$xsY/DO6ox7YytNsshU0xBeXxftwA6Gm/IDVr8zBvFJu5SP7V5wKo2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Hanya izinkan metode POST untuk keamanan
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Reset galeri ke array kosong
    const response = await fetch(`https://api.jsonbin.io/v3/b/${GALLERY_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': JSONBIN_ACCESS_KEY
      },
      body: JSON.stringify({ photos: [] })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to reset gallery: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Gallery reset successfully', 
      data 
    });
  } catch (error) {
    console.error('Error resetting gallery:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error resetting gallery',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 