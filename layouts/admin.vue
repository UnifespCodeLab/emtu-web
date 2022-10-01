<template>
  <v-app>
    <div class="admin-layout">
      <TheHeader />
      <div class="admin-layout__content">
        <Nuxt />
      </div>
    </div>
  </v-app>
</template>

<script>
import TheHeader from '~/components/TheHeader.vue'

export default {
  name: 'AdminLayout',
  components: {
    TheHeader
  }
}
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-layout__content {
  flex: 1;
  background-color: #e5e5e5;
}
</style>
