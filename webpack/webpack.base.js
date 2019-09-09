const { resolvePath, getEnv } = require('./common/utils')
const baseConfigPlugins = require('./baseConfig/plugins')
const baseConfigLoaders = require('./baseConfig/loaders')
const baseConfig = {
  entry: {
    app: ['@babel/polyfill', 'react-hot-loader/patch', resolvePath('src/index.js')] // 入口
  },
  output: {
    // path: resolve('dist'), // 出口路径
    filename: '[name].[hash:10].js', // 输出文件名
    chunkFilename: "[id].[hash:10].js", // 公共代码
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // 扩展名
    alias: {
      '@': resolvePath('src'),
      'assets': resolvePath('src/assets'),
      'utils': resolvePath('src/utils'),
      'views': resolvePath('src/views')
    },
    modules: [resolvePath('node_modules')]
  },
  plugins: [...baseConfigPlugins],
  module: {
    rules: [...baseConfigLoaders]
  },
}

module.exports = baseConfig
