let express = require('express'),
    https = require('https'),
    fs = require('fs'),
    q = require('q'),
    path = require('path'),
    querystring = require('querystring'),
    constant = require("../js/common/constant.js");

function getRemoteData(dataLastUpdateDate, opt) {
    para = Object.create(null)
    para.period = opt.period || "1day";
    para.type = opt.type || "after";
    para.symbol = opt.symbol;
    dataLastUpdateDate = dataLastUpdateDate || new Date(0).toLocaleDateString(); //"1970/1/1"

    const dayTimes = 86400000;

    let result = "",
        stream = "",
        def = q.defer(),
        options = {
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
                "Cookie": `
            device_id=6d7ad2e2018e25d020bbe65a33721b8e; 
            webp=0; 
            u=821508082540060; 
            Hm_lvt_1db88642e346389874251b5a1eded6e3=1507563731,1507569524,1508082540,1508082545; 
            Hm_lpvt_1db88642e346389874251b5a1eded6e3=1510154394;
            xq_a_token=6708d101a456578c98ea1779ae898687fe465bcb;
            xq_a_token.sig=ESOIvUPuIgPljw2oVadQTbSmYos;
            xq_r_token=0cbb786896425c8f2a853545bade9309fbc75601;
            xq_r_token.sig=SBPl2y3rvUjypwJrgx4MSiUpxWw;
            aliyungf_tc=AQAAAO305wYTfg4AJ9MltwO8+Jee1lSI;
            `.replace(/[\s]*/ig, ""),
                'Referer': 'https://www.baidu.com,/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
                'Cache-Control': 'max-age=0'
            }
        };
    //本地数据的最后一天和系统时间的前一天对比。一样说明数据是最新的，不需要更新。
    //因为取远端end参数使用的是当天前一天，是不会去查询当天数据的。所以比较也需要用前一天。
    if (dataLastUpdateDate === new Date().toLocaleDateString()) {
        def.reject(`${opt.symbol}:Local data is fresh`);
    } else {
        //仅查增量信息
        para.begin = new Date(dataLastUpdateDate) + dayTimes; //起始天数加一天，以免重复查询
        para.end = new Date() - dayTimes; //结束天数减一天，以免当天数据未走完
        options.path += querystring.stringify(para);

        console.log("Get remote Data:" + options.host + options.path);
        let httpsReq = https.request(options, function (req) {
            // 数据很多的情况下, 并非一次发送完毕. 因此需要记录下整个过程中发送的数据
            req.on("data", function (data) {
                stream += data;
            });
            // 在数据发送完毕后触发
            req.on('end', function () {
                try {
                    result = JSON.parse(stream);
                    if (!result || result.error_description || !result.chartlist) {
                        def.reject(`${opt.symbol}:${result.error_description}:${result.chartlist}`);
                    }
                } catch (e) {
                    def.reject(`${opt.symbol}:${e}:${result}`);
                }

                let list = result.chartlist;
                for (let i = 0; i < list.length; i++) {
                    let e = list[i];
                    e[constant.BASE_ATTR_DATE] = new Date(e[constant.BASE_ATTR_DATE]).toLocaleDateString();
                }
                def.resolve(list);
            });
            req.on('error', err => {
                def.reject(`${opt.symbol}:${err}:获取远端数据异常`);
            });
        });
        httpsReq.end((err, res) => def.reject(`${opt.symbol}:${err}:发送请求异常`));
        httpsReq.on('error', err => {
            def.reject(`${opt.symbol}:${err}:socket异常`);
        });
    }
    return def.promise;
}

module.exports = getRemoteData;