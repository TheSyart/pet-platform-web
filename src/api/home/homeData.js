export const loginOptions = {
    title: {
        text: "登录统计"
    },
    tooltip: {},
    legend: {
        data: ["登录总计", "登录成功", "登录失败"],
        orient: 'horizontal',
        bottom: '5%',  // 将图例稍微向下移动
        left: 'center'
    },
    xAxis: {
        type: "category",
        data: [] // 动态填充员工和客户类别
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            name: "登录总计",
            type: "bar",
            data: [] // 填充总计数据
        },
        {
            name: "登录成功",
            type: "bar",
            data: [] // 填充成功数据
        },
        {
            name: "登录失败",
            type: "bar",
            data: [] // 填充失败数据
        }
    ]

};

export const orderOptions = {
    title: {
        text: "订单统计",
    },
    tooltip: {},
    legend: {
        data: ["订单总数", "订单进行中", "订单取消中", "订单取消", "订单完成", "订单超时"],
        orient: 'horizontal',
        bottom: '0%',  // 将图例稍微向下移动
        left: 'center'
    },
    xAxis: {
        type: "category",
        data: []
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            name: "订单总数",
            type: "bar",
            data: []
        },
        {
            name: "订单进行中",
            type: "bar",
            data: []
        },
        {
            name: "订单取消中",
            type: "bar",
            data: []
        },
        {
            name: "订单取消",
            type: "bar",
            data: []
        },
        {
            name: "订单完成",
            type: "bar",
            data: []
        },
        {
            name: "订单超时",
            type: "bar",
            data: []
        },
        // {
        //   name: "订单总营业额",
        //   type: "bar",
        //   data: [] 
        // }
    ]
};