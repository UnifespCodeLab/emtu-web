<template>
  <div class="container">
    <div class="table-container">
      <v-card class="table-card">
        <div class="upper-container">
          <v-card-title class="table-card-title">
            Lista de CIDs
          </v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search.text"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            class="table-search"
          >
          </v-text-field>
          <ul class="filters">
            <v-select
              v-model="search.companion"
              :items="['Sim', 'Não']"
              label="Acompanhante"
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
        </div>
        <v-data-table
          :headers="headers"
          :items="filteredCids"
          :items-per-page="5"
          class="elevation-1 table"
          fixed-header
        >
          <template #[`item.group`]="{ item }">
            <v-chip
              :color="getColor(item.group)"
              dark
            >
              {{ item.group }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
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
      slugifiedText: '',
      headers: [
        { text: 'Código', align: 'start', value: 'cod' },
        { text: 'Diagnóstico', align: 'start', value: 'diagnostic' },
        { text: 'Observações', align: 'start', value: 'observations' },
        { text: 'Direito a Acompanhante', align: 'start', value: 'companion' },
        { text: 'Grupo', align: 'center', value: 'group' }
      ],
      cids: [],
      dialog: false,
      errorMessage: null
    }
  },
  computed: {
    filteredCids () {
      if (!this.slugifiedText && !this.search.companion && !this.search.group) {
        return this.cids
      }
      return this.cids.filter((item) => {
        return ((item.cod && item.cod.toLowerCase().includes(this.slugifiedText.toLowerCase())) ||
        (item.diagnostic && item.diagnostic.toLowerCase().includes(this.slugifiedText.toLowerCase())) ||
        (item.slugdiagnostic && item.slugdiagnostic.toLowerCase().includes(this.slugifiedText.toLowerCase()))) &&
        (!this.search.group || (item.group && item.group.toLowerCase().includes(this.search.group.toLowerCase()))) &&
        (!this.search.companion || (item.companion && item.companion.toLowerCase().includes(this.search.companion.toLowerCase())))
      })
    }
  },
  watch: {
    'search.text' (newText) {
      this.slugifiedText = this.slugify(newText)
      console.log(this.slugifiedText)
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
  },
  methods: {
    getColor (group) {
      if (group === 'G1') {
        return 'red'
      } else if (group === 'G2') {
        return 'orange'
      } else {
        return 'blue'
      }
    },
    slugify (text) {
      const original = 'áàãâäéèêëíìîïóòõôöúùûüçñ'
      const newFormat = 'aaaaaeeeeiiiiooooouuuucn'

      return text
        .toString()
        .toLowerCase()
        .trim()
        .split('')
        .map((char) => {
          const index = original.indexOf(char)
          return index !== -1 ? newFormat[index] : char
        })
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
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
  width: 100%;
  margin: 0 1.5em 0 1.5em;
  padding: 0;
}

.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input {
  padding: 0 15px 0 0;
  min-width: 40px;
}

.button{
  margin: 0 0 0 1.5em;
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

.table-card {
  width: 85%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.upper-container{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.table-card-title {
  padding-left: 1.5em;
}

.table-search {
  margin-right: 1.5em;
}

.table {
  width: 100%;
  height: min-content;
  margin: 0 1.5em 1.5em 1.5em;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
}

.error-message {
  margin: 1em auto;
  width: 60%;
}

@media (max-width: 1000px) and (min-width: 601px){
  .table-card {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .filters {
    flex-wrap: wrap;
    margin: 0;
  }
  .input{
    padding: 0;
    margin: 0 1.5em;
  }
  .button{
    margin: 0 1.5em;
  }
  .group-button{
    margin: 0em 1.75em 1em 1.75em;
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
  .table-search{
    margin-left: 1.75em;
  }
  .table-card {
    width: 100%;
  }
  .error-message {
    width: 100%;
  }
}
</style>

<!-- <div class="table-container">
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
</script> -->
