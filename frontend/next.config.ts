import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const API_BACKEND = process.env.BACKEND_URL || 'http://localhost:3000';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.2.6',
    '10.22.10.34',
    'localhost',
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BACKEND}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${API_BACKEND}/uploads/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
