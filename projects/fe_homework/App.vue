<template lang="pug">
  #app
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  computed: {
    ...mapState({
      userInfo (state) {
        return state.userInfo;
      }
    })
  },
  watch: {
    userInfo: {
      handler (userInfo) {
        this.FE_LOG_INIT(userInfo.userId, userInfo.leId);
      },
      immediate: true
    }
  },
  mounted () {
    // 全局监听代码运行时错误
    window.onerror = (error) => {
      this.FE_LOG('globalError', error);
    };
  },
  methods: {

  },
  // 子自组件生命周期代码运行错误
  errorCaptured (err, vm, info) {
    this.FE_LOG('globalErrorCaptured', err.toString());
  }
};
</script>
<style lang="scss" scoped>
#app {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #2c3e50;
  font-size: .14rem;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
