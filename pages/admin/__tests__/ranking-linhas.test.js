import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import emtuApi from '~/assets/services/emtu-api'

import AdminLineRanking from '~/pages/admin/ranking-linhas.vue'

jest.requireActual('~/assets/services/emtu-api')

const localVue = createLocalVue()
localVue.use(Vuex)

let vuetify
let wrapper
class ResizeObserver {
  observe () {}
  unobserve () {}
}

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
    alert: {
      namespaced: true,
      actions: {
        showAlert: jest.fn()
      }
    }
  }
})

describe('Pages / Admin / AdminLineRanking', () => {
  beforeEach(() => {
    jest.mock('vue-apexcharts', () => jest.fn())
    window.ResizeObserver = ResizeObserver

    vuetify = new Vuetify()

    wrapper = mount(AdminLineRanking, {
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
    const selects = wrapper.findAllComponents({ name: 'v-select' })
    expect(selects.length).toBe(2)

    const dialogs = wrapper.findAllComponents({ name: 'v-dialog' })
    expect(dialogs.length).toBe(2)

    const textFields = wrapper.findAllComponents({ name: 'v-text-field' })
    expect(textFields.length).toBe(3)

    const datePickers = wrapper.findAllComponents({ name: 'v-date-picker' })
    expect(datePickers.length).toBe(0)

    const searchButton = wrapper.findComponent({ name: 'v-btn' })
    expect(searchButton.props('color')).toBe('primary')
  })

  it('should render the correct start date', () => {
    const textField = wrapper.findAllComponents({ name: 'v-text-field' }).at(0)
    expect(textField.props('value')).toBe(null)
  })

  it('should render the correct end date', () => {
    const textField = wrapper.findAllComponents({ name: 'v-text-field' }).at(2)
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
          data: [{
            idLinha: '244',
            searchCount: 10
          },
          {
            idLinha: '420',
            searchCount: 5
          }]
        }
      })

      const searchButton = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      searchButton.trigger('click')
    })

    it('calls emtu-api to execute ranking search', () => {
      expect(emtuApi.get).toHaveBeenCalledWith('/searches/ranking', {
        params: {
          sucedida: null,
          startDate: null,
          endDate,
          idCid: null,
          limite: null
        }
      })
    })

    it('should render the chart container', async () => {
      await wrapper.vm.$nextTick()

      const container = wrapper.find('.line-ranking__graph-wrapper')
      expect(container.exists()).toBe(true)
    })

    it('should render correct chart', async () => {
      await wrapper.vm.$nextTick()

      const chart = wrapper.findComponent({ name: 'AdminChart' })
      expect(chart.props('title')).toBe('Ranking de linhas')
      expect(chart.props('type')).toBe('bar')
      expect(chart.props('categories')).toEqual(['244', '420'])
    })
  })
})
