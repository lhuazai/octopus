import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import {
  ImagePreview,
  Toast,
  Icon,
  Circle
} from 'vant';

// import 'swiper/dist/css/swiper.css';
import '@/plugins/vant/vant.js';
import '@/assets/styles/global.scss';
import './assets/css/define-tag.css';
import '@/assets/styles/atom-common.css';
import '@/plugins/Login';
import './utils/time';
import './utils/Custom';
import mixins from './mixins/index';
import MetaInfo from 'vue-meta-info';
import ua from '@/libs/ua';
import { FE_LOG } from '@/plugins/fe_log';
// import Alloylever from 'alloylever';

Vue.config.productionTip = false;

Vue.use(MetaInfo).use(ImagePreview);
// 埋点统计
Vue.use(Circle).use(Icon);
Vue.use(FE_LOG);
Vue.prototype.$toast = Toast;
// 字体兼容
router.onReady(() => {
  try {
    const sdkUrl = '//xxxx.com/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML';
    const mhchemUrl = '//xxxx.com/mathjax/2.7.5/extensions/TeX/mhchem.js?V=2.7.5';
    // const sdkUrl = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML';
    const loadScriptPromise = mixins.methods._loadScript(sdkUrl);
    const loadMhchemPromise = mixins.methods._loadScript(mhchemUrl);
    fnInitHomework();

    // 设置MathJax解析配置
    function fnInitHomework () {
      loadScriptPromise.then(() => {
        loadMhchemPromise.then(() => {
          if (window.MathJax.Hub) {
            window.MathJax.Hub.Config({
              showProcessingMessages: false, // 关闭js加载过程信息
              messageStyle: 'none', // 不显示信息
              tex2jax: {
                inlineMath: [['\\(', '\\)'], ['$', '$']],
                displayMath: [ ['\\[', '\\]'], ['$$', '$$'] ],
                // skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a'],
                processEscapes: true
              },
              TeX: {
                equationNumbers: { autoNumber: ['AMS'], useLabelIds: true },
                extensions: ['mhchem.js']
              },
              SVG: { linebreaks: { automatic: true }, scale: 85, minScaleAdjust: 40 },
              CommonHTML: { linebreaks: { automatic: true }, scale: 85, minScaleAdjust: 40 }
            });
            window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
          }
        });
      }).catch(() => {});
    }

    /** 设置页面根元素font-size */
    function setRootSize () {
      let width = 375;
      // 重置应用宽度
      if (!ua.isPad()) {
        var clientWidth = document.documentElement.clientWidth;
        if (clientWidth > 640) {
          clientWidth = 640;
        } else if (clientWidth < 320) {
          clientWidth = 320;
        }
      } else {
        clientWidth = document.documentElement.clientWidth;
      }
      // 设置根元素font-size
      var targetFontSize = (clientWidth / width) * 100;
      document.documentElement.style.fontSize = targetFontSize + 'px';
      var actualFontSize = window.getComputedStyle(document.documentElement).fontSize.replace('px', '');
      if (actualFontSize !== targetFontSize) {
        document.documentElement.style.fontSize = targetFontSize * targetFontSize / actualFontSize + 'px';
      }
    }

    function handleFontSize () {
      setRootSize();
      // 初始化字体
      if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
        WeixinJSBridge.on('menu:setfont', function () {
          setRootSize();
        });
      }
    }
    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') === -1) {
      setRootSize();
      return;
    }

    // 设置微信字体不允许缩放
    if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
      handleFontSize();
    } else {
      setRootSize();
    }
  } catch (err) {
    console.error(`err,${err.message}`);
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
