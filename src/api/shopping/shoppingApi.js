import request from '@/utils/request';

// 分页查询宠物商城商品
export function pageQueryShopping(data) {
  return request({
    url: '/petShopping/pageQueryAllShopping',
    method: 'post',
    data
  });
}

// 查询单个宠物商城商品
export function queryOneShopping(id) {
  return request({
    url: '/petShopping/queryOneShopping',
    method: 'get',
    params: { id }
  });
}


// 录入一个新宠物商城商品
export function insertOneShopping(data) {
  return request({
    url: '/petShopping/insertNewShopping',
    method: 'post',
    data
  });
}

//更新一个宠物商城商品状态
export function updateShoppingStatus(data) {
  return request({
    url: '/petShopping/updateShoppingStatus',
    method: 'post',
    data
  });
}

//更新一个宠物商城商品信息
export function updateShopping(data) {
  return request({
    url: '/petShopping/updateShopping',
    method: 'post',
    data
  });
}


//删除一个宠物商城商品照片
export function deleteShopping(id) {
  return request({
    url: '/petShopping/deleteShoppingImage',
    method: 'get',
    params: { id }
  });
}

