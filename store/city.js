import emtuApi from 'assets/services/emtu-api'

export const state = () => ({
  cities: []
})

export const mutations = {
  setCities (state, value) {
    state.cities = value
  }
}

export const actions = {
  async fetchCities ({ commit }) {
    try {
      const { data } = await emtuApi.get('/city')

      const formattedCities =
       data
         ? data.map(({ id, name }) => ({
           text: name,
           value: id
         }))
         : []

      commit('setCities', formattedCities)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}
