<template>
    <div class="pos-pro">
      <div>
        <h2>我的项目</h2>
      </div>
      <el-tabs v-model="activeName" @tab-click="getpro()" ref="tab">
        <el-tab-pane label="已接受" name="all">
          <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span v-if="pro.whoRelease !== ''">发布者：</span>
             <el-button type="text" v-if="pro.Release !== ''" @click="userView(pro)">{{pro.whoRelease}}</el-button>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 1" @click="uploadpro(pro)">提交</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 3||pro.status === 4" @click="geteva(pro,'com')">企业评价</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 2" disabled>等待企业评价</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 3" @click="getproname(pro)">去评价</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 4" @click="geteva(pro,'stu')">我的评价</el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="待提交" name="sub">
            <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span v-if="pro.Release !== ''">发布者：{{pro.whoRelease}}</span>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button class="btn btn-signup" @click="uploadpro(pro)">提交</el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="待评价" name="eva">
          <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span v-if="pro.Release !== ''">发布者：{{pro.whoRelease}}</span>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 2" disabled>等待企业评价</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 3" @click="geteva(pro,'com')">企业评价</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 3" @click="getproname(pro)">去评价</el-button>
          </el-card>
        </el-tab-pane>
            <el-dialog title="评价项目" :visible.sync="dialogForm2Visible">
              <el-form :model="evaluation" :label-width="formLabelWidth">
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
            <el-dialog title="上传文件" :visible.sync="dialogForm1Visible" width="40%">
              <div class="sub">
                <el-button @click="submitUpload">确认上传</el-button>
              </div>
              <el-upload 
              ref="upload" 
              action="http://127.0.0.1:3000/uploadpro"
              drag 
              :limit="1" 
              :on-exceed="handleExceed" 
              :before-upload="beforeUpload" 
              :data="uploadData" 
              :on-success="UploadSuccess" 
              :on-error="UploadFail"
              multiple 
              :auto-upload="false">
               <i class="el-icon-upload"></i>
               <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-dialog>
            <el-dialog title="项目详情" :visible.sync="dialogForm4Visible" v-if="detail !== undefined">
              <h2 style="display: inline">项目名称：{{detail.projectName}}</h2>
              <p>发布企业：{{detail.whoRelease}}</p>
              <p>项目简介：{{detail.projectIntroduction}}</p>
              <p>必备知识：{{detail.projectRequirement}}</p>
            </el-dialog>
            <el-dialog title="用户信息" :visible.sync="dialogForm6Visible" v-if="comdetail !== undefined">
              <p>用户名：{{comdetail.username}}</p>
              <p v-if="haveIntroduction">简介：{{comdetail.introduction}}</p>
              <p v-if="!haveIntroduction">简介：未编写</p>
            </el-dialog>
        <el-tab-pane label="已完成" name="done">
          <el-card v-for="(pro,index) in prodata" :key="index">
            <p style="display: inline-block">{{pro.projectName}}</p>
            <span v-if="pro.Release !== ''">发布者：{{pro.whoRelease}}</span>
            <el-button class="btn btn-signup"  @click="prodetail(pro)">项目详情</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 3||pro.status === 4" @click="geteva(pro,'com')">企业评价</el-button>
            <el-button class="btn btn-signup" v-if="pro.status === 4" @click="geteva(pro,'stu')">我的评价</el-button>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
export default {
  name:'Stupro',
  inject: ['reload'],
  data: function(){
    return{
      dialogForm1Visible: false, //提交界面
      dialogForm2Visible: false, //评价界面
      dialogForm3Visible: false, //查看评价界面
      dialogForm4Visible: false, //项目详情界面
      dialogForm6Visible: false, //用户信息查看界面
      activeName: 'all',
      comdetail: undefined,
      prodata:undefined,
      detail:undefined,
      evaluation: {
        proname: '',
        data: '',
        comeva:'',
        stueva: ''
      },
      uploadData: {
        filename:''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    userView(event) {
      const message = {
        username: event.whoRelease
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
          this.comdetail = res.data[0]
          if(this.comdetail.introduction === ''){
            this.haveIntroduction = false
          }else
          this.haveIntroduction =true
          this.dialogForm6Visible = true
      })
    },
    uploadpro:function(event) {
      this.evaluation.proname = event.projectName
      this.dialogForm1Visible = true
      this.uploadData.filename = event.projectName
    },
    beforeUpload(file) {
      const isLt1G = file.size / 1024 / 1024 / 1024 < 1;
      if (!isLt1G) {
        this.$message.error('上传文件大小不能超过 1G!');
      }
      return isLt1G;
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
      this.reload()
    },
    UploadFail(err) {
      this.$alert('上传失败:'+err,'提示',{confirmButtonText: '确定'})
    },
    prodetail(event) {
      const message = {
        proname: event.projectName,
        op: 'justdetail'
      }
      this.axios.post('http://127.0.0.1:3000/prodetail',message).then(res => {
          this.detail = res.data[0]
        }).catch(err => {
          console.log(err);
        })
        this.dialogForm4Visible = true
      },
    getpro: function(){
      const message = {
        key: event.target.getAttribute('id'),
        who: JSON.parse(sessionStorage.getItem('userdata')),
      }
      this.axios.post('http://127.0.0.1:3000/searchpro',message).then(res => {
        this.prodata = res.data
      }).catch(err => {
        console.log(err);
      })
    },
    geteva:function(event,role){
      const message = {
        proname: event.projectName
      }
      this.axios.post('http://127.0.0.1:3000/showeva',message).then(res => {
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
    getproname:function(event){
      this.evaluation.proname = event.projectName
      this.dialogForm2Visible = true
    },
    evapro: function(){
      const message = {
        who: JSON.parse(sessionStorage.getItem('userdata')),
        eva: this.evaluation.data,
        proname: this.evaluation.proname
      }
      if(message.eva === ''){
        this.$alert('请输入你的评价','提示',{confirmButtonText: '确定'})
      }else{
        this.axios.post('http://127.0.0.1:3000/evapro',message).then(res => {
          this.$alert(res.data,'提示',{
            confirmButtonText: '确定',
          })
          this.reload()
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
      }).catch(err => {
        console.log(err);
      })
    })
  }
}
</script>

<style>

</style>