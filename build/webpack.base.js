const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  output: {
    filename: '[name].bundle.js',
    path: resolve('../dist'),
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        },
      },
      exclude: /node_modules/,
    }, {
      test: /\.vue$/,
      use: 'vue-loader',
    }, {
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader'],
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}