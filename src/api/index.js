import http from '@/http';
const apiList = {
  wxLogin: '/applogin/wx/v1/login', // 微信登录
  wxBindLogin: '/applogin/wx/v2/user/bind/mobile', // 新用户绑定手机号登录
  getWxAppID: '/applogin/wx/v1/app_id', // 获取微信公众号APP_ID
  getWxInfo: '/applogin/wx/v1/user_info', // 获取微信OpenID
  getOpenId: '/applogin/appwx/v1/getopenid', // 获取 openid
};
let api = {
  getWxInfo (query, showLoading = false) {
    return http({
      url: apiList.getWxInfo,
      method: 'get',
      query,
      ext: { loading: showLoading }
    });
  },
  getWxAppID (query, showLoading = false) {
    return http({
      url: apiList.getWxAppID,
      method: 'get',
      query,
      ext: { loading: showLoading }
    });
  },
  getOpenId (query, showLoading = false) {
    return http({
      url: apiList.getOpenId,
      method: 'post',
      query,
      ext: { loading: showLoading }
    });
  },
  wxLogin (query, showLoading = false) {
    return http({
      url: apiList.wxLogin,
      method: 'post',
      query,
      ext: { loading: showLoading }
    });
  },
  wxBindLogin (query, showLoading = false) {
    return http({
      url: apiList.wxBindLogin,
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      query,
      ext: { loading: showLoading }
    });
  },
};

export default api;
