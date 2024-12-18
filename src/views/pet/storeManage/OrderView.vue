<template>
    <el-main>
        <!-- 使用 DataFetcher 组件获取订单所有种类数据 -->
        <DataFetcher dataType="petOrder" @data-fetched="handlePetOrderData" />
        <!-- 表单 -->
        <SearchFrom :searchFrom="searchFrom" :formItems="formItems" @submit="onSubmit" />

        <!-- 表格 -->
        <el-table class="table-container" :data="tableData" border align="center" header-align="center"
            :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="600px">
            <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
                align="center">
                <!-- 使用一个模板处理 status 和其他列 -->
                <template #default="{ row }">
                    <!-- 如果是 status 列，则渲染相应的按钮 -->
                    <template v-if="column.prop === 'status'">
                        <el-button type="primary" size="mini" @click="viewOrderInfo(row.id, 0)">查看</el-button>
                        <el-button v-if="row.orderstatus === 3" type="danger" size="mini">超时完成</el-button>
                        <!-- <el-button v-if="row.status === 0" type="primary" size="mini"
                            @click="viewOrderInfo(row.id, 0)">查看</el-button>
                        <el-button v-if="row.status === 0" type="danger" size="mini">下架</el-button>
                        <el-button v-if="row.status === 1" type="primary" size="mini"
                            @click="viewOrderInfo(row.id, 1)">查看</el-button>
                        <el-button v-if="row.status === 1" type="success" size="mini">上架</el-button> -->
                    </template>

                    <!-- 如果是 note 列，显示对应的订单备注 -->
                    <template v-else-if="column.prop === 'note'">
                        {{ row.note ?? '无' }}
                    </template>

                    <!-- 如果是 order_type 列，显示对应的订单类型 -->
                    <template v-else-if="column.prop === 'order_type'">
                        {{ orderTypeMap[row.order_type] }}
                    </template>

                    <!-- 如果是 pick_method 列，显示对应的取货方式 -->
                    <template v-else-if="column.prop === 'pickMethod'">
                        {{ pickMethodMap[row.pickMethod] }}
                    </template>

                    <!-- 如果是 orderstatus 列，显示对应的订单状态 -->
                    <template v-else-if="column.prop === 'orderstatus'">
                        <el-tag v-if="row.orderstatus == 0">{{orderStatusMap[row.orderstatus]}}</el-tag>
                        <el-tag v-if="row.orderstatus == 1" type="warning">{{orderStatusMap[row.orderstatus]}}</el-tag>
                        <el-tag v-if="row.orderstatus == 2" type="success">{{orderStatusMap[row.orderstatus]}}</el-tag>
                        <el-tag v-if="row.orderstatus == 3" type="danger">{{orderStatusMap[row.orderstatus]}}</el-tag>
                    </template>

                    <!-- 如果是 totalAmount 列，显示出带单位的价格 -->
                    <template v-else-if="column.prop === 'totalAmount'">
                        {{ row.totalAmount | formatPrice }}
                    </template>

                    <!-- 默认渲染其他列的值 -->
                    <template v-else>
                        {{ row[column.prop] }}
                    </template>
                </template>
            </el-table-column>
        </el-table>






        <!-- 订单信息对话框 -->
        <el-dialog title="订单信息" :visible.sync="dialogOneOrderVisible" @close="clearOneOrder">
            <el-form :model="OneOrder" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto;">
                    <el-form-item label="订单编号:" :label-width="formLabelWidth">
                        <el-input v-model="OneOrder.order_id" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="客户姓名:" :label-width="formLabelWidth">
                        <el-input v-model="OneOrder.customerName" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="订单金额:" :label-width="formLabelWidth">
                        <div style="display: flex; align-items: center;">
                            <el-input-number v-model="OneOrder.totalAmount" :precision="2" :step="1" :min="0.0"
                                :max="9999" disabled></el-input-number>
                            <span style="margin-left: 8px;">元</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="取货方式:" :label-width="formLabelWidth">
                        <el-select v-model="pickMethodLabel" disabled>
                            <el-option v-for="(item, index) in pickMethodMap" :key="index" :label="item" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付方式:" :label-width="formLabelWidth">
                        <el-select v-model="paymentMethodLabel" disabled>
                            <el-option v-for="(item, index) in paymentMethodMap" :key="index" :label="item"
                                :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单类型:" :label-width="formLabelWidth">
                        <el-select v-model="orderTypeLabel" disabled>
                            <el-option v-for="(item, index) in orderTypeMap" :key="index" :label="item" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="flex: 0 0 auto;"> <!-- 固定宽度 -->
                    <el-form-item label="订单备注:" :label-width="formLabelWidth">
                        <el-input v-model="displayNote" style="resize: none;" autocomplete="off" type="textarea"
                            :rows="3" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="下单时间:" :label-width="formLabelWidth">
                        <el-input v-model="OneOrder.createdate" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="OneOrder.pickMethod === 0" label="地址信息:" :label-width="formLabelWidth">
                        <el-input v-model="addressInfo" style="resize: none;" autocomplete="off" type="textarea"
                            :rows="6" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="OneOrder.pickMethod === 1" label="预约人信息:" :label-width="formLabelWidth">
                        <el-input v-model="reservedInfo" style="resize: none;" autocomplete="off" type="textarea"
                            :rows="1" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="OneOrder.pickMethod === 1" label="取货码:" :label-width="formLabelWidth">
                        <el-input v-model="OneOrder.secretKey" style="resize: none;" autocomplete="off" type="textarea"
                            :rows="1" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="OneOrder.pickMethod === 2" label="服务医师" :label-width="formLabelWidth">
                        <el-input v-model="doctorInfo" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="OneOrder.pickMethod === 2" label="服务宠物:" :label-width="formLabelWidth">
                        <el-input v-model="OneOrder.petName" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="OneOrder.pickMethod === 2" label="服务时间:" :label-width="formLabelWidth">
                        <el-input v-model="appointmentTimeAndSlot" autocomplete="off" disabled></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOneOrderVisible = false">取 消</el-button>
                <!-- <el-button v-if="this.checkOrUpdate === 0">编 辑</el-button> -->
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
import DataFetcher from '../../Component/DataFetcher.vue';
import CommonData from '../../Component/CommonData.js'; // 导入 CommonData 数据文件
export default {
    components: {
        DataFetcher,
        SearchFrom,
    },
    computed: {
        pickMethodLabel() {
            return this.pickMethodMap[this.OneOrder.pickMethod] || '';
        },
        paymentMethodLabel() {
            return this.paymentMethodMap[this.OneOrder.paymentMethod] || '';
        },
        orderTypeLabel() {
            return this.orderTypeMap[this.OneOrder.order_type] || '';
        },
        orderStatusLabel() {
            return this.orderStatusMap[this.OneOrder.orderStatus] || '';
        },
        statusLabel() {
            return this.statusMap[this.OneOrder.status] || '';
        },
        formItems() {
            return [
                {
                    label: '客户姓名',
                    component: 'el-input',
                    prop: 'name',
                    props: { placeholder: '客户姓名', style: { width: this.formItemWidth } }
                },
                {
                    label: '订单编号',
                    component: 'el-input',
                    prop: 'order_id',
                    props: { placeholder: '订单编号', style: { width: this.formItemWidth } }
                },
                {
                    label: '订单状态',
                    component: 'el-select',
                    prop: 'orderStatus',
                    props: {
                        placeholder: '订单状态',
                        clearable: true,
                        style: { width: this.formItemWidth }
                    },
                    options: this.orderStatusMap
                },
                {
                    label: '订单类型',
                    component: 'el-select',
                    prop: 'order_type',
                    props: {
                        placeholder: '订单类型',
                        clearable: true,
                        style: { width: this.formItemWidth }
                    },
                    options: this.orderTypeMap
                },
                {
                    label: '取货方式',
                    component: 'el-select',
                    prop: 'pickMethod',
                    props: {
                        placeholder: '取货方式',
                        clearable: true,
                        style: { width: this.formItemWidth }
                    },
                    options: this.pickMethodMap
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
                    label: '创建日期',
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
        },
        displayNote() {
            return this.OneOrder.note
                ? this.OneOrder.note
                : '无';
        },
        addressInfo() {
            const address = this.OneOrder.address || {};
            return `${address.name || ''}${this.salutationMap[address.gender] || ''} ${address.phone || ''}\n${address.addressTitle || ''}\n${address.addressDetails || ''}${address.door || ''}`;
        },
        reservedInfo() {
            return `${this.OneOrder.reservedName || ''} ${this.OneOrder.reservedPhone || ''}`;
        },
        doctorInfo() {
            return `${this.OneOrder.doctorName || ''} ${this.OneOrder.doctorPhone || ''}`;
        },
        appointmentTimeAndSlot() {
            return `${this.OneOrder.appointmentTime} ${this.OneOrder.serviceTimeSlot}`;
        }

    },
    data() {
        return {
            ...CommonData,
            checkOrUpdate: "",   //查看一个时判断状态
            orderStatusMap: [],  //订单状态
            orderTypeMap: [],    // 订单类型
            statusMap: [],
            salutationMap: [],
            pickMethodMap: [],     //取货方式
            paymentMethodMap: [],  //支付方式
            tableData: [],
            columns: [
                { label: '订单编号', prop: 'order_id' },
                { label: '顾客姓名', prop: 'customerName' },
                { label: '订单金额', prop: 'totalAmount' },
                { label: '订单备注', prop: 'note' },
                { label: '订单类型', prop: 'order_type' },
                { label: '取货方式', prop: 'pickMethod' },
                { label: '订单状态', prop: 'orderstatus' },
                { label: '创建时间', prop: 'createdate' },
                { label: '操作', prop: 'status' } 
            ],
            searchFrom: {
                name: '',
                order_id: '',
                order_type: '',
                orderStatus: '',
                pickMethod: '',
                status: "",
                createdate: []
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            formItemWidth: '105px',
            formLabelWidth: '100px',
            dialogOneOrderVisible: false,
            OneOrder: {
            }
        };
    },
    methods: {
        clearOneOrder() {
            this.OneOrder = {}; // 重置为初始状态
        },
        handlePetOrderData(data) {
            this.orderTypeMap = data; // 直接赋值字符串数组
        },
        viewOrderInfo(id, type) {
            this.checkOrUpdate = type;  //判断查看一个的状态
            this.dialogOneOrderVisible = true; // 打开订单信息对话框
            axios.get("/api/petOrder/queryOneOrder", {
                params: {
                    id: id
                },
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            }).then((result) => {
                this.OneOrder = result.data.data;
            }).catch(error => {
                console.error('错误:', error);
            });
        },
        onSubmit(formData) {
            this.searchFrom = formData;
            this.getOrderInformation();
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1;
            this.getOrderInformation();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getOrderInformation();
        },
        getOrderInformation() {
            //时间选择器自带的 X ，点击后会让值为null
            if (this.searchFrom.createdate == null) {
                this.searchFrom.createdate = [];
            }

            const page = this.currentPage;
            const size = this.pageSize;
            const name = this.searchFrom.name;
            const order_id = this.searchFrom.order_id;
            const order_type = this.searchFrom.order_type;
            const orderStatus = this.searchFrom.orderStatus;
            const pickMethod = this.searchFrom.pickMethod;
            const status = this.searchFrom.status;
            const begin = this.searchFrom.createdate[0] ? this.$formatDateTime(this.searchFrom.createdate[0]) : '';
            const end = this.searchFrom.createdate[1] ? this.$formatDateTime(this.searchFrom.createdate[1]) : '';

            axios.post("/api/petOrder/queryAllOrder", {
                conditions: {
                    page: page,
                    pageSize: size,
                    name: name,
                    order_id: order_id,
                    order_type: order_type,
                    orderStatus: orderStatus,
                    pickMethod: pickMethod,
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
                this.orderStatusMap = this.orderStatus;
                this.pickMethodMap = this.pickMethod;
                this.paymentMethodMap = this.paymentMethod;
                this.salutationMap = this.salutation;
                this.statusMap = this.status;
                this.tableData = result.data.data.list;
                this.total = result.data.data.total;
            })

        },
    },
    mounted() {

        this.getOrderInformation();

    },
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
    resize: none;
}
</style>