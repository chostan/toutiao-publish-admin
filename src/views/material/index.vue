<template>
  <div class="material-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div>
        <!-- 图片列表 -->
        <material-list></material-list>
        <!-- /图片列表 -->
      </div>
    </el-card>
  </div>
</template>

<script>
import MaterialList from '@/components/material-list.vue'

export default {
  name: 'MaterialIndex',
  components: {
    MaterialList
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
