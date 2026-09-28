import { loadPreferences, applyFontScale, applyContrast } from '~/assets/js/accessibility'

export default () => {
  const { fontScale, contrastEnabled } = loadPreferences()

  applyFontScale(fontScale)
  applyContrast(contrastEnabled)
}
