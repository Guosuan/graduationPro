import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from 'axios'
import VueBus from 'vue-bus'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import store from './store/index.js'

Vue.use(ElementUI);
Vue.use(VueBus)
Vue.config.productionTip = false
Vue.prototype.axios = axios

axios.defaults.headers.post['Content-Type'] = 'application/json';

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  let data = JSON.parse(sessionStorage.getItem('userdata'))
  store.state.userInfo = data
  let pa = to.path.split('/') 
  if(data){              
    if(pa.length === 2){  
      if(pa[1] === 'signin'||pa[1] === 'signup'||pa[1] === 'signupdone'){
        next({path:'/home'})
      }else if(pa[1] === 'admin'&&data.role !== 'admin'){
        next({path:'/home'})
      }else if(pa[1] === 'favorites'&&data.role !== 'student'){
        next({path:'/home'})
      }else{
        next()
      }
    }else{
      if(data.username === pa[2]){
        next()
      }else{
        next({path:'/home'})
      }
    }
  }else{
    if(to.meta.requireLog){
      next({path:'/signin'})
    }else if(pa[1] === 'signupdone'){
      next({path:'/signin'})
    }else{
      next();
    }
  }
  // next();
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
