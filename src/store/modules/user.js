import Cookies from 'js-cookie';
// userInfo 中的字段需要预定义 其他地方 通过 updateUserInfo 方法 增加的字段有可能不会被代理
const userInfo = {
  accreditInfo: {},
  client: 'h5', // 登陆中高考
  token: '', // 登陆token
  wxAppID: '',
  isBindWx: false, // 是否绑定微信 微信登陆必须
  openId: '', // 微信登陆 openId
  isBindQQ: false, // 是否绑定QQ
  isBandPhone: false, // 是否绑定了手机号
  phone: '',
  portrait: '', // 头像
  userId: '', // 用户id
  nickName: '', // 昵称
  grad: '', // 年级,
  os: 'wap',
  did: '123456789012345',
  channel: 'h5',
  version: '4.0.0'
};
const state = () => {
  return userInfo;
};

const mutations = {
  updateUserInfo (state, options) {
    Object.assign(state, options);
    options.token && localStorage.setItem('lgtk', options.token);
    // 微信中切换账号会清空cookie,可作为登录状态下是否切换账号的依据
    options.token && Cookies.set('lgtk', options.token, { expires: 28 });
  },
  clearUserInfo (state, options) {
    Object.assign(state, userInfo);
    localStorage.removeItem('lgtk');
    localStorage.removeItem('userInfo');
    Cookies.remove('lgtk');
  }
};

const getters = {

};

const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
