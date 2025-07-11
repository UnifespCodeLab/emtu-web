import emtuApi from '~/assets/services/emtu-api'

export const state = () => ({
  busRoutes: [],
  primaryCid: null
})

export const mutations = {
  setBusRoutes (state, { routes, primaryCid }) {
    state.busRoutes = routes
    state.primaryCid = primaryCid
  }
}

export const actions = {
  async fetchBusRoutes ({ commit, dispatch }, searchBody) {
    try {
      const { data } = await emtuApi.post('/bus', searchBody)
      const formattedResult = []

      const lines = data.lines || []
      lines.forEach((line) => {
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

      commit('setBusRoutes', { routes: formattedResult, primaryCid: data.primaryCid })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      commit('setBusRoutes', null)
    }
  }
}
