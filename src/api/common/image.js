import request from '@/utils/request';

// 删除照片
export function deleteFile(data) {
  return request({
    url: `/handlePic/delete`,
    method: 'post',
    data
  });
}

//上传照片
export function uploadPic(formData) {
  return request({
    url: `/handlePic/webUpload`,
    method: 'post',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: formData
  });
}
