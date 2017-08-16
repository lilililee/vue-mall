const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MGoods = require('../models/goods');



/* GET users listing. */
router.get('/list', function(req, res, next) {
	console.log(req.methods)
	console.log('link: /goods/list [POST]')
	// req.query 获取前端get传递的参数，数据类型均会转成String
	let sortByPrice = req.query.sortByPrice || 1;
	let pageSize = req.query.pageSize || 0;
	let pageIndex = req.query.pageIndex || 1;
	let startPrice = req.query.startPrice;
	let endPrice = req.query.endPrice;

	// 根据价格查找
	let queryParam = {};

	if(startPrice != '' && endPrice != '') {
		queryParam = {
			productPrice: {
				$gt: parseInt(startPrice),
				$lte: parseInt(endPrice)
			}
		}
	}
	// console.log(`queryParam: ${queryParamp.name}`)
	
	// 排序方式
	let sortParam = {
		productPrice: parseInt(sortByPrice)
	};

	// 跳过数目
	let skipParam = (parseInt(pageIndex) - 1) * parseInt(pageSize);

	// 最大显示数目
	let limitParam = parseInt(pageSize);

	// 准备查询要执行的操作,该步骤还未进行查询
	let finnalMGoods = MGoods.find(queryParam).sort(sortParam).skip(skipParam).limit(limitParam);

	// 此时开始查询，并必须要有回调
	finnalMGoods.exec((err, doc)=> {

		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: 'error'
			})
		} else {
			setTimeout(()=>{
				res.json({
					status: '0',
					msg: 'success',
					result: doc
				})
			},100)		// 模拟延时时间
			
		}

	})

	

});

module.exports = router;
