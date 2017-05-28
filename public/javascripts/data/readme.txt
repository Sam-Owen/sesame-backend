============点点芝麻，聚沙成塔
============芝麻量化策略

一、通达信数据。
1、数据来源：通达信-美股外盘-国际贵金属
2、导出尽量多的指标信息：右键-指标窗口个数-十个
3、导出更多的均线：右击均线-修改公式-参数5至8TAB页-增加120MA和250MA
4、数据导出：系统-数据导出-excel格式
5、数据整理：增加列头：time,start,highest,lowest,end,vol
		     修改列头：MA.MA5,MA.MA10,MA.MA20,MA.MA60,MA.MA120,MA.MA250
6、转换格式：另存为CSV文件，使用TEXT打开，复制内容到IDE，批量替换空格为空，列头最后加个,逗号。
7、DONE

二、同花顺数据。
1、数据来源：选中品种，进入K线，按F1
2、数据导出：数据导出-导出全部数据
3、数据整理：修改列头：time,start,highest,lowest,end,vol(总手)，vol列数据需要改为文本格式去掉数值,逗号。
4、转换格式：另存为CSV文件，使用TEXT打开，复制内容到IDE，批量替换"双引号为空，批量替换--双减号为空，增加列头：week，列头最后加个,逗号。
5、DONE
6、使用时需要自行计算其它指标，如MA,KDJ,MACD

三、公式
1、连续三个柱子代表一个趋势


四、接口查询
http://hq.sinajs.cn/list=sh601003,sh601001 国内实时数据，可查询A股和期货

http://biz.finance.sina.com.cn/stock/flash_hq/kline_data.php?symbol=sh600000&end_date=20150809&begin_date=20000101

http://stock2.finance.sina.com.cn/futures/api/json.php/GlobalFuturesService.getGlobalFuturesDailyKLine?symbol=NID


sinajs 接口中获取各大股指的详细代码
深成指：<script type="text/javascript" src="http://hq.sinajs.cn/list=sz399001" charset="gb2312"></script>
上证指：<script type="text/javascript" src="http://hq.sinajs.cn/list=sh000001" charset="gb2312"></script>
道琼斯：<script type="text/javascript" src="http://hq.sinajs.cn/list=int_dji" charset="gb2312"></script>
纳斯达克：<script type="text/javascript" src="http://hq.sinajs.cn/list=int_nasdaq" charset="gb2312"></script>
恒生指：<script type="text/javascript" src="http://hq.sinajs.cn/list=int_hangseng" charset="gb2312"></script>
日经指数：<script type="text/javascript" src="http://hq.sinajs.cn/list=int_nikkei" charset="gb2312"></script>
台湾加权：<script type="text/javascript" src="http://hq.sinajs.cn/list=b_TWSE" charset="gb2312"></script>
新加坡：<script type="text/javascript" src="http://hq.sinajs.cn/list=b_FSSTI" charset="gb2312"></script>

http://hq.sinajs.cn/list=s_sz399300   沪生300
http://hq.sinajs.cn/list=int_sp500    标普500
http://hq.sinajs.cn/list=int_ftse     英金融时报指数

期货
http://hq.sinajs.cn/rn=1318986550609&list=hf_CL,hf_GC,hf_SI,hf_CAD,hf_ZSD,hf_S,hf_C,hf_W

外汇
http://hq.sinajs.cn/rn=1318986628214&list=USDCNY,USDHKD,EURCNY,GBPCNY,USDJPY,EURUSD,GBPUSD,AUDHKD

rn为时间戳

德国的是http://hq.sinajs.cn/list=int_dax30
http://hq.sinajs.cn/list=b_FSSTI 新加坡
["b_UKX","英国富时100指数"]
["b_DAX","德国DAX指数","","bb","greenup",""],
["b_CAC","法CAC40指数","","bb","greenup",""],
["b_FTSEMIB","富时意大利MIB指数","","bb","greenup",""],
['b_SX5E','斯托克50','','bb','greenup','']
["hf_GC","黄金]
["hf_CL","原油]
["hf_NJAG","南交银]
["hf_CAD","LME铜]
["b_NKY","日经指数"]
["b_TWSE","中国台湾加权指数","","bb","greenup",""],
["b_AS30","澳交所普通股","","bb","greenup",""],


