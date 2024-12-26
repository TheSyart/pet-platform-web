<template>
  <div id="app">
    <h1>高德地图 Vue 2 示例</h1>
    <MapView :centerPoint="centerPoint" :targetPoint="targetPoint" style="width: 100%; height: 600px;" />
  </div>
</template>

<script>
import MapView from "@/components/MapView.vue";

export default {
  name: "App",
  components: {
    MapView,
  },
  data() {
    return {
      centerPoint: [117.24619443753649, 31.815551443626454], // 示例起点坐标
      targetPoint: [117.324299,31.892035], // 示例终点坐标
    };
  },
};
</script>

<style>
#app {
  text-align: center;
}
</style>