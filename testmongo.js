var models = require('./models/deal');

var obj = {
	userId:"test",
	userName:"test",
	userTel:"test",
	bankType:"test",
	bankNo:"test",
	amount_before_fee:12.3,
	amount_after_fee:12.30,
	wdAddr:"test",
	subTime:"test",
	orderId:"test"
}
models.Withdraw.create(obj,function(err,doc){
	if(err){
		console.log(err);
	}else{
		console.log("插入成功!");
	}
});