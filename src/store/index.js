import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem, removeItem } from '@/utils/store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: getItem('toutiao-user') || {}
  },
  getters: {},
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      setItem('toutiao-user', userInfo)
    },
    removeUserInfo(state) {
      state.userInfo = null
      removeItem('toutiao-user')
    }
  },
  actions: {},
  modules: {}
})
