import { getSecureKey, login, logout, getInfo, keepalive } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import axios from 'axios'
const state = {
  token: getToken(),
  userid: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  aliveid: 0
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
  }
}

const actions = {
  async keepalive(state) {
    await keepalive(state.userid)
  },
  // user login
  async login({ commit }, userInfo) {
    const key = await getSecureKey()
    const JSEncrypt = require('node-jsencrypt')
    const jse = new JSEncrypt()
    jse.setPublicKey(key)
    const encrypted = jse.encrypt(JSON.stringify(userInfo))
    return new Promise((resolve, reject) => {
      login(encrypted).then(response => {
        const mytoken = response
        if (mytoken) {
          commit('SET_TOKEN', mytoken)
          setToken(mytoken)
          resolve()
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
        const data = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction, userid } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        // console.log(roles)
        // console.log(name)
        // console.log(avatar)
        // console.log(introduction)
        // console.log(userid)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_USERID', userid)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
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
