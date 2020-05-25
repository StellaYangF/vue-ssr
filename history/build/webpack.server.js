const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const ServerRenderPlugin = require('vue-server-renderer/server-plugin');

module.exports = merge(base, {
  entry: {
    server: resolve('../src/entry-server.js'),
  },
  target: "node",
  output: {
    libraryTarget: "commonjs2",
  },
  plugins: [
    new ServerRenderPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.ssr.html",
      template: resolve('../public/index.ssr.html'),
      excludeChunks: ['server'],
    })
  ]
})