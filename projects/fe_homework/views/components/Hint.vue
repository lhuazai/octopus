/*
 * 页面预览
 */

<template lang="pug">
  div.hintPageWrap.dspl-flex.flex-column(style="height: 100%" ref="hintPageWrap")
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
  },
  data () {
    return {
      isPreview: false
    };
  },
  computed: {
    ...mapState({
      questionInfo (state) {
        return state.homework.questionInfo;
      }
    })
  },
  watch: {
  },
  created () {
    
  },
  async mounted () {
    // this.computedHeight();
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.hintPage{
  padding:0.15rem;
  box-sizing: border-box;
  border-radius: 0.08rem;
  .hint{
    border-radius: 0.08rem;
    background: #fff;
    height:100%;
    text-align: left;
    padding-left: 0.15rem;
    padding-right:0.15rem;
    position: relative;
    padding-top:.15rem;
    box-sizing: border-box;
    img{
      width:1.3rem;
      height: 1.36rem;
      display: block;
      margin:0 auto;
    }
    .time{
      margin-top:0.15rem;
      font-size:0.15rem;
      color:#131313;
      line-height:0.18rem ;
    }
    span{
      display: block;
      margin-top:0.2rem;
      font-size:0.14rem;
      color:#646464;
      line-height:0.23rem;
    }
  }
  .hint_btn{
    width:2.75rem;
    height: 0.44rem;
    font-size:0.15rem;
    color:#fff;
    position: absolute;
    bottom:0.3rem;
    left:50%;
    transform: translate(-50%,0);
    border-radius: 0.44rem;
    background:linear-gradient(90deg,rgba(70,181,255,1) 0%,rgba(0,153,255,1) 100%);
    border:0;
  }
}

</style>
