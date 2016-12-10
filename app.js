var request = require("request");
var cheerio = require("cheerio");
var models = require('./models/deal');

var _url = "http://www.mszhongchou.com/Home/Inverst/invest/jiekuan_id/3.html";



request(_url,function(err,response,body){
	if(err){
		console.log(err);
		return;
	}
	if(response.statusCode == 200){
		var $ = cheerio.load(body);
		var lis = $('div.tbjl ul.main li');
		var objArr = [];

		for(var i = 0; i < lis.length; i+=4){
			var obj = {	};
			obj.user = lis.eq(i).text().trim();
			obj.money = lis.eq(i+1).text().trim();
			obj.time = lis.eq(i+2).text().trim();
			obj.type = lis.eq(i+3).text().trim();
			objArr.push(obj);
		}
		console.log(objArr);
	}
});