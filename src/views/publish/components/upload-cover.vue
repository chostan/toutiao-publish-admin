<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-img" ref="cover-img" :src="value" />
    </div>
    <el-dialog
      class="cover-dialog"
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <material-list
            ref="materialList"
            :isShowAdd="false"
            :isShowAction="false"
            :isShowSelect="true"
          ></material-list>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input
            ref="file"
            type="file"
            accept="image/*"
            @change="onFileChange"
          />
          <img ref="preview-img" class="img" src="" alt="" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImgApi } from '@/api/image'
import MaterialList from '@/components/material-list.vue'

export default {
  name: 'UploadCover',
  components: {
    MaterialList
  },
  props: {
    // coverImg: {
    //   type: String,
    //   default: ''
    // }
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  methods: {
    showCoverSelect() {
      // 展示选择封面的弹窗
      this.dialogVisible = true
    },
    onFileChange() {
      const file = this.$refs.file.files[0]
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-img'].src = blob
      // 防止用户选择同一个文件不触发change事件
      // this.$refs.file.value = ''
    },
    async onCoverConfirm() {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择图片')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        const res = await uploadImgApi(fd)
        // 关闭弹出层
        this.dialogVisible = false
        // 展示上传的图片
        this.$refs['cover-img'].src = res.data.url
        // 将图片地址发送给父组件
        // this.$emit('update:cover-img', res.data.url)
        this.$emit('input', res.data.url)
      } else if (this.activeName === 'first') {
        const materialList = this.$refs.materialList
        const selected = materialList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件
        this.$emit('input', materialList.imageList[selected].url)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-img {
    display: block;
    height: 120px;
    max-width: 100%;
  }
}
.cover-dialog {
  .img {
    display: block;
    width: 100px;
    // width: 150px;
    // height: 150px;
  }
}
</style>
