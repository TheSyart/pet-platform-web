import { formItemWidth, formItemMiddleWidth, gender, empStatus } from '@/api/common/CommonData';

export const SearchFormItems = [
  {
    label: '姓名',
    component: 'el-input',
    prop: 'name',
    props: { placeholder: '姓名', style: { width: formItemWidth } }
  },
  {
    label: '性别',
    component: 'el-select',
    prop: 'gender',
    props: {
      placeholder: '性别',
      clearable: true,
      style: { width: formItemWidth }
    },
    options: gender
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
    options: empStatus
  },
  {
    label: '职位',
    component: 'el-select',
    prop: 'job',
    props: {
      placeholder: '职位',
      clearable: true,
      style: { width: formItemWidth }
    },
    options: [] // 初始化为空数组，待异步加载数据
  },
  {
    label: '入职日期',
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
  { label: '姓名', prop: 'name' },
  { label: '手机号', prop: 'phone' },
  {
    label: '性别',
    prop: 'gender',
    type: 'transform',
    details: gender
  },
  { label: '生日', prop: 'birth' },
  {
    label: '职位',
    prop: 'job',
    type: 'transform',
    details: []
  },
  { label: '入职日期', prop: 'entrydate' },
  { label: '最后修改日期', prop: 'modifydate' },
  {
    label: '状态',
    prop: '',
    type: 'tag',
    details: [
      { name: empStatus, color: ["success", "warning", "danger"] }
    ]
  },
  {
    label: '操作',
    prop: '',
    type: 'button',
    details: [
      { value: [0,1], name: '编辑', color: 'primary', type: 'update' },
      { value: [0], name: '停职', color: 'warning', type: 1 },
      { value: [1], name: '辞退', color: 'warning', type: 2 },
      { value: [1], name: '恢复', color: 'success', type: 0 },
      { value: [2], name: '查看', color: 'warning', type: 'view' }
    ]
  }
]


export const CommonFormDialogItems = [
  { label: "姓名", prop: "name", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
  { label: "电话", prop: "phone", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
  {
    label: "性别",
    prop: "gender",
    type: "el-select",
    props: { autocomplete: "off", disabled: true },
    options: gender,
    edit: true,
    isDate: false
  },
  {
    label: "职位",
    prop: "job",
    type: "el-select",
    props: { autocomplete: "off", disabled: true },
    options: [],
    edit: true,
    isDate: false
  },
  {
    label: "生日",
    prop: "birth",
    type: "el-date-picker",
    props: { type: "date", placeholder: "选择日期", disabled: true },
    edit: true,
    isDate: true
  },
  { label: "账号", prop: "username", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: false, isDate: false },
  { label: "密码", prop: "password", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: false, isDate: false },
  {
    label: "头像",
    prop: "image",
    type: "ImgUploader",
    props: { type: 'emp', imageUrl: '', id: '', fetchDelete: '', disabled: true },
    edit: true,
    isDate: false
  }
];

export const AddFormDialogItems = [
  { label: "姓名", prop: "name", type: "el-input", props: { autocomplete: "off" }, disabled: false, isDate: false },
  { label: "电话", prop: "phone", type: "el-input", props: { autocomplete: "off" }, disabled: false, isDate: false },
  {
    label: "性别",
    prop: "gender",
    type: "el-select",
    props: { autocomplete: "off" },
    options: gender,
    disabled: false,
    isDate: false
  },
  {
    label: "职位",
    prop: "job",
    type: "el-select",
    props: { autocomplete: "off" },
    options: [],
    disabled: false,
    isDate: false
  },
  {
    label: "生日",
    prop: "birth",
    type: "el-date-picker",
    props: { type: "date", placeholder: "选择日期" },
    disabled: false,
    isDate: true
  },
  {
    label: "头像",
    prop: "image",
    type: "ImgUploader",
    props: { type: 'emp' },
    disabled: false,
    isDate: false
  }
];

