let constant = require('../common/constant')

global.util = (new function () {
  // 递规取 前、后X天的值（可选参数withToday可定义是否包含当天，默认包含）
  this.rollDay = function (e, day, processFun, withToday) {
    if (withToday === undefined) {
      withToday = true;
    }

    if (day > 0 && !!withToday) {
      day--;
    } else if (day < 0 && !!withToday) {
      day++;
    }
    return this.rollDayWithoutToday(e, day, processFun);
  };

  // 递规取 前、后X天的值（不包含当天）
  this.rollDayWithoutToday = function (e, day, processFun) {
    var lastReturn;
    if (day > 0 && !!e.next) {
      // 后X天
      lastReturn = this.rollDayWithoutToday(e.next, day - 1, processFun);
      return processFun(e, lastReturn);
    } else if (day < 0 && !!e.pre) {
      // 前X天
      lastReturn = this.rollDayWithoutToday(e.pre, day + 1, processFun);
      return processFun(e, lastReturn);
    } else {
      return processFun(e);
    }
  };

  // 取几天内最低值（包含当天）
  this.getLowest = function (e, day) {
    return this.rollDay(e, day, function (e, lastReturn) {
      // 递规结束条件
      if (!lastReturn) {
        return +e[constant.BASE_ATTR_LOW];
      }
      return +lastReturn < +e[constant.BASE_ATTR_LOW] ? +lastReturn : +e[constant.BASE_ATTR_LOW];
    });
  };

  // 取几天内最高值（包含当天）
  this.getHighest = function (e, day) {
    return this.rollDay(e, day, function (e, lastReturn) {
      // 递规结束条件
      if (!lastReturn) {
        return +e[constant.BASE_ATTR_HIGH];
      }
      return +lastReturn > +e[constant.BASE_ATTR_HIGH] ? +lastReturn : +e[constant.BASE_ATTR_HIGH];
    });
  };

  // 取几天内前后那天的数据（不包含当天）
  this.getDayByDay = function (e, day) {
    return this.rollDay(e, day, function (e, lastReturn) {
      // 递规结束条件
      if (!lastReturn) {
        return e;
      }
      return lastReturn;
    }, false);
  };

  // 取两天的涨幅，以day1为参照
  this.getAmp = function (day1, day2) {
    return +((day2[constant.BASE_ATTR_CLOSE] - day1[constant.BASE_ATTR_CLOSE]) / day1[constant.BASE_ATTR_CLOSE] * 100).toFixed(2);
  };

  // 取两天的间隔交易天数，day1 > day2
  this.getDays = function (day1, day2) {
    if (day1 === day2) {
      return 0;
    } else {
      return 1 + this.getDays(day1.next, day2);
    }
  };

}());

util.array = {
  //标准差
  standardDeviation: function (arr) {
    return Math.pow(this.variance(arr), 0.5).toFixed(2);
  },
  //方差:方差刻画了随机变量的取值对于其数学期望的离散程度。（标准差、方差越大，离散程度越大)
  variance: function (arr) {
    let avg = this.avg(arr);
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += Math.pow(+arr[i] - avg, 2)
    }
    return (1 / arr.length * sum).toFixed(2);
  },
  sum: function (arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += +arr[i];
    }
    return sum;
  },
  avg: function (arr) {
    return (this.sum(arr) / arr.length).toFixed(2);
  },
  // 几何平均数
  geometricMean: function (arr) {
    let sum = 1;
    for (let i = 0; i < arr.length; i++) {
      sum *= +arr[i];
    }
    return Math.pow(sum, 1 / arr.length);
  },
  //通用
  commonGM :function(){

  }
}


module.exports = util
