import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/')
  },
  {
    path: '/404',
    component: () => import('@/views/404/')
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/')
      },
      {
        path: '/content',
        name: 'content',
        component: () => import('@/views/content/')
      },
      {
        path: '/publish',
        name: 'publish',
        component: () => import('@/views/publish/')
      },
      {
        path: '/material',
        name: 'material',
        component: () => import('@/views/material/')
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment/')
      }
    ]
  },
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  routes
})

export default router
