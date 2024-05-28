import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import GlobalAlert from '@/components/GlobalAlert.vue'

describe('GlobalAlert', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let vuetify
  let store
  let actions
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    actions = {
      hideAlert: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        alert: {
          namespaced: true,
          state: {
            isVisible: true,
            alertMessage: 'Teste',
            alertType: 'warning',
          },
          actions
        }
      }
    })

    wrapper = mount(GlobalAlert, {
      localVue,
      vuetify,
      store
    })
  })

  it('matches the snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render correct message', () => {
    const message = wrapper.findComponent({ name: 'VAlert' })
    expect(message.text()).toBe('Teste')
  })

  it('should render message type correctly', () => {
    const alert = wrapper.findComponent({ name: 'VAlert' })
    expect(alert.props().type).toBe('warning')
  })

  it('should call hideAlert method directly', async () => {
    wrapper.vm.hideAlert();
    await wrapper.vm.$nextTick();
    expect(actions.hideAlert).toHaveBeenCalled();
  })
})
