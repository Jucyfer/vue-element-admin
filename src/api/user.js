import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUsers() {
  return request({
    url: '/vue-element-admin/users',
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/vue-element-admin/user',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/vue-element-admin/user/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/vue-element-admin/user/${id}`,
    method: 'delete'
  })
}

