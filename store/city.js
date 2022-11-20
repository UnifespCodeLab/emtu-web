// import emtuApi from 'assets/services/emtu-api'

export const state = () => ({
  cities: []
})

export const mutations = {
  setCities (state, value) {
    state.cities = value
  }
}

export const actions = {
  fetchCities ({ commit }) {
    try {
      // const { cities } = await emtuApi.get('/city')
      const cities = ['São José dos Campos', 'Jacareí', 'Taubaté']

      commit('setCities', cities)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}
