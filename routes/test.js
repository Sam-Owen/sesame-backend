var express = require('express');
var router = express.Router();
var http = require('http');

var stock_data = require('../api/stock_data')
var trade_type = require('../api/trade_type')

var sz = require('../data/sz-stock')
var sh = require('../data/sh-stock')
var lf = require('../data/local-futures')

let constant = require('../js/common/constant')
let kdj = require('../js/index/kdj')
let ma = require('../js/index/ma')
let macd = require('../js/index/macd')

let getRemoteData = require('../public/getXQdata')

/* GET users listing. */
router.get('/', function (req, res, next) {

    stock_data.base.find({
        symbol: 'sh600000'
    }).then((d) => {
        console.log(d);
        d.toArray((err, d) => {
            console.log(d);
            getRemoteData(d[0].data, {
                symbol: 'sh600000'
            }).then((stock) => {
                console.log(stock)
                stock_data.base.update({
                    symbol: 'sh600000'
                }, {
                    $set: {
                        "data": stock
                    }
                })
            })
        })
    })

    /**
     * 初始化stock_data数据，设置指标
     * @param data
    function init(data) {
        let head = [];

        for (var i in data[0]) {
            if (data[0].hasOwnProperty(i)) { //filter,只输出man的私有属性
                head.push(i);
            };
        }

        // $.each(data[0], function i, v) {
        //     head.push(k);
        // });

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
        return data;
    }

    let data = require('../public/javascripts/data/sh600000-after')
    //console.log(stock_data);
    var d = init(data)
  
    d = d.filter((e)=>{
        delete e.next;
        delete e.pre;
        return e.time
    });
    console.log(d);
    stock_data.base.insert({symbol:'sh600000',type:'after',data:d}).then(()=>{console.log('HAHAH')});
     */

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

});

module.exports = router;