<template>
  <v-app>
    <div class="default-layout">
      <TheHeader />
      <div class="default-layout__content">
        <Nuxt></Nuxt>
      </div>
      <TheFooter class="default-layout__footer"/>
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
  background-color: #E5E5E5;
}

.default-layout__footer {
  margin-top: 16px;
}
</style>
