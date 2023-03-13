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
        <v-text-field label="E-mail" solo />
        <v-autocomplete
          :items="cities"
          label="Cidade de origem"
          item-value="id"
          item-text="name"
          solo
        />
        <v-autocomplete
          :items="cities"
          label="Cidade de destino"
          item-text="name"
          item-value="id"
          solo
        />
        <v-select
          :items="cids"
          label="Cid"
          solo
          item-text="cod"
          item-value="id"
          :menu-props="{
            maxHeight: 304,
            maxWidth: 300,
            offsetY: true,
            offsetOverflow: true,
            offsetOverflowX: true,
            transition: true
          }"
        />

        <v-btn
          block
          color="primary"
          elevation="2"
          large
          @click="
            submittedRoute = true
            hasSuccess = true
          "
        >
          enviar
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ReportPage',
  data () {
    return {
      hasSuccess: false,
      submittedRoute: false,
      cidList: ['Cid 01', 'Cid 02']
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
    ...mapActions('cid', ['fetchCids'])
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
