import {
  NativeBridge
} from './NativeBridge';

/**
 * 桥，负责对接
 */
export class WebStudentBridge extends NativeBridge {
  /**
   * 与端内建立链接，成功后会派发onReady事件
   * 失败打印原因
   */
  init () {
    // TODO 初始化端内监听等
    window.viewInteractMsg = this._viewInteractMsg;
    // 初始化成功
    this._e.dispatchEvent('onReady');
  }
  /**
   * 获取鉴权数据
   */
  fetchAppData () {

  }
  /**
   * 端内消息
   * @param {type:'',data:{},} msg
   */
  _viewInteractMsg (msg) {
    switch (msg.type) {
    case 'CALLBACK':
      super.handleCallback(msg.callbackId);
      break;
    default:
      super.dispatchEvent(msg.type, { ...msg });
      break;
    }
  }

  registerAppContainer (containerRef) {
    this.AppContainer = containerRef;
  }

  /**
   * 向端内请求数据
   * @param {*} url
   * @param {function} callback
   */
  request (data, callback = () => {}) {

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
