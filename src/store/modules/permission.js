import { constantRoutes, dynamicRoutes } from '@/router'

const state = {
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, payload) {
    state.routes = [...constantRoutes, ...payload]
  }
}
const actions = {
  filterRoutes(context, menu) {
    const routeList = []
    menu.forEach((key) => {
      routeList.push(...dynamicRoutes.filter((item) => item.name === key))
    })
    context.commit('setRoutes', routeList)
    return routeList
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
