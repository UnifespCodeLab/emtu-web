import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

import TheFont from '~/components/TheFont.vue'

describe('Components / TheFont', () => {
  const localVue = createLocalVue()
  let vuetify
  let wrapper

  const html = document.documentElement
  const button = label => wrapper.find(`[aria-label="${label}"]`)

  beforeEach(() => {
    localStorage.clear()
    html.classList.remove('font-scaled')
    html.style.removeProperty('--app-font-size')
    document.body.classList.remove('high-contrast')

    vuetify = new Vuetify()
  })

  const mountComponent = () => {
    wrapper = mount(TheFont, { localVue, vuetify })
  }

  it('should increase font scale and persist it', async () => {
    mountComponent()

    await button('Aumentar fonte').trigger('click')

    expect(wrapper.vm.fontScale).toBe(1.1)
    expect(html.classList.contains('font-scaled')).toBe(true)
    expect(html.style.getPropertyValue('--app-font-size')).toBe('17.6px')
    expect(localStorage.getItem('fontScale')).toBe('1.1')
  })

  it('should not go above the maximum font scale', async () => {
    localStorage.setItem('fontScale', '2')
    mountComponent()

    await button('Aumentar fonte').trigger('click')

    expect(wrapper.vm.fontScale).toBe(2)
    expect(button('Aumentar fonte').attributes('disabled')).toBeDefined()
  })

  it('should not go below the minimum font scale', async () => {
    mountComponent()

    await button('Diminuir fonte').trigger('click')
    await button('Diminuir fonte').trigger('click')
    await button('Diminuir fonte').trigger('click')

    expect(wrapper.vm.fontScale).toBe(0.8)
    expect(button('Diminuir fonte').attributes('disabled')).toBeDefined()
  })

  it('should remove font scaling when scale returns to 1', async () => {
    mountComponent()

    await button('Aumentar fonte').trigger('click')
    await button('Diminuir fonte').trigger('click')

    expect(html.classList.contains('font-scaled')).toBe(false)
    expect(localStorage.getItem('fontScale')).toBeNull()
  })

  it('should toggle high contrast and persist it', async () => {
    mountComponent()

    await button('Alto contraste').trigger('click')

    expect(document.body.classList.contains('high-contrast')).toBe(true)
    expect(button('Alto contraste').attributes('aria-pressed')).toBe('true')
    expect(localStorage.getItem('contrastEnabled')).toBe('true')
  })

  it('should reset font scale and high contrast', async () => {
    mountComponent()

    await button('Aumentar fonte').trigger('click')
    await button('Alto contraste').trigger('click')
    await button('Resetar acessibilidade').trigger('click')

    expect(wrapper.vm.fontScale).toBe(1)
    expect(wrapper.vm.contrastEnabled).toBe(false)
    expect(html.classList.contains('font-scaled')).toBe(false)
    expect(document.body.classList.contains('high-contrast')).toBe(false)
    expect(localStorage.getItem('fontScale')).toBeNull()
    expect(localStorage.getItem('contrastEnabled')).toBeNull()
  })

  it('should enable high contrast with a single click after reset', async () => {
    mountComponent()

    await button('Alto contraste').trigger('click')
    await button('Resetar acessibilidade').trigger('click')
    await button('Alto contraste').trigger('click')

    expect(document.body.classList.contains('high-contrast')).toBe(true)
  })
})
