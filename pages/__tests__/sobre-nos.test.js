// import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
// import Vuetify from 'vuetify'
// import Vuex from 'vuex'
// import AboutUsPage from '~/pages/sobre-nos'

// const localVue = createLocalVue()
// localVue.use(Vuex)

// describe('Pages / AboutUsPage', () => {
//   let vuetify
//   let wrapper

//   beforeEach(() => {
//     vuetify = new Vuetify()

//     wrapper = mount(AboutUsPage, {
//       localVue,
//       vuetify,
//       stubs: {
//         'router-link': RouterLinkStub
//       }
//     })
//   })

//   it('matches the snapshot', () => {
//     expect(wrapper.element).toMatchSnapshot()
//   })

//   it('has a logo', () => {
//     const logo = wrapper.findComponent({ name: 'v-icon' }, { ref: 'mdi-bus' })
//     expect(logo.exists()).toBe(true)
//   })

//   it('has correct link', () => {
//     const link = wrapper.find('a[href="https://www.codelab-unifesp.org/"]')
//     expect(link.exists()).toBe(true)
//     expect(link.attributes('target')).toBe('_blank')
//   })
// })
