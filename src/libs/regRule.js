
const regRule = {};
regRule.email = (email) => {
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  return reg.test(email);
};
regRule.userName = (str) => {
  const reg = /^[a-z0-9_-]{3,16}$/; // 用户名
  return reg.test(str);
};
regRule.chineseName = (str) => {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/; // 中文姓名
  return reg.test(str);
};
regRule.mobile = (str) => {
  const reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/; // 手机
  return reg.test(str);
};
regRule.tel = (str) => {
  const reg = /^0[\d]{2,3}-[\d]{7,8}$/; // 固话
  return reg.test(str);
};
regRule.idCard = (str) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; // 身份证
  return reg.test(str);
};
regRule.amount = (str) => {
  const reg = /^([1-9][\d]{0,10}|0)(\.[\d]{1,2})?$/; // 金额(10位整数2位小数)
  return reg.test(str);
};
regRule.positiveInt = (str) => {
  const reg = /^[1-9]*[1-9][0-9]*$/; // 正整数
  return reg.test(str);
};
regRule.int = (str) => {
  const reg = /^-?\d+$/; // 整数(不限位数)
  return reg.test(str);
};
regRule.bankCard = (str) => {
  const reg = /^\d{16}|\d{19}$/; // 16位或19位银行卡或信用卡号(先把空格replace为空串)
  return reg.test(str);
};
regRule.chinese = (str) => {
  const reg = /[\u4e00-\u9fa5]/g; // 判断是不是中文
  return reg.test(str);
};
regRule.noChinese = (str) => {
  const reg = /[^\u4e00-\u9fa5]/g; // 判断不是中文
  return reg.test(str);
};
regRule.decimalNumber = (str) => {
  const reg = /^\d+(\.\d+)+$/; // 判断带小数的数字
  return reg.test(+str);
};
regRule.positiveNumber = (str) => {
  const reg = /([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])/;// 正数
  return reg.test(str);
};
regRule.ip = (str) => {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
  return reg.test(str);
};
regRule.specialChar = (str) => {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9-（）():_\s]+$/; // 中英文字母数字下划线 () （）
  return reg.test(str);
};
regRule.specialCharEn = (str) => {
  const reg = /^[A-Za-z0-9_-]+$/; // 只能是英文数字 下划线 中划线
  return reg.test(str);
};
regRule.domainNam = (str) => {
  const reg = /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)?$/; // 域名验证
  return reg.test(str);
};
regRule.regUrl = (str) => {
  // const reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,162}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,362})+(:\d+)*(\/\w+\.\w+)([?&]\w +=\w*)*$/; // 域名验证
  const reg = /^http:\/\/([\w -]+\.)+[\w-]+(\/[\w -./?%&=]*)?$/; // 域名验证
  return reg.test(str);
};
export default regRule;
