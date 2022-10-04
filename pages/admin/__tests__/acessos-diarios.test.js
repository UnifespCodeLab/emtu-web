import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import AdminDailyAccess from '~/pages/admin/acessos-diarios.vue'

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

    it('should show the picker', async () => {
      await wrapper.vm.$nextTick()
      const datePickers = wrapper.findAllComponents({ name: 'v-date-picker' })
      expect(datePickers.length).toBe(1)
    })
  })
})
