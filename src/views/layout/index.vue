<template>
  <el-container class="layout-container">
    <el-aside class="aside" :width="isCollapse ? '64px' : '200px'">
      <app-aside class="aside-menu" :isCollapse="isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="title-wrap">
          <i
            :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>头条内容发布系统</span>
        </div>
        <!-- 下拉菜单 -->
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getUserProfileApi } from '@/api/user'
import AppAside from './components/app-aside.vue'

export default {
  name: 'index',
  components: {
    AppAside
  },
  data() {
    return {
      user: {},
      // 侧边栏展开状态
      isCollapse: false
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfileApi()
      this.user = data
    },
    onLogout() {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('removeUserInfo')
          this.$router.push('/login')
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
.layout-container {
  height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .title-wrap {
      i {
        margin-right: 5px;
        cursor: pointer;
      }
    }

    .avatar-wrap {
      display: flex;
      align-items: center;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }

  .aside {
    background-color: #d3dce6;
    .aside-menu {
      height: 100%;
    }
  }

  .main {
    background-color: #e9eef3;
  }
}
</style>
