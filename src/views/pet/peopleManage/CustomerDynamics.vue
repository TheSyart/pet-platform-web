<template>
    <el-main>

        <SearchForm :searchForm="searchForm" :formItems="formItems" @submit="onSubmit" />

        <button style="height: 30px; visibility: hidden;"></button>

        <el-table class="table-container" :data="tableData" border align="center" header-align="center"
            :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="600px">
            <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
                align="center">
                <template #default="{ row }">

                    <template v-if="column.label === '操作'">
                        <el-button v-if="row.status === 0" type="primary" size="mini"
                            @click="viewDynamicsInfo(row.id, 0)">查看</el-button>
                        <el-button v-if="row.status === 0" type="danger" size="mini">删除</el-button>
                        <el-button v-if="row.status === 1" type="warning" size="mini"
                            @click="viewDynamicsInfo(row.id, 1)">查看</el-button>
                        <el-button v-if="row.status === 1" type="success" size="mini">恢复</el-button>
                    </template>

                    <template v-else-if="column.label === '状态'">
                        <el-tag v-if="row.status == 0" type="success">已发布</el-tag>
                        <el-tag v-if="row.status == 1" type="danger">已删除</el-tag>
                    </template>

                    <template v-else>
                        {{ row[column.prop] }}
                    </template>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog title="动态信息" :visible.sync="dialogOneDynamicsVisible" @close="clearOneService">
            <el-form :model="OneDynamics" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto;">
                    <el-form-item label="发布者:" :label-width="formLabelWidth">
                        <el-input v-model="OneDynamics.name" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="点赞人数:" :label-width="formLabelWidth">
                        <el-input v-model="OneDynamics.likeCount" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="动态内容:" :label-width="formLabelWidth">
                        <el-input v-model="OneDynamics.content" style="resize: none;" autocomplete="off" type="textarea"
                            :rows="3" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="具体点赞人:" :label-width="formLabelWidth">
                        <el-input v-model="OneDynamics.likepeople" style="resize: none;" autocomplete="off"
                            type="textarea" :rows="3" disabled>
                        </el-input>
                    </el-form-item>
                </div>
                <div style="flex: 0 0 auto;">
                    <el-form-item label="动态图像:" :label-width="formLabelWidth" style="margin-bottom: 0;">
                        <img :src="OneDynamics.image_path" alt="动态图像" style=" height: 180px;" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOneDynamicsVisible = false">取 消</el-button>
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
import SearchForm from '../../../components/SearchForm.vue';
import CommonData from '../../../commonData/CommonData.js';
export default {
    components: {
        SearchForm
    },
    computed: {
        statusLabel() {
            return this.statusMap[this.OneDynamics.status] || '';
        },
        formItems() {
            return [
                {
                    label: '发送人姓名',
                    component: 'el-input',
                    prop: 'name',
                    props: { placeholder: '发送人姓名', style: { width: this.formItemWidth } }
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
                    label: '发布日期',
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
            statusMap: [],
            tableData: [],
            columns: [
                { label: '发布者', prop: 'name' },
                { label: '点赞人数', prop: 'likeCount' },
                { label: '动态发布日期', prop: 'sendtime' },
                { label: '最后修改日期', prop: 'updateDate' },
                { label: '状态', prop: 'status' },
                { label: '操作', prop: 'status' }
            ],
            searchForm: {
                name: "",
                status: "",
                createdate: []
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            formItemWidth: '105px',
            formLabelWidth: '100px',
            dialogOneDynamicsVisible: false,
            OneDynamics: {
            }
        }
    },
    methods: {
        clearOneService() {
            this.OneDynamics = {}; // 重置为初始状态
        },
        viewDynamicsInfo(id, type) {
            this.checkOrUpdate = type;  //判断查看一个的状态
            this.dialogOneDynamicsVisible = true; // 打开员工信息对话框
            axios.get("/api/dynamics/queryOneDynamics", {
                params: {
                    id: id
                },
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            }).then((result) => {
                this.OneDynamics = result.data.data;
            }).catch(error => {
                console.error('错误:', error);
            });
        },
        onSubmit(formData) {
            this.searchForm = formData;
            this.getDynamicsInformation();
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1;
            this.getDynamicsInformation();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getDynamicsInformation();
        },
        getDynamicsInformation() {
            //时间选择器自带的 X ，点击后会让值为null
            if (this.searchForm.createdate == null) {
                this.searchForm.createdate = [];
            }
            const page = this.currentPage;
            const size = this.pageSize;
            const name = this.searchForm.name;
            const status = this.searchForm.status;
            const begin = this.searchForm.createdate[0] ? this.$formatDateTime(this.searchForm.createdate[0]) : '';
            const end = this.searchForm.createdate[1] ? this.$formatDateTime(this.searchForm.createdate[1]) : '';

            axios.post("/api/dynamics/queryAllDynamics", {
                conditions: {
                    name: name,
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
                this.statusMap = this.status;
                this.tableData = result.data.data.list;
                this.total = result.data.data.total;
            })

        }

    },
    mounted() {
        this.getDynamicsInformation();
    },
}
</script>