<template>
  <div class="auth-form">
    <v-icon class="mb-6" color="primary" x-large>
      mdi-account-plus
    </v-icon>

    <div class="text-center text-h6 mb-7">
      Cadastro de Usuário Administrador
    </div>

    <v-text-field
      v-model="name"
      label="Nome completo"
      solo
      :error-messages="errors.name"
    />

    <v-text-field
      v-model="email"
      label="E-mail"
      solo
      :error-messages="errors.email"
    />

    <v-text-field
      v-model="password"
      label="Senha"
      type="password"
      solo
      :error-messages="errors.password"
    />

    <v-text-field
      v-model="passwordConfirmation"
      label="Confirmar senha"
      type="password"
      solo
      :error-messages="errors.passwordConfirmation"
    />

    <v-btn
      class="mt-4"
      block
      color="primary"
      elevation="2"
      large
      :loading="isSubmitting"
      :disabled="isSubmitting"
      @click="registerUser"
    >
      Cadastrar
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axiosClient from '~/assets/services/emtu-api'

export default {
  name: 'RegisterForm',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      isSubmitting: false,
      errors: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      }
    }
  },
  methods: {
    ...mapActions('alert', ['showAlert', 'hideAlert']),

    validateForm () {
      this.errors = { name: '', email: '', password: '', passwordConfirmation: '' }
      let valid = true

      if (!this.name) {
        this.errors.name = 'Nome é obrigatório'
        valid = false
      }

      if (!this.email) {
        this.errors.email = 'E-mail é obrigatório'
        valid = false
      } else if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.errors.email = 'E-mail inválido'
        valid = false
      }

      if (!this.password) {
        this.errors.password = 'Senha é obrigatória'
        valid = false
      } else if (this.password.length < 6) {
        this.errors.password = 'Senha deve ter no mínimo 6 caracteres'
        valid = false
      }

      if (this.password !== this.passwordConfirmation) {
        this.errors.passwordConfirmation = 'As senhas não são iguais'
        valid = false
      }

      return valid
    },

    async registerUser () {
      this.hideAlert()
      if (!this.validateForm()) { return }

      this.isSubmitting = true

      await axiosClient.post('/user/register', {
        name: this.name,
        email: this.email,
        password: this.password
      }).then((response) => {
        this.showAlert({
          alertMessage: 'Cadastro realizado com sucesso!',
          alertType: 'success'
        })

        this.$emit('go-users-table')
      }).catch((err) => {
        if (err.response && err.response.status === 409) {
          this.showAlert({
            alertMessage: 'Este e-mail já está cadastrado.',
            alertType: 'warning'
          })
        } else {
          this.showAlert({
            alertMessage: 'Erro ao cadastrar usuário. Tente novamente mais tarde.',
            alertType: 'error'
          })
        }
      })

      this.isSubmitting = false
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
