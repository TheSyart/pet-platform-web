<template>
    <el-main>
      <!-- 表单 -->
      <SearchForm :searchForm="searchForm" :formItems="SearchFormItems" @submit="onSubmit"
        @get-search-form-height="getSearchFormHeight" />
  
      <el-button type="primary" size="small" plain round style="height:30px; visibility: hidden">新增</el-button>
  
      <CommonFormDialog title="宠物信息" :status="CommonFormButtonStatus" :visible.sync="dialogVisible"
        :formItems="CommonFormDialogItems" :formData="OneObject" @close="clearOneInfoForm" />
  
  
      <TablePagination :table-height="tableHight" :columns="columns" :conditions="conditions"
        @fetch-single-data="handleSingleData" :fetchAllInfo="pageQueryPet" />
    </el-main>
  </template>
  
  <script>
  import { fetchData } from '@/api/common/dataFetcherApi';
  import { Message } from 'element-ui';
  import { SearchFormItems, columns, CommonFormDialogItems } from '@/api/pet/petData';
  import { pageQueryPet, queryOnePet } from '@/api/pet/petApi';
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
          if (item.prop === 'image') {
            item.props.imageUrl = newValue.image;
            item.props.id = newValue.id;
          }
        });
      }
    },
    data() {
      return {
        searchFormHeight: 63,
        SearchFormItems: SearchFormItems,
        columns: columns,
        CommonFormDialogItems: CommonFormDialogItems,
        CommonFormButtonStatus: "",  //查看一个数据时区分编辑和查看的状态
        dialogVisible: false,
        OneObject: {  // 查询单条数据的载体
        },
        conditions: {   //分页查询请求体
          petName: "",
          userName: "",
          gender: "",
          status: "",
          petBreed: "",
          begin: "",
          end: ""
        },
        searchForm: {   //searchForm组件的数据载体
          dateRange: [],
          petName: "",
          userName: "",
          gender: "",
          status: "",
          petBreed: "",
          end: ""
        },
        petBreeds: "",
        petCoat: "",
        petDetails: ""
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
          dateRange: [],
          petName: "",
          userName: "",
          gender: "",
          status: "",
          petBreed: "",
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
  
        this.searchForm.petName = formData.petName;
        this.searchForm.userName = formData.userName;
        this.searchForm.gender = formData.gender;
        this.searchForm.petBreed = formData.petBreed;
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
  
      ////////////该界面所用api函数 //////////////////////////////////////////////////////////////////////////
      pageQueryPet,
      async fetchOneInfo(id) {
        try {
          const response = await queryOnePet(id);
          this.OneObject = { ...response.data };
          //获得值打开对话框
          this.dialogVisible = true;
  
        } catch (error) {
          console.error('获取单个宠物信息失败:', error);
        }
      },
      async fetchDataOptions() {
        try {
          this.petBreeds = await fetchData('petBreeds');
          this.petCoat = await fetchData('petCoat');
          this.petDetails = await fetchData('petDetails');
  
  
          this.SearchFormItems.forEach(item => {
            if (item.prop === 'petBreed') {
              item.options = this.petBreeds;
            }
          });
          this.columns.forEach((item) => {
            if (item.prop === 'pet_breed') {
              item.details = this.petBreeds;
            }
            if (item.prop === 'pet_details') {
              item.details = this.petDetails;
            }
          });
          this.CommonFormDialogItems.forEach(item => {
            if (item.prop === 'pet_coat') {
              item.options = this.petCoat;
              console.log("pet_coat",item);
            }
            if (item.prop === 'pet_breed') {
              item.options = this.petBreeds;
              console.log("pet_breed",item);
            }
            if (item.prop === 'pet_details') {
              item.options = this.petDetails;
              console.log("pet_details",item);
            }
          });
         
        } catch (error) {
          Message.error('数据获取失败，请重试');
        }
      }
    },
    created() {
      this.fetchDataOptions();
    }
  };
  </script>