var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');

router.get('/', function (req, res, next) {
    //get 请求外网
    var stockCode = req.query.code || "NID",
        //stockCode = req.query.m || "Daily",
        url = "http://stock2.finance.sina.com.cn/futures/api/json.php/GlobalFuturesService.getGlobalFuturesDailyKLine?symbol=";
    http.get(url + stockCode,
        function (request) {
            var bytes = '';
            request.on('data', function (data) {
                console.log(data);
                bytes += data;
            });
            request.on('end', function () {
                res.send(bytes);
                //写入文件
                fs.writeFile('../public/javascripts/data/G-' + stockCode + '.txt', bytes, function (err) {
                    if (err) throw err;
                });
            });
        });
});




module.exports = router;

