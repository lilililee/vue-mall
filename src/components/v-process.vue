<template>
	<div class="process">
		<div class="container">
			<ul>
				<li :class="step>0?'active':''">收货地址</li>
				<li :class="step>1?'active':''">生成订单</li>
				<li :class="step>2?'active':''">在线支付</li>
				<li :class="step>3?'active':''">完成订单</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: '',
		data() {
			return {

			}
		},
		props: {
			step: {
				type: Number,
				default: 0
			}
		}
	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';
	

	.process {
		padding: 40px 0;

		ul {
			display: flex;

			font-size: 14px;
			text-align: center;
		}


		li {
			flex: 1;
			position: relative;
			padding-bottom: 25px;
			border-bottom: 2px solid #ccc;
			letter-spacing: 3px;
			color: #999;

			&:after{
				content: '';
				display: block;
				width: 16px;
				height: 16px;
				border-radius: 8px;
				background: #ccc;
				position: absolute;
				left: 50%;
				bottom: -8px;
				margin-left: -8px;
			}

			&.active {
				color: $c1;
				border-color: $c1;

				&:after {
					background: $c1;
				}
			}
		}
	}
</style>