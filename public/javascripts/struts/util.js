var util = (new function () {
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
        return ((day2[constant.BASE_ATTR_CLOSE] - day1[constant.BASE_ATTR_CLOSE]) / day1[constant.BASE_ATTR_CLOSE] * 100).toFixed(2);
    };

}());
