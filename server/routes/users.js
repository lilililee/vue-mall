var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MUsers = require('../models/users');
var MGoods = require('../models/goods');

/* GET users listing. */
router.post('/login', function(req, res, next) {
	console.log('link: /users/login [POST]')
	var	queryParam = {
		userId: req.body.username,
		userPassword: req.body.password
	}

	MUsers.findOne(queryParam,function(err, doc){
		// console.log('have exec findOne')
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: 'error'
			})
		} else {
			// 查询不到时doc为null
			if (doc) {
				res.cookie('userId',doc.userId, {
					path: '/',
					maxAge: 1000 * 60 *60
				})
				res.json({
					status: '0',
					msg: 'success',
					result: doc
				})
			} else {
				res.json({
					status: '2',
					msg: 'failed',
					result: '用户不存在或密码错误!'
				})
			}
			
		}
	})

});

router.post('/logout', function(req, res, next){
	console.log('link: /users/logout [POST]')
	// 清除客户端cookie
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	});
	res.json({
		status:"0",
		msg:'',
		result:''
	})
})

router.post('/checkLogin', function(req, res, next){
	console.log('link: /users/checkLogin [POST]')
	
	res.cookie("userId", req.cookies.userId,{
		path:"/",
		maxAge:1000 * 60 *60
	});
	res.json({
		status:"0",
		msg:'',
		result: {
			userId: req.cookies.userId
		}
	})
})


router.post('/addToCart', function(req, res, next){
	console.log('link: /users/addToCart [POST]')

	MUsers.findOne({userId: req.body.userId}, function(err, doc){
		console.log(req.body.userId)
		if (doc) {
			var isExist = false;
			// 当购物车已有当前商品时
			doc.cartList.forEach(function(item) {
				if (item.productId == req.body.productId) {
					isExist = true;
					item.productNum += parseInt(req.body.productNum);
					doc.save(function(err, doc) {
						if(err) {
							res.json({
								status:"1",
								msg:'error',
								result:''
							})
						} else {
							res.json({
								status:"0",
								msg:'加入购物车成功',
								result:''
							})
						}
					})
				}
			})

			if (!isExist) {
				
				MGoods.findOne({productId: req.body.productId}, function(err2, doc2) {
					if (doc2) {
						// 生成一个准备加入购物车的对象

						var newDoc = {			
							productId: doc2.productId,
							productName: doc2.productName, 
							productPrice: doc2.productPrice,
							productImg: doc2.productImg,
							productNum: parseInt(req.body.productNum),
							checked: false
						}
					
						doc.cartList.push(newDoc);
						// 保存到用户购物车中
						doc.save(function(err, doc) {
							if(err) {
								res.json({
									status:"1",
									msg:'error',
									result:''
								})
							} else {
								res.json({
									status:"0",
									msg:'加入购物车成功',
									result:''
								})
							}
						})

					} else {
						res.json({
							status:"4",
							msg:'商品已下架',
							result:''
						})
					}
				})
			}

		}

	})

})


router.get('/cartList', function(req, res, next){
	console.log('link: /users/cartList [GET]')

	MUsers.findOne({userId: req.query.userId}, function(err, doc){
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			if(doc) {
				res.json({
					status: '0',
					msg: 'success',
					result: doc.cartList
				})
			} else {
				res.json({
					status: '2',
					msg: '用户不存在',
					result: ''
				})
			}
		}
	})
})

router.post('/deleteGood',function(req, res, next){
	console.log('link: /users/deleteGood [POST]')

	MUsers.findOne({userId: req.body.userId}, function(err, doc){
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			if(doc) {
				doc.cartList.forEach(function(item,index){
					
					if(item._id = req.body.deleteGoodId) {
						doc.cartList.splice(index, 1);
						return false;
					}
				})
				

				doc.save(function(err,doc2){
					if (err) {
						console.log(err)
					} else {

						res.json({
							status: '0',
							msg: 'success',
							result: doc2.cartList
						})
					}
				})
				
			} else {
				res.json({
					status: '2',
					msg: '用户已不存在',
					result: ''
				})
			}
		}
	})
})

module.exports = router;
