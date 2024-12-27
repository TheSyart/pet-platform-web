import { formItemWidth, formItemMiddleWidth, status, orderStatus, gender, orderType, pickMethod, paymentMethod, operatorContent, operatorType } from '@/commonData/CommonData';

export const SearchFormItems = [
    {
        label: '客户姓名',
        component: 'el-input',
        prop: 'name',
        props: { placeholder: '姓名', style: { width: formItemWidth } }
    },
    {
        label: '订单编号',
        component: 'el-input',
        prop: 'order_id',
        props: { placeholder: '订单编号', style: { width: formItemWidth } }
    },
    {
        label: '订单类型',
        component: 'el-select',
        prop: 'order_type',
        props: {
            placeholder: '订单类型',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: orderType
    },
    {
        label: '订单状态',
        component: 'el-select',
        prop: 'orderStatus',
        props: {
            placeholder: '订单状态',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: orderStatus
    },
    {
        label: '取货方式',
        component: 'el-select',
        prop: 'pickMethod',
        props: {
            placeholder: '取货方式',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: pickMethod
    },
    {
        label: '状态',
        component: 'el-select',
        prop: 'status',
        props: {
            placeholder: '状态',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: status
    },
    {
        label: '创建日期',
        component: 'el-date-picker',
        prop: 'dateRange',
        props: {
            type: 'datetimerange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            style: { width: formItemMiddleWidth }
        }
    }
];

export const columns = [
    { label: '订单编号', prop: 'order_id' },
    { label: '顾客姓名', prop: 'customerName' },
    {
        label: '订单金额',
        prop: 'totalAmount',
        type: 'unit',
        details: [{ name: '元' }]
    },
    {
        label: '订单备注', prop: 'note',
        type: 'null',
        details: [{ name: '无' }]
    },
    {
        label: '订单类型',
        prop: 'order_type',
        type: 'transform',
        details: orderType
    },
    {
        label: '取货方式',
        prop: 'pickMethod',
        type: 'transform',
        details: pickMethod

    },
    { label: '创建时间', prop: 'createdate' },
    { label: '修改时间', prop: 'updatedate' },
    {
        label: '订单状态',
        prop: 'orderStatus',
        type: 'specialTag',
        details: [
            {
                name: orderStatus,
                color: [
                    "info", "primary", "primary",
                    "primary", "primary", "primary",
                    "info", "warning", "info",
                    "danger", "success"
                ]
            }
        ]
    },
    {
        label: '状态',
        prop: '',
        type: 'tag',
        details: [{ name: status, color: ["success", "danger"] }]
    },
    {
        label: '操作',
        prop: 'orderStatus',
        type: 'specialButton',
        details: [
            // <!--    '订单状态:-->
            // <!--    0.订单待确认 1.商品待配送 2.商品自取中-->
            // <!--    3.服务待服务 4.商品配送中 5.商品已到货-->
            // <!--    6.订单取消中 7.服务已超时 8.申请退货中-->
            // <!--    9.订单已退款 10.订单已完成';-->
            { value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], name: '查看', color: 'primary', type: 'view' },
            { value: [0], name: '确认', color: 'info', type: { basis: 'pickMethod', basisValues: [0, 1, 2], values: [1, 2, 3] }, pass: 'order_id' },
            { value: [1], name: '配送', color: 'warning', type: 4, pass: 'order_id' },
            { value: [4], name: '到货', color: 'success', type: 5, pass: 'order_id' },
            { value: [6, 8], name: '取消', color: 'danger', type: 9, pass: 'order_id' },


        ]
    }
];

const shoppingColumns = [
    { label: '商品名称', prop: 'name' },
    { label: '商品单价', prop: 'price', type: 'unit', details: [{ name: '元' }] },
    { label: '商品数量', prop: 'quantity', type: 'unit', details: [{ name: '件' }] },
    { label: '商品总价', prop: 'subtotal', type: 'unit', details: [{ name: '元' }] },
    { label: '商品照片', prop: 'image_path', type: 'image' }
];

const addressColumns = [
    { label: '收货人', prop: 'name', icon: 'el-icon-user' },
    { label: '性别', prop: 'gender', icon: 'el-icon-male', type: 'transform', details: gender },
    { label: '手机号', prop: 'phone', icon: 'el-icon-mobile-phone' },
    { label: '详细地址', prop: 'addressDetails', icon: 'el-icon-office-building' },
    { label: '经纬度', prop: 'position', icon: 'el-icon-location-outline' }
];

const appointmentColumns = [
    { label: '医师详情', prop: 'doctorName', icon: 'el-icon-user' },
    { label: '医师电话', prop: 'doctorPhone', icon: 'el-icon-mobile-phone' },
    { label: '预约宠物', prop: 'petName', icon: 'el-icon-chicken' },
    { label: '预约日期', prop: 'appointmentTime', icon: 'el-icon-date' },
    { label: '预约时段', prop: 'serviceTimeSlot', icon: 'el-icon-timer' }
];

const reserveColumns = [
    { label: '提货人', prop: 'reservedName', icon: 'el-icon-user' },
    { label: '预留电话', prop: 'reservedPhone', icon: 'el-icon-mobile-phone' },
    { label: '取货码', prop: 'secretKey', icon: 'el-icon-takeaway-box' }
]; 

export const CommonFormDialogItems = [
    { label: "订单编号", prop: "order_id", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
    {
        label: "订单金额",
        prop: "totalAmount",
        type: "el-input",
        props: { autocomplete: "off", disabled: true },
        edit: true,
        isDate: false
    },
    { label: "下单时间", prop: "createdate", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: false, isDate: false }, {
        label: "取货方式",
        prop: "pickMethod",
        type: "el-select",
        props: { type: "date", placeholder: "选择日期", disabled: true },
        options: pickMethod,
        edit: true,
        isDate: false
    },
    {
        label: "支付方式",
        prop: "paymentMethod",
        type: "el-select",
        props: { type: "date", placeholder: "选择日期", disabled: true },
        options: paymentMethod,
        edit: true,
        isDate: false
    },
    {
        label: "订单类型",
        prop: "order_type",
        type: "el-select",
        props: { type: "date", placeholder: "选择日期", disabled: true },
        options: orderType,
        edit: true,
        isDate: false
    },
    { label: "客户姓名", prop: "customerName", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
    {
        label: "商品详情",
        prop: "",
        type: "el-button",
        icon: "el-icon-shopping-cart-1",
        props: { autocomplete: "off", disabled: false },
        formConfig: {
            title: "订单商品详情", // 弹窗标题
            type: "table",
            prop: "orderInfoList",
            columns: shoppingColumns, // 表格列配置
            data: [], // 表格数据绑定字段，这里假设数据为空，实际使用时需要从外部传入
            props: {
                autocomplete: "off", disabled: false, style: "width: 100%",
                height: '250px'
            },
        },
        disabledStatus: true,
        edit: false,
        isDate: false
    },
    {
        label: "预约详情",
        type: "el-button",
        icon: "el-icon-date",
        props: { autocomplete: "off", disabled: false },
        formConfig: {
            title: "预约服务详情", // 弹窗标题
            type: "description",
            prop: "appointmentInfo",
            descriptionProp: {
                column: 3,
                size: "medium", // 可以是 'small', 'medium', 'large'
                border: true,
            },
            columns: appointmentColumns, // 表格列配置
            data: [], // 表格数据绑定字段，这里假设数据为空，实际使用时需要从外部传入
            props: {
                autocomplete: "off", disabled: false, style: "width: 100%",
                height: '250px'
            },
        },
        show: { basis: 'pickMethod', value: 2 },
        disabledStatus: true,
        edit: false,
        isDate: false
    },
    {
        label: "自提详情",
        type: "el-button",
        icon: "el-icon-thumb",
        props: { autocomplete: "off", disabled: false },
        formConfig: {
            title: "到店自提详情", // 弹窗标题
            type: "description",
            prop: "reservedInfo",
            descriptionProp: {
                column: 3,
                size: "medium", // 可以是 'small', 'medium', 'large'
                border: true,
            },
            columns: reserveColumns, // 表格列配置
            data: [], // 表格数据绑定字段，这里假设数据为空，实际使用时需要从外部传入
            props: {
                autocomplete: "off", disabled: false, style: "width: 100%",
                height: '250px'
            },
        },
        show: { basis: 'pickMethod', value: 1 },
        disabledStatus: true,
        edit: false,
        isDate: false
    },
    {
        label: "地址详情",
        prop: "",
        type: "el-button",
        icon: "el-icon-map-location",
        props: { autocomplete: "off", disabled: false },
        formConfig: {
            title: "收货地址详情", // 弹窗标题
            type: "descriptionMap",
            prop: "address",
            descriptionProp: {
                column: 3,
                size: "medium", // 可以是 'small', 'medium', 'large'
                border: true,
            },
            mapProp: {
                centerPoint: "",
                targetPoint: "position"
            },
            columns: addressColumns, // 表格列配置
            data: [], // 表格数据绑定字段，这里假设数据为空，实际使用时需要从外部传入
            props: {
                autocomplete: "off", disabled: false, style: "width: 100%",
                height: '250px'
            },
        },
        show: { basis: 'pickMethod', value: 0 },
        disabledStatus: true,
        edit: false,
        isDate: false
    },
    {
        label: "订单备注",
        prop: "note",
        type: "el-input",
        props:
            { autocomplete: "off", disabled: true, type: "textarea", rows: "4" },
        edit: false,
        isDate: false,
        fullWidth: true
    },
    {
        label: "订单进展",
        prop: "orderRecordList",
        type: "el-steps",
        data: {
            operationContent: operatorContent,
            operatorType: operatorType
        },
        stepProp: {
            title: "operationContent",
            description:["operatorType", "operatorName", "operatorTime"],
        },
        props: {
            alignCenter: true,
            direction: 'horizontal', // 根据需要调整方向
        },
        edit: false,
        isDate: false,
        fullWidth: true
    }
];
