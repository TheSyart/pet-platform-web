<template>
  <div class="chat-container">
    <div class="left-side">

      <div class="search-wrapper">
        <el-input v-model="searchUserName" placeholder="回车搜索用户" class="search-input"
          @keydown.enter.native="searchUserForForm"></el-input>
      </div>

      <el-scrollbar class="user-list-scroll">
        <el-row>
          <el-col :span="24" v-for="form in messageForm" :key="form.id" @click.native="chooseUser(form)">
            <div class="user-item">
              <div class="user-avatar-wrapper">
                <div :class="{ 'online-dot': form.online }"></div>

                <el-badge :value="2" class="message-badge" v-if="form.online">
                  <img :src="form.image" class="user-avatar">
                </el-badge>
                <img :src="form.image" class="user-avatar" v-else>
              </div>
              <div class="user-details">
                <div class="user-name">{{ form.name }}</div>
                <div class="user-last-message">{{ form.username }}&nbsp;</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>


    <el-empty class="right-side" v-if="!currentUser.name" :image-size="200" description="暂无会话"></el-empty>
    <div class="right-side" v-if="currentUser.name">
      <div class="chat-header">
        <span>{{ currentUser.name }}</span>
        <i class="el-icon-close" @click="chooseUser({})"></i>
      </div>



      <el-scrollbar class="chat-messages" ref="messageContainer">
        <div class="messageBox" v-for="(message, index) in middleMessages" :key="index"
          :class="{ ownMessage: message.sender === username, otherMessage: message.receiver === username }">
          <div> <el-avatar>{{ message.sender === username ? username : currentUser.name }}</el-avatar></div>
          <div class="messageContent">{{ message.message }}</div>
          <!-- <div class="messageTime">{{ message.createTime.replace('T', ' ') }}</div> -->
        </div>
      </el-scrollbar>
      <div class="chat-input">
        <el-input v-model="message" @keydown.enter="sendMessage" placeholder="输入消息" autosize
          class="message-input"></el-input>
        <el-button type="primary" @click="sendMessage" class="send-button">发送</el-button>
      </div>


    </div>


  </div>
</template>



<script>
import store from '@/store';
import { queryConverseList } from '@/api/converse/converseApi';
import WebSocketService from '@/utils/WebSocketService'; // 引入 WebSocket 服务

export default {
  data() {
    return {
      username: "",       //当前用户
      receiver: "",       //接收者
      message: "",        //输入框的消息
      messages: [],       //全部消息列表
      middleMessages: [],   //一个用户消息列表容器
      onlineCount: 0,     //在线人数
      messageForm: [],    //用户列表
      searchUserName: "", //搜索用户
      currentUser: {},    //当前选择聊天用户全部信息
    };
  },
  methods: {
    chooseUser(form) {
      this.middleMessages = []; //清空容器消息列表
      this.receiver = form.username;
      this.currentUser = form;
      this.messages.forEach(item => {
        if (item.sender === form.username || item.receiver === form.username) {
          this.middleMessages.push(item);
        }
      });
    },
    sendMessage() {
      if (this.message.trim() !== "") {

        WebSocketService.sendMessage(this.message, this.receiver); // 发送消息

        const msg = { sender: this.username, message: this.message, receiver: this.currentUser.username };

        this.messages.push(msg);

        this.middleMessages.push(msg);
        this.message = ""; // 清空输入框


      }
    },
    handleMessage(message) {
      if (message.type === 'broadcastOnline') { // 广播通知 在线人数变化,更改变化者状态
        const user = this.messageForm.find(item => item.username === message.username);
        if (user) {
          user.online = message.online;
        }
      } else {    // 普通消息
        this.messages.push(message);
        this.middleMessages.push(message);
      }
    },
    async searchUserForForm() {
      const res = await queryConverseList(0);
      this.messageForm = res.data;
    },
  },
  created() {
    this.username = store.getters.getGlobalVar.username;
    this.searchUserForForm();
  },
  mounted() {
    // 监听接收到的消息
    WebSocketService.onMessage(this.handleMessage);
  },
  beforeDestroy() {
    // 组件销毁前断开 WebSocket 连接
    WebSocketService.disconnect();
  }
};
</script>




<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  background: linear-gradient(to bottom right, #FFFFFF, #ECEFF1);
}

.left-side {
  position: relative;
  flex: 1;
  padding: 20px;
  border-right: 1px solid #eaeaea;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  position: absolute;
  top: 20px;
  left: 20px;
  width: calc(100% - 40px);
  max-width: 300px;
}

.user-list-scroll {
  top: 40px;
  height: calc(100% - 40px);
  overflow-y: auto;
}

.user-avatar-wrapper {
  position: relative;
  display: inline-block;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid #74ffd2;
}

.user-name {
  font-weight: 800;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 溢出隐藏 */
  padding-left: 15px;
  text-overflow: ellipsis;
  /* 超出显示省略号 */
  text-align: left;
  /* 添加左对齐属性 */
}

.user-last-message {
  color: #a19f9f;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  padding-left: 15px;
  text-overflow: ellipsis;
  text-align: left;
  /* 添加左对齐属性 */
}

.right-side {
  flex: 3;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eaeaea;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.el-icon-close {
  position: absolute;
  right: 0;
  cursor: pointer;
  margin-right: 30px;
  
}

.chat-header {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
  font-size: 1.2em;
  color: #37474F;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-input {
  padding: 20px;
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  margin-right: 10px;
}

.send-button {
  flex-shrink: 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f2;
}

.user-item:hover {
  background-color: #E0E0E0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-details {
  flex-grow: 1;
  /* 填充剩余空间 */
}

.messageBox {
  display: flex;
  align-items: flex-start;
  /* 将头像和文本第一行对齐 */
  margin-bottom: 10px;
}

.messageBox img {
  width: 40px;
  /* 调整头像大小 */
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
}

.messageContent {
  max-width: 70%;
  /* 调整发送信息宽度 */
  padding: 10px;
  border-radius: 8px;
  background-color: #f0f0f0;
  text-align: left;
  /* 文本左对齐 */
  word-wrap: break-word;
  /* 当文本过长时自动换行 */
}

.messageTime {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
  margin-top: 5px;
  /* 将发送时间与文本分隔开 */
}

.ownMessage {
  flex-direction: row-reverse;
  align-items: flex-end;
  /* 将发送时间放置在最下方的贴右位置 */
}

.otherMessage {
  flex-direction: row;
  align-items: flex-end;
  /* 将发送时间放置在最下方的贴左位置 */
}

.online-dot {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 10px;
  height: 10px;
  background-color: #01c201;
  border-radius: 50%;
}

.message-badge .el-badge__content {
  position: absolute;
  bottom: 5px;
  /* Adjust to your desired position */
  left: 5px;
  /* Adjust to your desired position */
  background-color: #f56c6c;
  /* Red background for visibility */
  color: white;
  /* White text color */
}
</style>
