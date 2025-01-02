import request from '@/utils/request';

// 分页查询宠物服务
export function pageQueryService(data) {
  return request({
    url: '/petService/pageQueryAllService',
    method: 'post',
    data
  });
}

// 查询单个宠物服务
export function queryOneService(id) {
  return request({
    url: '/petService/queryOneService',
    method: 'get',
    params: { id }
  });
}


// 录入一个新宠物服务
export function insertOneService(data) {
  return request({
    url: '/petService/insertNewService',
    method: 'post',
    data
  });
}

//更新一个宠物服务状态
export function updateServiceStatus(data) {
  return request({
    url: '/petService/updateServiceStatus',
    method: 'post',
    data
  });
}

//更新一个宠物服务信息
export function updateService(data) {
  return request({
    url: '/petService/updateService',
    method: 'post',
    data
  });
}


//删除一个宠物服务照片
export function deleteService(id) {
  return request({
    url: '/petService/deleteServiceImage',
    method: 'get',
    params: { id }
  });
}

