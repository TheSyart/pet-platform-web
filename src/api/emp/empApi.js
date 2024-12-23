import request from '@/utils/request';

// 分页查询员工
export function pageQueryEmp(data) {
  return request({
    url: '/emp/pageQueryAllEmp',
    method: 'post',
    data
  });
}

// 查询单个员工
export function queryOneEmp(id) {
  return request({
    url: '/emp/queryOneEmp',
    method: 'get',
    params: { id }
  });
}


// 录入一个新员工
export function insertOneEmp(data) {
  return request({
    url: '/emp/insertNewEmp',
    method: 'post',
    data
  });
}

//更新一个员工状态
export function updateEmpStatus(data) {
  return request({
    url: '/emp/updateEmpStatus',
    method: 'post',
    data
  });
}

//更新一个员工信息
export function updateEmp(data) {
  return request({
    url: '/emp/updateEmp',
    method: 'post',
    data
  });
}


//删除一个员工照片
export function deleteEmp(id) {
  return request({
    url: '/emp/deleteEmpImage',
    method: 'get',
    params: { id }
  });
}

