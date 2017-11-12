var express = require('express');
var router = express.Router();

var stock_data = require('../api/stock_data')
var trade_type = require('../api/trade_type')

var ma250 = require('../js/analysis/ma250')

/* GET users listing. */
router.get('/', function (req, res, next) {
    //允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    let startTime = new Date();
    trade_type.base.find({
        board: {
            $in: [req.query.board]
        }
    }).then(data => {
        console.log(data.length);
        data.length = 10;
        stock_data.base.find({
            symbol: {
                $in: data.map(e => e.symbol)
            }
        }).then(array => {
            console.log(array);
            let stockList = [];
            array.forEach(element => {
                //设置pre、next
                for (let i = 1; i < element.length; i++) {
                    let e = element[i].data;
                    e.pre = element[i - 1].data;
                    e.pre.next = e;

                    let ar = ma250.execute(element[i].data, 250)
                    console.log(ar);
                    stockList.push(ar);
                }
            });
            console.log((startTime - new Date())/60000);
            console.log(stockList);
            res.send(stockList);
        })
    })

});

module.exports = router;