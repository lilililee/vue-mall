const mongoose = require('mongoose');
const MUsers = require('../models/users');
const MGoods = require('../models/goods');

let getRequestParams = (req) => {
	let params = {};
	switch (req.method) {
		case 'GET':
		params = req.query;
		break;
		case 'POST':
		params = req.body;
		break;
		default: 
		console.log(`无法处理的请求：${req.method}`);
	}
	return params;
}

let outputErrorInfo = (res, msg, status) => {
	console.log('Error!!!' + msg)
	status = status || '1'
	res.json({
		status: status,
		msg: msg,
		result: ''
	})
}

exports.outputErrorInfo = outputErrorInfo;

// 连接数据库
exports.connectMongdb = (dbUrl) => {
	// console.log(this)   this可访问到当前到处对象
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


// 查找用户
exports.findUser = (req, res, next, callback) => {
	// let fnRunDevTest = 2222222;
	if (!req.cookies.userId) {
		let msg = '当前用户未登录'
		outputErrorInfo(res, msg, '3');
	}

	MUsers.findOne({userId: req.cookies.userId},(err, doc) =>{
		if (err) {
			outputErrorInfo(res, msg);
		} else {
			if (doc) {
				callback(doc)
			} else {
				res.json({
					status: '2',
					msg: '用户不存在或密码错误!',
					result: ''
				})
			}
		}

	})
}

//查找产品
exports.findProduct = (req, res, next, callback) => {
	// let fnRunDevTest = 2222222;
	let params = getRequestParams(req);

	if (!params.productId) {	
		let msg = '传递产品id参数错误，应包含productId字段,当前参数：' + JSON.stringify(params);
		outputErrorInfo(res, msg);
	}
	
	MGoods.findOne({productId: params.productId},(err, doc) =>{
		if (err) {
			outputErrorInfo(res, err.msg);
		} else {
			if (doc) {
				callback(doc)
			} else {
				res.json({
					status: '6',
					msg: '商品已不存在!',
					result: ''
				})
			}
		}

	})
}

exports.updateUser = (req, res, next, query, handle) => {
	if (!req.cookies.userId) {
		let msg = '当前用户未登录'
		outputErrorInfo(res, msg, '3');
	}

	MUsers.update(query, handle, (err, doc) => {
		if(err){
			outputErrorInfo(res, err.msg);
		} else {
			res.json({
				status:"0",
				msg:'success!',
				result:''
			})
		}
	})
} 


exports.documentSave = (res, doc) => {
	if (doc.save) {
		doc.save((err, doc) =>  {
			if(err) {
				outputErrorInfo(res, err.msg);
			} else {
				res.json({
					status:"0",
					msg:'success!',
					result:''
				})
			}
		})
	} else {
		let msg = 'documentSave传入参数应为mongoose模型对象';
		outputErrorInfo(res, msg);
	}
}