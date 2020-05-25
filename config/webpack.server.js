const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base');

module.exports = merge(base, {
  target: 'node',
  entry: {
    'server': path.resolve(__dirname, '../src/entry-server.js')
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.ssr.html',
      excludeChunks: ['server']
    })
  ]
})