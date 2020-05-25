const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  entry: {
    'client': path.resolve(__dirname, '../src//entry-client.js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html'
    })
  ]
})