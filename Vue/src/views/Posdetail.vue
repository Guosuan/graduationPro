<template>
  <div>
  <headernav></headernav>
  <div class="show-form">
    <el-main>
      <div class="prodetail-box" v-if="posdata !== undefined">
        <div style="margin: 15px">
        <h2 style="display: inline-block">职位名称：{{posdata[0].positionName}}</h2>
        <el-button class="send" v-if="!isapply" @click="uploadResume(posdata[0])">投递简历</el-button>
        <el-button class="send" v-if="isapply" disabled>已投递</el-button>
        <div>
          <span>发布企业：</span>
          <el-button type="text" @click="userView(posdata[0])">{{posdata[0].companyName}}</el-button>
        </div>
        <p>职位简介：{{posdata[0].positionIntroduction}}</p>
        <p>职位需求：{{posdata[0].positiontRequirement}}</p>
        <el-dialog title="用户信息" :visible.sync="dialogFormVisible" v-if="detail !== undefined">
          <p>用户名：{{detail.username}}</p>
          <p v-if="haveIntroduction">简介：{{detail.introduction}}</p>
          <p v-if="!haveIntroduction">简介：未编写</p>
        </el-dialog>
        <el-dialog title="上传简历" :visible.sync="dialogForm1Visible" width="40%">
          <div class="sub">
            <el-button @click="submitUpload">确认上传</el-button>
          </div>
          <el-upload 
            ref="upload" 
            action="http://127.0.0.1:3000/uploadresume"
            drag
            :limit="1" 
            :on-exceed="handleExceed" 
            :before-upload="beforeUpload" 
            :data="uploadData" 
            :on-success="UploadSuccess" 
            :on-error="UploadFail"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-dialog>
        </div>
      </div>
    </el-main>
  </div>
</div>
</template>

<script>
import Headernav from '../components/Headernav.vue'

export default {
  name:'Posdetail',
  components: {
    Headernav,
  },
  inject: ['reload'],
  data: function(){
    return {
      posdata:undefined,
      is:true,
      isapply: false,
      dialogFormVisible: false,
      dialogForm1Visible: false, //上传简历
      detail: undefined,
      haveIntroduction: false,
      uploadData:undefined,
    }
  },
  methods: {
    getPosdata: function(){ 
      this.$bus.$on('detail',msg => {
        let message
        const isstu = JSON.parse(sessionStorage.getItem('userdata'))
        if(isstu){
          if(isstu.role === 'student'){
          message = {
            posname: msg.posname,
            comname: msg.comname,
            stuname: this.$store.state.userInfo.username,
            op: 'getposdata'
          }
        }else if(isstu.role === 'company'||isstu.role === 'admin'){
          message = {
            posname: msg.posname,
            comname: msg.comname,
            op: 'getposdata'
          }
        }
        }else{
          message = {
            posname: msg.posname,
            comname: msg.comname,
            op: 'getposdata'
          }
        }      
        this.axios.post('http://127.0.0.1:3000/position',message).then(res => {
          this.posdata = res.data[0]
          if(isstu){
            if(res.data[1] === 'undefined'||isstu.role === 'company'||isstu.role === 'admin'){
              this.isapply = false
            }else
            this.isapply = true
          }else{
            this.isapply = false
          }
        }).catch(err => {
          console.log(err);
        })
      })
    },
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
    uploadResume(event){
      const isstu = JSON.parse(sessionStorage.getItem('userdata'))
      if(isstu){
        if(isstu.role === 'student'){
          const message = {
            username: isstu.username
          }
          this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
            if(res.data[0].canApply === 0){
              this.$message.error('你被封了，不能投递简历')
            }else{
              this.uploadData = {
                posname: event.positionName,
                comname: event.companyName,
                stuname: this.$store.state.userInfo.username,
                filename: event.positionName + '-' + this.$store.state.userInfo.username + '-' + event.companyName
              }
              this.dialogForm1Visible = true
            }
          }).catch(err => {
            console.log(err);
          })
      }else if(isstu.role === 'company'||isstu.role === 'admin'){
        this.$alert('只有学生用户才能接受任务', '提示', {
          confirmButtonText: '确认',
          callback: action => {}
        });
      }
      }else{
        this.$confirm('请前往登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ path: '/signin' });
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    beforeUpload(file) {
      const isLt30 = file.size / 1024 / 1024  < 30;
      if (!isLt30) {
        this.$message.error('上传文件大小不能超过 30MB!');
      }
      return isLt30;
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleExceed() {
      this.$message.warning('只能选择一个文件')
    },
    UploadSuccess() {
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    },
    UploadFail(err) {
      this.$alert('上传失败:'+err,'提示',{confirmButtonText: '确定'})
    },
  },
   created(){
    this.getPosdata()
  },
}
</script>

<style>
.send{
  position: absolute;
  right: 270px;
  top: 175px;
}
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
</style>