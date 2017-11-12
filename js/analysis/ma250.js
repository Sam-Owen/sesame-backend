/**
 * 最初只是有一个想法，或者叫原始策略
 * 通过分析验证这个想法
 * 验证通过后形成可执行的策略
 *
 * 均线突破策略分析
 */

let constant = require('../common/constant')
let util = require('../common/util')

let strategy = {
    sl: -10,
    tp: 59,
    stopDate: 63,
    buy: function (e) {
        let maCycle = constant.MA + 250;

        if (e[constant.BASE_ATTR_CLOSE] >= e[maCycle] &&
            e.pre[constant.BASE_ATTR_CLOSE] < e.pre[maCycle] /*突破年线*/ &&
            e[maCycle] <= e.pre[maCycle] /*年线还处于下行趋势*/
            //&& e[constant.MA + 500] <= e.pre[constant.MA + 500] /*2年线还处于下行趋势*/
            &&
            e[maCycle] >= e[constant.MA + 5] &&
            e[maCycle] >= e[constant.MA + 10] &&
            e[maCycle] >= e[constant.MA + 20] &&
            e[maCycle] >= e[constant.MA + 60] &&
            e[maCycle] >= e[constant.MA + 120] /*年线压制其它均线*/
        ) { /*再加个一阳穿三线？*/

            //标记
            e.mark = {
                analysis: 'ma250'
            };

            //调整时间
            let adjustmentDays = getDays(e, maCycle);

            let isBuy = util.rollDay(e.pre, -adjustmentDays, function (e, lastReturn) {
                // 递规结束条件，如果递归返回值是布尔值，需要使用undefined。建议统一使用undefined
                if (lastReturn === undefined) {
                    return !(e.mark && e.mark.analysis === 'ma250');
                }
                return !(e.mark && e.mark.analysis === 'ma250') && lastReturn;
            });

            return isBuy;
        }
    }
};


function execute(data, ma) {

    let buys = [],
        r = [],
        maCycle = constant.MA + ma;

    for (let i = 0, l = data.length; i < l; i++) {
        let e = data[i];
        // e.time = new Date(e.time).toLocaleDateString();
        if (strategy.buy(e)) { /*再加个一阳穿三线？*/
            let mas = [e[constant.MA + 5], e[constant.MA + 10], e[constant.MA + 20], e[constant.MA + 60], e[constant.MA + 120]];
            let buy = {
                //买点
                buy: e.time,
                //最大盈利率
                maxProfit: "",
                //等待亏损率，最大盈利之前的亏损率
                wait: "",
                //最大亏损率，最大盈利之前的亏损率
                maxLosses: "",
                //最大回撤率，最大盈利以后的亏损率
                maxRetracement: "",
                //均线密度
                maDensity: util.array.standardDeviation(mas),
                //达到最大盈利率所需要的天数
                maxProfitDays: "",
                //调整时间和涨幅的比例
                timeToProfit: ""
            };


            //每天的涨跌幅度计数
            let amps = [0];

            //调整时间
            let adjustmentDays = getDays(e, maCycle);

            for (let j = 1; j <= (adjustmentDays < ma ? ma : adjustmentDays); j++) {
                let nextN = util.getDayByDay(e, j);
                amps.push(+util.getAmp(e, nextN));
            }

            let temp = amps.concat([]);
            buy.maxProfit = temp.sort(function (a, b) {
                return b - a; //倒序
            })[0];

            buy.timeToProfit = (adjustmentDays / buy.maxProfit).toFixed(2) + " / " + adjustmentDays;

            buy.maxLosses = temp.slice(-1)[0];

            buy.maxProfitDays = amps.indexOf(buy.maxProfit);

            let waitPeriod = amps.slice(0, buy.maxProfitDays);
            buy.wait = waitPeriod.sort(function (a, b) {
                return a - b; //顺序
            })[0];

            let retracementPeriod = amps.slice(buy.maxProfitDays);
            buy.maxRetracement = retracementPeriod.sort(function (a, b) {
                return a - b; //顺序
            })[0];

            buys.push(buy);
        }
    }
    return buys;
    return filter(buys);
}

// 从当天开始往前取年线连续下跌的持续时间
function getDays(e, maCycle) {
    if (!e || !e.pre || (e[maCycle] > e.pre[maCycle])) {
        return 0;
    } else {
        return 1 + getDays(e.pre, maCycle);
    }
}

function filter(buys) {
    let density = [],
        result = [];
    //计算附合条件的均线密平均数
    for (let i = 0, l = buys.length; i < l; i++) {
        let buy = buys[i];
        if (buy.maxProfit > 100) {
            density.push(buy.maDensity);
        }
    }
    let avg = util.array.geometricMean(density);
    //通过平均数过滤
    for (let i = 0, l = buys.length; i < l; i++) {
        let buy = buys[i];
        if (buy.maDensity < avg) {
            result.push(buy);
        }
    }
    return result;
}

//合计
function total(buys) {
    for (let i = 0, l = buys.length; i < l; i++) {
        //let buy = buys[i];

        let buy = {
            //买点
            buy: e.time,
            //最大盈利率
            maxProfit: "",
            //等待亏损率，盈利之前的亏损率
            wait: "",
            //最大亏损率，盈利之前的亏损率
            maxLosses: "",
            //最大回撤率，盈利以后的回撤率
            maxRetracement: "",
            //均线密度
            maDensity: util.array.standardDeviation(mas),
            //达到最大盈利率所需要的天数
            maxProfitDays: "",
            //调整时间和涨幅的比例
            timeToProfit: ""
        };
    }
}

module.exports = {
    execute,
    strategy
}