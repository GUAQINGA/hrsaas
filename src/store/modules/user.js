import { getToken, setToken, removeToken, setTimestamp } from '@/utils/auth'
import { login, getUserInfo, getUserInfoById } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, data) {
    state.userInfo = data
    // state.userInfo = { ...data }
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setTimestamp()
  },
  async getUserInfo(context, data) {
    const res = await getUserInfo()
    const res2 = await getUserInfoById(res.userId)
    // console.log(res)
    context.commit('setUserInfo', { ...res, ...res2 })
    return res
  },
  logout(context, data) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
