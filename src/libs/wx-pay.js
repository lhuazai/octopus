
export const wxJsPay = (
  {
    appId,
    timeStamp,
    nonceStr,
    packageStr,
    signType = 'MD5',
    paySign
  }) => {
  return new Promise((resolve, reject) => {
    let WeixinJSBridge = window.WeixinJSBridge;
    function onBridgeReady () {
      const options = {
        appId: appId, // 公众号名称，由商户传入
        timeStamp: timeStamp, // 时间戳，自1970年以来的秒数
        nonceStr: nonceStr, // 随机串
        package: packageStr,
        signType: signType, // 微信签名方式：
        paySign: paySign // 微信签名
      };

      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', options,
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            resolve(res);
          } else {
            // eslint-disable-next-line
            reject();
          }
        });
    }

    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  });
};
