var exec = require('child_process').exec,
	child;
var async = require('async');
var config = require('../../config/config');

function getLatestServerStatus(start, offset, callback) {

	var result = '';
	function iterator(command, finish) {
		exec(command,
			function (error, stdout, stderr) {
				if (error !== null) {
					result += error + '\n\r';
				}
				result += stdout + '\n\r';
				finish();
			});
	}
	async.forEach(config.TSAR_LATEST_STATUS.slice(start, offset+start), iterator, function (err) {
		callback(null, result);
	})
}

if(!module.parent){
	getLatestServerStatus(function(err, reuslt){
		console.log(err)
		console.log(result);
	})
}

exports.getLatestServerStatus = getLatestServerStatus;
