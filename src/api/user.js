import request from '@/utils/request'
// 登录
export function loginApi(data) {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}
// 获取用户信息
export function getUserProfileApi() {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
  })
}
// 编辑用户资料
export function changeUserProfileApi(data) {
  return request({
    method: 'patch',
    url: '/mp/v1_0/user/profile',
    data
  })
}
// 获取粉丝列表
export function getFansListApi(params) {
  return request({
    method: 'get',
    url: '/mp/v1_0/followers',
    params
  })
}
