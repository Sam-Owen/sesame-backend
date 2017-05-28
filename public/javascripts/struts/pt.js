

/**
2013年FOMC会议时间表：
["2013/01/30-03:00","2013/03/20-03:00","2013/05/01-03:00","2013/06/19-03:00","2013/07/31-03:00","2013/09/18-03:00","2013/10/0-03:00","2013/12/18-03:00"],	
1月29-30日（周二--周三） - 仅发布声明
3月19-20日（周二--周三） - 声明、预测、主席新闻发布会
4月30日-5月1日（周二--周三） - 仅发布声明

6月18-19日（周二--周三）- 声明、预测、主席新闻发布会
7月30-31日（周二--周三） - 仅发布声明

9月17-18日（周二--周三） - 声明、预测、主席新闻发布会
10月29-30日（周二--周三） - 仅发布声明

12月17-18日（周二--周三） - 声明、预测、主席新闻发布会

2014年FOMC会议时间表：
1月28-29日（周二--周三） - 仅发布声明

3月18-19日（周二--周三） - 声明、预测、主席新闻发布会
4月29-30日（周二--周三） - 仅发布声明

6月17-18日（周二--周三） - 声明、预测、主席新闻发布会
7月29-30日（周二--周三） - 仅发布声明

9月16-17日（周二--周三） - 声明、预测、主席新闻发布会
10月28-29日（周二--周三） - 仅发布声明

12月16-17日（周二--周三）- 声明、预测、主席新闻发布会

2015:
1月27-28日(周二、周三)
3月17-18日(周二、周三)
4月28-29日(周二、周三)
6月16-17日(周二、周三)
7月28-29日(周二、周三)
9月16-17日(周二、周三)
10月27-28日(周二、周三)
12月15-16日(周二、周三)

2016:
["2016/06/15-03:00"]
　1月26 - 27日
　3月15 - 16日
　4月26 - 27日
　6月14 - 15日
　7月26 - 27日
　9月20 - 21日
　11月1 - 2日
　12月13 - 14日
**/
function oyt(){
	var me = this, jsonArr = [], url = "ths-lem-ni-day-20170219.txt";
	this.data = jsonArr;
	//解析数据文件并创建[json1,json2]数据格式
	this.getData = function(){
		return $.ajax({url: url}).done(function(r){
			var arr = r.split("\n"),head = arr[0].split(","),l = arr.length;
			for(var i=1;i<l;i++){
				var tempArr = arr[i].split(","),le = tempArr.length,e={};
				for(var j=0;j<le;j++){
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
	this.init = function() {
		return this.getData().done(function() {
			if (me.head.indexOf(constant.KDJ_D) !== -1){
				return;
			}
			for (var i = 0, l = jsonArr.length; i < l; i++) {
				kdj.setKDJ(jsonArr[i]);
			}
		});
	};

	function fomc(){
		var fomc = ["2013/01/30-03:00","2013/03/20-03:00","2013/05/01-03:00","2013/06/19-03:00","2013/07/31-03:00","2013/09/18-03:00","2013/10/0-03:00","2013/12/18-03:00","2016/06/14-03:00"],	
		l=jsonArr.length;

		for(var i=0;i<l;i++){
			for(var j=0;j<fomc.length;j++){
				var e = jsonArr[i];
				if (fomc[j] === e.time){
					//console.log(e);
					console.log("时间："+e.time);
					//console.log("涨跌："+(e.pre.end-e.end));
					console.log("涨幅："+(e.pre.end-e.end)/e.pre.end*100+"%");
				}
			}	
		}
	}
	

	

	
	/**
	return{
		buildk:buildk,
		buildLine:buildLine,
		data : jsonArr
	}
	**/
}

