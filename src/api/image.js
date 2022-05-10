import request from '@/utils/request'
// 上传图片
export function uploadImgApi(data) {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
  })
}
// 获取用户图片素材
export function getUserImagesApi(params) {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}
// 收藏/取消收藏图片
export function collectImageApi(imageId, collect) {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}
// 删除图片
export function deleteImageApi(imageId) {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}
// 上传用户头像
export function uploadUserAvatarApi(data) {
  return request({
    method: 'patch',
    url: '/mp/v1_0/user/photo',
    data
  })
}
