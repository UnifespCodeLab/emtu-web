<template>
  <div class="search-page">
    <div class="search-page__form">
      <v-autocomplete
        v-model="searchBody.originCityId"
        :items="cities"
        label="Origem"
        solo
      />
      <v-autocomplete
        v-model="searchBody.destinationCityId"
        :items="cities"
        label="Destino"
        solo
      />
      <v-autocomplete
        v-model="searchBody.cid"
        :items="cids"
        label="Cid"
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
              label="Selecione o horário"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
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
              v-model="searchBody.data"
              label="Selecione a data"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
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
      <v-btn block color="primary" elevation="2" large @click="performSearch">
        BUSCAR
      </v-btn>
    </div>

    <v-alert
      class="search-page__alert"
      dismissible
      transition="scale-transition"
      :type="alertType"
      :value="hasError"
    >
      {{ alertMessage }}
    </v-alert>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SearchPage',
  data () {
    return {
      alertType: 'error',
      hasError: false,
      modalDate: false,
      modalTime: false,
      searchBody: {
        originCityId: '',
        destinationCityId: '',
        cid: '',
        data: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        hora: `${new Date().getHours()}:${new Date().getMinutes()}`
      }
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids']),
    ...mapState('bus', ['busRoutes']),
    alertMessage () {
      return {
        error: 'Não foi possível realizar a busca, tente novamente.',
        warning: 'Nenhuma rota foi encontrada, nos envie um pedido através da página de Solicitação'
      }[this.alertType]
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
  methods: {
    ...mapActions('city', ['fetchCities']),
    ...mapActions('cid', ['fetchCids']),
    ...mapActions('bus', ['fetchBusRoutes']),
    async performSearch () {
      this.hasError = false

      await this.fetchBusRoutes(this.searchBody)

      if (!this.busRoutes) {
        this.hasError = true
        this.alertType = 'error'
      } else if (this.busRoutes.length === 0) {
        this.hasError = true
        this.alertType = 'warning'
      } else {
        this.$router.push('/rotas')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page {
  margin-top: 50px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  @media (min-width: 1200px) {
    justify-content: space-between;
    height: 100%;
  }
}
.search-page__form {
  display: flex;
  flex-direction: column;
  margin-top: 82px;
  width: 300px;
  @media (min-width: 1200px) {
    justify-content: center;
    margin: auto;
  }
}
.search-page__time-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
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
