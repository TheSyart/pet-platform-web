import request from '@/utils/request';

// 分页查询客户
export function pageQueryCustomer(data) {
  return request({
    url: '/customer/queryAllCustomer',
    method: 'post',
    data
  });
}

// 查询单个客户
export function queryOneCustomer(id) {
  return request({
    url: '/customer/queryOneCustomer',
    method: 'get',
    params: { id }
  });
}

//更新一个客户状态
export function updateCustomerStatus(data) {
  return request({
    url: '/customer/updateCustomerStatus',
    method: 'post',
    data
  });
}

//更新一个员工信息
export function updateCustomer(data) {
  return request({
    url: '/customer/updateCustomer',
    method: 'post',
    data
  });
}


//删除一个员工照片
export function deleteCustomer(id) {
  return request({
    url: '/customer/deleteCustomerImage',
    method: 'get',
    params: { id }
  });
}

