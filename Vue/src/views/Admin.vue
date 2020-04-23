<template>
  <div>
  <headernav></headernav>
  <div class="show-form">
    <div class="user-info">
      <h2>用户信息</h2>
      <div v-if="admindata !== ''">
        <p>用户名：{{admindata.username}}</p>
        <p>用户类型：管理员</p>
      </div>
    </div>
    <div class="line"></div>
    <div class="pos-pro">
      <div>
        <h2>用户管理</h2>
      </div>
      <el-tabs v-model="activeName" @tab-click="getuser()" ref="tab">
        <el-tab-pane label="企业用户" name="com">
          <el-card v-for="(user,index) in userdata" body-style="padding: 1px;" shadow="hover" :key="index" class="card">
            <p>{{user.username}}</p>
            <el-button type="text" @click="opUser('view',user)">用户信息</el-button>
            <el-button type="text" v-if="user.canRelease === 1" @click="opUser('cannotRe',user)">禁止发布</el-button>
            <el-button type="text" v-if="user.canRelease === 0" @click="opUser('canRe',user)">允许发布</el-button>
            <el-button type="text" v-if="user.canRecruit === 1" @click="opUser('cannotRecruit',user)">禁止招聘</el-button>
            <el-button type="text" v-if="user.canRecruit === 0" @click="opUser('canRecruit',user)">允许招聘</el-button>
            <el-button type="text" @click="opUser('delete',user)">删除用户</el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="学生用户" name="stu">
          <el-card v-for="(user,index) in userdata" body-style="padding: 1px;" shadow="hover" :key="index" class="card">
              <p>{{user.username}}</p>
              <el-button type="text" @click="opUser('view',user)">用户信息</el-button>
              <el-button type="text" v-if="user.canTake === 1" @click="opUser('cannotTa',user)">禁止接受</el-button>
              <el-button type="text" v-if="user.canTake === 0" @click="opUser('canTa',user)">允许接受</el-button>
              <el-button type="text" v-if="user.canApply === 1" @click="opUser('cannotApply',user)">禁止投简历</el-button>
              <el-button type="text" v-if="user.canApply === 0" @click="opUser('canApply',user)">允许投简历</el-button>
              <el-button type="text" @click="opUser('delete',user)">删除用户</el-button>
          </el-card>
        </el-tab-pane>
        <el-dialog title="详细信息" :visible.sync="dialogForm1Visible" v-if="detail !== undefined">
          <el-form :model="detail" :label-width="formLabelWidth">
            <el-form-item label="用户名:" :label-width="formLabelWidth">
              <el-col :span="10">
                <p v-if="!changeusername" style="display: inline">{{detail.username}}</p>
                <el-button type="text" @click="changeusername = !changeusername" v-if="!changeusername">修改</el-button>
                <el-input type="text" size="small" v-model="detail.username" 
                 autocomplete="off" maxlength="16" v-if="changeusername" @keyup.native="opUser('isexist',detail)"></el-input>
              </el-col>
              <span class="error-message" id="another-errmsg">{{exist}}</span>
              <el-button type="text" @click="opUser('changeusername',detail)"
               v-if="changeusername" :disabled="exist === '账号已存在'">确认</el-button>
              <el-button type="text" @click="cancel" v-if="changeusername">取消</el-button>
            </el-form-item>
            <el-form-item label="密码:" :label-width="formLabelWidth">
              <el-col :span="10">
                <p v-if="!changepassword" style="display: inline">{{detail.password}}</p>
                <el-button type="text" @click="changepassword = !changepassword" v-if="!changepassword">修改</el-button>
                <el-input type="text" size="small" v-model="detail.password" 
                 autocomplete="off" maxlength="16" v-if="changepassword"></el-input>
              </el-col>
              <el-button type="text" @click="opUser('changepassword',detail)" v-if="changepassword">确认</el-button>
              <el-button type="text" @click="changepassword = !changepassword" v-if="changepassword">取消</el-button>  
            </el-form-item>
            <el-form-item label="角色:" :label-width="formLabelWidth">
              <p v-if="!changerole" style="display: inline">{{detail.role}}</p>
            </el-form-item>
            <el-form-item label="简介:" :label-width="formLabelWidth">
              <el-button type="text" @click="changeintroduction = !changeintroduction" v-if="!changeintroduction">修改</el-button>
              <el-button type="text" @click="opUser('changeintroduction',detail)" v-if="changeintroduction">确认</el-button>
              <el-button type="text" @click="changeintroduction = !changeintroduction" v-if="changeintroduction">取消</el-button> 
              <p v-if="!changeintroduction">{{detail.introduction}}</p>
              <p v-if="!changeintroduction&&haveIntroduction === false">未编写</p>
              <el-input type="textarea" v-model="detail.introduction" 
              :autosize="{ minRows: 2, maxRows: 7}" autocomplete="off" maxlength="255" v-if="changeintroduction"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogForm1Visible = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-tabs>
    </div>
  </div>
</div>
</template>

<script>
import Headernav from '../components/Headernav.vue'

export default {
  name:'Admin',
  components: {
    Headernav
  },
  inject: ['reload'],
  data: function(){
    return{
      exist: '',
      changerole: false,
      changeusername: false,
      changepassword: false,
      changeintroduction: false,
      haveIntroduction: false,
      activeName: 'com',
      admindata: '',
      userdata: undefined,
      detail: undefined,
      ori:{
        orina: ''
      },
      dialogForm1Visible: false,
      formLabelWidth: '60px'
    }
  },
  methods: {
    getuser: function(){
      this.activeName = this.$refs.tab.currentName
      const message = {
        activetab: 'tab-' + this.$refs.tab.currentName
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.userdata = res.data[0]      
      }).catch(err => {
        console.log(err);
      })
    },
    cancel(){
      this.changeusername = false
      this.exist  = ''
    },
    opUser(operation,event){
      const message = {
        username: event.username,
        password: event.password,
        role: event.role,
        canre:event.canRelease,
        cantake:event.canTake,
        canrecruit:event.canRecruit,
        canapply:event.canApply,
        introduction:event.introduction,
        op: operation,
        oriname: this.ori.orina,
      }
      if(operation !== 'delete'){
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        if(operation === 'changerole'){
          this.changerole = false
          this.detail = res.data[0]
          this.reload() 
        }else if(operation === 'changeusername'){
          this.changeusername = false
          this.detail = res.data[0]
          this.reload() 
        }else if(operation === 'changepassword'){
          this.changepassword = false
          this.detail = res.data[0]
          this.reload() 
        }else if(operation === 'changeintroduction'){
          this.changeintroduction = false
          this.detail = res.data[0]
          this.reload()
        }else if(operation === 'isexist'){
          // console.log(res.data);
          if(res.data[1] === 'undefined'){
            this.exist = '';
          }else if(res.data[1] === 'object'){
            this.exist = '账号已存在';
          } 
        }else if(operation === 'view'){
          this.detail = res.data[0]
          this.ori.orina = res.data[0].username
          if(this.detail.introduction === ''){
            this.haveIntroduction = false
          }else
          this.haveIntroduction =true
          this.dialogForm1Visible = true
        }else if(operation === 'cannotRe'||operation === 'canRe'||operation === 'cannotTa'||operation === 'canTa'||
        operation === 'canRecruit'||operation === 'cannotRecruit'||operation === 'canApply'||operation === 'cannotApply'){
          this.reload()
          this.$message.success('修改成功'); 
        }           
      }).catch(err => {
        console.log(err);
      })
      }else{
        this.$confirm('确认要删除这名用户吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
            this.$message({
              type: 'success',
              message: res.data[0]
            });
            this.reload() 
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });  
        });
      }
    }
  },
  created(){
    this.admindata = JSON.parse(sessionStorage.getItem('userdata'))
  },
  mounted(){
    this.$nextTick(() => {
      const message = {
        activetab: 'tab-'+this.$refs.tab.currentName
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        // console.log(res.data);
        this.userdata = res.data[0]
      }).catch(err => {
        console.log(err);
      })
    })
  }
}
</script>

<style>
.card {
  margin-top: 5px;
  height: 55px;
}
.card p {
  display: inline-block;
}
#another-errmsg{
  position: absolute;
  top: 30px;
  left: 10px;
  font-size: 13px;
  color: #f70958;
}
</style>