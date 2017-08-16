const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MUsers = require('../models/users');
const MGoods = require('../models/goods');
const publicUtil = require('../utils/public-util');

/* GET users listing. */
router.post('/login', (req, res, next) => {
	console.log('link: /users/login [POST]')

	// 只需定义查询成功的回调
	let callback = doc => {
		if (doc.userPassword == req.body.userPassword) {
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
				msg: '用户不存在或密码错误!',
				result: ''
			})
		}
	}

	publicUtil.findUser(req, res, next, callback);

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


router.post('/addToCart', (req, res, next) => {
	console.log('link: /users/addToCart [POST]')

	let callback = (doc) => {
		console.log(doc)
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

module.exports = router;
