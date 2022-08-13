<template>
  <div class="search-page">
    <div class="search-page__form">
      <v-text-field label="Origem" solo></v-text-field>
      <v-text-field label="Destino" solo></v-text-field>
      <v-select :items="['Cid 01', 'Cid 02']" label="Cid" solo></v-select>
      <div class="search-page__time-container">
        <v-text-field label="Horário" prepend-icon="mdi-clock"> </v-text-field>
        <v-text-field label="Data" prepend-icon="mdi-calendar"> </v-text-field>
      </div>
    </div>
    <img
      class="search-page__image"
      src="~/assets/images/woman-hitchhiking.jpg"
      alt="woman-hitchhiking"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
}
</script>

<style lang="scss" scoped>
.search-page {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.search-page__form {
  display: flex;
  flex-direction: column;
  margin-left: 96px;
  margin-right: 96px;
  width: 300px;
}

.search-page__image {
  max-width: 1000px;
  object-fit: cover;
}

.search-page__time-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
</style>
