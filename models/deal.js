var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var dbconf = require('../db_config');

var db = mongoose.connect(dbconf.dbURL);

exports.Withdraw = mongoose.model('withdraw',new mongoose.Schema({
	orderId:String,
	userId:{type:String,require:true,unique:true},
	userName:String,
	userTel:String,
	bank:String,
	branch:String,
	bankNo:String,
	withdrawAddr:String,
	amountBeforeFee:Number,
	amountAfterFee:Number,
	applyTime:Date
}));