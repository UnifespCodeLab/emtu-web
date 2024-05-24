import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import LoadingAbsolute from '~/components/LoadingAbsolute'

const localVue = createLocalVue()
localVue.use(Vuetify);

describe('Components / LoadingAbsolute', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(LoadingAbsolute, {
      localVue,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('matches the snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('has a loading icon with the correct props', () => {
    const icon = wrapper.findComponent({ name: 'v-progress-circular' })
    expect(icon.exists()).toBeTruthy()
    expect(icon.props().color).toBe('primary')
    expect(icon.attributes('style')).toContain('height: 50px; width: 50px;')
  })
})
