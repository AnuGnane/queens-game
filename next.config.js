module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/{queens-game}' : '',
  basePath: isProd ? '/{queens-game}' : '',
}
