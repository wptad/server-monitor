var exec = require('child_process').exec,
	child;
var async = require('async');
var config = require('../../config/config');

function getLatestServerStatus(callback) {

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

	async.forEach(config.TSAR_LATEST_STATUS, iterator, function (err) {
		callback(null, result);
	})
}


exports.getLatestServerStatus = getLatestServerStatus;