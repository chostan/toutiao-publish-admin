<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <el-table class="table-list" :data="articles" stripe style="width: 100%">
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="comment_status" label="评论状态">
          <template v-slot="{ row }">
            {{ row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.comment_status"
              :disabled="row.statusDisabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perPage"
        :total="totalCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="loadArticles"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticleListApi, changeArticleCommentStatusApi } from '@/api/article'

export default {
  name: 'CommentIndex',
  data() {
    return {
      articles: [], // 文章数据列表
      totalCount: 0,
      page: 1,
      perPage: 20
    }
  },
  created() {
    this.loadArticles()
  },
  methods: {
    async loadArticles(pager = 1) {
      this.pager = pager
      const { page, perPage } = this
      const res = await getArticleListApi({
        response_type: 'comment',
        page,
        per_page: perPage
      })
      this.totalCount = res.data.total_count
      const results = res.data.results
      this.articles = results.map((item) => {
        item.statusDisabled = false
        return item
      })
    },
    handleSizeChange(pageSize) {
      this.perPage = pageSize
      this.loadArticles()
    },
    async onStatusChange(article) {
      article.statusDisabled = true
      try {
        await changeArticleCommentStatusApi(
          article.id.toString(),
          article.comment_status
        )
        this.$message({
          type: 'success',
          message: article.comment_status
            ? '开启文章评论状态'
            : '关闭开启文章评论状态'
        })
      } catch (err) {
        article.comment_status = !article.comment_status
        this.$message.error('操作失败,请稍后重试')
      }
      article.statusDisabled = false
    }
  }
}
</script>

<style lang="less" scoped>
.table-list {
  margin-bottom: 30px;
}
</style>
