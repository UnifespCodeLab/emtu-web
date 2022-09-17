import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

import SearchPage from '~/pages/index.vue'

describe('Pages / SearchPage', () => {
  const defaultData = {
    cities: ['São José dos Campos', 'Jacareí', 'Taubaté'],
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    modalDate: false,
    time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    modalTime: false,
  }

  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  describe('when all data is correct', () => {
    it('should render the page', () => {
      const wrapper = mount(SearchPage, {
        localVue,
        vuetify,
        data() {
          return defaultData
        },
      })
      expect(wrapper.findAll('input').length).toBe(8)
      expect(wrapper.find('.search-page__image').exists()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
