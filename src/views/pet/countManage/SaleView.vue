<template>
  <div class="main-content">

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
import { formatDateTime } from '@/utils/commonFunction';
import { queryAllOrderInfoDetailsCount, queryAllShoppingSale } from '../../../api/sale/saleApi';
import { shoppingSaleOptions, serviceMostSaleOptions, shoppingMostSaleOptions, serviceSaleOptions } from '../../../api/sale/saleData.js';
import { fetchData } from '../../../api/common/dataFetcher.js';
import { orderType } from '../../../api/common/CommonData.js';
import EChart from '../../../components/EChart.vue';
export default {
  components: {
    EChart
  },
  data() {
    return {
      shoppingSaleOptions: shoppingSaleOptions,
      serviceMostSaleOptions: serviceMostSaleOptions,
      shoppingMostSaleOptions: shoppingMostSaleOptions,
      serviceSaleOptions: serviceSaleOptions,
      orderTypeMap: orderType,
      shoppingTypeMap: [],
      serviceTypeMap: [],
      start: '',  //筛选时间的参数
      end: '',
      activeName: ''
    }
  },
  methods: {
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

    async getInformation() {
      const start = formatDateTime(this.start);
      const end = formatDateTime(this.end)
      const params = { start: start, end: end };

      try {
        const response = await queryAllOrderInfoDetailsCount(params);
        this.updatePinChartData(response.data);
      } catch (error) {
        console.error('错误:', error);
      }

      try {
        const response = await queryAllShoppingSale(params);
        this.updateBarChartData(response.data);
      } catch (error) {
        console.error('错误:', error);
      }
    },
    async getData() {
      try {
        this.shoppingTypeMap = await fetchData('shoppingType');
        this.serviceTypeMap = await fetchData('serviceType');
        this.updateTime('day', 1);
      } catch (error) {
        console.error('错误:', error);
      }
    }
  },
  mounted() {
    this.getData();
    
  },
};
</script>