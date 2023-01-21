<template>
  <v-card flat height="50px" tile>
    <v-toolbar dense>
      <v-icon color="primary">
        mdi-bus
      </v-icon>
      <v-toolbar-title class="ml-4">
        {{ routeTitle }}
      </v-toolbar-title>

      <v-spacer />
      <v-app-bar-nav-icon color="primary" @click="$emit('toggleSideBar')" />
    </v-toolbar>
  </v-card>
</template>

<script>
import adminItems from '~/assets/js/adminItems'

export default {
  name: 'TheHeader',
  computed: {
    routeTitle () {
      const currentItem = adminItems.find(item => item.route === this.$route.path)

      return currentItem.title
    }
  }
}
</script>
