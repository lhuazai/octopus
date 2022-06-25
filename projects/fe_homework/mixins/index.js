let scriptLoadCount = 2; // 脚本加载失败，重试次数
export default {
  data () {
    return {
      optsMap: {
        '1': 'A',
        '2': 'B',
        '3': 'C',
        '4': 'D',
        '5': 'E',
        '6': 'F',
        '7': 'G',
        '8': 'H'
      }
    };
  },
  methods: {
    _loadScript (url) {
      const that = this;
      scriptLoadCount--;
      return new Promise(function (resolve, reject) {
        if (window.MathJax) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          if (script.readyState) { // IE
            script.onreadystatechange = function () {
              if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                resolve();
              }
            };
          } else { // Others
            script.onload = function () {
              scriptLoadCount = 2;
              resolve();
            };
            script.onerror = function () {
              reject();
              if (scriptLoadCount > 0) {
                console.warn('MathJax script load fail. Try again.');
                that._loadScript(url);
              } else {
                console.warn('MathJax script load fail. Abort load.');
                scriptLoadCount = 2;
              }
            };
          }
          script.src = url;
          document.body.appendChild(script);
        }
      });
    },
    _renderQues (dom) {
      if (window.MathJax && window.MathJax.Hub) {
        this.$nextTick(() => {
          // 如果，不传入第三个参数，则渲染整个document
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, document.getElementById('app')]);
        });
      }
    },
    // 加载外部css文件
    _loadCss (url) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      head.appendChild(link);
    }
  }
};
