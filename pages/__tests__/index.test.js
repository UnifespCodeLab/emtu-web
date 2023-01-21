import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

import SearchPage from '~/pages/index.vue'
RouterLinkStub

describe('Pages / SearchPage', () => {
  const defaultData = {
    cities: ['São José dos Campos', 'Jacareí', 'Taubaté'],
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    modalDate: false,
    time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    modalTime: false
  }

  const localVue = createLocalVue()
  let vuetify
  let router

  beforeEach(() => {
    vuetify = new Vuetify()
    router = new VueRouter()
  })

  describe('when all data is correct', () => {
    it('should render the page', () => {
      const wrapper = mount(SearchPage, {
        localVue,
        vuetify,
        router,
        components: {
          RouterLinkStub
        },
        data () {
          return defaultData
        }
      })
      expect(wrapper.findAll('input').length).toBe(8)
      expect(wrapper.find('.search-page__image').exists()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
