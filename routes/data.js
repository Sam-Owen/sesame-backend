var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    q = require('q'),
    querystring = require('querystring'),
    constant = require("../public/javascripts/struts/constant.js");

var dataDispatcher = (new function () {
    var me = this, jsonArr = [];

    me.head = [];

    this.getData = function (code) {
        code.isGlobalFutures();
        this.getGlobalFuturesDataBySina();

        code.match(/^sz|^sh/);
        this.getLocalStockDataBySina(code);

        // else
        this.getLocalFuturesDataBySina();
    }

    this.getLocalStockDataBySina = function (code) {

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


        return $.ajax({url: "/getLocalStockData?code=" + code}).done(function (r) {
            var xml = $(r);
            var nodes = xml.find("content");
            var jsonArr = [];
            for (var i = 0; i <= nodes.length; i++) {
                var node = $(nodes[i]);
                var e = {};
                e[constant.BASE_ATTR_DATE] = node.attr("d");
                e[constant.BASE_ATTR_OPEN] = node.attr("o");
                e[constant.BASE_ATTR_CLOSE] = node.attr("c");
                e[constant.BASE_ATTR_HIGH] = node.attr("h");
                e[constant.BASE_ATTR_LOW] = node.attr("l");
                e[constant.BASE_ATTR_VOL] = node.attr("v");
                jsonArr.push(e);
            }

            me.data = jsonArr;

            $.each(jsonArr[0], function (k, v) {
                me.head.push(k);
            });

            for (var i = 0; i < jsonArr.length; i++) {
                var e = jsonArr[i];
                e.pre = jsonArr[i - 1] || {};
                e.pre.next = e;
            }

            console.log(jsonArr);
        });
    }

    this.getLocalFuturesDataBySina = function () {
        return $.ajax({url: "/getLocalStockData?code=sz000001"}).done(function (r) {
            me.data = jsonArr = eval(r);

            $.each(jsonArr[0], function (k, v) {
                me.head.push(k);
            });

            for (var i = 0; i < jsonArr.length; i++) {
                var e = jsonArr[i];
                e.pre = jsonArr[i - 1] || {};
                e.pre.next = e;
            }
            console.log(jsonArr);
        });
    };

    this.getGlobalFuturesDataBySina = function () {
        return $.ajax({url: "/getLocalStockData?code=sz000001"}).done(function (r) {
            me.data = jsonArr = eval(r);

            $.each(jsonArr[0], function (k, v) {
                me.head.push(k);
            });

            for (var i = 0; i < jsonArr.length; i++) {
                var e = jsonArr[i];
                e.pre = jsonArr[i - 1] || {};
                e.pre.next = e;
            }
            console.log(jsonArr);
        });
    };

    //从TDX和THS导出文件方式
    this.getDataByExportFile = function () {
        var url = "../data/ths-lem-ni-day-20170219.txt";
        // var url = "../data/futures.txt";
        return $.ajax({url: url}).done(function (r) {
            var arr = r.split("\n"), head = arr[0].split(","), l = arr.length;
            for (var i = 1; i < l; i++) {
                var tempArr = arr[i].split(","), le = tempArr.length, e = {};
                for (var j = 0; j < le; j++) {
                    e[head[j]] = tempArr[j];
                    e.pre = jsonArr.slice(-1)[0] || {};
                    e.pre.next = e;
                }
                jsonArr.push(e);
            }
            me.head = head;
            console.log(jsonArr);
        });
    };

    /**
     * .csv文件转换成JSON格式
     * @param url
     * @returns {*}
     */
    this.parseCsv2Json = function (url) {
        var def = $.Deferred();
        $.ajax({url: url}).done(function (r) {
            var data = [], arr = r.split("\n"), head = arr[0].split(","), l = arr.length;
            for (var i = 1; i < l; i++) {
                var tempArr = arr[i].split(","), le = tempArr.length, e = {};
                for (var j = 0; j < le; j++) {
                    e[head[j]] = tempArr[j];
                }
                data.push(e);
            }
            def.resolve({
                head: head,
                data: data

            });
        }).fail(function (err) {
            def.reject(err);
        });
        return def.promise();
    };

    /** 使用
     this.parseCsv2Json("../data/futures.txt").done(function (da) {
        var d = da.data;
        for(var i=0;i<d.length;i++){
            var code = d[i].name.match(/[A-Za-z]+$/);
            d[i].code = code[0];
            console.log(code[0]);
        }
        console.log(d);
        console.log(JSON.stringify(d));
    }).fail(function (e) {
        console.log("err")
    })
     **/

    // 初始化数据，设置指标
    this.init = function () {
        return this.getData().done(function () {
            var e, jsonArr = main.data;
            for (var i = 0, l = jsonArr.length; i < l; i++) {
                e = jsonArr[i];

                // 转为数值
                e[constant.BASE_ATTR_OPEN] = +e[constant.BASE_ATTR_OPEN];
                e[constant.BASE_ATTR_CLOSE] = +e[constant.BASE_ATTR_CLOSE];
                e[constant.BASE_ATTR_HIGH] = +e[constant.BASE_ATTR_HIGH];
                e[constant.BASE_ATTR_LOW] = +e[constant.BASE_ATTR_LOW];

                // 错误数据处理，缺失数据用前一天的收盘数据代替，表示无波动
                if (!e[constant.BASE_ATTR_OPEN]) {
                    e[constant.BASE_ATTR_OPEN] = e.pre[constant.BASE_ATTR_CLOSE];
                }
                if (!e[constant.BASE_ATTR_HIGH]) {
                    e[constant.BASE_ATTR_HIGH] = e.pre[constant.BASE_ATTR_CLOSE];
                }
                if (!e[constant.BASE_ATTR_LOW]) {
                    e[constant.BASE_ATTR_LOW] = e.pre[constant.BASE_ATTR_CLOSE];
                }
                if (!e[constant.BASE_ATTR_CLOSE]) {
                    e[constant.BASE_ATTR_CLOSE] = e.pre[constant.BASE_ATTR_CLOSE];
                }

                if (me.head.indexOf(constant.KDJ_D) === -1) {
                    kdj.init(jsonArr[i]);
                }
                if (me.head.indexOf(constant.MA + 5) === -1) {
                    ma.init(jsonArr[i]);
                }
            }
            if (me.head.indexOf(constant.MACD_BAR) === -1) {
                macd.init(jsonArr);
            }
        });
    };
}());

module.exports = constant;
