var crypto = require('crypto');
var config = require('../../config/config');

function check(req, res, next) {

	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;

	if(isAuth(signature,timestamp,nonce))
		res.send(echostr);
	else
		res.send('auth error');
}


function receiveMessage(req,res,next){
//	var signature = req.body.signature;
//	var timestamp = req.body.timestamp;
//	var nonce = req.body.nonce;
//	var echostr = req.body.echostr;

	console.log("BODY: ")
	console.log(req.body);

	console.log("REQ: ")
	console.log(req);

	res.send('lala');
}

function isAuth(signature,timestamp,nonce){

	var token = config.WEIXIN_TOKEN;

	var arr= [];
	arr.push(timestamp);
	arr.push(nonce);
	arr.push(token);

	arr = arr.sort(function(a,b){
		if(a-b>0){
			return 1;
		}else{
			return -1;
		}
	})

	var str = arr.join('');

	var shasum = crypto.createHash('sha1');
	var shaResult = shasum.update(str).digest('hex');

	console.log("signature: "+ signature);
	console.log("timestamp: "+ timestamp);
	console.log("nonce: "+ nonce);
	console.log("shaResult: "+ shaResult);

	return shaResult === signature;
}

exports.check = check;
exports.receiveMessage = receiveMessage;