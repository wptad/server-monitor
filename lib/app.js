var express = require('express');
var message = require('./weixin/message');
var config = require('../config/config');
var app = express();

app.get('/wx/message', message.check);
app.post('/wx/message', message.receiveMessage);


console.log('LISTEN PORT: '+ config.PORT);
app.listen(config.PORT);