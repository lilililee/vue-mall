var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	"userId": String,
	"userPassword": String,
	"userName": String,
	"cartList": [
	{
		"productId": String,
		"productName": String,
		"productPrice": Number,
		"productImg": String,
		"productNum": Number,
		"checked": Boolean
	}
	],
	"addressList": [
	{
		"addressId": String,
		"userName": String,
		"streetName": String,
		"postCode": String,
		"tel": Number,
		"isDefault": Boolean
	}	
	],
	"orderList": Array
})


module.exports = mongoose.model('User', userSchema);