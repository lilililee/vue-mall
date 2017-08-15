var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util')
var publicUtil = require('./utils/public-util');

var index = require('./routes/index');
var goods = require('./routes/goods');
var users = require('./routes/users');

var app = express();

// 连接数据库
var dbUrl = 'mongodb://127.0.0.1:27017/imooc';
publicUtil.connectMongdb(dbUrl);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 拦截登录验证
app.use(function(req, res, next) {
	if(req.cookies.userId) {	
		next();
	} else {
		// req.url:/goods/list?sortByPrice=1&pageSize=8&pageIndex=1&startPrice=&endPrice=
		// req.originalUrl:/goods/list?sortByPrice=1&pageSize=8&pageIndex=1&startPrice=&endPrice=
		// req.path:/goods/list
		// console.log('req.url:'+req.url)
		// console.log('req.originalUrl:'+req.originalUrl)
		// console.log('req.path:'+req.path)

		if(req.path == '/users/login' || req.path == '/users/logout' || req.path == '/goods/list') {
			console.log('req.path:'+req.path)
			next();
		} else {
			res.json({
				status: '3',
				msg: 'Not login',
				result: '当前未登录'
			})
		}
	}
})

app.use('/', index);
app.use('/goods', goods);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
