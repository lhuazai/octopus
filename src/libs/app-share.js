import { getUrlParams } from './client';
const version = Number((getUrlParams() && getUrlParams().version || '').replace(/\./g, ''));
export const getShareData = (opt) => {
  const obj = getUrlParams();
  delete (obj.os);

  return {
    // 显示分享按钮
    isShow: opt.isShow !== undefined ? opt.isShow : true,
    // 分享图片地址
    imageUrl: opt.imgUlr,
    // 分享标题
    title: opt.title,
    shareUrl: opt.url,
    // 分享描述
    description: opt.desc
  };
};
export const shareBtn = (opt) => {
  let shareData = getShareData(opt);
  shareData = JSON.stringify(shareData);
  if (version >= 290) {
    shareData = window.encodeURIComponent(shareData);
  };
  console.log(shareData);
  // 主要逻辑，页面跳转并携带参数
  window.location.href = 'showshareview://xxx?shareData=' + shareData;
};
// 分享图片
export const shareImage = (opt) => {
  // debugger;
  let shareData = getShareData(opt);
  shareData = JSON.stringify(shareData);

  shareData = window.encodeURIComponent(shareData);

  window.location.href = 'showimageshareview://xxx?shareData=' + shareData;
};
export const appShareRegister = (opt) => {
  let shareData = getShareData(opt);
  shareData = JSON.stringify(shareData);
  if (version >= 290) {
    shareData = window.encodeURIComponent(shareData);
  };
  window.location.href = 'share://lexue?shareData=' + shareData;
};
export default {
  getShareData,
  shareBtn,
  shareImage,
  appShareRegister
};
