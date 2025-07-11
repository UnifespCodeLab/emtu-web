<template>
  <v-card flat height="124px" tile>
    <v-toolbar height="40px" flat color="#fcd307" class="d-flex align-center justify-center">
      <v-icon
        id="alert-icon"
      >
        mdi-alert-box
      </v-icon>
      <v-toolbar-title class="ml-4">
        Versão de testes
      </v-toolbar-title>
    </v-toolbar>
    <v-toolbar height="84px" flat color="#f0f0f0">
      <v-icon id="bus-icon" aria-label="Volte para a página inicial" @click="redirectToHomePage">
        mdi-bus
      </v-icon>
      <v-toolbar-title class="ml-4 navbar-title" @click="redirectToHomePage">
        VApt
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon id="menu-icon" aria-label="Abrir menu de navegação" @click="$emit('toggleSideBar')" />
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  name: 'TheHeader',
  methods: {
    redirectToHomePage () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
#bus-icon{
  color: #017BFD;
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
