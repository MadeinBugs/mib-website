/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/terms',
        destination: '/pt-BR/terms',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/pt-BR/privacy',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
