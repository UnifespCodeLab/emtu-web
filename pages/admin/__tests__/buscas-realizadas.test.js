import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import AdminPerformedSearches from '~/pages/admin/buscas-realizadas.vue'

jest.mock('~/assets/services/emtu-api', () => {
  const get = jest.fn().mockResolvedValue({
    data: {
      data: [
        {
          id: 26,
          idCidadeOrigem: 5,
          idCidadeDestino: 18,
          idLinha: null,
          sucedida: false,
          idCid: 2,
          dataViagem: '2023-10-28',
          horaViagem: '17:20',
          dataCriacao: '2023-10-24T20:20:33.528Z'
        }
      ]
    },
    status: 200,
    statusText: 'OK'
  })

  return ({
    create: () => ({
      get
    }),
    get
  })
})

const localVue = createLocalVue()
let vuetify
let wrapper

class ResizeObserver {
  observe () {}
  unobserve () {}
}

describe('Pages / Admin / AdminPerformedSearches', () => {
  beforeEach(() => {
    jest.mock('vue-apexcharts', () => jest.fn())
    window.ResizeObserver = ResizeObserver

    vuetify = new Vuetify()

    wrapper = mount(AdminPerformedSearches, {
      localVue,
      vuetify,
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
    expect(autocompletes.length).toBe(2)

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
    const container = wrapper.find('.line-ranking__graph-wrapper')
    expect(container.exists()).toBe(false)
  })

  describe('when search button is clicked', () => {
    let executeSearchSpy
    beforeEach(() => {
      wrapper.setData({
        startDate: '2023-10-10',
        endDate: '2023-10-11',
        originCity: '1',
        destinationCity: '2'
      })

      executeSearchSpy = jest.spyOn(wrapper.vm, 'executeSearch')
      const searchButton = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      searchButton.trigger('click')
    })

    it('calls BUSCAR button', () => {
      expect(executeSearchSpy).toHaveBeenCalled()
    })

    it('should render the chart container', async () => {
      // const searchButton = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      // searchButton.trigger('click')

      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const container = wrapper.find('.line-ranking__graph-wrapper')
      expect(container.exists()).toBe(true)
    })

    it('should render correct chart', async () => {
      // const searchButton = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      // searchButton.trigger('click')

      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      const chart = wrapper.findComponent({ name: 'AdminChart' })
      expect(chart.props('title')).toBe('Buscas realizadas no período')
      expect(chart.props('type')).toBe('line')
    })
  })
})
