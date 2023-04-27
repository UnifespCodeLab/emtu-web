import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import RoutesPage from '~/pages/rotas.vue'
import * as bus from '~/store/bus'

jest.requireActual('~/assets/services/emtu-api')

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
      store
    })
  })

  describe('when all data is correct', () => {
    it('should render the page', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
