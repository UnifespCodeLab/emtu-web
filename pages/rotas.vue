<template>
  <div class="routes-page__container">
    <template v-if="busRoutes.length">
      <div class="routes-page__chips-container">
        <v-chip
          v-for="(item, index) in busRoutes"
          :key="index"
          class="routes-page__chip"
          close
          close-icon="mdi-close"
          :color="colors[index]"
          text-color="white"
          @click="selectedCid = index"
        >
          {{ item.group }}
        </v-chip>
      </div>
      <div class="routes-page__steps">
        <v-carousel v-model="selectedCidRoute">
          <v-carousel-item
            v-for="(route, index) in busRoutes[selectedCid].routes"
            :key="index"
          >
            <v-card class="routes-page__card" height="90%">
              <v-card-text>
                <div class="font-weight-bold ml-8 mb-2">
                  Itinerário {{ route.code }}
                </div>

                <div class="font-weight-bold ml-8 mb-2">
                  {{ route.origin }} - {{ route.destination }}
                </div>

                <div class="font-weight-bold ml-8 mb-2">
                  Horários:
                </div>

                <div class="ml-8 mb-2">
                  {{ getLineHours(route.lineHours) }}
                </div>

                <div class="font-weight-bold ml-8 mb-2">
                  Pontos:
                </div>

                <v-timeline align-top dense>
                  <v-timeline-item
                    v-for="(stop, indexStop) in route.busStops"
                    :key="indexStop"
                    :color="colors[selectedCid]"
                    small
                    fill-dot
                  >
                    <template #icon>
                      <span class="white--text">{{ indexStop + 1 }}</span>
                    </template>
                    <div>
                      <div class="font-weight-normal">
                        <strong>{{ getStopAddressTitle(stop) }}</strong>
                      </div>
                      <div>{{ getStopAddressText(stop) }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </div>
    </template>

    <div v-else class="routes-page__empty">
      <v-img alt="Ícone representativo de uma busca">
        <v-icon color="primary" size="140">
          mdi-home-search
        </v-icon>
      </v-img>

      <h1 class="text-lg-h6">
        Não foi possível encontrar as rotas, tente realizar a busca novamente.
      </h1>

      <v-btn color="primary" to="/">
        Voltar para página principal
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RoutesPage',
  data () {
    return {
      colors: ['blue', 'red', 'yellow'],
      selectedCid: 0,
      selectedCidRoute: 0,
      model: 0
    }
  },
  computed: {
    ...mapState('bus', ['busRoutes'])
  },
  methods: {
    getLineHours (lineHours) {
      return lineHours.map(this.formatHour).join(' - ')
    },

    getStopAddressTitle (stop) {
      // Input example: Av. João Batista, 278 - Centro, Osasco - SP, 06097-090, Brasil
      // Output: Av. João Batista, 278
      return stop.endereco.split(' - ')[0]
    },

    getStopAddressText ({ endereco }) {
      // Input example: Av. João Batista, 278 - Centro, Osasco - SP, 06097-090, Brasil
      // Centro, Osasco - SP, 06097-090, Brasil
      return endereco.split(' - ').length > 1
        ? endereco.substring(endereco.indexOf(' - ') + 2)
        : ''
    },

    formatHour (date) {
      // Input example: 1999-01-01T14:16:00.000Z
      // Output: 14:16
      return date.substr(11, 5)
    }
  }
}
</script>

<style lang="scss" scoped>
.routes-page__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;

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

  @media (min-width: 800px) {
    width: 700px;
  }
}

.routes-page__card {
  overflow: auto;
  padding: 0 12px;
}

.routes-page__empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
