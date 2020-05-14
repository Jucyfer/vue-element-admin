import Cookies from 'js-cookie'

const TokenKey = 'Token'

export function getToken() {
  console.log('auth.js里面的getToken方法执行：')
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('auth.js里面的setToken方法的token参数值：' + token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
