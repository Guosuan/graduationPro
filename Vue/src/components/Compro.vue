<template>
      <div class="pos-pro">
      <el-dialog title="发布项目" :visible.sync="dialogForm1Visible">
        <el-form :model="newpro">
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-col :span="14">
              <el-input type="text" v-model="newpro.proname" autocomplete="off" maxlength="30"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="项目简介" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="newpro.prointroduction" 
            :autosize="{ minRows: 2, maxRows: 7}" autocomplete="off" maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="项目需求" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="newpro.proreqirement" 
            :autosize="{ minRows: 2, maxRows: 7}" autocomplete="off" maxlength="255"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm1Visible = false">取 消</el-button>
          <el-button type="primary" @click="releasepro()">确 定</el-button>
        </div>
      </el-dialog>
      <div>
        <h2>我的项目</h2>
                <div id="release">
          <el-button @click="canrelease()">上传项目</el-button>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="getpro()" ref="tab">
        <el-tab-pane label="所有任务" name="all">
          <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span v-if="pro.whoTake !== ''">接受者：</span>
            <el-button type="text" class="student"  v-if="pro.whoTake !== ''" @click="userView(pro)">{{pro.whoTake}}</el-button>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button v-if="pro.status === 2" class="btn btn-signup" @click="getproname(pro)">去评价</el-button>
            <el-button v-if="pro.status === 2" class="btn btn-signup" @click="downpro(pro)">下载</el-button>
            <el-button v-if="pro.status === 3" class="btn btn-signup" disabled>等待学生评价</el-button>
            <el-button v-if="pro.status === 4" class="btn btn-signup" @click="geteva(pro,'stu')">学生评价</el-button>
            <el-button v-if="pro.status === 3||pro.status === 4" class="btn btn-signup" @click="geteva(pro,'com')">我的评价</el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="待提交" name="sub">
            <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span>接受者：</span>
            <el-button type="text" class="student" @click="userView(pro)">{{pro.whoTake}}</el-button>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button v-if="pro.status === 2" class="btn btn-signup judge" @click="dialogForm2Visible = true;
            evaluation.proname = pro.projectName">去评价</el-button>
          </el-card>
        </el-tab-pane>  
        <el-tab-pane label="待评价" name="eva">
          <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span>接受者：</span>
            <el-button type="text" class="student" @click="userView(pro)">{{pro.whoTake}}</el-button>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button v-if="pro.status === 3" class="btn btn-signup"  disabled>等待学生评价</el-button>
            <el-button v-if="pro.status === 3" class="btn btn-signup" @click="geteva(pro,'com')">我的评价</el-button>
            <el-button v-if="pro.status === 2" class="btn btn-signup" @click="downpro(pro)">下载</el-button>
            <el-button v-if="pro.status === 2" class="btn btn-signup judge" @click="getproname(pro)">去评价</el-button>
          </el-card>
        </el-tab-pane>
            <el-dialog title="用户信息" :visible.sync="dialogForm6Visible" v-if="studetail !== undefined">
              <p>用户名：{{studetail.username}}</p>
              <p v-if="haveIntroduction">简介：{{studetail.introduction}}</p>
              <p v-if="!haveIntroduction">简介：未编写</p>
            </el-dialog>  
            <el-dialog title="评价项目" :visible.sync="dialogForm2Visible">
              <el-form :model="evaluation">
                <el-form-item label="你的评价" :label-width="formLabelWidth">
                  <el-input type="textarea" v-model="evaluation.data" 
                  :autosize="{ minRows: 2, maxRows: 7}" autocomplete="off" maxlength="255"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm2Visible = false">取 消</el-button>
                <el-button type="primary" @click="evapro()">确 定</el-button>
             </div>
            </el-dialog>
            <el-dialog title="查看评价" :visible.sync="dialogForm3Visible">
              <p v-if="evaluation.stueva === ''">{{evaluation.comeva}}</p>
              <p v-if="evaluation.comeva === ''">{{evaluation.stueva}}</p>
            </el-dialog>
            <el-dialog title="项目详情" :visible.sync="dialogForm4Visible" v-if="detail !== undefined">
              <h2 style="display: inline">项目名称：{{detail[0].projectName}}</h2>
              <p>发布企业：{{detail[0].whoRelease}}</p>
              <p>项目简介：{{detail[0].projectIntroduction}}</p>
              <p>必备知识：{{detail[0].projectRequirement}}</p>
            </el-dialog>
        <el-tab-pane label="已完成" name="done">
          <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span v-if="pro.whoTake !== ''">接受者：</span>
            <el-button type="text" class="student" @click="userView(pro)">{{pro.whoTake}}</el-button>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button class="btn btn-signup" @click="geteva(pro,'stu')">学生评价</el-button>
            <el-button class="btn btn-signup" @click="geteva(pro,'com')">我的评价</el-button>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <h2 v-if="!haveProject" style="margin: 75px">暂无发布项目</h2>
    </div>
</template>

<script>
export default {
  name:'Compro',
  inject: ['reload'],
  data: function(){
    return{
      dialogForm1Visible: false,
      dialogForm2Visible: false,
      dialogForm3Visible: false,
      dialogForm4Visible: false,
      dialogForm6Visible: false,
      haveProject: false,
      activeName: 'all',
      prodata:undefined,
      detail: undefined,
      studetail: undefined,
      evaluation: {
        proname: '',
        data: '',
        stueva: '',
        comeva: ''
      },
      newpro: {
        proname:'',
        prointroduction: '',
        proreqirement: '',
        whorelease: this.$store.state.userInfo.username
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    getpro: function(){
      const message = {
        key: event.target.getAttribute('id'),
        who: JSON.parse(sessionStorage.getItem('userdata'))
      }
      this.axios.post('http://127.0.0.1:3000/searchpro',message).then(res => {
        this.prodata = res.data
        // console.log(this.prodata);
      }).catch(err => {
        console.log(err);
      })
    },
    canrelease(){
      const can = {
        username: this.$store.state.userInfo.username
      }
      this.axios.post('http://127.0.0.1:3000/can',can).then(res =>{
        if(res.data[0].canRelease === 1){
          this.dialogForm1Visible = true
        }else
        this.$message.error('你被封了，不能发布项目');
      })
    },
    userView(event) {
      const message = {
        username: event.whoTake
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
          this.studetail = res.data[0]
          if(this.studetail.introduction === ''){
            this.haveIntroduction = false
          }else
          this.haveIntroduction =true
          this.dialogForm6Visible = true
      })
    },
    downpro(event) {
      const message = {
        proname: event.projectName,
      }
      const link = document.createElement('a')
      this.axios.post('http://127.0.0.1:3000/downpro',message,{responseType: 'blob'}).then(res => {
        let blob = new Blob([res.data], {type: res.headers['content-type']})
        let objectUrl = URL.createObjectURL(blob) // 创建URL  
        link.href = objectUrl
        link.download = event.projectName // 自定义文件名
        link.click() // 下载文件
        URL.revokeObjectURL(objectUrl); // 释放内存
      }).catch(err => {
        console.log(err);
      })
    },
    getproname:function(event){
      this.evaluation.proname = event.projectName
      this.dialogForm2Visible = true
    },
    geteva:function(event,role){     
      const message = {
        proname: event.projectName,
      }
      this.axios.post('http://127.0.0.1:3000/showeva',message).then(res => {
        // console.log(res.data[0].companyEvaluation);
        if(role === 'stu'){
          this.evaluation.stueva = res.data[0].studentEvaluation
          this.evaluation.comeva = ''
        }else{
          this.evaluation.comeva = res.data[0].companyEvaluation
          this.evaluation.stueva = ''
        }
      }).catch(err => {
        console.log(err);
      })
      this.dialogForm3Visible = true
    },
    prodetail(event) {
      const message = {
        proname: event.projectName
      }
      this.axios.post('http://127.0.0.1:3000/prodetail',message).then(res => {
          this.detail = res.data[0]             
        }).catch(err => {
          console.log(err);
        })
        this.dialogForm4Visible = true
      },
    evapro: function(){
      const message = {
        who: JSON.parse(sessionStorage.getItem('userdata')),
        eva: this.evaluation.data,
        proname: this.evaluation.proname
      }
      // console.log(message); 
      if(message.eva === ''){
        this.$alert('请输入你的评价','提示',{confirmButtonText: '确定'})
      }else{
        this.axios.post('http://127.0.0.1:3000/evapro',message).then(res => {
          this.$alert(res.data,'提示',{confirmButtonText: '确定'})
          this.reload()
      }).catch(err => {
        console.log(err);
      })
      }
    },
    releasepro: function() {    
      if(this.newpro.proname === ''||this.newpro.prointroduction === ''||this.newpro.proreqirement === ''){
        this.$alert('请完整输入信息','提示',{confirmButtonText: '确定'})
      }else{
        this.axios.post('http://127.0.0.1:3000/releasepro',this.newpro).then(res => {
        this.$alert(res.data,'提示',{confirmButtonText: '确定'})
        this.reload()
        // this.dialogForm1Visible = false 
        }).catch(err => {
          console.log(err);
        })
      }
    },
  },
  mounted(){
    this.$nextTick(() => {
      const message = {
        key: 'tab-'+this.$refs.tab.currentName,
        who: JSON.parse(sessionStorage.getItem('userdata')),
      }
      this.axios.post('http://127.0.0.1:3000/searchpro',message).then(res => {
        this.prodata = res.data
        if(typeof this.prodata[0] === 'undefined'){
          this.haveProject = false
        }else{
          this.haveProject = true
        }       
      }).catch(err => {
        console.log(err);
      })
    })
  }
}
</script>

<style>
#release{
  position: absolute;
  top:135px;
  right: 500px;
}
</style>