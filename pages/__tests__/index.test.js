import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

import Vuex from 'vuex'
import SearchPage from '~/pages/index.vue'
import * as cityStore from '~/store/city'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    city: {
      namespaced: true,
      ...cityStore
    }
  }
})

describe('Pages / SearchPage', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  describe('when all data is correct', () => {
    it('should render the page', () => {
      const wrapper = mount(SearchPage, {
        localVue,
        vuetify,
        store
      })
      expect(wrapper.findAll('input').length).toBe(8)
      expect(wrapper.find('.search-page__image').exists()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
