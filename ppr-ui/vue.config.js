
// For local development set the APP_PATH environment variable to '/'
// or use  'npm run serve'  (package.json)
const APP_PATH = process.env.APP_PATH || '/cooperatives/ppr'
console.info('Start Vue build (vue.config.js) with APP_PATH', APP_PATH)

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 100000,
        maxSize: 2500000,
      }
    }
  },
  publicPath: APP_PATH
}
