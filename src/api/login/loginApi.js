import request from '@/utils/request';

// 员工登录
export function empLogin(data) {
  return request({
    url: '/login/empLogin',
    method: 'post',
    data
  });
}