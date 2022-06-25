/*
 * @Description: 增长项目 pv、uv统计
 */

import getUUID from '@/libs/uuid';
import { getStorage, setStorage } from '@/libs/storage';
import api from '@/api';

export default {
  data () {
    return {
      _reportTimer: null
    };
  },
  mounted () {
    this._reportTimer = setTimeout(() => {
      this.getUUID();
    }, 5000);
  },
  beforeDestroy () {
    clearTimeout(this._reportTimer);
    this._reportTimer = null;
  },
  methods: {
    getUUID () {
      let advertReportUUID = getStorage('advert-report-UUID');
      if (!advertReportUUID) {
        advertReportUUID = getUUID();
        setStorage('advert-report-UUID', advertReportUUID);
      }
      this.saveVisitLogs(advertReportUUID);
    },
    saveVisitLogs (visitorId, orderAmount = '') {
      const url = window.location.href;
      const { advertId } = this.$route.params;
      const secondURLId = this.$route.query.secondUrlId || '';
      api.saveVisitLogs({
        advertId,
        orderAmount,
        secondURLId,
        url,
        visitorId
      });
    }
  }
};
