<template>
  <div class="main-content">
    <el-main style="display: flex; flex-direction: column;">
      <!-- 表单 -->
      <SearchForm :searchForm="searchForm" :formItems="formItems" @submit="onSubmit" />
      <!-- 图表 -->
      <div style="display: flex; flex: 1;">
        <el-card class="box-card" style="flex: 1; margin: 5px; width: 33%;">
          <EChart :options="loginTypeOptions" :width="'100%'" :height="'300px'" />
        </el-card>

        <el-card class="box-card" style="flex: 1; margin: 5px; width: 33%;">
          <EChart :options="loginResultOptions" :width="'100%'" :height="'300px'" />
        </el-card>

        <el-card class="box-card" style="flex: 1; margin: 5px; width: 33%;">
          <EChart :options="loginTimeOptions" :width="'100%'" :height="'300px'" />
        </el-card>


      </div>


      <div style="display: flex; flex: 1;">
        <el-card class="box-card" style="flex: 1; margin: 5px;">
          <el-table class="table-container" :data="tableData" border align="center" header-align="center"
            :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="300px">
            <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
              align="center">
              <template #default="{ row }">

                <template v-if="column.prop === 'accountType'">
                  {{ accountTypeMap[row.accountType] }}
                </template>
                <template v-else-if="column.prop === 'result'">
                  {{ resultMap[row.result] }}
                </template>
                <template v-else-if="column.prop === 'login_type'">
                  {{ loginTypeMap[row.login_type] }}
                </template>
                <template v-else-if="column.prop === 'country'">
                  {{ (row.country || '') + ' ' + (row.region || '') + ' ' + (row.city || '') }}
                </template>

                <!-- 默认渲染其他列的值 -->
                <template v-else>
                  {{ row[column.prop] }}
                </template>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div style="height: 10%; width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <el-pagination background layout="sizes" :page-size="pageSize" :total="total"
                @size-change="handleSizeChange" style="flex: 1; text-align: left;">
              </el-pagination>
              <div style="flex: 1; display: flex; justify-content: center;">
                <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
                  @size-change="handleSizeChange" :current-page="currentPage" @current-change="handleCurrentChange">
                </el-pagination>
              </div>
              <div style="flex: 1; display: flex; justify-content: flex-end;">
                <el-pagination background layout="jumper" style="margin-right: 10px;">
                </el-pagination>
                <el-pagination background layout="total" :total="total">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';
import SearchForm from '../../../components/SearchForm.vue';
import CommonData from '../../../commonData/CommonData.js';
import EChart from '../../../components/EChart.vue';
import moment from 'moment';
export default {
  components: {
    EChart,
    SearchForm
  },
  computed: {
    formItems() {
      return [
        {
          label: '登录账户',
          component: 'el-input',
          prop: 'username',
          props: { placeholder: '登录账户', style: { width: this.formItemWidth } }
        },
        {
          label: 'Ip地址',
          component: 'el-input',
          prop: 'ip',
          props: { placeholder: 'Ip地址', style: { width: this.formItemWidth } }
        },
        {
          label: '账户类型',
          component: 'el-select',
          prop: 'accountType',
          props: {
            placeholder: '账户类型',
            clearable: true,
            style: { width: this.formItemWidth }
          },
          options: this.accountTypeMap
        },
        {
          label: '登录日期',
          component: 'el-date-picker',
          prop: 'createdDate',
          props: {
            type: 'datetimerange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            style: 'width: 360px;'
          }
        }
      ];
    }
  },
  data() {
    return {
      loginTypeOptions: {
        title: {
          text: '登录方式统计',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'  // 显示百分比
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
            name: '登录方式',
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
      loginResultOptions: {
        title: {
          text: '登录结果统计',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'  // 显示百分比
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
            name: '登录结果',
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
      loginTimeOptions: {
        title: {
          text: '登陆时间统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.accountTypeMap,
          orient: 'horizontal',
          bottom: '0%',
          left: 'center'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '员工',
            type: 'line',
            data: []
          },
          {
            name: '客户',
            type: 'line',
            data: []
          }
        ]
      },
      ...CommonData,
      loginTypeMap: [],
      resultMap: [],
      accountTypeMap: [],
      tableData: [],
      columns: [
        { label: '登录账户', prop: 'account' },
        { label: '登录账户类型', prop: 'accountType' },
        { label: 'IP 地址', prop: 'ip' },
        { label: '登录地址', prop: 'country' },
        { label: '登录时间', prop: 'createdDate' },
        { label: '错误原因', prop: 'message' },
        { label: '登录结果', prop: 'result' },
        { label: '登录方式', prop: 'login_type' }
      ],
      searchForm: {
        username: "",
        ip: "",
        accountType: "",
        createdDate: []
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formItemWidth: '105px'
    }
  },

  methods: {
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
    updateChartData(responseDate) {
      // 根据 Map 的长度动态初始化数组
      const loginTypeCount = new Array(this.loginTypeMap.length).fill(0);
      const resultTypeCount = new Array(this.resultMap.length).fill(0);

      // 计数并更新图表数据
      this.setMap(responseDate, loginTypeCount, this.loginTypeMap, this.loginTypeOptions, 'login_type');
      this.setMap(responseDate, resultTypeCount, this.resultMap, this.loginResultOptions, 'result');
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
    ,
    getInformation() {
      //时间选择器自带的 X ，点击后会让值为null
      if (this.searchForm.createdDate == null) {
        this.searchForm.createdDate = [];
      }

      const page = this.currentPage;
      const size = this.pageSize;
      const username = this.searchForm.username;
      const ip = this.searchForm.ip;
      const accountType = this.searchForm.accountType;
      const begin = this.searchForm.createdDate[0] ? this.$formatDateTime(this.searchForm.createdDate[0]) : '';
      const end = this.searchForm.createdDate[1] ? this.$formatDateTime(this.searchForm.createdDate[1]) : '';

      axios.post("/api/ip/queryAllIpInfo", {
        conditions: {
          username: username,
          ip: ip,
          accountType: accountType,
          begin: begin,
          end: end,

        },
        pagination: {
          page: page,
          size: size
        }
      }, {
        headers: {
          'token': `${localStorage.getItem('jwt')}`
        }
      }).then((result) => {
        this.tableData = result.data.data.list;
        this.total = result.data.data.total;


        this.loginTypeMap = this.loginType;
        this.resultMap = this.result;
        this.accountTypeMap = this.accountType;

        this.updateChartData(this.tableData);
      }).catch(error => {
        console.error('错误:', error);
      });
    },


  },
  mounted() {
    this.getInformation();
  },
};
</script>