import Vue from 'vue'
import App from './App'
import router from './router'
// 导入 element-ui 组件库
// import ElementUI from 'element-ui'
import axios from 'axios'

// 导入图标的样式表
import './assets/fonts/iconfont.css'
// 导入树形表格组件
import TreeTable from 'vue-table-with-tree-grid'
// 导入 NProgress 的 JS 和 CSS
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// 导入全局的配置文件
import config from './config.json'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 富文本编辑器相关的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入 全局的自定义样式表
import './assets/css/global.css'

// 按需导入 Element-UI 组件
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'

// 安装注册 富文本编辑器
Vue.use(VueQuillEditor)

// 全局注册 树形表格
Vue.component('tree-table', TreeTable)

// 把 组件库安装到 Vue
// Vue.use(ElementUI)

// 注册按需导入的element-ui组件
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

// 配置 axios
axios.defaults.baseURL = config.baseURL
// 全局配置 axios 的 request 拦截器
axios.interceptors.request.use(config => {
  // 通过拦截request请求,主动为 请求头,追加新属性 Authorization,等于 token 值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 展示进度条
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 自定义全局的时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
