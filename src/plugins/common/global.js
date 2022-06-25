import { isWeixin, isInApp } from '../../libs/client';
export default {
  '$config' (options) {
    return {
      Login: 'login'
    };
  },
  /**
   * 保留有效价格小数，如：10->10 10.01->10.01 10.00->10 10.20->10.2
   * @params price: 价格
   * @params fixed: 保留位数
   * @params multiple: 倍数，如单位是分，除以100
  */
  validPrice (price, fixed = 2, multiple = 100) {
    var mreg = /(\.\d)0$/;
    if (price) {
      price = (price / multiple).toFixed(fixed).replace('.00', '');
      return price.replace(mreg, (match, capture) => {
        return capture;
      });
    }
    return price;
  },
  // 是否是在微信环境
  _isWeixin: isWeixin(),
  // 是否是在app环境
  _isInApp: isInApp()
};
