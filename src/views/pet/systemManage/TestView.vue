<template>
  <div>
    <button @click="playAudio">播放音频</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pcmUrl: "/server-resource/converse/audio/2d0fd633-2509-47fc-a67a-534da06a8a30.pcm", // 替换为实际的 PCM 音频 URL
      audioContext: null
    };
  },
  methods: {
    async playAudio() {
      try {
        // 创建音频上下文
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 获取 PCM 数据
        const response = await fetch(this.pcmUrl);
        const arrayBuffer = await response.arrayBuffer();

        // 假设 PCM 数据是 16 位有符号整数，立体声，采样率 16000 Hz
        const sampleRate = 16000;
        const numChannels = 2;
        // const bitDepth = 16;

        // 解码 PCM 数据
        const pcmData = new Int16Array(arrayBuffer);
        const channelData = new Array(numChannels);
        for (let channel = 0; channel < numChannels; channel++) {
          channelData[channel] = new Float32Array(pcmData.length / numChannels);
          for (let i = 0; i < pcmData.length / numChannels; i++) {
            const index = i * numChannels + channel;
            channelData[channel][i] = pcmData[index] / 32767; // 将 16 位整数转换为 -1 到 1 之间的浮点数
          }
        }

        // 创建音频缓冲区
        const audioBuffer = this.audioContext.createBuffer(numChannels, pcmData.length / numChannels, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
          audioBuffer.copyToChannel(channelData[channel], channel);
        }

        // 创建音频源节点
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // 连接音频节点
        source.connect(this.audioContext.destination);

        // 播放音频
        source.start();
      } catch (error) {
        console.error('播放音频失败:', error);
      }
    }
  }
};
</script>

<style scoped>
/* 可添加样式 */
</style>