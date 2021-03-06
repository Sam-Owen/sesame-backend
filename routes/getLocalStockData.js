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
    //不能直接使用para公共变量，nodejs是单线程的，会窜数据。只能作为参数传递形成闭包
    let para = req.query,
        fileName;
    para.period = para.period || "1day";
    para.type = para.type || "after";
    fileName = path.resolve(__dirname, `../public/javascripts/data/${para.symbol}-${para.type}.json`);

    console.log("=================================================================");
    if (!!para.update && para.update.toString() === "true") {
        readLocalData(fileName).then(function (localData) {
            return getRemoteData(localData, para);
        }).then(function (data) {
            res.send(data);
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
            console.log("Get local Data:" + fileName);
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
    let lastDate = localData.length > 0 ?
        localData.slice(-1)[0][constant.BASE_ATTR_DATE] :
        toLocaleDateString(0); //"1970-1-1"
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
            //在雪球页执行document.cookie 重要的是四个session类型的token需手动更新
            "Cookie": "device_id=6d7ad2e2018e25d020bbe65a33721b8e; webp=0; u=821508082540060; Hm_lvt_1db88642e346389874251b5a1eded6e3=1507563731,1507569524,1508082540,1508082545; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1508082545;xq_r_token.sig=J6CRpJiOVJCLsdVRN6tCvexELgw;xq_a_token=e3cae829e5836e234be00887406080b41c2cb69a;xq_r_token=319673aba44e00bd0fed3702652be32b2349860e;",
            'Referer': 'https://www.baidu.com/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
            'Cache-Control': 'max-age=0'
        }
    };
    if (lastDate === toLocaleDateString()) {
        console.log('Local data is fresh.');
        def.resolve(localData);
    } else {
        //仅查增量信息
        para.begin = new Date(lastDate).getTime() + dayTimes; //起始天数加一天，以免重复查询
        para.end = new Date().getTime() - dayTimes; //结束天数减一天，以免当天数据未走完
        options.path += querystring.stringify(para);
        console.log("Get remote Data:" + options.host + options.path);
        https.request(options, function (req) {
            // 数据很多的情况下, 并非一次发送完毕. 因此需要记录下整个过程中发送的数据
            req.on("data", function (data) {
                result += data;
            });
            // 在数据发送完毕后触发
            req.on('end', function () {
                try {
                    result = JSON.parse(result);
                    if (!result || result.error_description || !result.chartlist) {
                        console.error(result.error_description);
                        def.resolve(localData.concat([]));
                        return;
                    }
                } catch (e) {
                    console.error("unknow error:" + e);
                    def.resolve(localData.concat([]));
                    return;
                }

                let list = result.chartlist;
                for (let i = 0; i < list.length; i++) {
                    let e = list[i];
                    e[constant.BASE_ATTR_DATE] = toLocaleDateString(e[constant.BASE_ATTR_DATE]);
                }
                def.resolve(localData.concat(list));
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