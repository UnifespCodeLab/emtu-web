<template>
  <div class="users-table">
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        />
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        :items-per-page="5"
        :sort-by="['id']"
        :sort-desc="[false]"
        loading-text="Carregando usuários..."
        no-data-text="Nenhum usuário encontrado"
        class="elevation-1"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            color="primary"
            @click="editUser(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de Edição -->
    <v-dialog v-model="dialogEdit" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Editar Usuário</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.name"
                  label="Nome completo"
                  :error-messages="errors.name"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.email"
                  label="E-mail"
                  :error-messages="errors.email"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.password"
                  label="Nova Senha (opcional)"
                  type="password"
                  hint="Deixe em branco para manter a senha atual"
                  persistent-hint
                  :error-messages="errors.password"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedUser.passwordConfirmation"
                  label="Confirmar nova senha"
                  type="password"
                  hint="Confirme a nova senha"
                  persistent-hint
                  :error-messages="errors.passwordConfirmation"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" text @click="closeEdit">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="saveUser">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axiosClient from '~/assets/services/emtu-api'

export default {
  name: 'UsersTable',
  data () {
    return {
      search: '',
      loading: false,
      dialogEdit: false,
      users: [],
      editedUser: {
        id: null,
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      defaultUser: {
        id: null,
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      errors: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      headers: [
        { text: 'ID', value: 'id', align: 'start' },
        { text: 'Nome', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Ações', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  mounted () {
    this.fetchUsers()
  },
  methods: {
    ...mapActions('alert', ['showAlert']),

    async fetchUsers () {
      this.loading = true
      try {
        const response = await axiosClient.get('/user/admins')
        this.users = response.data
      } catch (error) {
        this.showAlert({
          alertMessage: 'Erro ao carregar usuários. Tente novamente mais tarde',
          alertType: 'error'
        })
      } finally {
        this.loading = false
      }
    },

    editUser (user) {
      this.editedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirmation: ''
      }
      this.errors = { name: '', email: '', password: '', passwordConfirmation: '' }
      this.dialogEdit = true
    },

    validateEditForm () {
      this.errors = { name: '', email: '', password: '', passwordConfirmation: '' }
      let valid = true

      if (!this.editedUser.name) {
        this.errors.name = 'Nome é obrigatório'
        valid = false
      }

      if (!this.editedUser.email) {
        this.errors.email = 'E-mail é obrigatório'
        valid = false
      } else if (!/\S+@\S+\.\S+/.test(this.editedUser.email)) {
        this.errors.email = 'E-mail inválido'
        valid = false
      }

      if (this.editedUser.password || this.editedUser.passwordConfirmation) {
        if (!this.editedUser.password) {
          this.errors.password = 'Senha é obrigatória'
          valid = false
        } else if (this.editedUser.password.length < 6) {
          this.errors.password = 'Senha deve ter no mínimo 6 caracteres'
          valid = false
        }

        if (this.editedUser.password !== this.editedUser.passwordConfirmation) {
          this.errors.passwordConfirmation = 'As senhas não são iguais'
          valid = false
        }
      }

      return valid
    },

    async saveUser () {
      if (!this.validateEditForm()) {
        return
      }

      try {
        const payload = {
          name: this.editedUser.name,
          email: this.editedUser.email
        }

        if (this.editedUser.password) {
          payload.password = this.editedUser.password
        }

        await axiosClient.put(`/user/admins/${this.editedUser.id}`, payload)

        this.showAlert({
          alertMessage: 'Usuário atualizado com sucesso!',
          alertType: 'success'
        })

        this.closeEdit()
        this.fetchUsers()
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.showAlert({
            alertMessage: 'Este e-mail já está em uso.',
            alertType: 'warning'
          })
        } else {
          this.showAlert({
            alertMessage: 'Erro ao atualizar usuário. Tente novamente mais tarde.',
            alertType: 'error'
          })
        }
      }
    },

    closeEdit () {
      this.dialogEdit = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.errors = { name: '', email: '', password: '', passwordConfirmation: '' }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.users-table {
  width: 100%;
}
</style>
