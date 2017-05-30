var main = (new function () {
    var me = this, jsonArr = [];

    me.head = [];

    //解析数据文件并创建[json1,json2]数据格式
    this.getData = function () {
        //sina接跨域方式
        //XPT,NID,CAD

        return $.ajax({url: "/getLocalData?symbol=sz000001&type=after"}).done(function (r) {
            /**
            var xml = $(r);
            var nodes = xml.find("content");
            var jsonArr = [];

            for (var i=0;i<=nodes.length;i++){
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
**/
           // me.data = jsonArr = JSON.parse(r).chartlist;
            me.data = jsonArr = r;

            $.each(jsonArr[0], function (k, v) {
                me.head.push(k);
            });

            for (var i = 0; i < jsonArr.length; i++) {
                var e = jsonArr[i];
                e.pre = jsonArr[i-1] || {};
                e.pre.next = e;
            }

            console.log(jsonArr);
        });


        //通达信导出文件方式
        var url = "../data/ths-lem-ni-day-20170219.txt";
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

