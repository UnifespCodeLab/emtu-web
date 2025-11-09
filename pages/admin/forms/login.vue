<template>
  <div class="auth-form">
    <v-icon class="mb-6" color="primary" x-large>mdi-bus</v-icon>
    <div class="text-center text-h6 mb-7">Login usuário Administrador</div>

    <v-text-field v-model="email" label="E-mail" solo />
    <v-text-field v-model="password" label="Senha" type="password" solo />
    <div class="text-left text-caption color-gray mb-3">Esqueceu sua senha?</div>

    <v-btn block color="primary" elevation="2" large @click="userLogin">
      Entrar
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginForm',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  destroyed () {
    this.hideAlert()
  },
  methods: {
    ...mapActions('alert', ['showAlert', 'hideAlert']),
    async userLogin () {
      this.hideAlert()

      if (!this.email || !this.password) {
        this.showAlert({ alertMessage: 'Preencha todos os campos.', alertType: 'error' })
        return
      }

      try {
        const logged = await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        if (logged) {
          this.$auth.setUser({ email: this.email })
          this.$router.push('/admin/home')
        }
      } catch (err) {
        this.showAlert({
          alertMessage: 'Não foi possível realizar o Login, tente novamente mais tarde.',
          alertType: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.link {
  color: #1976d2;
  cursor: pointer;
}
</style>
