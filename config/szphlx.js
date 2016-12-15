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
		'pageSize': 200,
		'agentWay': -1,
		'startTime': '2016-12-12',
		'endTime': '2016-12-12',
		'slt_sort_type': -1,
		'money': '-1_-1'
	};
	this.cookie =getCookie("szphlx_cookie");
	this.getQuerystr = function(pageIndex,pageSize,startTime,endTime,agentWay,sltSortType,Money){
		if(typeof pageIndex != undefined && pageIndex !=null){
			this.querystr.pageIndex = pageIndex;
		}
		if(typeof pageSize != undefined && pageSize !=null){
			this.querystr.pageSize = pageSize;
		}
		if(typeof startTime != undefined && startTime !=null){
			this.querystr.startTime = startTime;
		}
		if(typeof endTime != undefined){
			if(endTime !=null){
				this.querystr.endTime = endTime;
			}else{
				this.querystr.endTime = this.querystr.startTime;
			}
		}
		
		
		//其他參數可以選傳
		if(typeof agentWay != undefined && agentWay != null){
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