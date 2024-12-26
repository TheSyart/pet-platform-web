<template>
  <div class="main-content">
    <!-- 使用 DataFetcher 组件获取数据 -->
    <DataFetcher dataType="petOrder" @data-fetched="handlePetOrderData" />
    <DataFetcher dataType="petService" @data-fetched="handlePetServiceData" />
    <DataFetcher dataType="shoppingType" @data-fetched="handleShoppingTypeData" />

    <el-main style="display: flex; flex-direction: column;">
      <div style="display: flex; flex: 1;">
        <el-tooltip class="item" effect="light" content="近一天" placement="top">
          <el-button @click="updateTime('day', 1)">近一天</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="近一周" placement="top">
          <el-button @click="updateTime('day', 7)">近一周</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="近一月" placement="top">
          <el-button @click="updateTime('month', 1)">近一月</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="近一年" placement="top">
          <el-button @click="updateTime('year', 1)">近一年</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="全部" placement="top">
          <el-button @click="updateTime('null', null)">全部</el-button>
        </el-tooltip>
      </div>
      <!-- 图表 -->
      <div style="display: flex; flex: 1;">
        <el-card class="box-card">
          <EChart :options="shoppingSaleOptions" :width="'100%'" :height="'500px'" />
        </el-card>
        <el-card class="box-card">
          <EChart :options="serviceSaleOptions" :width="'100%'" :height="'500px'" />
        </el-card>
      </div>
      <div style="display: flex; flex: 1;">
        <el-card class="box-card">
          <EChart :options="shoppingMostSaleOptions" :width="'100%'" :height="'500px'" />
        </el-card>
        <el-card class="box-card">
          <EChart :options="serviceMostSaleOptions" :width="'100%'" :height="'500px'" />
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';
import DataFetcher from '../../../components/DataFetcher.vue';
import CommonData from '../../../commonData/CommonData.js';
import EChart from '../../../components/EChart.vue';
export default {
  components: {
    EChart,
    DataFetcher
  },
  computed: {


  },
  data() {
    return {
      shoppingSaleOptions: {
        title: {
          text: '宠物商城各类商品销售占比图',
          subtext: '总销售额',
          left: 'center',
          subtextStyle: {
            fontSize: 16, // 设置字体大小
            color: '#333', // 设置字体颜色
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}元 ({d}%)'  // 显示百分比
        },
        legend: {
          data: this.hoppingTypeMap,
          orient: 'horizontal',
          bottom: '0%',
          left: 'center'
        },
        color: [
          "#5470C6", "#91CC75", "#EE6666", "#FAC858", "#73C0DE",
          "#3BA272", "#FC8452", "#9A60B4", "#EA7CCC", "#3C91E6",
          "#FF9F7F", "#62C1D4", "#D4A5A5", "#A29BFE"
        ],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '宠物商城',
            type: 'pie',
            radius: '50%',
            data: [],  // 数据将动态填充
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{b}: {d}%'  // 显示百分比
            }
          }
        ]
      },
      serviceSaleOptions: {
        title: {
          text: '宠物服务各类商品销售占比图',
          subtext: '总销售额',
          left: 'center',
          subtextStyle: {
            fontSize: 16, // 设置字体大小
            color: '#333', // 设置字体颜色
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}元 ({d}%)'  // 显示百分比
        },
        legend: {
          orient: 'horizontal',
          bottom: '0%',
          left: 'center'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '宠物服务',
            type: 'pie',
            radius: '50%',
            data: [],  // 数据将动态填充
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{b}: {d}%'  // 显示百分比
            }
          }
        ]
      },
      shoppingMostSaleOptions: {
        title: {
          text: '宠物商城销量前十商品'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let result = `${params[0].axisValue}<br/>`; // 添加 xAxis 的值（商品名称）
            params.forEach(item => {
              if (item.seriesName === '商品销售量') {
                result += `${item.marker} ${item.seriesName}: ${item.value} 件<br/>`;
              } else if (item.seriesName === '商品销售额') {
                result += `${item.marker} ${item.seriesName}: ${item.value} 元<br/>`;
              }
            });
            return result;
          }
        },
        legend: {},
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            interval: 0, // 强制所有标签显示
            rotate: 0,  // 旋转角度
            fontSize: 10 // 调整字体大小
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '销售量',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#409EFF' // 蓝色，代表销售量
              }
            },
            axisLabel: {
              formatter: '{value} 件' // 单位改为“件”
            }
          },
          {
            type: 'value',
            name: '销售额',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#67C23A' // 绿色，代表销售额
              }
            },
            axisLabel: {
              formatter: '{value} 元' // 单位改为“元”
            }
          }
        ],

        series: [
          {
            name: '商品销售量',
            type: 'bar',
            data: []
          },
          {
            name: '商品销售额',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },

      serviceMostSaleOptions: {
        title: {
          text: '宠物服务销量前十商品'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let result = `${params[0].axisValue}<br/>`; // 添加 xAxis 的值（商品名称）
            params.forEach(item => {
              if (item.seriesName === '商品销售量') {
                result += `${item.marker} ${item.seriesName}: ${item.value} 件<br/>`;
              } else if (item.seriesName === '商品销售额') {
                result += `${item.marker} ${item.seriesName}: ${item.value} 元<br/>`;
              }
            });
            return result;
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            interval: 0, // 强制所有标签显示
            rotate: 0,  // 旋转角度
            fontSize: 10 // 调整字体大小
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '销售量',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#409EFF' // 蓝色，代表销售量
              }
            },
            axisLabel: {
              formatter: '{value} 件' // 单位改为“件”
            }
          },
          {
            type: 'value',
            name: '销售额',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#67C23A' // 绿色，代表销售额
              }
            },
            axisLabel: {
              formatter: '{value} 元' // 单位改为“元”
            }
          }
        ],

        series: [
          {
            name: '商品销售量',
            type: 'bar',
            data: []
          },
          {
            name: '商品销售额',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      ...CommonData,
      orderTypeMap: [],
      shoppingTypeMap: [],
      serviceTypeMap: [],
      start: '',  //筛选时间的参数
      end: '',
      activeName: ''
    }
  },
  methods: {
    handlePetOrderData(data) {
      this.orderTypeMap = data; // 直接赋值字符串数组
    },
    handlePetServiceData(data) {
      this.serviceTypeMap = data;
    },
    handleShoppingTypeData(data) {
      this.shoppingTypeMap = data;
    },
    updateTime(type, time) {
      this.end = new Date(); // 当前时间
      let startTime = new Date(this.end);

      // 动态计算时间范围并更新标题
      let timeDescription = ""; // 用于显示在统计标题中的时间范围描述

      if (type === 'day') {
        // 计算近几天的时间范围
        startTime.setDate(startTime.getDate() - time); // 减去 `time` 天
        this.start = startTime;
        timeDescription = `近${time}天`;
      } else if (type === 'month') {
        // 计算近几个月的时间范围
        startTime.setMonth(startTime.getMonth() - time); // 减去 `time` 月
        this.start = startTime;
        timeDescription = `近${time}月`;
      } else if (type === 'year') {
        // 计算近几年的时间范围
        startTime.setFullYear(startTime.getFullYear() - time); // 减去 `time` 年
        this.start = startTime;
        timeDescription = `近${time}年`;
      } else if (type === 'null') {
        // 全部时间范围
        this.start = null;
        timeDescription = "全部";
      } else {
        // 默认处理逻辑或警告
        console.warn("Invalid time value");
        this.start = null; // 默认设置为无限制
        timeDescription = "默认";
      }

      // 更新统计标题
      this.shoppingSaleOptions.title.text = `宠物商城各类商品销售占比图 (${timeDescription})`;
      this.serviceSaleOptions.title.text = `宠物服务各类商品销售占比图 (${timeDescription})`;
      this.shoppingMostSaleOptions.title.text = `宠物商城销量前十商品 (${timeDescription})`;
      this.serviceMostSaleOptions.title.text = `宠物服务销量前十商品 (${timeDescription})`;
      // 调用获取数据的方法
      this.getInformation();
    },
    onSubmit(formData) {
      this.searchForm = formData;
      this.getInformation();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.getInformation();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getInformation();
    },
    updatePinChartData(responseData) {
      const result = {};
      const saleTotal = {};

      // 遍历 responseData 数据
      responseData.forEach(order => {
        const orderType = order.orderType; // 获取订单类型
        result[orderType] = [];
        saleTotal[orderType] = 0;

        // 处理 orderInfoList，确保其为有效数组
        const orderInfoList = order.orderInfoList || [];
        orderInfoList.forEach(item => {
          // 累加总销售额
          saleTotal[orderType] += item.saleTotal;

          // 构造图表数据
          result[orderType].push({
            name: orderType === 0
              ? this.shoppingTypeMap[item.category] // 使用购物类型映射表
              : this.serviceTypeMap[item.category], // 使用服务类型映射表
            value: item.saleTotal
          });
        });

        // 根据订单类型更新图表配置
        if (orderType === 0) {
          this.shoppingSaleOptions.title.subtext = `总销售额: ${saleTotal[0].toFixed(2)} 元`;
          this.shoppingSaleOptions.series[0].data = result[0];
        } else {
          this.serviceSaleOptions.title.subtext = `总销售额: ${saleTotal[1].toFixed(2)} 元`;
          this.serviceSaleOptions.series[0].data = result[1];
        }
      });
    },
    updateBarChartData(responseData) {
      const result = {};

      // 遍历 responseData 数据
      responseData.forEach(order => {
        const orderType = order.orderType; // 获取订单类型

        // 初始化 result[orderType]，确保不会覆盖已有数据
        if (!result[orderType]) {
          result[orderType] = {
            shoppingNames: [],
            saleVolumes: [],
            saleTotals: []
          };
        }

        // 确保 orderInfoList 是有效数组
        const orderInfoList = order.orderInfoList || [];
        orderInfoList.forEach(item => {
          // 校验字段非空后再加入
          if (item.shoppingName) {
            result[orderType].shoppingNames.push(item.shoppingName);
          }
          if (item.saleVolumes !== undefined) {
            result[orderType].saleVolumes.push(item.saleVolumes);
          }

          if (item.saleTotal !== undefined) {
            console.log("saleTotal" + item.saleTotal);
            result[orderType].saleTotals.push(item.saleTotal);
          }
        });
      });

      // 设置 orderType 为 0 的数据到图表
      if (result[0]) {
        this.shoppingMostSaleOptions.xAxis.data = result[0].shoppingNames.length > 10 ? result[0].shoppingNames.slice(0, 10) : result[0].shoppingNames;
        this.shoppingMostSaleOptions.series[0].data = result[0].shoppingNames.length > 10 ? result[0].saleVolumes.slice(0, 10) : result[0].saleVolumes;
        this.shoppingMostSaleOptions.series[1].data = result[0].shoppingNames.length > 10 ? result[0].saleTotals.slice(0, 10) : result[0].saleTotals;
      }
      if (result[1]) {
        this.serviceMostSaleOptions.xAxis.data = result[1].shoppingNames.length > 10 ? result[1].shoppingNames.slice(0, 10) : result[1].shoppingNames;
        this.serviceMostSaleOptions.series[0].data = result[1].shoppingNames.length > 10 ? result[1].saleVolumes.slice(0, 10) : result[1].saleVolumes;
        this.serviceMostSaleOptions.series[1].data = result[1].shoppingNames.length > 10 ? result[1].saleTotals.slice(0, 10) : result[1].saleTotals;
      }
    },

    getInformation() {
      const start = this.$formatDateTime(this.start);
      const end = this.$formatDateTime(this.end)

      console.log('start------------>' + start);
      console.log('end------------>' + end);

      axios.get("/api/petOrder/queryAllOrderInfoDetailsCount",
        {
          params: {
            start: start,
            end: end,
          },
          headers: {
            'token': `${localStorage.getItem('jwt')}`
          }
        }).then((result) => {
          this.updatePinChartData(result.data.data);

        }).catch(error => {
          console.error('错误:', error);
        });

      axios.get("/api/petOrder/queryAllShoppingSale",
        {
          params: {
            start: start,
            end: end,
          },
          headers: {
            'token': `${localStorage.getItem('jwt')}`
          }
        }).then((result) => {
          this.updateBarChartData(result.data.data);

        }).catch(error => {
          console.error('错误:', error);
        });
    },


  },
  mounted() {
    this.updateTime('day', 1);
  },
};
</script>