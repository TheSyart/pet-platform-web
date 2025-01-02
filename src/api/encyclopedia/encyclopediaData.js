import { formItemWidth, formItemMiddleWidth, encyclopediaStatus } from "@/api/common/CommonData";

export const SearchFormItems = [
    {
        label: '宠物名',
        component: 'el-input',
        prop: 'petName',
        props: { placeholder: '宠物名', style: { width: formItemWidth } }
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
        options: encyclopediaStatus
    },
    {
        label: '宠物类别',
        component: 'el-select',
        prop: 'petSpecies',
        props: {
            placeholder: '宠物类别',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: []
    },
    {
        label: '撰写日期',
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
    { label: '宠物名', prop: 'petName' },
    { label: '宠物别名', prop: 'anotherName' },
    {
        label: '宠物类别',
        prop: 'parentId',
        type: 'transform',
        details: []
    },
    { label: '宠物原产地', prop: 'petOrigin' },
    {
        label: '宠物寿命',
        prop: 'petLife',
        type: 'unit',
        details: [{ name: '年' }]
    },
    {
        label: '宠物价格',
        prop: 'petPrice',
        type: 'unit',
        details: [{ name: '元' }]
    },
    { label: '撰写日期', prop: 'createDate' },
    { label: '最后修改日期', prop: 'updateDate' },
    {
        label: '状态',
        prop: '',
        type: 'tag',
        details: [
            { name: encyclopediaStatus, color: ["success", "warning", "danger"] }
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
        label: "宠物名",
        prop: "petName",
        type: "el-input",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "宠物别名",
        prop: "anotherName",
        type: "el-input",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "宠物类别",
        prop: "parentId",
        type: "el-select",
        props: {
            disabled: true
        },
        options: [],
        edit: true,
        isDate: false
    },
    {
        label: "宠物体型",
        prop: "petShape",
        type: "el-input",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "宠物身高",
        prop: "petHeight",
        type: "el-input",
        unit: "cm",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "宠物体重",
        prop: "petWeight",
        type: "el-input",
        unit: "kg",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "宠物价格",
        prop: "petPrice",
        type: "el-input",
        unit: "元",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "宠物寿命",
        prop: "petLife",
        type: "el-input",
        unit: "年",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "宠物原产地",
        prop: "petOrigin",
        type: "el-input",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false
    },
    {
        label: "介绍内容",
        prop: "content",
        type: "el-input",
        props: {
            autocomplete: "off",
            disabled: true,
            type: "textarea",
            rows: 8
        },
        edit: true,
        isDate: false,
        fullWidth: true
    },
    {
        label: "百科图像",
        prop: "image",
        type: "ImgUploader",
        props: { type: 'encyclopedia/details', imageUrl: '', id: '', fetchDelete: '', disabled: true },
        edit: true,
        isDate: false
    }
];

export const AddFormDialogItems = [
    {
        label: "宠物名",
        prop: "petName",
        type: "el-input",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "宠物别名",
        prop: "anotherName",
        type: "el-input",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "宠物类别",
        prop: "parentId",
        type: "el-select",
        props: { placeholder: "请选择宠物类别" },
        options: [],
        disabled: false,
        isDate: false
    },
    {
        label: "宠物体型",
        prop: "petShape",
        type: "el-input",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "宠物原产地",
        prop: "petOrigin",
        type: "el-input",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "宠物身高",
        prop: "petHeight",
        type: "el-input",
        unit: "cm",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "宠物体重",
        prop: "petWeight",
        type: "el-input",
        unit: "kg",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "宠物价格",
        prop: "petPrice",
        type: "el-input",
        unit: "元",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "宠物寿命",
        prop: "petLife",
        type: "el-input",
        unit: "年",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false
    },
    {
        label: "介绍内容",
        prop: "content",
        type: "el-input",
        props: { autocomplete: "off", type: "textarea", rows: 8 },
        disabled: false,
        isDate: false,
        fullWidth: true
    },
    {
        label: "百科图像",
        prop: "avatar",
        type: "ImgUploader",
        props: { type: "encyclopedia/details" },
        disabled: false,
        isDate: false
    }
];




