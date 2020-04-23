<template>
<div>
  <headernav></headernav>
  <div class="show-form">
  <el-main>
    <div v-if="isfound()||is ===undefined" class="notfound-box">
      <h2 class="notfound-message">未检索到相关内容</h2>
    </div>
    <div class="project-message" v-if="!(isfound())||aaa !== undefined">
      <el-card class="searchres" v-for="(pro,index) in aaa" :key="index">
        <p style="display: inline-block">{{pro.projectName}}</p>
        <el-button type="text" class="company" @click="userView(pro)">{{pro.whoRelease}}</el-button>
        <router-link to="/prodetail" class="btn btn-signu" @click.native="sendProdata(pro.projectName)">查看详情</router-link>
      </el-card>
    </div>
      <el-dialog title="用户信息" :visible.sync="dialogFormVisible" v-if="detail !== undefined">
        <p>用户名：{{detail.username}}</p>
        <p v-if="haveIntroduction">简介：{{detail.introduction}}</p>
        <p v-if="!haveIntroduction">简介：未编写</p>
      </el-dialog>
  </el-main>
</div>
</div>
</template>

<script>
import Headernav from '../components/Headernav.vue'

export default {
  name: 'Showproject',
  components: {
    Headernav
  },
  data: function(){
    return{
      is:undefined,
      aaa:undefined,
      detail: undefined,
      haveIntroduction: false,
      dialogFormVisible: true
    }
  },
  created(){
    this.isfound()
  },
  methods:{
    userView(event) {
      const message = {
        username: event.whoRelease
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
          this.detail = res.data[0]
          if(this.detail.introduction === ''){
            this.haveIntroduction = false
          }else
          this.haveIntroduction =true
          this.dialogFormVisible = true
      })
    },
    isfound:function(){
      this.$bus.$on('foundres',msg =>{
        if(msg === '不存在'||msg.length === 0){
          this.is = true;
        }else{
          this.is = false;
          this.aaa = msg
        }
      })
      return this.is
    },
    sendProdata:function(proName) {
      this.$bus.$emit('detail', proName);
    }
  }
}
</script>

<style>
.show-form{
  margin: 50px;
}
.el-main{
  margin: 0 auto;
  width: 980px;
}
.notfound-message{
  margin: 180px;
  text-align: center;
  font-size: 40px;
  color: #549b7b;
}
.notfound-box{
  border: 1px solid #42b983;
  width: 100%;
  height: 442px;
}
.searchres{
  overflow: auto;
  margin: 10px;
}
.searchres p{
  margin: 20px;
}
.company {
  text-decoration: none;
  color: black;
}
.btn-signu {
  transform: translate(-10%, 35%);
  float: right;
  height: 36px;
  border-radius: 2px;
  width: 100px;
  line-height: 38px;
  text-align: center;
  cursor: pointer;
  -webkit-transition: all .3s;
  -o-transition: all .3s;
  -moz-transition: all .3s;
  transition: all .3s;
  text-decoration: none;
  background-color:#42b983;
  border: 1px solid#42b982;
  color: #fff 
}
.btn-signup:hover {
  background-color: #0ad82c
}
</style>

