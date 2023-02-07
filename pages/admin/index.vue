<template>
  <div class="admin-page">
    <v-alert
      class="admin-page__alert"
      dismissible
      transition="scale-transition"
      type="error"
      :value="error"
    >
      Não foi possível realizar o Login, tente novamente mais tarde.
    </v-alert>

    <div class="admin-page__form">
      <v-icon class="mb-6" color="primary" x-large>
        mdi-bus
      </v-icon>

      <div class="admin-page__text text-center text-h6 mb-7" v-text="'Login usuário Administrador'" />

      <v-text-field v-model="email" label="E-mail" solo />
      <v-text-field v-model="password" label="Senha" type="password" solo />

      <v-btn
        class="mb-6"
        block
        color="primary"
        elevation="2"
        large
        @click="userLogin"
      >
        enviar
      </v-btn>

      <div class="admin-page__text text-center text-caption color-gray" v-text="'Esqueceu sua senha?'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  layout: 'login',
  data () {
    return {
      error: false,
      email: null,
      password: null
    }
  },
  methods: {
    async userLogin () {
      try {
        const logged = await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        if (logged) {
          this.$auth.setUser({
            email: this.email
          })
          this.$router.push('/admin/solicitacoes')
        }
      } catch (err) {
        this.error = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 800px) {
    align-items: center;
  }
}

.admin-page__alert {
  position: absolute;
  width: -webkit-fill-available;
  z-index: 1;

  @media (min-width: 800px) {
    width: 500px;
  }
}

.admin-page__form {
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 60px 0;
  width: 85%;

  @media (min-width: 800px) {
    width: 600px;
  }
}

.admin-page__text {
  z-index: 1;
}
</style>
