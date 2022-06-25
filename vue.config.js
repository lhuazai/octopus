const path = require('path');
const merge = require('webpack-merge');
const proxyTable = require('./config/proxy');

const resolve = dir => {
  return path.join(__dirname, dir);
};
const baseConfig = require('./config/index');
// yarn serve --p aaa
const project = process.argv[process.argv.length - 1];
if (process.argv[process.argv.length - 2] !== '--p') {
  console.error('命令错误');
  console.error('启动 yarn serve --p 【项目名】');
  console.error('编译 yarn build --p 【项目名】');
  console.error('编译 yarn analyzer --p 【项目名】');
  return;
}
module.exports = merge(baseConfig, {
  publicPath: `/${project}`,
  pages: {
    index: {
      // 入口文件
      entry: `projects/${project}/main.js`, /* 这个是根入口文件 */
      // 模板文件
      template: `projects/${project}/index.html`,
      // 输出文件
      filename: 'index.html',
      // 页面title
      title: 'Index Page'
    }
    // subpage: `projects/${project}/main.js` /*注意这个是*/
  },
  outputDir: `dist/${project}`,
  // lintOnSave: 'error',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  // configureWebpack: {
  //   // devtool: process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-eval-source-map'
  //   devtool: process.env.NODE_ENV === 'production' ? undefined : 'source-map'
  // },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'eval-source-map';
      config.output.devtoolModuleFilenameTemplate = info => info.resourcePath.match(/^\.\/\S*?\.vue$/)
        ? `webpack-generated:///${info.resourcePath}?${info.hash}`
        : `webpack-yourCode:///${info.resourcePath}`;

      config.output.devtoolFallbackModuleFilenameTemplate = 'webpack:///[resource-path]?[hash]';
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@p', resolve('projects'))
      .set('@', resolve('src')); // key,value自行定义，比如.set('@@', resolve('src/components'))
    config
      .plugin('define')
      .tap(args => {
        // console.log(args); // [ { 'process.env': { NODE_ENV: '"development"', BASE_URL: '"/"' } } ]
        args[0].__project__ = `"${project}"`;
        // console.log(args)
        return args;
      });
    config.module
      .rule('atom')
      .test(/\.vue$/)
      .use('loaders/atom-loader.js')
      .loader(resolve('loaders/atom-loader.js'))
      .end();
  },
  devServer: {
    // 防止出现 Invalid Host header 参考 https://blog.csdn.net/Cookysurongbin/article/details/86077241
    disableHostCheck: true,
    // port: 9090,
    host: '0.0.0.0',
    port: 80,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: proxyTable
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: process.env.NODE_ENV !== 'production'
});
