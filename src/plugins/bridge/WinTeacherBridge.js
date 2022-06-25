import {
  NativeBridge
} from './NativeBridge';

import { getHrefParma } from '@/libs/client';
/**
 * 桥，负责对接
 */
export class WinTeacherBridge extends NativeBridge {
  /**
   * 与端内建立链接，成功后会派发onReady事件
   * 失败打印原因
   */
  init () {
    // TODO 初始化端内监听等
    window.viewInteractMsg = this._viewInteractMsg.bind(this);
    // 初始化成功
    super.dispatchEvent('onReady');
  }

  /**
   * 获取鉴权数据
   */
  fetchAppData () {
    const appData = getHrefParma();
    appData.lgtk = appData.token;
    console.log('老师端鉴权数据', appData);
    return Promise.resolve(appData);
  }
  /**
   * 老师端内消息
   * @param {type:'',data:{}} msg
   */
  _viewInteractMsg (msg) {
    console.log('收到老师端msg', msg);
    switch (msg.type) {
    case 'CALLBACK':
      super.handleCallback(msg.callbackId, msg);
      break;
    default:
      // console.log('开始派发老师端数据', msg);
      super.dispatchEvent(msg.type, msg);
      break;
    }
  }

  _generateCallbackId () {
    return 'hybrid_win_' + Date.now();
  }

  /**
   * 向端内请求数据
   * @param {*} url
   * @param {function} callback
   */
  request (data, callbackFn = () => {}) {
    // sendMessageToCef({ apiName: 'GAME.BROADCAST', params: [JSON.stringify(data)] }).then(resData => {
    //   const [code, res] = resData;
    //   callbackFn({ success: code, reason: JSON.stringify(res) });
    // });
    const callbackId = this._generateCallbackId();
    super.registerCallback(callbackId, callbackFn);
    if (!data) {
      return;
    }
    const { type } = data;
    console.log('请求老师Native', {
      data,
      type,
      callbackId
    });
    // console.log('window.bridge.onMsg', window.bridge.onMsg);
    window.bridge.onMsg(JSON.stringify({
      data,
      type,
      callbackId
    }));
  }

  /**
   * 发送消息到端内，无需回执
   * @param {*} json
   */
  sendMessageToNative (json) {
    if (!empty(window.bridge)) {
      window.bridge.onMsg(JSON.stringify(json));
    } else {
      console.error(`发送消息到qt失败: 未找到 window.bridge`);
    }
  }
}
