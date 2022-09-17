<template>
  <div v-if="cidsRoutes" class="routes-page__container">
    <div class="routes-page__chips-container">
      <v-chip
        v-for="(item, index) in cidsRoutes"
        :key="index"
        class="routes-page__chip"
        close
        close-icon="mdi-close"
        :color="item.color"
        text-color="white"
        @click="updateSelectedCidRoute(index)"
      >
        {{ index }}
      </v-chip>
    </div>
    <div class="routes-page__steps">
      <v-carousel v-model="model">
        <v-carousel-item
          v-for="(route, index) in cidsRoutes[selectedCidRoute].routes"
          :key="index"
        >
          <v-card class="routes-page__card" height="90%">
            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">
                Itinerário {{ index + 1 }}
              </div>

              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="(step, indexStep) in route"
                  :key="indexStep"
                  :color="cidsRoutes[selectedCidRoute].color"
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
import api from './mockApi.json'

export default {
  name: 'RoutesPage',
  data() {
    return {
      cidsRoutes: null,
      model: 0,
    }
  },

  async fetch() {
    this.cidsRoutes = await api
    this.selectedCidRoute = Object.keys(this.cidsRoutes)[0]
  },

  methods: {
    updateSelectedCidRoute(index) {
      this.selectedCidRoute = index
      this.model = 0
      this.model = 1
      this.model = 0
      // Até o momento o único jeito que encontrei de fazer o componente atualuzar para o slide certo
    },

    randomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
  },
}
</script>

<style lang="scss" scoped>
.routes-page__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  margin-top: 16px;
  padding: 0 5px;

  @media (min-width: 800px) {
    justify-content: center;
  }
}

.routes-page__chip {
  margin: 4px;
}

.routes-page__steps {
  width: 360px;
  margin-top: 16px;
  margin-bottom: 16px;

  @media (min-width: 800px) {
    width: 600px;
  }
}

.routes-page__card {
  overflow: auto;
}
</style>
