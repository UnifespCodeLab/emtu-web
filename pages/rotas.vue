<template>
  <div class="routes-page__container">
    <div class="routes-page__chips-container">
      <v-chip class="routes-page__chip" close close-icon="mdi-close-outline" color="orange">cid acbd</v-chip>
      <v-chip close close-icon="mdi-close-outline" color="red">cid efg</v-chip>
      <v-chip close close-icon="mdi-close-outline" color="blue">cid mnopqrstuvwxyz1</v-chip>
    </div>
    <div class="routes-page__steps">
      <v-carousel v-model="model">
    <v-carousel-item
      v-for="(color, i) in colors"
      :key="color"
    >
      <v-sheet
        :color="color"
        height="100%"
        tile
      >
        <v-row
          class="fill-height"
          align="center"
          justify="center"
        >
          <div class="text-h2">
            Slide {{ i + 1 }}
          </div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoutesPage',
  data() {
    return {
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
    }
  },
}
</script>

<style lang="scss">
.routes-page__container {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 16px;
  padding: 0 20px;
  height: 100%;
}

.routes-page__chip {
  margin: 4px;
}

.routes-page__steps{
  margin-top: 16px;
  width: 360px;
}
</style>
