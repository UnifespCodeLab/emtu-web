import emtuApi from 'assets/services/emtu-api'

export const state = () => ({
  cids: []
})

export const mutations = {
  setCids (state, value) {
    state.cids = value
  }
}

export const actions = {
  async fetchCids ({ commit }) {
    try {
      const { data } = await emtuApi.get('/cids/')

      const formattedCids =
       data
         ? data.map(({ id, cod }) => ({
           text: cod,
           value: id
         }))
         : []

      commit('setCids', formattedCids)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}
