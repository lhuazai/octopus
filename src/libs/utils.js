import events from './events';
// import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { getUrlParams, isWeixin, isIOS, isAndroid, isAndroidBrowser } from '@/libs/client';
// typeOf, return 'array', 'object', 'function', 'null', 'undefined', 'string', 'number'
export const typeOf = input => {
  return ({}).toString.call(input).slice(8, -1).toLowerCase();
};

// window对象
const root = window || {};
/**
 * 封闭全局加密方法
 * @param value 参数名
 * @param key 密钥
 */
export const encryption = (value, key) => {
  const jsonStr = parseParam(objKeySort(value)).substring(1);
  return CryptoJS.HmacSHA1(jsonStr, key).toString().toUpperCase(); // sha1加密
};
/**
 * 分解拼接参数
 * @param {String} param
 * @param {*} key
 */
export const parseParam = (param, key) => {
  let paramStr = '';
  if (param === null) { param = ''; }
  const t = typeof (param);
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr = `&${key}=${param}`;
  } else {
    for (let i in param) {
      if (param.hasOwnProperty(i)) {
        paramStr += parseParam(param[i], i);
      }
    }
  }
  return paramStr;
};

// 将有效的对象字段转成分号拼接字符串
export const objToString = (obj, keyValOper = ':', everyOper = ';') => {
  const strArr = [];
  for (let key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      strArr.push(`${key}${keyValOper}${obj[key]}`);
    }
  }
  return strArr.join(everyOper);
};

// 无刷新替换url参数
export const deleteParamsByKey = (key) => {
  const query = getUrlParams();
  if (key instanceof Array) {
    for (let i = 0; i < key.length; i++) {
      query[key[i]] && delete query[key[i]];
    }
  } else {
    query[key] && delete query[key];
  }
  const newQueryString = objToString(query, '=', '&');
  const { origin, pathname } = window.location;
  history.replaceState(null, null, `${origin}${pathname}${newQueryString ? `?${newQueryString}` : ''}`);
};

// 无刷新增加url参数
export const addUrlParams = (params = {}) => {
  try {
    const newQueryString = objToQuery(params);
    const { origin, pathname, search } = window.location;
    history.replaceState(null, null, `${origin}${pathname}${search ? `${search}&${newQueryString}` : `?${newQueryString}`}`);
  } catch (err) {}
};

// 排序的函数
export const objKeySort = (obj) => {
  const newKey = Object.keys(obj).sort();
  // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newKey是一个数组
  const newObj = {}; // 创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newKey.length; i++) { // 遍历newKey数组
    newObj[newKey[i]] = obj[newKey[i]]; // 向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj; // 返回排好序的新对象
};

// 合并对象属性（在原始对象上进行修改）
export const merge = (obj, options) => {
  if (obj && options) {
    for (let p in options) {
      if (typeOf(obj[p]) === 'object' && typeOf(options[p]) === 'object') {
        merge(obj[p], options[p]);
      } else {
        obj[p] = options[p];
      }
    }
  }
  return obj;
};

/**
 * 判断变量是否空值
 * undefined, null, '', false, 0, [], {} 均返回true，否则返回false
 */
export const empty = (v) => {
  switch (typeof v) {
  case 'undefined' :
    return true;
  case 'string' :
    if (v.trim().length === 0) return true;
    break;
  case 'boolean' :
    if (!v) return true;
    break;
  case 'number' :
    if (v === 0) return true;
    break;
  case 'object' :
    if (v === null) return true;
    if (undefined !== v.length && v.length === 0) return true;
    for (const k in v) {
      return false;
    }
    return true;
  }
  return false;
};

export const isJsonStr = (str) => {
  if (typeof str === 'string') {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
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

export const hexToRgbArr = (hex) => {
  return [parseInt('0x' + hex.slice(1, 3)), parseInt('0x' + hex.slice(3, 5)), parseInt('0x' + hex.slice(5, 7))];
};

// 千分号分隔
export const thousandSplit = (num) => {
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

// 复制文本到粘贴板
export const _copyText = (text = '', cb = () => {}) => {
  try {
    const input = document.createElement('input');
    input.value = text;
    input.style.position = 'absolute';
    input.style.bottom = '-200px';
    input.style.left = '-200px';
    input.style.opacity = 0;
    input.style.WebkitUserSelect = 'none';

    // 解决IOS点击复制后软键盘弹出 页面闪烁问题
    input.readOnly = true;
    input.unselectable = 'on';
    input.onfocus = 'this.blur()';

    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    cb && cb();
    setTimeout(_ => {
      document.body.removeChild(input);
    }, 200);
  } catch (error) {
    console.log(error);
  }
};
// 数字小于10补零
export const toDouble = (num) => {
  return num < 10 ? `0${num}` : num;
};
// 检测浏览器是否支持webp格式图片
export const checkWebp = () => {
  try {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (err) {
    return false;
  }
};

// require方法
export const require = (url, onload) => {
  var doc = document;
  var head = doc.head || (doc.getElementsByTagName('head')[0] || doc.documentElement);
  var node = doc.createElement('script');
  node.onload = onload;
  node.onerror = function () {};
  node.async = true;
  node.src = url;
  head.appendChild(node);
};

// 删除当前url中指定参数
export const delUrlParam = (url, key) => {
  let baseUrl = url.split('?')[0] + '?';
  let query = url.split('?')[1];
  if (query.indexOf(key) > -1) {
    let obj = {};
    let arr = query.split('&');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=');
      obj[arr[i][0]] = arr[i][1];
    }
    delete obj[key];
    let url =
      baseUrl +
      JSON.stringify(obj)
        .replace(/["{}]/g, '')
        .replace(/:/g, '=')
        .replace(/,/g, '&');
    return url;
  } else {
    return url;
  }
};

// 替换OSS域名为CDN域名
export const replaceOSSDomain = (url) => {
  return url.replace('http:', 'https:')
    .replace('oss-cn-beijing.aliyuncs.com', 'xxxxx.com')
    .replace('oss-cn-beijing.aliyuncs.com', 'xxxxx.com');
};
// 是否启用webp图片压缩
const isUseWebp = true;
// 处理图片oss配置
export const ossImgResize = (w = 375, h = 0) => {
  // 浏览器是否支持webp格式图片
  let isCanWebp = localStorage.getItem('IMAGE_CAN_WEBP');
  // 如果未进行过检测 如果进行过检测 即便不支持 也存在false字符串 就不会在进入这里
  if (isUseWebp && !isCanWebp) {
    // 检测当前浏览器是否支持webp格式图片 主要这里是字符串true/false
    isCanWebp = (document && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) + '';
    // 设置缓存
    localStorage.setItem('IMAGE_CAN_WEBP', isCanWebp);
  }
  // 图片宽度
  const imgWidth = window.devicePixelRatio ? w * Math.floor(window.devicePixelRatio) : w;
  // web格式化配置
  let webpFormat = isCanWebp === 'true' ? '/format,webp' : '';
  // 输出oss配置
  return `?x-oss-process=image/resize,w_${imgWidth}${webpFormat}`;
};

// 是否为空对象
export const isObject = (obj) => {
  if (!obj) {
    return false;
  } else {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
};

// 是否为空对象
export const isEmptyObject = (obj) => {
  // 判断是否为对象
  if (isObject(obj)) {
    return Object.keys(obj).length === 0;
  } else {
    return false;
  }
};

/**
 * 跳转app下载链接
 * @param {GAOKAO ZHIYUAN ZHONGKAO} appName app名称
 */
export const jumpAppDownloadPath = (appName) => {
  root.location.href = getAppDownloadPath(appName);
};

/**
 * 获取下载链接
 * @param {GAOKAO ZHIYUAN ZHONGKAO} appName app名称
 */
export const getAppDownloadPath = (appName) => {
  // 下载地址
  const DOWN_PATH = {
    // 高考
    GAOKAO: {
      // 安卓
      ANDROID: 'http://xxxxxxx/apk/Courser.apk',
    }
  };
  const downPaths = DOWN_PATH[appName];
  // 业务
  switch (true) {
  case isWeixin(): // wechat
    console.log('download env: weixin');
    return downPaths.WECHAT;
  case isIOS(): // ios
    console.log('download env: ios');
    return downPaths.IOS;
    // android
  case isAndroid():
    console.log('download env: android');
    return downPaths.ANDROID; // [courser] || downPaths.ANDROID;
  case isAndroidBrowser():
    return downPaths.ANDROID;
  default: // windows
    console.log('download env: PC');
    return downPaths.ANDROID; // [courser] || downPaths.ANDROID;
  }
};

// 根据域名获知当前所属环境
export const getCurrentEnv = function () {
  let href = location.href;
  let env = 'online';
  if (href.includes('tsl')) {
    env = 'tsl';
  } else if (href.includes('ali')) {
    env = 'ali';
  } else if (href.includes('dev')) {
    env = 'dev';
  } else if (href.includes('kfc')) {
    env = 'kfc';
  } else if (href.includes('localhost')) {
    env = 'kfc';
  }
  return env;
};

// 与app交互逻辑

export const SCHEME_URLS = {
  // 登录注册页
  LOGIN: 'app://login',
};

export const schemeTools = {
  scheme (scheme, param) {
    // scheme地址
    var schemeUrl = SCHEME_URLS[scheme];
    if (!schemeUrl) schemeUrl = scheme;
    if (!param) param = {};
    let parmaStr = '';
    // 拼接scheme地址
    if (scheme && param) {
      for (var key in param) {
        parmaStr += key + '=' + param[key] + '&';
      }
      // 去除最后“&”
      parmaStr && (schemeUrl += '?' + parmaStr.replace(/&$/, ''));
    }
    // 发送请求...
    window.location.href = schemeUrl;
  },
  /**
     * app 下载
     * @param  {object} parma 参数
     * @param  {number} productType   产品类型
     * @param  {number} productID     产品编号
     * @param  {number} activeID      活动编号
     */
  pay (parma) {
    var productType = parma.productType;
    var productID = parma.productID;
    var activeID = parma.activeID;
    var scheme;
    var schemeUrl;

    switch (productType) {
    case 6:
      // 课程卡
      scheme = SCHEME_URLS.ORDERPAY;
      break;
    default:
      scheme = SCHEME_URLS.ORDER_CONFIRM;
      break;
    }
    schemeUrl = scheme + '?productID=' + productID;
    (Number(activeID) > 0) && (schemeUrl += '&activeID=' + activeID);
    // 发送请求...
    window.location.href = schemeUrl;
  }
};

// app数据
/**
 *
 * @param {SENIOR_TEACH JUNIOR_TEACH} loginName
 */
export const appLogin = (loginName = 'JUNIOR_TEACH') => {
  let isBack = false;
  return new Promise((resolve, reject) => {
    // 先注册函数监听
    events.on('getAppDataSuccess', () => {
      resolve();
    });
    events.on('getAppDataFail', () => {
      sessionStorage.removeItem('appData');
      localStorage.removeItem('lgtk');
      if (!isBack) {
        root.location.href = SCHEME.LOGIN[loginName];
      }
    });
    // 最后请求登录信息
    requestAppData();
  });
};

export const requestAppData = () => {
  const oldIframe = document.getElementById('appdata-iframe');
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }
  const iframe = document.createElement('iframe');
  iframe.id = 'appdata-iframe';
  iframe.src = 'data://appData';
  iframe.style.cssText = 'position:absolute;top:-10px;border:0;width:1px;height:1px;';
  iframe.scrolling = 'no';
  document.body.appendChild(iframe);
  iframe.src = 'data://appData';
};

/**
     * 格式化日期
     * @parma {number, string}{1} time 时间 number:毫秒数，日期字符串
     * @parma {string}{1, 0} formate 格式化字符串
     */
export const formateDate = (time, formate) => {
  var result = '';
  var year;
  var month;
  var day;
  var hour;
  var minute;
  var second

  ;(typeof time === 'string') && (time = time.replace(/-/g, '/'));
  time = new Date(time);

  // 为有效时间
  if (!isNaN(time.getTime())) {
    // 年
    year = time.getFullYear();
    // 月
    month = time.getMonth() + 1
    ;(month < 10) && (month = '0' + month);
    // 日
    day = time.getDate()
    ;(day < 10) && (day = '0' + day);
    // 时
    hour = time.getHours()
    ;(hour < 10) && (hour = '0' + hour);
    // 分
    minute = time.getMinutes()
    ;(minute < 10) && (minute = '0' + minute);
    // 秒
    second = time.getSeconds()
    ;(second < 10) && (second = '0' + second);

    result = formate.replace(/yyyy/g, year).replace(/MM/g, month).replace(/dd/g, day)
      .replace(/hh/g, hour).replace(/mm/g, minute).replace(/ss/g, second);
  }

  return result;
};

/**
 * 时间对比
 * @param  {[type]} millis [description]
 * @return {[type]}        [description]
 */
export const formatPostTime = (millis) => {
  let ONE_MINUTES_INTERVAL = 1000 * 60;
  let ONE_HOUR_INTERVAL = 1000 * 60 * 60;
  let ONE_DAY_INTERVAL = 1000 * 60 * 60 * 24;
  // let ONE_YEAR_INTERVAL = 1000 * 60 * 60 * 24 * 365;
  let nowTime = new Date().getTime();
  let timeInterval = nowTime - millis;

  if (timeInterval < ONE_MINUTES_INTERVAL) {
    return '刚刚';
  } else if (timeInterval < ONE_HOUR_INTERVAL) {
    // 更新时间1小时内的，以分为最小时间单位，如1分钟前；
    return Math.floor(timeInterval / 1000 / 60 === 0 ? 1 : timeInterval / 1000 / 60) + '分钟前';
  } else if (timeInterval < ONE_DAY_INTERVAL && millis < nowTime && millis > nowTime - ONE_DAY_INTERVAL) {
    // 1小时以上并且当天发布，以小时为最小单位，如21:59 ；
    return util.formateDate(millis, 'hh:mm');
  } else if (new Date(millis).getFullYear() === new Date().getFullYear()) {
    let timeDay = new Date(millis).getDate();
    let newDate = new Date().getDate();
    if (timeDay > newDate - 2 && timeDay === newDate - 1) {
      console.log(new Date(millis));
      // 1小时以上并且昨天发布，如昨天 12:35；
      return '昨天 ' + util.formateDate(millis, 'hh:mm');
    } else {
      // 昨天之前，当前年
      return util.formateDate(millis, 'MM月dd日');
    }
  } else {
    // 不是当前年
    return util.formateDate(millis, 'yyyy年MM月dd日');
  }
};
/*
 *  description: 防抖函数
 *  param fnName {String}  函数名
 *  param wait {Number}    延迟时间
 *  return: 处理后的执行函数
 */

export function debounce (fnName, wait) {
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      this[fnName].apply(context, args);
    }, wait);
  };
}
