<template>
  <div id="app">

    <!-- 驼峰命名的props参数在标签内必须写成短横线隔开形式 -->
    <transition 
    name="ssstoggle" 
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    mode="out-in"
    :duration="300"
    >
    <router-view></router-view> 
  </transition>


</div>
</template>
<script>
// 整体引入样式
import 'animate.css';      
import './assets/sass/base.scss';      
import axios from 'axios'

export default {
  name: 'app',
  data() {
    return {
      // loginUserId: ''   
    }
  },
  mounted() {
    // this.checkLogin();
  },
  methods: {
    checkLogin() {

      axios.post('api/users/checkLogin').then((res)=> {
        var data = res.data;
        if(data.status == '0'){      

          this.loginUserId = data.result.userId; 
        }

        
      })
    }

  },
  components: {

  }
}
</script>
<style lang="scss" type="text/css">
  .toggle-enter {
    transform: translateY(-100%);
  }
  .toggle-enter-active,.toggle-leave-active {
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all 1s;
  }

  .toggle-enter-to, .toggle-leave {
    transform: translateY(0);
  }

  .toggle-leave-to {
    transform: translateY(100%);
  }

  // .toggle-enter-active, .toggle-leave-active {
  //   transition: opacity .5s
  // }
  // .toggle-enter, .toggle-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  //   opacity: 0
  // }
</style>


