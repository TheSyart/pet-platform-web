import { petSex, petStatus, formItemWidth, formItemMiddleWidth } from '@/api/common/CommonData';

export const SearchFormItems = [
    {
        label: '宠物姓名',
        component: 'el-input',
        prop: 'petName',
        props: {
            placeholder: '宠物姓名',
            style: { width: formItemWidth }
        }
    },
    {
        label: '主人姓名',
        component: 'el-input',
        prop: 'userName',
        props: {
            placeholder: '主人姓名',
            style: { width: formItemWidth }
        }
    },
    {
        label: '宠物品种',
        component: 'el-select',
        prop: 'petBreed',
        props: {
            placeholder: '宠物品种',
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
        options: petStatus
    },
    {
        label: '注册日期',
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
    { label: '宠物姓名', prop: 'pet_name' },
    {
        label: '宠物品种',
        prop: 'pet_breed',
        type: 'transform',
        details: []
    },
    {
        label: '性别',
        prop: 'pet_sex',
        type: 'transform',
        details: petSex
    },
    {
        label: '宠物备注',
        prop: 'pet_details',
        type: 'transform',
        details: []
    },
    { label: '主人姓名', prop: 'name' },
    { label: '注册日期', prop: 'createDate' },
    { label: '最后修改日期', prop: 'modifyDate' },
    {
        label: '状态',
        prop: '',
        type: 'tag',
        details: [{ name: petStatus, color: ["success", "danger"] }]
    },
    {
        label: '操作',
        prop: '',
        type: 'button',
        details: [
            { value: [0, 1], name: '查看', color: 'primary', type: 'view' }
        ]
    }
];

export const CommonFormDialogItems = [
  { label: "宠物姓名", prop: "pet_name", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
  { label: "主人姓名", prop: "name", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
  { label: "宠物体重", prop: "pet_weight", type: "el-input", props: { autocomplete: "off", disabled: true }, edit: true, isDate: false },
  {
    label: "宠物毛色",
    prop: "pet_coat",
    type: "el-select",
    props: { autocomplete: "off", disabled: true },
    options: [],
    edit: true,
    isDate: false
  },
    {
    label: "宠物品种",
    prop: "pet_breed",
    type: "el-select",
    props: { autocomplete: "off", disabled: true },
    options: [],
    edit: true,
    isDate: false
  },
    {
    label: "宠物性别",
    prop: "pet_sex",
    type: "el-select",
    props: { autocomplete: "off", disabled: true },
    options: petSex,
    edit: true,
    isDate: false
  },
    {
    label: "宠物备注",
    prop: "pet_details",
    type: "el-select",
    props: { autocomplete: "off", disabled: true },
    options: [],
    edit: true,
    isDate: false
  },
  {
    label: "宠物生日",
    prop: "pet_birth",
    type: "el-date-picker",
    props: { type: "date", placeholder: "选择日期", disabled: true },
    edit: true,
    isDate: true
  },
  {
    label: "头像",
    prop: "image_path",
    type: "ImgUploader",
    props: { type: 'mypet', imageUrl: '', id: '', disabled: true },
    edit: true,
    isDate: false
  }
];