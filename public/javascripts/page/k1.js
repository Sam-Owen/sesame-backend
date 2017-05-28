var jsonArr = [];

main.init().done(function () {
    jsonArr = main.data;
}).done(build);

function build() {

    //kdj.dWay(o.data);
    //kdj.jWay(o.data);

    var data = new buildk();
    console.log(data);
    // 使用
    // 基于准备好的dom，初始化echarts图表
    var k1 = echarts.init(document.getElementById('k1'));

    k1.setOption(option = {
        backgroundColor: '#eee',
        animation: false,
        legend: {
            left: 'center',
            data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA60']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            extraCssText: 'width: 170px'
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                brush: {
                    type: ['lineX', 'clear']
                }
            }
        },
        brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
            }
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '50%'
            },
            {
                left: '10%',
                right: '8%',
                top: '60%',
                height: '15%'
            },
            {
                left: '10%',
                right: '8%',
                top: '80%',
                height: '15%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: data.x,
                axisLine: {onZero: false},
                splitLine: {show: false},
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
            }, {
                type: 'category',
                gridIndex: 1,
                data: data.x,
                axisLabel: {show: false},
                axisTick: {show: false},
                /**
                 axisPointer: {
	                        label: {
	                            formatter: function (params) {
	                                var seriesValue = (params.seriesData[0] || {}).value;
	                                return params.value
	                                + (seriesValue != null
	                                    ? '\n' + echarts.format.addCommas(seriesValue)
	                                    : ''
	                                );
	                            }
	                        }
	                    }
                 **/
            },
            {
                type: 'category',
                gridIndex: 2,
                data: data.x,
                axisLabel: {show: false},
                axisTick: {show: false},
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 100,
                axisLabel: {show: false},
                axisTick: {show: false},
                splitLine: {show: false},
            },
            {
                scale: true,
                gridIndex: 2,
                splitNumber: 5,
                //axisLabel: {show: false},
                //axisTick: {show: false},
                //splitLine: {show: false},
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1, 2],
                start: 98,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1, 2],
                type: 'slider',
                start: 98,
                end: 100
            }
        ],
        series: [
            {
                name: 'Dow-Jones index',
                type: 'candlestick',
                data: data.y,
                itemStyle: {
                    normal: {
                        color: '#06B800',
                        color0: '#FA0000',
                        borderColor: null,
                        borderColor0: null
                    }
                },
                tooltip: {
                    formatter: function (param) {
                        param = param[0];
                        return [
                            'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                            'Open: ' + param.data[0] + '<br/>',
                            'Close: ' + param.data[1] + '<br/>',
                            'Lowest: ' + param.data[2] + '<br/>',
                            'Highest: ' + param.data[3] + '<br/>'
                        ].join('');
                    }
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data: data.MA5,
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: data.MA10,
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: data.MA20,
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA60',
                type: 'line',
                data: data.MA60,
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA120',
                type: 'line',
                data: data.MA120,
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA250',
                type: 'line',
                data: data.MA250,
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5, color: '#ff00ff'}
                }
            },
            {
                name: 'MA500',
                type: 'line',
                data: data.MA500,
                smooth: true,
                lineStyle: {
                    normal: {
                        opacity: 0.5

                    }
                }
            },
            {
                name: 'MACD',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data[constant.MACD_BAR],
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList;
                            if (params.data >= 0) {
                                colorList = '#ef232a';
                            } else {
                                colorList = '#14b143';
                            }
                            return colorList;
                        },
                    }
                }
            },
            {
                name: 'DEA',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data[constant.MACD_DEA],
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'DIF',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data[constant.MACD_DIF],
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'k',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: data[constant.KDJ_K],
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'd',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: data[constant.KDJ_D],
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'j',
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: data[constant.KDJ_J],
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            }
        ]
    }, true);


}

/**
 //构建趋势线
 this.buildLine = function(){
	var x = [];
	var y = []; 
	
	var min = jsonArr[0].lowest;
	var max = jsonArr[0].highest; 
	var uc = 0,dc=0,rc=0;	
//	if (jsonArr[0].start > jsonArr[0].end){//绿柱
//		count = -1;
//	} else {//红白柱
//		count = 1;
//	}
	 
	for(var i=0;i<jsonArr.length;i++){
		var json = jsonArr[i];
		var pre = jsonArr[i].pre;
		var lowest, highest,start,end;
		
		$.each(json,function(k,v){
			if (k == "start"){
				start = parseFloat(v);
			}else if (k == "end"){
				end =parseFloat(v);
			}else if (k == "lowest"){
				lowest = parseFloat(v);
			}else if (k == "highest"){
				highest =parseFloat(v);
			}
		});
		
		if ( highest<max && lowest<min){
			//当天最低价小于近期最低点（创新低） 并且当天最高价【没有超过】近期最高点（创新高）
			//表示一根下行趋势柱子（三根才能决定一个趋势）
			down();
		}else if ( highest>max &&lowest >min){
			//当天最高价没有超过近期最高点（创新高） 并且 当天最低价【没有低于】近期最低点（创新低）
			//表示一根上行趋势柱子（三根才能决定一个趋势）
			up();
		} else if( highest>max && lowest<min ){
			if (end<pre.lowest){
				down();
			} else if (end>pre.highest){
				up();
			} else {
				y.push((lowest+highest)/2);
			}
			
		} else {
			y.push((lowest+highest)/2);
			
			if (rc>=3){
				dc=0;
				uc=0;
				min=lowest;
				max = highest;
			}
		}
	}
	function up(){
		max = highest;
		++uc;
		if (uc>=3){
			y.push(highest);
			dc=0;
			rc=0;
			min=lowest;
		}else{
			y.push((lowest+highest)/2);
			++rc;
		}
	}
	function down(){
		min = lowest;
		++dc;
		if (dc>=3){
			y.push(lowest);
			rc=0;
			uc=0;
			max = highest;
		}else{
			y.push((lowest+highest)/2);
			++rc;
		}
	}
	function right(){
		
	}
	console.log(y.length);
	return {x:x,y:y};
}
 **/


//构建K线
this.buildk = function () {
    var x = [];
    var y = [[]]; // 开盘，收盘，最低，最高
    var vol = [];
    var MA5 = [], MA10 = [], MA20 = [], MA60 = [];
    this.MA120 = [];
    this.MA250 = [];
    this.MA500 = [];

    var me = this;
    this[constant.MACD_DIF] = [];
    this[constant.MACD_DEA] = [];
    this[constant.MACD_BAR] = [];

    this[constant.KDJ_K] = [];
    this[constant.KDJ_D] = [];
    this[constant.KDJ_J] = [];


    for (var i = 0; i < jsonArr.length; i++) {
        var json = jsonArr[i];
        var yy = [];
        $.each(json, function (k, v) {
            if (k == constant.BASE_ATTR_DATE) {
                x.push(v);
            } else if (k == constant.BASE_ATTR_OPEN) {
                yy[0] = v;
            } else if (k == constant.BASE_ATTR_CLOSE) {
                yy[1] = v;
            } else if (k == constant.BASE_ATTR_LOW) {
                yy[2] = v;
            } else if (k == constant.BASE_ATTR_HIGH) {
                yy[3] = v;
                vol.push(v);
            } else if (k == constant.MA + 5) {
                MA5.push(v);
            } else if (k == constant.MA + 10) {
                MA10.push(v);
            } else if (k == constant.MA + 20) {
                MA20.push(v);
            } else if (k == constant.MA + 60) {
                MA60.push(v);
            } else if (k == constant.MA + 120) {
                me.MA120.push(v);
            } else if (k == constant.MA + 250) {
                me.MA250.push(v);
            } else if (k == constant.MA + 500) {
                me.MA500.push(v);
            } else if (k == constant.MACD_DIF) {
                me[constant.MACD_DIF].push(v);
            } else if (k == constant.MACD_DEA) {
                me[constant.MACD_DEA].push(v);
            } else if (k == constant.MACD_BAR) {
                me[constant.MACD_BAR].push(v);
            } else if (k == constant.KDJ_K) {
                me[constant.KDJ_K].push(v);
            } else if (k == constant.KDJ_D) {
                me[constant.KDJ_D].push(v);
            } else if (k == constant.KDJ_J) {
                me[constant.KDJ_J].push(v);
            }
        });
        y[i] = yy;
    }

    this.x = x;
    this.y = y;
    this.vol = vol;
    this.MA5 = MA5;
    this.MA10 = MA10;
    this.MA20 = MA20;
    this.MA60 = MA60;

}