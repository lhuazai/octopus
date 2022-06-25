import store from '@/store';
import hybrid from './HybridMobile';

// 为了接收定义的回调函数

var bridgePostMsg = function (url) {
  var ifrm = document.createElement('iframe');
  ifrm.src = url;
  ifrm.style.width = '640px';
  ifrm.style.height = '480px';
  ifrm.style.display = 'none';
  document.body.appendChild(ifrm);
  setTimeout(function () {
    ifrm.remove();
  }, 1000);
};

var _getHybridUrl = function (params) {
  var url = params.scheme || 'xxxxx://';

  url += params.tagname + '?t=' + new Date().getTime(); // 时间戳，防止url不起效
  if (params.callback) {
    // url += '&callbackId='+params.callbackId+'&callback=' + params.callbackFunction;
    // delete params.callback;
    url += `&callbackId=${params.callbackId}&callback=${params.callbackFunction}`;
  }
  if (params.params) {
    // paramStr = typeof params.params == 'object' ? JSON.stringify(params.params) : params.params;
    // url += '&' + paramStr;
    Object.keys(params.params).forEach(function (key) {
      url += `&${key}=${params.params[key]}`;
    });
  }
  return url;
};

var msgCallbackMap = [];
// 默认函数是跳转Native的Link
export default function (params) {
  // 生成唯一执行函数，执行后销毁
  var tt = (new Date().getTime());
  var callbackid = 'hybrid_' + tt;

  if (params.callback && typeof (params.callback) === 'function') {
    if (params.tagname === 'appData') {
      // 需要特殊处理一下登陆的callback，因为native这边给的是个固定的返回函数
      msgCallbackMap['appData'] = params.callback;
    } else {
      msgCallbackMap[callbackid] = params.callback;
      params.callbackId = callbackid;
      params.callbackFunction = 'HybridCallbackDispatcher';
    }
  }
  bridgePostMsg(_getHybridUrl(params));
}

// 提供给native的回调，必须是 window的方法
window.hybridCallbackDispatcher = function (callbackId, resultjson) {
  var handler = msgCallbackMap[callbackId];
  if (handler && typeof (handler) === 'function') {
    var resultObj = resultjson ? JSON.parse(resultjson) : {};
    handler(resultObj);
  }
};

// 处理Native登陆用户的返回值
window.getAppData = function (resultjson) {
  // 这地方应该使用异步调用，保证取到值
  var handler = msgCallbackMap['appData'];
  if (handler && typeof (handler) === 'function') {
    handler(resultjson);
  }
  // store.dispatch('user/login',resultjson)
};
window.onBackWebView = function () {
  if (!store.state.user.loginStatus) {
    // 这种情况说明用户跳转到native的登陆页面，且有可能需要跳转到授权页面
    // 登陆过，需要重新获取token，判断用户是否成功
  }
  if (store.state.cart.checkoutStatus !== null) {
    // 解决方案一 ，pass
    // router.replace(`/OfflineSchool/${state.cart.schoolId}`)
    // 退一步是订单确认页
    // 再退一步跳过购物车页面或者
    // router.go(-1)

    // 解决方案二，pass，会产生视觉上的来回跳动，所以建议native自行判断支付成功后跳转到订单列表页。返回后，H5负责关闭第一次的View，回到app首页
    // if(store.state.cart.isClose){
    //   hybrid.closeView()
    // }else{
    //   store.commit('cart/setCloseTag',true)
    //   hybrid.goOrderList()
    // }

    // 解决方案三
    hybrid.closeView();
  }
};
export function sendMessageToCef ({ apiName = '', params = [] }) {
  return new Promise((resolve) => {
    console.log('apiName, params', apiName, params);
    if (!window.QCefClient) {
      resolve([0, '不在app环境内，应用无法工作']);
    } else {
      window.QCefQuery({
        request: JSON.stringify({
          funcName: apiName,
          param: [...params]
        }),
        onSuccess: res => {
          resolve([1, res]);
        },
        onFailure: err => {
          // 交由C++处理自己的错误
          // Message({
          //   type: 'error',
          //   message: (err && err.msg) || `C++接口${apiName}出错`
          // });
          resolve([0, err]);
        }
      });
    }
  });
}
