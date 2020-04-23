<template>
<div>
  <div class="pos-pro" v-if="!showApplicant">
    <div v-if="$store.state.userInfo.role === 'student'">
      <h2>我的投递</h2>
    </div>
    <div v-if="$store.state.userInfo.role === 'company'">
      <h2 style="display: inline-block">已发布的职位</h2>
      <el-button @click="canrecruit()" style="margin-left: 70px">我要招聘</el-button>
    </div>
    <div>
      <el-card v-for="(pos,index) in positiondata" :key="index" body-style="padding: 1px;" shadow="hover" class="position">
        <p>{{pos.positionName}}</p>
        <span v-if="$store.state.userInfo.role === 'student'">发布者:
          <el-button type="text" @click="comDetail(pos)">{{pos.companyName}}</el-button>
        </span>
        <el-button type="text" @click="showDetail(pos)">职位简介</el-button>
        <el-button v-if="$store.state.userInfo.role === 'company'" type="text" @click="showApp(pos)">查看应聘者</el-button>
      </el-card>
      <h2 v-if="!havePosition" style="margin: 75px">暂无招聘信息</h2>
    </div>
    <el-dialog title="详细信息" :visible.sync="dialogForm1Visible" v-if="posdetail !== undefined">
      <h2>{{posdetail.positionName}}</h2><br>
      <p>职位简介：{{posdetail.positionIntroduction}}</p><br>
      <p>职位需求：{{posdetail.positiontRequirement}}</p>
    </el-dialog>
    <el-dialog title="企业信息" :visible.sync="dialogForm2Visible" v-if="companydetail !== undefined">
      <h2>{{companydetail.username}}</h2><br>
      <p>职位简介：{{companydetail.introduction}}</p>
    </el-dialog>
    <el-dialog title="发布招聘信息" :visible.sync="dialogForm3Visible">
      <el-form :model="newposition">
        <el-form-item label="职位名称" :label-width="formLabelWidth">
          <el-col :span="14">
            <el-input type="text" v-model="newposition.posname" autocomplete="off" maxlength="30"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="职位简介" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="newposition.positionIntroduction" 
          :autosize="{ minRows: 2, maxRows: 10}" autocomplete="off" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="职位需求" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="newposition.positiontRequirement" 
          :autosize="{ minRows: 2, maxRows: 10}" autocomplete="off" maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm3Visible = false">取 消</el-button>
        <el-button type="primary" @click="recruit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <div class="pos-pro" v-if="showApplicant||appDetail !== undefined">
    <h2 style="display: inline-block">{{appDetail[0].positionName}}</h2>
    <el-button style="margin-left: 20px" type="text" @click="closeApp()">返回</el-button>
    <div v-if="haveApplicant">
      <el-dialog title="学生信息" :visible.sync="dialogForm4Visible" v-if="studetail !== undefined">
        <h2>{{studetail.username}}</h2><br>
        <p>职位简介：{{studetail.introduction}}</p>
      </el-dialog>
      <el-card v-for="(app,index) in appDetail" :key="index" body-style="padding: 1px;" shadow="hover" class="position">
        <el-button type="text" @click="showUser(app)">{{app.stuname}}</el-button>
        <el-button size="small" circle class="el-icon-download down" @click="downRes(app)"></el-button>
      </el-card>
    </div>
    <div v-if="!haveApplicant" class="noApp">
      <h2>暂无简历投递</h2>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name:'Position',
  inject: ['reload'],
  data:function(){
    return{
      positiondata: undefined,
      dialogForm1Visible: false, //职位信息
      dialogForm2Visible: false, //公司信息
      dialogForm3Visible: false, //公司发布招聘信息
      dialogForm4Visible: false, //
      havePosition: false,
      haveApplicant: false,
      showApplicant: false,
      appDetail:undefined,
      posdetail: undefined,
      studetail: undefined,
      companydetail: undefined,
      newposition:{
        posname: '',
        positionIntroduction: '',
        positiontRequirement: '',
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    closeApp(){
      this.showApplicant = false
      this.appDetail = undefined
    },
    getpos(){
      const message = {
        role: this.$store.state.userInfo.role,
        username: this.$store.state.userInfo.username,
        op: 'showpos'
      }
      this.axios.post('http://127.0.0.1:3000/position',message).then((res) => {
        this.positiondata = res.data
        if(typeof this.positiondata[0] === 'undefined'){
          this.havePosition = false
        }else{
          this.havePosition = true
        } 
      }).catch((err) => {
        console.log(err);
      });
    },
    showDetail(event){
      const message = {
        comname:event.companyName,
        posname:event.positionName,
        op:'posdetail'
      }
      this.axios.post('http://127.0.0.1:3000/position',message).then((res) => {
        this.posdetail = res.data[0]
        this.dialogForm1Visible = true
      }).catch((err) => {
        console.log(err);
      });
    },
    comDetail(event){
      const message = {
        username: event.companyName
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then((res) => {
        this.companydetail = res.data[0]
        this.dialogForm2Visible = true
      }).catch((err) => {
        console.log(err);
      });
    },
    canrecruit(){
      const can = {
        username: this.$store.state.userInfo.username
      }
      this.axios.post('http://127.0.0.1:3000/can',can).then(res =>{
        if(res.data[0].canRecruit === 1){
          this.dialogForm3Visible = true
        }else
        this.$message.error('你被封了，不能发布招聘信息');
      })
    },
    recruit(){
      if(this.newposition.posname === ''||this.newposition.positionIntroduction === ''||this.newposition.positiontRequirement === ''){
        this.$alert('请完整输入信息','提示',{confirmButtonText: '确定'})
      }else{
        const message = {
          posname: this.newposition.posname,
          positionIntr: this.newposition.positionIntroduction,
          positiontReq: this.newposition.positiontRequirement,
          comname: this.$store.state.userInfo.username,
          op: 'recruit'
        }
        this.axios.post('http://127.0.0.1:3000/position',message).then(res => {
          if(res.data === '发布成功'){
            this.$message.success(res.data)
            this.reload()
          }else if(res.data === '职位已发布'){
             this.$message.error(res.data)
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    showApp(event){
      const message = {
        posname:event.positionName,
        comname:event.companyName,
        op:'appdetail'
      }
      this.axios.post('http://127.0.0.1:3000/position',message).then(res => {
        if(typeof res.data[0] === 'undefined'){
          this.appDetail = [event]
          this.haveApplicant = false
          this.showApplicant = true
        }else{
          this.appDetail = res.data
          this.haveApplicant = true
          this.showApplicant = true
        }
        // console.log(this.appDetail);
      }).catch(err => {
        console.log(err);
      })
    },
    downRes(event){
      const message = {
        stuname: event.stuname,
        comname: event.companyName,
        posname: event.positionName,
        op: 'downloadres'
      }
      const filename = event.stuname + '简历'
      const link = document.createElement('a')
      this.axios.post('http://127.0.0.1:3000/position',message,{responseType: 'blob'}).then(res => {
        let blob = new Blob([res.data], {type: res.headers['content-type']})
        let objectUrl = URL.createObjectURL(blob)  
        link.href = objectUrl
        link.download = filename
        link.click() 
        URL.revokeObjectURL(objectUrl);
      }).catch(err => {
        console.log(err);
      })
    },
    showUser(event){
      const message = {
        username: event.stuname
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.studetail = res.data[0]
        this.dialogForm4Visible = true
      })
    }
  },
  mounted(){
    this.getpos()
  },
}
</script>

<style>
.position{
  margin-top: 5px;
  height: 45px;
  min-width: 250px;
}
.position p{
  display: inline-block;
  margin: 10px;
}
.noApp{
  margin: 50px;
}
.down{
  float: right;
   transform:translate(-30%,20%);
}
</style>