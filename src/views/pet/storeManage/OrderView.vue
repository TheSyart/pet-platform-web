<template>
  <el-main>
    <!-- 表单 -->
    <SearchForm ref="searchForm" :searchForm="searchForm" :formItems="SearchFormItems" @submit="onSubmit" @get-search-form-height="getSearchFormHeight" />

    <el-button type="primary" size="small" plain round style="height:30px; visibility: hidden">新增</el-button>

    <CommonFormDialog title="订单信息" :status="CommonFormButtonStatus" :visible.sync="dialogVisible"
      :formItems="CommonFormDialogItems" :formData="OneObject" formLabelWidth="100px" @close="clearOneInfoForm" />

    <TablePagination :table-height="tableHight" :columns="columns" :conditions="conditions"
      @fetch-single-data="handleSingleData" @updateStatus="updateStatus" :fetchAllInfo="pageQueryOrder" />
  </el-main>
</template>

<script>
import store from '@/store';
import { SearchFormItems, columns, CommonFormDialogItems } from '@/api/order/orderData';
import { pageQueryOrder, queryOneOrder, updateOrderStatus } from '@/api/order/orderApi';
import { Message } from 'element-ui';
import SearchForm from '@/components/SearchForm.vue';
import CommonFormDialog from "@/components/CommonFormDialog.vue";
import TablePagination from '@/components/TablePagination.vue';
export default {
  components: {
    SearchForm,
    TablePagination,
    CommonFormDialog
  },
  computed: {
    tableHight() {
      //60的头部，30的新增按钮，30的分页，20分页的margin，80的el-main的padding=20 *4(上下各一个20)
      let tableHeight = window.innerHeight - 60 - this.searchFormHeight - 30 - 30 - 20 - 40 - 40;
      console.log(`${tableHeight}px`);
      return `${tableHeight}px`;
    }
  },
  watch: {    //监听查询单个的值，返回给CommonFormDialogItems下的一些值
    OneObject(newValue) {
      this.CommonFormDialogItems.forEach(item => {
        if (item.prop === 'image_path') {
          item.props.imageUrl = newValue.image_path;
        }
      });
    }
  },
  data() {
    return {
      searchFormHeight: 126,
      SearchFormItems: [...SearchFormItems],
      columns: [...columns],
      CommonFormDialogItems: [...CommonFormDialogItems],
      CommonFormButtonStatus: '',  //查看一个数据时区分编辑和查看的状态
      dialogVisible: false,
      OneObject: {},  // 查询单条数据的载体
      conditions: {   //分页查询请求体
        begin: '',
        end: '',
        name: '',
        order_id: '',
        order_type: '',
        orderStatus: '',
        pickMethod: '',
        status: ''
      },
      searchForm: {   //searchForm组件的数据载体
        begin: '',
        end: '',
        name: '',
        order_id: '',
        order_type: '',
        orderStatus: '',
        pickMethod: '',
        status: '',
        dateRange: []
      },
      id: ''
    };
  },
  methods: {
    getSearchFormHeight(height) {
      this.searchFormHeight = height;
    },
    //////////////表格操作单个数据status/////////////////////////////////////////////////////////////////////////////////////////
    updateStatus(id, status) {
      console.log(id, status);
      this.fetchOneStatus(id, status);
    },
    resetSearchForm() {
      this.searchForm = {
        begin: '',
        end: '',
        name: "",
        order_id: '',
        order_type: '',
        orderStatus: '',
        pickMethod: '',
        status: "",
        dateRange: []
      };
      // 如果需要更新条件以触发子组件的 watch
      this.updateConditions();
    },
    /////////////分页查询函数///////////////////////////////////////////////////////////////////////////////
    onSubmit(formData) {
      this.searchForm.dateRange = formData.dateRange; //回显选择时间
      //时间选择器自带的 X ，点击后会让值为null
      if (formData.dateRange == null) {
        formData.dateRange = [];
      }

      this.searchForm.name = formData.name;
      this.searchForm.gender = formData.gender;
      this.searchForm.order_id = formData.order_id;
      this.searchForm.order_type = formData.order_type;
      this.searchForm.orderStatus = formData.orderStatus;
      this.searchForm.pickMethod = formData.pickMethod;
      this.searchForm.status = formData.status;
      this.searchForm.begin = formData.dateRange[0];
      this.searchForm.end = formData.dateRange[1];
      this.updateConditions();
    },
    updateConditions() {
      // 通过更新 conditions 来触发table子组件的 watch
      this.conditions = { ...this.searchForm };
    },
    ////////////查个单个对话框函数/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    handleSingleData(id, status) {
      this.CommonFormButtonStatus = status;
      this.fetchOneInfo(id);
    },
    // 关闭时和取消时清理表单
    clearOneInfoForm() {
      this.OneObject = {},  // 查询单条数据的载体
        this.dialogVisible = false;
    },
    ////////////该界面所用api函数 //////////////////////////////////////////////////////////////////////////
    pageQueryOrder,
    async fetchOneInfo(id) {
      try {
        const response = await queryOneOrder(id);
        const transformData = response.data;
        // 格式化信息
        this.addressInfo(transformData.address);
        this.reservedInfo(transformData);
        this.doctorInfo(transformData);
        transformData.note = this.noteInfo(transformData.note);

        this.OneObject = { ...response.data, };
        // 确保数据处理完成后再显示对话框
        this.dialogVisible = true;

      } catch (error) {
        console.error('获取单个订单信息失败:', error);
      }
    },
    async fetchOneStatus(id, status) {
      try {
        const data = {
          operatorType: 1,
          order_id: id,
          orderStatus: status,
          id: this.id
        };
        const response = await updateOrderStatus(data);
        //清空数据,重新加载数据
        this.resetSearchForm();
        Message.success(response.data);   //提示成功
      } catch (error) {
        console.error('员工状态操作失败:', error);
      }
    },
    //////////////转化合并单个展示时的各种数据//////////////////////////////////////////////////////////////////
    //地址信息
    addressInfo(data) {
      Object.assign(data, { position: [data.longitude || 0, data.latitude || 0] });
      Object.assign(data, { addressDetails: `${data.addressDetails || ''} ${data.addressTitle || ''} ${data.door || ''}` });
    },
    //预约人门店自提信息
    reservedInfo(data) {
      Object.assign(
        data, {
        reservedInfo: {
          reservedName: data.reservedName,
          reservedPhone: data.reservedPhone,
          secretKey: data.secretKey
        }
      });
    },
    //预约门店服务医师信息
    doctorInfo(transformData) {
      Object.assign(
        transformData, {
        appointmentInfo: {
          doctorName: transformData.doctorName,
          doctorPhone: transformData.doctorPhone,
          petName: transformData.petName,
          appointmentTime: transformData.appointmentTime,
          serviceTimeSlot: transformData.serviceTimeSlot
        }
      });
    },
    //订单备注信息空值转无字
    noteInfo(note) {
      return `${note || '无'}`;
    }
  },
  created() {
    this.id = store.getters.getGlobalVar.id;
  }
};
</script>