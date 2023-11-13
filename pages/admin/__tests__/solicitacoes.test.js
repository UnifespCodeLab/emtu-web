import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import emtuApi from '~/assets/services/emtu-api'

import AdminReports from '~/pages/admin/solicitacoes.vue'

jest.requireActual('~/assets/services/emtu-api')

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify
let wrapper

const endDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .substr(0, 10)

const store = new Store({
  modules: {
    cid: {
      namespaced: true,
      state: {
        cids: []
      },
      actions: {
        fetchCids: () => []
      }
    },
    city: {
      namespaced: true,
      state: {
        cities: []
      },
      actions: {
        fetchCities: () => []
      }
    }
  }
})

describe('Pages / Admin / AdminPerformedSearches', () => {
  beforeEach(() => {
    jest.mock('vue-apexcharts', () => jest.fn())

    vuetify = new Vuetify()

    wrapper = mount(AdminReports, {
      localVue,
      vuetify,
      store,
      stubs: {
        'router-link': RouterLinkStub
      }
    })
  })

  it('should render the page', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render the correct elements', () => {
    const dialogs = wrapper.findAllComponents({ name: 'v-dialog' })
    expect(dialogs.length).toBe(2)

    const autocompletes = wrapper.findAllComponents({ name: 'v-autocomplete' })
    expect(autocompletes.length).toBe(3)

    const searchButton = wrapper.findComponent({ name: 'v-btn' })
    expect(searchButton.props('color')).toBe('primary')
  })

  it('should render the correct start date', () => {
    const textField = wrapper.findAllComponents({ name: 'v-text-field' }).at(0)
    expect(textField.props('value')).toBe(null)
  })

  it('should render the correct end date', () => {
    const textField = wrapper.findAllComponents({ name: 'v-text-field' }).at(1)
    expect(textField.props('value')).toBe(endDate)
  })

  it('should not render the chart container', () => {
    const container = wrapper.find('.line-ranking__graph-wrapper')
    expect(container.exists()).toBe(false)
  })

  describe('when search button is clicked', () => {
    beforeEach(() => {
      emtuApi.get = jest.fn().mockResolvedValue({
        data: {
          data: [
            {
              email: 'daniel@mail.com',
              id_cidade_origem: 1,
              id_cidade_destino: 2,
              id_cid: 1,
              data_criacao: '2023-11-12T04:57:28.924+00:00',
              id: 1
            },
            {
              email: 'milena@mail.com',
              id_cidade_origem: 1,
              id_cidade_destino: 13,
              id_cid: 71,
              data_criacao: '2023-11-12T04:58:06.926+00:00',
              id: 2
            }
          ]
        }
      })

      const searchButton = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      searchButton.trigger('click')
    })

    it('calls emtu-api to get reports', () => {
      expect(emtuApi.get).toHaveBeenCalledWith('/reports/getReports', {
        params: {
          origin: null,
          destination: null,
          startDate: null,
          endDate,
          idCid: null
        }
      })
    })

    it('should render updated page', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should render the chart container', () => {
      const container = wrapper.find('.line-ranking__graph-wrapper')
      expect(container.exists()).toBe(true)
    })

    it('should render the table', () => {
      const table = wrapper.findComponent({ name: 'v-data-table' })
      expect(table.exists()).toBe(true)
      expect(table.props('headers').length).toBe(5)
    })
  })
})
