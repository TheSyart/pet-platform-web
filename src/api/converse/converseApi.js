import request from '@/utils/request';

// 查询会话列表
export function queryConverseList(data) {
  return request({
    url: `/converse/queryConverseList`,
    method: 'get',
    params: data
  });
}

//查询两个人之间全部消息
export function queryOnePersonMessageList(data) {
  return request({
    url: `/converse/queryOnePersonMessage`,
    method: 'get',
    params: data
  });
}