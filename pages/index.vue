<template>
  <div class="search-page">
    <div class="search-page__form">
      <v-autocomplete
        v-model="searchBody.originCity"
        :items="cities"
        label="Origem"
        solo
      />
      <v-autocomplete
        v-model="searchBody.destinationCity"
        :items="cities"
        label="Destino"
        solo
      />
      <v-select
        v-model="searchBody.cid"
        :items="cids"
        label="Cid"
        solo
      />

      <div class="search-page__time-container">
        <v-dialog
          ref="dialogTime"
          v-model="modalTime"
          :return-value.sync="searchBody.time"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="searchBody.time"
              label="Selecione o horário"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker v-if="modalTime" v-model="searchBody.time" full-width>
            <v-spacer />
            <v-btn text color="primary" @click="modalTime = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialogTime.save(searchBody.time)">
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          ref="dialogDate"
          v-model="modalDate"
          :return-value.sync="searchBody.date"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="searchBody.date"
              label="Selecione a data"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker v-model="searchBody.date" scrollable>
            <v-spacer />
            <v-btn text color="primary" @click="modalDate = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialogDate.save(searchBody.date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </div>
      <v-btn block color="primary" elevation="2" large @click="performSearch">
        BUSCAR
      </v-btn>
    </div>
    <img
      class="search-page__image"
      src="~/assets/images/woman-hitchhiking.jpg"
      alt="woman-hitchhiking"
    >
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import emtuApi from '~/assets/services/emtu-api'

export default {
  name: 'SearchPage',
  data () {
    return {
      modalDate: false,
      modalTime: false,
      searchBody: {
        originCity: null,
        destinationCity: null,
        cid: null,
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        time: `${new Date().getHours()}:${new Date().getMinutes()}`
      }
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
    searchParams () {
      const { cid, date, destinationCity, originCity, time } = this.searchBody

      return {
        idCidadeOrigem: originCity,
        idCidadeDestino: destinationCity,
        idCid: cid,
        dataViagem: date,
        horaViagem: time
      }
    },
    async performSearch () {
      this.$router.push('/rotas')

      try {
        await emtuApi.post('searches', this.searchParams())
      } catch (_err) {
        // eslint-disable-next-line no-console
        console.error('Falha ao salvar busca no banco de dados!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  @media (min-width: 1200px) {
    justify-content: space-between;
    height: 100%;
  }
}
.search-page__form {
  display: flex;
  flex-direction: column;
  margin-top: 82px;
  width: 300px;
  @media (min-width: 1200px) {
    margin: auto;
  }
}
.search-page__image {
  display: none;
  @media (min-width: 1200px) {
    display: flex;
    max-width: 800px;
    height: 100%;
    object-fit: cover;
  }
}
.search-page__time-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
</style>
