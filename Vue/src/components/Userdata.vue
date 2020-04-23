<template>
    <div class="user-info">
      <h2>用户信息</h2>
      <div v-if="userdata !== ''">
        <p>用户名：{{userdata.username}}</p>
        <p>用户类型：{{role}}</p>
        <div class="intr">
          <p>简介：</p>
          <el-button type="text" @click="dialogForm5Visible = true">编辑</el-button>
        </div>
        <div>
          <p v-if="userdata.introduction !== undefined">{{userdata.introduction}}</p>
          <p v-if="userdata.introduction === ''">未设置</p>
        </div>
      </div>
      <el-dialog title="编辑简介" :visible.sync="dialogForm5Visible">
        <el-form>
          <el-form-item>
            <el-input type="textarea" v-model="userdata.introduction" 
            :autosize="{ minRows: 2, maxRows: 7}" autocomplete="off" maxlength="255"></el-input>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click=" cancelEdit()">取 消</el-button>
            <el-button type="primary" @click="editIntroduction('editIntr')">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name:'Userdata',
  inject: ['reload'],
  data: function(){
    return{
      role: '',
      haveIntroduction: false,
      userdata: '',
      dialogForm5Visible: false, //简介编辑界面
      formLabelWidth: '120px'
    }
  },
  methods: {
    judgerole(){
      if(this.$store.state.userInfo.role === 'student'){
        this.role = '学生'
      }else{
        this.role = '企业'
      }
    },
    editIntroduction(operation) {
      const message = {
        username:this.userdata.username,
        introduction: this.userdata.introduction,
        op: operation
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.$message.success(res.data[0])
        this.reload()
      }).catch(err => {
        this.$message.error(err)
      })
    },
    cancelEdit() {  
      this.reload()
    },
  },
  created(){
    this.judgerole()
    const message = {
      username: (JSON.parse(sessionStorage.getItem('userdata'))).username
    }
    this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
      this.userdata = res.data[0]
    }).catch(err => {
      console.log(err);
    })
  },
}
</script>

<style>

</style>