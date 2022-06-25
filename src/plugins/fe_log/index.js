// 可根据项目具体情况进行扩展
const FE_LOG = {
  install: function (Vue, options) {
    // ...
    Vue.prototype.FE_LOG_INIT = this.init;
    Vue.prototype.FE_LOG = this.blink;
  },
  blink: (action, msg) => {
    // SDK 若有错误，进行捕获不影响正常代码执行
    try {
      SDK?.blink && SDK.blink(__project__, '', action, msg);
    } catch (error) {}
  },
  init: (userId, leId) => {
    // SDK 若有错误，进行捕获不影响正常代码执行
    try {
      SDK?.init && SDK.init({
        userId,
        leId
      });
    } catch (error) {}
  }
};

module.exports = {
  FE_LOG,
  blink: FE_LOG.blink
};
