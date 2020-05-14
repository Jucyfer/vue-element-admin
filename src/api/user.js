import request from '@/utils/request'
// import axios from 'axios'
export function getSecureKey() {
  return request({
    url: '/secure/btsafekey',
    method: 'get'
  })
}

export function login(data) {
  // return axios.post('/secure/login', data, { headers: { 'Content-Type': 'text/plain;charset=UTF-8' }})
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/secure/login',
    method: 'post',
    data,
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}

export function getInfo() {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/secure/userInfo',
    method: 'get'
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

