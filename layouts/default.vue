<template>
  <v-app>
    <div class="default-layout">
      <TheHeader />
      <div class="default-layout__content">
        <Nuxt></Nuxt>
      </div>
      <footer>!!! Footer goes here !!!</footer>
    </div>
  </v-app>
</template>

<script>
import TheHeader from '~/components/TheHeader.vue'

export default {
  name: 'DefaultLayout',
  components: {
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
  background-color: #E5E5E5;
}
</style>
