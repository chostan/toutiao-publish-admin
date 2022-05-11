const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // 告诉webpack打包的index.html引入其他资源文件以./开头, 不要默认/开头
  devServer: {
    port: 8081
  },
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      // 移除原有默认的入口，添加新的入口文件
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress'
      })
    })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main.js')
    })
  }
})
