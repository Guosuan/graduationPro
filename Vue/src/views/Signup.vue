<template>
  <div>
    <headernav></headernav>
      <div class="title-line">
        <span class="tit">注册</span>
      </div>
      <div class="form-signup">
          <div class="username-status-box">
              <input type="text" value placeholder="账号" v-model="username" 
               id="signin-username" autocomplete="off" @keyup="isExist()">
               <span class="error-message">{{exist}}</span>
          </div>
          <div class="password-status-box">
              <input type="password" value placeholder="密码" v-model="password" 
               id="signin-password" autocomplete="off">
          </div>
      </div>
      <div class="radio-box"> 
        <label for="role-student">
          <input type="radio" id="role-student" name="role" value="student" v-model="role">我是学生用户  
        </label>
        <label for="role-company">
          <input type="radio" id="role-company" name="role" value="company" v-model="role">我是企业用户
        </label>
      </div>
      <div class="btn-box">
          <router-link to="/signupdone" class="btn-signup"  tag="button" 
          :class="{'isdisabled':isdisable()}" :disabled="isdisable()" @click.native="btnClick()">注册</router-link>
      </div>
  </div>

</template>

<script>
import Headernav from '../components/Headernav.vue'

export default {
    name: 'Signup',
    components: {
      Headernav
    },
    data:function() {
      return{
        username: '', //用户名
        password: '', //密码
        role: 'student', //角色
        is:true, //账号是否存在
        exist: '' //账号存在时的提示信息
      }
    },
    methods:{
      isdisable:function(){
        if(this.password.length < 6||this.username.length < 6||this.exist === '账号已存在'){
          this.is = true
          this.isdisabled=true
        }else{
        this.is = false;
        this.isdisabled=false
        }
        return this.is
        return this.isdisabled
      },
      isExist:function() {
        const message = [{
          username: this.username, //用户名
          password: this.password, //密码
          role: this.role // 注册账号的角色，默认是学生
        },{click: '-1'} ] // 表示注册按钮没有被点击
        this.axios.post('http://localhost:3000/signup',message).then(res => {
          if(res.data === 'undefined'){
            this.exist = '';
          }else if(res.data === 'object'){
            this.exist = '账号已存在';
          } 
        }).catch(err => {
          console.log(err);
        })  
      },
      btnClick:function(){
        const message = [{
          username: this.username,
          password: this.password,
          role: this.role
        },{click: '1'} ]
        
        this.axios.post('http://127.0.0.1:3000/signup',message).then().catch(err => {
          console.error(err);
        });
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
.form-signup {
  text-align: center
}
.form-signup input {
  border: 1px solid;
  border-radius: 4px;
  margin-top:50px;
  width:414px;
  font-size: 14px;
  padding: 10px; 
}
.error-message{
  position:absolute;
  top: 185px;
  right: 470px;
  font-size: 13px;
  color: #f70958;
}
.radio-box {
  text-align: center;
  margin: 16px;
}
.radio-box label{
  margin: 100px;
}
.btn-box {
  text-align: center;
}
.btn-box button {
  display:inline-block;
  height: 36px;
  width:435px;
  border-radius: 2px;;
  line-height: 38px;
  -webkit-transition: all .3s;
  -o-transition: all .3s;
  -moz-transition: all .3s;
  transition: all .3s;
  text-decoration: none
}
.btn-signup{
  background-color:#42b983;
  border: 1px solid#42b982;
  cursor: pointer;
  color: #fff 
}
.btn-signup:hover {
  background-color: #0ad82c
}
.isdisabled {
  color: rgb(158, 158, 158);
  border: 1px solid#8b8b8b;
  background-color: #faf8f8;
  cursor: not-allowed
}
.isdisabled:hover{
  background-color: #faf8f8;
}
</style>