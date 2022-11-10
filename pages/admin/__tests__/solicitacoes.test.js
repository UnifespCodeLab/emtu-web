import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import AdminReports from '~/pages/admin/solicitacoes.vue'

const localVue = createLocalVue()
let vuetify
let wrapper

describe('Pages / Admin / AdminPerformedSearches', () => {
  beforeEach(() => {
    jest.mock('vue-apexcharts', () => jest.fn())

    vuetify = new Vuetify()

    wrapper = mount(AdminReports, {
      localVue,
      vuetify,
      data () {
        return {
          headers: [
            {
              text: 'Email',
              align: 'start',
              filterable: true,
              value: 'email'
            },
            { text: 'Cidade Origem', value: 'originCity' },
            { text: 'Cidade Destino', value: 'destinationCity' },
            { text: 'Cid', value: 'cid' }
          ],
          reports: null,
          numberOfResults: null
        }
      },
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
    const endDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10)

    const textField = wrapper.findAllComponents({ name: 'v-text-field' }).at(1)
    expect(textField.props('value')).toBe(endDate)
  })

  it('should not render the chart container', () => {
    const container = wrapper.find('.line-ranking__graph-wrapper')
    expect(container.exists()).toBe(false)
  })

  describe('when search button is clicked', () => {
    beforeEach(() => {
      const searchButton = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      searchButton.trigger('click')
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
      expect(table.props('headers').length).toBe(4)
    })
  })
})
