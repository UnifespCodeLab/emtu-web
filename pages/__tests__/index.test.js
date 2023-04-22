import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import SearchPage from '~/pages/index.vue'
import emtuApi from '~/assets/services/emtu-api'

const localVue = createLocalVue()
localVue.use(Vuex)

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
        $router: { push: jest.fn() }
      },
      components: {
        RouterLinkStub
      }
    })
  })

  describe('when all data is correct', () => {
    it('should render the page', () => {
      expect(wrapper.findAll('input').length).toBe(8)
      expect(wrapper.find('.search-page__image').exists()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('when search button is clicked', () => {
    beforeAll(() => {
      emtuApi.post = jest.fn(() => Promise.resolve({}))
    })

    beforeEach(() => {
      wrapper.setData({
        searchBody: {
          originCity: 1,
          destinationCity: 2,
          cid: 3,
          date: '2023-10-22',
          time: '21:45'
        }
      })

      const searchButton = wrapper.findComponent('button')

      searchButton.trigger('click')
    })

    it('calls emtu-api to save route search', () => {
      expect(emtuApi.post).toHaveBeenCalledWith('searches', {
        idCidadeOrigem: 1,
        idCidadeDestino: 2,
        idCid: 3,
        dataViagem: '2023-10-22',
        horaViagem: '21:45'
      })
    })

    describe('when route search saving goes wrong', () => {
      let consoleError

      beforeAll(() => {
        consoleError = jest.spyOn(console, 'error')
        emtuApi.post = jest.fn(() => Promise.reject(Error))
      })

      it('calls console.error', () => {
        expect(consoleError).toHaveBeenCalledWith('Falha ao salvar busca no banco de dados!')
      })
    })
  })
})
