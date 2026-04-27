/** @type {import('next').NextConfig} */
const nextConfig = {
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
