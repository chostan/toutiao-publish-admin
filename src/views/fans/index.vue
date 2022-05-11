<template>
  <div class="fans-container">
    <el-card>
      <div slot="header">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="fansList">
          <div class="userinfo-container">
            <div
              class="userinfo"
              v-for="(item, index) in fansList"
              :key="index"
            >
              <div class="user-photo">
                <el-image :src="item.photo" style="width: 100%; height: 100%">
                  <template #error>
                    <img :src="errorImg" style="width: 100%; height: 100%" />
                  </template>
                </el-image>
              </div>
              <div class="username">{{ item.name }}</div>
              <el-button
                class="focus-btn"
                size="small"
                type="primary"
                @click="onFollowUser"
              >
                +关注
              </el-button>
            </div>
          </div>
          <el-pagination
            :current-page="page"
            :page-size="perPage"
            :total="totalCount"
            :page-sizes="[10, 20, 50, 100]"
            background
            layout="prev, pager, next, jumper, ->, sizes, total"
            @size-change="handleSizeChange"
            @current-change="loadFansList"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="fansEcharts">
          <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
          <fans-echarts></fans-echarts>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getFansListApi, followUserApi } from '@/api/user'
import errorImg from '@/assets/images/404_images/error.jpg'

import FansEcharts from './components/fans-echarts.vue'

export default {
  name: 'Fans',
  components: {
    FansEcharts
  },
  data() {
    return {
      fansList: [],
      totalCount: 0,
      page: 1,
      perPage: 20,
      errorImg,
      activeName: 'fansEcharts'
    }
  },
  created() {
    this.loadFansList()
  },
  methods: {
    // 得到粉丝列表
    async loadFansList(pager = 1) {
      this.page = pager
      const { page, perPage } = this
      const { data } = await getFansListApi({
        page,
        per_page: perPage
      })
      this.fansList = data.results
      this.totalCount = data.total_count
    },
    handleSizeChange(pageSize) {
      this.perPage = pageSize
      this.loadFansList()
    },
    async onFollowUser() {
      const res = await followUserApi(4)
      console.log(res)
    }
  }
}
</script>

<style scoped lang="less">
.fans-container {
  .userinfo-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 20px;
    .userinfo {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 150px;
      height: 200px;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 20px 30px 10px 30px;
      border: 1px dashed #eee;
      box-sizing: border-box;
      /deep/ .user-photo {
        height: 80px;
        width: 80px;
        img {
          border-radius: 50%;
        }
      }
      .username {
        text-align: center;
        font-size: 16px;
        color: pink;
      }
      .focus-btn {
        border-radius: 30px;
      }
    }
  }
  /deep/ .el-pagination {
    text-align: center;
  }
}
</style>
