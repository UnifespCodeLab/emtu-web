import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuetify from 'vuetify'

import Sidebar from '~/components/SideBar.vue'
import adminItems from '~/assets/js/adminItems'

describe('Components / Sidebar', () => {
  const localVue = createLocalVue()
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  describe('when component renders', () => {
    beforeEach(() => {
      wrapper = mount(Sidebar, {
        localVue,
        vuetify,
        stubs: {
          'router-link': RouterLinkStub
        },
        mocks: {
          $route: { path: '' }
        },
        propsData: {
          isOpen: true
        }
      })
    })

    describe('when is desktop', () => {
      beforeAll(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true, configurable: true, value: 1200
        })
      })

      it('should render 300', () => {
        const navigation = wrapper.findComponent({ name: 'v-navigation-drawer' })
        expect(navigation.props('width')).toBe('300')
        expect(wrapper.element).toMatchSnapshot()
      })
    })

    describe('when is mobile', () => {
      beforeAll(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true, configurable: true, value: 500
        })
      })

      it('should render 100%', () => {
        const navigation = wrapper.findComponent({ name: 'v-navigation-drawer' })
        expect(navigation.props('width')).toBe('100%')
        expect(wrapper.element).toMatchSnapshot()
      })
    })
  })

  describe('when is not logged', () => {
    it('should render default items', () => {
      wrapper = mount(Sidebar, {
        localVue,
        vuetify,
        stubs: {
          'router-link': RouterLinkStub
        },
        mocks: {
          $route: { path: '/' }
        },
        propsData: {
          isOpen: true
        }
      })

      expect(wrapper.vm.routerItems).toEqual([
        { title: 'Buscar', icon: 'mdi-magnify', route: '/' },
        { title: "Lista de CID's", icon: 'mdi-format-list-numbered', route: '/lista-cids' },
        { title: 'Não encontrei minha rota', icon: 'mdi-bus-alert', route: '/solicitacao' },
        { title: 'Sobre nós', icon: 'mdi-account-group', route: '/sobre-nos' }
      ])
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('when user is logged', () => {
    it('should render admin items', () => {
      wrapper = mount(Sidebar, {
        localVue,
        vuetify,
        stubs: {
          'router-link': RouterLinkStub
        },
        mocks: {
          $route: { path: '/admin' }
        },
        propsData: {
          isOpen: true,
          isUserLogged: true
        }
      })

      expect(wrapper.vm.routerItems).toEqual(adminItems)
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
