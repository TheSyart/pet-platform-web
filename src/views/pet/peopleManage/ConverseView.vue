<template>
  <div class="chat-container">
    <div class="left-side">
      <div class="search-wrapper">
        <el-input v-model="searchUserName" placeholder="回车搜索用户" class="search-input"
          @keydown.enter.native="searchUserList(activeName)"></el-input>
      </div>
      <el-tabs class="user-list" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="客户会话" name="0">
          <el-scrollbar>
            <el-row>
              <el-col :span="24" v-for="form in messageForm" :key="form.id" @click.native="chooseUser(form)">
                <div class="user-item">
                  <div class="user-avatar-wrapper">
                    <div :class="{ 'online-dot': form.online }"></div>
                    <el-badge :value="form.isRead" class="message-badge" v-if="form.isRead > 0">
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
        </el-tab-pane>
        <el-tab-pane label="员工会话" name="1">
          <el-scrollbar>
            <el-row>
              <el-col :span="24" v-for="form in messageForm" :key="form.id" @click.native="chooseUser(form)">
                <div class="user-item">
                  <div class="user-avatar-wrapper">
                    <div :class="{ 'online-dot': form.online }"></div>
                    <el-badge :value="form.isRead" class="message-badge" v-if="form.isRead > 0">
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-empty class="right-side" v-if="!currentUser.name" :image-size="200" description="暂无会话"></el-empty>
    <div class="right-side" v-if="currentUser.name">
      <div class="chat-header">
        <span>{{ currentUser.name }}</span>
        <i class="el-icon-close" @click="clearConverse()"></i>
      </div>
      <el-scrollbar class="chat-messages" ref="messageContainer">
        <infinite-loading direction="top" @infinite="infiniteHandler">
          <div slot="no-more">没有更多消息了</div>
          <div slot="no-results">没有消息</div>
        </infinite-loading>
        <div class="messageBox" v-for="(message, index) in messages" :key="index"
          :class="{ ownMessage: message.sender === username, otherMessage: message.receiver === username }">
          <div>
            <el-avatar>{{ message.sender === username ? name : currentUser.name }}</el-avatar>
          </div>
          <div class="message-content-wrapper">
            <div class="messageContent" v-if="message.messageType === 0">{{ message.message }}</div>
            <el-image class="imageContent" v-if="message.messageType === 1" :src="message.message"
              :preview-src-list="[message.message]"></el-image>
            <VideoComponent class="videoContent" v-if="message.messageType === 2" :videoSource="message.message"
              :videoPoster="message.messageCover"></VideoComponent>
              <AudioComponent class="audioContent" v-if="message.messageType === 3" :pcmUrl="message.message"></AudioComponent>
          </div>
        </div>
      </el-scrollbar>
      <div class="chat-input">
        <el-input v-model="message" @keydown.enter.native="sendMessage" placeholder="输入消息" autosize
          class="message-input"></el-input>
        <el-button type="primary" @click="sendMessage" class="send-button">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import { queryConverseList, queryOnePersonMessageList } from '@/api/converse/converseApi';
import WebSocketService from '@/utils/WebSocketService';
import InfiniteLoading from 'vue-infinite-loading';
import VideoComponent from '@/components/VideoComponent.vue';
import AudioComponent from '@/components/AudioComponent.vue';
export default {
  components: {
    InfiniteLoading,
    VideoComponent,
    AudioComponent
  },
  data() {
    return {
      activeName: 0,
      username: "",
      name: "",
      receiver: "",
      message: "",
      originMessages: [],
      messages: [],
      converseNum: 0,
      onlineCount: 0,
      messageForm: [],
      searchUserName: "",
      currentUser: {}
    };
  },
  methods: {
    infiniteHandler($state) {
      this.getOnePersonMessageList($state);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.searchUserList();
    },
    chooseUser(form) {
      // 避免重复选择同一用户
      if (this.currentUser.username === form.username) {
        return;
      }
      this.clearConverse();
      this.$nextTick(() => {
        this.receiver = form.username;
        this.currentUser = form;
      });

    },
    sendMessage() {
      if (this.message.trim() !== "") {
        const msg = { sender: this.username, receiver: this.currentUser.username, sendType: 0, receiverType: 1, message: this.message, messageType: 0 };
        WebSocketService.sendMessage(msg);
        this.originMessages.unshift(msg);
        this.messages.push(msg);
        this.message = "";
        this.scrollToBottom()
      }
    },
    handleMessage(message) {
      if (message.type === 'broadcastOnline') {
        const user = this.messageForm.find(item => item.username === message.username);
        if (user) {
          user.online = message.online;
        }
      } else {
        this.originMessages.unshift(message);
        this.messages.push(message);
        this.scrollToBottom()
      }
    },
    async searchUserList() {
      this.messageForm = [];
      const data = { type: this.activeName, searchName: this.searchUserName, username: this.username };
      const res = await queryConverseList(data);
      this.messageForm = res.data;
    },
    async getOnePersonMessageList($state) {
      try {
        const data = { sender: this.username, receiver: this.currentUser.username, converseNum: this.converseNum };
        const res = await queryOnePersonMessageList(data);
        if (res.data.length === 0) {
          $state.complete();
          return;
        }
        this.messages = [];
        this.originMessages = this.originMessages.concat(res.data);
        this.messages = this.originMessages.slice().reverse();

        $state.loaded();


        if (this.converseNum == 0) {
          this.scrollToBottom()
        }
        this.converseNum = this.originMessages.length;
      } catch (error) {
        console.log(error);
        $state.complete();
      }
    },
    // 滚动到最底部
    scrollToBottom() {
      this.$nextTick(() => {
        const scrollbar = this.$refs.messageContainer.$el.querySelector('.el-scrollbar__wrap');
        if (scrollbar) {
          scrollbar.scrollTop = scrollbar.scrollHeight;
        }
      });
    },
    // 切换用户前清理数据
    clearConverse() {
      this.messages = [];
      this.originMessages = [];
      this.converseNum = 0;
      this.receiver = "";
      this.currentUser = {};
    }
  },
  created() {
    this.username = store.getters.getGlobalVar.username;
    this.name = store.getters.getGlobalVar.name;
    this.searchUserList(0);
  },
  mounted() {
    WebSocketService.onMessage(this.handleMessage);
  },
  beforeDestroy() {
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
  overflow-y: auto;
}

.search-input {
  position: absolute;
  top: 20px;
  left: 20px;
  width: calc(100% - 40px);
  max-width: 300px;
}

.user-list {
  align-items: center;
  margin-top: 40px;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
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
  overflow: hidden;
  padding-left: 15px;
  text-overflow: ellipsis;
  text-align: left;
}

.user-last-message {
  color: #a19f9f;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  padding-left: 15px;
  text-overflow: ellipsis;
  text-align: left;
}

.right-side {
  flex: 5;
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
}

.messageBox {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 10px;
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
}

.videoContent {
  background-color: black;
  width: 200px;
  height: 300px;
  align-self: flex-start;
}

.imageContent {
  max-width: 200px;
  max-height: 300px;
  align-self: flex-start;
}

.audioContent {
  max-width: 200px;
  max-height: 300px;
  align-self: flex-start;
}

.messageContent {
  max-width: 400px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f0f0f0;
  text-align: left;
  word-wrap: break-word;
  white-space: pre-wrap;
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

.message-badge.el-badge__content {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: #f56c6c;
  color: white;
}
</style>