<template>
  <el-menu
    class="nav-menu"
    router
    :collapse="isCollapse"
    :collapse-transition="false"
    default-active="/"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item
      v-for="(item, index) in menuInfoList"
      :key="index"
      :index="item.path"
    >
      <i :class="item.icon"></i>
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'app-aside',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuInfoList: [
        {
          path: '/',
          name: '首页',
          icon: 'el-icon-s-home'
        },
        {
          path: '/article',
          name: '内容管理',
          icon: 'el-icon-document'
        },
        {
          path: '/image',
          name: '素材',
          icon: 'iconfont icon-image'
        },
        {
          path: '/publish',
          name: '发布文章',
          icon: 'iconfont icon-publish'
        },
        {
          path: '/comment',
          name: '评论管理',
          icon: 'iconfont icon-comment-filling'
        },
        {
          path: '/fans',
          name: '粉丝管理',
          icon: 'el-icon-coordinate'
        },
        {
          path: '/settings',
          name: '个人设置',
          icon: 'el-icon-setting'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.nav-menu {
  border-right: unset;
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
</style>
