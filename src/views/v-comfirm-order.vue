<template>
	<div class="comfirm-page">
		<v-header></v-header>
		<v-process :step="2"></v-process>
		
		<div class="comfirm">
			<div class="container">
				<div class="cart">
					<h2 class="cart-title">生成订单</h2>
					<div class="cart-table">
						<ul class="t-head">		
							<li>商品</li>
							<li>单价</li>
							<li>数量</li>
							<li>总价</li>
							

						</ul>

						<ul class="t-body">
							<li v-for="item in cartList">
								<div class="name">
									<img :src="'../static/' + item.productImg" alt="item.productName">
									<h3>{{item.productName}}</h3>
								</div>
								<div class="price">
									{{item.productPrice | currency}}
								</div>
								<div class="count">
									<div class="count-btns">
										
										× {{item.productNum}}
										
									</div>
								</div>
								<div class="total-money">
									{{item.productPrice * item.productNum | currency}}
								</div>
							</li>
						</ul>
					</div>



				</div>


				<div class="finally-money">
					<ul>
						<li>
							<div class="title">
								商品总额：
							</div>
							<div class="money">
								{{totalMoney | currency}}
							</div>
						</li>
						<li>
							<div class="title">
								邮费：
							</div>
							<div class="money">
								{{shipping | currency}}
							</div>
						</li>
						<li>
							<div class="title">
								合计：
							</div>
							<div class="money">
								{{totalMoney + shipping | currency}}
							</div>
						</li>


					</ul>
				</div>


				<div class="next clear">

					<router-link to="./address" class="btn btn-default lt">返 回</router-link>
					<a href="javascript:" @click="createOrder" class="btn btn-danger rt">支付订单</a>
				</div>
			</div>

			
		</div>
<v-footer></v-footer>
	</div>

</template>

<script>
	export default {
		name: '',
		data() {
			return {
				cartList: [],
				shipping: 0

			}
		},
		mounted() {

			this.getCartList();

		},
		computed: {
			totalMoney() {
				var all = 0;
				this.cartList.forEach(function (item) {
					if (!item.checked) return
						all += item.productPrice * item.productNum;
				})
				return all
			}
		},
		methods: {
			getCartList() {
				this.$axios.get('/api/users/cartList',{
					params: {
						userId: this.loginUserId
					}
				}).then((res)=>{
					var data = res.data;
					if(data.status == '0') {

						this.cartList = data.result.filter((item)=> item.checked);
					} else {
						console.log(data.msg);
					}
				}).catch((err)=>{
					console.log(err);
				})
			},
			createOrder() {
				this.$axios.post('/api/users/createOrder',{
					addressId: this.$route.query.addressId
				}).then((res) => {
					var data = res.data;
					if(data.status == "0") {
						// console.log(data.result)
						this.$router.push({name: 'vSuccess',query:{orderId: data.result.orderId}});
						this.$store.commit('addCartCount', -data.result.totalNum)
					} else {
						console.log(data.msg);
					}
				})
			}
		}

	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';


	// 迁移到公共样式

</style>