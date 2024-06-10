import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import ListaCids from '~/pages/lista-cids.vue'
import emtuApi from '~/assets/services/emtu-api'
import 'core-js'

describe('Pages / ListaCids', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = mount(ListaCids, {
      localVue,
      vuetify
    })    
  })

  describe('when the page is empty', () => {
    it('should render the page', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('when all data is correct', () => {
    beforeAll(() => {
      emtuApi.get = jest.fn().mockResolvedValue({
        data: [
          {
            cod: 'M151',
            diagnostic: 'Nódulos de Heberden (com artropatia)',
            observations: 'Com comprometimento importante da deambulação',
            companion: 'Não',
            "group": 'G1'
          },
          {
            cod: 'H54.2',
            diagnostic: 'Visão subnormal em ambos os olhos',
            observations: 'Que melhora com correção',
            companion: 'Sim',
            "group": 'G2'
          },
          {
            cod: 'G30',
            diagnostic: 'Doença de Alzheimer',
            observations: '',
            companion: 'Sim',
            "group": 'G3'
          },
        ] 
      })
    })

    it('should render correct elements', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

  })
})
