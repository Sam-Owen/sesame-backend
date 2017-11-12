var express = require('express');
var router = express.Router();

var stock_data = require('../api/stock_data')

/* GET users listing. */
router.get('/', function (req, res, next) {
    //允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    stock_data.base.findOne({
        symbol: req.query.symbol
    }).then(obj => res.send(obj.data))
});

module.exports = router;