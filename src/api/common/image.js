import request from '@/utils/request';

// 删除照片
export function deleteFile(data) {
  return request({
    url: `/handlePic/delete`,
    method: 'post',
    data
  });
}