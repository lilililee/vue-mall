var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MGoods = require('../models/goods');



/* GET users listing. */
router.get('/list', function(req, res, next) {
	console.log('link: /goods/list [POST]')
	// req.query 获取前端get传递的参数，数据类型均会转成String
	var sortByPrice = req.query.sortByPrice || 1;
	var pageSize = req.query.pageSize || 0;
	var pageIndex = req.query.pageIndex || 1;
	var startPrice = req.query.startPrice;
	var endPrice = req.query.endPrice;

	// 根据价格查找
	var queryParam = {};

	if(startPrice != '' && endPrice != '') {
		console.log(111)
		queryParam = {
			productPrice: {
				$gt: parseInt(startPrice),
				$lte: parseInt(endPrice)
			}
		}
	}
	// console.log(`queryParam: ${queryParamp.name}`)
	
	// 排序方式
	var sortParam = {
		productPrice: parseInt(sortByPrice)
	};

	// 跳过数目
	var skipParam = (parseInt(pageIndex) - 1) * parseInt(pageSize);

	// 最大显示数目
	var limitParam = parseInt(pageSize);

	// 准备查询要执行的操作,该步骤还未进行查询
	var finnalMGoods = MGoods.find(queryParam).sort(sortParam).skip(skipParam).limit(limitParam);

	// 此时开始查询，并必须要有回调
	finnalMGoods.exec(function(err, doc){

		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: 'error'
			})
		} else {
			console.log(doc)
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
