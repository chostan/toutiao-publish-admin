<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" size="mini" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="channel in channels"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            unlink-panels
            :picker-options="timeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="articleListLoading"
            @click="loadArticleList(1)"
          >
            查询
          </el-button>
          <el-button :disabled="articleListLoading" @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 数据筛选表单 -->
    </el-card>

    <el-card class="box-card">
      <div slot="header">根据筛选条件共查询到{{ totalCount }}条数据</div>
      <!-- 数据列表 -->
      <el-table
        class="list-table"
        :data="articleList"
        v-loading="articleListLoading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="date" label="封面">
          <template v-slot="{ row }">
            <el-image
              v-if="row.cover.images[0]"
              class="article-cover"
              :src="row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="error">
                <el-image
                  class="article-cover"
                  :src="errorImg"
                  fit="cover"
                ></el-image>
              </div>
            </el-image>
            <el-image
              v-else
              class="article-cover"
              :src="noCoverImage"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="{ row }">
            <el-tag :type="articleListStatus[row.status].type">
              {{ articleListStatus[row.status].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template v-slot="{ row }">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button
                size="mini"
                type="primary"
                circle
                icon="el-icon-edit"
                @click="$router.push('/publish?id=' + row.id + '&page=' + page)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                size="mini"
                type="danger"
                circle
                icon="el-icon-delete"
                @click="onDeleteArticle(row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->
      <!-- 分页 -->
      <el-pagination
        style="text-align: center"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="perPage"
        :total="totalCount"
        :disabled="articleListLoading"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        @size-change="handleSizeChange"
        @current-change="loadArticleList"
      />
      <!-- /分页 -->
    </el-card>
  </div>
</template>

<script>
import {
  getArticleListApi,
  getArticleChannelApi,
  deleteArticleApi
} from '@/api/article'
export default {
  name: 'ContentIndex',
  data() {
    return {
      articleList: [], // 文章数据列表
      totalCount: 0, // 文章总数量
      articleListStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      // 请求参数
      page: 1,
      perPage: 10,
      status: null, // 查询文章的状态
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      // 表格loading状态
      articleListLoading: false,
      // 不要当天以后的日期
      timeRange: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      errorImg: require('@/assets/images/404_images/error.jpg'),
      noCoverImage: require('./images/no-cover.gif')
    }
  },
  created() {
    this.loadChannel()
    const page = this.$store.state.contentPage
    if (page) {
      this.loadArticleList(page)
      this.$store.commit('setContentPage', null)
    } else {
      this.loadArticleList()
    }
  },
  methods: {
    async loadArticleList(pager = 1) {
      this.articleListLoading = true
      this.page = pager
      const { page, perPage } = this

      try {
        const { data } = await getArticleListApi({
          page,
          per_page: perPage,
          status: this.status,
          channel_id: this.channelId,
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
        })
        const { results, total_count: totalCount } = data
        this.articleList = results
        this.totalCount = totalCount
      } catch (error) {}

      this.articleListLoading = false
    },
    handleSizeChange(perPage) {
      this.perPage = perPage
      this.loadArticleList()
    },
    async loadChannel() {
      const { data } = await getArticleChannelApi()
      this.channels = data.channels
    },
    resetSearch() {
      this.status = null
      this.channelId = null
      this.rangeDate = null
      this.loadArticleList()
    },
    onDeleteArticle(articleId) {
      this.$confirm('确认删除该文章吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await deleteArticleApi(articleId.toString())
            this.$message.success('删除成功')
            this.loadArticleList(
              this.articleList.length > 1 ? this.page : this.page - 1
            )
          } catch (err) {
            this.$message({
              type: 'info',
              message: '删除失败'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
}
</style>
