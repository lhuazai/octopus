/*
* 当前组件使用keep-alive被缓存时，记录并在返回时还原滚动元素的位置
* 滚动元素需要在路由的meta对象中被声明
**/
export default {
  activated () {
    if (this.$route.name) {
      document.title = this.$route.name;
    }
    const scrollEle = document.querySelector(this.$route.meta.scrollEle);
    if (scrollEle) scrollEle.scrollTop = this.$route.meta.scrollTop;
  },
  beforeRouteLeave (to, from, next) {
    const scrollEle = document.querySelector(this.$route.meta.scrollEle);
    if (scrollEle) this.$route.meta.scrollTop = scrollEle.scrollTop;
    next();
  }
};
