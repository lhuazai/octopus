// import { ENV } from '@/config';
import { getUrlParams, isInApp } from './client';
// import type from './type';
const SENSORS = {
  install: function (Vue) {
    Vue.prototype.sensors = this.sensors;
  },
  sensors: {
    // 默认统计数据
    statisticsData: {
      client: getUrlParams().client,
      tool: isInApp() ? 'app' : 'h5'
    },
    /**
     * @param eventName 事件名称
     * @param statisticsData 统计数据
     * @param params 需要统计url上的参数名称，支持 '' & [] 格式
    */
    track (eventName, statisticsData = {}, params) {
      const projectName = this.getProjectName();
      window._czc && window._czc.push(['_trackEvent', projectName, eventName]);
    },
    // 根据域名判断项目
    projectMap: {
      '/introRebate/': '转介绍',
      '/flow-course/': '引流课'
    },
    getProjectName () {
      const { pathname } = window.location;
      const projectMap = this.projectMap;
      var projectName = '';
      for (let key in projectMap) {
        if (pathname.includes(key)) {
          projectName = projectMap[key];
        }
      }
      return projectName;
    }
  }
};
export default SENSORS;
