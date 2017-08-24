<template>
	<div class="success-page">
		<v-header></v-header>
		<v-process :step="4"></v-process>

		<div class="success">
			<i class="iconfont icon-duigou1"></i>
			<div class="message">恭喜你！支付成功！</div>
			<div class="order-info">订单编号： {{$route.query.orderId}}</div>

			<div class="btns">
				<router-link to="/" class="btn btn-default">商品列表</router-link>
				<router-link to="/cart" class="btn btn-danger">返回购物车</router-link>
			</div>
		</div>
		<v-footer></v-footer>
	</div>
</template>

<script>
	export default {

	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';

	.success {
		text-align: center;
		.icon-duigou1 {
			font-size: 60px;
			margin: 50px 0;
			color: #30c15d;
		}

		.message {
			font-size: 24px;
			margin: 30px 0;
		}

		.order-info {
			font-size: 14px;
			color: $c1;
			margin: 50px 0;
		}
	}
	
</style>