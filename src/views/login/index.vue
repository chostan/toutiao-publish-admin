<template>
  <div class="login-container">
    <div class="login-box">
      <h3 class="login-box-head">芝码头条后台管理系统</h3>
      <el-form ref="loginFormRef" :model="user" :rules="loginFormRules">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            class="login-btn"
            type="primary"
            :loading="loginLoading"
            @click="onLogin"
          >
            登录
          </el-button>
          <el-button class="reset-btn" type="info" @click="resetLoginForm">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi } from '@/api/user'

export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      loginLoading: false,
      loginFormRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          {
            pattern: /^\d{6}$/,
            message: '请输入正确的验证码',
            trigger: 'blur'
          }
        ]
      },
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    onLogin() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        try {
          // 开启登录按钮loading
          this.loginLoading = true
          const { data } = await loginApi(this.user)

          this.$store.commit('setUserInfo', data)
          // this.$router.push({
          //   path: this.$route.query.redirect || '/'
          // })
          this.$router.push('/')

          this.$message.success('登录成功')
        } catch (err) {
          this.$message.error('登录失败,手机号或密码错误')
        }
        // 关闭loading
        this.loginLoading = false
      })
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  height: 100%;
  background: url('./images/login_bg.jpg') no-repeat;
  background-size: cover;
  .login-box {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    padding: 30px 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12px;
    .login-box-head {
      margin-bottom: 20px;
      color: #3c9cfb;
      text-align: center;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
      margin: 0;
      .login-btn,
      .reset-btn {
        width: 100px;
      }
    }
  }
}
</style>
