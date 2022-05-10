import request from '@/utils/request'
// 得到文章列表
export function getArticleListApi(params) {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}
// 得到文章频道
export function getArticleChannelApi() {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}
// 删除文章
export function deleteArticleApi(articleId) {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
// 发布文章
export function addArticleApi(data, draft = false) {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    data,
    params: {
      draft
    }
  })
}
// 获取指定文章的相关内容
export function getArticleContentApi(articleId) {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
// 修改文章
export function updateArticleApi(articleId, data, draft = false) {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft // 是否保存为草稿
    },
    data
  })
}
// 修改文章评论状态
export function changeArticleCommentStatusApi(articleId, allowComment) {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
