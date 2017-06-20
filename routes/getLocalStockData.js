let express = require('express'),
    router = express.Router(),
    https = require('https'),
    fs = require('fs'),
    q = require('q'),
    path = require('path'),
    querystring = require('querystring'),
    constant = require("../public/javascripts/struts/constant.js");

const dayTimes = 86400000;

/**
 *  req.query:
 * "symbol":
 * "period": 周期
 * "type": 复权
 * "update": 是否更新数据
 */
router.get('/', function (req, res, next) {
    //允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    let para = req.query; //不能用这个，nodejs是单线程的，会窜数据
    para.period = para.period || "1day";

    let typeStr = !!para.type ? "-" + para.type : "",
        fileName = path.resolve(__dirname, '../public/javascripts/data/' + para.symbol + typeStr + '.json');

    if (!!para.update && para.update.toString() === "true") {
        readLocalData(fileName).then(function (localData) {
            return getRemoteData(localData, para);
        }).then(function (data) {
            res.send(data);
            console.log(fileName);
            console.log("=================================================================");
            saveData(data, fileName);
        });
    } else {
        readLocalData(path.resolve(__dirname, fileName)).then(function (data) {
            res.send(data);
        });
    }
});

function readLocalData(fileName) {
    let defer = q.defer();
    fs.readFile(fileName, function (err, data) {
        if (!err) {
            defer.resolve(JSON.parse(data.toString()));
            console.log("Local Data");
        } else {
            //defer.reject(err);
            console.error('Have no local data:' + fileName);
            defer.resolve([]);
        }
    });
    return defer.promise;
}

function getRemoteData(localData, para) {
    let result = "";
    let def = q.defer();
    let lastDate = localData.length > 0
        ? localData.slice(-1)[0][constant.BASE_ATTR_DATE]
        : toLocaleDateString(0);//"1970-1-1"
    let options = {
        host: "xueqiu.com",
        path: "/stock/forchartk/stocklist.json?",
        method: "get",
        headers: {
            "Host": "xueqiu.com",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.101 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "utf-8",
            "Accept-Language": "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ja;q=0.2",
            //"Cookie": "s=em12l6j5f6; u=371490111579551; __utma=1.1037269696.1490111580.1490111580.1490111580.1; __utmz=1.1490111580.1.1.utmcsr=matols.com|utmccn=(referral)|utmcmd=referral|utmcct=/tools/fulls/601988; aliyungf_tc=AQAAALYrOEMGfgQAr2EZdJncJmAUbAwG; xq_a_token=afe4be3cb5bef00f249343e7c6ad8ac7dc0e17fb; xq_a_token.sig=6QeqeLxu5hi1S21JgtozJ1EZcsQ; xq_r_token=a1e0ac0c42513dcf339ddf01778b49054e341172; xq_r_token.sig=VPMAft0BfpDHm5UE0QJ5oDLYunw; Hm_lvt_1db88642e346389874251b5a1eded6e3=1493565203,1493566048; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1493566355",
            "Cookie": "Hm_lpvt_1db88642e346389874251b5a1eded6e3=1496070368; Hm_lvt_1db88642e346389874251b5a1eded6e3=1493743087,1493825961,1493875762,1496070267; aliyungf_tc=AQAAAKss5TigeAEA+WEZdO7yZxmZyWt2; u=901496070368020; xq_a_token=876f2519b10cea9dc131b87db2e5318e5d4ea64f; xq_a_token.sig=dfyKV8R29cG1dbHpcWXqSX6_5BE; xq_r_token=709abdc1ccb40ac956166989385ffd603ad6ab6f; xq_r_token.sig=dBkYRMW0CNWbgJ3X2wIkqMbKy1M",
            'Referer': 'https://www.baidu.com/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
            'Cache-Control': 'max-age=0'
        }
    };
    if (lastDate === toLocaleDateString()) {
        def.resolve(localData);
    } else {
        //仅查增量信息
        para.begin = new Date(lastDate).getTime() + dayTimes; //起始天数加一天，以免重复查询
        para.end = new Date().getTime() - dayTimes; //结束天数减一天，以免当天数据未走完
        options.path += querystring.stringify(para);
        https.request(options, function (req) {
            // 数据很多的情况下, 并非一次发送完毕. 因此需要记录下整个过程中发送的数据
            req.on("data", function (data) {
                result += data;
            });
            // 在数据发送完毕后触发
            req.on('end', function () {
                try {
                    result = JSON.parse(result).chartlist;
                } catch (e) {
                    console.error("Error:" + para.symbol + e);
                    def.resolve(localData.concat([]));
                    return;
                }

                if (!result) {
                    def.resolve(localData.concat([]));
                    console.error("Have no data:" + para.symbol);
                    return;
                }

                for (let i = 0; i < result.length; i++) {
                    let e = result[i];
                    e[constant.BASE_ATTR_DATE] = toLocaleDateString(e[constant.BASE_ATTR_DATE]);
                }
                def.resolve(localData.concat(result));
                console.log("Remote Data:" + options.host + options.path);
            });
        }).end();
        //req.write(para); // xhr.send(). 感觉跟这个差不多
    }
    return def.promise;
}

function saveData(data, fileName) {
    //写入文件
    fs.writeFile(fileName, JSON.stringify(data), function (err) {
        if (err) {
            console.error(err);
        }
    });
}

function toLocaleDateString(dateValue) {
    let date = dateValue !== undefined ? new Date(dateValue) : new Date();
    return date.toLocaleDateString().replace(/\//mg, "-");
}

module.exports = router;



