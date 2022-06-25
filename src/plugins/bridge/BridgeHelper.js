import {
  AndroidBridge
} from './AndroidBridge';
import {
  IOSBridge
} from './IOSBridge';
import {
  WinTeacherBridge
} from './WinTeacherBridge';
import {
  WinStudentBridge
} from './WinStudentBridge';
import {
  WebStudentBridge
} from './WebStudentBridge';
/**
 * 桥，负责对接端内
 */
export class BridgeHelper {
  constructor (os) {
    this.os = os;
    if (!os) {
      console.error('BridgeHelper-------缺少初始化参数os');
      return;
    }
    let osLowercase = os.toLowerCase();
    this.bridge = null;
    switch (osLowercase) {
    case 'ios':
    case 'iphone':
    case 'ipad':
      this.bridge = new IOSBridge();
      break;
    case 'android':
      this.bridge = new AndroidBridge();
      break;
      // pc老师端
    case 'teacher_live_pc':
      this.bridge = new WinTeacherBridge();
      break;
      // pc学生端
    case 'pc':
      this.bridge = new WinStudentBridge();
      break;
      // 官网
    case 'web':
      this.bridge = new WebStudentBridge();
      break;
    }
  }

  /**
   * 与端内建立链接，成功后会派发onReady事件
   * 失败打印原因
   */
  init () {
    if (!this.os) {
      console.error('init-------缺少初始化参数os');
      return;
    }
    // 初始化游戏监听
    // window.addEventListener('message', this.handleAppMsg)
    // 初始化端内监听
    this.bridge.on('onReady', () => {
      console.log('Native 加载完成');
    });
    this.bridge.init();
  }
  async fetchAppData () {
    return await this.bridge.fetchAppData();
  }
}
