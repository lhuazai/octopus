import { isWeixin } from '@/libs/client';
import api from '@/api';
import wx from 'weixin-js-sdk';
// 隐藏微信复制链接按钮
export default {
  created () {
    this.hideWxOptionMenu();
  },
  methods: {
    hideCopyUrl () {
      if (!isWeixin()) return;
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
              'hideMenuItems',
              'hideOptionMenu'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(() => {
            wx.hideOptionMenu();
            wx.hideMenuItems({
              menuList: ['menuItem:copyUrl'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
          });
        }
      });
    }
  }
};
