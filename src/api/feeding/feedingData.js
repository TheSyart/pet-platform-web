import { formItemWidth, formItemMiddleWidth, feedingStatus } from "@/api/common/CommonData";

export const SearchFormItems = [
    {
        label: '喂养技巧标题',
        component: 'el-input',
        prop: 'title',
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
        options: feedingStatus
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
    { label: '喂养技巧标题', prop: 'title' },
    { label: '撰写日期', prop: 'createDate' },
    { label: '最后修改日期', prop: 'updateDate' },
    {
        label: '状态',
        prop: '',
        type: 'tag',
        details: [
            { name: feedingStatus, color: ["success", "warning", "danger"] }
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
        label: "喂养技巧标题",
        prop: "title",
        type: "el-input",
        props: {
            autocomplete: "off",
            disabled: true
        },
        edit: true,
        isDate: false,
        fullWidth: true
    },
    {
        label: "喂养技巧内容",
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
        label: "喂养技巧图像",
        prop: "image",
        type: "ImgUploader",
        props: { type: 'encyclopedia/skill', imageUrl: '', id: '', fetchDelete: '', disabled: true },
        edit: true,
        isDate: false
    }
];

export const AddFormDialogItems = [
    {
        label: "喂养技巧标题",
        prop: "title",
        type: "el-input",
        props: { autocomplete: "off" },
        disabled: false,
        isDate: false,
        fullWidth: true
    },
    {
        label: "喂养技巧内容",
        prop: "content",
        type: "el-input",
        props: { autocomplete: "off", type: "textarea", rows: 8 },
        disabled: false,
        isDate: false,
        fullWidth: true
    },
    {
        label: "喂养技巧图像",
        prop: "image",
        type: "ImgUploader",
        props: { type: "encyclopedia/details" },
        disabled: false,
        isDate: false
    }
];




