<template>
    <el-main>
        <!-- 使用 DataFetcher 组件获取商品所有种类数据 -->
        <DataFetcher dataType="petService" @data-fetched="handlePetServiceData" />
        <!-- 表单 -->
        <SearchFrom :searchFrom="searchFrom" :formItems="formItems" @submit="onSubmit" />

        <!-- 新增服务对话框 -->
        <el-button type="primary" size="small" plain round @click="dialogFormVisible = true"
            style="height:30px;">新增服务</el-button>
        <el-dialog title="新增服务" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto; margin-right: 20px;">
                    <el-form-item label="服务名称:" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="服务价格:" :label-width="formLabelWidth">
                        <div style="display: flex; align-items: center;">
                            <el-input-number v-model="form.price" :precision="2" :step="1" :min="0.0"
                                :max="9999"></el-input-number>
                            <span style="margin-left: 8px;">元</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="服务类别:" :label-width="formLabelWidth">
                        <el-select v-model="form.shoppingTypeId" placeholder="请选择服务类别">
                            <el-option v-for="(type, index) in petServiceMap" :key="index" :label="type" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div style="flex: 0 0 auto;"> <!-- 固定宽度 -->
                    <el-form-item label="服务简介:" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.description" autocomplete="off" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="服务图片:" :label-width="formLabelWidth" style="margin-bottom: 0;">
                        <ImgUploader type="service" @upload-success="handleUploadSuccess" ref="imgUploader" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearForm">取 消</el-button>
                <el-button type="primary" @click="addNewService">确 定</el-button>
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
                        <el-button v-if="row.status === 0" type="primary" size="mini"
                            @click="viewServiceInfo(row.id, 0)">编辑</el-button>
                        <el-button v-if="row.status === 0" type="danger" size="mini">下架</el-button>
                        <el-button v-if="row.status === 1" type="warning" size="mini"
                            @click="viewServiceInfo(row.id, 1)">查看</el-button>
                        <el-button v-if="row.status === 1" type="success" size="mini">上架</el-button>
                    </template>

                    <template v-else-if="column.label === '状态'">
                        <el-tag v-if="row.status == 0" type="success">上架中</el-tag>
                        <el-tag v-if="row.status == 1" type="danger">下架中</el-tag>
                    </template>

                    <!-- 如果是 shoppingTypeId 列，显示对应的服务类型 -->
                    <template v-else-if="column.prop === 'shoppingTypeId'">
                        {{ petServiceMap[row.shoppingTypeId] }}
                    </template>

                    <!-- 如果是 price 列，显示出带单位的价格 -->
                    <template v-else-if="column.prop === 'price'">
                        {{ row.price | formatPrice }}
                    </template>

                    <!-- 默认渲染其他列的值 -->
                    <template v-else>
                        {{ row[column.prop] }}
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <!-- 服务信息对话框 -->
        <el-dialog title="商品信息" :visible.sync="dialogOneServiceVisible" @close="clearOneService">
            <el-form :model="OneService" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto;">
                    <el-form-item label="服务名称:" :label-width="formLabelWidth">
                        <el-input v-model="OneService.name" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="服务价格:" :label-width="formLabelWidth">
                        <div style="display: flex; align-items: center;">
                            <el-input-number v-model="OneService.price" :precision="2" :step="1" :min="0.0" :max="9999"
                                disabled></el-input-number>
                            <span style="margin-left: 8px;">元</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="服务类别:" :label-width="formLabelWidth">
                        <el-select v-model="petServiceLabel" disabled>
                            <el-option v-for="(type, index) in petServiceMap" :key="index" :label="type" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="flex: 0 0 auto;"> <!-- 固定宽度 -->
                    <el-form-item label="服务简介:" :label-width="formLabelWidth">
                        <el-input v-model="OneService.description" style="resize: none;" autocomplete="off"
                            type="textarea" :rows="3" disabled>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="服务图片:" :label-width="formLabelWidth" style="margin-bottom: 0;">
                        <img :src="OneService.image_path" alt="服务图片" style=" height: 180px;" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOneServiceVisible = false">取 消</el-button>
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
import ImgUploader from '../../Component/ImgUploader.vue';
import DataFetcher from '../../Component/DataFetcher.vue';
import CommonData from '../../Component/CommonData.js'; // 导入 CommonData 数据文件
export default {
    components: {
        DataFetcher,
        ImgUploader,
        SearchFrom,
    },
    computed: {
        petServiceLabel() {
            return this.petServiceMap[this.OneService.shoppingTypeId] || '';
        },
        statusLabel() {
            return this.statusMap[this.OneService.status] || '';
        },
        formItems() {
            return [
                {
                    label: '服务名称',
                    component: 'el-input',
                    prop: 'name',
                    props: { placeholder: '服务名称',  style: { width: this.formItemWidth }}
                },
                {
                    label: '服务种类',
                    component: 'el-select',
                    prop: 'shoppingTypeId',
                    props: {
                        placeholder: '服务种类',
                        clearable: true,
                        style: { width: this.formItemWidth }},
                    options: this.petServiceMap // 依赖 petServiceMap
                },
                {
                    label: '状态',
                    component: 'el-select',
                    prop: 'status',
                    props: {
                        placeholder: '状态',
                        clearable: true,
                        style: { width: this.formItemWidth }},
                    options: this.statusMap // 依赖 statusMap
                },
                {
                    label: '服务注册日期',
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
            petServiceMap: [], // 存储宠物服务所有类型数据
            statusMap: [],
            tableData: [],
            columns: [
                { label: '服务名称', prop: 'name' },
                { label: '服务类型', prop: 'shoppingTypeId' },
                { label: '服务价格', prop: 'price' },
                { label: '创建时间', prop: 'createdate' },
                { label: '更新时间', prop: 'updatedate' },
                { label: '状态', prop: 'status' },
                { label: '操作', prop: 'status' }
            ],
            searchFrom: {
                name: "",
                shoppingTypeId: "",
                status: "",
                createdate: []
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            dialogFormVisible: false,
            form: {
                name: '',
                price: '',
                description: '',
                shoppingTypeId: '',
                image_path: ''
            },
            formItemWidth: '105px',
            formLabelWidth: '100px',
            dialogOneServiceVisible: false,
            OneService: {
            }
        };
    },
    methods: {
        clearOneService() {
            this.OneService = {}; // 重置为初始状态
        },
        clearForm() {
            this.dialogFormVisible = false; // 关闭对话框
            this.form = { // 初始化表单数据
                name: '',
                price: '',
                description: '',
                shoppingTypeId: '',
                image_path: ''
            };
            if (this.$refs.imgUploader && typeof this.$refs.imgUploader.clearImage === 'function') {
                this.$refs.imgUploader.clearImage(); // 清空图片
            }
        },
        handleUploadSuccess(responseData) {
            // 在这里处理或保存从子组件收到的响应数据
            this.form.image_path = responseData;
        },
        handlePetServiceData(data) {
            console.log('父组件收到响应数据:', data);
            this.petServiceMap = data; // 直接赋值字符串数组
        },
        viewServiceInfo(id, type) {
            this.checkOrUpdate = type;  //判断查看一个的状态
            this.dialogOneServiceVisible = true; // 打开服务信息对话框
            axios.get("/api/petService/queryOneService", {
                params: {
                    id: id
                },
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            }).then((result) => {
                this.OneService = result.data.data;
            }).catch(error => {
                console.error('错误:', error);
            });
        },
        onSubmit(formData) {
            this.searchFrom = formData;
            this.getServiceInformation();
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1;
            this.getServiceInformation();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getServiceInformation();
        },
        getServiceInformation() {
            //时间选择器自带的 X ，点击后会让值为null
            if (this.searchFrom.createdate == null) {
                this.searchFrom.createdate = [];
            }
            const page = this.currentPage;
            const size = this.pageSize;
            const name = this.searchFrom.name;
            const shoppingTypeId = this.searchFrom.shoppingTypeId;
            const status = this.searchFrom.status;
            const begin = this.searchFrom.createdate[0] ? this.$formatDateTime(this.searchFrom.createdate[0]) : '';
            const end = this.searchFrom.createdate[1] ? this.$formatDateTime(this.searchFrom.createdate[1]) : '';

            axios.post("/api/petService/queryAllService", {
                conditions: {
                    page: page,
                    pageSize: size,
                    name: name,
                    shoppingTypeId: shoppingTypeId,
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

        },
        addNewService() {

            const p_name = this.form.name;
            const p_price = this.form.price;
            const p_description = this.form.description;
            const p_img = this.form.image_path;
            const p_type = this.form.shoppingTypeId;

            console.log("Name:", p_name);
            console.log("p_price:", p_price);
            console.log("p_description:", p_description);
            console.log("p_img:", p_img);
            console.log("p_type:", p_type);


            axios.post("/api/petService/insertNewService", {
                name: p_name,
                price: p_price,
                description: p_description,
                shoppingTypeId: p_type,
                image_path: p_img,
            }, {
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            })
                .then(response => {
                    console.log('成功:', response.data);
                    this.dialogFormVisible = false; // 成功后关闭对话框
                    this.clearForm();
                    this.getServiceInformation(); // 重新加载数据

                })
                .catch(error => {
                    console.error('错误:', error);
                    this.$message.warning(error.response.data);
                });

        }
    },
    mounted() {

        this.getServiceInformation();
    },
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
    resize: none;
}
</style>