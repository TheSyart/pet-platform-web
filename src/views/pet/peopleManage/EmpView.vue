<template>
  <el-main>
    <!-- 表单 -->
    <SearchForm :searchForm="searchForm" :formItems="SearchFormItems" @submit="onSubmit" />

    <el-button type="primary" size="small" plain round @click="addDialogVisible = true"
      style="height:30px;">新增员工</el-button>

    <CommonFormDialog title="员工信息" :status="CommonFormButtonStatus" :visible.sync="dialogVisible"
      :formItems="CommonFormDialogItems" :formData="OneObject" formLabelWidth="100px" @close="clearOneInfoForm"
      @confirm="handleViewConfirm" :fetchUpdate="updateEmp" />

    <AddFormDialog title="新增员工" :addForm="addForm" :visible.sync="addDialogVisible" :formItems="AddFormDialogItems"
      formLabelWidth="100px" :fetchInsert="insertOneEmp" @close="closeAddForm" @cancel="handleAddCancel"
      @confirm="handleAddConfirm" />


    <TablePagination :columns="columns" :conditions="conditions" @fetch-single-data="handleSingleData"
      @updateStatus="updateStatus" :fetchAllInfo="pageQueryEmp" />
  </el-main>
</template>

<script>
import { fetchData } from '@/api/common/dataFetcher';
import { SearchFormItems, columns, CommonFormDialogItems, AddFormDialogItems } from '@/api/emp/empData';
import { pageQueryEmp, queryOneEmp, insertOneEmp, updateEmpStatus, updateEmp, deleteEmp } from '@/api/emp/empApi';
import { Message } from 'element-ui'; // 使用 Element UI 的消息提示
import SearchForm from '@/components/SearchForm.vue';
import CommonFormDialog from "@/components/CommonFormDialog.vue";
import AddFormDialog from "@/components/AddFormDialog.vue";
import TablePagination from '@/components/TablePagination.vue';
export default {
  components: {
    SearchForm,
    TablePagination,
    CommonFormDialog,
    AddFormDialog
  },
  data() {
    return {
      SearchFormItems: [...SearchFormItems],
      columns: [...columns],
      CommonFormDialogItems: [...CommonFormDialogItems],
      AddFormDialogItems: [...AddFormDialogItems],
      CommonFormButtonStatus: '',  //查看一个数据时区分编辑和查看的状态
      dialogVisible: false,
      addDialogVisible: false,
      OneObject: {  // 查询单条数据的载体
        id: "",
        name: "",
        phone: "",
        gender: "",
        job: "",
        birth: "",
        username: "",
        password: "",
        image: "",
      },
      conditions: {   //分页查询请求体
        name: '',
        gender: '',
        begin: '',
        end: '',
        job: '',
        status: ''
      },
      searchForm: {   //searchForm组件的数据载体
        entrydate: [],
        name: "",
        gender: "",
        begin: '',
        end: '',
        job: "",
        status: ""
      },
      addForm: {  //新增员工表单数据
        name: '',
        gender: "",
        job: "",
        phone: "",
        birth: "",
        image: ""
      },
      jobMap: [],
    };
  },
  watch: {    //监听查询单个的值，返回给CommonFormDialogItems下的一些值
    OneObject(newValue) {
      this.CommonFormDialogItems.forEach(item => {
        if (item.prop === 'image') {
          item.props.imageUrl = newValue.image;
          item.props.id = newValue.id;
          item.props.fetchDelete = deleteEmp
        }
     });
    }
  },
  methods: {
    //////////////表格操作单个数据status/////////////////////////////////////////////////////////////////////////////////////////
    updateStatus(id, status) {
      console.log(id, status);
      this.fetchOneStatus(id, status);
    },
    resetSearchForm() {
      this.searchForm = {
        entrydate: "",
        name: "",
        gender: "",
        begin: '',
        end: '',
        job: "",
        status: ""
      };
      // 如果需要更新条件以触发子组件的 watch
      this.updateConditions();
    },
    /////////////分页查询函数///////////////////////////////////////////////////////////////////////////////
    onSubmit(formData) {
      this.searchForm.entrydate = formData.entrydate; //回显选择时间
      //时间选择器自带的 X ，点击后会让值为null
      if (formData.entrydate == null) {
        formData.entrydate = [];
      }
      this.searchForm.name = formData.name;
      this.searchForm.gender = formData.gender;
      this.searchForm.job = formData.job;
      this.searchForm.status = formData.status;
      this.searchForm.begin = formData.entrydate[0] ? this.$formatDateTime(formData.entrydate[0]) : '';
      this.searchForm.end = formData.entrydate[1] ? this.$formatDateTime(formData.entrydate[1]) : '';

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
      this.OneObject = {  // 查询单条数据的载体
        id: "",
        name: "",
        phone: "",
        gender: "",
        job: "",
        birth: "",
        username: "",
        password: "",
        image: ""
      },
        this.dialogVisible = false;
    },
    // 确认时的操作
    handleViewConfirm(formData) {
      console.log("commonFormDialog确认操作触发数据:", JSON.stringify(formData));
      this.clearOneInfoForm();
      this.resetSearchForm();
    },

    /////////////新增一个///////////////////////////////////////////////////////////////////////
    // 关闭时清理表单
    closeAddForm() {
      this.addDialogVisible = false;
    },
    // 取消时的操作
    handleAddCancel() {
      this.resetAddForm();
      this.addDialogVisible = false;
    },

    // 确认时的操作
    handleAddConfirm() {
      //清空搜索条件 &&  清空新增表单 && 清空照片回显 && 重新获取数据
      this.handleAddCancel();
      this.resetSearchForm();
    },

    resetAddForm() {
      this.addForm = {
        name: '',
        gender: "",
        job: "",
        phone: "",
        birth: "",
        image: ""
      }
    },

    ////////////该界面所用api函数 //////////////////////////////////////////////////////////////////////////
    pageQueryEmp,
    insertOneEmp,
    updateEmp,
    deleteEmp,
    async fetchOneInfo(id) {
      try {
        const response = await queryOneEmp(id);
        this.OneObject = { ...response.data };
        //获得值打开对话框
        this.dialogVisible = true;

      } catch (error) {
        console.error('获取单个员工信息失败:', error);
      }
    },
    async fetchOneStatus(id, status) {
      try {
        const data = {
          id: id,
          status: status
        };
        const response = await updateEmpStatus(data);
        //清空数据,重新加载数据
        this.resetSearchForm();
        Message.success(response.data);   //提示成功
      } catch (error) {
        console.error('员工状态操作失败:', error);
      }
    },
    async fetchJobOptions() {
      try {
        const jobData = await fetchData('empJob');
        this.jobMap = jobData;
        this.SearchFormItems.forEach(item => {
          if (item.prop === 'job') {
            item.options = this.jobMap;
          }
        });
        this.columns.forEach((item) => {
          if (item.prop === 'job') {
            item.details = this.jobMap;
          }
        });
        this.CommonFormDialogItems.forEach(item => {
          if (item.prop === 'job') {
            item.options = this.jobMap;
          }
          if (item.prop === 'image') {
            item.props.imageUrl = this.OneObject.image;
            item.props.id = this.OneObject.id;
            item.props.fetchDelete = this.deleteEmp;
          }
        });
        this.AddFormDialogItems.forEach((item) => {
          if (item.prop === 'job') {
            item.options = this.jobMap;
          }
        });
      } catch (error) {
        console.error('Failed to fetch job options:', error);
        Message.error('职位数据获取失败，请重试');
      }
    }
  },
  created() {
    this.fetchJobOptions();
  }
};
</script>
