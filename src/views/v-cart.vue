<template>
	<div>
		<v-header></v-header>
		<v-position>
			<span>购物车</span>
		</v-position>

		<div class="cart">
			<div class="container">
				<h2 class="cart-title">my cart</h2>
				<div class="cart-table">
					<ul class="t-head">		
						<li>items</li>
						<li>price</li>
						<li>quantity</li>
						<li>subtotal</li>
						<li>edit</li>
						
					</ul>

					<ul class="t-body">
						<li v-for="item in cartList">
							<div class="name">
								<i class="iconfont" :class="item.checked?'icon-duigou':'icon-yuan'" @click="checkedGood(item)"></i>
								<img :src="'../static/' + item.productImg" alt="item.productName">
								<h3>{{item.productName}}</h3>
							</div>
							<div class="price">
								{{item.productPrice | fMoney}}
							</div>
							<div class="count">
								<div class="count-btns">
									<a href="javascript:" class="btn-minus" @click="changeSomeGoodNum(item, -1)">-</a>
									<a href="javascript:" class="count-num">{{item.productNum}}</a>
									<a href="javascript:" class="btn-plus" @click="changeSomeGoodNum(item, 1)">+</a>
								</div>
							</div>
							<div class="total-money">
								{{item.productPrice * item.productNum | fMoney}}
							</div>
							<div class="delete">
								<i class="iconfont icon-lajitong" @click="deleteGoodId=item.productId;isShowDeleteGoodModal=true"></i>
							</div>
						</li>
					</ul>
				</div>

				<div class="cart-footer">
					<div class="select-all" v-if="isSelectAll">
						<i class="iconfont icon-duigou" @click="checkedGood('none')"></i>
						<span>Cancel select all</span>
					</div>
					<div class="select-all" v-else>
						<i class="iconfont icon-yuan" @click="checkedGood('all')"></i>
						<span>Select all</span>
					</div>
					<div class="total">
						<span class="title">Item total: </span> 
						<span class="all-total-money">{{totalMoney | fMoney}}</span>
						<router-link to="/checkout" class="checkout">checkout</router-link>
					</div>
				</div>
			</div>

			<v-modal :isShow.sync="isShowDeleteGoodModal" class="md-add-cart-success">
				<div slot="msg" class="md-msg">
					是否删除该商品？
				</div>

				<div slot="btns" class="md-btns">
					<a href="javascript:" class="md-btn-defult" @click="deleteGood">确定</a>
					<a href="javascript:" class="md-btn-danger" @click="isShowDeleteGoodModal=false">取消</a>
					
				</div>
			</v-modal>
		</div>

		<v-footer></v-footer>
	</div>
</template>

<script>
	import util from '@/assets/javascripts/util'
	import axios from 'axios'

	export default {
		name: '',
		data() {
			return {
				cartList: [],
				isShowDeleteGoodModal: false,
				deleteGoodId: ''
			}
		},	
		computed: {

			loginUserId(){
				return this.$store.state.loginUserId
			},
			isSelectAll(){
				return this.cartList.every(function(item){
					return item.checked;
				})	
			},
			totalMoney(){
				var all = 0;
				this.cartList.forEach(function (item) {
					if (!item.checked) return
						all += item.productPrice * item.productNum;
				})
				return all
			}

		},
		mounted() {	
			if(this.loginUserId) {
				this.getCartList();
			}
		},
		watch: {
			loginUserId(){
				
				this.getCartList();
			}
		},	
		methods: {
			getCartList() {
				axios.get('/api/users/cartList',{
					params: {
						userId: this.loginUserId
					}
				}).then((res)=>{
					var data = res.data;
					if(data.status == '0') {
						this.cartList = data.result;
					} else {
						console.log(data.msg);
					}
				}).catch((err)=>{
					console.log(err);
				})
			},

			toggleSelectAll() {
				if (this.isSelectAll) {
					this.cartList.forEach(function(item){
						item.checked = false;
					})
				} else {
					this.cartList.forEach(function(item){
						item.checked = true;
					})
				}
				
			},
			changeSomeGoodNum(item, num) {
				if (item.productNum + num < 1) return;

				axios.post('/api/users/changeSomeGoodNum',{
					userId: this.loginUserId,
					productId: item.productId,
					num: num
				}).then(res=>{
					var data = res.data;
					if(data.status == '0') {
						item.productNum += num;
					} else {
						console.log(data.msg);
					}
				})
			},
			deleteGood() {
				axios.post('/api/users/deleteGood', {

					userId: this.loginUserId,
					deleteGoodId: this.deleteGoodId

				}).then((res) => {
					var data = res.data;
					if(data.status == '0'){
						// this.cartList = data.result;
						this.cartList.forEach((item,index) => {
							if(item.productId == this.deleteGoodId) {
								this.cartList.splice(index, 1);
								return false
							}
						})
					} else {
						console.log(data.msg);
					}
				}).catch((err) => {
					console.log(err)
				})

				this.isShowDeleteGoodModal = false;
			},
			checkedGood(args) {
				var productId = '';
				switch (args) {
					case 'all':
					productId = 'all';
					this.cartList.forEach(function(item){
						item.checked = true;
					})
					break;
					case 'none':
					productId = 'none';
					this.cartList.forEach(function(item){
						item.checked = false;
					})
					break;
					default: 
					productId = args.productId;
					args.checked = !args.checked;
				}
				axios.post('/api/users/checkedGood', {
					userId: this.loginUserId,
					productId: productId
				}).then((res) => {
					var data = res.data;
					if(data.status == '0') {
						
					} else {
						console.log(data.msg)
					}
				}).catch((err) => {
					console.log(err)
				})
			}
		},
		filters: {
			fMoney:util.fMoney
		}
	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';
	
	.cart{
		.cart-title {
			padding: 50px 0 30px 0;
			font-size: 22px;
			letter-spacing: 4px;
			text-transform: uppercase;

			@media (max-width:768px) {
				text-align: center;
				padding: 30px 0 20px 0;
			}
		}


		.cart-table {
			width: 100%;
			
			.t-head {
				// @include clearfix;
				display: flex;
				li {
					height: 40px;
					line-height: 40px;
					text-align: center;
					background: #605f5f;
					color: #fff;
					font-size: 16px;
					letter-spacing: 2px;
					text-transform: uppercase;

					&:nth-child(1) {
						width: 35%;
					}
					&:nth-child(2) {
						width: 15%;
					}
					&:nth-child(3) {
						width: 15%;
					}
					&:nth-child(4) {
						width: 20%;
					}
					&:nth-child(5) {
						width: 15%;
					}
				}
			}

			.t-body {
				border-left: 1px solid #ddd;
				border-right: 1px solid #ddd;


				li {
					vertical-align: middle;
					text-align: center;
					padding: 30px 0;
					display:flex;
					align-items: center;
					border-bottom: 1px solid #ddd;
					background: #fff;
					* {
						vertical-align: middle;
					}

				}
				.name{
					width: 35%;
					text-align: left;

					i {
						margin: 0 25px;
						font-size: 18px;
						cursor: pointer;
						color: $c2;

						
					}

					img {
						width: 78px;
						height: 78px;
						border: 1px solid #eee;
					}

					h3 {
						display: inline-block;
						margin-left: 25px;
						font-weight: bold;
						font-size: 15px;
						@include ellipsis;

					}
				}
				.price {
					width: 15%;
				}
				.count {
					width: 15%;

				}
				.total-money {
					width: 20%;
					color: $c1;

				}
				.delete {
					width: 15%;
					i{
						font-size: 33px;
						cursor: pointer;
					}
				}

				.count-btns {
					display: inline-flex;
					border: 1px solid #f0f0f0;
					border-radius: 3px;
					height: 32px;
					line-height: 32px;
					text-align: center;

					a {
						background: #f0f0f0;
						width: 35px;
						height: 100%;
					}

					.count-num {
						background: #fff;
					}
				}
				
			}



			


			@media (max-width:768px) {
				.t-head {
					display: none;
				}

				

				.t-body {
					border: none;
					li {
						border-top: 1px solid #eee;
						border-bottom: 1px solid #eee;
						margin-bottom: 20px;
						flex-wrap: wrap;
						padding: 5px 0;
						position: relative;
						justify-content: space-between;

						> div {
							padding: 10px 0;
						}
					}

					
					.name {
						width: 100%;
						padding-right: 50px;
						border-bottom: 1px solid #eee;
					}

					.delete {
						position: absolute;
						top: 25px;
						right: 14px;
						width: auto;
					}


					.price {
						display: none;
					}

					.count {
						margin-left: 25px;
					}

					.total-money{
						width: auto;
						margin-right: 20px;
					}


				}
			}
			

			

		}

		.cart-footer{
			display: flex;
			margin-top: 25px;
			border: 1px solid #ddd;
			height: 60px;
			line-height: 60px;
			justify-content: space-between;

			background: #fff;

			.select-all {
				i {
					margin: 0 25px;
					font-size: 18px;
					cursor: pointer;
					color: $c2;
				}

			}

			.total {
				font-size: 0;

				.title {
					font-size: 16px;
					vertical-align: 2px;
				}

				.all-total-money {
					margin: 0 20px;
					color: $c1;
					font-size: 18px;
					font-weight: bold;
				}

				.checkout{
					display: inline-block;
					height: 100%;
					width: 130px;
					font-weight: bold;
					background: $c1;
					text-align: center;
					text-transform: uppercase;
					letter-spacing: 3px;
					transition: all 0.3s;
					color: #fff;
					font-size: 16px;
					vertical-align: 2px;

					&:hover {
						background: #d1434a;
					}
				}
			}




		}




	}
</style>