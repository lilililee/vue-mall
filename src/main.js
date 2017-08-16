// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'
import 'babel-polyfill'				// 解决ie报错：polyfill-eventsource added missing EventSource to window
import Vuex from 'vuex'
import axios from 'axios'
// 全局配置
Vue.config.productionTip = false

// 插件配置
Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: '../static/loading-svg/loading-cylon.svg',
	loading: '../static/loading-svg/loading-cylon.svg'
})

Vue.use(VueInfiniteScroll)
Vue.use(Vuex);

// vuex定义的全局变量
const store = new Vuex.Store({
	state: {
		loginUserId:'',
		cartCount: 0
	},
	mutations: {
		updateUserInfo(state, loginUserId) {
			state.loginUserId = loginUserId;
		},
		updateCartCount(state,cartCount){
			state.cartCount += cartCount;
		}
	}
});

// 登录验证拦截
// 会在页面跳转前开始
// 可防止用户直接刷新进入其他界面
router.beforeEach((to, from, next) => {

	// 判断该路由是否需要登录权限
	// if (to.meta.requireAuth) {
	//     // 通过vuex state获取当前的loginUserId是否存在
	//     if(store.state.loginUserId) {   
	//     	next();
	//     }
	//     else { 
	//     	// 当为登录时跳转到首页
	//     	// 可通过query指定路由的参数
	//     	next({
	//     		path: '/'
	//           	// query: {redirect: to.fullPath}  
	//           })
	//     }
	// }
	// else {
	// 	next();
	// }


	
	// 会先执行此函数，再执行checkLogin
	// 导致登录且已进入其他界面时，直接刷新会跳转到'/'，虽然已经登录了，但是此时还未执行checkLogin
	// if( to.path != '/' && !store.state.loginUserId) {
	// 	next({path:'/'})
	// } else {
	// 	next();
	// }



	// 进入每个页面前，先判断是否已登录
	// 登陆后且在内部跳转会通过此判断，但是登陆后刷新不会通过
	if (store.state.loginUserId) {
		next();
	} else {
		// 每次刷新界面均进入此方法
		// 向后台发送cookie来验证是否已登录	
		axios.post('api/users/checkLogin').then((res)=> {
			var data = res.data;
			if(data.status == '0'){      		
				store.commit('updateUserInfo', data.result.userId)
				next();
			} else {
				// 如果不加此判断，直接写next('/')，会无限跳转到'/'造成死循环
				if (to.path == '/') {
					next();
				} else {
					next('/');
				}
				
			}
		})
		
	}
})



// 全局组件
import vHeader from './components/v-header'
import vPosition from '@/components/v-position'
import vFooter from '@/components/v-footer'
import vModal from '@/components/v-modal'

Vue.component('v-header',vHeader);
Vue.component('v-position',vPosition);
Vue.component('v-footer',vFooter);
Vue.component('v-modal',vModal);


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
	// beforeMount() {
	// 	this.checkLogin();
	// },
	// methods: {
	// 	checkLogin() {
	// 		console.log(222)
	// 		axios.post('api/users/checkLogin').then((res)=> {
	// 			var data = res.data;
	// 			if(data.status == '0'){      		
	// 				this.$store.commit('updateUserInfo', data.result.userId)
	// 			} else {
	// 				// 当未登录时，访问页面均会跳到商品列表页
	// 				// 一个是route，一个是router
	// 				if ( this.$route.path != '/') {
	// 					this.$router.push('/')
	// 				}
	// 			}


	// 		})
	// 	}
	// }
})
