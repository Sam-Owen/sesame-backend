//多策略复盘
/**
 var replay = function(){
	//复盘策略(组合策略)
	this.strategy = [];

	//复盘数据
	this.data;

};
 **/

import constant from '@/components/js/common/constant'
import util from '@/components/js/common/util'

let buy;

//止损
function sl(e) {
  if (util.getAmp(buy, e) <= this.sl) {
    return 'sl';
  }
}

//止盈
function tp(e) {
  if (util.getAmp(buy, e) >= this.tp) {
    return 'tp';
  }
}

//周期截止
function stop(e) {
  if (util.getDays(buy, e) >= this.stopDate) {
    return 'stop';
  }
}

//单策略复盘
export default function replay(data) {
  let r, result = [], totalProfit = 1;

  for (let i = 0, l = data.length; i < l; i++) {
    let e = data[i];
    if ((!r || !r.holdStock) && this.buy(e)) {
      r = {
        buyDate: e[constant.BASE_ATTR_DATE],
        holdStock: true //持股状态
      };
      buy = e;
    }

    if (r && r.holdStock) {
      let sell = sl.call(this, e) || tp.call(this, e) || stop.call(this, e);
      if (sell) {
        r.sellType = sell;
        r.profit = util.getAmp(buy, e);
        r.sellDate = e[constant.BASE_ATTR_DATE];
        r.holdStock = false;
        totalProfit = totalProfit * (1 + r.profit / 100);
        r.totalProfit = (totalProfit * 100).toFixed(2);
        result.push(r);
      }
    }
  }
  return result;
}

function bestStrategy(data) {
  let temp = [];
  for (let i = -10; i >= -50; i--) {//sl
    for (let j = 1; j <= this.tp * 2; j++) {//tp
      for (let k = 1; k <= this.stopDate * 2; k++) {//stopDate
        let result = replay.call(this, data).slice(-1)[0];
        let r = {
          sl: i,
          tp: j,
          stopDate: k,
          totalProfit: result || result.totalProfit
        };
        temp.push(r);
      }
    }
  }
  temp.sort(function (a, b) {
    return b.totalProfit - a.totalProfit;
  });
  return temp[0]
}
