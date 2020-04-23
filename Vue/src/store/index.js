import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//创建Vuex实例
const store = new Vuex.Store({
  state: {
    hassignin:false, //是否登录
    userInfo:{
      username:'',
      token:'', 
      role:'',
    }
  },
  mutations: {
    signIn(state, data) { // 第一个参数为 state 用于变更状态 登录
      state.hassignin = true
      state.userInfo = data
      let dataobjStr = JSON.stringify(data)
      window.sessionStorage.setItem("userdata", [dataobjStr])
    },
    signOut(state) { // 退出登录
      state.hassignin = false
      window.sessionStorage.removeItem("userdata")
      state.userInfo.token = ''
      state.userInfo.username = ''
      state.userInfo.role = ''
    },
  }
})

export default store