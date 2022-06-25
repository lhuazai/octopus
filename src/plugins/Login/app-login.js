import events from '@/libs/events';
import { getUrlParams } from '@/libs/client';
// app 登陆
let isBack = false;
const SCHEME = {
  // 用户信息
  APP_DATA: 'data://appData',
  // 登录
  LOGIN: {
    SENIOR_TEACH: 'xxxxx://login'
  }
};

const requestAppData = () => {
  const oldIframe = document.getElementById('appdata-iframe');
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }
  const iframe = document.createElement('iframe');
  iframe.id = 'appdata-iframe';
  iframe.src = SCHEME.APP_DATA;
  iframe.style.cssText = 'position:absolute;top:-10px;border:0;width:1px;height:1px;';
  iframe.scrolling = 'no';
  document.body.appendChild(iframe);
  iframe.src = SCHEME.APP_DATA;
};


window.getAppData = (res = '{}') => {
  console.log(1, 'getAppData', res);
  const ifm = document.getElementsByTagName('iframe')[0];
  ifm && ifm.parentNode.removeChild(ifm);
  // 有用户信息
  try {
    if (res) {
      let data = {};
      // 过滤昵称中的特殊字符引起的JSON.parse错误
      const matchRe = /"nick":"([^'"]*)"/g;
      const replaceRe = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*\s（）——\-+={}|《》？：“”【】、；‘’，。、]/g;
      if (typeof res === 'string') {
        data = res.replace(matchRe, (match, capture) => {
          return `"nick":"${capture.replace(replaceRe, '')}"`;
        });
        data = JSON.parse(data);
      }
      const { lgtk: token, did, client, platform, version: appVersion } = data.header;
      const { leid: leId, grad, himg: portrait } = data.user;
      const { os, version } = getUrlParams();
      if (token) {
        import('@p/' + __project__ + '/store').then(store => {
          store.default.commit('userInfo/updateUserInfo', {
            leId,
            token,
            client,
            did,
            grad,
            portrait,
            os: platform,
            version: appVersion
          });
          if (os && version) {
            store.default.commit('userInfo/updateUserInfo', {
              os,
              version
            });
          }
          events.emit('getAppDataSuccess');
        });
      } else {
        import('@p/' + __project__ + '/store').then(store => {
          store.default.commit('userInfo/clearUserInfo', {});
        });
        events.emit('getAppDataFail');
      }
    } else {
      import('@p/' + __project__ + '/store').then(store => {
        store.default.commit('userInfo/clearUserInfo', {});
      });
      events.emit('getAppDataFail');
    }
  } catch (error) {
    import('@p/' + __project__ + '/store').then(store => {
      store.default.commit('userInfo/clearUserInfo', {});
    });
    events.emit('getAppDataFail');
  }
};
window.onBackWebView = (msg) => {
  isBack = true;
  setTimeout(() => {
    requestAppData();
  }, 1000);
};
export const appLogin = () => {
  isBack = false;
  let loginName = 'JUNIOR_TEACH';
  let { client, scheme } = getUrlParams() || {};
  if (scheme) {
    loginName = scheme.toUpperCase();
  } else if (client === 'gk' || client === 'SENIOR_TEACH') {
    loginName = 'SENIOR_TEACH';
  }
  return new Promise((resolve, reject) => {
    // 先注册函数监听
    events.on('getAppDataSuccess', () => {
      resolve('success');
    });
    events.on('getAppDataFail', () => {
      if (!isBack) {
        window.location.href = SCHEME.LOGIN[loginName];
      }
    });
    // 最后请求登录信息
    requestAppData();
  });
};
