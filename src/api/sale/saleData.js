export const shoppingSaleOptions = {
    title: {
        text: '宠物商城各类商品销售占比图',
        subtext: '总销售额',
        left: 'center',
        subtextStyle: {
            fontSize: 16, // 设置字体大小
            color: '#333', // 设置字体颜色
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}元 ({d}%)'  // 显示百分比
    },
    legend: {
        orient: 'horizontal',
        bottom: '0%',
        left: 'center'
    },
    color: [
        "#5470C6", "#91CC75", "#EE6666", "#FAC858", "#73C0DE",
        "#3BA272", "#FC8452", "#9A60B4", "#EA7CCC", "#3C91E6",
        "#FF9F7F", "#62C1D4", "#D4A5A5", "#A29BFE"
    ],
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    series: [
        {
            name: '宠物商城',
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
export const serviceSaleOptions = {
    title: {
        text: '宠物服务各类商品销售占比图',
        subtext: '总销售额',
        left: 'center',
        subtextStyle: {
            fontSize: 16, // 设置字体大小
            color: '#333', // 设置字体颜色
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}元 ({d}%)'  // 显示百分比
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
            name: '宠物服务',
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
export const shoppingMostSaleOptions = {
    title: {
        text: '宠物商城销量前十商品'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (params) {
            let result = `${params[0].axisValue}<br/>`; // 添加 xAxis 的值（商品名称）
            params.forEach(item => {
                if (item.seriesName === '商品销售量') {
                    result += `${item.marker} ${item.seriesName}: ${item.value} 件<br/>`;
                } else if (item.seriesName === '商品销售额') {
                    result += `${item.marker} ${item.seriesName}: ${item.value} 元<br/>`;
                }
            });
            return result;
        }
    },
    legend: {},
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0, // 强制所有标签显示
            rotate: 0,  // 旋转角度
            fontSize: 10 // 调整字体大小
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '销售量',
            position: 'left',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#409EFF' // 蓝色，代表销售量
                }
            },
            axisLabel: {
                formatter: '{value} 件' // 单位改为“件”
            }
        },
        {
            type: 'value',
            name: '销售额',
            position: 'right',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#67C23A' // 绿色，代表销售额
                }
            },
            axisLabel: {
                formatter: '{value} 元' // 单位改为“元”
            }
        }
    ],

    series: [
        {
            name: '商品销售量',
            type: 'bar',
            data: []
        },
        {
            name: '商品销售额',
            type: 'line',
            yAxisIndex: 1,
            data: []
        }
    ]
};

export const serviceMostSaleOptions = {
    title: {
        text: '宠物服务销量前十商品'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (params) {
            let result = `${params[0].axisValue}<br/>`; // 添加 xAxis 的值（商品名称）
            params.forEach(item => {
                if (item.seriesName === '商品销售量') {
                    result += `${item.marker} ${item.seriesName}: ${item.value} 件<br/>`;
                } else if (item.seriesName === '商品销售额') {
                    result += `${item.marker} ${item.seriesName}: ${item.value} 元<br/>`;
                }
            });
            return result;
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0, // 强制所有标签显示
            rotate: 0,  // 旋转角度
            fontSize: 10 // 调整字体大小
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '销售量',
            position: 'left',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#409EFF' // 蓝色，代表销售量
                }
            },
            axisLabel: {
                formatter: '{value} 件' // 单位改为“件”
            }
        },
        {
            type: 'value',
            name: '销售额',
            position: 'right',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#67C23A' // 绿色，代表销售额
                }
            },
            axisLabel: {
                formatter: '{value} 元' // 单位改为“元”
            }
        }
    ],

    series: [
        {
            name: '商品销售量',
            type: 'bar',
            data: []
        },
        {
            name: '商品销售额',
            type: 'line',
            yAxisIndex: 1,
            data: []
        }
    ]
};