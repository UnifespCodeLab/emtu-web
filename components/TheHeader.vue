<template>
  <v-card flat height="124px" tile>
    <v-toolbar height="40px" flat color="#fcd307" class="d-flex align-center justify-center" @click="dialog = true" style="cursor: pointer;">
      <v-icon
        id="alert-icon"
      >
        mdi-alert-box
      </v-icon>
      <v-toolbar-title class="ml-4 text-button font-weight-bold">
        Versão de testes
      </v-toolbar-title>
    </v-toolbar>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card style="border-radius: 12px; padding: 8px;">
        <v-card-title class="text-h6 font-weight-bold pb-2" style="color: black">
          Versão de Testes
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2 text-body-1" style="color: black;">
          Bem-vindo(a) ao VApt! Esta plataforma encontra-se atualmente em <u>versão de testes</u>.
          Isso significa que as informações e dados apresentados podem estar desatualizados ou incorretos.<br><br>
          <strong>Aviso sobre privacidade:</strong> A única coleta de dados que nossa plataforma realiza ocorre exclusivamente quando você efetua uma busca de rota em nosso simulador, ou envia uma nova solicitação de rota.
        </v-card-text>
      </v-card>
    </v-dialog>

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
  data () {
    return {
      dialog: false
    }
  },
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
