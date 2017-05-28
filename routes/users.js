var express = require('express');
var router = express.Router();
var http = require('http');

/* GET users listing. */
router.get('/', function (req, res, next) {
    //get 请求外网
    http.get("http://stock2.finance.sina.com.cn/futures/api/json.php/GlobalFuturesService.getGlobalFuturesDailyKLine?symbol=NID",
        function (req, r) {
            var bytes = '';
            req.on('data', function (data) {
                bytes += data;
            });
            req.on('end', function () {
                res.send(bytes);
            });
        });
});

module.exports = router;
