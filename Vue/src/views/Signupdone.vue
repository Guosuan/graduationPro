<template>
<div>
  <headernav></headernav>
  <div>
    <p class="title">注册成功</p>
    <div class="btn-box">
      <router-link to="/signin" class="btn btn-signin" tag="button">立即登录</router-link>
    </div>
  </div>
</div>
</template>

<script>
import Headernav from '../components/Headernav.vue'

export default {
  name: 'Signupdone',
  components: {
      Headernav
    },
}
</script>

<style>
.title{
  margin: 60px;
  font-size:80px;
  text-align:center
}
.btn-box {
  text-align: center;
}
.btn-box button {
  display:inline-block;
  width:420px;
  margin: 20px;
  border-radius: 2px;;
  line-height: 38px;
  -webkit-transition: all .3s;
  -o-transition: all .3s;
  -moz-transition: all .3s;
  transition: all .3s;
  text-decoration: none
}
.btn-signin{
  background-color:#42b983;
  border: 1px solid#42b982;
  cursor: pointer;
  color: #fff 
}
.btn-signin:hover {
  background-color: #0ad82c
}
</style>