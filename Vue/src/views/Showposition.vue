<template>
<div>
  <headernav></headernav>
  <div class="show-form">
  <el-main>
    <div v-if="isfound()||is ===undefined" class="notfound-box">
      <h2 class="notfound-message">未检索到相关内容</h2>
    </div>
    <div class="project-message" v-if="!(isfound())||searchResult !== undefined">
      <el-card class="searchres" v-for="(pos,index) in searchResult" :key="index">
        <p style="display: inline-block">{{pos.positionName}}</p>
        <el-button type="text" class="company" @click="userView(pos)">{{pos.companyName}}</el-button>
        <router-link to="/posdetail" class="btn btn-signu" @click.native="sendPosdata(pos)">查看详情</router-link>
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
  name: 'Showposition',
  components: {
    Headernav
  },
  data: function(){
    return{
      is:undefined,
      searchResult:undefined,
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
        username: event.companyName
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
          this.searchResult = msg
        }
      })
      return this.is
    },
    sendPosdata:function(event) {
      const posdata = {
        comname: event.companyName,
        posname: event.positionName
      }
      this.$bus.$emit('detail', posdata);
    }
  }
}
</script>

<style>

</style>