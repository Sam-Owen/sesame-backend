var macd = (new function () {

    var ef = constant.MACD_EMA_FAST, es = constant.MACD_EMA_SLOW,
        dea = constant.MACD_DEA, dif = constant.MACD_DIF, bar = constant.MACD_BAR;

    this.fast = 12; //快线移动平均
    this.slow = 26; //慢线移动平均
    this.avg = 9; //移动平均

    this.setting = function (fast, slow, avg) {
        this.fast = fast;
        this.slow = slow;
        this.avg = avg;
    };

    this.init = function (data) {
        var e, i, l = data.length;
        for (i = 0; i < l; i++) {
            e = data[i];
            this.setEMA(e, this.fast, ef);
            this.setEMA(e, this.slow, es);
            this.setDIF(e);
            this.setDEA(e);
            this.setBAR(e);
        }
    };

    /**
     * EMA（12）= 前一日EMA（12）×11/13＋今日收盘价×2/13(首日用收盘价)
     * EMA（26）= 前一日EMA（26）×25/27＋今日收盘价×2/27 (首日用收盘价)
     * DIFF=今日EMA（12）- 今日EMA（26）(首日0)
     * DEA（MACD）= 前一日DEA×8/10＋今日DIF×2/10 (首日0)
     * BAR=2×(DIFF－DEA)
     */

    this.setEMA = function (e, day, ema) {
        if (!!e.pre[ema]) {
            e[ema] = e.pre[ema] * (day - 1) / (day + 1) + e[constant.BASE_ATTR_CLOSE] * 2 / (day + 1);
            e[ema] = e[ema].toFixed(constant.FIX_NUM);
        } else {
            e[ema] = e[constant.BASE_ATTR_CLOSE];
        }
    };

    this.setDIF = function (e) {
        e[dif] = e[ef] - e[es];
        e[dif] = e[dif].toFixed(constant.FIX_NUM);
    }

    this.setDEA = function (e) {
        if (!!e.pre[dea] || e.pre[dea] === 0) {
            e[dea] = e.pre[dea] * 0.8 + e[dif] * 0.2;
            e[dea] = e[dea].toFixed(constant.FIX_NUM);
        } else {
            e[dea] = 0;
        }
    }

    this.setBAR = function (e) {
        e[bar] = 2 * (e[dif] - e[dea]).toFixed(constant.FIX_NUM);
    }


    this.dWay = function (data) {
    };

    // kdj.j每次突破新高的后续涨幅
    this.jWay = function (data) {
    };
});