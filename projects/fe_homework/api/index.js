import http from '@/http';
let api = {
  lxBlink (name, params, value) {
    try {
      MtaH5 &&
        MtaH5.clickStat(name, {
          [params]: 'true',
          msg: JSON.stringify(value)
        });
    } catch (error) {
      MtaH5 &&
        MtaH5.clickStat('error', {
          msg: JSON.stringify(error)
        });
      console.log(error);
    }
  },
  upload (option = {}, fnModel = null, headers = {}) {
    return http(
      {
        url: '/fs/v1/upload',
        method: 'post',
        headers,
        ...option
      },
      fnModel
    );
  },
};

export default api;
