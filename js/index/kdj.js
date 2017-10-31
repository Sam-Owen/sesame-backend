let constant = require('../common/constant')
let util = require('../common/util')

var kdj = (new function () {
    var kk = constant.KDJ_K,
        dk = constant.KDJ_D,
        jk = constant.KDJ_J;

    this.setting = function () {

    };

    /**
     * 以9日为周期的KD线为例，即未成熟随机值，计算公式为: 9日RSV=（C－L9）÷（H9－L9）×100
     * 公式中，C为第9日的收盘价；L9为9日内的最低价；H9为9日内的最高价。
     * K值=2/3×第8日K值+1/3×第9日RSV
     * D值=2/3×第8日D值+1/3×第9日K值
     * J值=3*第9日K值-2*第9日D值
     * 若无前一日K值与D值，则可以分别用50代替（同花顺是直接取RSV值，这里和同花顺保持一致）
     */
    this.getRSV = function (e) {
        var Ct = e[constant.BASE_ATTR_CLOSE],
            L9 = util.getLowest(e, -9),
            H9 = util.getHighest(e, -9);
        return (Ct - L9) / (H9 - L9) * 100;
    };

    this.init = function (e) {
        var k, d, j, rsv = +this.getRSV(e);
        // preK = e.pre.k || 50, preD = e.pre.d || 50
        if (!e.pre[kk] || !e.pre[dk]) {
            k = j = d = rsv;
        } else {
            k = 0.6667 * e.pre[kk] + 0.3333 * rsv;
            d = 0.6667 * e.pre[dk] + 0.3333 * k;
            j = 3 * k - 2 * d;
        }

        e[kk] = +k.toFixed(constant.FIX_NUM);
        e[dk] = +d.toFixed(constant.FIX_NUM);
        e[jk] = +j.toFixed(constant.FIX_NUM);

        /**
     * kdj.d偏差过大的调试代码
     *
     var a = +(e[dk] && e[dk].toFixed(0));
     var b = +(+e['KDJ.D']).toFixed(0);

     if (a>b && Math.abs(a-b)>5){
			debugger;
		} else if (b<a && Math.abs(b-a)>5){
			debugger;
		}
     **/
    };

    // 20170218分析NI
    // kdj.d大于90的后续涨幅
    this.dWay = function (data) {
        var first = data[0],
            maxK = first[kk],
            maxD = first[kk],
            maxJ = first[kk],
            temp = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var e = data[i];
            maxK = maxK < e[kk] ? e[kk] : maxK;
            maxD = maxD < e[dk] ? e[dk] : maxD;
            maxJ = maxJ < e[jk] ? e[jk] : maxJ;

            if (+e[dk] > 90) {
                temp.push(e);

                for (var j = 1; j <= 20; j++) {
                    var nextN = util.getDayByDay(e, j);
                    console.log("后续" + j + "天涨幅为：" + util.getAmp(e, nextN) + "%");
                }
                console.log(e);
                console.log(nextN);
            }
        }

        console.log(maxK);
        console.log(maxD);
        console.log(maxJ);

        console.log(temp);
    };


    // kdj.j每次突破新高的后续涨幅
    this.jWay = function (data) {
        var first = data[0],
            maxJ = 100,
            temp = [];

        for (var i = 0, l = data.length; i < l; i++) {
            var e = data[i];
            if (maxJ < e[jk]) {
                temp.push(e);
                for (var j = 1; j <= 20; j++) {
                    var nextN = util.getDayByDay(e, j);
                    console.log("后续" + j + "天涨幅为：" + util.getAmp(e, nextN) + "%");
                }
                maxJ = e[jk];

                console.log(e);
                console.log(maxJ);
            }
        }
        console.log(temp);
    };
});

module.exports = kdj;