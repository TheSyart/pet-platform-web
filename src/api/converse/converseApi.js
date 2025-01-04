import request from '@/utils/request';

// 删除照片
export function queryConverseList(type) {
  return request({
    url: `/converse/queryConverseList`,
    method: 'get',
    params: { type }
  });
}