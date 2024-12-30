import request from '@/utils/request';

// 分页查询宠物
export function pageQueryPet(data) {
    return request({
      url: '/myPet/queryAllPet',
      method: 'post',
      data
    });
  }
  
  // 查询单个宠物
  export function queryOnePet(id) {
    return request({
      url: '/myPet/queryOnePet',
      method: 'get',
      params: { id }
    });
  }