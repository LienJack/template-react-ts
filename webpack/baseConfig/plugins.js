const webpack = require('webpack')
const os = require('os')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin") 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin =require("add-asset-html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length}); // 指定线程池个数
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ENV = require('../../config/env.js')
const { resolvePath, getEnv } = require('../common/utils')
const { DllConfig, isDll, isShowProgress, isCache } = require('../../config/index')
const plugins = [
  // 清除之前打包的
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*'],
  }),
  new CopyWebpackPlugin(
    [
      { from: resolvePath('src/static'), to: resolvePath('dist/static')}
    ]
  ),
     // 注入环境变量
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(ENV[getEnv()])
  }),
  // 进度条
  isShowProgress ?  new webpack.ProgressPlugin() :  new ProgressBarPlugin(),
  new FriendlyErrorsWebpackPlugin(),
  new HappyPack({
    id: 'js',
    loaders: isCache ? ['cache-loader', 'babel-loader?cacheDirectory'] : ['babel-loader'],
    threadPool: happyThreadPool,
    verbose: true,
  }),
  new HappyPack({
    id: 'ts',
    loaders: isCache ? ['cache-loader', 'babel-loader?cacheDirectory'] : ['babel-loader'],
    threadPool: happyThreadPool,
    verbose: true,
  }),
  // css抽离
  new MiniCssExtractPlugin({
    filename: `css/[name].css?[hash]`,
  }),
  new HtmlWebpackPlugin({
    template: resolvePath('src/index.html'),
    filename: 'index.html',
    minify: { // 优化
      removeAttributeQuotes: true, // 删除双引号
      collapseWhitespace: true, // 变成一行
      html5: true,
      preserveLineBreaks:false,
      minifyCSS:true,
      minifyJS:true,
      removeComments:false
    },
  }),
]

const getDllReferenceArr = () => {
  let arr = []
  Object.keys(DllConfig).forEach(name => {
    let plugin = new webpack.DllReferencePlugin({
      manifest: resolvePath(`dll/${name}.manifest.json`),
      name: name,
      sourceType: "var"
    })
    arr.push(plugin)
  })
  return arr
}

if (isDll) {
  plugins.push(...getDllReferenceArr())
  plugins.push(
    new AddAssetHtmlPlugin({
      filepath: resolvePath('dll/*.dll.js'), // 需要添加的第三方文件夹
      hash: true,
      typeOfAsset: "js",
      outputPath:'./dll',
      publicPath: './dll'
    }),
  )
}
module.exports = plugins