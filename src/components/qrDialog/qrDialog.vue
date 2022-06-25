<template lang="pug">
  .qr-dialog-box(v-if="show")
    .qr-box
      .qr-com-tips {{ qrTips }}
      //- img.qr-img(:src="qrImg")
      vant-image.qr-img(:src="qrImg" lazy-load)
      span.close-btn(@click="handleClose")
</template>

<script>
import { Image } from 'vant';
export default {
  components: {
    vantImage: Image
  },
  props: {
    qrImg: {
      type: String,
      default: ''
    },

    qrTips: {
      type: String,
      default: '长按添加课程老师，邀请您入群'
    },

    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // isShow: false,
    };
  },

  computed: {
    isShow () {
      return this.show;
    }
  },

  created () {},

  methods: {
    handleClose () {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
  .qr-dialog-box {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    background: rgba(0, 0, 0, .85);

    .qr-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .qr-img {
      width: 2.24rem;
      height: 2.24rem;
      border-radius: .08rem;
      touch-action: none;
      -webkit-touch-action: none;
    }

    .qr-com-tips {
      font-size: 0.16rem;
      color: #fff;
      text-align: center;
      line-height: .24rem;
      margin-bottom: 0.24rem;
      white-space: nowrap;
    }

    .close-btn {
      display: inline-block;
      background: url(./images/close_icon.png) no-repeat;
      background-size: 100%;
      width: 0.34rem;
      height: 0.34rem;
      margin-top: 0.24rem;
    }
  }
</style>
