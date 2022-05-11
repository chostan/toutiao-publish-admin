import axios from 'axios'
import store from '@/store'
import router from '@/router'
import JSONbig from 'json-bigint'
import { Message } from 'element-ui'

function redirectLogin() {
  router.replace({
    name: 'login',
    // 传递查询参数
    query: {
      // 数据名是自己起的
      // router.currentRoute和我们在组件中的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  transformResponse: [
    function (data) {
      try {
        return JSONbig.parse(data)
      } catch (err) {
        // console.log('转换失败', err)
        return data
      }
    }
  ]
})

request.interceptors.request.use(
  (config) => {
    const userInfo = store.state.userInfo
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    // console.dir('响应失败', err)
    const status = err.response.status

    if (status === 401) {
      store.commit('removeUserInfo')
      redirectLogin()
      Message.closeAll()
      Message.error('登录状态无效, 请重新登录')
    } else if (status === 400) {
      // 客户端参数错误
      Message.error('请求参数错误')
    } else if (status === 403) {
      // 没有操作权限
      Message.warning('没有操作权限')
    } else if (status >= 500) {
      // 服务端错误
      Message.error('服务端内部异常,请稍后重试')
    }

    return Promise.reject(err)
  }
)

export default request
