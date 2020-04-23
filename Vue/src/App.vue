<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import Headernav from './components/Headernav.vue'
  
  export default {
    name:'App',
    components: {
      Headernav
    },
    data () {
      return {
        isRouterAlive: true
      }
    },
    provide () {
      return {
        reload: this.reload
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
        this.isRouterAlive = true
        })
      }
    }
  } 
</script>

<style scoped>
  
</style>
