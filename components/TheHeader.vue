<template>
  <v-card flat height="50px" tile>
    <v-toolbar color="primary" dense dark>
      <v-icon>mdi-bus</v-icon>
      <v-toolbar-title class="ml-4">
        EMTU
      </v-toolbar-title>

      <v-spacer />
      <v-app-bar-nav-icon @click="$emit('toggleSideBar')" />
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  name: 'TheHeader'
}
</script>
