<template>
  <div class="users">
    <div class="users__content">
      <div class="users__header">
        <h2>Gerenciamento de Usuários</h2>
        <v-btn
          v-if="!showRegister"
          color="primary"
          large
          @click="toggleForm()"
        >
          NOVO USUÁRIO
        </v-btn>
        <v-btn
          v-else
          color="secondary"
          large
          @click="toggleForm()"
        >
          VER USUÁRIOS
        </v-btn>
      </div>

      <RegisterForm
        v-if="showRegister"
        @go-users-table="toggleForm()"
      />

      <UsersTable
        v-else
      />
    </div>
  </div>
</template>

<script>
import UsersTable from '../../components/admin/UsersTable.vue'
import RegisterForm from './forms/cadastro.vue'

export default {
  name: 'AdminUsers',
  components: {
    RegisterForm,
    UsersTable
  },
  layout: 'admin',
  data () {
    return {
      showRegister: false
    }
  },
  methods: {
    toggleForm () {
      this.showRegister = !this.showRegister
    }
  }
}
</script>

<style scoped lang="scss">
.users {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 4px;

  @media (min-width: 1000px) {
    padding: 0 20px
  }
}

.users__content {
  display: flex;
  flex-direction: column;
  margin-top: 28px;
  width: 100%;

  @media (min-width: 800px) {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
  }
}

.users__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;

  h2 {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }
}
</style>
