import requestHybrid from './hybridCore';

export default {
  goLogin () {
    requestHybrid({
      tagname: 'login'
    });
  },
  getOnlineUserInfo (callback) {
    // 获取登陆用户的token等信息
    // common 协议
    requestHybrid({
      scheme: 'data://',
      tagname: 'appData',
      callback: callback
    });
  },
  closeView () {
    // webaction://xxxx?action=close
    requestHybrid({
      scheme: 'webaction://',
      tagname: 'xxxx',
      params: {
        action: 'close'
      }
    });
  },
  openURL (url, query) {
    let newUrl = `${location.origin}${location.pathname}#${url}`;
    requestHybrid({
      scheme: 'offline://',
      tagname: 'xxxx',
      params: {
        url: encodeURIComponent(newUrl)
      }
    });
  }
};
