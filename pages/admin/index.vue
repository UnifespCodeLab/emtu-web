<template>
  <div class="admin-page">
    <div class="admin-page__form">
      <LoginForm v-if="showLogin" @go-register="toggleForm(false)" />
      <RegisterForm v-else @go-login="toggleForm(true)" />
    </div>
  </div>
</template>

<script>
import LoginForm from './forms/login.vue'
import RegisterForm from './forms/cadastro.vue'

export default {
  name: 'AdminPage',
  components: { LoginForm, RegisterForm },
  layout: 'login',
  data () {
    return {
      showLogin: true
    }
  },
  methods: {
    toggleForm (isLogin) {
      this.showLogin = isLogin
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
</style>
