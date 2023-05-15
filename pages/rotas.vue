<template>
  <div v-if="busRoutes.length" class="routes-page__container">
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
          <v-card class="routes-page__card" height="100%">
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
                  v-for="(step, indexStep) in route.points"
                  :key="indexStep"
                  :color="colors[selectedCid]"
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
      return lineHours.map(date =>
        this.formatHour(new Date(date).toTimeString())
      ).join(' - ')
    },

    formatHour (hour) {
      // Input example: 21:50:00 GMT-0200 (Brasilia Summer Time)
      // Output: 21:50

      return hour.split(' ')[0]
        .split(':').splice(0, 2)
        .join(':')
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
}
</style>
