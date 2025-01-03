<template>
  <el-card>
    <div class="wraper">
      <div class="column" :style="{ transform: `translateY(${-lineHeight * index6}px)` }">
        <div class="num" v-for="(item, index) in arr6" :key="index">{{ item }}</div>
      </div>

      <div class="column" :style="{ transform: `translateY(${-lineHeight * index5}px)` }">
        <div class="num" v-for="(item, index) in arr5" :key="index">{{ item }}</div>
      </div>

      <div>:</div>

      <div class="column" :style="{ transform: `translateY(${-lineHeight * index4}px)` }">
        <div class="num" v-for="(item, index) in arr4" :key="index">{{ item }}</div>
      </div>

      <div class="column" :style="{ transform: `translateY(${-lineHeight * index3}px)` }">
        <div class="num" v-for="(item, index) in arr3" :key="index">{{ item }}</div>
      </div>

      <div>:</div>

      <div class="column" :style="{ transform: `translateY(${-lineHeight * index2}px)` }">
        <div class="num" v-for="(item, index) in arr2" :key="index">{{ item }}</div>
      </div>

      <div class="column" :style="{ transform: `translateY(${-lineHeight * index1}px)` }">
        <div class="num" v-for="(item, index) in arr1" :key="index">{{ item }}</div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      lineHeight: 64,
      arr1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index1: 0,
      arr2: [0, 1, 2, 3, 4, 5],
      index2: 0,
      arr3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index3: 0,
      arr4: [0, 1, 2, 3, 4, 5],
      index4: 0,
      arr5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index5: 0,
      arr6: [0, 1, 2],
      index6: 0,
      lastUpdate: Date.now(),
      timerId: null,
      isPageVisible: true
    }
  },
  created() {
    this.updateTime();
    this.timerId = setInterval(this.updateTime, 1000);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeDestroy() {
    clearInterval(this.timerId);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    updateTime() {
      const now = Date.now();
      this.lastUpdate = now;

      const date = new Date(now);
      let hour = this.bu0(date.getHours());
      let minute = this.bu0(date.getMinutes());
      let second = this.bu0(date.getSeconds());

      // 秒
      this.index1 = +second[1];
      this.index2 = +second[0];
      // 分
      this.index3 = +minute[1];
      this.index4 = +minute[0];
      // 时
      this.index5 = +hour[1];
      this.index6 = +hour[0];

      // 处理跨天
      if (this.index6 === 2 && this.index5 === 4) {
        this.resetTime();
      }
    },
    resetTime() {
      for (let i = 1; i < 7; i++) {
        this[`index${i}`] = 0;
      }
    },
    bu0(num) {
      let str = num < 10 ? `0${num}` : `${num}`;
      return str.split('');
    },
    handleVisibilityChange() {
      this.isPageVisible = !document.hidden;
      if (this.isPageVisible) {
        // 页面重新可见时立即更新时间
        this.updateTime();
      }
    }
  }
}
</script>

<style scoped>
.el-card {
  width: 300px;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.wraper {
  text-align: center;
  background: #ffffff;
  height: 64px;
  font-size: 48px;
  font-weight: bolder;
  letter-spacing: 7px;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.column {
  transition: transform 300ms;
}

.num {
  height: 64px;
}
</style>