import request from '@/utils/request';

// 首页登录统计
export function loginCount(params) {
    return request({
      url: '/ip/homeLoginCount',
      method: 'get',
      params: params
    });
  }

// 首页订单统计
export function orderCount(params) {
    return request({
      url: '/petOrder/homeOrderCount',
      method: 'get',
      params: params
    });
  }