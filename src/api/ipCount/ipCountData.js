import { accountType, result, loginType, formItemMiddleWidth, formItemWidth } from '@/api/common/CommonData';

export const loginTypeOptions = {
    title: {
        text: '登录方式统计',
        subtext: 'Fake Data',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'  // 显示百分比
    },
    legend: {
        orient: 'horizontal',
        bottom: '0%',
        left: 'center'
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    series: [
        {
            name: '登录方式',
            type: 'pie',
            radius: '50%',
            data: [],  // 数据将动态填充
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                show: true,
                formatter: '{b}: {d}%'  // 显示百分比
            }
        }
    ]
};

export const loginResultOptions = {
    title: {
        text: '登录结果统计',
        subtext: 'Fake Data',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'  // 显示百分比
    },
    legend: {
        orient: 'horizontal',
        bottom: '0%',
        left: 'center'
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    series: [
        {
            name: '登录结果',
            type: 'pie',
            radius: '50%',
            data: [],  // 数据将动态填充
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                show: true,
                formatter: '{b}: {d}%'  // 显示百分比
            }
        }
    ]
};

export const loginTimeOptions = {
    title: {
        text: '登陆时间统计'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: accountType,
        orient: 'horizontal',
        bottom: '0%',
        left: 'center'
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '员工',
            type: 'line',
            data: []
        },
        {
            name: '客户',
            type: 'line',
            data: []
        }
    ]
};

export const columns = [
    { label: '登录账户', prop: 'account' },
    { label: 'IP 地址', prop: 'ip' },
    {
        label: '登录账户类型',
        prop: 'accountType',
        type: 'transform',
        details: accountType
    },
    {
        label: '登录方式',
        prop: 'login_type',
        type: 'transform',
        details: loginType
    },
    {
        label: '登录地址',
        prop: '',
        type: 'merge',
        details: ["country","region","city"]
    },
    {
        label: '经纬度',
        prop: '',
        type: 'merge',
        details: ["lon", "lat"]
    },
    {
        label: '互联网服务提供商',
        prop: 'isp',
        type: 'null',
        details:[{name: "无"}]
    },
    {
        label: '登录结果',
        prop: 'result',
        type: 'transform',
        details: result
    },
    { label: '错误原因', prop: 'message' },
    { label: '登录时间', prop: 'createdDate' },
];

export const SearchFormItems = [
    {
        label: '登录账户',
        component: 'el-input',
        prop: 'username',
        props: { placeholder: '登录账户', style: { width: formItemWidth } }
    },
    {
        label: 'Ip地址',
        component: 'el-input',
        prop: 'ip',
        props: { placeholder: 'Ip地址', style: { width: formItemWidth } }
    },
    {
        label: '账户类型',
        component: 'el-select',
        prop: 'accountType',
        props: {
            placeholder: '账户类型',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: accountType
    },
    {
        label: '登录类型',
        component: 'el-select',
        prop: 'loginType',
        props: {
            placeholder: '登录类型',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: loginType
    },
    {
        label: '登录结果',
        component: 'el-select',
        prop: 'result',
        props: {
            placeholder: '登录结果',
            clearable: true,
            style: { width: formItemWidth }
        },
        options: result
    },
    {
        label: '登录日期',
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
