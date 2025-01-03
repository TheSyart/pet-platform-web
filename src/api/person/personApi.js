import request from '@/utils/request';

// 查询单个订单
export function queryOnePerson(id) {
  return request({
    url: '/emp/queryOneEmp',
    method: 'get',
    params: { id }
  });
}