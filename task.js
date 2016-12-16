var cronJob = require('cron').CronJob;
var childp = require('child_process');

//秒 分 时 日 月 周
var task = new cronJob('0 55 23 * * *',function(){
	var task = childp.spawn(process.execPath,['app.js']);
} null, true, 'Asia/Chongqing');

task.start();