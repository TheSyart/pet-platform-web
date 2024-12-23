import request from '@/utils/request';

// 分页查询动态
export function pageQueryDynamics(data) {
  return request({
    url: '/dynamics/queryAllDynamics',
    method: 'post',
    data
  });
}

// 查询单个动态
export function queryOneDynamics(id) {
  return request({
    url: '/dynamics/queryOneDynamics',
    method: 'get',
    params: { id }
  });
}

//更新一个动态状态
export function updateDynamicsStatus(data) {
  return request({
    url: '/dynamics/updateDynamicsStatus',
    method: 'post',
    data
  });
}




