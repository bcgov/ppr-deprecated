
// For local development set the APP_PATH environment variable to '/'
// or use  'npm run serve'  (package.json)
const APP_PATH = process.env.APP_PATH || '/cooperatives/ppr'
console.log('Start Vue build (vue.config.js) with APP_PATH', APP_PATH)

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
        // automaticNameDelimiter added to workaround problem with WAM
        // see https://github.com/bcgov/ppr/issues/270
        automaticNameDelimiter: "-"
      }
    }
  },
  publicPath: APP_PATH
}
