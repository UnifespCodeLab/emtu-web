import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

import TheHeader from '~/components/admin/TheHeader.vue'
import adminItems from '~/assets/js/adminItems'

describe('Components / TheHeader', () => {
  const localVue = createLocalVue()
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(TheHeader, {
      localVue,
      vuetify,
      mocks: {
        $route: { path: adminItems[0].route }
      }
    })
  })

  it('should render title correctly', () => {
    const title = wrapper.findComponent({ name: 'v-toolbar-title' })
    expect(title.text()).toBe(adminItems[0].title)
    expect(wrapper.element).toMatchSnapshot()
  })
})
