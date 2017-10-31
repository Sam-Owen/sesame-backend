/**
 * 最初是一个想法
 * 通过分析验证这个想法
 * 验证通过后形成策略
 */
var analysis = function(){
	//console.log("后续" + j + "天涨幅为：" + util.getAmp(e, nextN) + "%");

    // kdj.d大于90的后续涨幅
    this.dWay = function (data) {
        var first = data[0], maxK = first[kk], maxD = first[kk], maxJ = first[kk], temp = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var e = data[i];
            maxK = maxK < e[kk] ? e[kk] : maxK;
            maxD = maxD < e[dk] ? e[dk] : maxD;
            maxJ = maxJ < e[jk] ? e[jk] : maxJ;

            if (+e[dk] > 90) {
                temp.push(e);

                for (var j = 1; j <= 20; j++) {
                    var nextN = util.getDayByDay(e, j);
                    console.log("后续" + j + "天涨幅为：" + util.getAmp(e, nextN) + "%");
                }
                console.log(e);
                console.log(nextN);
            }
        }

        console.log(maxK);
        console.log(maxD);
        console.log(maxJ);

        console.log(temp);
    };


	//后续第X天的平均涨幅最高

};
