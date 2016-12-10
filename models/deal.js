var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var dbconf = require('../db_config');

mongoose.connect(dbconf.dbURL);

exports.Withdraw = mongoose.model('withdraw',new mongoose.Schema({
	userId:String,
	userName:String,
	userTel:String,
	bankType:String,
	bankNo:String,
	amount_before_fee:String,
	amount_after_fee:String,
	wdAddr:String,
	subTime:String,
	orderId:String
}));