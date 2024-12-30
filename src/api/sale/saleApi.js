import request from '@/utils/request';

// 查询宠物商城与服务的各种大类别营销详情
export function queryAllOrderInfoDetailsCount(params) {
    return request({
        url: '/petOrder/queryAllOrderInfoDetailsCount',
        method: 'get',
        params: params
    });
}

// 查询各个商品详细营销统计
export function queryAllShoppingSale(params) {
    return request({
        url: '/petOrder/queryAllShoppingSale',
        method: 'get',
        params: params
    });
}
