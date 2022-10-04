import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import AdminDailyAccess from '~/pages/admin/acessos-diarios.vue'

const initialDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .substr(0, 10)

const localVue = createLocalVue()
let vuetify
let wrapper

describe('Pages / Admin / AdminDailyAccess', () => {
  beforeEach(() => {
    jest.mock('vue-apexcharts', () => {})

    vuetify = new Vuetify()

    wrapper = mount(AdminDailyAccess, {
      localVue,
      vuetify,
      data: () => {
        return {
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

  describe('when the start date input is clicked', () => {
    beforeEach(() => {
      const textField = wrapper.findAllComponents({ name: 'v-text-field' }).at(0)
      textField.trigger('click')
    })

    it('should render the page', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should show the picker', async () => {
      const textField = wrapper.findAll('.daily-acces__input').at(0)
      expect(textField.props('value')).toBe(initialDate)
      textField.trigger('click')

      await wrapper.vm.$nextTick()
      const dialog = wrapper.findAllComponents({ name: 'v-dialog' }).at(0)
      expect(dialog.props('value')).toBe(true)
    })
  })
})
