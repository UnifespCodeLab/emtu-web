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
        <v-autocomplete :items="cities" label="Cidade de origem" solo />
        <v-autocomplete :items="cities" label="Cidade de destino" solo />
        <v-select :items="cidList" label="Cid" solo />

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
export default {
  name: 'ReportPage',
  data() {
    return {
      hasSuccess: false,
      submittedRoute: false,
      cities: ['São José dos Campos', 'Jacareí', 'Taubaté'],
      cidList: ['Cid 01', 'Cid 02'],
    }
  },
  computed: {
    alertMessage() {
      return this.hasSuccess
        ? 'Enviado com sucesso!'
        : 'Erro ao enviar. Tente mais tarde.'
    },
  },
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
