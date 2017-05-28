var express = require('express'),
    router = express.Router(),
    https = require('https'),
    fs = require('fs'),
    q = require('q'),
    querystring = require('querystring'),
    constant = require("../public/javascripts/struts/constant.js"),
    para = {};


router.get('/', function (req, res, next) {
    //允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    para = {
        "symbol": req.query.symbol,
        "period": req.query.period || "1day",
        "type": req.query.type
    };
    var type = !!para.type ? "-" + para.type : "",
        fileName = '../public/javascripts/data/' + para.symbol + type + '.json';
    readLocalData(fileName).then(getRemoteData).then(function (data) {
        res.send(data);
        saveData(data, fileName);
    });
});

function readLocalData(fileName) {
    var defer = q.defer();
    fs.readFile(fileName, function (err, data) {
        if (!err) {
            defer.resolve(JSON.parse(data.toString()));
            console.log("Local Data");
        } else {
            //defer.reject(err);
            defer.resolve([]);
        }
    });
    return defer.promise;
}

function getRemoteData(localData) {
    var result = "";
    var def = q.defer();
    var lastDate = localData.length > 0
        ? localData.slice(-1)[0][constant.BASE_ATTR_DATE]
        : toLocaleDateString(0);//"1970-1-1"
    var options = {
        host: "xueqiu.com",
        path: "/stock/forchartk/stocklist.json?",
        method: "get",
        headers: {
            "Host": "xueqiu.com",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.101 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            //"Accept-Encoding": "gzip, deflate, sdch, br",
            "Accept-Language": "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ja;q=0.2",
            "Cookie": "s=em12l6j5f6; u=371490111579551; __utma=1.1037269696.1490111580.1490111580.1490111580.1; __utmz=1.1490111580.1.1.utmcsr=matols.com|utmccn=(referral)|utmcmd=referral|utmcct=/tools/fulls/601988; aliyungf_tc=AQAAALYrOEMGfgQAr2EZdJncJmAUbAwG; xq_a_token=afe4be3cb5bef00f249343e7c6ad8ac7dc0e17fb; xq_a_token.sig=6QeqeLxu5hi1S21JgtozJ1EZcsQ; xq_r_token=a1e0ac0c42513dcf339ddf01778b49054e341172; xq_r_token.sig=VPMAft0BfpDHm5UE0QJ5oDLYunw; Hm_lvt_1db88642e346389874251b5a1eded6e3=1493565203,1493566048; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1493566355",
            'Referer': 'https://www.baidu.com/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
            'Cache-Control': 'max-age=0'
        }
    };
    if (lastDate === toLocaleDateString()) {
        def.resolve(localData);
    } else {
        //仅查增量信息
        para.begin = new Date(lastDate).getTime();
        para.end = new Date().getTime();
        options.path += querystring.stringify(para);
        https.request(options, function (req) {
            req.setEncoding("utf8");
            // 数据很多的情况下, 并非一次发送完毕. 因此需要记录下整个过程中发送的数据
            req.on("data", function (data) {
                result += data;
            });
            // 在数据发送完毕后触发
            req.on('end', function () {

                try {
                    result = JSON.parse(result).chartlist;
                } catch (e) {
                    console.log("Error:" + para.symbol + e);
                    def.resolve(localData.concat([]));
                    return;
                }

                if (!result) {
                    def.resolve(localData.concat([]));
                    console.log("Have no data:" + para.symbol);
                    return;
                }


                for (var i = 0; i < result.length; i++) {
                    var e = result[i];
                    e[constant.BASE_ATTR_DATE] = toLocaleDateString(e[constant.BASE_ATTR_DATE]);
                }
                def.resolve(localData.concat(result));
                console.log("Remote Data");
            });
        }).end();
        //req.write(para); // xhr.send(). 感觉跟这个差不多
    }
    return def.promise;
}

function saveData(data, fileName) {
    //写入文件
    fs.writeFile(fileName, JSON.stringify(data), function (err) {
        if (err) throw err;
    });
}

function toLocaleDateString(dateValue) {
    var date = dateValue !== undefined ? new Date(dateValue) : new Date();
    return date.toLocaleDateString().replace(/\//mg, "-");
}

module.exports = router;



