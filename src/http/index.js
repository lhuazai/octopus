import axios from 'axios';
import pathToRegExp from 'path-to-regexp';
import { getUrlParams, getGrade } from '@/libs/client';
import { objToString } from '@/libs/utils';
import { Toast } from 'vant';
import { getSignature, appKey } from './httpSignature';

const $axios = axios.create({});
$axios.interceptors.request.use(function (config) {
  config.headers.appKey = appKey;
  config.headers.signature = getSignature(config);
  return config;
}, function (error) {
  return Promise.reject(error);
});

const http = async (options) => {
  /**
   * 处理options start
  */
  if (options.path) {
    try {
      let toPath = pathToRegExp.compile(options.url);
      options.url = toPath(options.path);
    } catch (e) {
      console.error(e);
      return;
    }
  }
  options = Object.assign({}, {
    method: 'post',
    url: '',
    query: {},
    headers: {},
    timeout: 10000,
    withCredentials: true,
    ext: {}
  }, options);
  options.query.ct = Date.now();
  const methods = options.method.toLowerCase();
  const ext = { loading: true, showMsg: true, ...options.ext };
  methods === 'get' ? options.params = options.query : options.data = options.query;
  delete options.query;
  delete options.ext;
  /**
   * 处理options end
  */
  /**
   * 填充header信息 start
   */
  const urlParams = getUrlParams() || {};
  const remoteChannel = urlParams.channel || 'h5';
  // 前端client只能是h5，channel取参数channel或‘h5’
  // const remoteClient = urlParams.client || 'h5';
  return import('@p/' + __project__ + '/store').then(store => {
    let storeUserInfo = store.default.state.userInfo || {};
    // if (!!remoteChannel && !storeUserInfo.channel) {
    store.default.commit('userInfo/updateUserInfo', { channel: remoteChannel });
    storeUserInfo = store.default.state.userInfo;
    // }
    const { client, token = '', os, version, channel, did, leId, grad } = storeUserInfo;
    const grade = getGrade(grad);
    const appInfo = {
      client,
      version,
      channel,
      platform: os,
      business: options.business
    };
    const deviceInfo = {
      did,
      os: window.navigator.platform
    };
    const userInfo = {
      grade: grade || '',
      leId
    };
    const headers = Object.assign({
      appInfo: objToString(appInfo),
      deviceInfo: objToString(deviceInfo),
      token
    }, options.headers);
    if (token && objToString(userInfo)) {
      headers.userInfo = objToString(userInfo);
    }
    /**
     * 填充header信息 end
     */
    options.headers = headers;
    // vant中Toast采用单例模式，为避免多个请求同时发出Toast无法关闭问题，在下次请求开始前清除上次Toast
    Toast.clear();
    let loadingTimeout = null;
    if (ext.loading) {
      // 优化500ms内响应的接口，不用展示loading
      loadingTimeout = setTimeout(() => {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        });
      }, 500);
    }
    return new Promise((resolve, reject) => {
      $axios(options).then(res => {
        loadingTimeout && clearTimeout(loadingTimeout);
        Toast.clear();
        let response = res.data || res.rpbd;
        const code = response && (response.rpco || response.rpco || response.code);
        if (code === 0 || code === 200) {
          resolve(response);
        } else if ([40103, 40102, 42001, 401].includes(code)) {
          // 40103: 登录信息超时
          // 42001: access_token问题增加的返回错误码，重新拉微信授权
          if (ext.showMsg) {
            Toast({ message: '登录错误，请重新进入页面' });
          }
          store.default.commit('userInfo/clearUserInfo', {});
          resolve(response);
        } else {
          if (ext.showMsg) {
            Toast({ message: response.msg || response.message || '网络不佳,请重新打开' });
          }
          resolve(response);
        }
      }).catch((err) => {
        loadingTimeout && clearTimeout(loadingTimeout);
        Toast.clear();
        if (ext.showMsg) {
          Toast({ message: '网络不佳,请重新打开' });
        }
        resolve({ code: -1, rpco: -1, message: String(err), msg: String(err) });
      });
    }).catch((err) => {
      loadingTimeout && clearTimeout(loadingTimeout);
      Toast.clear();
      if (ext.showMsg) {
        Toast({ message: '网络不佳,请重新打开' });
      }
      resolve({ code: -1, rpco: -1, message: String(err), msg: String(err) });
    });
  });
};
export default http;
