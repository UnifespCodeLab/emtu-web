<template>
  <div class="search-page">
    <div class="search-page__form">
      <v-autocomplete :items="cities" label="Origem" solo />
      <v-autocomplete :items="cities" label="Destino" solo />
      <v-select :items="['Cid 01', 'Cid 02']" label="Cid" solo />
      <div class="search-page__time-container">
        <v-dialog
          ref="dialogTime"
          v-model="modalTime"
          :return-value.sync="time"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              label="Picker in dialog"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker v-if="modalTime" v-model="time" full-width>
            <v-spacer />
            <v-btn text color="primary" @click="modalTime = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialogTime.save(time)">
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          ref="dialogDate"
          v-model="modalDate"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Picker in dialog"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker v-model="date" scrollable>
            <v-spacer />
            <v-btn text color="primary" @click="modalDate = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialogDate.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </div>
      <v-btn block color="primary" elevation="2" large>
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
export default {
  name: 'SearchPage',
  data () {
    return {
      cities: ['São José dos Campos', 'Jacareí', 'Taubaté'],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      modalDate: false,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      modalTime: false
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