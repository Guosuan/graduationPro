<template>
  <div>
    <headernav></headernav>
    <!-- <el-button @click="cli()"></el-button> -->
    <favoritefolder ref="f"></favoritefolder>
  </div>
</template>

<script>
import Headernav from '../components/Headernav.vue'
import Favoritefolder from '../components/Favoritefolder.vue'

export default {
  name:'Favorites',
  components: {
    Headernav,
    Favoritefolder
  },
  methods: {
    // cli(){
    //   console.log(this.$refs.f.$refs.tree.getCurrentNode());
    // }
  }
}
</script>

<style>

</style>