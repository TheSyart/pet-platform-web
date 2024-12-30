import request from '@/utils/request';

// 登录统计详情
export function pageQueryLoginCount(data) {
  return request({
    url: '/ip/queryAllIpInfo',
    method: 'post',
    data
  });
}
