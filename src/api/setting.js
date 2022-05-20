import request from '@/utils/request'

// 获取所有角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

// 根据 ID 查询企业信息
export function getCompanyInfoById(id) {
  return request({
    url: `/company/${id}`,
    method: 'GET'
  })
}

// 根据 ID 删除角色
export function delRoleById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

// 根据 ID 获取角色信息
export function getRoleInfoById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

// 根据 ID 更新角色
export function updateRoleInfoById(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

// 给角色分配权限
export function addAssignPermission(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'PUT',
    data
  })
}
