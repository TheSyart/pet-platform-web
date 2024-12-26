import request from '@/utils/request';

// 分页查询订单
export function pageQueryOrder(data) {
  return request({
    url: '/petOrder/queryAllOrder',
    method: 'post',
    data
  });
}

// 查询单个订单
export function queryOneOrder(id) {
  return request({
    url: '/petOrder/queryOneOrder',
    method: 'get',
    params: { id }
  });
}

//更新一个订单状态
export function updateOrderStatus(data) {
  return request({
    url: '/petOrder/updateOrderStatus',
    method: 'post',
    data
  });
}