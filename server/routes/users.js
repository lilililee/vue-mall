const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MUsers = require('../models/users');
const MGoods = require('../models/goods');
const publicUtil = require('../utils/public-util');

/* GET users listing. */
router.post('/login', (req, res, next) => {
	console.log('link: /users/login [POST]')

	MUsers.findOne({
		userId: req.body.userId,
		userPassword: req.body.userPassword
	},(err, doc) => {

		if(err) {
			publicUtil.outputErrorInfo(res, err.msg)
		} else {
			if (doc) {
				res.cookie('userId',doc.userId, {
					path: '/',
					maxAge: 1000 * 60 *60
				})
				let cartCount = 0;
				doc.cartList.forEach(item => {
					cartCount += item.productNum
				})
				res.json({
					status: '0',
					msg: 'success',
					result: {
						cartCount: cartCount
					}
				})
			} else {
				let msg = '当前用户不存在'
				publicUtil.outputErrorInfo(res, msg, '2')
			}
			
		}
	})


});

router.post('/logout', (req, res, next) => {
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

router.post('/checkLogin', (req, res, next) => {
	console.log('link: /users/checkLogin [POST]')
	
	let callback = (doc) => {
		res.cookie("userId", req.cookies.userId,{
			path:"/",
			maxAge:1000 * 60 *60
		});
		let cartCount = 0;
		doc.cartList.forEach(item => {
			cartCount += item.productNum
		})
		res.json({
			status:"0",
			msg:'',
			result: {
				userId: req.cookies.userId,
				cartCount: cartCount
			}
		})
	}

	publicUtil.findUser(req, res, next, callback);
	
})


router.post('/addToCart', (req, res, next) => {
	console.log('link: /users/addToCart [POST]')

	let callback = (doc) => {
		let isExist = false;
		// 当购物车已有当前商品时
		doc.cartList.forEach(item => {
			if (item.productId == req.body.productId) {
				isExist = true;
				item.productNum += parseInt(req.body.productNum);
				// 保存到用户购物车中
				publicUtil.documentSave(res, doc);
				return false;
			}
		})

		if (!isExist) {
			let callback2 = (doc2) => {
				let newDoc = {			
					productId: doc2.productId,
					productName: doc2.productName, 
					productPrice: doc2.productPrice,
					productImg: doc2.productImg,
					productNum: parseInt(req.body.productNum),
					checked: false
				}

				doc.cartList.push(newDoc);
				// 保存到用户购物车中
				publicUtil.documentSave(res, doc);
			}

			publicUtil.findProduct(req, res, next, callback2);
		}

	}
	
	publicUtil.findUser(req, res, next, callback);

})


router.get('/cartList', (req, res, next) => {
	console.log('link: /users/cartList [GET]')

	let callback = (doc) => {
		res.json({
			status: '0',
			msg: 'success',
			result: doc.cartList
		})
	}

	publicUtil.findUser(req, res, next, callback);

})

router.post('/deleteGood',(req, res, next) => {
	console.log('link: /users/deleteGood [POST]')

	let callback = (doc) => {
		doc.cartList.forEach((item,index) => {
			if(item.productId == req.body.deleteGoodId) {
				doc.cartList.splice(index, 1);
				return false;
			}
		})

		publicUtil.documentSave(res, doc);

	};

	publicUtil.findUser(req, res, next, callback);
})


router.post('/changeSomeGoodNum',(req, res, next) => {
	console.log('link: /users/changeSomeGoodNum [POST]')

	// let fnRunDevTest = 11111111
	// 同时在publicUtil.findUser中定义 let fnRunDevTest = 2222222
	let callback = (doc)=> {
		// console.log(fnRunDevTest)	// 11111111
		// 此函数作用域指向当前执行环境
		doc.cartList.forEach((item) => {
			if (item.productId == req.body.productId) {
				if (item.productNum + req.body.num > 0) {
					item.productNum += req.body.num;
				}
				return false;
			}
		})

		publicUtil.documentSave(res, doc);
	}

	publicUtil.findUser(req, res, next, callback);
	
})


router.post('/checkedGood', (req, res, next) => {
	console.log('link: /users/checkedGood [POST]')

	// let fnRunDevTest = 11111111
	// 同时在publicUtil.findUser中定义 let fnRunDevTest = 2222222
	let callback = (doc)=> {
		// console.log(fnRunDevTest)	// 11111111
		// 此函数作用域指向当前执行环境

		if (req.body.productId == 'all') {
			doc.cartList.forEach((item) => {
				item.checked = true;
			})
		} else if (req.body.productId == 'none') {
			doc.cartList.forEach((item) => {
				item.checked = false;
			})
		} else {
			doc.cartList.forEach((item) => {
				if (item.productId == req.body.productId) {
					item.checked = !item.checked;
					return false;
				}
			})

		}
		
		publicUtil.documentSave(res, doc);
	}

	publicUtil.findUser(req, res, next, callback);
	
})


router.get('/addressList', (req, res, next) => {
	console.log('link: /users/addressList [GET]')

	let callback = (doc) => {
		res.json({
			status: '0',
			msg: 'success',
			result: doc.addressList
		}) 
	}

	publicUtil.findUser(req, res, next, callback);
})

router.post('/setDefaultAddress', (req, res, next) => {
	console.log('link: /users/setDefaultAddress [post]')

	let callback = (doc) => {
		doc.addressList.forEach((item) => {
			if (item.addressId == req.body.addressId){
				item.isDefault = true;
			} else {
				item.isDefault = false;
			}
			
		})

		publicUtil.documentSave(res, doc);
	}

	publicUtil.findUser(req, res, next, callback);
})


router.post('/createOrder', (req, res, next) => {
	console.log('link: /users/createOrder [post]')


	// console.log(req.body)
	let callback = (doc) => {
		let order = {
			orderId: new Date().getTime(),
			goodsList: [],
			adderssInfo: {},
			shipping: 0,
			totalNum: 0,
			totalPrice: 0,
			isPay: true
		}

		let filterList = [];

		doc.cartList.forEach((item) => {
			if (item.checked) {
				order.goodsList.push(item);
			} else {
				filterList.push(item);
			}
		})

		doc.cartList = filterList;
		// console.log(filterList)
		if (order.goodsList.length  == 0) {
			res.json({
				status: '7',
				msg: '未选中商品',
				result: ''
			})
		} else {
			doc.addressList.forEach(item => {
				if(item.addressId == req.body.addressId) {
					order.adderssInfo = item;
					return false;
				}
			})

			order.goodsList.forEach(item => {
				order.totalPrice += item.productNum * item.productPrice;
				order.totalNum += item.productNum;
			})

			// console.log(order)
			doc.orderList.push(order);

			doc.save((err, doc) => {
				if(err) {
					publicUtil.outputErrorInfo(res, err.msg);
				} else {
					res.json({
						status:"0",
						msg:'success!',
						result: order
					})
				}
			})


		}
	}

	publicUtil.findUser(req, res, next, callback);
})

module.exports = router;
