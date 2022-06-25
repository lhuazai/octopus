import {
  EventDispatcher
} from '@/libs/EventDispatcher';
/**
 * 桥，负责对接端内
 */
export class NativeBridge {
  constructor () {
    /**
     * callback(jsonData)
     */
    this._e = new EventDispatcher();
    this.handleCallback = this.handleCallback.bind(this);
    this.callbacks = new Map();
  }
  /**
   * 与端内建立链接，成功后会派发onReady事件
   * 失败打印原因
   */
  init () {
    // TODO 初始化端内监听等
    // 初始化成功
    this._e.dispatchEvent('onReady');
  }

  /**
   * 发送消息到端内，无需回执
   * @param {*} json
   */
  sendMessageToNative (json) {

  }
  /**
   * 获取鉴权数据
   */
  fetchAppData () {

  }

  /**
   * 向端内请求数据
   * @param {*} url
   * @param {function} callback
   */
  request (data, callback = () => {}) {

  }
  registerCallback (callbackId, callback) {
    this.callbacks.set(callbackId, callback);
  }
  handleCallback (callbackId, res) {
    try {
      if (this.callbacks.has(callbackId)) {
        let callbackHandler = this.callbacks.get(callbackId);
        callbackHandler(res);
        this.callbacks.delete(callbackId);
      }
    } catch (error) {
      console.error('handleCallback error', error);
    }
  }
  dispatchEvent (type, ...data) {
    this._e.dispatchEvent(type, ...data);
  }
  /**
   * 监听端内消息
   * @param {*} type
   * @param {*} callback
   */
  on (type, callback) {
    // TODO 不同端的数据打平，统一派发
    this._e.addEventListener(type, callback);
  }
  /**
   *
   * @param {*} type 取消监听的类型字段
   */
  off (type) {
    this._e.removeAllListener(type);
  }
}
