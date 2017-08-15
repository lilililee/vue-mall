// 连接数据库
exports.connectMongdb = (dbUrl) => {
	var mongoose = require('mongoose');
	// 连接数据库
	mongoose.connect(dbUrl);

	// 连接成功
	mongoose.connection.on('connected', function() {
		console.log('Mongdb: ' + dbUrl + ' is connected!');
	})
	// 连接失败
	mongoose.connection.on('error', function(err) {
		console.log('Mongdb: connect ' + dbUrl + ' error!');
		console.log('error: ' + err);
	})
	// 连接断开
	mongoose.connection.on('disconnected', function() {
		console.log('Mongdb: ' + dbUrl + ' is disconnected!');
	})

}