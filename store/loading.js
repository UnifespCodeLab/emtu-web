export const state = () => ({
  isActive: false
})

export const mutations = {
  setLoading (state, status) {
    state.isActive = status
  }
}

export const actions = {
  changeStatusLoading ({ commit }, status) {
    commit('setLoading', status)
  }
}
