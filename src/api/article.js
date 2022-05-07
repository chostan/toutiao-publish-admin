import request from '@/utils/request'
// 得到文章列表
export function getArticleList(params) {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}
// 得到文章频道
export function getArticleChannel() {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}
// 删除文章
export function deleteArticle(target) {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${target}`
  })
}
// 发布文章
export function addArticle(data, draft = false) {
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
export function getArticleContent(articleId) {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
// 修改文章
export function updateArticle(articleId, data, draft = false) {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    data
  })
}
// 修改文章评论状态
export function changeArticleCommentStatus(articleId, allowComment) {
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
