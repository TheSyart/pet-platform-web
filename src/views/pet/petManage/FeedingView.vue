<template>
  <el-main>
    <!-- 表单 -->
    <SearchForm :searchForm="searchForm" :formItems="SearchFormItems" @submit="onSubmit"
      @get-search-form-height="getSearchFormHeight" />

    <el-button type="primary" size="small" plain round @click="addDialogVisible = true"
      style="height:30px;">新增宠物喂养技巧</el-button>

    <CommonFormDialog title="宠物百科信息" :status="CommonFormButtonStatus" :visible.sync="dialogVisible"
      :formItems="CommonFormDialogItems" :formData="OneObject" formLabelWidth="100px" @close="clearOneInfoForm"
      @confirm="handleViewConfirm" :fetchUpdate="updateFeeding" />

    <AddFormDialog title="新增宠物百科" :addForm="addForm" :visible.sync="addDialogVisible" :formItems="AddFormDialogItems"
      formLabelWidth="100px" :fetchInsert="insertOneFeeding" @close="closeAddForm" @cancel="handleAddCancel"
      @confirm="handleAddConfirm" />


    <TablePagination :tableHeight="tableHight" :columns="columns" :conditions="conditions"
      @fetch-single-data="handleSingleData" @updateStatus="updateStatus" :fetchAllInfo="pageQueryFeeding" />
  </el-main>
</template>

<script>
import { SearchFormItems, columns, CommonFormDialogItems, AddFormDialogItems } from '@/api/feeding/feedingData';
import { pageQueryFeeding, queryOneFeeding, insertOneFeeding, updateFeedingStatus, updateFeeding, deleteFeeding } from '@/api/feeding/feedingApi';
import { Message } from 'element-ui';
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
  computed: {
    tableHight() {
      //60的头部，30的新增按钮，30的分页，20分页的margin，80的el-main的padding=20 *4(上下各一个20)
      let tableHeight = window.innerHeight - 60 - this.searchFormHeight - 30 - 30 - 20 - 40 - 40;
      console.log(`${tableHeight}px`);
      return `${tableHeight}px`;
    }
  },
  data() {
    return {
      searchFormHeight: 63,
      SearchFormItems: [...SearchFormItems],
      columns: [...columns],
      CommonFormDialogItems: [...CommonFormDialogItems],
      AddFormDialogItems: [...AddFormDialogItems],
      CommonFormButtonStatus: '',  //查看一个数据时区分编辑和查看的状态
      dialogVisible: false,
      addDialogVisible: false,
      OneObject: {  // 查询单条数据的载体
      },
      conditions: {   //分页查询请求体
        title: "",
        status: "",
        begin: '',
        end: ''
      },
      searchForm: {   //searchForm组件的数据载体
        dateRange: [],
        title: "",
        status: "",
        begin: '',
        end: ''
      },
      addForm: {  //新增员工表单数据
        title: '',
        content: '',
        image: ''
      },
      petBreeds: [],
    };
  },
  watch: {    //监听查询单个的值，返回给CommonFormDialogItems下的一些值
    OneObject(newValue) {
      this.CommonFormDialogItems.forEach(item => {
        if (item.prop === 'image') {
          item.props.imageUrl = newValue.image;
          item.props.id = newValue.id;
          item.props.fetchDelete = deleteFeeding
        }
      });
    }
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
        dateRange: [],
        title: "",
        status: "",
        begin: '',
        end: ''
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
      console.log(JSON.stringify(formData));
      this.searchForm.title = formData.title;
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
      this.OneObject = {  // 查询单条数据的载体
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
        title: '',
        content: '',
        image: ''
      }
    },
    ////////////该界面所用api函数 //////////////////////////////////////////////////////////////////////////
    pageQueryFeeding,
    insertOneFeeding,
    updateFeeding,
    deleteFeeding,
    async fetchOneInfo(id) {
      try {
        const response = await queryOneFeeding(id);
        this.OneObject = { ...response.data };
        //获得值打开对话框
        this.dialogVisible = true;

      } catch (error) {
        console.error('获取单个宠物喂养技巧信息失败:', error);
      }
    },
    async fetchOneStatus(id, status) {
      try {
        const data = {
          id: id,
          status: status
        };
        const response = await updateFeedingStatus(data);
        //清空数据,重新加载数据
        this.resetSearchForm();
        Message.success(response.data);   //提示成功
      } catch (error) {
        console.error('宠物喂养技巧状态操作失败:', error);
      }
    },
  }
};
</script>
