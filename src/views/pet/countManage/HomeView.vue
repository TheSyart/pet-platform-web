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

      <div style="display: flex; flex: 1;">

        <el-card class="box-card">
          <div style="display: flex; justify-content: space-between; text-align: center;">

            <div style="flex: 1;">
              <el-statistic title="总访问量">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ loginData[0]?.total + loginData[1]?.total || 0 }}次
                  </span>
                </template>
              </el-statistic>
            </div>

            <div style="flex: 1;">
              <el-statistic title="客户访问量">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                     {{ loginData[0]?.total || 0 }}次
                  </span>
                </template>
              </el-statistic>
            </div>

            <div style="flex: 1;">
              <el-statistic title="员工访问量">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                     {{ loginData[1]?.total || 0 }}次
                  </span>
                </template>
              </el-statistic>
            </div>
          </div>
        </el-card>

        <el-card class="box-card">
          <div style="display: flex; justify-content: space-between; text-align: center;">
            <div style="flex: 1;">
              <el-statistic title="完成订单">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ orderData[0]?.finish + orderData[1]?.finish || 0 }}单
                  </span>
                </template>
              </el-statistic>
            </div>
            <div style="flex: 1;">
              <el-statistic title="待完成订单">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ orderData[0]?.finishing + orderData[0]?.timeout + orderData[1]?.finishing + orderData[1]?.timeout
                    || 0 }}单
                  </span>
                </template>
              </el-statistic>
            </div>
            <div style="flex: 1;">
              <el-statistic title="取消订单">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ orderData[0]?.remove + orderData[1]?.remove || 0 }}单
                  </span>
                </template>
              </el-statistic>
            </div>
            <div style="flex: 1;">
              <el-statistic title="待取消订单">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ orderData[0]?.removing + orderData[1]?.removing || 0 }}单
                  </span>
                </template>
              </el-statistic>
            </div>
          </div>
        </el-card>

        <el-card class="box-card">
          <div style="display: flex; justify-content: space-between; text-align: center;">
            <div style="flex: 1;">
              <el-statistic title="总营业额">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ (orderData[0]?.totalPrice + orderData[1]?.totalPrice || 0).toFixed(2) }}元
                  </span>
                </template>
              </el-statistic>
            </div>
            <div style="flex: 1;">
              <el-statistic title="宠物商城">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ (orderData[0]?.totalPrice || 0).toFixed(2) }}元
                  </span>
                </template>
              </el-statistic>
            </div>
            <div style="flex: 1;">
              <el-statistic title="宠物服务">
                <template slot="formatter">
                  <span style="font-size: 18px; font-weight: bold;">
                    {{ (orderData[1]?.totalPrice || 0).toFixed(2) }}元
                  </span>
                </template>
              </el-statistic>
            </div>
          </div>
        </el-card>

      </div>

      <!-- 图表 -->
      <div style="display: flex; flex: 1;">
        <!-- 统计登录 -->
        <el-card class="box-card">
          <EChart :options="loginOptions" :width="'100%'" :height="'300px'" />
        </el-card>

        <el-card style="flex: 2; margin: 5px; width: 33%;">
          <EChart :options="orderOptions" :width="'100%'" :height="'300px'" />
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import { formatDateTime } from '@/utils/commonFunction';
import { loginCount, orderCount } from '@/api/home/homeApi';
import { loginType, result, accountType } from '@/api/common/CommonData';
import EChart from '../../../components/EChart.vue';
import { loginOptions, orderOptions } from '@/api/home/homeData';
export default {
  components: {
    EChart
  },
  data() {
    return {
      loginOptions: loginOptions,
      orderOptions: orderOptions,
      loginTypeMap: loginType,
      resultMap: result,
      accountTypeMap: accountType,
      loginData: [],
      orderData: [],
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
      this.loginOptions.title.text = `登录统计 (${timeDescription})`;
      this.orderOptions.title.text = `订单统计 (${timeDescription})`;

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
    updateChartData(responseData, categoriesKey, seriesKeys, chartOptions) {
      // 提取分类数据
      const categories = [...new Set(responseData.map(item => item[categoriesKey]))];
      chartOptions.xAxis.data = categories; // 设置 X 轴分类

      // 动态生成每个系列的数据
      seriesKeys.forEach((key, index) => {
        chartOptions.series[index].data = categories.map(category => {
          const data = responseData.find(item => item[categoriesKey] === category);
          return data ? data[key] : 0; // 如果没有找到数据，返回 0
        });
      });
    },
    async getInformation() {
      const start = formatDateTime(this.start);
      const end = formatDateTime(this.end)
      const params = { start: start, end: end };

      try {
        const response = await loginCount(params);
        this.loginData = response.data;
        this.updateChartData(
          this.loginData,
          'loginCategory',
          ['total', 'success', 'failed'],
          this.loginOptions
        );
      } catch (error) {
        console.error('错误:', error);
      }

      try {
        const response = await orderCount(params);
        this.orderData = response.data;
        this.updateChartData(
          this.orderData,
          'orderCategory',
          ['totalOrder', 'finishing', 'removing', 'remove', 'finish', 'timeout'],
          this.orderOptions
        );
      } catch (error) {
        console.error('错误:', error);
      }
    }
  },
  mounted() {
    this.updateTime('day', 1);
  },
};
</script>