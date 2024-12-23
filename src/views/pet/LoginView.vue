<template>
  <div class="background-container">
    <el-container style="height: 100vh; display: flex; justify-content: center; align-items: center;">
      <el-main style="width: 40%; display: flex; flex-direction: column; align-items: center; margin-top: -20px;">
        <div class="login-box" style="text-align: center; width: 100%;">
          <h1 style="font-size: 30px; margin-bottom: 30px; ">宠物管理平台</h1>
          
          <!-- 账号输入框及标签 -->
          <div style="width: 100%; margin-bottom: 30px;">
            <span style="font-size: 20px; margin-right: 10px;">账 户:</span>
            <el-input v-model="username" placeholder="请输入账号" style="width: 80%;" />
          </div>
          
          <!-- 密码输入框及标签 -->
          <div style="width: 100%; margin-bottom: 30px;">
            <span style="font-size: 20px; margin-right: 10px;">密 码:</span>
            <el-input v-model="password" placeholder="请输入密码" type="password" show-password style="width: 80%;" />
          </div>
          
          <!-- 登录按钮 -->
          <el-button type="success" :loading="this.loading" round @click="login" style="width: 100%; margin-top: 10px;">登 录</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>





<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: 'jinyong',  //双向绑定文本框输入值
      password: '123456',
      loading : false
    };
  },
  methods: {
    login() {
      
      // 清除本地存储
      localStorage.clear();

      const username = this.username;
      const password = this.password;
      if (username === '' || password === '') {
        this.notice_warning('用户名和密码不可为空！')

      } else {
        this.loading = true;

        axios.post("/api/login/empLogin", { username, password })
          .then(response => {
            console.log('成功:', response.data);
            if (response.data.code === 200 && response.data.data != null) {
              this.loading = false;
              this.notice_success('登陆成功！');
              localStorage.setItem('jwt', response.data.data.jwt);
              localStorage.setItem('role', response.data.data.role);
              localStorage.setItem('permission', JSON.stringify(response.data.data.permission));
              this.$router.push({ name: 'petPlatform' });
            } else {
              this.notice_error(response.data.message);
              this.loading = false;
            }

          })
          .catch(error => {
            console.error('Error fetching data:', error);
            this.loading = false;
          });



      }




    },
    notice_success(msg) {
      this.$message.success(msg);
    },
    notice_warning(msg) {
      this.$message.warning(msg);
    },
    notice_error(msg) {
      this.$message.error(msg);
    }


  },
  mounted() {
  }
};
</script>

<style></style>