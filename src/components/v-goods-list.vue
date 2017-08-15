<template>
	<div class="goods-list">
		<div class="container">
			<div class="sort-way">
				<span class="sort-by">Sort by:</span>
				<span class="default-tag">Default</span>
				<a href="javascript:" class="price" @click="reverseGoodsListSort">Price <i class="iconfont icon-jiantou-up" :class="{reverse: sortByPrice == -1}" ></i></a>
				<a href="javascript:" class="show-filter-btn" @click="showFilterNav">FILTER BY</a>
			</div>

			<div class="goods-display">

				<div class="filter-nav" id="filter-nav" @click="hiddenFilterNav" :class="{'is-show':filterIsShow}">
					<dl>
						<dt>PRICE:</dt>
						<dd @click="curFilter = 'all',chooseRangeGoodsList('','')" :class="{active: curFilter == 'all'}">All</dd>
						<dd v-for="(item,index) in filterRange" @click="curFilter = index,chooseRangeGoodsList(item.start,item.end)" :class="{active: curFilter == index}">{{item.start}} - {{item.end}}</dd>
					</dl>
				</div>
				
				<div class="goods-display-result">
					<ul>
						<li v-for="item in goodsList">
							<div class="content">
								<a href="#" class="img"  v-lazy:background-image="'../../static/' + item.productImg">

								</a>
								<div class="text">
									<h3>{{item.productName}}</h3>
									<div class="price">￥{{item.productPrice}}</div>
									<a href="javascript:" class="add-cart" @click="addToCart(item.productId)">加入购物车</a>
								</div>
							</div>
						</li>
					</ul>

					<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
					加载中
					</div>
				</div>
			</div>

		</div>
	</div>
	
</template>

<script>
	import axios from 'axios'

	export default {
		name: '',
		data() {
			return {
				filterRange: [				// 过滤金额范围
				{
					start: '0.00',
					end: '100.00'
				},
				{
					start: '100.00',
					end: '500.00'
				},
				{
					start: '500.00',
					end: '1000.00'
				},
				{
					start: '1000.00',
					end: '2000.00'
				}
				],
				goodsList: [],				// 商品数据
				curFilter: 'all',			// 当前金额范围
				filterIsShow: false,		// 小屏下filter控制器是否显示

				sortByPrice: 1,				// 金额排序方式
				pageSize: 8,				// 每页商品数量
				pageIndex: 1,				// 当前页码
				startPrice: '',				// 最小金额
				endPrice: '',				// 最大金额

				busy: false					// vue-infinite-scroll 插件控制

				isOver: false				// 当获取数据数目为0时为true

			}
		},
		computed: {
			loginUserId() {
				return this.$store.state.loginUserId
			}
		},
		mounted(){
			this.getGoodsList();
		},
		methods: {
			showFilterNav() {
				let filterNav = document.getElementById('filter-nav');
				let filterNavList = filterNav.getElementsByTagName('dl')[0];
				
				this.filterIsShow = true;
				setTimeout(() => {
					filterNavList.style.right = '0';
				},10)
			},
			hiddenFilterNav() {
				let filterNav = document.getElementById('filter-nav');
				let filterNavList = filterNav.getElementsByTagName('dl')[0];
				
				filterNavList.style.right = '-233px';
				setTimeout(() => {
					this.filterIsShow = false;
				},300)
			},
			getGoodsList() {
				if (isOver) return;	
				axios.get('/api/goods/list',{
					params: {
						sortByPrice: this.sortByPrice,
						pageSize: this.pageSize,
						pageIndex: this.pageIndex,
						startPrice: this.startPrice,
						endPrice: this.endPrice
					}
				})
				.then((res) => {
					var data = res.data;
					if (data.status == '0'){
						if( data.result.length == 0) {
							isOver = true;
						} else {
							this.goodsList = this.goodsList.concat(data.result);	
						}
						
					} else {
						console.log(data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
				})
			},
			reverseGoodsListSort() {
				this.pageIndex = 1;		
				this.sortByPrice = this.sortByPrice === 1? -1 : 1;
				this.getGoodsList();
			},
			chooseRangeGoodsList(startPrice, endPrice) {
				this.startPrice = startPrice;
				this.endPrice = endPrice;
				this.pageIndex = 1;
				this.getGoodsList();
			},
			loadMore() {
				this.busy = true;

				setTimeout(() => {
					this.pageIndex++;
					this.getGoodsList();
					this.busy = false;
				},1000)
			},
			addToCart(productId) {
				axios.post('/api/users/addToCart', {
					userId: this.loginUserId,
					productId: productId,
					productNum: 1
				})
			}

		}
	}
</script>

<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';
	
	.sort-way {
		margin-top: 60px;
		height: 57px;
		line-height: 57px;
		text-align: right;
		background: #fff;
		padding: 0 20px;

		span {
			margin-right: 20px;

			&.default-tag {
				color: $c2;
			}
		}

		.price {
			transition: all .3s;

			&:hover {
				color: $c2;
			}

			i {
				line-height: 1;
				vertical-align: -1px;
				margin-left: -5px;
			}

			.reverse {
				transform: rotate(180deg);
			}
		}

		.show-filter-btn {
			display: none;
		}

		@media (max-width: 768px){
			text-align: left;
			background: #f0f0f0;
			margin-top: 0;

			.sort-by {
				display: none;
			}
			.show-filter-btn {

				display: block;
				float: right;
				font-size: 12px;
				letter-spacing: 3px;
			}

		}
	}

	.goods-display {
		display: flex;
		padding-top: 30px;

		.filter-nav {
			width: 260px;
			padding: 0 20px;

			dt {
				font-weight: bold;
				margin-bottom: 32px;
			}

			dd {
				height: 26px;
				line-height: 26px;
				margin-bottom: 20px;		
				transition: padding-left .3s;
				cursor: pointer;


				&:hover,
				&.active {
					border-left: 2px solid $c2;
					padding-left: 12px;
				}
			}

			@media (max-width:768px) {
				display: none;
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.5);

				dl {
					position: absolute;
					right: -233px;
					top: 0;

					width: 233px;
					height: 100%;
					background: #fff;
					transition: all .5s;

					dt {
						height: 50px;
						line-height: 50px;
						padding: 0 18px;
						margin-bottom: 0;
					}

					dd {
						height: 40px;
						line-height: 40px;
						margin-bottom: 0;
						border-bottom: 1px solid #ddd;
						padding-left: 18px;		
						&:hover,
						&.active {

							padding-left: 22px;
						}
					}


				}

				&.is-show {
					display: block;
				}
			}
		}

		.goods-display-result {
			width: 100%;

			li {
				width: 25%;
				padding-left: 18px;
				margin-bottom: 18px;
				float: left;
				transition: all .7s;

				.content {
					border: 2px solid #eee;
					background: #fff;
					transition: all .7s;

					&:hover {
						border-color: $c2;
						box-shadow: 0 0 5px #ddd;
						transform: translateY(-5px);

					}
				}

				.text {
					padding: 20px 10px 10px;
				}

				.img {
					padding-top: 100%;
					display: block;
					background-position: center center;
					background-size: cover;
				}

				h3 {
					font-weight: bold;
					line-height: 20px;
					height: 40px;
					margin-bottom: 10px;
					overflow: hidden;
				}

				.price {
					line-height: 30px;
					color: $c1;
					font-size: 18px;
				}

				.add-cart {
					display: block;
					height: 40px;
					font-weight: bold;
					line-height: 40px;
					text-align: center;
					margin-top: 10px;
					border: 1px solid $c1;
					color: $c1;
					transition: all .4s;

					&:hover {
						background: #ffe5e6;
					}
				}

				@media (max-width: 992px) {
					width: 33.33333%;
					padding:0 6px;
					margin-bottom: 12px;
				}

				@media (max-width: 500px) {
					width: 50%;
					
				}
			}
		}
	}
</style>

