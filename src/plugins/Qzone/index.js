import api from '@/api';
import init from './share';

const share = {
  install (Vue) {
    Vue.prototype.$shareH5 = function ({ title, summary, pic, url }) {
      const ua = navigator.userAgent;
      const isWX = ua.match(/MicroMessenger\/([\d.]+)/);
      return new Promise((resolve, reject) => {
        if (isWX) {
          api.getWxParams({
            surl: encodeURI(window.location.href)
          }).then(res => {
            const { apid, tssg, nstr, sign } = res.body;
            init({
              title, // 分享标题
              summary, // 分享内容
              pic, // 分享图片
              url, // 分享链接
              callback (res) {
                return resolve(res);
              },
              WXconfig: {
                swapTitleInWX: true, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
                appId: apid, // 公众号的唯一标识
                timestamp: tssg, // 生成签名的时间戳
                nonceStr: nstr, // 生成签名的随机串
                signature: sign // 签名
              }
            });
          });
        } else {
          init({
            title, // 分享标题
            summary, // 分享内容
            pic, // 分享图片
            url, // 分享链接
            callback (res) {
              return resolve(res);
            }
          });
        }
      });
    };
  }
};

export default share;
