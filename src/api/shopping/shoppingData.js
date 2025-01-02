import { formItemWidth, formItemMiddleWidth, shoppingStatus } from '@/api/common/CommonData';

export const SearchFormItems = [
    {
        label: '商品名称',
        component: 'el-input',
        prop: 'name',
        props: { placeholder: '商品名称', style: { width: formItemWidth } }
    },
    {
        label: '商品种类',
        component: 'el-select',
        prop: 'shoppingTypeId',
        props: {
            placeholder: '商品种类',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: []
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
        options: shoppingStatus
    },
    {
        label: '商品注册日期',
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
    { label: '商品名称', prop: 'name' },
    {
        label: '商品价格',
        prop: 'price',
        type: 'unit',
        details: [{ name: '元' }]
    },
    {
        label: '商品库存',
        prop: 'stock',
        type: 'unit',
        details: [{ name: '件' }]
    },
    {
        label: '商品类型',
        prop: 'shoppingTypeId',
        type: 'transform',
        details: []
    },
    { label: '创建日期', prop: 'createDate' },
    { label: '最后修改日期', prop: 'updateDate' },
    {
        label: '状态',
        prop: '',
        type: 'tag',
        details: [
            { name: shoppingStatus, color: ["success", "warning", "danger"] },
            { name: ['已告罄'], extra: ['stock'], value: [0], color: ['danger'] }
        ]
    },
    {
        label: '操作',
        prop: '',
        type: 'button',
        details: [
            { value: [0, 1], name: '编辑', color: 'primary', type: 'update' },
            { value: [0], name: '下架', color: 'warning', type: 1 },
            { value: [1], name: '删除', color: 'warning', type: 2 },
            { value: [1], name: '上架', color: 'success', type: 0 },
            { value: [2], name: '查看', color: 'warning', type: 'view' }
        ]
    }
];

export const CommonFormDialogItems = [
    {
        label: "商品名称",
        prop: "name",
        type: "el-input",
        props: { autocomplete: "off", disabled: true },
        edit: true,
        isDate: false
    },
    {
        label: "商品价格",
        prop: "price",
        type: "el-input-number",
        props: { precision: 2, step: 1, min: 0.0, max: 9999, disabled: true },
        edit: true,
        isDate: false
    },
    {
        label: "商品库存",
        prop: "stock",
        type: "el-input-number",
        props: { step: 1, min: 0, max: 9999, disabled: true },
        edit: true,
        isDate: false
    },
    {
        label: "商品类别",
        prop: "shoppingTypeId",
        type: "el-select",
        props: { disabled: true },
        options: [],
        edit: true,
        isDate: false
    },
    {
        label: "商品简介",
        prop: "description",
        type: "el-input",
        props: { style: "resize: none;", type: "textarea", rows: 3, autocomplete: "off", disabled: true },
        edit: true,
        isDate: false,
        fullWidth: true
    },
    {
        label: "商品图片",
        prop: "image",
        type: "ImgUploader",
        props: { type: 'shopping', imageUrl: '', id: '', fetchDelete: '', disabled: true },
        edit: true,
        isDate: false
    }
];

export const AddFormDialogItems = [
    {
        label: "商品名称",
        prop: "name",
        type: "el-input",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "商品价格",
        prop: "price",
        type: "el-input-number",
        props: { precision: 2, step: 1, min: 0.0, max: 9999 },
        disabled: false,
        isDate: false
    },
    {
        label: "商品类别",
        prop: "shoppingTypeId",
        type: "el-select",
        props: { placeholder: "请选择商品类别" },
        options: [],
        disabled: false,
        isDate: false
    },
    {
        label: "商品库存",
        prop: "stock",
        type: "el-input-number",
        props: { min: 0, max: 9999, label: "商品库存" },
        disabled: false,
        isDate: false
    },
    {
        label: "商品简介",
        prop: "description",
        type: "el-input",
        props: { type: "textarea", rows: 4, autocomplete: "off" },
        disabled: false,
        isDate: false,
        fullWidth: true
    },
    {
        label: "商品图片",
        prop: "image",
        type: "ImgUploader",
        props: { type: "shopping" },
        disabled: false,
        isDate: false
    }
];