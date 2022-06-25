<template lang="pug">
  .act-end-box
    .end-img(:class="imgClass")
     img(v-if="showBtn" src="./images/act-end.png")
     img(v-else src="./images/blackList.png")
    .end-tips-box
      .tips-one {{ showBtn ? '当前活动已结束' : '你暂时无法参加该活动' }}
      .tips-two(v-if="showTips") {{ tipsTwo }}
    .attention-public-box(v-if="showBtn")
      button.attention-public(type="button" @click="handleClick") {{ btnText }}
</template>

<script>
export default {

  props: {
    tipsOne: {
      type: String,
      default: '当前活动已结束'
    },

    tipsTwo: {
      type: String,
      default: '关注在线公众号，查看最新活动'
    },

    btnText: {
      type: String,
      default: '去关注'
    },

    showTips: {
      type: Boolean,
      default: true
    },

    showBtn: {
      type: Boolean,
      default: true
    },

    imgClass: {
      type: String,
      default: ''
    },

    imgSrc: {
      type: String,
      default: './images/act-end.png'
    }
  },
  data () {
    return {
    };
  },

  methods: {
    handleClick () {
      this.$emit('attention');
    }
  }
};
</script>

<style lang="scss">
  .act-end-box {
    .end-tips-box {
      padding-top: 0.25rem;
      font-size: 0.14rem;
      color: #888;
      line-height: 0.14rem;
      text-align: center;
    }

    .tips-two {
      margin-top: 0.14rem;
    }

    .end-img {
      padding-top: 1.07rem;

      img {
        width: 1.9rem;
        height: 1.9rem;
      }
    }

    .attention-public-box {
      margin-top: 0.45rem;

      .attention-public {
        display: inline-block;
        width: 1.83rem;
        height: 0.44rem;
        line-height: 0.44rem;
        color: #fff;
        font-size: 0.15rem;
        text-align: center;
        border-radius: 0.22rem;
        box-shadow:0 5px 12px 0x rgba(0, 130, 245, 0.1);
        background: #0082f5;
        outline: none;
        border: 0;
      }
    }
  }
</style>
