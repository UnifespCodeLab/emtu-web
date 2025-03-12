import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import TheFooter from '~/components/TheFooter.vue'

describe('Pages / TheFooter', () => {
  const localVue = createLocalVue()

  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(TheFooter, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
  })

  describe('when the page render', () => {
    it('should matches the screenshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should render buttons correctly', () => {
      const button = wrapper.findAllComponents('.v-btn')
      expect(button).toHaveLength(3)
    })

    it('should render linkedin icon correctly', () => {
      const logo = wrapper.find('.mdi-linkedin')
      expect(logo.exists()).toBe(true)
    })

    it('should render email icon correctly', () => {
      const logo = wrapper.find('.mdi-email')
      expect(logo.exists()).toBe(true)
    })

    it('should render github icon correctly', () => {
      const logo = wrapper.find('.mdi-github')
      expect(logo.exists()).toBe(true)
    })

    it('should render route button correctly', () => {
      const button = wrapper.find('#btn-codelab')
      expect(button.props('to')).toBe(true)
    })
  })
})
