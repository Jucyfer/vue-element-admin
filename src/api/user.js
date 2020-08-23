import request from '@/utils/request'
import store from '@/store/index'
// import axios from 'axios'
export function getSecureKey() {
  return request({
    url: '/common/btsafekey',
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

export function register(data) {
  // return axios.post('/secure/login', data, { headers: { 'Content-Type': 'text/plain;charset=UTF-8' }})
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/secure/register',
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
export function updateUserInfo(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/secure/userInfo/' + store.getters.userid,
    method: 'post',
    data,
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}
export function logout() {
  return request({
    url: '/secure/logout',
    method: 'get'
  })
}

export function getUsers() {
  return request({
    // url: '/vue-element-admin/users',
    url: '/secure/user/list',
    method: 'get'
  })
}

export function setUserPwd(userid, body) {
  return request({
    // url: '/vue-element-admin/users',
    url: '/secure/user/' + userid + '/pwd',
    method: 'post',
    data: body
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

export function keepalive() {
  return request({
    url: '/secure/alive',
    method: 'get'
  })
}
