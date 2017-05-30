var express = require('express'),
    router = express.Router(),
    https = require('https'),
    fs = require('fs'),
    q = require('q'),
    path = require('path'),
    querystring = require('querystring'),
    constant = require("../public/javascripts/struts/constant.js"),
    para = {};

var h1 = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ja;q=0.2',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'DNT': '1',
    'Host': 'xueqiu.com',
    'Referer': 'https://www.baidu.com/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
};

var h2 = {
    "Host": "xueqiu.com",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.101 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    //"Accept-Encoding": "utf-8",
    "Accept-Language": "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ja;q=0.2",
    "Cookie": "s=em12l6j5f6; u=371490111579551; __utma=1.1037269696.1490111580.1490111580.1490111580.1; __utmz=1.1490111580.1.1.utmcsr=matols.com|utmccn=(referral)|utmcmd=referral|utmcct=/tools/fulls/601988; aliyungf_tc=AQAAALYrOEMGfgQAr2EZdJncJmAUbAwG; xq_a_token=afe4be3cb5bef00f249343e7c6ad8ac7dc0e17fb; xq_a_token.sig=6QeqeLxu5hi1S21JgtozJ1EZcsQ; xq_r_token=a1e0ac0c42513dcf339ddf01778b49054e341172; xq_r_token.sig=VPMAft0BfpDHm5UE0QJ5oDLYunw; Hm_lvt_1db88642e346389874251b5a1eded6e3=1493565203,1493566048; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1493566355",
    'Referer': 'https://www.baidu.com/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
    'Cache-Control': 'max-age=0'
};

var h3 = {
    "Host": "xueqiu.com",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.101 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    //"Accept-Encoding": "utf-8",
    "Accept-Language": "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ja;q=0.2",
    "Cookie": "Hm_lpvt_1db88642e346389874251b5a1eded6e3=1496070368; Hm_lvt_1db88642e346389874251b5a1eded6e3=1493743087,1493825961,1493875762,1496070267; aliyungf_tc=AQAAAKss5TigeAEA+WEZdO7yZxmZyWt2; u=901496070368020; xq_a_token=876f2519b10cea9dc131b87db2e5318e5d4ea64f; xq_a_token.sig=dfyKV8R29cG1dbHpcWXqSX6_5BE; xq_r_token=709abdc1ccb40ac956166989385ffd603ad6ab6f; xq_r_token.sig=dBkYRMW0CNWbgJ3X2wIkqMbKy1M",
    'Referer': 'https://www.baidu.com/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
    'Cache-Control': 'max-age=0'
};

router.get('/', function (req, res, next) {
    var result = "";
    var options = {
        host: "xueqiu.com",
        path: "/stock/forchartk/stocklist.json?symbol=sz000001&period=1day&type=after",
        method: "post",
        headers: h3
    };
    https.request(options, function (r) {
        r.on("data", function (data) {
            result += data;
        });
        r.on('end', function () {
            res.send(result);
        });
    }).end();
});

function getRemoteData() {
    var result = "";
    var def = q.defer();
    var options = {
        host: "xueqiu.com",
        path: "/stock/forchartk/stocklist.json?symbol=sz000001&period=1day&type=after",
        method: "post",
        headers: h1
    };
    https.request(options, function (req) {
        req.setEncoding("utf8");
        // 数据很多的情况下, 并非一次发送完毕. 因此需要记录下整个过程中发送的数据
        req.on("data", function (data) {
            result += data;
        });
        // 在数据发送完毕后触发
        req.on('end', function () {
            def.resolve(result);
            console.log(result);
            console.log("Remote Data");
        });
    }).end();
    return def.promise;
}

module.exports = router;



