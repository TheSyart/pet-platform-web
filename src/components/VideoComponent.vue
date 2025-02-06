<template>
  <div class="video-container">
    <video ref="videoPlayer" class="videoContent" :src="videoSource"
      :poster="videoPoster" :controls="!visibility" @play="handleVideoPlay" @ended="handleVideoEnded"
      ></video>
      <i none class="el-icon-video-play play-btn" v-show="visibility" @click="playVideo"></i>
  </div>
</template>

<script>
export default {
  name: 'VideoComponent',
  props: {
    videoSource: {
      type: String,
      required: true
    },
    videoPoster: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visibility: true
    };
  },
  methods: {
    playVideo() {
      this.$refs.videoPlayer.play();
    },
    handleVideoPlay() {
      this.visibility = false;
      // 当点击播放时，显示控制条
    },
    handleVideoEnded() {
      this.visibility = true;
    }
  }
};
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  /* 添加鼠标指针样式 */
}

.videoContent {
  width: 100%;
  height: 100%;
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent; /* 移除背景颜色 */
  z-index: 1;
  color: white; /* 设置图标颜色为白色 */
  font-size: 4em; /* 设置图标大小为较大尺寸 */
}
</style>