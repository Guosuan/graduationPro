<template>
<div>
  <headernav></headernav>
<el-container>
  <el-main>
    <h1>不管是学生还是企业<br>
    都能在这有所收获
    </h1>
    <el-row type="flex" justify="space-around" :gutter="20">
      <el-col :span="5">
        <el-card class="box-card" shadow="hover">
          <div slot="header">
            <span>学生用户</span>
          </div>
          <div class="text item">
            你可以接受企业发布的各<br>
            种任务，锻炼你的能力。<br>
            还有机会入职心仪的公司
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="box-card" shadow="hover">
          <div slot="header">
            <span>企业用户</span>
          </div>
          <div class="text item">
            你可以发布项目给想要锻炼<br>
            自己的学生，或者在这里直<br>
            接为公司招聘想要的人才
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</el-container>
</div>

</template>

<script>
import Headernav from '../components/Headernav.vue'
import axios from 'axios';
export default {
  name:'App',
  components: {
    Headernav
  },
}
</script>

<style scoped>
.el-main {
  text-align: center;
}
.el-main h1 {
  font-size: 34px;
  color: white;
  background-color: #42b983;
}
.el-card {
  border-color: #42b983;
  border-width: 2px;
}
.el-card :hover {
  background-color:rgb(233, 252, 242) ;
}


</style>