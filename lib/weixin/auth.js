var crypto = require('crypto');
var config = require('../../config/config');

function check(req, res, next) {

	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;

	var token = config.WEIXIN_TOKEN;


	var shasum = crypto.createHash('sha1');
	var shaResult = shasum.update(token + timestamp + nonce).digest('hex');


	console.log("shaResult: "+ shaResult);

	res.send(echostr);
}

exports.check = check;