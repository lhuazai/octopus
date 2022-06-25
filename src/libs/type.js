/**
 * @desc 本模块用于判断变量类型
 */
export default {
  /**
   * 判断变量是否为Number类型
   * @param {Object} value 需要判断的值
   * @return {boolean}
   */
  isNumber (value) {
    return Object.prototype.toString.call(value) === '[object Number]';
  },

  /**
   * 判断变量是否为String类型
   * @param {Object} value 需要判断的值
   * @return {boolean}
   */
  isString (value) {
    return Object.prototype.toString.call(value) === '[object String]';
  },

  /**
   * 判断变量是否为Boolean类型
   * @param {Object} value 需要判断的值
   * @return {boolean}
   */
  isBoolean (value) {
    return Object.prototype.toString.call(value) === '[object Boolean]';
  },

  /**
   * 判断变量是否为Object类型
   * @param {Object} value 需要判断的值
   * @return {boolean}
   */
  isObject (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  },

  /**
   * 判断变量是否为Array类型
   * @param {Object} value 需要判断的值
   * @return {boolean}
   */
  isArray (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },

  /**
   * 判断变量是否为Function类型
   * @param {Object} value 需要判断的值
   * @return {boolean}
   */
  isFunction (value) {
    return Object.prototype.toString.call(value) === '[object Function]';
  }
};
