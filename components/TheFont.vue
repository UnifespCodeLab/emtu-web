<template>
  <div class="accessibility-controls">
    <v-btn
      icon
      small
      aria-label="Aumentar fonte"
      :disabled="fontScale >= maxFontScale"
      @click="increaseFont"
    >
      <v-icon>mdi-format-font-size-increase</v-icon>
    </v-btn>

    <v-btn
      icon
      small
      aria-label="Diminuir fonte"
      :disabled="fontScale <= minFontScale"
      @click="decreaseFont"
    >
      <v-icon>mdi-format-font-size-decrease</v-icon>
    </v-btn>

    <v-btn
      icon
      small
      aria-label="Alto contraste"
      :aria-pressed="String(contrastEnabled)"
      @click="toggleContrast"
    >
      <v-icon>mdi-contrast-circle</v-icon>
    </v-btn>

    <v-btn icon small aria-label="Resetar acessibilidade" @click="resetAccessibility">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script>
import {
  MIN_FONT_SCALE,
  MAX_FONT_SCALE,
  FONT_SCALE_STEP,
  roundScale,
  loadPreferences,
  applyFontScale,
  applyContrast
} from '~/assets/js/accessibility'

export default {
  name: 'TheFont',

  data () {
    return {
      fontScale: 1,
      contrastEnabled: false,
      minFontScale: MIN_FONT_SCALE,
      maxFontScale: MAX_FONT_SCALE
    }
  },

  mounted () {
    const { fontScale, contrastEnabled } = loadPreferences()

    this.fontScale = fontScale
    this.contrastEnabled = contrastEnabled
  },

  methods: {
    increaseFont () {
      this.setFontScale(this.fontScale + FONT_SCALE_STEP)
    },

    decreaseFont () {
      this.setFontScale(this.fontScale - FONT_SCALE_STEP)
    },

    setFontScale (scale) {
      const rounded = roundScale(scale)

      if (rounded < MIN_FONT_SCALE || rounded > MAX_FONT_SCALE) {
        return
      }

      this.fontScale = rounded
      applyFontScale(rounded)
    },

    toggleContrast () {
      this.contrastEnabled = !this.contrastEnabled
      applyContrast(this.contrastEnabled)
    },

    resetAccessibility () {
      this.fontScale = 1
      this.contrastEnabled = false

      applyFontScale(1)
      applyContrast(false)
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
