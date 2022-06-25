import CryptoJS from 'crypto-js';
// 用于校验签名 需要加在http header里面
export const appKey = '';
// 密钥 用于生成签名
const KEY = '';
/**
 * 根据对象的KEY进行排序
 * @param   [Object]  obj   需要排序的对象
 * @return  [Object]        返回排序后的对象
 */
const objSortByKey = (obj) => {
  // 返回结果
  let res = {};
  // 对所有Key 进行排序
  const objKeys = Object.keys(obj).sort();
  // 遍历所有Key 重新放到新的对象中
  objKeys.forEach(key => {
    let val = obj[key];
    // 当传入的参数不为null或者undefined 进行签名
    if (val !== null && val !== undefined) {
      res[key] = val;
    }
  });
  return res;
};

/**
 * 获取Http请求签名，每个接口签名都不一样
 * @param  [Object]  option   http请求
 */
export const getSignature = (option) => {
  // 签名
  let signature = CryptoJS.HmacSHA1('', KEY);
  // 请求方式
  const httpType = option.method.toUpperCase();
  // 请求数据
  const httpData = option.data || option.params;
  // 数据类型是否为文件上传
  const isFormData = httpData instanceof FormData;
  // 如果不是文件上传类型 进行签名
  if (!isFormData) {
    let jsonStr = '';
    if (httpType === 'GET' || httpType === 'PUT' || httpType === 'DELETE') {
      // 对请求对象的参数进行排序并拼接成字符串
      jsonStr = parseParam(objSortByKey(httpData)).substring(1);
    } else {
      const isFormType = option.headers['Content-Type'] && option.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') > -1;
      if (isFormType) {
        // 对请求对象的参数进行排序并拼接成字符串
        jsonStr = parseParam(objSortByKey(httpData)).substring(1);
      } else {
        jsonStr = JSON.stringify(httpData);
      }
    }
    // 对请求数据字符串进行加密处理 生成签名
    signature = CryptoJS.HmacSHA1(jsonStr, KEY).toString().toUpperCase();
  }
  return signature;
};

/**
 * 分解拼接参数 用于生成签名
 * @param  [*]       param  数据内容
 * @param  [String]  key    字段名
 */
function parseParam (param, key) {
  let paramStr = '';
  if (param === null) param = '';
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
