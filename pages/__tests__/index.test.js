import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import SearchPage from '~/pages/index.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
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
    }
  }
})

describe('Pages / SearchPage', () => {
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
        store,
        router,
        components: {
          RouterLinkStub
        }
      })
      expect(wrapper.findAll('input').length).toBe(8)
      expect(wrapper.find('.search-page__image').exists()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
