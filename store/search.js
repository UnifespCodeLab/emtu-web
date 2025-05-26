export const state = () => ({
  searches: false
})

export const mutations = {
  setSearch (state, value) {
    state.searches = value
  }
}

export const actions = {
  changeSearch ({ commit }, search) {
    commit('setSearch', search)
  }
}
