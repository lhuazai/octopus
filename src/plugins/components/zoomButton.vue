/*
* 缩放动画效果button按钮
*/
<template lang="pug">
  .zoom-button(
    @touchstart='button_touchstart = true'
    @touchend='button_touchstart = false'
    :class="{'touchstart': button_touchstart}"
  )
   slot(name='button')
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      button_touchstart: false
    };
  },
  computed: {
  }
};
</script>
<style lang="scss">
  .zoom-button{
    &.touchstart{
      transform: scale(0.96);
    }
  };
</style>
