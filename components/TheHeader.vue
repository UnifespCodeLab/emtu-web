<template>
<v-card flat height="84px" tile>
    <v-toolbar height="84px" flat color="#f0f0f0">
      <v-icon id="bus-icon" @click="redirectToHomePage" aria-label="Volte para a página inicial">mdi-bus</v-icon>
      <v-toolbar-title @click="redirectToHomePage" class="ml-4 navbar-title">
        VApt
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

<style scoped>
#bus-icon{
  color: #0099F0;
}
.navbar-title{
  font-family: "Lexend", "Roboto", sans-serif;
  font-size: 1.75rem;
  color: #1D1D1F;
  font-weight: bold;
  cursor: pointer;
}
#menu-icon{
  color: #1D1D1F;
}
</style>
