(function (para) {
  var p = para.sdk_url; var n = para.name; var w = window; var d = document; var s = 'script'; var x = null; var y = null;
  if (typeof (w['sensorsDataAnalytic201505']) !== 'undefined') {
    return false;
  }
  w['sensorsDataAnalytic201505'] = n;
  w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); }; };
  var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister', 'getAppStatus'];
  for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    x = d.createElement(s);
    y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    x.setAttribute('charset', 'UTF-8');
    w[n].para = para;
    y.parentNode.insertBefore(x, y);
  }
})({
  sdk_url: 'https://cdn.jsdelivr.net/npm/sa-sdk-javascript@1.14.9/sensorsdata.min.js',
  heatmap_url: 'https://cdn.jsdelivr.net/npm/sa-sdk-javascript@1.14.9/heatmap.min.js',
  name: 'sensors',
  server_url: 'https://ana.xxxxx.com/sa',
  heatmap: {
    // 此参数针对预置 $WebClick 事件（包括 quick('trackHeatMap') quick('trackAllHeatMap') 触发的）生效。
    collect_element: function (elementTarget) {
      // 如果这个元素有属性sensors-disable=true时候，不采集。
      return !(elementTarget.getAttribute('sensorsDisable') === 'true');
    }
  }
});
window.sensors.quick('autoTrack');
