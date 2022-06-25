<template lang="pug">
  Popup(
    v-model="show"
    position="bottom"
    :overlay="!needHandlerSlidingBlock"
    :round="!fullScreen"
    :close-on-click-overlay="false"
    :style="{ height: fullScreen ? '100%' : 'auto' }"
  )
    #Login.bg-white.text-center.login_content(
      ref="login"
      :class="fullScreen ? 'fullScreen' : ''"
      @click="clickContent"
    )
      p.fs-20.color-1313.pt-30.fw-800 {{title}}
      .ml-35.mr-35.text-right.pst-rlt.fs-16
        input.dspl-bl.color-1313.input.tel(
          type="tel"
          pattern="[0-9]*"
          maxlength=11
          v-model="oUser.mobile"
          placeholder="请输入手机号"
          @blur="inputBlur"
        )
        .pst-rlt.fs-16.tw-flex
          input.tw-flex-1.rounded-0.color-1313.input.code(
            type="tel"
            pattern="[0-9]*"
            maxlength=6
            v-model="oUser.code"
            placeholder="请输入验证码"
            @blur="inputBlur"
          )
          .code_btn.tw-text-base.ml-10.text-center(
            v-if='bIsSendVerifyCode && bIsVerifyType === 0'
          ) {{nCountdown}} s后获取
          .code_btn.tw-text-base.ml-10.text-center(
            v-else
            :class="bCanSendVerify ? themeBgClassName : ''"
            @click='!bIsSendVerifyCode ? fnSendVerifyCode(0) : ""'
          ) {{codeBtnText}}
        .user-agreement.tw-float-left
          checkbox(v-model="agreement" :checked-color='themeColor' shape="square")
            label.tw-text-sm 我同意
            span.tw-text-sm(@click.stop='toViewAgreement' :class='themeClassName') 《用户使用协议》
        span.voice-verify-code.tw-text-sm.disable(
          v-if='bIsSendVerifyCode && bIsVerifyType === 1'
        ) 注意接听电话（{{nCountdown}}s）
        span.voice-verify-code.tw-text-sm(
          v-else
          @click='!bIsSendVerifyCode ? fnSendVerifyCode(1) : ""'
        ) 语音验证码
        .login-btn.dspl-bl.tw-text-center.w-305.h-50.fs-17.rounded-27.border-0.color-white.fs-20(
          :class='[bCanClickLogin ? themeBgClassName : ""]'
          @click="submitFn"
        ) {{btnText}}
      .fs-0.w-33.h-33.pst-absl.r-19.t-19.border-0.close(v-if='!fullScreen' @click="closeBtnFn")
    AwscCode(ref="awsccode" @hide="needHandlerSlidingBlock=false")
</template>

<script>
import { Toast, Popup, checkbox } from 'vant';
import apis from '@/api';
import { isWeixin, isQQ, getUrlParams } from '@/libs/client';
import events from '@/libs/events';
import { getStorage } from '@/libs/storage';
import AWSCCODE from '@/libs/awsc-code';
import AwscCode from './AwscCode';
import Cookies from 'js-cookie';
const countdown = 60;
export default {
  components: {
    Popup,
    checkbox,
    AwscCode
  },
  data () {
    return {
      show: false, // 展示登录组件
      smsToken: '', // 短信smsToken
      nCountdown: countdown, // 倒计时
      bIsVerifyType: 0, // 验证码类型；0：验证码；1：语音验证码
      countdownTimer: null, // 验证码定时器
      nickName: '', // 用户微信昵称
      headImgUrl: '', // 用户微信头像
      fullScreen: false, // 是否全屏
      needBind: false, // 是否需要绑定手机号（业务调用传入）
      agreement: false, // 是否勾选同意了用户协议
      registerChannel: null, // 注册渠道
      oUser: { // 手机号和验证码输入信息
        mobile: '',
        code: ''
      },
      title: '登录', // 登录组件标题
      btnText: '登录', // 登录按钮文案
      codeBtnText: '发送验证码',
      themeType: '', // 主题类型；zk:中考（默认）；gk：高考；activity: 活动
      themeColors: { // 主题对应颜色
        zk: '#31C165',
        gk: '#0099FF',
        activity: '#FF4B33'
      },
      // 是否需要显示阿里云二次滑块验证
      needHandlerSlidingBlock: false
    };
  },
  computed: {
    // 是否可发送验证码
    bCanSendVerify () {
      return /^[1]([3-9])[0-9]{9}$/.test(this.oUser.mobile) && this.nCountdown === countdown && !this.needHandlerSlidingBlock;
    },
    // 是否可以触发登录
    bCanClickLogin () {
      const { mobile, code } = this.oUser;
      return /^[1]([3-9])[0-9]{9}$/.test(mobile) && /^[0-9]{6}$/.test(code);
    },
    // 是否已经发送了验证码（倒计时未结束）
    bIsSendVerifyCode () {
      return this.nCountdown >= 0 && this.nCountdown < countdown;
    },
    // 主题色
    themeColor () {
      return this.themeColors[this.themeType];
    },
    // 主题色类名
    themeClassName () {
      return `theme-color-${this.themeType}`;
    },
    // 背景主题色类名
    themeBgClassName () {
      return `theme-bg-color-${this.themeType}`;
    }
  },
  created () {
    // 初始化阿里云短信防刷
    AWSCCODE.initAWSC();
  },
  mounted () {
    // 如果传入主题、以传入为准
    if (this.themeType) return;
    /**
     * 中考or高考：现兼融转介绍依靠business区分，其他模块按照client区分
     * 应统一为business区分（待更改涉及端：crm布置作业链接(已修改)、年度学习报告）
     * */
    const { business, client } = getUrlParams();
    if (!client && !business || // 默认为中考
        (client === 'JUNIOR_TEACH' || client === 'zk') || // 旧字段
        business === 'junior') { // 新字段
      this.themeType = 'zk';
    } else {
      this.themeType = 'gk';
    }
  },
  methods: {
    closeBtnFn (e) {
      e.stopPropagation();
      this.close();
      events.emit('loginCancel');
    },
    close () {
      this.show = false;
      this.oUser.code = '';
      this.oUser.mobile = '';
      this.nCountdown = countdown;
      clearInterval(this.countdownTimer);
      setTimeout(() => {
        const login = document.querySelector('#Login');
        login.parentNode.removeChild(login);
      }, 300);
    },
    clickContent (e) {
      e.stopPropagation();
      this.show = true;
    },
    async fnSendVerifyCode (type = 0, awscCode) {
      if (!this.bCanSendVerify) { // 不合法不可点
        return;
      }
      this.bIsVerifyType = type;
      const noTraceCode = awscCode || await AWSCCODE.fetchNVCValAsync();
      const query = {};
      if (type === 0) {
        query.mobile = this.oUser.mobile;
        query.noTraceCode = noTraceCode;
      } else {
        query.rqbd = this.oUser.mobile;
      }
      let res = null;
      if (type === 0) {
        res = await apis.sendCodeV3(query);
        AWSCCODE.processNVCValAsync(res, {
          nccb: async () => {
            this.needHandlerSlidingBlock = true;
            this.$refs.awsccode.show();
            await this.$nextTick();
          },
          successcb: async (traceCode) => {
            this.needHandlerSlidingBlock = false;
            this.$refs.awsccode.hide();
            this.fnSendVerifyCode(type, traceCode);
          }
        });
      }
      if (type === 1) {
        res = await apis.sendVoiceCode(query);
      }
      // rpco 是旧的语音验证码响应格式
      if (res.code === 0 || res.rpco === 200) {
        this.fnBsnCountdown();
        Toast('发送验证码成功');
        this.smsToken = res.data ? res.data.smsToken : res.rpbd.smsToken;
      } else {
        type !== 0 && res.msg && Toast(res.msg);
      }
    },
    // 阿里云二次验证通过
    twiceVerifyCb (awscCode) {
      setTimeout(() => {
        this.needHandlerSlidingBlock = false;
      }, 1500);
      this.fnSendVerifyCode(0, awscCode);
    },
    fnBsnCountdown () {
      this.countdownTimer = setInterval(() => {
        let nMinutes = this.nCountdown;
        if (nMinutes <= 0) {
          clearInterval(this.countdownTimer);
          this.codeBtnText = '重新获取';
          this.nCountdown = countdown;
        } else {
          this.nCountdown = this.nCountdown - 1;
        }
      }, 1000);
    },
    submitFn (e) {
      // 同意用户协议
      if (!this.agreement) {
        Toast('请先同意《用户使用协议》');
        return;
      }
      // 点登录时不走登录流程、仅回传手机号和验证码数据
      if (this.isComesBackData) {
        this.comesBackData(e);
        return;
      }
      // 登录 是否需要微信绑定登录
      if (isWeixin() && this.isAuthorization) {
        // 微信绑定
        this.wxBindLogin();
        return false;
      } else {
        // 浏览器手机号登录
        this.login();
      }
    },
    // 回传手机号和验证码
    comesBackData (e) {
      if (!this.bCanClickLogin) {
        Toast('请输入正确的手机号和验证码！');
        return;
      }
      const { mobile, code } = this.oUser;
      events.emit('loginSuccess', {
        mobile,
        code,
        smsToken: this.smsToken || ''
      });
      e.stopPropagation();
      // 业务调用决定是否关闭登录组件
      events.on('loginClose', () => {
        this.close();
      });
    },
    /**
     * 浏览器手机号登录
     */
    login () {
      const { mobile, code } = this.oUser;
      const { smsToken } = this;
      let { channel, sellerId, inviteCode } = getUrlParams();
      if (this.bCanClickLogin) {
        apis.mobileRegistAndLogin({
          rqbd: {
            smsToken,
            mobile,
            code,
            channel: this.registerChannel || channel,
            employeeId: sellerId,
            inviteCode
          }
        }).then(res => {
          if (res.rpco === 200) {
            const { leid: leId, nick: nickName, grad, himg: portrait, isFirstTimeLogin } = res.rpbd;
            const { lgtk: token } = res;
            import('@p/' + __project__ + '/store').then(async store => {
              store.default.commit('userInfo/updateUserInfo', {
                leId,
                token,
                nickName,
                grad,
                portrait,
                phone: mobile,
                did: '123456789012345',
                loginType: 'mobile',
                isFirstTimeLogin
              });
              this.close();
              // 兼容引流课
              localStorage.setItem('userInfo', JSON.stringify(res.rpbd));
              events.emit('loginSuccess');
            });
          }
        });
      } else {
        Toast('请输入正确的手机号和验证码！');
      }
    },
    // 微信绑定手机号登录
    async wxBindLogin () {
      const { code, mobile } = this.oUser;
      const { smsToken } = this;
      let { channel, sellerId, inviteCode } = getUrlParams();
      const query = {
        code: code,
        openToken: getStorage('opentk'),
        smsToken,
        channel: this.registerChannel || channel,
        employeeId: sellerId,
        inviteCode
      };
      if (this.bCanClickLogin) {
        const res = await apis.wxBindLogin(query);
        if (res.rpco === 200) {
          const { leid: leId, nick: nickName, grad, himg: portrait, isFirstTimeLogin } = res.rpbd;
          const { lgtk: token } = res;
          import('@p/' + __project__ + '/store').then(async store => {
            store.default.commit('userInfo/updateUserInfo', {
              leId,
              token,
              nickName,
              grad,
              portrait,
              phone: mobile,
              did: '123456789012345',
              isBindWx: true,
              isBandPhone: true,
              loginType: 'wx',
              isFirstTimeLogin
            });
            // 兼容引流课
            localStorage.setItem('userInfo', JSON.stringify(res.rpbd));
            // 旧引流课支付需要openId
            Cookies.set('openId', res.rpbd.thirdAccount, { expires: 28 });
            sessionStorage.setItem('openId', res.rpbd.thirdAccount);
            this.close();
            events.emit('loginSuccess');
          });
        }
      }
    },
    toViewAgreement () {
      if (this.themeType === 'zk') {
        window.location.href = 'https://xxxx.html';
      } else {
        window.location.href = 'https://xxxx.html';
      }
    },
    inputBlur () {
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight, 0));
      }, 100);
    }
  }
};
</script>

<style lang="scss" scoped>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  .van-popup--round{
    border-radius: 0.15rem 0.15rem 0 0;
  }
  .login_content{
    width:100% ;
    border-radius: 13px 13px 0 0;
    padding-bottom: 0.4rem;
    height: auto;
    &.fullScreen{
      border-radius: 0;
    }
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    color:#B5B5B5;
    font-size: 0.14rem;
  }
  .tel{
    border:0;
    margin:0.25rem 0 0.15rem 0;
  }
  .code{
    -webkit-user-select:auto;
    border: 0;
    margin-bottom: .2rem;
  }
  .input{
    width: 100%;
    height: 0.42rem;
    line-height: 0.24rem;
    padding: 0 0.2rem;
    background: #F8F8F8;
    border-radius: 0.08rem;
    box-sizing: border-box;
  }
  // 验证码按钮
  .code_btn{
    width: 1rem;
    height: 0.42rem;
    line-height: 0.42rem;
    background: #D7D7D7;
    border-radius: 0.08rem;
    color: #FFF;
    box-shadow: none!important;
  }
  // 登录按钮
  .login-btn{
    height: 0.46rem;
    line-height: 0.46rem;
    margin-top: 0.5rem;
    border-radius: 0.23rem;
    background: #D7D7D7;
    color: #FFF;
    box-shadow: none;
  }
  // 用户协议（复选框）
  /deep/ .van-checkbox__icon .van-icon{
    width: 0.15rem;
    height: 0.16rem;
    margin-top: 0.02rem;
    line-height: 0.15rem;
    font-size: 0.12rem;
    border-radius: 0.03rem;
  }
  // 语音验证码
  .voice-verify-code{
    color: #666666;
    text-decoration:underline;
    margin-top:0.05rem;
    float: right;
    &.disable{
      color: #999999;
    }
  }
  .close{
    background:url('../../assets/images/close.png') no-repeat center;
    background-size:0.14rem 0.14rem;
  }
  // 通用类
  .border-0{
    border:0;
  }
  .bg-ee{
    background: #ccc;
  }
  .color-1313{
    color:#131313;
  }
  .fw-800{
    font-weight:800;
  }
  // 主题色(中考、高考、活动类)
  .theme-color-zk{
    color: #31C165;
  }
  .theme-color-gk{
    color: #0099FF;
  }
  .theme-color-activity{
    color: #FF4B33;
  }
  // 背景主题色(中考、高考、活动类)
  .theme-bg-color-zk{
    background:linear-gradient(to right, #31C165, #42CA8C);
    box-shadow: 0px 0.03rem 0.1rem 0 rgba(23, 198, 96, 0.3);
    color: #FFF;
  }
  .theme-bg-color-gk{
    background: linear-gradient(to top right, #0099FF, #4CB7FF);
    box-shadow: 0px 0.03rem 0.1rem 0 rgba(0, 153, 255, 0.3);
    color: #FFF;
  }
  .theme-bg-color-activity{
    background: linear-gradient(360deg, #FB3F38 0%, #FF523B 100%);
    box-shadow: 0px 0.03rem 0.1rem 0 rgba(255, 41, 41, 0.3);
    color: #FFE7CB;
  }
</style>
