/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/queens-game' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/queens-game/' : '',
}

module.exports = nextConfig