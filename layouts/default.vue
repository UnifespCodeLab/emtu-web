<template>
  <v-app>
    <div class="default-layout">
      <TheHeader />
      <div class="default-layout__content">
        <Nuxt />
      </div>
      <TheFooter />
    </div>
  </v-app>
</template>

<script>
import TheHeader from '~/components/TheHeader.vue'
import TheFooter from '~/components/TheFooter.vue'

export default {
  name: 'DefaultLayout',
  components: {
    TheFooter,
    TheHeader,
  },
}
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.default-layout__content {
  flex: 1;
  background-color: #e5e5e5;
}
</style>
