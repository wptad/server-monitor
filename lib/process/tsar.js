var exec = require('child_process').exec,
	child;
var async = require('async');
var config = require('../../config/config');

function getLatestServerStatus(callback) {

	var result = '';

	function iterator(command, finish) {
		exec(command,
			function (error, stdout, stderr) {
//				console.log('stdout: ' + stdout);
//				console.log('stderr: ' + stderr);
				if (error !== null) {
//					console.log('exec error: ' + error);
					result += error + '\n';
				}
				result += stdout + '\n';
			});
	}

	async.forEach(config.TSAR_LATEST_STATUS, iterator, function (err) {
		callback(null, result);
	})
}


exports.getLatestServerStatus = getLatestServerStatus;