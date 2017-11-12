var http = require('http');
var fs = require('fs');
var path = require('path');

function sina(dataLastUpdateDate, opt) {
    //允许跨域访问
    var symbol = `${opt.symbol}0`,
        start = opt.start || "19000101",
        end = opt.end,
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
        });
    });
}

module.exports = sina;