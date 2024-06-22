<template>
  <v-card flat height="50px" tile>
    <v-toolbar color="primary" dense dark>
      <v-icon id="bus-icon" @click="redirectToHomePage" aria-label="Volte para a página inicial">mdi-bus</v-icon>
      <v-toolbar-title class="ml-4">
        EMTU
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon id="menu-icon" @click="$emit('toggleSideBar')"  aria-label="Abrir menu de navegação"/>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  methods: {
    redirectToHomePage () {
      this.$router.push('/')
    }
  },
  name: 'TheHeader'
}
</script>
