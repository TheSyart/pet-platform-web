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
          <el-button type="success" :loading="this.loading" round @click="login"
            style="width: 100%; margin-top: 10px;">登 录</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>





<script>
import { empLogin } from '@/api/login/loginApi';
import { mapActions, mapMutations } from 'vuex';
import { Message } from 'element-ui';
export default {
  data() {
    return {
      username: 'jinyong',  //双向绑定文本框输入值
      password: '123456',
      loading: false
    };
  },
  methods: {
    ...mapActions(['updateGlobalVar']),
    ...mapMutations(['setGlobalVar']),
    async login() {
      this.loading = true;
      try {
        const data = {
          username: this.username,
          password: this.password
        };
        const response = await empLogin(data);
        this.loading = false;
        //更新 Vuex 状态
        this.updateGlobalVar({
          jwt: response.data.jwt,
          id: response.data.id,
          name: response.data.name,
          job: response.data.job,
          permission: response.data.permission
        });
        Message.success('登陆成功！');   //提示成功
        this.$router.push({ name: 'petPlatform' });
      } catch (error) {
        this.loading = false;
        console.error('登陆失败:', error);
      }
    }
  },
  mounted() {
  }
};
</script>

<style></style>