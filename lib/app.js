var express = require('express');
var auth = require('./weixin/auth');
var config = require('../config/config');
var app = express();

app.get('/wx/check', auth.check);


console.log('LISTEN PORT: '+ config.PORT);
app.listen(config.PORT);