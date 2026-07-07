const STORAGE_KEYS = {
  fontScale: 'accessibilityFontScale',
  highContrast: 'accessibilityHighContrast'
}

export default {
  data () {
    return {
      fontScale: 1,
      highContrast: false
    }
  },

  computed: {
    accessibilityStyles () {
      return {
        '--font-scale': this.fontScale
      }
    },

    accessibilityClasses () {
      return {
        'accessibility-scope': true,
        'high-contrast': this.highContrast
      }
    }
  },

  mounted () {
    this.loadAccessibilitySettings()
  },

  beforeDestroy () {
    this.removeDocumentAccessibilitySettings()
  },

  methods: {
    loadAccessibilitySettings () {
      if (!process.client) {
        return
      }

      const savedFontScale =
        localStorage.getItem(STORAGE_KEYS.fontScale) ||
        localStorage.getItem('searchPageFontScale')

      const savedHighContrast =
        localStorage.getItem(STORAGE_KEYS.highContrast) ||
        localStorage.getItem('searchPageHighContrast')

      if (savedFontScale) {
        const parsedFontScale = Number(savedFontScale)

        if (!Number.isNaN(parsedFontScale)) {
          this.fontScale = parsedFontScale
        }
      }

      if (savedHighContrast) {
        this.highContrast = savedHighContrast === 'true'
      }

      this.applyDocumentAccessibilitySettings()
    },

    increaseFontSize () {
      this.setFontScale(this.fontScale + 0.1)
    },

    decreaseFontSize () {
      this.setFontScale(this.fontScale - 0.1)
    },

    resetFontSize () {
      this.setFontScale(1)
    },

    setFontScale (value) {
      const nextValue = Math.min(1.5, Math.max(0.85, Number(value.toFixed(2))))
      this.fontScale = nextValue
      this.saveAccessibilitySettings()
    },

    toggleHighContrast () {
      this.highContrast = !this.highContrast
      this.saveAccessibilitySettings()
    },

    saveAccessibilitySettings () {
      if (!process.client) {
        return
      }

      localStorage.setItem(STORAGE_KEYS.fontScale, String(this.fontScale))
      localStorage.setItem(STORAGE_KEYS.highContrast, String(this.highContrast))
      this.applyDocumentAccessibilitySettings()
    },

    applyDocumentAccessibilitySettings () {
      if (!process.client) {
        return
      }

      document.documentElement.style.setProperty('--font-scale', String(this.fontScale))
      document.documentElement.classList.toggle('app-high-contrast', this.highContrast)
    },

    removeDocumentAccessibilitySettings () {
      if (!process.client) {
        return
      }

      document.documentElement.classList.remove('app-high-contrast')
    }
  }
}
