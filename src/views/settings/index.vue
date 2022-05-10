<template>
  <div class="settings-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <el-row>
        <el-col :span="16">
          <el-form
            ref="userFormRef"
            :model="user"
            :rules="userFormRules"
            label-width="80px"
          >
            <el-form-item label="编号">{{ user.id }}</el-form-item>
            <el-form-item label="手机">{{ user.mobile }}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="updateProfileLoading"
                @click="onUpdateUser"
              >
                保存
              </el-button>
              <!-- <el-button @click="resetUserForm">清空</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-avatar shape="square" :size="150" fit="cover" :src="user.photo">
          </el-avatar>
          <div class="update-photo-wrap">
            <el-button type="primary" size="medium" @click="$refs.file.click()">
              修改头像
            </el-button>
          </div>
          <input
            ref="file"
            type="file"
            accept="image/*"
            hidden
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 图片上传裁切预览对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <template>
        <div class="previewImg-wrap">
          <img ref="previewImg" class="img" :src="previewImg" alt="" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="updatePhotoLoading"
            @click="onUpdatePhoto"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfileApi,
  updateUserAvatarApi,
  updateUserProfileApi
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/golbal-bus'

export default {
  name: 'SettingsIndex',
  data() {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      userFormRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        intro: [{ required: true, message: '请输入媒体介绍', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImg: '',
      cropper: null, // 裁切器实例
      updatePhotoLoading: false, // 更新用户头像loading状态
      updateProfileLoading: false // 更新基本信息的loading状态
    }
  },
  created() {
    this.loadUser()
  },
  methods: {
    async loadUser() {
      const res = await getUserProfileApi()
      this.user = res.data
    },
    onFileChange() {
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImg = blobData
      this.dialogVisible = true

      // 解决相同文件不触发change事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened() {
      const image = this.$refs.previewImg
      // if (this.cropper) {
      //   this.cropper.replace(this.previewImg)
      //   return
      // }
      this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        // autoCropArea: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true
      })
    },
    onDialogClosed() {
      // 销毁裁切器
      this.cropper.destroy()
    },
    // 获取裁切的图片对象
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    async onUpdatePhoto() {
      // 开启确定按钮的loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      try {
        await updateUserAvatarApi(fd)
        // 服务端展示的图片有点慢
        // this.user.photo = res.data.photo
        // 直接把裁切的文件对象转为blob数据本地预览
        this.user.photo = window.URL.createObjectURL(file)
        this.dialogVisible = false
        this.$message.success('更新头像成功')
        // 发布通知,用户信息已修改
        globalBus.$emit('update-user', this.user)
      } catch (err) {
        this.$message.error('操作失败,请稍后重试')
      }
      // 关闭确定按钮的loading
      this.updatePhotoLoading = false
    },
    resetUserForm() {
      this.$refs.userFormRef.resetFields()
    },
    onUpdateUser() {
      this.$refs.userFormRef.validate(async (valid) => {
        if (!valid) return
        try {
          this.updateProfileLoading = true
          const { name, intro, email } = this.user
          await updateUserProfileApi({
            name,
            intro,
            email
          })
          this.$message.success('保存成功')
          // 发布通知,用户信息已修改
          globalBus.$emit('update-user', this.user)
        } catch (err) {
          this.$message.err('操作失败,请稍后重试')
        }
        this.updateProfileLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.update-photo-wrap {
  width: 150px;
  margin-top: 10px;
  text-align: center;
}
.previewImg-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  .img {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
