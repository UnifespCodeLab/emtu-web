import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

import AdminPage from '~/pages/admin/index.vue'

describe('Pages / AdminPage', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should render the page', () => {
    const wrapper = mount(AdminPage, {
      localVue,
      vuetify
    })
    expect(wrapper.findAll('input').length).toBe(2)
    expect(wrapper.findComponent({ name: 'v-btn' }).exists()).toBe(true)
    expect(wrapper.element).toMatchSnapshot()
  })
})
