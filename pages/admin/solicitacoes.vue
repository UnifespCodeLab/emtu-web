<template>
  <div class="reports">
    <div class="reports__filter">
      <v-dialog
        ref="dialogStartDate"
        v-model="startDateDialog"
        :return-value.sync="startDate"
        persistent
        width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="startDate"
            class="reports__input"
            clearable
            placeholder="Período de início"
            label="Período de início"
            v-bind="attrs"
            solo
            v-on="on"
          />
        </template>
        <v-date-picker v-model="startDate" scrollable>
          <v-spacer />
          <v-btn text color="primary" @click="startDateDialog = false">
            Cancelar
          </v-btn>
          <v-btn text color="primary" @click="$refs.dialogStartDate.save(startDate)">
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
      <v-dialog
        ref="dialogEndDate"
        v-model="endDateDialog"
        :return-value.sync="endDate"
        persistent
        width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="endDate"
            class="reports__input"
            clearable
            placeholder="Período final"
            label="Período final"
            readonly
            v-bind="attrs"
            solo
            v-on="on"
          />
        </template>
        <v-date-picker v-model="endDate" scrollable>
          <v-spacer />
          <v-btn text color="primary" @click="endDateDialog = false">
            Cancelar
          </v-btn>
          <v-btn text color="primary" @click="$refs.dialogEndDate.save(endDate)">
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>

      <v-autocomplete
        v-model="originCity"
        class="reports__input"
        :items="cities"
        label="Origem"
        solo
      />

      <v-autocomplete
        v-model="destinationCity"
        class="reports__input"
        :items="cities"
        label="Destino"
        solo
      />

      <v-autocomplete
        v-model="selectedCid"
        class="reports__input"
        :items="cid"
        label="Cid"
        solo
      />

      <v-btn color="primary" large @click="executeSearch()">
        BUSCAR
      </v-btn>
    </div>
    <div
      v-if="reports"
      class="line-ranking__graph-wrapper"
    >
      <span>{{ reports.length }} resultados encontrados</span>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Filtrar por nome"
            single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="reports"
          :search="search"
        />
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import emtuApi from '~/assets/services/emtu-api'

export default {
  name: 'AdminReports',
  layout: 'admin',
  data () {
    return {
      startDate: null,
      startDateDialog: false,
      endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      endDateDialog: false,
      originCity: null,
      destinationCity: null,
      selectedCid: null,
      search: '',
      headers: [
        {
          text: 'Email',
          align: 'start',
          filterable: true,
          value: 'email'
        },
        { text: 'Cidade Origem', value: 'originCity' },
        { text: 'Cidade Destino', value: 'destinationCity' },
        { text: 'Cid', value: 'cid' },
        { text: 'Data Solicitação', value: 'creationDate' }
      ],
      reports: null
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids'])
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
    findCity (id) {
      return this.cities.find(city => city.value === id)?.text
    },
    async executeSearch () {
      const params = {
        origin: this.originCity,
        destination: this.destinationCity,
        startDate: this.startDate,
        endDate: this.endDate,
        idCid: this.selectedCid
      }

      const { data } = await emtuApi.get('/reports/getReports', { params })
      this.reports = data.data.map(item => ({
        email: item.email,
        originCity: this.findCity(item.id_cidade_origem),
        destinationCity: this.findCity(item.id_cidade_destino),
        cid: this.cids.find(cid => cid.value === item.id_cid)?.text,
        creationDate: new Date(item.data_criacao).toLocaleString('pt-BR')
      }))
    }
  }
}
</script>
<style scoped lang="scss">
.reports {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 4px;

  @media (min-width: 1000px) {
    padding: 0 20px
  }
}

.reports__filter{
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: flex-start;
  margin-top: 28px;
  width: 100%;

  @media (min-width: 800px) {
    flex-direction: row;
    gap: 16px;
    width: 800px;
  }
}

.reports__input {
  width: 100%;
  height: 36px;

  @media (min-width: 800px) {
    width: 188px;
  }
}

.line-ranking__graph-wrapper {
  margin-top: 60px;
  margin-bottom: 60px;
  width: 100%;

  @media (min-width: 800px) {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
  }
}
</style>
