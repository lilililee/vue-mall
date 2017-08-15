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
	components: { App },
	mounted() {
		this.checkLogin();
	},
	methods: {
		checkLogin() {
			
			axios.post('api/users/checkLogin').then((res)=> {
				var data = res.data;

				if(data.status == '0'){      
					
					this.$store.commit('updateUserInfo', data.result.userId)
				} else {
					// 当未登录时，访问页面均会跳到商品列表页
					// 一个是route，一个是router
					if ( this.$route.path != '/') {
						this.$router.push('/')
					}
				}


			})
		}
	}
})
