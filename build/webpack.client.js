const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const ClientRenderPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(base, {
  entry: {
    client: resolve('../src/entry-client.js')
  },
  plugins: [
    new ClientRenderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('../public/index.html'),
    })
  ]
})