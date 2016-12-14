var fs = require('fs');
var path = require('path');

//讀取cookie信息
function getCookie(filename){
	var res = fs.readFileSync(path.join(__dirname,"../cookies/" + filename + ".txt"));
	return res.toString();
}

var szphlx = function(){
	this.url = 'http://qqbaidulecai.szphlx.com:58755/FinanceManage/WithdrawDetail?';
	this.querystr = {
		'pageIndex': 0,
		'pageSize': 0,
		'agentWay': -1,
		'startTime': '2016-12-12',
		'endTime': '2016-12-12',
		'slt_sort_type': -1,
		'money': '-1_-1'
	};
	this.cookie =getCookie("szphlx_cookie");
	this.getQuerystr = function(pageIndex,pageSize,startTime,endTime,agentWay,sltSortType,Money){
		//四個必要參數
		if(typeof pageIndex == undefined || typeof pageSize == undefined || typeof startTime == undefined || typeof endTime == undefined){
			throw Error("補充查詢參數");
		}
		this.querystr.pageIndex = pageIndex;
		this.querystr.pageSize = pageSize;
		this.querystr.startTime = startTime;
		this.querystr.endTime = endTime;
		
		//其他參數可以選傳
		if(typeof agentWay != undefined &&agentWay != null){
			this.querystr.agentWay = agentWay;
		}
		if(typeof sltSortType != undefined && sltSortType != null){
			this.querystr.slt_sort_type = sltSortType;
		}
		if(typeof Money != undefined && Money != null){
			this.querystr.money = Money;
		}
		return this.querystr;
	}
	
}

module.exports = new szphlx();