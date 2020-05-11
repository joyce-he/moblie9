// 导入了 vue
import Vue from 'vue'
// 导入了 vue-router
import VueRouter from 'vue-router'
// 在 vue 中使用 VueRouter
Vue.use(VueRouter)

// 创建了一个路由信息对象集合
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  // 渲染 vant 的使用
  {
    path: '/usevant',
    name: 'usevant',
    component: () => import('../views/usevant')
  },
  // 登录路由
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  // 登录路由
  {
    path: '/login/nologin',
    name: 'nologin',
    component: () => import('../views/login')
  },
  // 布局的路由
  {
    path: '/layout',
    name: 'layout',
    component: () => import('../views/layout'),
    children: [
      // 首页路由
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home')
      },
      // 搜索页面
      {
        path: '/search',
        name: 'search',
        component: () => import('../views/search')
      }
    ]
  },
  {
    path: '/searchList/:key',
    name: 'searchList',
    component: () => import('../views/searchList')
  },
  // 添加一个路由：详情
  {
    path: '/detail/:artid',
    name: 'detail',
    component: () => import('../views/detail')
  }
]

// 创建了一个路由实例
const router = new VueRouter({
  routes // 路由信息的集合
})

// 导出路由实例
export default router
