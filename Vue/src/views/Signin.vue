<template>
  <div>
    <headernav></headernav>
      <div class="title-line">
        <span class="tit">登录</span>
      </div>
      <div class="form-signin">
          <div class="username-status-box">
              <input type="text" value placeholder="账号" v-model="username"
               id="signin-username" autocomplete="off">
          </div>
          <div class="password-status-box">
              <input type="password" value placeholder="密码" v-model="password"
               id="signin-password" autocomplete="off">
          </div>
      </div>
      <div class="btn-box">
        <a class="btn btn-signin" @click="btnClick()">登录</a>
        <!-- <router-link to="" class="btn btn-signin" @click.native="btnClick()">登录</router-link> -->
        <router-link to="/signup" class="btn btn-signup">注册</router-link>
      </div>
  </div>

</template>

<script>
import Headernav from '../components/Headernav.vue'

export default {
    name: 'Signin',
    components: {
      Headernav
    },
    data: function() {
      return{
        username: '',
        password: '',
      }
    },
    methods: {
      btnClick:function(){
        const message = {
          username: this.username,
          password: this.password,
        }
        this.axios.post('http://127.0.0.1:3000/signin',message).then(res => {
          if(res.data === '账号不存在'){
            alert('账号不存在')
          }else if(res.data === '密码错误'){
            alert('密码错误')
          }else{
            this.$store.commit('signIn',res.data)
            this.$router.push({ path: '/home' });
          }
        }).catch(err => {
          alert('登录失败'+ err)
        })
      }
    }
}
</script>

<style scoped>
.title-line {
  width:980px;
  height:28px;
  margin:0 auto;
  border-bottom:1px solid #ddd;
  margin-bottom:28px;
  text-align:center
}
.title-line .tit {
  height:56px;
  line-height:56px;
  margin:0 auto;
  padding:0 20px;
  font-size:35px;
  background:#fff;
  text-align:center
}
.form-signin {
  text-align: center
}
.form-signin input {
  border: 1px solid;
  border-radius: 4px;
  margin-top:50px;
  width:414px;
  font-size: 14px;
  padding: 10px; 
}
.btn-box {
  text-align: center;
}
.btn-box a {
  margin: 32px;
  display:inline-block;
  height: 36px;
  border-radius: 2px;
  width: 184px;
  line-height: 38px;
  text-align: center;
  cursor: pointer;
  -webkit-transition: all .3s;
  -o-transition: all .3s;
  -moz-transition: all .3s;
  transition: all .3s;
  text-decoration: none
}
.btn-signin {
  background-color:#42b983;
  border: 1px solid#42b982;
  color: #fff 
}
.btn-signin:hover {
  background-color: #0ad82c
}
.btn-signup {
  border: 1px solid#8b8b8b;
}
.btn-signup:hover {
  background-color: #faf8f8
}
</style>