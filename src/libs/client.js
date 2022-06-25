export const getUrlParams = (name = '') => {
  var search = location.search.substring(1);
  const ua = navigator.userAgent.toLowerCase();

  let params = {};
  if (search.length) {
    try {
      params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    } catch (error) {
      console.log(error);
    }
  }
  if (isInApp() && (!params.version || !params.os || !params.client)) {
    const arr = ua.split(' ');
    const versionReg = /app\/(.*?)/;
    const osClientReg = /\((.*?);(.*?)\)/;
    arr.forEach(i => {
      if (versionReg.test(i)) {
        params.version = i.replace(versionReg, '$1');
      } else if (osClientReg.test(i)) {
        const obj = JSON.parse(i.replace(osClientReg, '{"os":"$1","client":"$2"}'));
        params = Object.assign({}, params, obj);
      }
    });
  }
  return params;
};

export const isIOS = () => {
  return (/iphone/i).test(navigator.userAgent.toLowerCase());
};
export const isIPAD = () => {
  return (/ipad/i).test(navigator.userAgent.toLowerCase());
};
export const isAndroid = () => {
  return navigator.userAgent.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
};

export const isAndroidBrowser = () => { // 是否在安卓浏览器打开
  const u = root.navigator.userAgent;
  return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
};

export const isWeixin = () => {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
};

export const isQQ = () => {
  return navigator.userAgent.toLowerCase().indexOf('qq') !== -1;
};


export const isInApp = () => {
  return getUrlParams().os;
};

export const objToQuery = (obj) => {
  let str = '';
  for (let key in obj) {
    if (str !== '') {
      str += '&';
    }
    if (key) {
      str += key + '=' + encodeURIComponent(obj[key]);
    }
  }
  return str;
};

export const queryToObj = () => {
  var search = location.search.substring(1);
  if (search.length) {
    try {
      return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    } catch (error) {
      console.log(error);
    }
  } else {
    return {};
  }
};

/**
 * 62进制转十进制
 * @param numberCode
 * @returns {number}
 */
export const base62to10 = (numberCode) => {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
  const radix = chars.length;
  numberCode = String(numberCode);
  const len = numberCode.length;
  let i = 0;
  let originNumber = 0;
  while (i < len) {
    originNumber += Math.pow(radix, i++) * chars.indexOf(numberCode.charAt(len - i) || 0);
  }
  return originNumber;
};


// 获取地址参数
export const getHrefParma = (url) => {
  var parma = {};
  // 参数数组
  var parmaArr = [];
  var item = '';
  // 下标
  var i;
  var j;
  var k;
  var n;

  // url
  if (url) {
    i = url.indexOf('?');
    url = i > -1 ? url.slice(i + 1) : '';
  } else {
    url = decodeURI(window.location.search.slice(1));
  }
  // 赋值
  parmaArr = url.split('&');
  //
  for (let i in parmaArr) {
    item = parmaArr[i];

    j = item.indexOf('=');
    // 不存在键值对
    if (j < 0) { continue; }

    k = item.slice(0, j);
    n = item.slice(j + 1);
    //
    parma[k] = n;
  }
  return parma;
};
