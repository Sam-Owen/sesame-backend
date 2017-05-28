var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');

router.get('/', function (req, res, next) {
    //get 请求外网
    var code = req.query.code,
        start = req.query.start || "19000101",
        end = req.query.end,
        url = "http://biz.finance.sina.com.cn/stock/flash_hq/kline_data.php"
            + "?symbol=" + code + "&begin_date=" + start
            + (!!end ? "&end_date=" + end : "");
    http.get(url, function (request) {
        var bytes = '';
        request.on('data', function (data) {
            bytes += data;
        });
        request.on('end', function () {
            res.send(bytes);
            //写入文件
            fs.writeFile('../public/javascripts/data/L-' + code + '.txt', bytes, function (err) {
                if (err) throw err;
            });
        });
    });
});

module.exports = router;

