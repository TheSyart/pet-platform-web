<template>
    <el-main>
        <!-- 表单 -->
        <SearchFrom :searchFrom="searchFrom" :formItems="formItems" @submit="onSubmit" />

        <button style="height: 30px; visibility: hidden;"></button>
        <!-- 表格 -->
        <el-table class="table-container" :data="tableData" border align="center" header-align="center"
            :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="600px">
            <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
                align="center">
                <!-- 使用一个模板处理 status 和其他列 -->
                <template #default="{ row }">

                    <template v-if="column.label === '操作'">
                        <el-button v-if="row.status === 0 || row.status === 1" type="primary" size="mini"
                            @click="viewCustomerInfo(row.id, 0)">编辑</el-button>
                        <el-button v-if="row.status === 2" type="warning" size="mini"
                            @click="viewCustomerInfo(row.id, 1)">查看</el-button>

                        <el-button v-if="row.status === 0" type="info" size="mini">封禁</el-button>
                        
                        <el-button v-if="row.status === 1" type="success" size="mini">解封</el-button>
                        <el-button v-if="row.status === 1" type="danger" size="mini">删除</el-button>
                    </template>

                    <template v-else-if="column.label === '状态'">
                        <el-tag v-if="row.status == 0" type="success">{{ statusMap[row.status] }}</el-tag>
                        <el-tag v-if="row.status == 1" type="warning">{{ statusMap[row.status] }}</el-tag>
                        <el-tag v-if="row.status == 2" type="danger">{{ statusMap[row.status] }}</el-tag>
                    </template>


                    <!-- 如果是 gender 列，显示对应的服务类型 -->
                    <template v-else-if="column.prop === 'gender'">
                        {{ genderMap[row.gender] }}
                    </template>

                    <!-- 默认渲染其他列的值 -->
                    <template v-else>
                        {{ row[column.prop] }}
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <!-- 用户信息对话框 -->
        <el-dialog title="员工信息" :visible.sync="dialogOneCustomerVisible" @close="clearOneService">
            <el-form :model="OneCustomer" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto;">
                    <el-form-item label="姓名:" :label-width="formLabelWidth">
                        <el-input v-model="OneCustomer.name" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="电话:" :label-width="formLabelWidth">
                        <el-input v-model="OneCustomer.phone" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="性别:" :label-width="formLabelWidth">
                        <el-select v-model="genderLabel" disabled>
                            <el-option v-for="(gender, index) in genderMap" :key="index" :label="gender" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生日:" :label-width="formLabelWidth">
                        <el-date-picker v-model="OneCustomer.birth" type="date" placeholder="选择日期"
                            disabled></el-date-picker>
                    </el-form-item>
                </div>
                <div style="flex: 0 0 auto;"> <!-- 固定宽度 -->
                    <el-form-item label="账号:" :label-width="formLabelWidth">
                        <el-input v-model="OneCustomer.username" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="密码:" :label-width="formLabelWidth">
                        <el-input v-model="OneCustomer.password" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="头像:" :label-width="formLabelWidth" style="margin-bottom: 0;">
                        <img :src="OneCustomer.image" alt="员工头像" style=" height: 180px;" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOneCustomerVisible = false">取 消</el-button>
                <el-button v-if="this.checkOrUpdate === 0">编 辑</el-button>
            </div>
        </el-dialog>




        <!-- 分页 -->
        <div style="height: 10%; width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <el-pagination background layout="sizes" :page-size="pageSize" :total="total"
                    @size-change="handleSizeChange" style="flex: 1; text-align: left;">
                </el-pagination>
                <div style="flex: 1; display: flex; justify-content: center;">
                    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
                        @size-change="handleSizeChange" :current-page="currentPage"
                        @current-change="handleCurrentChange">
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
import CommonData from '../../Component/CommonData.js';
export default {
    components: {
        SearchFrom
    },
    computed: {
        genderLabel() {
            return this.genderMap[this.OneCustomer.gender] || '';
        },
        statusLabel() {
            return this.statusMap[this.OneCustomer.status] || '';
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
                    options: this.genderMap
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
                    options: this.statusMap
                },
                {
                    label: '入职日期',
                    component: 'el-date-picker',
                    prop: 'createdate',
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
            tableData: [],
            columns: [
                { label: '姓名', prop: 'name' },
                { label: '手机号', prop: 'phone' },
                { label: '性别', prop: 'gender' },
                { label: '生日', prop: 'birth' },
                { label: '注册日期', prop: 'createdate' },
                { label: '最后修改日期', prop: 'modifydate' },
                { label: '状态', prop: '' },
                { label: '操作', prop: 'status' }
            ],
            searchFrom: {
                name: "",
                gender: "",
                status: "",
                createdate: []
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            formItemWidth: '105px',
            formLabelWidth: '100px',
            dialogOneCustomerVisible: false,
            OneCustomer: {
            }
        }
    },
    methods: {
        clearOneService() {
            this.OneCustomer = {}; // 重置为初始状态
        },
        viewCustomerInfo(id, type) {
            this.checkOrUpdate = type;  //判断查看一个的状态
            this.dialogOneCustomerVisible = true; // 打开员工信息对话框
            axios.get("/api/customer/queryOneCustomer", {
                params: {
                    id: id
                },
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            }).then((result) => {
                this.OneCustomer = result.data.data;
            }).catch(error => {
                console.error('错误:', error);
            });
        },
        onSubmit(formData) {
            this.searchFrom = formData;
            this.getCustomerInformation();
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1;
            this.getCustomerInformation();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getCustomerInformation();
        },
        getCustomerInformation() {
            //时间选择器自带的 X ，点击后会让值为null
            if (this.searchFrom.createdate == null) {
                this.searchFrom.createdate = [];
            }
            const page = this.currentPage;
            const size = this.pageSize;
            const name = this.searchFrom.name;
            const gender = this.searchFrom.gender;
            const status = this.searchFrom.status;
            const begin = this.searchFrom.createdate[0] ? this.$formatDateTime(this.searchFrom.createdate[0]) : '';
            const end = this.searchFrom.createdate[1] ? this.$formatDateTime(this.searchFrom.createdate[1]) : '';

            axios.post("/api/customer/queryAllCustomer", {
                conditions: {
                    name: name,
                    gender: gender,
                    begin: begin,
                    end: end,
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
            }).then((result) => {
                this.genderMap = this.gender;
                this.statusMap = this.customerStatus;
                this.tableData = result.data.data.list;
                this.total = result.data.data.total;
            })

        }

    },
    mounted() {
        this.getCustomerInformation();
    },
}
</script>

<style></style>