<template>
    <div ref="chart" class="chart" :style="{ width: width, height: height }"></div>
  </template>
  
  <script>
  import * as echarts from "echarts";
  
  export default {
    name: "EChart",
    props: {
      options: {
        type: Object,
        required: true,
      },
      width: {
        type: String,
        default: "100%",
      },
      height: {
        type: String,
        default: "400px",
      },
    },
    data() {
      return {
        chartInstance: null,
      };
    },
    mounted() {
      this.initChart();
      window.addEventListener("resize", this.resizeChart);
    },
    watch: {
      options: {
        deep: true,
        handler(newOptions) {
          this.updateChart(newOptions);
        },
      },
    },
    methods: {
      initChart() {
        this.chartInstance = echarts.init(this.$refs.chart);
        this.updateChart(this.options);
      },
      updateChart(options) {
        if (this.chartInstance) {
          this.chartInstance.setOption(options);
        }
      },
      resizeChart() {
        if (this.chartInstance) {
          this.chartInstance.resize();
        }
      },
    },
    beforeDestroy() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      window.removeEventListener("resize", this.resizeChart);
    },
  };
  </script>
  
  <style scoped>
  /* 添加样式以确保图表正常显示 */
  div {
    display: block;
  }
  </style>
  