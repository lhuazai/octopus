
// 请求接口
const wxapi = '//res.wx.qq.com/open/js/jweixin-1.2.0.js';
const qqapi = '//open.mobile.qq.com/sdk/qqapi.js';
const qzapi = '//qzonestyle.gtimg.cn/qzone/phone/m/v4/widget/mobile/jsbridge.js';

// 微信分享api list
const jsApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareQZone',
  'onMenuShareWeibo'
];
function require (url, onload) {
  var doc = document;
  var head = doc.head || (doc.getElementsByTagName('head')[0] || doc.documentElement);
  var node = doc.createElement('script');
  node.onload = onload;
  node.onerror = function () {
  };
  node.async = true;
  node.src = url[0];
  head.appendChild(node);
}
function _initWX (data) {
  if (!data.WXconfig) {
    return;
  }
  require([wxapi], function (wx) {
    if (!wx.config) {
      wx = window.wx;
    }
    var conf = data.WXconfig;
    wx.config({
      debug: false,
      appId: conf.appId,
      timestamp: conf.timestamp,
      nonceStr: conf.nonceStr,
      signature: conf.signature,
      jsApiList: jsApiList
    });
    wx.error(function (res) {
    });
    wx.ready(function () {
      var config = {
        title: data.title,
        desc: data.summary,
        link: data.url,
        imgUrl: data.pic,
        type: '',
        dataUrl: '',
        success: function () {
          data.callback && data.callback();
        },
        cancel: function () {
        } };
      wx.onMenuShareTimeline(config);
      wx.onMenuShareAppMessage(config);
      wx.onMenuShareQQ(config);
      wx.onMenuShareQZone(config);
      wx.onMenuShareWeibo(config);
    });
  });
}
function _initQQ (data) {
  var info = { title: data.title, desc: data.summary, share_url: data.url, image_url: data.pic };
  function doQQShare () {
    try {
      if (data.callback) {
        window.mqq.invoke('data', 'setShareInfo', {
          share_url: data.url,
          title: data.title,
          desc: data.summary,
          image_url: data.pic
        });
      } else {
        window.mqq.data.setShareInfo(info);
      }
    } catch (e) {
    }
  }
  if (window.mqq) {
    doQQShare();
  } else {
    require([qqapi], function () {
      doQQShare();
    });
  }
}
function _initQZ (data) {
  function doQZShare () {
    const QZAppExternal = window.QZAppExternal;
    if (QZAppExternal && QZAppExternal.setShare) {
      let imageArr = [];
      let titleArr = [];
      let summaryArr = [];
      let shareURLArr = [];
      for (var i = 0; i < 5; i++) {
        imageArr.push(data.pic);
        shareURLArr.push(data.url);
        if (i === 4 && (data.swapTitle || data.WXconfig && data.WXconfig.swapTitleInWX)) {
          titleArr.push(data.summary);
          summaryArr.push(data.title);
        } else {
          titleArr.push(data.title);
          summaryArr.push(data.summary);
        }
      }
      QZAppExternal.setShare(function (data) {
      }, { 'type': 'share', 'image': imageArr, 'title': titleArr, 'summary': summaryArr, 'shareURL': shareURLArr });
    }
  }
  if (window.QZAppExternal) {
    doQZShare();
  } else {
    require([qzapi], function () {
      doQZShare();
    });
  }
}
function init (opts) {
  var ua = navigator.userAgent;
  const isWX = ua.match(/MicroMessenger\/([\d.]+)/);
  const isQQ = ua.match(/QQ\/([\d.]+)/);
  const isQZ = ua.indexOf('Qzone/') !== -1;
  isWX && _initWX(opts);
  isQQ && _initQQ(opts);
  isQZ && _initQZ(opts);
}
// window.setShareInfo = init;

export default init;

/**
 * setShareInfo({
    title:          '父爱，在你看不到的地方', // 分享标题
    summary:        '父爱如山，感觉不到只因身在此山中', // 分享内容
    pic:            'http://qzonestyle.gtimg.cn/aoi/sola/20150617094556_OvfOpoRKRB.png', // 分享图片
    url:            'http://qzs.qzone.qq.com/qzone/qzact/act/2015/father-day-m/index.html', // 分享链接
    // 微信权限验证配置信息，若不在微信传播，可忽略
    WXconfig: {
        swapTitleInWX: true, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
        appId: appId, // 公众号的唯一标识
        timestamp: timestamp, // 生成签名的时间戳
        nonceStr: nonceStr, // 生成签名的随机串
        signature: signature // 签名
        }
    });
 */
