import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import BookList from '@/components/book/list'
import BookCategoryList from '@/components/bookcategory/list'

import UserList from '@/components/user/list'
import adduser  from '@/components/user/adduser'

import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'


import newmovie from '@/components/movie/newmovie'
import AboutShow from '@/components/movie/AboutShow'
import American from '@/components/movie/American'

import hotmusic from '@/components/music/hotmusic'

import Cd from '@/components/music/Cd.vue'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
     // leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/user/adduser', component: adduser, name: '添加用户', menuShow: true},
        {path: '/user/list', component: UserList, name: '用户列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '图书管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/book/list', component: BookList, name: '图书列表', menuShow: true},
        {path: '/book/category', component: BookCategoryList, name: '图书分类', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '电影管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/movie/newmovie', component: newmovie, name: '最新上映', menuShow: true},
        {path: '/movie/AboutShow', component: newmovie, name: '即将上映', menuShow: true},
        {path: '/movie/American', component: American, name: '北美票房榜', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '音乐',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/music/hotmusic', component: hotmusic, name: '热们音乐', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    },
	  { path: '/music/Cd/:id',name:'cd',  component: Cd }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('access-user'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
