import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// 不需要token就可以访问
const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach((to, form, next) => {
  NProgress.start()
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

router.afterEach(() => {
  NProgress.done()
})
