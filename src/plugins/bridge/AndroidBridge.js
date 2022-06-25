import {
  NativeBridge
} from './NativeBridge';
import HybridMobile from './HybridMobile';
/**
 * 桥，负责对接
 */
export class AndroidBridge extends NativeBridge {
  /**
   * 与端内建立链接，成功后会派发onReady事件
   * 失败打印原因
   */
  init () {
    const self = this;
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function () {
        // 初始化成功
        self._e.dispatchEvent('onReady');
        window.WebViewJavascriptBridge.registerHandler('onAppMsg', self._nativeFnHandler.bind(self));
      },
      false
    );
  }
  /**
   * Android端内消息
   * @param {type:'',data:{}} data
   */
  _nativeFnHandler (data) {
    console.log('data from Android: = ' + data);

    // var responseData = 'Javascript Says Right back aka!';
    // responseCallback(responseData);
    try {
      data = JSON.parse(data);
      console.log('parse android data success', data);
      super.dispatchEvent(data.type, { ...data });
    } catch (error) {
      console.warn('parse android data error', error);
    }
  }

  _generateCallbackId () {
    return 'hybrid_android_' + Date.now();
  }
  /**
   * 向端内请求数据
   * @param {*} url
   * @param {function} callback
   * @returns resolve(<object>)
   */
  request (data, callback = () => {}) {
    // const callbackId = this._generateCallbackId();
    // this.callbacks.set(callbackId, callback);
    // TODO 不同端的请求实现
    window.WebViewJavascriptBridge.callHandler(
      'sendAppMsg',
      data,
      function (responseData) {
        try {
          console.log('收到Android响应数据', responseData);
          const res = JSON.parse(responseData);
          callback(res);
        } catch (error) {
          console.error('解析收到Android响应数据报错', responseData);
        }
      }
    );
    // window.webkit.messageHandlers.sendAppMsg.postMessage(data, callbackId);
  }

  /**
   * 获取鉴权数据
   */
  fetchAppData () {
    return new Promise((resolve, reject) => {
      HybridMobile.getOnlineUserInfo((userInfo) => {
        console.log('Android 获取用户数据', userInfo);
        const {
          header: {
            lgtk,
            os,
            did,
            client,
            version,
            channel,
            platform
          },
          user: {
            nick,
            grade,
            leid,
            subj
          }
        } = {
          ...JSON.parse(userInfo)
        };
        resolve({
          lgtk,
          os,
          client,
          did,
          version,
          nick,
          grade,
          leid,
          userId: Number(leid),
          subj,
          channel,
          platform
        });
      });
    });
  }
}
