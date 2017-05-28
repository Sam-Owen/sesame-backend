//策略分析 strategry.call(analysis);
var analysis = function () {
    //console.log("后续" + j + "天涨幅为：" + util.getAmp(e, nextN) + "%");
    /**
     注解：完整走势如下，例600019：
     以及放量突破年线然后缩量回调年线的老股，这都是以后的黑马。特别那些年线走平后向上出现拐点的股票，
     一定要看好了。

     长期均线走平（尤其年线要和其它均线走成水平）并缩量：5月高点到9.15放量，一直缩量。
     其它多数均线被年线压制，突然放量突破年线：9.15放量。6.29放量不算，年线未走平。
     缩量回调踩年线：9.22那次回踩更有说服力。
     再次放量突破年线：10.12再次放量，并突破前高，代表牛股确立
     **/
        // kdj.d大于90的后续涨幅
    var maHalfYear = constant.MA + 250;
    data = jsonArr;
    for (var i = 0, l = data.length; i < l; i++) {
        var e = data[i];
        e.time = new Date(e.time).toLocaleDateString();
            if (e[constant.BASE_ATTR_CLOSE] >= e[maHalfYear]
                &&e.pre[constant.BASE_ATTR_CLOSE] < e.pre[maHalfYear] /*突破年线*/
                &&e[maHalfYear] <= e.pre[maHalfYear] /*年线还处于下行趋势*/
                &&e[constant.MA + 500] <= e.pre[constant.MA + 500] /*2年线还处于下行趋势*/
                &&e[maHalfYear] >= e[constant.MA + 5]
                &&e[maHalfYear] >= e[constant.MA + 10]
                &&e[maHalfYear] >= e[constant.MA + 20]
                &&e[maHalfYear] >= e[constant.MA + 60]
                &&e[maHalfYear] >= e[constant.MA + 120] /*年线压制其它均线*/) {


                for (var j = 1; j <= 30; j++) {
                    var nextN = util.getDayByDay(e, j);
                    console.log("后续" + j + "天涨幅为：" + util.getAmp(e, nextN) + "%");
                }
                console.log(e);//当前对象
                console.log(nextN);//后续N天对象
        }

    }


    //后续第X天的平均涨幅最高

}();