<template>
  <div class="material-list">
    <div class="action-head">
      <el-radio-group v-model="collect" size="mini" @change="loadImages(1)">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button
        v-if="isShowAdd"
        type="success"
        size="mini"
        @click="dialogFormVisible = true"
      >
        上传素材
      </el-button>
    </div>
    <!-- 素材列表 -->
    <el-row :gutter="10">
      <el-col
        :xs="12"
        :sm="6"
        :md="6"
        :lg="4"
        v-for="(img, index) in imageList"
        :key="index"
        class="image-item"
        @click.native="selected = index"
      >
        <el-image class="material-image" :src="img.url" fit="cover">
          <!-- <div slot="error">
                <el-image
                  class="material-image"
                  :src="errorImg"
                  fit="cover"
                ></el-image>
              </div> -->
        </el-image>
        <div v-if="isShowSelect && selected === index" class="selected"></div>
        <div v-if="isShowAction" class="image-action">
          <el-button
            :loading="img.loading"
            type="warning"
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            size="small"
            @click="onCollect(img)"
          ></el-button>
          <el-button
            :loading="img.loading"
            type="danger"
            icon="el-icon-delete"
            circle
            size="small"
            @click="onDelete(img)"
          ></el-button>
        </div>
      </el-col>
    </el-row>
    <!-- /素材列表 -->
    <!-- 数据分页 -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[12, 24, 36, 48]"
      :page-size="perPage"
      :total="totalCount"
      :pager-count="5"
      background
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="loadImages"
    >
    </el-pagination>
    <!-- /数据分页 -->

    <!-- 上传素材对话框 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-upload
        class="upload-demo"
        drag
        :action="upImgUrl"
        :headers="upLoadHead"
        name="image"
        :show-file-list="false"
        multiple
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确 定
        </el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { getUserImagesApi, collectImageApi, deleteImageApi } from '@/api/image'
import { baseURL, uploadImgUrl } from '@/api/config'
import errorImg from '@/assets/images/404_images/error.jpg'

export default {
  name: 'MaterialList',
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示图片下方的操作(收藏和删除)
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collect: false, // 默认查询全部素材列表
      imageList: [], // 图片素材列表
      totalCount: 0,
      page: 1,
      perPage: 12,
      errorImg,
      dialogFormVisible: false,
      baseURL,
      uploadImgUrl,
      selected: null // 选中的索引
    }
  },
  computed: {
    upImgUrl() {
      return this.baseURL + '' + this.uploadImgUrl
    },
    upLoadHead() {
      return {
        Authorization: `Bearer ${this.$store.state.userInfo.token}`
      }
    },
    previewImgList() {
      return this.imageList.map((item) => item.url)
    },
    layout() {
      if (!this.isShowAction) {
        return 'prev, pager, next'
      } else {
        return 'prev, pager, next, jumper, ->, sizes, total'
      }
    }
  },
  created() {
    this.loadImages(1)
  },
  methods: {
    async loadImages(pager = 1) {
      this.page = pager
      const { page, perPage, collect } = this
      const { data } = await getUserImagesApi({
        collect,
        page,
        per_page: perPage
      })
      const results = data.results
      this.imageList = results.map((item) => {
        item.loading = false
        return item
      })
      this.totalCount = data.total_count
    },
    handleSizeChange(pageSize) {
      this.perPage = pageSize
      this.loadImages(1)
    },
    onUploadSuccess() {
      // 关闭对话框
      this.dialogFormVisible = false
      // 更新素材列表
      this.loadImages(1)
      this.$message.success('上传图片成功')
    },
    async onCollect(img) {
      img.loading = true
      try {
        await collectImageApi(img.id, !img.is_collected)
        img.is_collected = !img.is_collected
      } catch (error) {
        this.$message.error('操作失败,请稍后重试')
      }
      img.loading = false
    },
    async onDelete(img) {
      img.loading = true
      try {
        await deleteImageApi(img.id)
        if (this.page === 1) {
          this.loadImages(this.page)
        } else {
          this.loadImages(this.imageList.length > 1 ? this.page : this.page - 1)
        }
        this.$message.success('删除成功')
      } catch (error) {
        this.$message.error('删除失败,请稍后重试')
      }
      img.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.action-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.image-item {
  position: relative;
  .material-image {
    height: 150px;
    width: 100%;
    cursor: pointer;
  }
  .selected {
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('@/assets/images/publish/selected.png') no-repeat;
    background-size: cover;
  }
  .image-action {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    left: 5px;
    right: 5px;
    bottom: 4px;
    height: 40px;
    background-color: rgba(204, 204, 204, 0.5);
    font-size: 25px;
  }
}
</style>
