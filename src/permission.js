import router from './router'
import store from './store'

// 不需要token就可以访问
const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach((to, form, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    return next()
  } else {
    const userInfo = store.state.userInfo
    if (userInfo && userInfo.token) {
      return next()
    } else {
      return next({
        path: '/login',
        query: {
          redirect: to.path
        }
      })
    }
  }
})
