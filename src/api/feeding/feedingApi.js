import request from '@/utils/request';

// 分页查询宠物百科
export function pageQueryFeeding(data) {
  return request({
    url: '/feedingSkill/pageQueryAllFeeding',
    method: 'post',
    data
  });
}

// 查询单个宠物百科
export function queryOneFeeding(id) {
  return request({
    url: '/feedingSkill/queryOneFeeding',
    method: 'get',
    params: { id }
  });
}


// 录入一个新宠物百科
export function insertOneFeeding(data) {
  return request({
    url: '/feedingSkill/insertOneFeeding',
    method: 'post',
    data
  });
}

//更新一个宠物百科状态
export function updateFeedingStatus(data) {
  return request({
    url: '/feedingSkill/updateFeedingStatus',
    method: 'post',
    data
  });
}

//更新一个宠物百科信息
export function updateFeeding(data) {
  return request({
    url: '/feedingSkill/updateFeeding',
    method: 'post',
    data
  });
}


//删除一个宠物百科照片
export function deleteFeeding(id) {
  return request({
    url: '/feedingSkill/deleteFeedingImage',
    method: 'get',
    params: { id }
  });
}

