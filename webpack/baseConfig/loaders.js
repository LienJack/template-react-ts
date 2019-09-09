const { resolvePath, getEnv } = require('../common/utils')
const MiniCssExtractPlugin = require("mini-css-extract-plugin") 
const { isProduction } = require('../common/const')
function styleLoaders (lang) {
  const loaders = [
    {
      loader: 'css-loader',
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: resolvePath('postcss.config.js')
        }
      }
    }
  ]
  if (lang === 'scss') {
    loaders.push({
      loader: 'sass-loader',
      options: {
        indentedSyntax: false,
      }
    })
  }
  if (lang === 'less') {
    loaders.push({
      loader: 'less-loader',
    })
  }
  if (isProduction) {
    loaders.unshift(MiniCssExtractPlugin.loader)
    return loaders
  } else {
    loaders.unshift({ loader: 'style-loader'})
    return loaders
  }
}

const baseRules = [
  {
    test: /\.(ts|tsx)?$/,
    // use: 'happypack/loader?id=ts',
    use: 'ts-loader',
    exclude: /node_modules/,
    include:[resolvePath('src')],
  },
  { 
    test: /\.(js|jsx)?$/,
    use: 'happypack/loader?id=js',
    exclude: /node_modules/,
    include:[resolvePath('src')]
  },
  { test: /\.css$/, use: styleLoaders() },
  { test: /\.scss$/, use: styleLoaders('scss') },
  { test: /\.less$/, use: styleLoaders('less') },
  { 
    test: /\.svg$/,
    loader: '@svgr/webpack',
    include:[resolvePath('src')],
  },
  {
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    include: resolvePath('src'),
    use: [
        {
            loader: 'url-loader',
            options: { 
              limit: 20240,
              name: 'images/[name]-[hash:5].[ext]',
            },
        },
    ],
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'media/[name]-[hash:5].min.[ext]',
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'font/[name]-[hash:5].[ext]',
    }
  }
]

module.exports = baseRules