// import { mount, createLocalVue } from '@vue/test-utils'
// import Vuetify from 'vuetify'

// import TheHeader from '~/components/TheHeader.vue'

// describe('Components / TheHeader', () => {
//   const localVue = createLocalVue()
//   let vuetify
//   let wrapper

//   beforeEach(() => {
//     vuetify = new Vuetify()

//     wrapper = mount(TheHeader, {
//       localVue,
//       vuetify,
//       mocks: {
//         $route: { }
//       }
//     })
//   })

//   it('matches the screenshot', () => {
//     expect(wrapper.element).toMatchSnapshot()
//   })

//   it('should render title correctly', () => {
//     const title = wrapper.findComponent({ name: 'v-toolbar-title' })
//     expect(title.text()).toBe('VApt')
//   })

//   it('should render bus icon correctly', () => {
//     const logo = wrapper.find('#bus-icon')
//     expect(logo.exists()).toBe(true)
//   })

//   it('should render menu icon in the toolbar', () => {
//     const menu = wrapper.find('#menu-icon')
//     expect(menu.exists()).toBe(true)
//   })

//   it('should toggle SideBar event when menu-icon is clicked', async () => {
//     const menu = wrapper.find('#menu-icon')
//     await menu.trigger('click')
//     expect(wrapper.emitted().toggleSideBar).toBeTruthy()
//   })
// })
