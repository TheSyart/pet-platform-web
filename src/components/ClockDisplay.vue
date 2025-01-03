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
      lineHeight: 64, //跟字体大小和wraper的高度相关！
      // 秒
      arr1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index1: 0, //就是获取真实时间后的起始数字
      arr2: [0, 1, 2, 3, 4, 5],
      index2: 0,
      // 分
      arr3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index3: 0,
      arr4: [0, 1, 2, 3, 4, 5],
      index4: 0,
      // 时
      arr5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index5: 0,
      arr6: [0, 1, 2],
      index6: 0,
    }
  },
  created() {
    this.getTime()
  },
  watch: {
    index5(newVal) {
      // 超过24小时
      if (this.index6 === 2 && newVal === 4) {
        console.log('out')
        for (let i = 1; i < 7; i++) {
          this[`index${i}`] = 0
        }
      }
    }
  },
  methods: {
    getTime() {
      const date = new Date()
      let hour = this.bu0(date.getHours())
      let minute = this.bu0(date.getMinutes())
      let second = this.bu0(date.getSeconds())

      // 秒
      this.index1 = +second[1]
      this.index2 = +second[0]
      // 分
      this.index3 = +minute[1]
      this.index4 = +minute[0]
      // 时
      this.index5 = +hour[1]
      this.index6 = +hour[0]

      this.turnSecond(this.arr1.length)
    },
    bu0(num) {
      let str
      if (num < 10) str = `0${num}`
      else str = `${num}`
      return str.split('')
    },
    turnSecond(length) {
      setInterval(() => {
        if (this.index1 === length - 1) {
          // console.log(1)
          // 通知前一位移动
          this.turnOther(2, this.arr2.length)
          this.index1 = -1
        }
        this.index1++
      }, 1000)
    },
    turnOther(type, length) {
      // type代表第几组数列，例如2，就是从右往左第二列
      if (this[`index${type}`] === length - 1) {
        // console.log(type)
        // 通知前一位移动
        let next = type + 1
        this.turnOther(next, this[`arr${next}`].length)

        this[`index${type}`] = -1
      }
      this[`index${type}`]++
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