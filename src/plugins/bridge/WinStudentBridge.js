import {
  NativeBridge
} from './NativeBridge';

import { sendMessageToCef } from './hybridCore';

/**
 * 桥，负责对接
 */
export class WinStudentBridge extends NativeBridge {
  /**
   * 与端内建立链接，成功后会派发onReady事件
   * 失败打印原因
   */
  init () {
    console.log('WinStudentBridge 初始化', window.QCefClient);
    const instance = this._viewInteractMsg.bind(this);
    // TODO 初始化端内监听等
    if (window.QCefClient) {
      window.QCefClient.addEventListener('receiveMessage', instance);
    }
    // 初始化成功
    super.dispatchEvent('onReady');
  }
  /**
   * 获取鉴权数据
   */
  async fetchAppData () {
    const resData = await sendMessageToCef({ apiName: 'GAME.appInfo' });
    const [code, res] = resData;
    let appInfo = {};
    if (code) {
      try {
        appInfo = JSON.parse(res);
        console.log('解析appInfo成功', appInfo);
      } catch (error) {
        console.error('解析PC学生端appinfo失败', appInfo);
      }
    }
    return appInfo.data;
  }

  /**
   * 端内消息
   * @param {type:'',data:{}} msg
   */
  _viewInteractMsg (resp) {
    console.log('收到PC学生端参数', resp);
    if (!resp.body) return;
    const body = JSON.parse(resp.body);
    try {
      if (resp.code === 200) {
        const { type } = body;
        const data = JSON.parse(body.data);
        console.log(`PC学生端消息 type${type} data${data} `);
        super.dispatchEvent(type, data.extra);
      } else {
        console.error('解析PC学生端消息失败', resp);
      }
    } catch (error) {
      console.warn(`PC学生端消息解析失败 ${error} `);
    }
  }

  _generateCallbackId () {
    return 'hybrid_pc_student_' + Date.now();
  }
  /**
   * 向端内请求数据
   * @param {*} url
   * @param {function} callback
   */
  request (data, callbackFn = () => {}) {
    sendMessageToCef({ apiName: 'GAME.REQUEST', params: [JSON.stringify(data)] }).then(resData => {
      const [code, res] = resData;
      if (code === 0) {
        console.log(`Windows PC request失败响应 code ${code}`);
        return;
      }
      try {
        callbackFn(JSON.parse(res));
      } catch (error) {
        console.log(`parse Windows PC response失败`);
      }
    });
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
