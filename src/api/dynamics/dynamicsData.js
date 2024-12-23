import { formItemWidth, dynamicsStatus } from '@/commonData/CommonData';

export const SearchFormItems = [
  {
    label: '发布人',
    component: 'el-input',
    prop: 'name',
    props: { placeholder: '发布人', style: { width: formItemWidth } }
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
    options: dynamicsStatus
  },
  {
    label: '发布日期',
    component: 'el-date-picker',
    prop: 'dateRange',
    props: {
      type: 'datetimerange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      style: 'width: 360px;'
    }
  }
];

export const columns = [
  { label: '发布人', prop: 'name' },
  { 
    label: '点赞人数',
    prop: 'likeCount',
    type: 'unit',
    details: [
      { name: '人' }
    ]
  },
  { label: '动态发布日期', prop: 'sendtime', },
  { label: '最后修改日期', prop: 'updateDate' },
  {
    label: '状态',
    prop: '',
    type: 'tag',
    details: [
      { name: dynamicsStatus, color: ["success", "warning", "danger"] }
    ]
  },
  {
    label: '操作',
    prop: 'status',
    type: 'button',
    details: [
      { value: 0, name: '查看', color: 'primary', type: 'view' },
      { value: 1, name: '查看', color: 'primary', type: 'view' },
      { value: 2, name: '查看', color: 'primary', type: 'view' },
      { value: 0, name: '封禁', color: 'warning', type: 1 },
      { value: 1, name: '删除', color: 'danger', type: 2 },
      { value: 1, name: '解禁', color: 'success', type: 0 },
    ]
  }
]
export const CommonFormDialogItems = [
  { label: "发布人", prop: "name", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
  { label: "点赞人数", prop: "likeCount", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
  { label: "动态内容", prop: "content", type: "el-input", props: { autocomplete: "off", disabled: true, type:"textarea", rows:"4" }, edit: false, isDate: false },
  { label: "具体点赞人", prop: "likepeople", type: "el-input", props: { autocomplete: "off", disabled: true, type:"textarea", rows:"3" }, edit: false, isDate: false },
  {
    label: "动态图像",
    prop: "image_path",
    type: "ImgUploader",
    props: {
      type: 'dynamics',
      imageUrl: '',
      disabled: true
    },
    edit: true,
    isDate: false
  }
];

