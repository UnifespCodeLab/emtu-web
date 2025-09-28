import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import RoutesPage from '~/pages/rotas.vue'
import * as bus from '~/store/bus'
import 'core-js'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Store({
  modules: {
    bus: {
      namespaced: true,
      ...bus
    }
  }
})

describe('Pages / RoutesPage', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(RoutesPage, {
      localVue,
      vuetify,
      store,
      stubs: {
        'router-link': RouterLinkStub
      }
    })
  })
  
  it('matches the screenshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

//   describe('when busRoutes is empty', () => {
//     beforeEach(() => {
//       store.commit('bus/setBusRoutes', [])
//     })

//     it('should render the page with empty state message', () => {
//       console.log(wrapper.html())
//       expect(wrapper.element).toMatchSnapshot()
//     })
//   })

//   describe('when all data is correct', () => {
//     beforeEach(() => {
//       store.commit('bus/setBusRoutes', [{
//         group: 'G1',
//         routes: [{
//           code: '244',
//           destination: 'COTIA (RODOVIA RAPOSO TAVARES - KM 21)',
//           origin: 'OSASCO (CENTRO)',
//           points: [],
//           lineHours: [
//             '1999-01-01T14:16:00.000Z',
//             '1999-01-01T14:50:00.000Z',
//             '1999-01-01T15:16:00.000Z'
//           ],
//           busStops: [{
//             endereco: 'Av. João Batista, 278 - Centro, Osasco - SP, 06097-090, Brasil'
//           }, {
//             endereco: 'Rua Doutor Mariano Jatati Marcondes Ferraz, 405 - Centro, Osasco - SP, 06097-010, Brasil'
//           }]
//         }]
//       }])
//     })

  //   it('should render the page', () => {
  //     expect(wrapper.element).toMatchSnapshot()
  //   })
  // })
})
