let constant = require('../common/constant')
let util = require('../common/util')

// 均线
var ma = (new function () {

    this.MA = [5, 10, 20, 60, 120, 250, 500];

    this.init = function (e) {
        var i, l = this.MA.length;
        for (i = 0; i < l; i++) {
            e[constant.MA + this.MA[i]] = this.getMA(e, this.MA[i]);
        }
    };

    this.setting = function (ma) {
        this.MA = ma;
    }

    this.getMA = function (e, day) {
        return (util.rollDay(e, -day, function (e, lastReturn) {
            // 不足的日均线不予计算
            if (!e[constant.BASE_ATTR_CLOSE]) {
                return "ma";
            }
            // 递规结束条件
            if (!lastReturn) {
                return e[constant.BASE_ATTR_CLOSE];
            }
            return lastReturn + e[constant.BASE_ATTR_CLOSE];
        }) / day).toFixed(2);
    };

    // 20170218分析NI
    // kdj.d大于90的后续涨幅
    this.dWay = function (data) {
    };

    // kdj.j每次突破新高的后续涨幅
    this.jWay = function (data) {
    };
});

module.exports =  ma
