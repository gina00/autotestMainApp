import router from '@/router'
debugger
const { VUE_APP_MICRO_ENTRY } = process.env
const apps = [
  /**
  * name: 微应用名称 - 具有唯一性
  * entry: 微应用入口 - 通过该地址加载微应用
  * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
  * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
  */

  {
    name: 'vue-micro-app',
    entry: VUE_APP_MICRO_ENTRY,
    container: '#micro-container',
    activeRule: '#/vue2-micro-app',
    props: {
      router: router
    }
  }
]
export default apps
