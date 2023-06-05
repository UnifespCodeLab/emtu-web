<template>
  <v-app>
    <div class="login-layout">
      <v-card rounded class="login-layout__content">
        <GlobalAlert />
        <Nuxt />
      </v-card>
    </div>
  </v-app>
</template>

<script>
import GlobalAlert from '~/components/GlobalAlert.vue'

export default {
  name: 'LoginLayout',
  components: {
    GlobalAlert
  }
}
</script>

<style lang="scss" scoped>
.login-layout {
  background-color: #1976D2;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-layout__content {
  height: -webkit-fill-available;
  margin: auto;
  width: -webkit-fill-available;

  @media (min-width: 800px) {
    height: auto;
    width: 1100px;
  }
}
</style>
