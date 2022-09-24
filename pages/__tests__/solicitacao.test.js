import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import ReportPage from '~/pages/solicitacao'

describe('Pages / ReportPage', () => {
  const localVue = createLocalVue()
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(ReportPage, {
      localVue,
      vuetify,
      stubs: {
        'router-link': RouterLinkStub,
      },
    })
  })

  it('should render the page', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render correct elements', () => {
    const alert = wrapper.findComponent({ name: 'v-alert' })
    expect(alert.props('value')).toBe(false)

    const homeButton = wrapper.findAllComponents({ name: 'v-btn' }).at(1)
    expect(homeButton.text()).toBe('enviar')
  })

  describe('when user clicks in submit', () => {
    beforeEach(() => {
      const submitButton = wrapper.findAllComponents({ name: 'v-btn' }).at(1)
      submitButton.trigger('click')
    })

    it('should render updated page', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should render correct elements', () => {
      const alert = wrapper.findComponent({ name: 'v-alert' })
      const homeButton = wrapper.findAllComponents({ name: 'v-btn' }).at(1)

      expect(alert.props('value')).toBe(true)
      expect(homeButton.text()).toBe('voltar para home')
    })
  })
})
