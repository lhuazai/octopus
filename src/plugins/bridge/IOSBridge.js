import {
  NativeBridge
} from './NativeBridge';
import HybridMobile from './HybridMobile';
/**
 * 桥，负责对接
 */
export class IOSBridge extends NativeBridge {
  /**
   * 与端内建立链接，成功后会派发onReady事件
   * 失败打印原因
   */
  init () {
    // TODO 初始化端内监听等
    window.onAppMsg = this._messageHandlers.bind(this);
    this.request = this.request.bind(this);
    // 初始化成功
    super.dispatchEvent('onReady');
  }

  /**
   * 端内消息
   * @param {data:{type:''},callbackId:''} msg
   */
  _messageHandlers (msg) {
    try {
      msg = JSON.parse(msg);
    } catch (error) {
      console.error('解析IOS消息失败', msg);
    }
    console.log('收到IOS消息' + JSON.stringify(msg));
    switch (msg.type) {
    case 'CALLBACK':
      super.handleCallback(msg.callbackId, msg.data);
      break;
    default:
      this._e.dispatchEvent(msg.type, { ...msg });
      break;
    }
  }
  _generateCallbackId () {
    return 'hybrid_ios_' + Date.now();
  }
  /**
   * 向端内请求数据
   * @param {*} url
   * @param {function} callback
   * @returns resolve(<object>)
   */
  request (data, callback = () => {}) {
    const callbackId = this._generateCallbackId();
    super.registerCallback(callbackId, callback);
    if (!data) {
      return;
    }
    // TODO 不同端的请求实现
    window.webkit.messageHandlers.sendAppMsg.postMessage({
      data: JSON.stringify(data),
      callbackId
    });
  }
  /**
   * 获取鉴权数据
   */
  async fetchAppData () {
    return new Promise((resolve, reject) => {
      HybridMobile.getOnlineUserInfo((userInfo) => {
        // alert(userInfo)
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
          did,
          os,
          client,
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
