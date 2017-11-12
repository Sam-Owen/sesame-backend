let constant = require('../js/common/constant')
let kdj = require('../js/index/kdj')
let ma = require('../js/index/ma')
let macd = require('../js/index/macd')

/**
 * 初始化stock_data数据，设置指标
 * @param data 
 */
module.exports = function (data, e) {
    if (e && e.type === "local_futures") {
        data = parseSinaFuturesData(data);
    };
    
    let head = [];
    for (var i in data[0]) {
        if (data[0].hasOwnProperty(i)) { //filter,只输出man的私有属性
            head.push(i);
        };
    }

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
    return data.filter((e) => {
        delete e.next;
        delete e.pre;
        return e.time
    });
}

function parseSinaFuturesData(data) {
    return (data || []).map(i => {
        let e = {};
        //日期、开盘、最高、最低、收盘、成交量
        e[constant.BASE_ATTR_DATE] = i[0];
        e[constant.BASE_ATTR_OPEN] = +i[1];
        e[constant.BASE_ATTR_HIGH] = +i[2];
        e[constant.BASE_ATTR_LOW] = +i[3];
        e[constant.BASE_ATTR_CLOSE] = +i[4];
        e[constant.BASE_ATTR_VOL] = i[5];
        return e;
    })
}

/** 初始化trade_type 
    let data = sz.concat(sh);
    for (let i = 0; i < data.length; i++) {
        let e = data[i],
            symbol = `${e.exchange}${e.code}`;
        if (!symbol) {
            continue
        }
        e.board = [];
        if (symbol.match(/^sh6/ig)) {
            e.symbol = symbol;
            e.board.push('上海主板')
        } else if (symbol.match(/^sz000/ig) || e.code.match(/^sz001/ig)) {
            e.symbol = symbol;
            e.board.push('深圳主板')
        } else if (symbol.match(/^sz002/ig)) {
            e.symbol = symbol;
            e.board.push('中小板')
        } else if (symbol.match(/^sz300/ig)) {
            e.symbol = symbol;
            e.board.push('创业板')
        }
    }
    
    
    lf.forEach((e) => {
        e.board = [];
        e.board.push(e.exchange);
    })
    
    let list = data.concat(lf);
    
    
    // trade_type.base.insertMany(list).then((r)=>{
    //     console.log(r)
    // })
 */