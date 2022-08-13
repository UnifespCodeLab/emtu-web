<template>
  <div class="search-page">
    <div class="search-page__form">
      <v-text-field label="Origem" solo></v-text-field>
      <v-text-field label="Destino" solo></v-text-field>
      <v-select :items="['Cid 01', 'Cid 02']" label="Cid" solo></v-select>
      <div class="search-page__time-container">
        <v-text-field
          label="Horário"
          prepend-icon="mdi-clock"
        >
        </v-text-field>
        <v-text-field
          label="Data"
          prepend-icon="mdi-calendar"
        >
        </v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
}
</script>

<style lang="scss" scoped>
.search-page {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-page__form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.search-page__time-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
</style>
