import Vue from 'vue'
import Router from 'vue-router'
import vGoodsList from '@/views/v-goods-list'
import vCart from '@/views/v-cart'
import vAddress from '@/views/v-address'

Vue.use(Router)

export default new Router({
  routes: [
  
  {
    path: '/cart',
    name: 'vCart',
    component: vCart,
    meta: {
      requireAuth: true
    } 
  },
  {
    path: '/address',
    name: 'vAddress',
    component: vAddress,
    meta: {
      requireAuth: true
    } 
  },

  {
    path: '/*',
    name: 'vGoodsList',
    component: vGoodsList

  }

  ]
})
