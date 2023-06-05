<template>
  <v-alert
    class="global-alert"
    dismissible
    transition="scale-transition"
    :type="alertType"
    :value="isVisible"
  >
    {{ alertMessage }}
  </v-alert>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'GlobalAlert',
  computed: {
    ...mapState('alert', ['isVisible', 'alertMessage', 'alertType'])
  },

  watch: {
    isVisible (currentValue) {
      if (currentValue === true) {
        setTimeout(() => this.hideAlert(), 5000)
      }
    }
  },
  methods: {
    ...mapActions('alert', ['hideAlert'])
  }
}
</script>

<style lang="scss" scoped>
.global-alert {
  position: absolute;
  right: 0;
}
</style>
