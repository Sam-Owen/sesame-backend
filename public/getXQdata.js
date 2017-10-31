let express = require('express'),
    https = require('https'),
    fs = require('fs'),
    q = require('q'),
    querystring = require('querystring'),
    constant = require("../js/common/constant.js");

const dayTimes = 86400000;

function getRemoteData(localData, opt) {
    localData = localData || []
    para = Object.create(null)
    para.period = opt.period || "1day";
    para.type = opt.type || "after";
    para.symbol = opt.symbol;

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
            "Cookie": `
                device_id=6d7ad2e2018e25d020bbe65a33721b8e; 
                webp=0; 
                u=821508082540060; 
                Hm_lvt_1db88642e346389874251b5a1eded6e3=1507563731,1507569524,1508082540,1508082545; 
                Hm_lpvt_1db88642e346389874251b5a1eded6e3=1508082545;
                xq_r_token=819ae94ba56378cc0665670983c2afafc34c275b;
                xq_r_token.sig=6N6ZkaHvfEfPz1FgHKEsoQ_rhaA;
                xq_a_token=469ea9edce5537d5d8297aaffcd3474cc8d12273;
                xq_a_token.sig=8D0Nrw6wLkoY9wJS5_6N_eORSOY;
                Hm_lpvt_1db88642e346389874251b5a1eded6e3=1509472165;
                `.replace(/[\s]*/ig, ""),
            'Referer': 'https://www.baidu.com,/link?url=CQu5rGbzI_vt0fSj3b12LTyZgWvzjrK9f3L_GLIBqum&wd=&eqid=88e8a3ca0001535b00000005572edf29',
            'Cache-Control': 'max-age=0'
        }
    };
    //本地数据的最后一天和系统时间的前一天对比。一样说明数据是最新的，不需要更新。
    //因为取远端end参数使用的是当天前一天，是不会去查询当天数据的。所以比较也需要用前一天。
    if (lastDate === toLocaleDateString(new Date() - dayTimes)) {
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

/** 
 * toLocaleDateString(0);  1970-1-1 
 * toLocaleDateString();  当天 
*/
function toLocaleDateString(dateValue) {
    let date = dateValue !== undefined ? new Date(dateValue) : new Date();
    return date.toLocaleDateString().replace(/\//mg, "-");
}

module.exports = getRemoteData;