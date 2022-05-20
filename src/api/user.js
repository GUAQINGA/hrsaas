import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取用户基本信息
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 根据 ID 获取用户基本信息
export function getUserInfoById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

export function logout() {}
