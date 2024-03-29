<template>
  <div class="container">
    <ul class="filters">
      <v-text-field
        v-model="search.text"
        label="Pesquisar"
        placeholder="Pesquisar"
        solo
        dense
        class="input"
      />
      <v-select
        v-model="search.companion"
        :items="['Sim', 'Não']"
        label="Companhia"
        solo
        dense
        class="input"
        clearable
      />
      <v-select
        v-model="search.group"
        :items="['G1', 'G2', 'G3']"
        label="Grupo"
        solo
        dense
        class="input"
        clearable
      />
      <v-btn color="primary">
        Buscar
      </v-btn>
    </ul>
    <v-alert v-if="errorMessage" type="error" class="error-message">
      {{ errorMessage }}
    </v-alert>
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="filteredCids"
        :items-per-page="5"
        class="elevation-1 table"
        dense
      />
    </div>
  </div>
</template>

<script>
import axiosClient from '~/assets/services/emtu-api'

export default {
  data () {
    return {
      search: {
        text: '',
        companion: null,
        group: null
      },
      headers: [
        { text: 'Código', value: 'cod' },
        { text: 'Diagnóstico', value: 'diagnostic' },
        { text: 'Observações', value: 'observations' },
        { text: 'Companhia', value: 'companion' },
        { text: 'Grupo', value: 'group' }
      ],
      cids: [],
      errorMessage: null
    }
  },
  computed: {
    filteredCids () {
      if (!this.search.text && !this.search.companion && !this.search.group) {
        return this.cids
      }
      return this.cids.filter((item) => {
        return ((item.cod && item.cod.toLowerCase().includes(this.search.text.toLowerCase())) ||
        (item.diagnostic && item.diagnostic.toLowerCase().includes(this.search.text.toLowerCase())) ||
        (item.observations && item.observations.toLowerCase().includes(this.search.text.toLowerCase())) ||
        (item.companion && item.companion.toLowerCase().includes(this.search.text.toLowerCase())) ||
        (item.group && item.group.toLowerCase().includes(this.search.text.toLowerCase()))) &&
        (!this.search.group || (item.group && item.group.toLowerCase().includes(this.search.group.toLowerCase()))) &&
        (!this.search.companion || (item.companion && item.companion.toLowerCase().includes(this.search.companion.toLowerCase())))
      })
    }
  },
  created () {
    axiosClient.get('/cids')
      .then((response) => {
        this.cids = response.data
        this.errorMessage = null
      })
      .catch(() => {
        this.errorMessage = 'Ocorreu um erro ao buscar os CIDs.'
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
  padding: 0 15px 0 0;
  min-width: 40px;
}

.table {
  width: 75%;
  height: min-content;
  margin: auto;
}

.error-message {
  margin: 1em auto;
  width: 60%;
}

@media (max-width: 600px) {
  .filters {
    flex-wrap: wrap;
  }
  .table {
    width: 100%;
  }
  .error-message {
    width: 100%;
  }
}
</style>
