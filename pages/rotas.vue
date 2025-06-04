<template>
  <div class="routes-page__container">
    <template v-if="busRoutes.length">
      <div class="routes-page__header">
        <h2>{{ busRoutes[selectedCid].routes[selectedCidRoute].origin }} → {{ busRoutes[selectedCid].routes[selectedCidRoute].destination }}</h2>
          <div class="routes-page__title-and-btn">
          <div class="routes-page__right-actions">
            <div class="routes-page__info">
              <div class="routes-page__date">{{ formatDate(this.searches.data) }}</div>
              <div class="routes-page__time">{{ this.searches.hora }}</div>
            </div>
            <v-btn class="routes-page__buscar-btn" large @click="changeSearch">
              Altera Rota
            </v-btn>
          </div>
        </div>
        <div class="routes-page__tabs">
          <v-tabs v-model="selectedCidRoute"  background-color="transparent">
            <v-tabs-slider color="blue"></v-tabs-slider>
            <v-tab
            v-for="(route, index) in busRoutes[selectedCid].routes"
            :key="index"
            class="custom-tab"
            >
              {{ route.code }}
            </v-tab>
          </v-tabs>
        </div>
      </div>
       <div class="routes-page__main">
        <div class="routes-page__left">
          <p class="text-lg-h7" style="font-weight: bold;">Próximos horários:</p>
          <div class="routes-page__hours">
            <span
              v-for="(hour, index) in getLineHours(busRoutes[selectedCid].routes[selectedCidRoute].lineHours).split(' - ').slice(0,12)"
              :key="hour"
              :class="['routes-page__hour', { 'bold-hour': index === 0 }]"
            >
              {{ hour }}
            </span>
          </div>
          <span class="text-lg-h7" style="font-weight: bold;">Paradas</span>
          <v-timeline align-top dense>
            <v-timeline-item
              v-for="(stop, indexStop) in busRoutes[selectedCid].routes[selectedCidRoute].busStops"
              :key="indexStop"
              :color="'#01193D'"
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
        </div>

        <div class="routes-page__right">
          <iframe
            width="100%"
            height="100%"
            style="border:0; border-radius: 8px;"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18..."
          ></iframe>
        </div>
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
      tab: 0
    }
  },
  computed: {
    ...mapState('bus', ['busRoutes']),
    ...mapState('search', ['searches'])
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
    },

    changeSearch () {
      this.$router.push({ path: '/', query: { parametro: true } })
    },

    formatDate (dateStr) {
      const data = dateStr.split('-')
      return `${data[2]}/${data[1]}`
    }
  }
}
</script>

<style lang="scss" scoped>
.routes-page__container {
  padding: 24px;
  background-color: #f0f0f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.routes-page__header {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 12px;
}

.routes-page__header h2 {
  font-size: 18px;
  color: black;
  margin-bottom: 12px;
}

.routes-page__title-and-btn {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;

  @media(min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  h2 {
    font-size: 16px;
    color: black;
    margin: 0;
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media(max-width: 767px) {
      overflow: visible;
      text-overflow: unset;
      white-space: normal;
      word-break: break-word;
    }
  }

  .routes-page__right-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    gap: 8px;
  }

  .routes-page__info {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 10px;
  }

  .routes-page__date,
  .routes-page__time {
    background-color: #b3dbf6;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 14px;
    color: black;
    font-weight: 500;
  }

  .routes-page__buscar-btn {
    white-space: nowrap;
    align-self: flex-start;
    background-color: #01193D;
    color: #f0f0f0;
    padding: 6px 16px;
    font-size: 14px;
    height: auto;
    min-height: 36px;
    max-width: 150px;

    @media(min-width: 768px) {
      align-self: auto;
    }

  }
}

.routes-page__tabs {
  background-color: #f0f0f0 !important;
  border-radius: 8px;
  overflow-x: auto;
  width: 100%;
}

.routes-page__main {
  display: flex;
  flex-direction: column-reverse;
  gap: 24px;
  width: 100%;
  max-width: 1200px;

  @media(min-width: 768px) {
    flex-direction: row;
  }
}

.routes-page__left,
.routes-page__right {
  width: 100%;
}

.routes-page__left {
  order: 2;
  max-width: 100%;
  overflow-y: auto;

  @media(min-width: 768px) {
    flex: 0.4;
    max-width: 40%;
    order: 1;
  }
}

.routes-page__right {
  order: 1;
  max-height: 400px;
  min-height: 300px;
  overflow: hidden;
  position: relative;

  @media(min-width: 768px) {
    flex: 0.6;
    max-width: 60%;
    max-height: 500px;
    order: 2;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 8px;
    pointer-events: auto;
  }
}

.routes-page__hours {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.routes-page__hour {
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  color: black;
}

.bold-hour {
  font-weight: bold;
}

.routes-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 64px;
  text-align: center;
  padding: 16px;
}

.custom-tab {
  color: black;
  white-space: nowrap;
  &.v-tab--active {
    background-color: #e5e8eb;
    color: black;
  }
}

</style>
