import Vue from 'vue';
import api from '@/api';
const wechat = require('weixin-js-sdk');

Vue.prototype.$wechat = wechat;

const jsApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareQZone',
  'onMenuShareWeibo'
];

const wechatShare = {
  install (Vue) {
    Vue.prototype.$wxShare = function (shareData) {
      return new Promise((resolve, reject) => {
        api.getWxParams({
          surl: encodeURI(window.location.href)
        }).then(res => {
          const data = res;
          this.$wechat.config({
            debug: false,
            appId: data.apid,
            timestamp: data.tssg,
            nonceStr: data.nstr,
            signature: data.sign,
            jsApiList: jsApiList
          });
        });
        this.$wechat.ready(() => {
          // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
          const shareOption = {
            title: shareData.title,
            desc: shareData.desc,
            link: shareData.link,
            imgUrl: shareData.imgUrl,
            success: function () {
              resolve();
            },
            cancel: function () {
              reject(new Error('分享取消'));
            }
          };
          // 分享监听
          this.$wechat.onMenuShareTimeline(shareOption);
          this.$wechat.onMenuShareAppMessage(shareOption);
          this.$wechat.onMenuShareQQ(shareOption);
          this.$wechat.onMenuShareQZone(shareOption);
          this.$wechat.onMenuShareWeibo(shareOption);
        });
      });
    };
  }
};

Vue.use(wechatShare);
