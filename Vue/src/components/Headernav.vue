<template>
  <div id='header'>
    <router-link to= "/home" id= "logo">
    <span>起飞</span>
    </router-link>
    <div class="which">
      <span class="nav-link-which" :class="{active: posorpro}" @click="posorpro = true">项目</span>
      <span class="nav-link-which" :class="{active: !posorpro}" @click="posorpro = false">职位</span>
    </div>
    <ul id="nav"> 
      <li class="search-form">
        <div style="display: inline">
          <input type="text" class="search" v-model="keyword" value placeholder="项目名称、企业名称">
          <i class="el-icon-search" @click="search()"></i> 
        </div> 
      </li>
      <li class="nav-dropdown-container" v-if="islogin()">
        <a href="javascript:void(0)" class="nav-link">{{$store.state.userInfo.username}}</a>
        <ul class="nav-dropdown">
            <!-- <li><a style="cursor:pointer" @click="whichrole()">我的</a></li> -->
            <li><router-link :to="whichrole()">我的</router-link></li>
            <li v-if="$store.state.userInfo.role === 'student'"><router-link to="/favorites">收藏</router-link></li>
            <li><a href="javascript:void(0)" @click="signout()">退出登录</a></li>
        </ul>
      </li>
      <li><router-link to="/signin" class="nav-link" v-if="!(islogin())">登录</router-link></li>
      <li><router-link to="/signup" class="nav-link" v-if="!(islogin())">注册</router-link></li>
      <li class="nav-dropdown-container">
        <a href="javascript:void(0)" class="nav-link">导航</a>
        <ul class="nav-dropdown">
          <li><router-link to="/showproject" class="nav-link" @click.native="searchallPro()">所有项目</router-link></li>
          <li><router-link to="/showposition" class="nav-link" @click.native="searchallPos()">所有职位</router-link></li>
        </ul>
      </li>
    </ul>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  name:'Headernav',
  data: function() {
    return {
      is: true,
      isnot:false,
      keyword: '',
      posorpro:true,
    }
  },
  methods: {
    islogin: function() {
      if(sessionStorage.getItem('userdata') === null){
        this.is = false
      }else{
        this.is = true
      }
      return this.is
    },
    isnotlogin: function() {
      if(sessionStorage.getItem('userdata') === null){
        this.isnot = true
      }else{
        this.isnot = false
      }
      return this.isnot
    },
    signout: function() {
       if(sessionStorage.getItem('userdata') !== null){
         this.$store.commit('signOut')
         this.$router.push({ path: '/home' }).then().catch(err =>{
           console.log(err);
         });
      }
    },
    whichrole:function() {
       const which = JSON.parse(sessionStorage.getItem('userdata'))
       if(which.role === 'student'){
        return '/userstu/'+which.username
       }else if(which.role === 'company'){
        return '/usercom/'+which.username
       }else{
         return '/admin'
       }
    },
    searchallPro:function() {
      const message = {
        keyword: ''
      }
      this.axios.post('http://127.0.0.1:3000/showproject',message).then(res => {
        this.$bus.$emit('foundres', res.data);
      }).catch(err => {
        console.log(err);
      })
      this.$router.push({ path: '/showproject' });
    },
    searchallPos(){
      const message = {
        keyword: '',
        op: 'keysearch'
      }
      this.axios.post('http://127.0.0.1:3000/position',message).then(res => {
        this.$bus.$emit('foundres', res.data);
      }).catch(err => {
        console.log(err);
      })
      this.$router.push({ path: '/showposition' });
    },
    search: function(){
      const message = {
        keyword: this.keyword,
        op:'keysearch'
      }
      if(this.posorpro === true){ //搜索项目
        if(this.keyword !== ''){
          this.axios.post('http://127.0.0.1:3000/showproject',message).then(res => {
            this.$bus.$emit('foundres', res.data);
          }).catch(err => {
            console.log(err);
          })
          this.$router.push({ path: '/showproject' });
        }else{
          const a ='不存在'
          this.$bus.$emit('foundres', a);
          this.$router.push({ path: '/showproject' })
        }
      }else{
        if(this.keyword !== ''){
          this.axios.post('http://127.0.0.1:3000/position',message).then(res => {
            this.$bus.$emit('foundres', res.data);
          }).catch(err => {
            console.log(err);
          })
          this.$router.push({ path: '/showposition' });
        }else{
          const a ='不存在'
          this.$bus.$emit('foundres', a);
          this.$router.push({ path: '/showposition' })
        }
      }
    }   
  }
}
</script>

<style scoped>
  .which{
    position: absolute;
    top: 50px;
    right: 402px;
    cursor: pointer;
  }
  .nav-link-which{
    font-size: 14px;
    color: black;
    text-decoration: none;
    margin-left:5px ;
  }
  .active{
    /* border-bottom: thick solid green; */
    font-size: 15px;
    color: white;
    border: 1px solid#42b982;
    background-color:#42b983;
  }
  #header {
    background-color: #fff;
    height: 40px;
    padding: 10px 60px;
    position: relative;
  }
  #logo {
    display: inline;
    font-size: 1.5em;
    line-height: 40px;
    color: #273849;
    font-weight: 500;
    text-decoration: none;
  }
  .search {
    width: 250px;
    border: 1px solid;
    border-radius: 4px;
    font-size: 14px;
    padding: 3px;   
  }
  .el-icon-search{
    cursor:pointer
  }
  .without-signin {
    display: none;
  }
  .is-signin {
    display: none;
  }
  #nav {
    list-style-type: none;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 30px;
    top: 10px;
    height: 40px;
    line-height: 40px;
  }
  #nav li{
    display: inline;
    position: relative;
    margin: 0 0.3em;
  }
  .nav-link:link{
    color: black;
    text-decoration: none;
  }
  .nav-link:hover{
    border-bottom: thick solid green;
  }
  #nav .nav-dropdown-container:hover .nav-dropdown {
    display: block;
  }
  #nav .nav-dropdown {
    display: none;
    box-sizing: border-box;
    max-height: calc(100vh - 61px);
    overflow-y: auto;
    position: absolute;
    top: 100%;
    right: 0px;
    background-color: #fff;
    padding: 10px 0;
    border: 1px solid #ddd;
    border-bottom-color: #ccc;
    text-align: center;
    border-radius: 4px;
    white-space: nowrap;
  }
  #nav .nav-dropdown li {
    line-height: 1.8em;
    margin: 0;
    display: block;
  }
  #nav .nav-dropdown a {
    text-decoration: none;
    color: #354c63;
    display: block;
  }
  #nav .nav-dropdown a:hover {
    color: #42b983;
  }
</style>