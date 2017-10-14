var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var path = require('path');

router.get('/', function (req, res, next) {
    //允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    var symbol = `${req.query.symbol}0`,
        start = req.query.start || "19000101",
        end = req.query.end,
        url = `http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=${symbol}`;
    http.get(url, function (request) {
        var bytes = '';
        request.on('data', function (data) {
            bytes += data;
        });
        request.on('end', function () {
            res.send(bytes);
            //写入文件
            let fileName = path.resolve(__dirname, `../public/javascripts/data/lf-${symbol}.json`);
            fs.writeFile(fileName, bytes, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    });
});

module.exports = router;

