import { isWeixin, objToQuery, queryToObj } from '@/libs/client';
import api from '@/api';
import wx from 'weixin-js-sdk';
// 设置微信网页中分享参数
export default {
  methods: {
    /**
     * @param title 分享标题
     * @param imgUrl 分享图标
     * @param desc 分享描述
    */
    setWxShareParams (shareParams) {
      if (!isWeixin()) return;
      // history.replaceState兼容性问题的兜底处理方案
      const { origin, pathname, search } = window.location;
      const validSearch = queryToObj(search);
      delete validSearch.code;
      delete validSearch.state;
      const {
        title,
        imgUrl = 'https://xxxxx.com/gkcms/64d6329084e46159c85ec2e753064ef6',
        desc,
        link = origin + pathname + '?' + objToQuery(validSearch)
      } = shareParams;
      if (!title) console.warn('缺少微信分享必要参数：title');
      if (!desc) console.warn('缺少微信分享必要参数：desc');
      const shareOption = {
        title,
        imgUrl,
        desc,
        link
      };
      api.getWxShareTokenNew({
        sign_url: encodeURI(location.href)
      }).then(res => {
        const { code, data } = res;
        if (code === 0 && wx) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.signTimestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareQZone',
              'onMenuShareWeibo',
              'updateTimelineShareData',
              'updateAppMessageShareData'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(() => {
            this.showWxOptionMenu();
            wx.onMenuShareTimeline(shareOption);
            wx.onMenuShareAppMessage(shareOption);
            wx.onMenuShareQQ(shareOption);
            wx.onMenuShareQZone(shareOption);
            wx.onMenuShareWeibo(shareOption);
            wx.updateAppMessageShareData(shareOption);
            wx.updateTimelineShareData(shareOption);
          });
        }
      });
    },
    onBridgeReady () {
      WeixinJSBridge.call('showOptionMenu');
    },
    showWxOptionMenu () {
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
