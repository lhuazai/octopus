// rem等比适配配置文件
// 基准大小
const baseSize = 100; // 注意此值要与 .postcssrc.js 文件中的 rootValue保持一致
// 设置 rem 函数
function setRem (baseVal) {
  // 当前页面宽度相对于1440宽的缩放比例，可根据自己需要修改, 一般设计稿都是宽1440(图方便可以拿到设计图后改过来)。
  const cw = document.documentElement.clientWidth;
  const scale = cw / (baseVal || 1440);
  // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px';
}
// 初始化
setRem();
// 以便动态设置
window.setRem = setRem;
