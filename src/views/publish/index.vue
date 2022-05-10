<template>
  <div class="publish-container">
    <el-card class="box-card" v-loading="articleLoading">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            {{ $route.query.id ? '修改文章' : '发布文章' }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <el-form
        ref="publishFormRef"
        :model="article"
        :rules="formRules"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="320"
            lang="zh"
            placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">
            {{ $route.query.id ? '修改' : '发表' }}
          </el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChannelApi,
  addArticleApi,
  getArticleContentApi,
  updateArticleApi
} from '@/api/article'
import { uploadImgApi } from '@/api/image'
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  data() {
    const validateContent = (rule, value, callback) => {
      if (value === '<p></p>') {
        callback(new Error('请输入文章内容'))
      } else {
        callback()
      }
    }
    return {
      channels: [], // 文章频道列表
      articleLoading: false,
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          // 文章封面
          type: 0, // 封面的类型
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 自定义图片上传
          uploadRequest(file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImgApi(fd).then((res) => {
              return res.data.url
            })
          }
        }),
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(), // 无序列表
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(), // 全屏
        new Preview(), // 预览
        new CodeBlock(),
        new TextColor()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符之间',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' },
          { validator: validateContent, trigger: 'change' }
        ],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      }
    }
  },
  created() {
    this.loadChannel()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    async loadChannel() {
      const { data } = await getArticleChannelApi()
      this.channels = data.channels
    },
    onPublish(draft = false) {
      this.$refs.publishFormRef.validate(async (valid) => {
        if (!valid) return

        // 验证通过
        const articleId = this.$route.query.id
        if (articleId) {
          // 修改文章
          try {
            await updateArticleApi(articleId, this.article, draft)
            // console.log('res', res)
            this.$message.success(`${draft ? '存入草稿' : '修改文章'}成功`)
            // 跳转到内容管理页面
            const page = this.$route.query.page
            if (page) {
              this.$store.commit('setContentPage', page)
            }
            this.$router.push('/content')
          } catch (errr) {
            this.$message.error(`${draft ? '存入草稿' : '修改文章'}失败`)
          }
        } else {
          // 添加文章
          try {
            await addArticleApi(this.article, draft)
            // console.log(res)
            this.$message.success(`${draft ? '存入草稿' : '发表'}成功`)
            // 跳转到内容管理页面
            this.$router.push('/content')
          } catch (err) {
            this.$message.error(`${draft ? '存入草稿' : '发表'}失败`)
          }
        }
      })
    },
    // 修改文章: 加载文章内容
    async loadArticle() {
      this.articleLoading = true
      try {
        const { data } = await getArticleContentApi(this.$route.query.id)
        this.article = data
      } catch (err) {}
      this.articleLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
