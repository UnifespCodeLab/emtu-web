<template>
  <div class="report-page">
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
        <v-text-field v-model="reportData.email" label="E-mail" solo />
        <v-autocomplete
          v-model="reportData.originCityId"
          :items="cities"
          label="Cidade de origem"
          solo
        />
        <v-autocomplete
          v-model="reportData.destinationCityId"
          :items="cities"
          label="Cidade de destino"
          solo
        />
        <v-select
          v-model="reportData.cidId"
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
import emtuApi from '~/assets/services/emtu-api'

export default {
  name: 'ReportPage',
  data () {
    return {
      hasSuccess: false,
      errorMessage: '',
      successMessage: 'Informação enviada com sucesso!',
      reportData: {
        email: null,
        originCityId: null,
        destinationCityId: null,
        cidId: null
      }
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids']),
    alertMessage () {
      return this.hasSuccess ? this.successMessage : this.errorMessage
    },
    reportParams () {
      const { email, originCityId, destinationCityId, cidId } = this.reportData

      return {
        email,
        idCidadeOrigem: originCityId,
        idCidadeDestino: destinationCityId,
        idCid: cidId
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
    ...mapActions('alert', ['showAlert', 'hideAlert']),
    async submit () {
      this.hideAlert()

      try {
        await emtuApi.post('reports', this.reportParams)
        this.hasSuccess = true
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Ocorreu um erro ao enviar a informação'
        this.hasSuccess = false
      } finally {
        this.showAlert({
          alertMessage: this.alertMessage,
          alertType: this.hasSuccess ? 'success' : 'error'
        })
      }
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
.report-page__form {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 300px;
}
</style>
