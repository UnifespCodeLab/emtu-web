<template>
  <div class="admin-page">
    <div class="admin-page__form">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from './forms/login.vue'

export default {
  name: 'AdminPage',
  components: { LoginForm },
  layout: 'login',
  data () {
    return {
      showLogin: true
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
