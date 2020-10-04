import { asyncRoutes, constantRoutes } from '@/router'
import axios from 'axios'
import Layout from '@/layout'

import dashboard from '@/views/dashboard/index'
import OrganizationOverview from '@/views/organization/OrganizationOverview.vue'
import OrganizationDetail from '@/views/organization/OrganizationDetail.vue'
import usr_all_reports from '@/views/usr_tables/usr_all_reports'
import FundOverView from '@/views/fund/FundOverView.vue'
import FundCombine from '@/views/fund/FundCombine.vue'
import FundConstruction from '@/views/fund/FundConstruction.vue'
import AfterInvestManage from '@/views/fund/AfterInvestManage.vue'
import usr_reports from '@/views/usr_tables/usr_reports'
import EmployeeInfomation from '@/views/employee/EmployeeInfomation.vue'
import FundInfoList from '@/views/fund/FundInfoList.vue'
import FundValueList from '@/views/fund/FundValueList.vue'
import CustomizedProductInfoList from '@/views/fund/CustomizedProductInfoList.vue'
import CustomizedProductValueList from '@/views/fund/CustomizedProductValueList.vue'
import permission_user from '@/views/permission/user'
import permission_role from '@/views/permission/role'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
const componentMap = {
  'layout/Layout': Layout,
  'views/dashboard/index': dashboard,
  'views/organization/OrganizationOverview.vue': OrganizationOverview,
  'views/organization/OrganizationDetail.vue': OrganizationDetail,
  'views/usr_tables/usr_all_reports ': usr_all_reports,
  'views/fund/FundOverView.vue': FundOverView,
  'views/fund/FundCombine.vue': FundCombine,
  'views/fund/FundConstruction.vue': FundConstruction,
  'views/fund/AfterInvestManage.vue': AfterInvestManage,
  'views/usr_tables/usr_reports': usr_reports,
  'views/employee/EmployeeInfomation.vue': EmployeeInfomation,
  'views/fund/FundInfoList.vue': FundInfoList,
  'views/fund/FundValueList.vue': FundValueList,
  'views/fund/CustomizedProductInfoList.vue': CustomizedProductInfoList,
  'views/fund/CustomizedProductValueList.vue': CustomizedProductValueList,
  'views/permission/user': permission_user,
  'views/permission/role': permission_role
}
const resolveComponents = (menus) => {
  const res = []
  menus.forEach(route => {
    const tmp = { ...route }
    tmp.component = componentMap[tmp.component]
    if (tmp.children) {
      tmp.children = resolveComponents(tmp.children)
    }
    res.push(tmp)
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      const accessedRoutes = resolveComponents((await axios.get('/secure/menu')).data)
      console.log('accessedRoutes', accessedRoutes)

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
