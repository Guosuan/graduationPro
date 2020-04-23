import Vue from 'vue'
import VueRouter from 'vue-router'
import Signin from '../views/Signin'
import Home from '../views/Home'
import Signup from '../views/Signup'
import Signupdone from '../views/Signupdone'
import Showproject from '../views/Showproject'
import Showposition from '../views/Showposition'
import Prodetail from '../views/Prodetail'
import Posdetail from '../views/Posdetail'
import Userstu from '../views/Userstu'
import Usercom from '../views/Usercom'
import Admin from '../views/Admin'
import Favorites from '../views/Favorites'
// const Usercom = ()=>import("../views/Usercom")

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    meta: {
      title: '首页'
    },
    component: Home
  },
  {
    meta: {
      title: '登录'
    },
    path: '/signin',
    // component: Signin
    component: () => import("../views/Signin")
  },
  {
    meta: {
      title: '注册'
    },
    path: '/signup',
    // component: Signup
    component: () => import("../views/Signup")
  },
  {
    meta: {
      title: '您好'
    },
    path: '/signupdone',
    // component: Signupdone
    component: () => import("../views/Signupdone")
  },
  {
    meta:{
      title: '搜索-项目'
    },
    path: '/showproject',
    // component: Showproject
    component: () => import("../views/Showproject")
  },
  {
    meta:{
      title: '搜索-职位'
    },
    path: '/showposition',
    // component: Showposition
    component: () => import("../views/Showposition")
  },
  {
    meta:{
      title: '项目详情'
    },
    path: '/prodetail',
    // component: Prodetail
    component: () => import("../views/Prodetail")
  },
  {
    meta:{
      title: '职位详情'
    },
    path: '/posdetail',
    // component: Posdetail
    component: () => import("../views/Posdetail")
  },
  {
    meta:{
      title:'用户信息',
      requireLog: true
    },
    path:'/userstu/:username',
    // component:Userstu,
    component: () => import("../views/Userstu")
  },
  {
    meta:{
      title: '用户信息',
      requireLog: true
    },
    path: '/usercom/:username',
    // component:Usercom
    component: () => import("../views/Usercom")
  },
  {
    meta:{
      title: '用户管理',
      requireLog: true
    },
    path: '/admin',
    // component:Admin
    component: () => import("../views/Admin")
  },
  {
    meta:{
      title: '收藏夹',
      requireLog: true
    },
    path: '/favorites',
    // component:Favorites
    component: () => import("../views/Favorites") 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
