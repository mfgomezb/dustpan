/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn3.emoji.gg',
        port: '',
        pathname: '/emojis/*',
      },
    ],
  },
};

module.exports = nextConfig;
