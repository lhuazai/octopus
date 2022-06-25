import apis from '@/api';
import { getUrlParams } from '@/libs/client';
import { deleteParamsByKey } from '@/libs/utils';
import events from '@/libs/events';
import Cookies from 'js-cookie';
export const wxLogin = ($vm, isBindMobile = true) => {
  let { code } = getUrlParams();
  return new Promise((resolve, reject) => {
    import('@p/' + __project__ + '/store').then(store => {
      store.default.commit('userInfo/clearUserInfo', {});
      store.default.commit('userInfo/updateUserInfo', { client: 'h5' });
      sessionStorage.setItem('client', 'h5');
      if (code) {
        wxBindLogin();
      } else {
        getCode();
      }
      function getCode () {
        apis.getWxAppID({}).then(res => {
          const {
            origin,
            pathname,
            search
          } = location;
          // 已授权采用静默方式
          if (res.rpco) {
            const SCOPE = 'snsapi_userinfo'; // snsapi_userinfo 用户确认形式|| snsapi_base 静默形式；
            const codeIndex = search.indexOf('&code');
            let searchStr = search.substring(0, codeIndex >= 0 ? codeIndex : search.length);
            let href = origin + pathname + searchStr;
            let REDIRECT_URI = encodeURIComponent(href);
            console.log('href', REDIRECT_URI);
            // setStorage('appId', res);
            store.default.commit('userInfo/updateUserInfo', { wxAppID: res.rpbd });
            const params = [`appid=${res.rpbd}`, `redirect_uri=${REDIRECT_URI}`, 'response_type=code', `scope=${SCOPE}`, 'state=STATE#wechat_redirect'];
            // 跳转到微信获取code
            // debugger;
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?${params.join('&')}`;
          }
        }).catch((res) => {
          console.error(res);
        });
      }
      function wxBindLogin () {
        apis.checkWxBind({
          code,
          isBindMobile
        }).then(res => {
          if (res.rpco === 200) {
            const { leid: leId, nick: nickName, grad, himg: portrait, isFirstTimeLogin, thirdAccount: openId } = res.rpbd;
            const { lgtk: token } = res;
            store.default.commit('userInfo/updateUserInfo', {
              leId,
              token,
              nickName,
              grad,
              portrait,
              isBindWx: true,
              isBandPhone: true,
              loginType: 'wx',
              isFirstTimeLogin,
              openId
            });
            // 兼容引流课
            localStorage.setItem('userInfo', JSON.stringify(res.rpbd));
            localStorage.setItem('lgtk', token);
            // 旧引流课支付需要openId
            Cookies.set('openId', openId, { expires: 28 });
            sessionStorage.setItem('openId', openId);
            // 登录成功回调
            events.emit('loginSuccess');
          } else if (res.rpco === 1302) {
            // 没有绑定手机号，会返回错误码和加密字符串
            const { opentk } = res.rpbd;
            window.localStorage.setItem('opentk', opentk);
            store.default.commit('userInfo/updateUserInfo', {
              isBindWx: false,
              isBandPhone: false
            });
            $vm.show = true;
          }
        });
        // 删除微信code, 防止刷新页面授权失败
        deleteParamsByKey(['code', 'state']);
      }
    });
  });
};
