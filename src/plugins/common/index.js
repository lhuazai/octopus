import directive from './directive';
import filter from './filter';
import globalData from './global';
import mixins from './mixins';

export default {
  install (Vue, options) {
    // 注册自定义指令
    for (let d in directive) {
      Vue.directive(d, directive[d]);
    }
    // 注册混入配置
    Vue.mixin(mixins);
    // 注册过滤器
    for (let f in filter) {
      Vue.filter(f, filter[f]);
    }
    // 全局为实例挂载一些方法或属性
    for (let g in globalData) {
      Vue.prototype[g] = globalData[g];
    }
  },
  // 微信中禁用分享功能方法
  disableShareHandle () {
    var vm = this;
    if (typeof window.WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(), false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady());
        document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady());
      }
    } else {
      vm.onBridgeReady();
    }
  },
  onBridgeReady () {
    // 这个方法隐藏分享按钮
    window.WeixinJSBridge && window.WeixinJSBridge.call('hideOptionMenu');
  }
};
