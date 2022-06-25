import { toDouble, formateDate } from '@/libs/utils';
const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
export default {
  // 转发时间戳为YYYY-MM-DD格式
  FilterTimeStampToDay (val) {
    if (!verifyDate(val)) return '/';
    const { Year, Month, Day } = getDateObj(val);
    return `${Year}-${Month}-${Day}`;
  },
  // 转发时间戳为 YYYY年MM月DD日 格式
  FilterTimeStampToStringDay (val) {
    if (!verifyDate(val)) return '/';
    const { Year, Month, Day } = getDateObj(val);
    return `${Year}年${Month}月${Day}日`;
  },
  // 转发时间戳为 YYYY年MM月DD日 格式
  FilterTimeStampToMonthDay (val) {
    if (!verifyDate(val)) return '/';
    const { Month, Day } = getDateObj(val);
    return `${Month}月${Day}日`;
  },
  // 转发时间戳为YYYY.MM.DD格式
  FilterTimeStampToDayPoint (val) {
    if (!verifyDate(val)) return '/';
    const { Year, Month, Day } = getDateObj(val);
    return `${Year}.${Month}.${Day}`;
  },
  // 转发时间戳为YYYY/MM/DD格式
  FilterTimeStampToDaySlash (val) {
    if (!verifyDate(val)) return '';
    const { Year, Month, Day } = getDateObj(val);
    return `${Year}/${Month}/${Day}`;
  },
  // 转化时间戳为YYYY-MM-DD HH:MM:SS格式
  FilterTimeToDate (val) {
    if (!verifyDate(val)) return '/';
    const { Year, Month, Day, Hour, Minute, Second } = getDateObj(val);
    return `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;
  },
  // 转化时间戳为YYYY.MM.DD HH:MM格式
  FilterTimeToMinute (val) {
    if (!verifyDate(val)) return '/';
    const { Year, Month, Day, Hour, Minute } = getDateObj(val);
    return `${Year}.${Month}.${Day} ${Hour}:${Minute}`;
  },
  // 转化时间戳为YYYY.MM.DD格式
  FilterTimeToDay (val) {
    if (!verifyDate(val)) return '/';
    const { Year, Month, Day } = getDateObj(val);
    return `${Year}.${Month}.${Day}`;
  },
  // HH:MM:SS
  FilterTimeToTime (val) {
    if (!verifyDate(val)) return '/';
    const { Hour, Minute, Second } = getDateObj(val);
    return `${Hour}:${Minute}:${Second}`;
  },
  // HH:MM
  FilterTimeToMin (val) {
    if (!verifyDate(val)) return '/';
    const { Hour, Minute } = getDateObj(val);
    return `${Hour}:${Minute}`;
  },
  // 转化时间戳为YYYY.MM.DD 星期 HH:MM格式
  FilterTimeToWeekMinute (val) {
    if (!verifyDate(val)) return '/';
    const { Year, Month, Day, Hour, Minute, Week } = getDateObj(val);
    return `${Year}.${Month}.${Day} ${Week} ${Hour}:${Minute}`;
  },
  // 将秒级的时间段转化为XX小时XX分钟XX秒
  FilterChangeTimeToHMS (val) {
    if (!val) {
      return '';
    }
    const allSecond = val;
    let restSecond = val;
    const hour = Math.floor(allSecond / (60 * 60));
    if (hour >= 1) {
      restSecond = restSecond - hour * 60 * 60;
    }
    const minute = Math.floor(restSecond / 60);
    if (minute >= 1) {
      restSecond = Math.round(restSecond - minute * 60);
    }
    return `${hour >= 1 ? hour + '小时 ' : ''}${minute >= 1 ? minute + '分钟 ' : ''}${restSecond > 0 ? restSecond + '秒' : ''}`;
  },
  // 将秒级的时间段转化为XX:XX:XX
  FilterTimeToHMS (val) {
    if (val === 0 || val === '0') {
      return '00:00';
    } else if (!val) {
      return '';
    }
    const allSecond = val;
    let restSecond = val;
    const hour = Math.floor(allSecond / (60 * 60));
    if (hour >= 1) {
      restSecond = restSecond - hour * 60 * 60;
    }
    const minute = Math.floor(restSecond / 60);
    if (minute >= 1) {
      restSecond = Math.round(restSecond - minute * 60);
    }
    return `${hour >= 1 ? hour + ':' : ''}${minute >= 1 ? minute + ':' : ''}${restSecond > 0 ? restSecond + '' : ''}`;
  },
  // 金额单位 分改为元
  FilterKeepTwoDigitsPrice (val) {
    if (isNaN(val)) {
      return 0;
    }
    return (val / 100).toFixed(2);
  },
  // 金额 保留两位小数
  FilterToTwoDigitsPrice (val) {
    if (isNaN(val)) {
      return 0;
    }
    return val.toFixed(2);
  },
  // 金额 三位一个逗号
  FilterPriceToCurrency (sMoney) {
    if (sMoney && sMoney !== undefined) {
      sMoney = String(sMoney);
      let left = sMoney.split('.')[0];
      let right = sMoney.split('.')[1];
      right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
      let temp = left
        .split('')
        .reverse()
        .join('')
        .match(/(\d{1,3})/g);
      return (
        (Number(sMoney) < 0 ? '-' : '') +
        temp
          .join(',')
          .split('')
          .reverse()
          .join('') +
        right
      );
      // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    } else if (sMoney === 0) {
      return '0.00';
    } else {
      return '';
    }
  },
  /**
 * 格式化时间戳为 MM月DD日 格式（Vue.filter）
 */
  FilterTimeToMonthDate (time) {
    const { Month, Day } = getDateObj(time);
    return `${Month}月${Day}日`;
  },
  // 时间格式化 时分秒
  getTimeHMS (second) {
    var duration = '00:00';
    var hours = Math.floor((second % 86400) / 3600);
    var minutes = Math.floor(((second % 86400) % 3600) / 60);
    var seconds = Math.floor(((second % 86400) % 3600) % 60);
    if (hours > 0) duration = `${toDouble(hours)}:${toDouble(minutes)}:${toDouble(seconds)}`;
    else if (minutes > 0) duration = `${toDouble(minutes)}:${toDouble(seconds)}`;
    else if (seconds > 0) duration = `00:${toDouble(seconds)}`;
    return duration;
  },
  // 时间格式化 时分秒
  getTimeStrHMS (second) {
    var duration = '00分00秒';
    var hours = Math.floor((second % 86400) / 3600);
    var minutes = Math.floor(((second % 86400) % 3600) / 60);
    var seconds = Math.floor(((second % 86400) % 3600) % 60);
    if (hours > 0) duration = `${toDouble(hours)}时${toDouble(minutes)}分${toDouble(seconds)}秒`;
    else if (minutes > 0) duration = `${toDouble(minutes)}分${toDouble(seconds)}秒`;
    else if (seconds > 0) duration = `00分${toDouble(seconds)}秒`;
    return duration;
  },
  countDown (startTime, endTime) {
    if (!endTime) return '';
    var shenyu = endTime - startTime; // 倒计时毫秒数
    var day = parseInt(shenyu / (60 * 60 * 24 * 1000));// 转换为天
    var D = parseInt(shenyu) - parseInt(day * 60 * 60 * 24 * 1000);// 除去天的毫秒数
    var hour = parseInt(D / (60 * 60 * 1000));// 除去天的毫秒数转换成小时
    var H = D - hour * 60 * 60 * 1000;// 除去天、小时的毫秒数
    var minute = parseInt(H / (60 * 1000));// 除去天的毫秒数转换成分钟
    var second = parseInt((shenyu - day * 60 * 60 * 24 * 1000 - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000); // 除去天、小时、分的毫秒数转化为秒
    return {
      day: verifyCountDown(day),
      hour: verifyCountDown(hour),
      hourMultiplyDay: verifyCountDown(+hour + (+day * 24)),
      minute: verifyCountDown(minute),
      second: verifyCountDown(second)
    };
  },
  formatPostTime (millis) {
    let ONE_MINUTES_INTERVAL = 1000 * 60;
    let ONE_HOUR_INTERVAL = 1000 * 60 * 60;
    let ONE_DAY_INTERVAL = 1000 * 60 * 60 * 24;
    // let ONE_YEAR_INTERVAL = 1000 * 60 * 60 * 24 * 365;
    let nowTime = new Date().getTime();
    let timeInterval = nowTime - millis;

    if (timeInterval < ONE_MINUTES_INTERVAL) {
      return '刚刚';
    } else if (timeInterval < ONE_HOUR_INTERVAL) {
      // 更新时间1小时内的，以分为最小时间单位，如1分钟前；
      return Math.floor(timeInterval / 1000 / 60 === 0 ? 1 : timeInterval / 1000 / 60) + '分钟前';
    } else if (timeInterval < ONE_DAY_INTERVAL && millis < nowTime && millis > nowTime - ONE_DAY_INTERVAL) {
      // 1小时以上并且当天发布，以小时为最小单位，如21:59 ；
      return formateDate(millis, 'hh:mm');
    } else if (new Date(millis).getFullYear() === new Date().getFullYear()) {
      let timeDay = new Date(millis).getDate();
      let newDate = new Date().getDate();
      if (timeDay > newDate - 2 && timeDay === newDate - 1) {
        console.log(new Date(millis));
        // 1小时以上并且昨天发布，如昨天 12:35；
        return '昨天 ' + formateDate(millis, 'hh:mm');
      } else {
        // 昨天之前，当前年
        return formateDate(millis, 'MM月dd日');
      }
    } else {
      // 不是当前年
      return formateDate(millis, 'yyyy年MM月dd日');
    }
  }
};

function verifyCountDown (t) {
  if (t < 0) {
    t = 0;
  }
  return two(t);
}

function verifyDate (val) {
  if (Number(val) < 0) {
    return false;
  }
  if (isNaN(val) || val === 0) {
    return false;
  } else if (val === null) {
    return false;
  }
  return true;
}

function two (num) {
  return num < 10 ? '0' + num : num;
}

function getDateObj (val) {
  let date = new Date(val);
  const Year = `${date.getFullYear()}`;
  const Month = `${two(date.getMonth() + 1)}`;
  const Day = `${two(date.getDate())}`;
  const Hour = `${two(date.getHours())}`;
  const Minute = `${two(date.getMinutes())}`;
  const Second = `${two(date.getSeconds())}`;
  const Week = weekday[date.getDay()];
  return { Year, Month, Day, Hour, Minute, Second, Week };
}
