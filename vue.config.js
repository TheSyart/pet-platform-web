const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 7070,  // Vue 项目开发服务器的端口
    proxy: {
      '/api': {  // 当请求路径以 /api 开头时，进行代理
        target: 'http://localhost:8080',
        changeOrigin: true,  // 改变请求的源（否则后端可能无法识别）
        pathRewrite: {
          '^/api': '',  // 将请求路径中的 /api 去掉
        },
      },
      '/server-resource': { //http://192.168.31.140/
        target: 'http://localhost:8080',
        changeOrigin: true, 
      },
    }
      // '/ws': {  // 当请求路径以 /ws 开头时，进行代理
      //   target: `ws://localhost:8080/ws`,
      //   changeOrigin: true,  // 改变请求的源（否则后端可能无法识别）
      //   ws: true,  // 代理 WebSocket 请求
      //   pathRewrite: {
      //     '^/ws': '',  // 将请求路径中的 /ws 去掉
      //   },
      // },
  },
});


