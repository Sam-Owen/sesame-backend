// D>90卖出策略
strategy.define("kdj_d>90", function(e){
	this.define = function(name){

	};

    // 买卖方向
    this.direction = "short"; //long 多 short 空


    // 建仓
	this.buy = function(){
		if (e[constant.KDJ_D >= 90] || e[constant.KDJ_D <= 10]){
			return true;
		}
	};

    // 减仓
	this.sell = function(){
        if (e[constant.KDJ_J <= 0] || e[constant.KDJ_J >= 100]){
            return true;
        }
	};

	//止损
	this.sl = function(price){
        price
	};

	//止盈
	this.tp;

	//杠杆率
    this.leverage = 10;

});
