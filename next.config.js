/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy API requests to Flask backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.FLASK_API_URL || 'http://localhost:5000/api/:path*',
      },
      {
        source: '/health',
        destination: process.env.FLASK_API_URL ? `${process.env.FLASK_API_URL}/health` : 'http://localhost:5000/health',
      },
    ];
  },
}

module.exports = nextConfig
