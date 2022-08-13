<template>
  <v-card flat height="50px" tile>
    <v-toolbar color="primary" dense>
      <v-icon color="white">mdi-bus</v-icon>
      <v-toolbar-title class="ml-4">EMTU</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  name: 'TheHeader',
}
</script>
<style lang="scss">
.the-header__container {
  height: 50px;
}
</style>
