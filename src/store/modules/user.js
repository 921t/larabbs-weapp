import wepy from '@wepy/core'
import {login, refresh, logout} from '@/api/auth'
import * as auth from '@/utils/auth'
import isEmpty from 'lodash/isEmpty'
import {getCurrentUser} from '@/api/user'

const getDefaultState = () => {
  return {
    user: auth.getUser(),
    accessToken: auth.getToken(),
    accessTokenExpiredAt: auth.getTokenExpiredAt()
  }
}

const state = getDefaultState()

const getters = {
  isLoggedIn: state => !isEmpty(state.accessToken),
  user: state => state.user,
  accessToken: state => state.accessToken,
  accessTokenExpiredAt: state => state.accessTokenExpiredAt
}

const actions = {
  async login({dispatch, commit}, params = {}) {
    const loginData = await wepy.wx.login()
    params.code = loginData.code

    const authResponse = await login(params)

    commit('setToken', authResponse.data)
    auth.setToken(authResponse.data)

    dispatch('getUser')
  },

  async refresh({dispatch, commit, state}) {
    const response = await refresh(state.accessToken)

    commit('setToken', response.data)
    auth.setToken(response.data)

    dispatch('getUser')
  },

  async getUser({commit}) {
    const response = await getCurrentUser()

    commit('setUser', response.data)

    auth.setUser(response.data)
  },

  async logout({commit, state}) {
    await logout(state.accessToken)

    auth.logout()

    commit('resetState')
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setToken(state, tokenPayload) {
    state.accessToken = tokenPayload.access_token
    state.accessTokenExpiredAt = new Date().getTime() + tokenPayload.access_token_expires_in * 1000
  },
  resetState: (state) => {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
