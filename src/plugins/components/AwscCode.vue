<template lang="pug">
  #awsc-code-dialog.text-left
    Popup(v-model="visible" @click-overlay="$emit('hide')" style="width:70%;")
      #awsc-nc-wrap
        p.fs-18.mb-10.fw-600 验证
        p.fs-14 请按下滑块并滑动至最右侧，验证通过后将为您发送验证码
        #awsc-nc(v-if="visible")
</template>

<script>
import { Popup } from 'vant';
export default {
  name: 'AwscCode',
  components: {
    Popup
  },
  props: {
  },
  data () {
    return {
      visible: false
    };
  },
  computed: {},
  watch: {},
  mounted () {},
  async created () {
  },
  methods: {
    show () {
      this.visible = true;
    },
    hide () {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.van-popup{
  border-radius: 5px;
}
#awsc-nc-wrap{
  padding: 0.2rem 0.1rem;
}
/deep/ .el-dialog__body{
  padding-top: 0
}
/deep/ .sm-pop-inner {
  position: static;
  margin-top: 20px;
  .nc_wrapper{
    width: 100%!important;
  }
}
// 防刷二次验证
/deep/ .nc-container .nc_wrapper {
  width: 100%!important;
}
/deep/ .nc-container .nc_scale span{
  height: 34px;
}
</style>
