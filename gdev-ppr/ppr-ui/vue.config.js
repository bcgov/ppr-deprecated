module.exports = {
  lintOnSave: false,
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 100000,
        maxSize: 2500000
      }
    }
  }
}
