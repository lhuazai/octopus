import Vue from 'vue';
import LoginComponent from '../components/login.vue';

import events from '@/libs/events';
import { isInApp, isWeixin } from '@/libs/client';

import { appLogin } from './app-login';
import { wxLogin } from './wx-login';

const LoginPlugins = {};
// let { client, state } = getUrlParams();
// client = client || state || 'SENIOR_TEACH';
LoginPlugins.install = (Vue, option) => {
  class Login {
    /**
     * @param title 登录标题
     * @param btnText 登录按钮文案
     * @param isComesBackData 点登录时不走登录流程、仅回传手机号和验证码(和当前环境没有任何关联)
     * @param fullScreen 登录组件是否全屏状态展示
     * @param themeType 登录主题颜色;zk: 绿；gk:蓝
     * @param isNeedPhone 是否需要绑定手机号
     * @param reLogin 每次强制重新走登录流程
     * @param isAuthorization 在微信中或QQ中是否走静默授权登录流程（false：手机号登录流程）
     * @param registerChannel 注册渠道（默认是url中的channel字段）
    */
    init ({
      title = '登录',
      btnText = '登录',
      isComesBackData = false,
      fullScreen = false,
      themeType = '',
      isNeedPhone = true,
      reLogin = false,
      isAuthorization = true,
      registerChannel = null
    }) {
      // 初始化登录组件
      const LoginConstructor = Vue.extend(LoginComponent);
      const $vm = new LoginConstructor();
      // 登录组件初始化传值
      $vm.title = title;
      $vm.btnText = btnText;
      $vm.fullScreen = fullScreen;
      $vm.themeType = themeType;
      $vm.isComesBackData = isComesBackData;
      $vm.isAuthorization = isAuthorization;
      $vm.registerChannel = registerChannel;
      // 挂载组件
      $vm.$mount();
      if (!document.getElementById('Login')) {
        document.body.appendChild($vm.$el);
      }
      if (!isInApp()) {
        return new Promise((resolve, reject) => {
          events.on('loginCancel', () => {
            return reject('close');
          });
          events.on('loginSuccess', (data) => {
            return resolve(data || 'success');
          });
          import('@p/' + __project__ + '/store').then(async store => {
            const localUserInfo = store.default.state.userInfo;
            store.default.commit('userInfo/updateUserInfo', {
              os: 'wap',
              client: 'h5' // 非app内 已经登录过 强制设置client：h5
            });
            if (localUserInfo.token && !reLogin) {
              return resolve('success');
            }
            if (isWeixin() && isAuthorization) {
              // 微信登陆逻辑
              $vm.$store = store.default;
              wxLogin($vm);
            } else {
              // 普通浏览器登陆逻辑
              $vm.$store = store.default;
              $vm.show = true;
            }
          });
        });
      } else {
        return appLogin();
      }
    }
    show (options = { showCloseBtn: true }) {
      $vm.show = true;
      $vm.showCloseBtn = options.showCloseBtn;
      document.body.style.overflow = 'hidden';
      return new Promise((resolve, reject) => {
        events.on('loginCancel', () => {
          return reject(new Error('close'));
        });
        events.on('loginSuccess', () => {
          return resolve('success');
        });
      });
    }
    hide () {
      $vm.show = false;
      document.body.style.overflow = 'auto';
    }
  }
  Vue.prototype.$login = new Login();
};

Vue.use(LoginPlugins);
