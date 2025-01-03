import request from '@/utils/request';

// 修改密码
export function updateEmpPassword(data) {
  return request({
    url: `/emp/updatePassword`,
    method: 'post',
    data
  });
}
