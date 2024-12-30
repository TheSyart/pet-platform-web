<template>
  <el-main>
    <!-- 表单 -->
    <SearchForm :searchForm="searchForm" :formItems="SearchFormItems" @submit="onSubmit"  @get-search-form-height="getSearchFormHeight"/>

    <span style="display: flex; flex: 1;">
      <el-card class="box-card" style="flex: 1;">
        <EChart :options="loginTypeOptions" :height="'250px'" />
      </el-card>

      <el-card class="box-card" style="flex: 1;">
        <EChart :options="loginResultOptions" :height="'250px'" />
      </el-card>

      <el-card class="box-card" style="flex: 1; ">
        <EChart :options="loginTimeOptions" :height="'250px'" />
      </el-card>
    </span>

    <TablePagination :tableHeight="tableHeight" :columns="columns" :conditions="conditions" :fetchAllInfo="pageQueryLoginCount" @fetch-all-data="updateChartData" />
  </el-main>
</template>

<script>
import moment from 'moment';
import { loginType, result } from '@/api/common/CommonData';
import EChart from '../../../components/EChart.vue';
import { SearchFormItems, columns } from '@/api/ipCount/ipCountData';
import { pageQueryLoginCount } from '@/api/ipCount/ipCountApi';
import SearchForm from '@/components/SearchForm.vue';
import TablePagination from '@/components/TablePagination.vue';
import { loginResultOptions, loginTimeOptions, loginTypeOptions } from '@/api/ipCount/ipCountData.js';
export default {
  components: {
    EChart,
    SearchForm,
    TablePagination,
  },
  computed: {
    tableHeight() {
      //60的头部，302的card，30的分页，20分页的margin，80的el-main的padding=20 *4(上下各一个20)
      console.log("窗口",window.innerHeight);
      let tableHeight = window.innerHeight - 60 - this.searchFormHeight - 302 - 30 - 20 - 40 -40;
      console.log(`${tableHeight}px`);
      return `${tableHeight}px`;
    },
  },
  data() {
    return {
      searchFormHeight: 63,
      loginResultOptions: loginResultOptions,
      loginTimeOptions: loginTimeOptions,
      loginTypeOptions: loginTypeOptions,
      columns: columns,
      SearchFormItems: SearchFormItems,
      conditions: {   //分页查询请求体
        username: "",
        ip: "",
        accountType: "",
        loginType: "",
        result: "",
        begin: '',
        end: ''
      },
      searchForm: {   //searchForm组件的数据载体
        dateRange: [],
        username: "",
        ip: "",
        accountType: "",
        loginType: "",
        result: "",
        begin: '',
        end: ''
      },
    };
  },
  methods: {
    //////////////动态获取搜索框高度/////////////////////////////////////////////////////////////////////////
    getSearchFormHeight(height){
      console.log("监控",height)
      this.searchFormHeight = height;
    },
    /////////////分页查询函数///////////////////////////////////////////////////////////////////////////////
    onSubmit(formData) {
      this.searchForm.dateRange = formData.dateRange; //回显选择时间
      //时间选择器自带的 X ，点击后会让值为null
      if (formData.dateRange == null) {
        formData.dateRange = [];
      }

      this.searchForm.username = formData.username;
      this.searchForm.ip = formData.ip;
      this.searchForm.accountType = formData.accountType;
      this.searchForm.loginType = formData.loginType;
      this.searchForm.result = formData.result;
      this.searchForm.begin = formData.dateRange[0] ? this.$formatDateTime(formData.dateRange[0]) : '';
      this.searchForm.end = formData.dateRange[1] ? this.$formatDateTime(formData.dateRange[1]) : '';

      this.updateConditions();
    },
    updateConditions() {
      // 通过更新 conditions 来触发table子组件的 watch
      this.conditions = { ...this.searchForm };
    },
    ////////////该界面所用api函数 //////////////////////////////////////////////////////////////////////////
    pageQueryLoginCount,
    ////////////////图表更新函数 /////////////////////////////////////////////////////////////////////////// 
    updateChartData(responseDate) {
      // 根据 Map 的长度动态初始化数组
      const loginTypeCount = new Array(loginType.length).fill(0);
      const resultTypeCount = new Array(result.length).fill(0);

      // 计数并更新图表数据
      this.setMap(responseDate, loginTypeCount, loginType, this.loginTypeOptions, 'login_type');
      this.setMap(responseDate, resultTypeCount, result, this.loginResultOptions, 'result');
      this.setLineEChart(responseDate);
    },
    setMap(responseDate, typeCount, typeMap, options, dateItem) {
      // 遍历 response 的数据进行计数
      responseDate.forEach(item => {
        const itemType = item[dateItem];  // 动态访问

        if (itemType >= 0 && itemType < typeCount.length) {
          typeCount[itemType] += 1; // 累计计数
        }
      });

      // 生成新的对象列表
      const result = typeCount.map((count, index) => ({
        name: typeMap[index],  // 使用对应的名称
        value: count           // 对应的计数
      }));

      console.log("饼状图数据：" + JSON.stringify(result));

      // 更新饼状图数据
      options.series[0].data = result;
    },
    setLineEChart(responseDate) {
      // 初始化一个对象用于统计每个时间点的登录次数
      const customerCountMap = {};
      const empCountMap = {};

      // 统计每个时间点的登录次数
      responseDate.forEach(item => {
        const createdDate = item['createdDate'];  // 登录时间
        const formattedDate = moment(createdDate).format('YYYY-MM-DD HH') + ':00:00';  // 格式化日期为 'YYYY-MM-DD HH:00:00'

        // 判断账号类型，1为员工，0为客户
        if (item.accountType == 1) { // 员工
          if (!empCountMap[formattedDate]) {
            empCountMap[formattedDate] = 0;
          }
          empCountMap[formattedDate] += 1;
        } else if (item.accountType == 0) { // 客户
          if (!customerCountMap[formattedDate]) {
            customerCountMap[formattedDate] = 0;
          }
          customerCountMap[formattedDate] += 1;
        }
      });

      // 获取所有的日期
      const allDates = [...new Set([
        ...Object.keys(empCountMap),
        ...Object.keys(customerCountMap)
      ])].sort();  // 合并所有日期并排序

      // 更新折线图的 xAxis 和 series 数据
      this.loginTimeOptions.xAxis.data = allDates;

      console.log("time" + allDates);
      console.log("emp" + allDates.map(date => empCountMap[date] || 0));
      console.log("customer" + allDates.map(date => customerCountMap[date] || 0));

      // 填充员工和客户的数据
      this.loginTimeOptions.series[0].data = allDates.map(date => empCountMap[date] || 0);  // 员工数据
      this.loginTimeOptions.series[1].data = allDates.map(date => customerCountMap[date] || 0);  // 客户数据
    }
  }
};
</script>
