import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
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
    return Promise.reject(err)
  }
)

export default request
