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
      <v-autocomplete class="reports__input" :items="['Cidade A', 'Cidade B']" label="Origem" solo />
      <v-autocomplete class="reports__input" :items="['Cidade C', 'Cidade D']" label="Destino" solo />
      <v-autocomplete class="reports__input" :items="['Cid 01', 'Cid 02']" label="Cid" solo />
      <v-btn color="primary" large @click="executeSearch()">
        BUSCAR
      </v-btn>
    </div>
    <div
      v-if="reports"
      class="line-ranking__graph-wrapper"
    >
      <span>{{ numberOfResults }} resultados encontrados</span>
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
        { text: 'Cid', value: 'cid' }
      ],
      reports: null,
      numberOfResults: null
    }
  },
  methods: {
    executeSearch () {
      this.reports = [
        {
          email: 'teste1@mail.com',
          originCity: 'São José dos Campos',
          destinationCity: 'São Paulo',
          cid: 1
        },
        {
          email: 'teste2@mail.com',
          originCity: 'São José dos Campos',
          destinationCity: 'Taubaté',
          cid: 2
        },
        {
          email: 'teste3@mail.com',
          originCity: 'Taubaté',
          destinationCity: 'São Paulo',
          cid: 1
        }
      ]
      this.numberOfResults = 3
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
  padding-left: 4px;
  padding-right: 4px;

  @media (min-width: 1000px) {
    padding-left: 20px;
    padding-right: 20px;
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
    align-items: flex-start;
    display: flex;
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
