<template>
    <div>
      <h1>当前在线人数: {{ onlineCount }}</h1>
      <input v-model="message" @keyup.enter="sendMessage" placeholder="输入消息" />
      <button @click="sendMessage">发送</button>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import WebSocketService from '@/utils/WebSocketService'; // 引入 WebSocket 服务
  
  export default {
    data() {
      return {
        username: "Alice",
        receiver: "bob",
        message: "",
        messages: [],
        onlineCount: 0
      };
    },
    mounted() {
      // 监听接收到的消息
      WebSocketService.onMessage(this.handleMessage);
    },
    methods: {
      sendMessage() {
        if (this.message.trim() !== "") {
          WebSocketService.sendMessage(this.message,this.receiver); // 发送消息
          this.message = ""; // 清空输入框
        }
      },
      handleMessage(message) {
        console.log("收到消息:", message);
        // 解析消息并更新组件状态
        if (message.includes("当前在线人数")) {
          // 如果是在线人数的消息
          console.log("在线人数:", message.split(":")[1]);
          this.onlineCount = message.split(":")[1];
        } else {
          // 普通聊天消息
          this.messages.push(message);
        }
      }
    },
    beforeDestroy() {
      // 组件销毁前断开 WebSocket 连接
      WebSocketService.disconnect();
    }
  };
  </script>
  