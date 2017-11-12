var express = require('express');
var router = express.Router();

var trade_type = require('../api/trade_type')

/* GET users listing. */
router.get('/', function (req, res, next) {
    //允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    trade_type.base.find({
        board: {
            $in: [req.query.board]
        }
    }).then(data => res.send(data))

});

module.exports = router;