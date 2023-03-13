<template>
  <div class="report-page">
    <v-alert
      class="report-page__alert"
      dismissible
      transition="scale-transition"
      :type="hasSuccess ? 'success' : 'error'"
      :value="submittedRoute"
    >
      {{ alertMessage }}
    </v-alert>

    <div class="report-page__form">
      <v-btn
        v-if="hasSuccess"
        block
        color="primary"
        elevation="2"
        large
        to="/"
      >
        voltar para home
      </v-btn>

      <template v-else>
        <v-text-field v-model="requestRouteBody.email" label="E-mail" solo />
        <v-autocomplete
          v-model="requestRouteBody.originCity"
          :items="cities"
          label="Cidade de origem"
          solo
        />
        <v-autocomplete
          v-model="requestRouteBody.destinationCity"
          :items="cities"
          label="Cidade de destino"
          solo
        />
        <v-select
          v-model="requestRouteBody.cid"
          :items="cids"
          label="Cid"
          solo
        />

        <v-btn
          block
          color="primary"
          elevation="2"
          large
          @click="submit"
        >
          enviar
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import emtuApi from 'assets/services/emtu-api'

export default {
  name: 'ReportPage',
  data () {
    return {
      hasSuccess: false,
      submittedRoute: false,
      requestRouteBody: {
        email: '',
        originCity: '',
        destinationCity: '',
        cid: ''
      }
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids']),
    alertMessage () {
      return this.hasSuccess
        ? 'Enviado com sucesso!'
        : 'Erro ao enviar. Tente mais tarde.'
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
    submit () {
      console.log(this.requestRouteBody)
      // const response = await emtuApi.post('requestRoute')

      this.submittedRoute = true
      this.hasSuccess = true
    }
  }
}
</script>

<style lang="scss" scoped>
.report-page {
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 800px) {
    align-items: center;
  }
}

.report-page__alert {
  position: absolute;
  width: -webkit-fill-available;
  z-index: 1;

  @media (min-width: 800px) {
    width: 500px;
  }
}

.report-page__form {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 300px;
}
</style>
