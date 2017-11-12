var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var stock_data = require('../api/stock_data')
var trade_type = require('../api/trade_type')

let constant = require('../js/common/constant')
let kdj = require('../js/index/kdj')
let ma = require('../js/index/ma')
let macd = require('../js/index/macd')

let getRemoteData = require('../public/getXQdata')
let init = require('../public/initIndex')

let async = require('async')

/* GET users listing. */
router.get('/', function (req, res, next) {
    let startTime = new Date();

    trade_type.base.find({
        symbol: {
            $ne: null
        }
    }).then((list) => {
        for (let i = 0; i < 100; i++) {
            if (!e) {
                console.error("quit");
                return;
            }
        }
    })

    /**
    function asyncTest(items) {
        let l = items.length;
        async.eachLimit(items, 10, function (e, callback) {
            console.log(`${e.symbol}开始占坑……后面排队${l--}`);
            getRemoteData(e.dataLastUpdateDate, {
                symbol: e.symbol
            }).then((stock) => {
                //res.send(stock);
                stock_data.base.update({
                    symbol: e.symbol
                }, {
                    $set: {
                        "data": init(stock, e),
                        "type": "after"
                    }
                }, {
                    upsert: true
                });
                trade_type.base.update({
                    symbol: e.symbol
                }, {
                    $set: {
                        "dataLastUpdateDate": new Date().toLocaleDateString()
                    }
                }, {
                    upsert: true
                });
                callback()
            }, err => {
                errLog(err)
                callback(err);
            })
        }, function (err) {
            if (err) {
                console.log('厕所里面发生大事了 : ' + err);
            } else {
                console.log(`每个人都顺利滴拉完了屎……:${(startTime - new Date())/3600}`);
            }
        });
    }
    **/

    function errLog(err) {
        let fileName = path.resolve(__dirname, `../public/javascripts/data/errLog.js`);
        console.error(`erorr happens`);
        //写入文件
        fs.appendFile(fileName, `\n${err}`, function (e) {
            if (e) {
                console.error(e);
            }
        });
    }

    /**
    function remote(e) {
        if (!e) {
            console.error("quit");
            return;
        }
        stock_data.base.find({
            symbol: e.symbol
        }).then((localData) => {
            getRemoteData(localData.data, {
                symbol: e.symbol
            }).then((stock) => {
                //res.send(stock);
                remote(processList.pop());
                console.log(processList.length);
                stock_data.base.update({
                    symbol: e.symbol
                }, {
                    $set: {
                        "data": init(stock, e),
                        "type": "after"
                    }
                }, {
                    upsert: true
                })
            })
        })
    } */
});

module.exports = router;