import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

import RoutesPage from '~/pages/rotas.vue'

describe('Pages / RoutesPage', () => {
  const defaultData = {
    cidsRoutes: null,
    model: 0
  }

  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  describe('when all data is correct', () => {
    it('should render the page', () => {
      const wrapper = mount(RoutesPage, {
        localVue,
        vuetify,
        data () {
          return defaultData
        }
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
