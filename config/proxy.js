const target = 'http://xxxx.com'; //
const targetCms = 'https://xxxx.com'; // 

const proxys = [
  '/applogin',
];

// 统一处理代理格式
function formatProxy () {
  const proxysResult = {};
  proxys.forEach((key) => {
    proxysResult[key] = {
      target, // 目标接口域名
      changeOrigin: true, // 是否跨域
      onProxyReq: function (proxyReq, req) {
        console.info(`proxy 请求地址：${target}${req.originalUrl}`);
      }
    };
  });
  return proxysResult;
};

module.exports = {
  // 以下为特殊代理，不走zkapi地址的⬇
  '/cms-': {
    target: targetCms,
    changeOrigin: true // 是否跨域
  },
  '/fs': {
    target: 'http://xxxxx:10666',
    changeOrigin: true // 是否跨域
  },
  '/wechat-transfer': {
    target: 'http://xxxxx.com',
    changeOrigin: true // 是否跨域
  },
  ...formatProxy()
};
