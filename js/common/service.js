import constant from '@/components/js/common/constant'
import kdj from '@/components/js/index/kdj'
import ma from '@/components/js/index/ma'
import macd from '@/components/js/index/macd'

/**
 * 获取中国股票数据
 * @param code
 * @param update
 * @returns {*}
 */
function getLocalStock(code, update) {
  let url = "http://127.0.0.1:3000/getLocalStockData?symbol=" + code + "&type=after&update=" + update;
  return $.ajax({url: url}).done(function (data) {
    init(data);
  });
}

/**
 * 初始化数据，设置指标
 * @param data
 */
function init(data) {
  let head = [];

  $.each(data[0], function (k, v) {
    head.push(k);
  });

  //设置pre、next
  for (let i = 0; i < data.length; i++) {
    let e = data[i];
    e.pre = data[i - 1] || {};
    e.pre.next = e;
  }

  for (let i = 0, l = data.length; i < l; i++) {
    let e = data[i];

    // 转为数值
    e[constant.BASE_ATTR_OPEN] = +e[constant.BASE_ATTR_OPEN];
    e[constant.BASE_ATTR_CLOSE] = +e[constant.BASE_ATTR_CLOSE];
    e[constant.BASE_ATTR_HIGH] = +e[constant.BASE_ATTR_HIGH];
    e[constant.BASE_ATTR_LOW] = +e[constant.BASE_ATTR_LOW];

    // 错误数据处理，缺失数据用前一天的收盘数据代替，表示无波动
    if (!e[constant.BASE_ATTR_OPEN]) {
      e[constant.BASE_ATTR_OPEN] = e.pre[constant.BASE_ATTR_CLOSE];
    }
    if (!e[constant.BASE_ATTR_HIGH]) {
      e[constant.BASE_ATTR_HIGH] = e.pre[constant.BASE_ATTR_CLOSE];
    }
    if (!e[constant.BASE_ATTR_LOW]) {
      e[constant.BASE_ATTR_LOW] = e.pre[constant.BASE_ATTR_CLOSE];
    }
    if (!e[constant.BASE_ATTR_CLOSE]) {
      e[constant.BASE_ATTR_CLOSE] = e.pre[constant.BASE_ATTR_CLOSE];
    }

    if (head.indexOf(constant.KDJ_D) === -1) {
      kdj.init(data[i]);
    }
    if (head.indexOf(constant.MA + 5) === -1) {
      ma.init(data[i]);
    }
  }
  if (head.indexOf(constant.MACD_BAR) === -1) {
    macd.init(data);
  }
  global.testData = data;
}

export default {
  getLocalStock
}

