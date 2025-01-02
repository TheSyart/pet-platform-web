import request from '@/utils/request';

// 分页查询宠物百科
export function pageQueryEncyclopedia(data) {
  return request({
    url: '/encyclopedia/pageQueryAllEncyclopedia',
    method: 'post',
    data
  });
}

// 查询单个宠物百科
export function queryOneEncyclopedia(id) {
  return request({
    url: '/encyclopedia/queryOneEncyclopedia',
    method: 'get',
    params: { id }
  });
}


// 录入一个新宠物百科
export function insertOneEncyclopedia(data) {
  return request({
    url: '/encyclopedia/insertOneEncyclopedia',
    method: 'post',
    data
  });
}

//更新一个宠物百科状态
export function updateEncyclopediaStatus(data) {
  return request({
    url: '/encyclopedia/updateEncyclopediaStatus',
    method: 'post',
    data
  });
}

//更新一个宠物百科信息
export function updateEncyclopedia(data) {
  return request({
    url: '/encyclopedia/updateEncyclopedia',
    method: 'post',
    data
  });
}


//删除一个宠物百科照片
export function deleteEncyclopedia(id) {
  return request({
    url: '/encyclopedia/deleteEncyclopediaImage',
    method: 'get',
    params: { id }
  });
}

