var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');

router.get('/', function (req, res, next) {
    //get 请求外网
    var code = req.query.code,
        cycle = req.query.cycle,
        serviceName = "IndexService.getInnerFutures"
            + (!!cycle ? "Mini" : "Daily" + "KLine")
            + (cycle || ""),
        url = "http://stock2.finance.sina.com.cn/futures/api/json.php/"
            + serviceName + "?symbol=" + code;
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

