import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import AdminDailyAccess from '~/pages/admin/acessos-diarios.vue'

const localVue = createLocalVue()
let vuetify
let wrapper

class ResizeObserver {
  observe () {}
  unobserve () {}
}

describe('Pages / Admin / AdminDailyAccess', () => {
  beforeEach(() => {
    window.ResizeObserver = ResizeObserver
    jest.mock('vue-apexcharts', () => jest.fn())

    vuetify = new Vuetify()

    wrapper = mount(AdminDailyAccess, {
      localVue,
      vuetify,
      data: () => {
        return {
          categories: ['a', 'b', 'c', 'd'],
          series: null
        }
      },
      propsData: {
        series: null
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

    const textFields = wrapper.findAllComponents({ name: 'v-text-field' })
    expect(textFields.length).toBe(2)

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
    const endDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10)

    const textField = wrapper.findAllComponents({ name: 'v-text-field' }).at(1)
    expect(textField.props('value')).toBe(endDate)
  })

  it('should not render the chart container', () => {
    const container = wrapper.find('.daily-access__graph-wrapper')
    expect(container.exists()).toBe(false)
  })

  describe('when search button is clicked', () => {
    beforeEach(() => {
      const searchButton = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      searchButton.trigger('click')
    })

    it('should render the chart container', () => {
      const container = wrapper.find('.daily-access__graph-wrapper')
      expect(container.exists()).toBe(true)
    })

    it('should render correct chart', () => {
      const chart = wrapper.findComponent({ name: 'AdminChart' })
      expect(chart.props('title')).toBe('Média de acessos diários por mês')
      expect(chart.props('type')).toBe('line')
      expect(chart.props('categories')).toEqual(['a', 'b', 'c', 'd'])
    })
  })
})
