import { getSecureKey, login, logout, register, getInfo, updateUserInfo, keepalive } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { JSEncrypt } from 'encryptlong'
// import axios from 'axios'
const state = {
  token: getToken(),
  userid: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  aliveid: 0,
  com: '',
  comId: '',
  mobile: '',
  mail: '',
  businessCardId: '',
  position: [],
  intervalId: -1
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_ALIVEID: (state, aliveid) => {
    state.aliveid = aliveid
  },
  SET_COM: (state, com) => {
    state.com = com
  },
  SET_COM_ID: (state, comId) => {
    state.comId = comId
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_MAIL: (state, mail) => {
    state.mail = mail
  },
  SET_POSITION: (state, position) => {
    state.position = position
  },
  SET_BUSINESSCARDID: (state, businessCardId) => {
    state.businessCardId = businessCardId
  },
  SET_INTERVAL: (state, intervalId) => {
    state.intervalId = intervalId
  }
}

const actions = {
  // async keepalive(state) {
  //   await keepalive(state.userid)
  // },
  // user login
  async login({ commit }, userInfo) {
    const key = await getSecureKey()
    // const JSEncrypt = require('node-jsencrypt')
    const jse = new JSEncrypt()
    jse.setPublicKey(key)
    const encrypted = jse.encryptLong(JSON.stringify(userInfo))
    return new Promise((resolve, reject) => {
      login(encrypted).then(response => {
        const mytoken = response
        if (mytoken) {
          commit('SET_TOKEN', mytoken)
          setToken(mytoken)
          // commit('SET_INTERVAL', setInterval(keepalive, 60000))
          resolve()
        } else {
          reject(new Error('登录失败'))
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user register
  async register({ commit }, regForm) {
    const key = await getSecureKey()
    // const JSEncrypt = require('node-jsencrypt')
    const jse = new JSEncrypt()
    jse.setPublicKey(key)
    const encrypted = jse.encryptLong(JSON.stringify(regForm))
    return new Promise((resolve, reject) => {
      register(encrypted).then(response => {
        const resp = response
        console.log(resp)
        if (resp) {
        //   commit('SET_TOKEN', mytoken)
        //   setToken(mytoken)
          resolve()
        } else {
          reject(new Error('注册失败'))
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        commit('SET_INTERVAL', setInterval(keepalive, 60000))
        const data = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, name, avatar, introduction, userid, com, comId, mobile, mail, position, businessCardId } = data
        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_USERID', userid)
        commit('SET_COM', com)
        commit('SET_COM_ID', comId)
        commit('SET_MOBILE', mobile)
        commit('SET_MAIL', mail)
        commit('SET_POSITION', position)
        commit('SET_BUSINESSCARDID', businessCardId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // update user info
  async updateInfo({ commit }, infoForm) {
    const key = await getSecureKey()
    const jse = new JSEncrypt()
    jse.setPublicKey(key)
    const encrypted = jse.encryptLong(JSON.stringify(infoForm))
    return new Promise((resolve, reject) => {
      updateUserInfo(encrypted).then(response => {
        const resp = response
        console.log(resp)
        if (resp) {
          resolve()
        } else {
          reject(new Error('失败'))
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    clearInterval(state.intervalId)
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
