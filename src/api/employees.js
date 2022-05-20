import request from '@/utils/request'

// 获取员工简单列表
export function getEmployeesSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

// 获取员工列表
export function getEmployees(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

// 新增员工
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

// 删除员工
export function delEmployeesById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

// 批量导入员工
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

// 更新用户信息
export function updateUserInfoById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

// 获取员工个人信息
export function getPersonalInfo(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
    method: 'GET'
  })
}

// 保存员工个人信息
export function updatePersonalInfo(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}

// 获取用户的岗位信息
export function getJobInfo(id) {
  return request({
    url: `/employees/${id}/jobs`,
    method: 'GET'
  })
}

// 保存岗位信息
export function updateJobInfo(data) {
  return request({
    url: `/employees/${data.id}/jobs`,
    method: 'PUT',
    data
  })
}

// 给员工分配角色
export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data
  })
}
