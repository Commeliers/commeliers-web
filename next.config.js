/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://210.109.82.7:30770/:path*', // 프록시 대상
      },
    ];
  },
};

module.exports = nextConfig;
