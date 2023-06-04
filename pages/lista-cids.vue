<template>
  <div class="container">
    <ul class="filters">
      <v-text-field label="Pesquisar" placeholder="Pesquisar" solo dense class="input" />
      <v-select :items="items" label="Companhia" solo dense class="input" />
      <v-select :items="items" label="Grupo" solo dense class="input" />
      <v-btn color="primary">
        Buscar
      </v-btn>
    </ul>
    <div class="table-container">
      <v-data-table :headers="headers" :items="cids" :items-per-page="5" class="elevation-1 table" />
    </div>
  </div>
</template>

<script>
import axiosClient from '~/assets/services/emtu-api'

export default {
  data () {
    return {
      headers: [
        { text: 'Código', value: 'cod' },
        { text: 'Diagnóstico', value: 'diagnostic' },
        { text: 'Observações', value: 'observations' },
        { text: 'Companhia', value: 'companion' },
        { text: 'Grupo', value: 'group' }
      ],
      cids: []
    }
  },
  created () {
    axiosClient.get('/cids')
      .then((response) => {
        this.cids = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.filters {
  display: flex;
  width: fit-content;
  padding: 0;
}

.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.input {
  width: fit-content;
  padding: 0 15px 0 0;
}

.table {
  width: 75%;
  height: min-content;
  margin: auto;
}
</style>
