<template>
  <div class="home">
    <div class="report-page">
      <div class="report-page__form">
        <h1 class="header-text">Solicitar Nova Rota</h1>
        <p class="subtitle-text text-center mb-6" v-if="!hasSuccess">
          Não encontrou o que procurava?<br>
          Conte-nos qual rota você precisa.
        </p>

        <v-btn
          v-if="hasSuccess"
          block
          color="#01193D"
          elevation="0"
          large
          to="/"
          class="action-btn"
        >
          Voltar para Home
        </v-btn>

        <template v-else>
          <v-text-field
            v-model="reportData.email"
            label="E-mail"
            outlined
            class="custom-input"
            prepend-inner-icon="mdi-email-outline"
          />
          <v-autocomplete
            v-model="reportData.originCityId"
            :items="cities"
            label="Cidade de origem"
            outlined
            class="custom-input"
            prepend-inner-icon="mdi-map-marker-outline"
          />
          <v-autocomplete
            v-model="reportData.destinationCityId"
            :items="cities"
            label="Cidade de destino"
            outlined
            class="custom-input"
            prepend-inner-icon="mdi-map-marker"
          />
          <v-autocomplete
            v-model="reportData.cidId"
            :items="cids"
            label="Condição / CID (Opcional)"
            outlined
            class="custom-input"
            prepend-inner-icon="mdi-wheelchair-accessibility"
          />

          <v-btn
            block
            color="#01193D"
            elevation="0"
            large
            @click="submit"
            class="action-btn"
          >
            Enviar Solicitação
          </v-btn>
        </template>
      </div>
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
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.report-page {
  display: flex;
  flex-direction: column;
  margin: 35px auto;
  width: webkit-fill-available;
  max-width: 800px;
  background-color: white;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (min-width: 800px) {
    min-height: 500px;
  }
}

.report-page__form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2.5rem;

  @media (min-width: 800px) {
    width: 500px;
    min-width: 500px;
    justify-content: center;
    margin: auto;
  }
}

.header-text {
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 8px;
}

.subtitle-text {
  color: #666;
  font-size: 15px;
  line-height: 1.4;
}

.action-btn {
  color: white;
  border-radius: 12px;
  text-transform: none !important;
  font-size: 16px;
  margin-top: 8px;
}

.custom-input {
  border-radius: 10px;
}

::v-deep .v-input__control {
  border-radius: 10px !important;
}

::v-deep .v-input__prepend-inner .v-icon {
  color: #0099F0 !important;
}
</style>
