<template>
	<div class="address-page">
		<v-header></v-header>
		<v-process :step="1"></v-process>
		
		<div class="address">
			<div class="container">
				<div class="address-item">
					<h2 class="title">收货地址</h2>
					<ul class="list">
						<li v-for="(item,index) in addressListFilter" :class="{active:activeIndex==index}" @click="activeIndex=index">
							<div class="name">{{item.userName}}</div>
							<div class="street">{{item.streetName}}</div>
							
							<div class="tel">{{item.tel}}</div>
							<div class="bottom">
								<div class="default">
									<span v-if="item.isDefault" class="default">默认地址</span>
									<span v-else class="not-default" @click="setDefault(item)">设为默认</span>
								</div>
								<div class="delete">
									<i class="iconfont icon-lajitong" @click=""></i>
								</div>
							</div>
						</li>
						<li class="addAddress">
							<i class="iconfont icon-shizi"></i>
							<p>新增收货地址</p>
						</li>
					</ul>
					<div class="more" v-if="addressList.length>3">
						<a href="javascript:" v-if="!isShowMore" @click="isShowMore=true">查看更多 <i class="iconfont icon-xiajiantou"></i></a>
						<a href="javascript:" v-else  @click="isShowMore=false">收起 <i class="iconfont icon-shangjiantou"></i></a>
					</div>
				</div>

				<div class="address-item">
					<h2 class="title">快递方式</h2>
					<ul class="list">
						<li class="active">
							<div class="name">标准快递</div>
							<div class="price">免邮</div>
							<div class="description">承诺在7个工作日内到达，收到货后7天内无条件退货！</div>
						</li>
					</ul>
				</div>

				<div class="next">

					
					<a href="javascript:" @click="toComfirm" class="btn btn-danger rt">生成订单</a>
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
				
				activeIndex: 0,
				addressList: [],
				isShowMore: false
			}
		},
		mounted() {
			this.init();
		},
		computed: {
			addressListFilter() {
				return this.addressList.slice(0, this.limit)
			},
			limit () {
				if(this.isShowMore) {
					return this.addressList.length
				} else {
					return 3
				}
			}
		},
		methods: {
			init() {
				this.$axios.get('/api/users/addressList').then((res) => {
					var data = res.data;
					if (data.status == '0') {
						this.addressList = data.result;

						this.addressList.forEach((item, index) => {
							if (item.isDefault) {
								this.activeIndex = index;
								return false
							}
						})
					} else {
						console.log(data.msg)
					}
				})
			},

			setDefault(item) {
				this.$axios.post('/api/users/setDefaultAddress',{
					addressId: item.addressId
				}).then((res) => {
					var data =res.data;
					if(data.status == '0') {
						this.addressList.forEach((_item) => {
							_item.isDefault = false;
						})
						item.isDefault = true;
					} else {
						console.log(data.msg)
					}
				})
			},

			toComfirm() {
				// 将把选中的地址id传递到下个页面
				var curAddessId = this.addressList[this.activeIndex].addressId;
				this.$router.push({
					name: 'vComfirmOrder',
					query: {
						addressId: curAddessId
					}
				})
			}
		}
		
	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';
	
	.address-item {
		margin-bottom: 30px;
		.title {
			font-size: 16px;
			font-weight: bold;
			margin-bottom: 22px;
		}

		.list{
			display: flex;
			// justify-content: space-between;
			flex-wrap: wrap;

			li {
				width: 24%;
				height: 163px;
				border: 2px solid #ccc;
				padding: 20px;
				font-size: 14px;
				@include transition;
				cursor: pointer;
				margin: 0.5%;

				// &:nth-child(4n) {
				// 	margin-right: 0;
				// }

				&:hover {
					border-color: $c2;
				}

				&.active {
					border-color: $c2;
					.bottom {
						.not-default {
							display: inline;
						}
					}
				}

				&.addAddress {
					text-align: center;

					i {
						font-size: 50px;
						margin: 20px 0;
					}
				}

				@media (max-width: 768px) {
					width: 49%;
				}

			}

			.name {
				font-size: 16px;
				padding-bottom: 10px;
			}

			.street {
				line-height: 20px;
				height: 20px * 2;
				overflow: hidden;
			

			}

			.tel {
				line-height: 30px;
				@include ellipsis;
			}


			.bottom {
				display: flex;
				justify-content: space-between;
				margin-top: 10px;

				.default {
					color: $c2;
				}

				.not-default {
					display: none;
					@include transition;

					&:hover {
						color: $c1;
					}
				}

				.delete i{
					font-size: 30px;
					margin-top: -10px;
					@include transition;

					&:hover {
						color: $c2;
					}
				}
			}

			.price {
				font-size: 16px;
				margin-top: 10px;
				color: $c2;

			}

			.description {
				margin-top: 20px;
				line-height: 1.3;
			}
		}

		.more {
			text-align: center;
			line-height: 50px;
			@include transition;

			&:hover {
				color: $c2;
			}
		}

		@media(max-width: 768px) {
			.title {
				text-align: center;
			}

			.list li {
				width: 100%;
			}
		}
	}
</style>