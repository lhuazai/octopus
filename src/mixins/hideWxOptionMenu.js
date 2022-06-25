// 隐藏微信场景中分享菜单中分享按钮
import { isWeixin } from '@/libs/client';
export default {
  created () {
    this.hideWxOptionMenu();
  },
  methods: {
    onBridgeReady () {
      WeixinJSBridge.call('hideOptionMenu');
    },
    hideWxOptionMenu () {
      if (!isWeixin()) return;
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
      } else {
        this.onBridgeReady();
      }
    }
  }
};
