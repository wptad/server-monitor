var express = require('express');
var message = require('./weixin/message');
var config = require('../config/config');
var weixin = require('weixin-api');
var tsar = require('./process/tsar');
var app = express();

// 解析器
app.use(express.bodyParser());
//app.use(xmlBodyParser);

// 接入验证
app.get('/wx/message', function(req, res) {

	// 签名成功
	console.log('Checking auth: ');
	console.log(req.query);
	if (weixin.checkSignature(req)) {
		res.send(200, req.query.echostr);
	} else {
		res.send(200, 'fail');
	}
});

// config
weixin.token = config.WEIXIN_TOKEN;


var serverReg= /^s([0-9]+)/;
var groupReg= /^g([0-9]+)/;
// 监听文本消息
weixin.textMsg(function(msg) {
	console.log("textMsg received");
	console.log(JSON.stringify(msg));

	var resMsg = {};
	var serverIndex;
	var groupIndex;
	if(serverReg.test(msg.content))
		serverIndex= msg.content.match(serverReg)[1];
	else if(groupReg.test(msg.content))
		groupIndex= msg.content.match(groupReg)[1];
	else {
		switch (msg.content) {
			case "文本" :
				// 返回文本消息
				resMsg = {
					fromUserName : msg.toUserName,
					toUserName : msg.fromUserName,
					msgType : "text",
					content : "这是文本回复",
					funcFlag : 0
				};
				weixin.sendMsg(resMsg);
				break;
			case "音乐" :
				// 返回音乐消息
				resMsg = {
					fromUserName : msg.toUserName,
					toUserName : msg.fromUserName,
					msgType : "music",
					title : "音乐标题",
					description : "音乐描述",
					musicUrl : "音乐url",
					HQMusicUrl : "高质量音乐url",
					funcFlag : 0
				};
				weixin.sendMsg(resMsg);
				break;

			case "图文" :

				var articles = [];
				articles[0] = {
					title : "PHP依赖管理工具Composer入门",
					description : "PHP依赖管理工具Composer入门",
					picUrl : "http://weizhifeng.net/images/tech/composer.png",
					url : "http://weizhifeng.net/manage-php-dependency-with-composer.html"
				};

				articles[1] = {
					title : "八月西湖",
					description : "八月西湖",
					picUrl : "http://weizhifeng.net/images/poem/bayuexihu.jpg",
					url : "http://weizhifeng.net/bayuexihu.html"
				};

				articles[2] = {
					title : "「翻译」Redis协议",
					description : "「翻译」Redis协议",
					picUrl : "http://weizhifeng.net/images/tech/redis.png",
					url : "http://weizhifeng.net/redis-protocol.html"
				};

				// 返回图文消息
				resMsg = {
					fromUserName : msg.toUserName,
					toUserName : msg.fromUserName,
					msgType : "news",
					articles : articles,
					funcFlag : 0
				}
				weixin.sendMsg(resMsg);
				break;
			default :
				break;
		}
	}


	if(serverIndex || groupIndex )
	{
		var start=0;
		var offset=1;
		var groupAmount= 4;

		if(serverIndex){
			start = +serverIndex;
		}else if(groupIndex){
			start = +groupIndex* groupAmount;
			offset= groupAmount;
		}
		tsar.getLatestServerStatus(start, offset, function(err,result){

			resMsg = {
				fromUserName : msg.toUserName,
				toUserName : msg.fromUserName,
				msgType : "text",
				content : "以下是当前的服务状态: \n"+result,
				funcFlag : 0
			};

			weixin.sendMsg(resMsg);
		});
	}

});

// 监听图片消息
weixin.imageMsg(function(msg) {
	console.log("imageMsg received");
	console.log(JSON.stringify(msg));
});

// 监听位置消息
weixin.locationMsg(function(msg) {
	console.log("locationMsg received");
	console.log(JSON.stringify(msg));
});

// 监听链接消息
weixin.urlMsg(function(msg) {
	console.log("urlMsg received");
	console.log(JSON.stringify(msg));
});

// 监听事件消息
weixin.eventMsg(function(msg) {
	console.log("eventMsg received");
	console.log(JSON.stringify(msg));
});

// Start
app.post('/wx/message', function(req, res) {

	// loop
	weixin.loop(req, res);

});
//app.get('/wx/message', message.check);
//app.post('/wx/message', message.receiveMessage);


console.log('LISTEN PORT: '+ config.PORT);
app.listen(config.PORT);
