var request = require("request");		//request
var sync_request = require('sync-request');

var cheerio = require("cheerio");		//to explain html
var models = require('./models/deal');

var szphlx_config = require('./config/szphlx');

var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

var log4js = require('log4js');
var log4js_conf = require('./log4js.json')
log4js.configure(log4js_conf);

var logger = log4js.getLogger('log_date');

//query string
var _times;
var count = 0;
var _querystr = querystring.stringify(szphlx_config.getQuerystr(null, null, formatDate(), null));

//request parameter
var opt = {
	url: szphlx_config.url + _querystr,
	method: 'GET',
	gzip: true,
	headers: {
		'Cookie': szphlx_config.cookie
	}
}

//login 
request.post({
	'url':'http://qqbaidulecai.szphlx.com:58755/Home/LoginFunction',
	'form':{
		'userName':'qccaiwu10',
		'passWord':'1Qaz2Wsx'
	}},function(err,httpResponse,body){
		logger.info('login success!');
		fs.writeFile(path.join(__dirname,"cookies/szphlx_cookie.txt"),httpResponse.headers['set-cookie'],function(){
			logger.info('write cookie over!');
			requestInfo();
		})
	});



function requestInfo(){
	logger.debug("count: "+count+",第"+(count+1)+"页");
	if(count > 0){
		_querystr = querystring.stringify(szphlx_config.getQuerystr(count, null, formatDate(), null));
		opt.url = szphlx_config.url + _querystr;
		logger.info('page changed...');
	}
	request(opt, function(err, response, res) {
		logger.debug("url:" + opt.url.split('?')[1]);
		if (err) {
			logger.error('request withdraws list fail...')
			return;
		}
		if (response.statusCode == 200) {
			logger.info('request withdraws list success...')
			var $ = cheerio.load(res, {
				decodeEntities: false
			});

			var objArr = [];
			var trs = $('.simpleTable tr');
			logger.debug("本轮共获取:"+trs.length+"条数据");
			
			//first time load
			if(szphlx_config.querystr.pageIndex == 0){
				logger.info('first page...')
				_times = $('.RightTitle').eq(1).find('b').find('span').eq(0).text().split(' ')[3];
				if(_times % szphlx_config.querystr.pageSize == 0){
					_times = _times / szphlx_config.querystr.pageSize;
				}else{
					_times = Math.floor(_times / szphlx_config.querystr.pageSize) + 1;
				}
				logger.debug("一共需要请求："+_times+"次");
				if(trs.length == 0){
					logger.error("session fail...");
					return;
				}
			}

			//console.log(trs.length);
			var errArr = []; 			//error messages
			storageInfo($,trs,objArr,errArr);
			logger.debug("count:"+count+",_times:"+_times);
			if(count < _times-1){
				count++;
				process.nextTick(requestInfo);
			}
			
		}
	});
	
}



function sleep(sleepTime) {
	for (var start = +new Date(); + new Date() - start <= sleepTime;) {

	}
}

/*function checkOrder($, trs,objArr,errArr) {
	trs.each(function(index, tr) {
		if (index == 0) {
			//表頭元素
		} else {
			var obj = {};
			//订单号
			obj.orderId = $(this).find('td').eq(0).find('input').eq(0).attr('orderid');
			//用户号
			obj.userId = $(this).find('td').eq(1).text().replace(/\n/g, '').trim();
			//用户名
			obj.userName = $(this).find('td').eq(2).text().replace(/\n/g, '').trim();
			//用户手机
			obj.userTel = $(this).find('td').eq(3).text().replace(/\n/g, '').trim();

			var bankInfo = $(this).find('td').eq(4).text().replace(/\n/g, '').trim().split(' ');
			//银行类型
			obj.bank = bankInfo[0];
			//分行
			obj.branch = bankInfo[1];
			//银行账号
			obj.bankNo = bankInfo[2].replace(/\[/, '').replace(/\]/, '');
			//提现地址
			obj.withdrawAddr = $(this).find('td').eq(5).text().replace(/\n/g, '').trim().replace(' ', '-');

			var amountInfo = $(this).find('td').eq(6).text().replace(/\n/g, '').trim().replace(/￥/g, '').split(' / ');
			//申请金额
			obj.amountBeforeFee = amountInfo[0].replace(/,/g, '');
			//到账金额
			obj.amountAfterFee = amountInfo[1].replace(/,/g, '');
			//申请时间
			obj.applyTime = $(this).find('td').eq(7).text().replace(/\n/g, '').trim();
			//查询链接	 //'http://qqbaidulecai.szphlx.com:58755/FinanceManage/'+
			obj.refURL = $(this).find('td').eq(9).find('a').eq(0).attr('href');

			//访问远程接口同步访问订单是否已经存在
			var querystr1 = {
				'ordNum': '',
				'compOrdNo': obj.orderId,
				'remarks': '',
				'opTimeFrom': '12-11-2016',
				'opTimeTo': '12-12-2016',
				'orderList': 'All',
				'transtype': 'All',
				'appTimeFrom': '',
				'appTimeTo': '',
				'applicationbank': '',
				'transerialno': '',
				'optTimeFrom': '',
				'optTimeTo': '',
				'chargetype': '',
				'estimatedamount': '',
				'MatchingMode': '',
				'PushStatus': ''
			}
			var _querystr1 = querystring.stringify(querystr1);

			try {
				var result = sync_request('GET', 'http://bsp.1oba.com:8686/TransactionManagement/OrderInquiry?' + _querystr1, {
					headers: {
						'Cookie': 'ASP.NET_SessionId=wjxt2ck4g1iu0rx0j4rpaou5; __RequestVerificationToken=y5tiMaMFppmrujHMipOoR4I5Tfks_06zsZjIxBUWJEGbH59D9_aYZWmD0DdjrXEG9UzdMw1HnPZl19MVzXKjKeEwIcyn3cq2-HJypJj2Lo3Ag_r3W70Eonmvrg2-GJAdJTIvrRNG5FJj1svJY5sS5A2; .ASPXAUTH=D3DD590B165FAF8031D4C5640D0AB2A9BFBBD5203854AE8B06C6B54AD95C39C93D81A161D8D5602B2E6DBED45D9F3B7E822F218AB663820F0AF239BBB019B4760219AD0E9D050F54516BB8F4BCA3D1B60A1CC690D8A2896F1BD5B072DE4EC925335B7BF27DBFC409F200780D9D454CF6D04831466407D7742685D00028B4C99279868BC62BB1786B34E1FF495B7DE31D'
					}
				});
				var _$ = cheerio.load(result.getBody().toString(), {
					decodeEntities: false
				});
				//console.log(_$('.long-table tr').length);
				if (_$('.long-table tr').length == 2) { //说明有记录
					if (obj.amountAfterFee >= 5000) {
						obj.msg = "错误:大于等于5000不应该存在";
					} else {
						obj.msg = "正常:小于5000已包含";
					}
				} else if (_$('.long-table tr').length == 1) { //说明没有记录
					if (obj.amountAfterFee >= 5000) {
						obj.msg = "正确:不包含大于等于5000";
					} else {
						obj.msg = "错误:小于5000应该包含";
					}
				}

				if (obj.msg.indexOf('正确') == -1) { //没错
					console.log(index + ":success [" + obj.userId + "-" + obj.orderId + "-" + obj.amountAfterFee + "-" + _$('.long-table tr').length + "]");
				} else { //有错误
					var msg = index + ":错误【" + obj.userId + "-" + obj.orderId + "-" + obj.amountAfterFee + "-" + _$('.long-table tr').length + "-" + obj.msg + "】";
					errArr.push(msg)
					conosle.log(msg);
				}
				//console.log(obj);
				objArr.push(obj);
				sleep(10);
			} catch (e) {
				console.log(index + ":異常 [" + obj.userId + "-" + obj.orderId + "-" + obj.amountAfterFee + "-未獲取到]");
			}
		}
	});
}*/

function storageInfo($, trs,objArr,errArr){
	trs.each(function(index, tr) {
		if (index == 0) {
			//表頭元素
		} else {
			var obj = {};
			//订单号
			obj.orderId = $(this).find('td').eq(0).find('input').eq(0).attr('orderid');
			//用户号
			obj.userId = $(this).find('td').eq(1).text().replace(/\n/g, '').trim();
			//用户名
			obj.userName = $(this).find('td').eq(2).text().replace(/\n/g, '').trim();
			//用户手机
			obj.userTel = $(this).find('td').eq(3).text().replace(/\n/g, '').trim();

			var bankInfo = $(this).find('td').eq(4).text().replace(/\n/g, '').trim().split(' ');
			//银行类型
			obj.bank = bankInfo[0];
			//分行
			obj.branch = bankInfo[1];
			//银行账号
			obj.bankNo = bankInfo[2].replace(/\[/, '').replace(/\]/, '');
			//提现地址
			obj.withdrawAddr = $(this).find('td').eq(5).text().replace(/\n/g, '').trim().replace(' ', '-');

			var amountInfo = $(this).find('td').eq(6).text().replace(/\n/g, '').trim().replace(/￥/g, '').split(' / ');
			//申请金额
			obj.amountBeforeFee = amountInfo[0].replace(/,/g, '');
			//到账金额
			obj.amountAfterFee = amountInfo[1].replace(/,/g, '');
			//申请时间
			obj.applyTime = $(this).find('td').eq(7).text().replace(/\n/g, '').trim();

			objArr.push(obj);
		}
	});
	storage(objArr,errArr);
}

function formatDate(){
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	return y + "-" + m + "-" + d;
}

function storage(objArr,errArr){
	//node.js里面forEach是同步的？！
	objArr.forEach( function(element, index) {
		models.Withdraw.findOne({"userId":element.userId},function(err,obj){
			if(err){
				objArr.push(element);
				logger.error("find ["+ index + "] "+element.userName + " error...")
			}else{
				if(obj){		//user existed
					logger.warn("user ["+ index +"] " + element.userName + ' existed...');
				}else{
					models.Withdraw.create(element,function(err,doc){
						if(err){
							logger.error("insert {" + index + "] " + element.userName + " error...")
							objArr.push(element);
						}else{	//insert success
							logger.info("user [" + index + "] " + element.userName + ' insert success...')
						}
					});	
				}
			}
		});
	});
	
}