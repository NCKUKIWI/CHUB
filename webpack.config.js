var path = require('path')
var webpack = require('webpack')
var utils = require('./build/utils')
var vueLoaderConfig = require('./build/vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// import './src/client/assets/css/semantic.css'

function resolve (dir) {
  return path.join(__dirname, dir, 'client')
}

module.exports = {
  entry: path.join(__dirname, 'src/client/main.js'),
  output: {
    path: path.join(__dirname, 'src/client/assets/js/'),
    publicPath: '/js/',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
      // }
    ]
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new ExtractTextPlugin({ filename: 'css/[name].css', disable: false, allChunks: true })
  ]
}
