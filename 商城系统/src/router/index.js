import Vue from 'vue'
import Router from 'vue-router'

// 导入 登录组件
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName: "login_home" */ '@/components/Login')
// 导入后台主页组件
// import Home from '@/components/home/Home'
const Home = () => import(/* webpackChunkName: "login_home" */ '@/components/home/Home')
// 导入 Welcome 组件
// import Welcome from '@/components/home/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home" */ '@/components/home/Welcome')

// 导入 用户列表组件
// import UserList from '@/components/users/UserList'
const UserList = () => import(/* webpackChunkName: "userlist" */ '@/components/users/UserList')

// 导入 权限列表组件
// import Rights from '@/components/power/Rights'
const Rights = () => import(/* webpackChunkName: "power" */ '@/components/power/Rights')
// 导入 角色列表组件
// import Roles from '@/components/power/Roles'
const Roles = () => import(/* webpackChunkName: "power" */ '@/components/power/Roles')

// 导入 商品分类组件
// import Cate from '@/components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "goods" */ '@/components/goods/Cate')
// 导入 商品参数列表组件
// import Params from '@/components/params/Params'
const Params = () => import(/* webpackChunkName: "goods" */ '@/components/params/Params')
// 导入 商品列表组件
// import GoodsList from '@/components/goods/GoodsList'
const GoodsList = () => import(/* webpackChunkName: "goods" */ '@/components/goods/GoodsList')
// 导入 商品添加组件
// import GoodsAdd from '@/components/goods/Add'
const GoodsAdd = () => import(/* webpackChunkName: "goods" */ '@/components/goods/Add')

// 导入 订单列表组件
// import OrderList from '@/components/order/OrderList'
const OrderList = () => import(/* webpackChunkName: "order_report" */ '@/components/order/OrderList')
// 导入报表组件
// import Report from '@/components/report/Report'
const Report = () => import(/* webpackChunkName: "order_report" */ '@/components/report/Report')

Vue.use(Router)

// 创建路由对象
const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: UserList },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/orders', component: OrderList },
        { path: '/goods', redirect: '/goods/list' },
        { path: '/goods/list', component: GoodsList },
        { path: '/goods/add', component: GoodsAdd },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 如果访问的 login 页面，直接放行
  if (to.path === '/login') return next()
  // 获取 token 字符串
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有 token 字符串，强制跳转到 登录页
  if (!tokenStr) return next('/login')
  // 证明有 token 字符串，直接放行
  next()
})

// 把路由对象暴露出去
export default router
