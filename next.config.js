/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Menonaktifkan ESLint selama build produksi
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Menonaktifkan pengecekan tipe selama build produksi
    ignoreBuildErrors: true,
  },
  env: {
    USERS_BIN_ID: process.env.USERS_BIN_ID,
    JSONBIN_MASTER_KEY: process.env.JSONBIN_MASTER_KEY,
    JSONBIN_ACCESS_KEY: process.env.JSONBIN_ACCESS_KEY,
    JSONBIN_ACCESS_KEY_ID: process.env.JSONBIN_ACCESS_KEY_ID,
    IMGBB_API_KEY: process.env.IMGBB_API_KEY,
    MENU_BIN_ID: process.env.MENU_BIN_ID,
    CATEGORIES_BIN_ID: process.env.CATEGORIES_BIN_ID
  },
  async rewrites() {
    return [
      {
        source: '/api/jsonbin/:path*',
        destination: 'https://api.jsonbin.io/v3/:path*',
      }
    ];
  }
};

module.exports = nextConfig; 