import emtuApi from '~/assets/services/emtu-api'

export const state = () => ({
  busRoutes: []
})

export const mutations = {
  setBusRoutes (state, value) {
    state.busRoutes = value
  }
}

export const actions = {
  async fetchBusRoutes ({ commit, dispatch }, searchBody) {
    await dispatch('saveSearch', searchBody)

    try {
      const { data } = await emtuApi.post('/bus', searchBody)
      const formattedResult = []

      data.forEach((line) => {
        line.vehicle.forEach(({ group }) => {
          if (!formattedResult.find(item => item.group === group)) {
            formattedResult.push({ group, routes: [line] })
          } else {
            const groupIndex = formattedResult.findIndex(item => item.group === group)

            if (!formattedResult[groupIndex].routes.find(groupedLine => groupedLine.code === line.code)) {
              formattedResult[groupIndex].routes.push(line)
            }
          }
        })
      })

      commit('setBusRoutes', formattedResult)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      commit('setBusRoutes', null)
    }
  },
  async saveSearch ({ commit }, searchBody) {
    try {
      const { originCityId, destinationCityId, cid, data: dataInput, hora } = searchBody

      await emtuApi.post('searches', {
        idCidadeOrigem: originCityId,
        idCidadeDestino: destinationCityId,
        idCid: cid,
        dataViagem: dataInput,
        horaViagem: hora
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Falha ao salvar busca no banco de dados!')
    }
  }
}
