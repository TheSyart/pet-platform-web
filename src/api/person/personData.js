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