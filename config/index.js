const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const configureWebpackPlugins = [];
const env = process.env.npm_lifecycle_event;

switch (env) {
case 'serve':
  break;
case 'build':
  configureWebpackPlugins.push(
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new TerserPlugin({
      terserOptions: {
        compress: {
          warnings: false,
          drop_console: false,
          drop_debugger: true,
          pure_funcs: []
        }
      }
    }),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })
  );
  break;
case 'analyzer':
  configureWebpackPlugins.push(
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new TerserPlugin({
      terserOptions: {
        compress: {
          warnings: false,
          drop_console: false,
          drop_debugger: true,
          pure_funcs: []
        }
      }
    }),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    }),
    new WebpackBundleAnalyzerPlugin()
  );
  break;
}

module.exports = {
  configureWebpack: {
    plugins: configureWebpackPlugins
  }
};
