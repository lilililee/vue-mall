<template>
	<header class="header">
		<div class="container">

			<router-link to="/" class="logo lt">
				<img src="../assets/images/logo1.png" alt="">
			</router-link>
			
			<div class="login-cart rt">
				<a href="javascript:" class="username" v-show="isLogin"><i class="iconfont icon-yonghu"></i>{{loginUserId}}</a>
				<a href="javascript:" class="login" v-show="!isLogin" @click="isShowLoginModal=true;isShowLoginTips=false;">登录</a>
				<a href="javascript:" class="logout" @click="isShowExitModal=true" v-show="isLogin">退出</a>
				<router-link to="/cart" class="cart">
					<i class="iconfont icon-gouwucheshoppingcart"></i>
				</router-link>


			</div>


			
			<div class="md-overlay" @click.self="isShowLoginModal=false" :class="{'md-overlay-show': isShowLoginModal}">
				<div class="md-modal md-login" :class="{'md-modal-show': isShowLoginModal}">
					<i class="iconfont icon-guanbi01 close"  @click="isShowLoginModal=false;"></i>
					<div class="md-top">
						<h2>Login in</h2>
					</div>
					<div class="md-tips text-danger" v-show="isShowLoginTips">
						用户名不存在或密码错误
					</div>
					<div class="md-content">	
						
						<div class="login-input">
							<div class="username">
								<input type="text" placeholder="请输入用户名" v-model="username" @focus="isShowLoginTips=false">
							</div>
							<div class="password">
								<input type="password" placeholder="请输入密码" v-model="password" @focus="isShowLoginTips=false">
							</div>
						</div>
						<div class="login-btn" @click="login">登 录</div>
					</div>
				</div>
			</div>

			<v-modal :isShow.sync="isShowExitModal" class="md-add-cart-success">
				<div slot="msg" class="md-msg">
					是否退出？
				</div>

				<div slot="btns" class="md-btns">
					<a href="javascript:" class="md-btn-defult" @click="logout">确定</a>
					<a href="javascript:" class="md-btn-danger" @click="isShowExitModal=false">取消</a>
					
				</div>
			</v-modal>
		</div>
	</header>
</template>

<script>
	import axios from 'axios';
	// import { mapState } from 'vuex'

	export default {
		name: 'v-header',
		data() {
			return {
				username: 'admin',
				password: '123456',
				isShowLoginModal: false,
				isShowLoginTips: false,
				isShowExitModal: false
				
			}
		},
		computed: {
			loginUserId(){
				return this.$store.state.loginUserId;

			},
			isLogin() {
				return this.loginUserId != ''
			},
			
		},
		mounted(){
			
		},
		methods: {
			login() {
				axios.post('api/users/login',{
					username: this.username,
					password: this.password
				})
				.then((res) => {
					var data = res.data;
					if( data.status == '0'){
						this.isShowLoginModal = false;		
						this.$store.commit('updateUserInfo', this.username);
					} else if( data.status == '2' ) {
						this.isShowLoginTips = true;
					} else {
						console.log(data.msg)
					}
				})
			},
			logout() {
				axios.post('api/users/logout').then( res => {
					var data = res.data;
					if(data.status == '0'){	
						this.$store.commit('updateUserInfo', '');
						this.isShowExitModal=false;
						this.$router.push({path:'/'});   // 可以简写成'/'
						
						
					}
				})
			}
			


			
		}
	}
</script>
<style lang="scss" type="text/css">
	@import '../assets/sass/util.scss';
	.header {
		height: 72px;
		background: #fff;
		overflow: hidden;

		.logo {
			margin-top: -4px;
			margin-left: -18px;
		}



		.login-cart {
			margin-top: 20px;
			margin-right: 20px;

			.username {
				i{
					font-size: 23px;
					vertical-align: -3px;
				}


			}

			.login {
				font-size: 16px;			
			}

			.cart {
				i {
					font-size: 22px;
				}
			}
			

			a {
				@include transition;
				margin-left: 10px;
				&:hover {
					color: $c1;
				}
			}
			
		}
		.md-top {
			h2 {
				font-size: 18px;
				line-height: 40px;
				margin-bottom: 10px;
			}	
		}

		.md-content {
			// width: 440px;
			

			input {
				width: 100%;
				height: 43px;
				border: 1px solid #ddd;
				padding-left: 20px;
				font-size: 12px;
				margin-bottom: 20px; 
			}

			.login-btn{
				height: 40px;
				line-height: 40px;
				color: #fff;
				text-align: center;
				background: #009de6;

				cursor: pointer;
				transition: all 0.3s;


				&:hover {
					background: #61b1ef;
				}
			}

		}

	}
</style>