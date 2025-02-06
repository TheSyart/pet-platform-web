<template>
  <div class="map-container">
    <div id="container"></div>
    <div id="panel"></div>
    <div id="travel-mode">
      <label>
        <input type="radio" v-model="travelMode" value="driving" @change="updateTravelMode"> 开车
      </label>
      <label>
        <input type="radio" v-model="travelMode" value="walking" @change="updateTravelMode"> 步行
      </label>
      <label>
        <input type="radio" v-model="travelMode" value="bicycling" @change="updateTravelMode"> 骑行
      </label>
    </div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { Message } from "element-ui";
import { GD_SecurityJsCode, GD_key } from "@/views/resource/private/key";

export default {
  name: "map-view",
  props: {
    centerPoint: {
      type: Array,
      required: true,
    },
    targetPoint: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      map: null,
      travelMode: 'driving', // 默认选择开车
      routeService: null, // 保存路径服务实例
    };
  },
  mounted() {
    this.initAMap();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initAMap() {
      window._AMapSecurityConfig = {
        securityJsCode: GD_SecurityJsCode,
      };
      AMapLoader.load({
        key: GD_key,
        version: "2.0",
        plugins: ["AMap.Scale", "PlaceSearch", "ToolBar", "AMap.Driving", "AMap.Walking", "AMap.Riding"],
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            viewMode: "3D",
            zoom: 11,
            center: this.centerPoint,
          });

          this.loadPlugins(AMap);
          this.calculateDistance(AMap);
        })
        .catch((e) => {
          console.error("地图初始化失败:", e);
        });
    },
    addMarkers(AMap) {
      const marker1 = new AMap.Marker({
        position: this.centerPoint,
        title: '起点'
      });
      const marker2 = new AMap.Marker({
        position: this.targetPoint,
        title: '终点'
      });

      this.map.add(marker1);
      this.map.add(marker2);
    },
    loadPlugins(AMap) {
      return new Promise((resolve) => {
        AMap.plugin(["AMap.Scale", "AMap.ToolBar", "AMap.Geolocation"], () => {
          const toolbar = new AMap.ToolBar({ position: 'RT' });
          const scale = new AMap.Scale({ position: 'LB' });
          const geolocation = new AMap.Geolocation({
            buttonPosition: 'RB',
            showMarker: true,
            showCircle: true,
            panToLocation: true
          });

          this.map.addControl(toolbar);
          this.map.addControl(scale);
          this.map.addControl(geolocation);

          resolve();
        });
      });
    },
    calculateDistance(AMap) {
      if (this.routeService) {
        // 清除之前的路径服务
        this.routeService.clear();
      }

      let routeService;
      switch (this.travelMode) {
        case 'driving':
          routeService = new AMap.Driving({
            map: this.map,
            panel: "panel"
          });
          break;
        case 'walking':
          routeService = new AMap.Walking({
            map: this.map,
            panel: "panel"
          });
          break;
        case 'bicycling':
          routeService = new AMap.Riding({
            map: this.map,
            panel: "panel"
          });
          break;
        default:
          console.error('未知的出行方式:', this.travelMode);
          return;
      }

      this.routeService = routeService; // 保存路径服务实例

      routeService.search(this.centerPoint, this.targetPoint, (status, result) => {
        if (status === 'complete') {
          console.log('路径计算成功:', result);
        } else {
          Message.error('路径计算失败:', status, result);
          if (result === 'OVER_DIRECTION_RANGE') {
            Message.error('起点和终点之间的距离超过了服务允许的最大范围');
          }
        }
      });
    },
    updateTravelMode() {
      if (window.AMap) {
        // 清除面板内容
        document.getElementById('panel').innerHTML = '';
        this.calculateDistance(window.AMap);
      } else {
        console.error('AMap 未加载完成');
      }
    },
    handleResize() {
      if (this.map) {
        this.map.resize();
      }
    }
  },
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

#container {
  width: 100%;
  height: 100%;
}

#panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 200px;
  max-height: 300px;
  margin-right: 20px;
  margin-top: 100px;
  overflow-y: auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#travel-mode {
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 40px;
  margin-top: 80px;
}
</style>