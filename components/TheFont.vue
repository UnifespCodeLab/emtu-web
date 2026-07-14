<template>
  <div class="accessibility-controls">
    <v-btn icon small aria-label="Aumentar fonte" @click="increaseFont">
      <v-icon>mdi-format-font-size-increase</v-icon>
    </v-btn>

    <v-btn icon small aria-label="Diminuir fonte" @click="decreaseFont">
      <v-icon>mdi-format-font-size-decrease</v-icon>
    </v-btn>

    <v-btn icon small aria-label="Ativar alto contraste" @click="toggleContrast">
      <v-icon>mdi-contrast-circle</v-icon>
    </v-btn>

    <v-btn icon small aria-label="Resetar acessibilidade" @click="resetAccessibility">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script>

export default {
  name: 'TheFont',

  data () {
    return {
      fontScale: 1,
      contrastEnabled: false
    }
  },

  mounted () {
    const savedScale = localStorage.getItem('fontScale')
    const savedContrast = localStorage.getItem('contrastEnabled')

    if (savedScale) {
      this.fontScale = Number(savedScale)
      this.applyFontScale()
    }

    if (savedContrast === 'true') {
      this.contrastEnabled = true
      document.body.classList.add('high-contrast')
    }
  },

  methods: {
    increaseFont () {
      if (this.fontScale < 2) {
        this.fontScale += 0.1
        this.applyFontScale()
      }
    },

    decreaseFont () {
      if (this.fontScale > 0.8) {
        this.fontScale -= 0.1
        this.applyFontScale()
      }
    },

    applyFontScale () {
      const size = `${16 * this.fontScale}px`

      document.documentElement.style.setProperty(
        '--app-font-size',
        size
      )

      document.documentElement.classList.add('font-scaled')

      localStorage.setItem('fontScale', this.fontScale)
    },

    toggleContrast () {
      this.contrastEnabled = !this.contrastEnabled

      document.body.classList.toggle(
        'high-contrast',
        this.contrastEnabled
      )

      localStorage.setItem(
        'contrastEnabled',
        this.contrastEnabled
      )
    },

    resetAccessibility () {
      this.fontScale = 1
      this.highContrast = false

      document.documentElement.style.removeProperty(
        '--app-font-size'
      )

      document.documentElement.classList.remove(
        'font-scaled'
      )

      document.body.classList.remove('high-contrast')

      localStorage.removeItem('fontScale')
      localStorage.removeItem('highContrast')
    }
  }
}
</script>

<style scoped>
.accessibility-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

<style lang="scss">

html.font-scaled {
  font-size: var(--app-font-size);
}

html.font-scaled body,
html.font-scaled .v-application,
html.font-scaled .v-application p,
html.font-scaled .v-application span,
html.font-scaled .v-application div,
html.font-scaled .v-application label,
html.font-scaled .v-application button,
html.font-scaled .v-application a,
html.font-scaled .v-application li {
  font-size: 1em !important;
}

html.font-scaled .v-label,
html.font-scaled .v-input input,
html.font-scaled .v-input textarea,
html.font-scaled .v-select__selection,
html.font-scaled .v-input__slot {
  font-size: 1em !important;
}

html.font-scaled .v-input input::placeholder,
html.font-scaled .v-input textarea::placeholder,
html.font-scaled input::placeholder,
html.font-scaled textarea::placeholder {
  font-size: 1em !important;
}

.high-contrast,
.high-contrast body,
.high-contrast .v-application,
.high-contrast .main-container,
.high-contrast .v-picker__title.primary,
.high-contrast .primary--text {
  background: #000 !important;
  color: #fff !important;
}

.high-contrast .home,
.high-contrast .v-card,
.high-contrast .v-footer,
.high-contrast .search-page,
.high-contrast .default-layout__content,
.high-contrast .v-sheet,
.high-contrast .v-toolbar,
.high-contrast .v-navigation-drawer,
.high-contrast .v-list,
.high-contrast .v-menu__content,
.theme--light.v-picker__body,
.high-contrast .theme--light.v-sheet,
.high-contrast .theme--light.v-card,
.v-data-table__wrapper,
.v-data-table-header tr,
.v-data-table-header tr th,
.v-data-footer
{
  background: #000 !important;
  color: #fff !important;
}

.v-data-table-header tr:hover,
.v-data-table-header tr th:hover,
tbody tr:hover,
tbody tr th:hover
{
  background: #222 !important;
}

.high-contrast .theme--light.v-time-picker-clock {
  background: #111 !important
}

.high-contrast .theme--light.v-label{
  background: #111 !important;
  z-index: 1;
}

.high-contrast *,
.high-contrast .v-icon {
  color: #fff !important;
  border-color: #fff !important;
}

.high-contrast a {
  color: #00ffff !important;
}

.high-contrast input,
.high-contrast textarea,
.high-contrast select,
.high-contrast .v-input__slot,
.button
{
  background: #111 !important;
  color: #fff !important;
}

.high-contrast input::placeholder,
.high-contrast textarea::placeholder {
  color: #ccc !important;
}

</style>
