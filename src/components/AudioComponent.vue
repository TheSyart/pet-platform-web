<template>
  <div>
    <el-button :style="{
      width: buttonWidth,
      height: buttonHeight,
      display: 'flex',
      alignItems: 'center'
    }" round @click="playPCM">
      <img style="height: 15px; width: 15px; margin-right: 5px;" src="@/views/resource/left_audio3.png" />
    </el-button>
    <!-- <audio ref="audioPlayer" :src="audioUrl"></audio> -->
  </div>
</template>

<script>
import {playPCMFromUrl} from '@/utils/audioUtils';
export default {
  props: {
    pcmUrl: {
      type: String,
      required: true
    },
    buttonWidth: {
      type: String,
      default: '100px'
    },
    buttonHeight: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      audioUrl: null,
      sampleRate: 16000,
      bitDepth: 16,
      numChannels: 2
    };
  },
  methods: {
    async playPCM() {
      try {
        await playPCMFromUrl(this.pcmUrl, this.sampleRate, this.bitDepth, this.numChannels);
      } catch (error) {
        console.error('播放 PCM 语音时出错:', error);
      }
    }
  }
};
</script>

<style scoped>
/* 你的样式 */
</style>