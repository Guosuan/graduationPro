<template>
<div>
  <headernav></headernav>
  <div class="show-form">
    <el-main>
      <div class="prodetail-box" v-if="prodata !== undefined">
        <div style="margin: 15px">
          <h2 id="proname">{{prodata[0].projectName}}</h2>
          <div class="search">
            <i class="el-icon-star-off" v-if="!iscol" @click="collect()"></i>
            <i class="el-icon-star-on" v-if="iscol" @click="collect()"></i>
          </div>
          <a class="btn btn-signu" id="take" @click="btnClick()" v-if="is">接受项目</a>
          <div>
            <span>发布企业：</span>
            <el-button type="text" @click="userView(prodata[0])">{{prodata[0].whoRelease}}</el-button>
          </div>
          <p>项目简介：{{prodata[0].projectIntroduction}}</p>
          <p>必备知识：{{prodata[0].projectRequirement}}</p>
          <el-dialog title="用户信息" :visible.sync="dialogFormVisible" v-if="detail !== undefined">
            <p>用户名：{{detail.username}}</p>
            <p v-if="haveIntroduction">简介：{{detail.introduction}}</p>
            <p v-if="!haveIntroduction">简介：未编写</p>
          </el-dialog>
          <el-dialog title="添加收藏" :visible.sync="dialogForm1Visible" width="20%">
            <favoritefolder ref="f"></favoritefolder>
            <el-button @click="confirm('collect')">添加</el-button>
          </el-dialog>
        </div>  
      </div>
    </el-main>
  </div>
</div>
</template>

<script>
import Headernav from '../components/Headernav.vue'
import Favoritefolder from '../components/Favoritefolder.vue'

export default {
  name:'Prodetail',
  components: {
    Headernav,
    Favoritefolder
  },
  inject: ['reload'],
  data: function(){
    return {
      prodata:undefined,
      is:true,
      dialogFormVisible: false,
      dialogForm1Visible: false,
      detail: undefined,
      haveIntroduction: false,
      iscol: false
    }
  },
 created(){
    this.getProdata()
  },
  methods:{
    collect() {
      const iscom = JSON.parse(sessionStorage.getItem('userdata'))
      if(iscom === null){
        this.$confirm('请前往登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ path: '/signin' });
        }).catch((err) => {
          console.log(err);
        });
      }else if(iscom.role === 'student'){
        if(this.iscol === false){
          this.dialogForm1Visible = true
        }else{
          this.confirm('collect')
        }
      }else{
        this.$confirm('只有学生用户才能收藏项目', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    confirm(operation) {
      let message
      const p = this.$refs.f.setPath(this.$refs.f.$refs.tree.getNode(this.$refs.f.$refs.tree.getCurrentNode()));
      let path = ''
      for(let i=0;i<p.length;i++){
        path = path + '/' + p[i]
      }
      // console.log(path);
      if(this.iscol === false){
        message = {
          is: !this.iscol,
          role: this.$store.state.userInfo.role,
          proname: this.prodata[0].projectName,
          username: this.$store.state.userInfo.username,
          foldername:path,
          op: operation
        }
      }else{
        message = {
          is: !this.iscol,
          role: this.$store.state.userInfo.role,
          proname: this.prodata[0].projectName,
          username: this.$store.state.userInfo.username,
          op: operation
        }
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.iscol = !this.iscol
        this.$message.success(res.data[0])
        this.$refs.f.a = []
      }).catch(err => {
        console.log(err);
      })
    },
    getProdata: function(){ 
      this.$bus.$on('detail',msg => {        
        const isstu = JSON.parse(sessionStorage.getItem('userdata'))
        let message
        if(isstu === null||isstu.role !== 'student'){
          message = {
            proname: msg,
          }
        }else{
          message = {
            proname: msg,
            username: this.$store.state.userInfo.username
          }
        }
        this.axios.post('http://127.0.0.1:3000/prodetail',message).then(res => {
          this.prodata = res.data[0]
          // console.log(res.data[1]);
          if(res.data[1] === false){
            this.iscol = false
          }else if(res.data[1] === true){
            this.iscol = true
          }           
        }).catch(err => {
          console.log(err);
        })
      })
    },
    userView(event) {
      const message = {
        username: this.prodata[0].whoRelease
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
    btnClick:function() {
      const iscom = JSON.parse(sessionStorage.getItem('userdata'))
      if(iscom === null){
        this.$confirm('请前往登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ path: '/signin' });
        }).catch((err) => {
          console.log(err);
        });
      }else if(iscom.role === 'student'){
        const can = {
          username: this.$store.state.userInfo.username,
        }
        this.axios.post('http://127.0.0.1:3000/can',can).then(res => {
          if(res.data[0].canTake === 1){
            this.$confirm('确定要接受这个项目吗','提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              const message= {
                proname: this.prodata[0].projectName,
                whotake: this.$store.state.userInfo.username
              }
            this.axios.post('http://127.0.0.1:3000/takepro',message).then(res => {
              this.$alert(res.data,'提示',{
                confirmButtonText: '前往查看',
                callback:() => {
                  this.$router.push({ path: '/userstu/'+message.whotake });
                }
              })
            }).catch(err => {
              console.log(err);
            })
          }).catch(err => {
            console.log(err);
          })        
          }else{
            this.$message.error('你被封了，不能接受任务');
          }
        })
      }else{
          this.$alert('只有学生用户才能接受任务', '提示', {
          confirmButtonText: '确认',
          callback: action => {}
        });
      }
    }
  },
}
</script>

<style>
.show-form{
  margin: 50px;
  width: 100%;
}
.el-main{
  margin: 0 auto;
}
.prodetail-box{
  border: 1px solid #42b983;
  width: 100%;
  height: 442px;
}
.search{
  margin-left: 20px;
  display: inline-block;
  font-size: 25px;
}
#proname{
  display: inline-block;
}
</style>