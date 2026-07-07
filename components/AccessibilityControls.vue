<template>
  <div class="accessibility-floating" role="region" aria-label="Controles de acessibilidade">
    <div class="font-control" aria-label="Controle de tamanho da fonte">
      <button
        type="button"
        class="accessibility-button"
        aria-label="Diminuir fonte"
        @click="$emit('decrease-font')"
      >
        A-
      </button>

      <button
        type="button"
        class="accessibility-button"
        aria-label="Restaurar fonte"
        @click="$emit('reset-font')"
      >
        A
      </button>

      <button
        type="button"
        class="accessibility-button"
        aria-label="Aumentar fonte"
        @click="$emit('increase-font')"
      >
        A+
      </button>
    </div>

    <button
      type="button"
      class="contrast-button"
      :class="{ active: highContrast }"
      aria-label="Ativar ou desativar alto contraste"
      @click="$emit('toggle-contrast')"
    >
      Alto contraste
    </button>
  </div>
</template>

<script>
export default {
  name: 'AccessibilityControls',

  props: {
    highContrast: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.accessibility-floating {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  width: 100%;
  margin-bottom: 20px;

  overflow-x: auto;
  white-space: nowrap;
}

.font-control {
  display: inline-flex !important;
  flex-direction: row !important;
  align-items: center;
  flex-wrap: nowrap;

  border: 1px solid #cfcfcf;
  border-radius: 999px;
  overflow: hidden;
  background: #ffffff;
}

.accessibility-button,
.contrast-button {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;

  width: auto !important;
  min-width: auto !important;
  max-width: none !important;

  height: 36px;
  padding: 0 12px;

  border: none;
  background: #ffffff;
  color: #333333;

  font-size: 14px;
  font-weight: 600;
  line-height: 1;

  cursor: pointer;
  white-space: nowrap;
}

.accessibility-button + .accessibility-button {
  border-left: 1px solid #cfcfcf;
}

.contrast-button {
  border: 1px solid #cfcfcf;
  border-radius: 999px;
}

.accessibility-button:hover,
.contrast-button:hover {
  background: #eeeeee;
}

.contrast-button.active {
  background: #222222;
  color: #ffffff;
  border-color: #222222;
}

@media (max-width: 600px) {
  .accessibility-floating {
    justify-content: flex-start;
  }
}
</style>