<template>
<div style=" margin-top: 50px">
  <!-- <el-button @click="setPath($refs.tree.getNode($refs.tree.getCurrentNode()))"></el-button> -->
  <el-row :gutter="40" class="folder">
    <el-col :span="activespan">
      <el-tree 
      :current-node-key="1"
      :data="foldername"
      node-key="id"
      ref="tree"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="showFavorites('viewcollection')"
      :highlight-current="true">
      <span class="custom-tree-node" slot-scope="{ node }">
        <i class="el-icon-folder"></i>
        <span>{{ node.label }}</span>
      </span>
      </el-tree>
    </el-col>
    <el-col v-if="prodata !== undefined||this.$route.path === '/favorites'" :span="13">
      <el-card v-for="(pro,index) in prodata" :key="index">
        <p style="display: inline">{{pro.proname}}</p>
        <el-button type="text"  @click="cancelCollection('collect',pro)">取消收藏</el-button>
        <router-link to="/prodetail" class="detail" @click.native="sendProdata(pro.proname)">查看详情</router-link>
        <el-button type="text" @click="move(pro)">移动</el-button>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog  title="移动收藏" :visible.sync="dialogFormVisible" width="20%">
    <el-tree 
      :current-node-key="1"
      :data="foldername"
      node-key="id"
      ref="temporarytree"
      default-expand-all
      :expand-on-click-node="false"
      :highlight-current="true">
      <span class="custom-tree-node" slot-scope="{ node }">
      <i class="el-icon-folder"></i>
      <span>{{ node.label }}</span>
      </span>
    </el-tree>
    <el-button @click="moveCollection()">确认</el-button>
  </el-dialog>
  <div class="op" v-if="this.$route.path === '/favorites'">
    <div>
      <el-button type="text" @click="appendfolder()">添加文件夹</el-button>
    </div>
    <div>
      <el-button type="text" @click="deletefolder()">删除文件夹</el-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name:'Favoritefile',
  inject: ['reload'],
  data: function() {
      // const foldername = [{
      //   id:1,
      //   label: '默认',
      //   children: []
      // }]
    return {
      foldername: undefined,
      activespan:5,
      prodata: undefined,
      dialogFormVisible: false,
      movedproname:'',
      a:[]
    }
  },
  methods: {
    move(event){
      this.movedproname = event.proname
      this.dialogFormVisible = true
    },
    moveCollection(){
      // console.log(this.$refs.temporarytree.getCurrentNode().label);
      const p = this.setPath(this.$refs.temporarytree.getNode(this.$refs.temporarytree.getCurrentNode()))
      let newpath = ''
      for(let i=0;i<p.length;i++){
        newpath = newpath + '/' + p[i]
      }
      // console.log(newpath);
      const message = {
        proname: this.movedproname,
        role: this.$store.state.userInfo.role,
        path :newpath,
        username: this.$store.state.userInfo.username,
        op:'movecollection'
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.$message.success(res.data[0])
        this.a = []
        this.reload()
      }).catch(err => {
        console.log(err);
      })
    },
    setPath(node){
      if (node) {
        if (node.label !== undefined) {
          this.a.unshift(node.label); //在数组头部添加元素
          this.setPath(node.parent); //递归
        }
      }
      // console.log(this.a)
      return this.a
    },
    appendfolder(){
      this.$prompt('名称', '添加文件夹', {
        confirmButtonText: null,
        cancelButtonText: '取消',
        }).then(({ value }) => {
          if(value === null){
            this.$message.error('名称不能为空')
          }else{
            const data = {
              id: JSON.stringify(new Date()),
              label: value,
              children: []
            }
            console.log(data.id);
            const node = this.$refs.tree.getCurrentNode()
            this.$refs.tree.append(data,node)
            const message = {
              username: this.$store.state.userInfo.username,
              allfolder: JSON.stringify(this.foldername),
              op: 'appendfolder'
            }
            this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
              this.reload()
              this.$message.success('添加成功')
            }).catch(err => {
              console.log(err);
            })
          }
        }).catch(() => {

        })
    },
    deletefolder(){
      if(this.$refs.tree.getCurrentNode().label === '默认'){
        this.$message.error('默认收藏夹无法删除')
      }else{
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const node = this.$refs.tree.getCurrentNode()
          this.$refs.tree.remove(this.$refs.tree.getCurrentNode())
          const message = {
            username: this.$store.state.userInfo.username,
            allfolder: JSON.stringify(this.foldername),
            path: node.label,
            op: 'deletefolder'
          }
          console.log(message);
          this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
            this.reload()
            this.$message.success('删除成功')
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {

        }) 
      }
    },
    getFolder(){
      const message = {
        username: this.$store.state.userInfo.username
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.foldername = JSON.parse(res.data[0].collectionFolder)
      }).catch(err => {
        console.log(err);
      })
    },
    showFavorites(operation){
      // console.log(this.$refs.tree.getCurrentNode());
      if(this.$route.path === '/favorites'||this.dialogFormVisible === false){
        const p = this.setPath(this.$refs.tree.getNode(this.$refs.tree.getCurrentNode()));
        let path = ''
        for(let i=0;i<p.length;i++){
          path = path + '/' + p[i]
        }
        let message = {
          foldername: path,
          username: this.$store.state.userInfo.username,
          role: this.$store.state.userInfo.role,
          op: operation
        }
        this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
          this.prodata = res.data[0]
          this.a = []
        }).catch(err => {
          console.log(err);
        })
      }
    },
    cancelCollection(operation,event){
      const message = {
        is: false,
        role: this.$store.state.userInfo.role,
        proname: event.proname,
        username: this.$store.state.userInfo.username,
        op: operation
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.reload()
        this.$message.success(res.data[0])
      }).catch(err => {
        console.log(err);
      })
    },
    sendProdata:function(proName) {
      this.$bus.$emit('detail', proName);
    },
  },
  created(){
    this.getFolder()
    this.$nextTick(() => {
      if(this.$route.path === '/favorites'){
        this.activespan = 5
      }else
      this.activespan = 24
    })
  },
  mounted(){
    if(this.$route.path === '/favorites'){
      const message = {
        foldername: '/默认',
        username: this.$store.state.userInfo.username,
        role: this.$store.state.userInfo.role,
        op: 'viewcollection'
      }
      this.axios.post('http://127.0.0.1:3000/can',message).then(res => {
        this.prodata = res.data[0]
        this.a = []
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style>
.detail{
  color: #409EFF;
  text-decoration: none;
  margin-left: 10px;
  font-size:14px;
}
.folder{
  width: 85%;
  margin-right: 0;
}
.op{
  position: absolute;
  right: 40px;
  top:120px;
}
.custom-tree-node i{
  display: inline-block;
}
.custom-tree-node span{
  display: inline-block;
  margin-left: 15px;
}
</style>