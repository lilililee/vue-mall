import Vue from 'vue'
import Router from 'vue-router'
import VGoodsList from '@/views/v-goods-list'
import VCart from '@/views/v-cart'

Vue.use(Router)

export default new Router({
  routes: [
  
  {
    path: '/cart',
    name: 'VCart',
    component: VCart,
    meta: {
      requireAuth: true
    } 
  },
  {
    path: '/*',
    name: 'VGoodsList',
    component: VGoodsList

  }

  ]
})
