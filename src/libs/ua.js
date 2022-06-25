import type from './type';
/**
 * @desc 通过ua判断用户端环境
 */
export default {
  /**
   * 判断ua是否与正则匹配
   * @param {String|RegExp} regex 正则字符串|正则对象
   * @returns {boolean}
  */
  isMatch ({ regex, ua = navigator.userAgent }) {
    // 正则合法性校验
    if (!regex) {
      throw new Error('regex参数必须有值');
    }
    // 字符串转正则对象
    if (type.isString(regex)) {
      regex = new RegExp(regex);
    }

    // 返回匹配结果
    return regex.test(ua || this.ua);
  },
  /**
   * 依次匹配数组每一项，某一项匹配成功则全部成功
   * @param {(String[]|RegExp[])} array 正则数组
   * @param {String} ua 用户ua
   * @returns {boolean}
  */
  isMatchInArray ({ array, ua }) {
    return array.some(item => this.isMatch({
      regex: item,
      ua
    }));
  },
  /**
   * 判断是iPad
   * @param {String} ua 根据ua判断，服务端时一定要传，客户端时可不传默认取客户端ua
   * @returns {Boolean}
  */
  isIpad (ua = navigator.userAgent) {
    return this.isMatchInArray({
      ua,
      array: ['iPad']
    });
  },
  /**
   * 判断是AndroidPad
   * @param {String} ua 根据ua判断，服务端时一定要传，客户端时可不传默认取客户端ua
   * @returns {Boolean}
  */
  isAndroidPad (ua = navigator.userAgent) {
    return this.isMatchInArray({
      ua,
      array: ['Android']
    }) && !this.isMatchInArray({
      ua,
      array: ['Mobile']
    });
  },
  /**
   * 判断是Pad
   * @param {String} ua 根据ua判断，服务端时一定要传，客户端时可不传默认取客户端ua
   * @returns {Boolean}
  */
  isPad (ua = navigator.userAgent) {
    return this.isIpad(ua) || this.isAndroidPad(ua);
  },
  /**
   * 判断是IphoneX
   * @param {String} ua 根据ua判断，服务端时一定要传，客户端时可不传默认取客户端ua
   * @returns {Boolean}
  */
  isIphoneX (ua = navigator.userAgent) {
    return /iphone/gi.test(ua) && window.screen.height && window.screen.height >= 812;
    // iPhone X、iPhone XS
    // return /iphone/gi.test(ua) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812 ||
    //   // iPhone XS Max
    //   /iphone/gi.test(ua) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896 ||
    //   // iPhone XR
    //   /iphone/gi.test(ua) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;
  },
  isIos (ua = navigator.userAgent) {
    return /iphone/gi.test(ua);
  }
};
