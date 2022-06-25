import { blink } from '@/plugins/fe_log';
import { typeOf } from './utils';
// import { getUrlParams } from './client';

const SCHEME = {
  // 录音
  APP_AUDIO: 'audio://appaudio',
  APP_IMG: 'img://appimg',
};

export const requestAppAudio = () => {
  const oldIframe = document.getElementById('appaudio-iframe');
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }
  const iframe = document.createElement('iframe');
  iframe.id = 'appaudio-iframe';
  iframe.src = SCHEME.APP_AUDIO;
  iframe.style.cssText =
    'position:absolute;top:-10px;border:0;width:1px;height:1px;';
  iframe.scrolling = 'no';
  document.body.appendChild(iframe);
};

export const initGetAppAudio = () => {
  return new Promise((resolve, reject) => {
    window.getAppaudio = (res = '{}') => {
      const ifm = document.getElementsByTagName('iframe')[0];
      ifm && ifm.parentNode.removeChild(ifm);
      try {
        if (res) {
          resolve(res);
        } else {
          reject(new Error('error'));
        }
      } catch (error) {
        reject(new Error('error'));
      }
    };
  });
};

export const requestAppImg = () => {
  const oldIframe = document.getElementById('appimg-iframe');
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }
  const iframe = document.createElement('iframe');
  iframe.id = 'appimg-iframe';
  iframe.src = SCHEME.APP_IMG;
  iframe.style.cssText =
    'position:absolute;top:-10px;border:0;width:1px;height:1px;';
  iframe.scrolling = 'no';
  document.body.appendChild(iframe);
};

export const initGetAppImg = (that, type) => {
  return new Promise((resolve, reject) => {
    window.getAppimg = (res = '{}') => {
      const ifm = document.getElementsByTagName('iframe')[0];
      ifm && ifm.parentNode.removeChild(ifm);
      try {
        if (res) {
          resolve(res);
        } else {
          reject(new Error('error'));
        }
      } catch (error) {
        reject(new Error('error'));
      }
    };
    // oss上传图片错误信息收集
    window.getAppimgError = (res) => {
      const ifm = document.getElementsByTagName('iframe')[0];
      ifm && ifm.parentNode.removeChild(ifm);
      if (typeOf(res) !== 'string') {
        try {
          res = JSON.stringify(res);
        } catch (err) {
        }
      }
      blink('initGetAppImgError', res);
    };
  });
};

/**
 * 保存图片到相册
 * @return {[type]} [description]
 */
export const saveImages = opt => {
  const shareImages = 'saveimage://xxxx?imageurl=';
  // 发送请求...
  window.location.href = shareImages + opt.imageUrl;
  console.log('保存图片到相册', shareImages + opt.imageUrl);
};

