export const state = () => ({
  isVisible: false,
  alertMessage: '',
  alertType: 'warning'
})

export const mutations = {
  setAlert (state, { alertMessage, alertType }) {
    state.isVisible = true
    state.alertMessage = alertMessage
    state.alertType = alertType
  },

  hideAlert (state) {
    state.isVisible = false
  }
}

export const actions = {
  showAlert ({ commit }, { alertMessage, alertType }) {
    commit('setAlert', { alertMessage, alertType })
  },

  hideAlert ({ commit }) {
    commit('hideAlert')
  }
}
