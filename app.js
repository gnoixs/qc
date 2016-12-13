var request = require("request");
var cheerio = require("cheerio");
//var models = require('./models/deal');
var querystring = require('querystring');
var sync_request = require('sync-request');

//查询字符串
var querystr = {
	'pageIndex': 0,
	'pageSize': 200,
	'agentWay': -1,
	'startTime': '2016-12-12',
	'endTime': '2016-12-12',
	'slt_sort_type': -1,
	'money': '-1_-1'
}
var _querystr = querystring.stringify(querystr);

var opt = {
	url: 'http://qqbaidulecai.szphlx.com:58755/FinanceManage/WithdrawDetail?' + _querystr,
	method: 'GET',
	gzip: true,
	headers: {
		//'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		//'Accept-Encoding':'gzip, deflate, sdch',
		//'Accept-Language':'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4',
		//'Cache-Control':'max-age=0',
		//'Connection':'keep-alive',
		'Cookie': 'ASP.NET_SessionId=jnwymohjxrn5wu5f23q0s34h; %E8%B4%A2%E5%8A%A1%E7%AE%A1%E7%90%86=%E8%B4%A2%E5%8A%A1%E7%AE%A1%E7%90%86',
		//'Host':'qqbaidulecai.szphlx.com:58755',
		//'Upgrade-Insecure-Requests':'1',
		//'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36'
	}
}


request(opt, function(err, response, res) {
	if (err) {
		console.log(err);
		return;
	}
	if (response.statusCode == 200) {
		var $ = cheerio.load(res, {
			decodeEntities: false
		});
		var objArr = [];
		var trs = $('.simpleTable tr');
		var errArr = []; //错误消息

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

				var result = null;
				try {
					var result = sync_request('GET', 'http://bsp.1oba.com:8686/TransactionManagement/OrderInquiry?' + _querystr1, {
						headers: {
							//'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
							//'Accept-Encoding':'gzip, deflate, sdch',
							//'Accept-Language':'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4',
							//'Connection':'keep-alive',
							'Cookie': 'ASP.NET_SessionId=wjxt2ck4g1iu0rx0j4rpaou5; __RequestVerificationToken=y5tiMaMFppmrujHMipOoR4I5Tfks_06zsZjIxBUWJEGbH59D9_aYZWmD0DdjrXEG9UzdMw1HnPZl19MVzXKjKeEwIcyn3cq2-HJypJj2Lo3Ag_r3W70Eonmvrg2-GJAdJTIvrRNG5FJj1svJY5sS5A2; .ASPXAUTH=D3DD590B165FAF8031D4C5640D0AB2A9BFBBD5203854AE8B06C6B54AD95C39C93D81A161D8D5602B2E6DBED45D9F3B7E822F218AB663820F0AF239BBB019B4760219AD0E9D050F54516BB8F4BCA3D1B60A1CC690D8A2896F1BD5B072DE4EC925335B7BF27DBFC409F200780D9D454CF6D04831466407D7742685D00028B4C99279868BC62BB1786B34E1FF495B7DE31D',
							//'Host':'bsp.1oba.com:8686',
							//'Referer':'http://bsp.1oba.com:8686/TransactionManagement/OrderInquiry?ordNum=&compOrdNo=MWD1212000842081810615402&remarks=&opTimeFrom=12-11-2016&opTimeTo=12-12-2016&orderList=All&transtype=All&appTimeFrom=&appTimeTo=&applicationbank=&transerialno=&optTimeFrom=&optTimeTo=&chargetype=&estimatedamount=&MatchingMode=&PushStatus=',
							//'Upgrade-Insecure-Requests':'1',
							//'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36'
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
					sleep(100);
				} catch (e) {
					console.log(index + ":異常 [" + obj.userId + "-" + obj.orderId + "-" + obj.amountAfterFee + "-未獲取到]");
				}
			}
		});
		console.log("共有：" + errArr.length + "条错误");
		//console.log(objArr);
	}
});

function sleep(sleepTime) {
	for (var start = +new Date(); + new Date() - start <= sleepTime;) {

	}
}