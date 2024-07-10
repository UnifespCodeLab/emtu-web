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
      <v-btn class="button" color="primary">
        Buscar
      </v-btn>
      <v-btn class="button group-button" @click="dialog = true">
        O que são os grupos?
      </v-btn>
      <v-dialog v-model="dialog" class="v-dialog" max-width="80vw">
        <v-card>
          <v-card-title class="headline" />
          <v-card-text>
            <div class="dialog-container">
              <v-card class="dialog-card">
                <v-card-title class="dialog-title">
                  <v-icon class="dialog-icon">
                    mdi-wheelchair-accessibility
                  </v-icon>
                  G1
                </v-card-title>
                <v-card-text class="dialog-text">
                  Pessoas com deficiência que necessitam de um alto nível de acessibilidade, por exemplo, a utilização de elevador.
                </v-card-text>
              </v-card>
              <v-card class="dialog-card">
                <v-card-title class="dialog-title">
                  <v-icon class="dialog-icon">
                    mdi-human-white-cane
                  </v-icon>
                  G2
                </v-card-title>
                <v-card-text class="dialog-text">
                  Pessoas com necessidades de acessibilidade que não tenham interferência direta no ônibus, por exemplo, a presença de piso tátil.
                </v-card-text>
              </v-card>
              <v-card class="dialog-card">
                <v-card-title class="dialog-title">
                  <v-icon class="dialog-icon">
                    mdi-human-male
                  </v-icon>
                  G3
                </v-card-title>
                <v-card-text class="dialog-text">
                  Pessoas que não necessitam de adaptações no ônibus para seu deslocamento de forma segura.
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" class="ml-auto" @click="dialog = false">
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        fixed-header
      />
    </div>
  </div>
</template>
<!--Companhia -> Acompanhante-->
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
        { text: 'Código', value: 'cod', align: 'start' },
        { text: 'Diagnóstico', value: 'diagnostic', align: 'start' },
        { text: 'Observações', value: 'observations', align: 'start' },
        { text: 'Acompanhante', value: 'companion', align: 'start' },
        { text: 'Grupo', value: 'group', align: 'start' }
      ],
      cids: [],
      dialog: false,
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
  margin: 0 0 0 0.25em;
  min-width: 40px;
}

.button{
  margin: 0 15px 0 0;
}

.v-dialog{
  max-width: 60vw !important;
  width: 60vw !important;
}

.dialog-container{
  display: flex;
  max-width: 100%;
  height: 100%;
  justify-content: space-around;

}

.dialog-card{
  width: 33%;
  margin: 0 0.5em;
}

.dialog-title{
  display: flex;
  flex-direction: column;
}

.dialog-text{
  color: black;
  text-align: center;
}

.dialog-icon{
  font-size: 3em;
}

.table {
  width: 75%;
  height: min-content;
  margin: auto;
}

.v-data-table-header {
  text-align: left;
}

.error-message {
  margin: 1em auto;
  width: 60%;
}

@media (max-width: 600px) {
  .filters {
    flex-wrap: wrap;
  }
  .input{
    padding: 0;
  }
  .button{
    margin: 0 0 1em 0.25em;
  }
  .group-button{
    margin: 0em 0em 1em 0.25em;
  }
  .v-dialog{
    max-width: 85vw !important;
    width: 85vw !important;
  }
  .dialog-container{
    flex-direction: column;
  }
  .dialog-card{
    width: 100%;
    margin: 0.5em 0;
  }
  .table {
    width: 100%;
  }
  .error-message {
    width: 100%;
  }
}
</style>
