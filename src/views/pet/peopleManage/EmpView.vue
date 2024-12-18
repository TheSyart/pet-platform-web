<template>
  <el-main>
    <!-- 使用 DataFetcher 组件获取员工职位数据 -->
    <DataFetcher dataType="empJob" @data-fetched="handlePetJobsData" />
    <!-- 表单 -->
    <SearchFrom :searchFrom="searchFrom" :formItems="formItems" @submit="onSubmit" />


    <!-- 新增员工对话框 -->
    <el-button type="primary" size="small" plain round @click="dialogFormVisible = true"
      style="height:30px;">新增员工</el-button>
    <el-dialog title="新增员工" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 400px; display: flex;">
        <div style="flex: 1; margin-right: 20px;">
          <el-form-item label="姓名:" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话:" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别:" :label-width="formLabelWidth">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option v-for="(gender, index) in genderMap" :key="index" :label="gender" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位:" :label-width="formLabelWidth">
            <el-select v-model="form.job" placeholder="请选择职位">
              <el-option v-for="(job, index) in jobMap" :key="index" :label="job" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日:" :label-width="formLabelWidth">
            <el-date-picker v-model="form.birth" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </div>

        <div style="flex: 0 0 auto;"> <!-- 固定宽度 -->
          <el-form-item label="头像:" :label-width="formLabelWidth" style="margin-bottom: 0;">
            <ImgUploader type="emp" @upload-success="handleUploadSuccess" ref="imgUploader" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取 消</el-button>
        <el-button type="primary" @click="addNewEmp">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table class="table-container" :data="tableData" border align="center" header-align="center"
      :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="600px">
      <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
        align="center">

        <!-- 使用一个模板处理 status 和其他列 -->
        <template #default="{ row }">
  
          <template v-if="column.label === '操作'">
            <el-button v-if="row.status === 0 || row.status === 1" type="primary" size="mini" @click="viewEmpInfo(row.id, 0)">编辑</el-button>
            <el-button v-if="row.status === 2 " type="warning" size="mini" @click="viewEmpInfo(row.id, 1)">查看</el-button>

            <el-button v-if="row.status === 0" type="warning" size="mini">停职</el-button>
            <el-button v-if="row.status === 1" type="danger" size="mini">辞退</el-button>

            <el-button v-if="row.status === 1 || row.status === 2" type="success" size="mini" @click="viewEmpInfo(row.id, 1)">恢复</el-button>
          </template>

          <template v-else-if="column.label === '状态'">
            <el-tag v-if="row.status === 0" type="primary" size="mini" @click="viewEmpInfo(row.id, 0)">{{ statusMap[row.status] }}</el-tag>
            <el-tag v-if="row.status === 1" type="danger" size="mini">{{ statusMap[row.status] }}</el-tag>
            <el-tag v-if="row.status === 2" type="warning" size="mini" @click="viewEmpInfo(row.id, 1)">{{ statusMap[row.status] }}</el-tag>
          </template>

          <!-- 如果是 gender 列，显示对应的服务类型 -->
          <template v-else-if="column.prop === 'gender'">
            {{ genderMap[row.gender] }}
          </template>

          <!-- 如果是 job 列，显示对应的工作类型 -->
          <template v-else-if="column.prop === 'job'">
            {{ jobMap[row.job] }}
          </template>

          <!-- 默认渲染其他列的值 -->
          <template v-else>
            {{ row[column.prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 员工信息对话框 -->
    <el-dialog title="员工信息" :visible.sync="dialogOneEmpVisible" @close="clearOneService">
      <el-form :model="OneEmp" style="width: 400px; display: flex;">
        <div style="flex: 0 0 auto;">
          <el-form-item label="姓名:" :label-width="formLabelWidth">
            <el-input v-model="OneEmp.name" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话:" :label-width="formLabelWidth">
            <el-input v-model="OneEmp.phone" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="性别:" :label-width="formLabelWidth">
            <el-select v-model="genderLabel" disabled>
              <el-option v-for="(gender, index) in genderMap" :key="index" :label="gender" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位:" :label-width="formLabelWidth">
            <el-select v-model="jobLabel" disabled>
              <el-option v-for="(job, index) in jobMap" :key="index" :label="job" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日:" :label-width="formLabelWidth">
            <el-date-picker v-model="OneEmp.birth" type="date" placeholder="选择日期" disabled></el-date-picker>
          </el-form-item>
        </div>
        <div style="flex: 0 0 auto;"> <!-- 固定宽度 -->
          <el-form-item label="账号:" :label-width="formLabelWidth">
            <el-input v-model="OneEmp.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码:" :label-width="formLabelWidth">
            <el-input v-model="OneEmp.password" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="头像:" :label-width="formLabelWidth" style="margin-bottom: 0;">
            <img :src="OneEmp.image" alt="员工头像" style=" height: 180px;" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOneEmpVisible = false">取 消</el-button>
        <el-button v-if="this.checkOrUpdate === 0">编 辑</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <div style="height: 10%; width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <el-pagination background layout="sizes" :page-size="pageSize" :total="total" @size-change="handleSizeChange"
          style="flex: 1; text-align: left;">
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
  </el-main>
</template>


<script>
import axios from 'axios';
import SearchFrom from '../../Component/SearchFrom.vue';
import ImgUploader from '../../Component/ImgUploader.vue';
import DataFetcher from '../../Component/DataFetcher.vue';
import CommonData from '../../Component/CommonData.js'; // 导入 CommonData 数据文件
export default {
  components: {
    SearchFrom,
    DataFetcher,
    ImgUploader
  },
  computed: {
    genderLabel() {
      return this.genderMap[this.OneEmp.gender] || '';
    },
    statusLabel() {
      return this.statusMap[this.OneEmp.status] || '';
    },
    jobLabel() {
      return this.jobMap[this.OneEmp.job] || '';
    },
    formItems() {
      return [
        {
          label: '姓名',
          component: 'el-input',
          prop: 'name',
          props: { placeholder: '姓名', style: { width: this.formItemWidth } }
        },
        {
          label: '性别',
          component: 'el-select',
          prop: 'gender',
          props: {
            placeholder: '性别',
            clearable: true,
            style: { width: this.formItemWidth }
          },
          options: this.genderMap // 依赖 genderMap
        },
        {
          label: '状态',
          component: 'el-select',
          prop: 'status',
          props: {
            placeholder: '状态',
            clearable: true,
            style: { width: this.formItemWidth }
          },
          options: this.statusMap // 依赖 statusMap
        },
        {
          label: '职位',
          component: 'el-select',
          prop: 'job',
          props: {
            placeholder: '职位',
            clearable: true,
            style: { width: this.formItemWidth }
          },
          options: this.jobMap // 依赖 jobMap
        },
        {
          label: '入职日期',
          component: 'el-date-picker',
          prop: 'entrydate',
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
      ...CommonData,
      checkOrUpdate: "",   //查看一个时判断状态
      genderMap: [],
      statusMap: [],
      jobMap: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: [
        { label: '姓名', prop: 'name' },
        { label: '手机号', prop: 'phone' },
        { label: '性别', prop: 'gender' },
        { label: '生日', prop: 'birth' },
        { label: '职位', prop: 'job' },
        { label: '入职日期', prop: 'entrydate' },
        { label: '最后修改日期', prop: 'modifydate' },
        { label: '状态', prop: '' },
        { label: '操作', prop: 'status' } // 插槽列
      ],

      searchFrom: {
        name: "",
        gender: "",
        entrydate: [],
        job: "",
        status: ""
      },
      dialogFormVisible: false,
      form: {
        name: '',
        gender: "",
        job: "",
        phone: "",
        birth: "",
        image: ""
      },
      formItemWidth: '105px',
      formLabelWidth: '100px',
      dialogOneEmpVisible: false,
      OneEmp: {
      }
    }
  },
  methods: {
    clearOneService() {
      this.OneEmp = {}; // 重置为初始状态
    },
    handlePetJobsData(data) {
      console.log('父组件收到响应数据:', data);
      this.jobMap = data; // 获取工作职位    
    },
    clearForm() {
      this.dialogFormVisible = false; // 关闭对话框
      this.form = { // 初始化表单数据
        name: '',
        gender: '',
        job: '',
        phone: '',
        birth: '',
        image: ''
      };
      if (this.$refs.imgUploader && typeof this.$refs.imgUploader.clearImage === 'function') {
        this.$refs.imgUploader.clearImage(); // 清空图片
      }
    },
    viewEmpInfo(id, type) {
      this.checkOrUpdate = type;  //判断查看一个的状态
      this.dialogOneEmpVisible = true; // 打开员工信息对话框
      axios.get("/api/emp/queryOneEmp", {
        params: {
          id: id
        },
        headers: {
          'token': `${localStorage.getItem('jwt')}`
        }
      }).then((result) => {
        this.OneEmp = result.data.data;
      }).catch(error => {
        console.error('错误:', error);
      });
    },
    handleUploadSuccess(responseData) {
      console.log('父组件收到响应数据:', responseData);
      // 在这里处理或保存从子组件收到的响应数据
      this.form.image = responseData;
    },
    onSubmit(formData) {
      this.searchFrom = formData;
      this.getEmpInformation();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.getEmpInformation();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getEmpInformation();
    },
    getEmpInformation() {
      //时间选择器自带的 X ，点击后会让值为null
      if (this.searchFrom.entrydate == null) {
        this.searchFrom.entrydate = [];
      }
      const page = this.currentPage;
      const size = this.pageSize;
      const name = this.searchFrom.name;
      const gender = this.searchFrom.gender;
      const job = this.searchFrom.job;
      const status = this.searchFrom.status;
      const begin = this.searchFrom.entrydate[0] ? this.$formatDateTime(this.searchFrom.entrydate[0]) : '';
      const end = this.searchFrom.entrydate[1] ? this.$formatDateTime(this.searchFrom.entrydate[1]) : '';


      axios.post("/api/emp/pageQueryAllEmp", {
        conditions: {
          name: name,
          gender: gender,
          begin: begin,
          end: end,
          job: job,
          status: status
        },
        pagination: {
          page: page,
          size: size
        }
      }, {
        headers: {
          'token': `${localStorage.getItem('jwt')}`
        }
      })
        .then((result) => {
          this.genderMap = this.gender;
          this.statusMap = this.empStatus;
          this.tableData = result.data.data.list;
          this.total = result.data.data.total;
        }).catch(error => {
          console.error('错误:', error);
        });
    },
    addNewEmp() {

      const p_name = this.form.name;
      const p_gender = this.form.gender;
      const p_phone = this.form.phone;
      const p_job = this.form.job;
      const p_img = this.form.image;
      const p_birth = this.form.birth ? this.form.birth.toLocaleDateString() : '';


      axios.post("/api/emp/insertNewEmp", {
        name: p_name,
        gender: p_gender,
        phone: p_phone,
        job: p_job,
        birth: p_birth,
        image: p_img,
      }, {
        headers: {
          'token': `${localStorage.getItem('jwt')}`
        }
      })
        .then(response => {
          console.log('成功:', response.data);
          this.dialogFormVisible = false; // 成功后关闭对话框
          this.clearForm();
          this.getEmpInformation(); // 重新加载数据

        })
        .catch(error => {
          console.error('错误:', error);
          this.$message.warning(error.response.data);
        });

    }
  },
  mounted() {
    this.getEmpInformation();
  }
}

</script>

<style></style>