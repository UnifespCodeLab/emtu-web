<template>
  <div class="search-page">
    <div class="search-page__form">
      <span class="header-text">Para onde você quer ir?</span>
      <v-autocomplete
        v-model="searchBody.originCityId"
        :items="cities"
        label="Origem"
        prepend-inner-icon="mdi-map-marker"
        solo
      />
      <v-autocomplete
        v-model="searchBody.destinationCityId"
        :items="cities"
        label="Destino"
        prepend-inner-icon="mdi-map-marker-radius"
        solo
      />
      <div class="search-page__time-container">
        <v-dialog
          ref="dialogTime"
          v-model="modalTime"
          :return-value.sync="searchBody.hora"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="searchBody.hora"
              label="Horário"
              prepend-inner-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              solo
              class="custom-input"
              v-on="on"
            />
          </template>
          <v-time-picker v-if="modalTime" v-model="searchBody.hora" full-width>
            <v-spacer />
            <v-btn text color="primary" @click="modalTime = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialogTime.save(searchBody.hora)">
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          ref="dialogDate"
          v-model="modalDate"
          :return-value.sync="searchBody.data"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="displayDate"
              label="Data"
              prepend-inner-icon="mdi-calendar"
              solo
              readonly
              v-bind="attrs"
              class="custom-input"
              v-on="on"
            />
          </template>
          <v-date-picker v-model="searchBody.data" scrollable>
            <v-spacer />
            <v-btn text color="primary" @click="modalDate = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialogDate.save(searchBody.data)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </div>
      <v-autocomplete
        v-model="searchBody.cid"
        :items="cids"
        label="Código Cid"
        solo
      />
      <v-btn block color="#01193D" elevation="2" large @click="performSearch">
        Buscar
      </v-btn>
      <v-btn id="btn-solicitacao" to="/solicitacao" class="mt-4" :ripple="false" small text>
        Não encontrei minha rota
      </v-btn>
    </div>
    <!-- <div class="image-container">
      <img src="../static/Teste.png" class="image" alt="Mapa de São José dos Campos" />
    </div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SearchPage',
  data () {
    return {
      alertMessage: {
        error: 'Não foi possível realizar a busca, tente novamente.',
        warning: 'Nenhuma rota foi encontrada, nos envie um pedido através da página de Solicitação'
      },
      alertType: 'error',
      hasError: false,
      modalDate: false,
      modalTime: false,
      searchBody: {
        originCityId: '',
        destinationCityId: '',
        cid: '',
        data: '',
        hora: ''
      }
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids']),
    ...mapState('bus', ['busRoutes']),
    formIsEmpty () {
      return !this.searchBody.cid || !this.searchBody.data || !this.searchBody.destinationCityId || !this.searchBody.hora || !this.searchBody.originCityId
    },
    displayDate: {
      get () {
        if (!this.searchBody.data) {
          return ''
        }
        const [year, month, day] = this.searchBody.data.split('-')
        return `${day}/${month}/${year}`
      },
      set (newVal) {
        if (!newVal) {
          this.searchBody.data = ''
        } else {
          const [day, month, year] = newVal.split('/')
          this.searchBody.data = `${year}-${month}-${day}`
        }
      }
    }
  },
  created () {
    if (!this.cities.length) {
      this.fetchCities()
    }
    if (!this.cids.length) {
      this.fetchCids()
    }
  },
  destroyed () {
    this.hideAlert()
  },
  methods: {
    ...mapActions('city', ['fetchCities']),
    ...mapActions('cid', ['fetchCids']),
    ...mapActions('bus', ['fetchBusRoutes']),
    ...mapActions('loading', ['changeStatusLoading']),
    ...mapActions('alert', ['showAlert', 'hideAlert']),
    async performSearch () {
      this.hideAlert()
      if (this.formIsEmpty) {
        const propsAlert = {
          alertMessage: 'Todos os campos devem ser preenchidos',
          alertType: 'error'
        }
        this.showAlert(propsAlert)
      } else {
        this.changeStatusLoading(true)
        await this.fetchBusRoutes(this.searchBody)
        if (!this.busRoutes) {
          this.showAlert({ alertMessage: this.alertMessage.error, alertType: 'error' })
        } else if (this.busRoutes.length === 0) {
          this.showAlert({ alertMessage: this.alertMessage.warning, alertType: 'warning' })
        } else {
          this.$router.push('/rotas')
        }
        this.changeStatusLoading(false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page {
  background-color: white;
  border-radius: 14px;
  padding: 1rem;
  margin: 1rem auto;
  margin-top: 50px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: fit-content;
  @media (min-width: 1200px) {
    justify-content: center;
  }
}
.search-page__form {
  display: flex;
  flex-direction: column;
  width: 300px;
  @media (min-width: 1200px) {
    justify-content: center;
    margin: auto;
  }
}
.header-text {
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 20px;
}
.search-page__time-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}
.v-btn{
  color: white;
  border-radius: 12px;
}
#btn-solicitacao{
  color: #01193D;
}
.v-text-field {
  border-radius: 10px;
}
.custom-input .v-input__control {
  border-radius: 10px;
}
:deep(.v-input__prepend-inner .v-icon) {
  color: #0099F0 !important;
}

#btn-solicitacao::before {
   background-color: transparent !important;
}

.search-page__alert {
  margin: 20px;
  width: -webkit-fill-available;

  @media (min-width: 800px) {
    margin: 20px auto;
    width: 700px;
  }
}
</style>
