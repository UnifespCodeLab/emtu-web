export const FONT_SCALE_KEY = 'fontScale'
export const CONTRAST_KEY = 'contrastEnabled'

export const MIN_FONT_SCALE = 0.8
export const MAX_FONT_SCALE = 2
export const FONT_SCALE_STEP = 0.1

const BASE_FONT_SIZE = 16

export function roundScale (scale) {
  return Math.round(scale * 10) / 10
}

export function loadPreferences () {
  const savedScale = Number(localStorage.getItem(FONT_SCALE_KEY))

  return {
    fontScale: savedScale ? roundScale(savedScale) : 1,
    contrastEnabled: localStorage.getItem(CONTRAST_KEY) === 'true'
  }
}

export function applyFontScale (scale) {
  const html = document.documentElement

  if (scale === 1) {
    html.style.removeProperty('--app-font-size')
    html.classList.remove('font-scaled')
    localStorage.removeItem(FONT_SCALE_KEY)
    return
  }

  html.style.setProperty('--app-font-size', `${BASE_FONT_SIZE * scale}px`)
  html.classList.add('font-scaled')
  localStorage.setItem(FONT_SCALE_KEY, scale)
}

export function applyContrast (enabled) {
  document.body.classList.toggle('high-contrast', enabled)

  if (enabled) {
    localStorage.setItem(CONTRAST_KEY, 'true')
  } else {
    localStorage.removeItem(CONTRAST_KEY)
  }
}
