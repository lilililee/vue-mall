var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
	"productId": String,
	"productName": String,
	"productPrice": Number,
	"productImg": String
})

// 后面可加第三个参数指定对应数据库集合，没有则自动匹配goods
// module.exports = mongoose.model('Good', productSchema, 'goods');	
module.exports = mongoose.model('Good', productSchema);	