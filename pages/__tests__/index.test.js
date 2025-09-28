import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import SearchPage from '~/pages/index.vue'
import emtuApi from '~/assets/services/emtu-api'
import * as bus from '~/store/bus'
jest.mock('vue2-leaflet', () => ({ // Mock temporário do Vue2-leaflet
  LMap: {
    render (h) { return h('div', { class: 'mock-map' }) }
  },
  LTileLayer: {
    render (h) { return h('div') }
  },
  LControl: {
    render (h) { return h('div') }
  },
  LMarker: {
    render (h) { return h('div') }
  }
}))

jest.requireActual('~/assets/services/emtu-api')

const localVue = createLocalVue()
localVue.use(Vuex)

const setBusRoutes = jest.fn()

const store = new Store({
  modules: {
    city: {
      namespaced: true,
      state: {
        cities: []
      },
      actions: {
        fetchCities: () => []
      }
    },
    cid: {
      namespaced: true,
      state: {
        cids: []
      },
      actions: {
        fetchCids: () => []
      }
    },
    bus: {
      namespaced: true,
      ...bus,
      mutations: {
        setBusRoutes
      }
    },
    loading: {
      namespaced: true,
      actions: { changeStatusLoading: jest.fn() }
    },
    alert: {
      namespaced: true,
      actions: {
        showAlert: jest.fn(),
        hideAlert: jest.fn()
      }
    }
  }
})

describe('Pages / SearchPage', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(SearchPage, {
      localVue,
      vuetify,
      store,
      mocks: {
        $router: { push: jest.fn() },
        $nuxt: { $route: { path: '/' } }
      },
      stubs: {
        RouterLink: RouterLinkStub,
        NuxtLink: RouterLinkStub
      }
    })
  })

  it('matches the screenshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  //   describe('when all data is correct', () => {
  //     it('should render the page', () => {
  //       expect(wrapper.element).toMatchSnapshot()
  //       expect(wrapper.findAll('input').length).toBe(8)
  //     })
  //   })

  //   describe('when search button is clicked', () => {
  //     beforeAll(() => {
  //       emtuApi.post = jest.fn().mockResolvedValue({
  //         data: [{
  //           code: '244',
  //           vehicle: [{ group: 'G1' }]
  //         },
  //         {
  //           code: '420',
  //           vehicle: [{ group: 'G1' }, { group: 'G2' }]
  //         }]
  //       })
  //     })

  //     beforeEach(() => {
  //       wrapper.setData({
  //         searchBody: {
  //           originCityId: 1,
  //           destinationCityId: 2,
  //           cid: 3,
  //           data: '2023-10-22',
  //           hora: '21:45'
  //         }
  //       })

  //       const searchButton = wrapper.findComponent('button')
  //       searchButton.trigger('click')
  //     })

  //     it('calls emtu-api to execute bus search', () => {
  //       expect(emtuApi.post).toHaveBeenNthCalledWith(1, '/bus', {
  //         originCityId: 1,
  //         destinationCityId: 2,
  //         cid: 3,
  //         data: '2023-10-22',
  //         hora: '21:45'
  //       })
  //     })

  //     it('formats the result grouping by cid', () => {
  //       expect(setBusRoutes).toHaveBeenCalledWith({ busRoutes: [] }, [{
  //         group: 'G1',
  //         routes: [
  //           { code: '244', vehicle: [{ group: 'G1' }] },
  //           {
  //             code: '420',
  //             vehicle: [{ group: 'G1' }, { group: 'G2' }]
  //           }]
  //       }, {
  //         group: 'G2',
  //         routes: [
  //           { code: '420', vehicle: [{ group: 'G1' }, { group: 'G2' }] }]
  //       }])
  //     })

  //     describe('when bus search goes wrong', () => {
  //       let consoleError

  //       beforeAll(() => {
  //         consoleError = jest.spyOn(console, 'error')
  //         emtuApi.post.mockRejectedValue('error ocurred')
  //       })

  //       it('calls console.error', () => {
  //         expect(consoleError).toHaveBeenCalledWith('error ocurred')
  //       })
  //       afterAll(() => {
  //         jest.resetAllMocks()
  //         emtuApi.post = jest.fn().mockResolvedValue({
  //           data: [{
  //             code: '244',
  //             vehicle: [{ group: 'G1' }]
  //           },
  //           {
  //             code: '420',
  //             vehicle: [{ group: 'G1' }, { group: 'G2' }]
  //           }]
  //         })
  //       })
  //     })
  //   })
})
