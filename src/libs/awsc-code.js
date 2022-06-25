/**
 * 阿里云短信防刷
 * */

import { require } from './utils';
import { Toast } from 'vant';

const initAWSC = () => {
  require('//g.alicdn.com/AWSC/AWSC/awsc.js', function () {
    AWSC.use('nvc', function (state, module) {
      // nvc初始化参数对象
      const nvcOption = {
        // 应用类型标识
        appkey: '',
        // 使用场景标识。
        scene: 'nvc_message_h5',
        // 测试字段,通过设定初始化参数test的值复现无痕验证的各个状态工作机制
        test: '',
        // 二次验证获取人机信息串，跟随业务请求一起上传至业务服务器，由业务服务器进行验签。
        success: function (data) {
          window.twiceVerifySuccessCb && window.twiceVerifySuccessCb(data);
        },
        // 前端二次验证失败时触发该回调参数
        fail: function (failCode) {
          console.log(failCode, 'failCode');
        },
        // 前端二次验证加载异常时触发该回调参数。
        error: function (errorCode) {
          console.log(errorCode, 'errorCode');
        }
      };
      // 初始化 调用module.init进行初始化
      window.nvc = module.init(nvcOption);
    });
  });
};

// 返回的信息串
export const fetchNVCValAsync = () => {
  return new Promise((resolve, reject) => {
    window.nvc.getNVCValAsync(function (nvcVal) {
      resolve(nvcVal);
    });
  });
};

// 处理业务返回结果
export const processNVCValAsync = async (res, { nccb, successcb }) => {
  if (res.code === 20108) {
    // 无痕验证失败，直接拦截
    Toast(res.message || '发送验证码鉴权失败');
  } else if (res.code === 20107) {
    nccb && await nccb();
    // 无痕验证失败，触发二次验证
    // 二次验证码（滑动验证码）配置项设置，详情请见滑动验证集成方式文档
    // 二次验证的appkey，scene，test值及success，fail，error的回调由nvc初始化时决定，请不要在二次验证时传入
    const ncoption = {
      // 声明滑动验证需要渲染的目标ID。
      renderTo: 'awsc-nc'
      // 自定义滑动文案
      // upLang: {
      //   'cn': {
      //     // 等待滑动状态提示。
      //     'SLIDE': '请向右滑动验证',
      //     // 验证通过状态提示。
      //     'SUCCESS': '验证通过'
      //   }
      // }
    };
    // 唤醒二次验证（滑动验证码）
    window.nvc.getNC(ncoption);
    // 设置全局执行函数
    if (successcb) {
      window.twiceVerifySuccessCb = successcb;
    };
  } else if (res.code !== 200 && res.code !== 0) {
    Toast(res.message || '验证码发送失败，请稍后再试');
  }
};

export default {
  initAWSC,
  fetchNVCValAsync,
  processNVCValAsync
};
