/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? '/{queens-game}' : '',
  basePath: isProd ? '/{queens-game}' : '',
}

module.exports = nextConfig




