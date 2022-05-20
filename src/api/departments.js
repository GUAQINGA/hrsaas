import request from '@/utils/request'

// 获取部门列表
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}

// 删除部门
export function deleteDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

// 添加部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

// 根据 ID 获取部门信息
export function getDepartmentInfoById(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

// 根据 ID 修改部门信息
export function editDepartmentInfoById(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
