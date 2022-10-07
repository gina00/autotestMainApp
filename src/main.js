import Vue from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import dayjs from 'dayjs'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters'
import { registerMicroApps, start } from 'qiankun'
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})
Vue.prototype.$dayjs = dayjs

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
const apps = [
  // {
  //   name: 'nl-demo',
  //   entry: 'http://localhost:9528/',
  //   container: '#container',
  //   activeRule: '/DevOpsWebMain/demo/baseconfig',
  //   props: { data: store }
  // },
  // {
  //   name: 'nl-demo2',
  //   entry: 'http://localhost:9528/',
  //   container: '#container',
  //   activeRule: '/DevOpsWebMain/demo/flowExtractionCleanUp',
  //   props: { data: store }
  // },
  // {
  //   name: 'nl-autotest1',
  //   entry: 'http://127.0.0.1:9090/', // process.env.NL_AUTOTEST_URL
  //   container: '#container',
  //   activeRule: '/DevOpsWebMain/autotest/subsystemMgr',
  //   props: { data: store }
  // },
  {
    name: 'nl-autotest',
    entry: process.env.VUE_APP_QIANKUN_AUTOTEST_ENTRY, // http://127.0.0.1:9090/
    container: '#container',
    activeRule: '/autotest/',
    props: { data: store }// data : { store, router, Vue, Vuex, VueRouter }
  }
]
registerMicroApps(apps,
  {
    beforeLoad: (app) => console.log('before load', app.name),
    beforeMount: [(app) => console.log('before mount', app.name)]
  }
)
// loadMicroApp({
//   name: 'app',
//   entry: '//localhost:3000',
//   container: '#container'
// })

start(
  {
    prefetch: true, // 取消预加载
    sandbox: { experimentalStyleIsolation: true }}
  // {
  // prefetch: false, // 取消预加载
  // sandbox: true // 隔离样式sandbox : { experimentalStyleIsolation: true }
// }
)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
