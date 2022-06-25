/*
 * 页面预览
 */

<template lang="pug">
  .dspl-bl.main.homework-page.h100
    HintPage
</template>

<script>
import HintPage from './components/Hint';
import { mapState } from 'vuex';
Vue.use(NoticeBar);
export default {
  components: {
    HintPage
  },
  props: {
  },
  data () {
    return {
      
    };
  },
  computed: {
    ...mapState({
      userInfo (state) {
        return state.userInfo;
      }
    })
  },
  watch: {
    $route: {
      handler: function (val, oldval) {
      },
      deep: false // 对象内部的属性监听，也叫深度监听
    }
  },
  created () {
    
  },
  methods: {
    
  }
};
</script>

<style scoped lang="scss">
.main{
  width:100%;
  background:#F2F2F2;
  box-sizing: border-box;
}
</style>

<style lang="scss">
  @import "TextEditorReset";
</style>
