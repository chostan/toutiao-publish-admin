import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 权限管理
import '@/permission'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// 引入全局样式表
import '@/styles/index.less'

// Vue.use(ElementUI)

// 添加全局事件总线
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
