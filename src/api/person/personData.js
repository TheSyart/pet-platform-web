import { gender, empStatus } from "../common/CommonData";

export const personColumns = [
    { label: '姓名', prop: 'name', icon: 'el-icon-user-solid' },
    {
        label: '员工编号',
        prop: 'id',
        icon: 'el-icon-collection-tag'
    },
    {
        label: '职位',
        prop: 'job',
        icon: 'el-icon-trophy',
        type: 'transform',
        option: []
    },
    {
        label: '性别',
        prop: 'gender',
        icon: 'el-icon-male',
        type: 'transform',
        option: gender
    },
    { label: '电话号码', prop: 'phone', icon: 'el-icon-mobile-phone' },
    { label: '出生日期', prop: 'birth', icon: 'el-icon-present' },
    { label: '用户名', prop: 'username', icon: 'el-icon-user' },
    { label: '入职日期', prop: 'entrydate', icon: 'el-icon-date' },
    { label: '修改日期', prop: 'modifydate', icon: 'el-icon-time' },
    {
        label: '状态',
        prop: 'status',
        icon: 'el-icon-circle-check',
        type: 'tag',
        option: empStatus,
        style: 'success'
    },
    {
        label: '头像',
        prop: 'image',
        icon: 'el-icon-picture',
        type: 'image'
    },
];


export const CommonFormDialogItems = [
    { label: "姓名", prop: "name", type: "el-input", props: { autocomplete: "off", disabled: false }, disabledStatus: true, edit: true, isDate: false },
    { label: "电话", prop: "phone", type: "el-input", props: { autocomplete: "off", disabled: false },     disabledStatus: true,edit: true, isDate: false },
    {
        label: "性别",
        prop: "gender",
        type: "el-select",
        props: { autocomplete: "off", disabled: false },
        options: gender,
        disabledStatus: true,
        edit: true,
        isDate: false
    },
    {
        label: "职位",
        prop: "job",
        type: "el-select",
        props: { autocomplete: "off", disabled: false },
        options: [],
        disabledStatus: true,
        edit: true,
        isDate: false
    },
    {
        label: "生日",
        prop: "birth",
        type: "el-date-picker",
        props: { type: "date", placeholder: "选择日期", disabled: false },
        disabledStatus: true,
        edit: true,
        isDate: true
    },
    {
        label: "头像",
        prop: "image",
        type: "ImgUploader",
        props: { type: 'emp', imageUrl: '', id: '', fetchDelete: '', disabled: false },
        disabledStatus: true,
        edit: true,
        isDate: false
    }
];

// 自定义验证函数
const validateImage = (rule, value, callback) => {
    console.log("---------->", value);
    if (!value) {
        callback(new Error('请上传头像'));
    } else {
        callback();
    }
};

export const CommonFormDialogRules = {
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    job: [
        { required: true, message: '请选择职位', trigger: 'change' }
    ],
    birth: [
        { required: true, message: '请选择生日', trigger: 'change' }
    ],
    image: [
        { validator: validateImage, required: true, trigger: 'change' }
    ]
};