import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import ReportPage from '~/pages/solicitacao'
import emtuApi from '~/assets/services/emtu-api'

const localVue = createLocalVue()
localVue.use(Vuex)

const showAlert = jest.fn()
const hideAlert = jest.fn()

const store = new Store({
  modules: {
    city: {
      namespaced: true,
      state: {
        cities: []
      },
      actions: {
        fetchCities: () => []
      }
    },
    cid: {
      namespaced: true,
      state: {
        cids: []
      },
      actions: {
        fetchCids: () => []
      }
    },
    alert: {
      namespaced: true,
      actions: { showAlert, hideAlert }
    }
  }
})

describe('Pages / ReportPage', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(ReportPage, {
      localVue,
      vuetify,
      store,
      stubs: {
        'router-link': RouterLinkStub
      }
    })
  })

  it('should render the page', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render correct elements', () => {
    const homeButton = wrapper.findComponent({ name: 'v-btn' })
    expect(homeButton.text()).toBe('enviar')
  })

  describe('when user clicks in submit', () => {
    beforeAll(() => {
      emtuApi.post = jest.fn(() => Promise.resolve({}))
    })

    beforeEach(() => {
      wrapper.setData({
        reportData: {
          email: 'test@mail.com',
          originCityId: 1,
          destinationCityId: 2,
          cidId: 3
        }
      })

      const submitButton = wrapper.findComponent({ name: 'v-btn' })
      submitButton.trigger('click')
    })

    it('calls emtu-api to save report', () => {
      expect(emtuApi.post).toHaveBeenCalledWith('reports', {
        email: 'test@mail.com',
        idCidadeOrigem: 1,
        idCidadeDestino: 2,
        idCid: 3
      })
    })

    it('shows alert with success message', () => {
      expect(showAlert).toHaveBeenCalledWith(expect.anything(),
        {
          alertMessage: 'Solicitação enviada com sucesso!',
          alertType: 'success'
        })
    })

    it('should render updated page', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should render correct elements', () => {
      const homeButton = wrapper.findComponent({ name: 'v-btn' })
      expect(homeButton.text()).toBe('voltar para home')
    })

    describe('when report creation goes wrong', () => {
      describe('and a custom error message is present', () => {
        beforeAll(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          emtuApi.post = jest.fn(() => Promise.reject({ response: { data: { message: 'Deu Ruim' } } }))
        })

        it('shows alert with custom error message', () => {
          expect(showAlert).toHaveBeenCalledWith(expect.anything(),
            {
              alertMessage: 'Deu Ruim',
              alertType: 'error'
            })
        })
      })

      describe('and a custom error message is not present', () => {
        beforeAll(() => {
          emtuApi.post = jest.fn(() => Promise.reject(Error))
        })

        it('shows alert with default error message', () => {
          expect(showAlert).toHaveBeenCalledWith(expect.anything(),
            {
              alertMessage: 'Ocorreu um erro ao enviar a solicitação',
              alertType: 'error'
            })
        })
      })
    })
  })
})
