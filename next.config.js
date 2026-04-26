/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/vote',
        destination: '/pt-BR/picture-contest/voting',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
