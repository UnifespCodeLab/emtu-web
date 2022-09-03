<template>
  <div v-if="cidsRoutes" class="routes-page__container">
    <div class="routes-page__chips-container">
      <v-chip
        class="routes-page__chip"
        close
        close-icon="mdi-close"
        color="orange"
        >cid acbd</v-chip
      >
      <v-chip close close-icon="mdi-close" color="red">cid efg</v-chip>
      <v-chip close close-icon="mdi-close" color="blue"
        >cid mnopqrstuvwxyz1</v-chip
      >
    </div>
    <div class="routes-page__steps">
      <v-carousel v-model="model">
        <v-carousel-item v-for="(route, index) in cidsRoutes[selectedCidRoute]" :key="index">
          <v-card class="routes-page__card" height="90%">
            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">Rota {{index}}</div>

              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="step in route"
                  :key="step.time"
                  :color="step.color"
                  small
                >
                  <div>
                    <div class="font-weight-normal">
                      <strong>{{ step.name }}</strong> @{{ step.time }}
                    </div>
                    <div>{{ step.address }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<script>
import api from "./mockApi.json"

export default {
  name: 'RoutesPage',
  data() {
    return {
      model: 0,
      colors: ['', 'secondary', 'yellow darken-2', 'red', 'orange'],
      steps: [
        {
          name: 'Viaduto Dutra',
          address: `Avenida 19 entre as ruas 20 x 22.`,
          time: '10:42am',
          color: 'blue',
        },
        {
          name: 'Passarela 01',
          address: 'Avenida 21, numero 122 entre as ruas 20 x 22.',
          time: '10:37am',
          color: 'blue',
        },
        {
          name: 'Passarela 02',
          address: 'Avenida 34 entre as duas 10 x 12, 0446',
          time: '9:47am',
          color: 'blue',
        },
        {
          name: 'Passarela 03',
          address: 'Avenida 34 entre as duas 10 x 12, 0446',
          time: '9:47am',
          color: 'blue',
        },
        {
          name: 'Passarela 04',
          address: 'Avenida 34 entre as duas 10 x 12, 0446',
          time: '9:47am',
          color: 'blue',
        },
        {
          name: 'Passarela 04',
          address: 'Avenida 34 entre as duas 10 x 12, 0446',
          time: '9:47am',
          color: 'blue',
        },
      ],
    }
  },

  async fetch() {
    this.cidsRoutes = await api
    this.selectedCidRoute = Object.keys(this.cidsRoutes)[0]
  }
}
</script>

<style lang="scss">
.routes-page__container {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 16px;
  padding: 0 5px;
  height: 100%;

  @media (min-width: 1200px) {
    justify-content: center;
  }
}

.routes-page__chip {
  margin: 4px;
}

.routes-page__steps {
  margin-top: 16px;
  margin-bottom: 16px;
  width: 360px;
}

.routes-page__card {
  overflow: auto;
}
</style>
