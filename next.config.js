/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/queens-game' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/queens-game/' : '',
}

module.exports = nextConfig