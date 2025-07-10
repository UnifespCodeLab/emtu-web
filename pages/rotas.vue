<template>
  <div class="routes-page__container">
    <template v-if="busRoutes.length">
      <div class="routes-page__header">
        <div class="routes-page__title-and-btn">
          <h2>{{ getCityName(busRoutes[selectedCid].routes[selectedCidRoute].origin) }} <v-icon color="#017BFD" small class="mx-1">mdi-arrow-right</v-icon> {{ getCityName(busRoutes[selectedCid].routes[selectedCidRoute].destination) }}</h2>
          <!-- <div v-if="primaryCid" class="routes-page__cid-info">
            <span>
              CID mais forte considerado: <strong>{{ primaryCidText }}</strong>
            </span>
          </div> -->
          <div class="routes-page__right-actions">
            <div class="routes-page__info">
              <div class="routes-page__date">{{ formatDate(this.searches.data) }}</div>
              <div class="routes-page__time">{{ this.searches.hora }}</div>
            </div>
            <v-btn class="routes-page__buscar-btn" large @click="changeSearch">
              Alterar Rota
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
          <!-- <l-map
            v-if="stopsLatLng.length"
            :zoom="mapZoom"
            :center="mapCenter"
            style="height: 100%; min-height: 300px; border-radius: 8px;"
            :options="mapOptions"
          >
            <l-tile-layer :url="tileLayerUrl" :attribution="tileLayerAttribution" />
            <l-polyline :lat-lngs="snappedRoute.length ? snappedRoute : stopsLatLng" :color="'#017BFD'" :weight="5" />
            <l-marker
              v-for="(latlng, idx) in stopsLatLng"
              :key="idx"
              :lat-lng="latlng"
            >
              <v-tooltip top>
                {{ getStopAddressTitle(busRoutes[selectedCid].routes[selectedCidRoute].busStops[idx]) }}
              </v-tooltip>
            </l-marker>
          </l-map>
          <div v-else style="height:100%;display:flex;align-items:center;justify-content:center;">
            <span>Mapa indisponível</span>
          </div> -->
          <l-map v-if="isMounted" :zoom="zoom" :center="mapCenter" :options="mapOptions" @moveend="onMapMove"
            @zoomend="onMapMove">
            <l-tile-layer :url="activeMapUrl" :attribution="activeAttribution" />
            <l-polyline :lat-lngs="snappedRoute.length ? snappedRoute : stopsLatLng" :color="'#017BFD'" :weight="5" />
            <l-marker
              v-for="(latlng, idx) in stopsLatLng"
              :key="idx"
              :lat-lng="latlng"
            >
              <v-tooltip top>
                {{ getStopAddressTitle(busRoutes[selectedCid].routes[selectedCidRoute].busStops[idx]) }}
              </v-tooltip>
            </l-marker>
            <!-- <l-marker :lat-lng="markerLatLng"/> -->
            <l-control position="topright">
              <div class="leaflet-control-zoom-buttons">
                <button class="zoom-btn" @click="zoomIn">
                  +
                </button>
                <button class="zoom-btn" @click="zoomOut">
                  −
                </button>
              </div>
            </l-control>
            <l-control position="bottomleft">
              <div class="map-type-control">
                <button class="map-type-btn" @click="toggleMapType">
                  <div class="preview-container">
                    <img :src="previewImageUrl" alt="Preview" class="map-preview"
                      :class="{ 'map-preview-fade': isImageTransitioning }" @load="onImageLoaded"></img>
                    <div class="preview-label">
                      {{ activeMapType === 'streetMap' ? 'Satélite' : 'Mapa' }}
                    </div>
                  </div>
                </button>
              </div>
            </l-control>
          </l-map>
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
import { LMap, LTileLayer, LMarker, LPolyline, LControl } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import { mapState } from 'vuex'

export default {
  name: 'RoutesPage',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LControl
  },
  data () {
    return {
      colors: ['blue', 'red', 'yellow'],
      selectedCid: 0,
      selectedCidRoute: 0,
      tab: 0,
      center: [-23.5505, -46.6333], // Posição inicial do centro do mapa
      mapZoom: 13,
      snappedRoute: [],
      mapOptions: {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true
      },
      activeMapType: 'streetMap',
      mapLayers: {
        streetMap: {
          url: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        satelliteMap: {
          url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CNES, © Airbus DS, © PlanetObserver, Copernicus | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
      },
      mapUpdateTrigger: 0,
      isImageTransitioning: false,
      mapMoveTimeout: null,
      previousCenter: null,
      zoom: 15,
      markerLatLng: [-23.5505, -46.6333], // Posição inicial do marcador
      isMounted: false
    }
  },
  computed: {
    ...mapState('bus', ['busRoutes']),
    ...mapState('bus', ['primaryCid']),
    ...mapState('search', ['searches']),
    ...mapState('cid', ['cids']),
    primaryCidText () {
      if (!this.primaryCid) {
        return ''
      }
      const cid = this.cids?.find(c => c.value === this.primaryCid)
      return cid ? cid.text : this.primaryCid
    },
    stopsLatLng () {
      const route = this.busRoutes?.[this.selectedCid]?.routes?.[this.selectedCidRoute]
      if (!route || !route.busStops) {
        return []
      }
      return route.busStops
        .map((stop) => {
          // Aceita tanto lat/lng quanto latitude/longitude
          const lat = stop.lat !== undefined ? stop.lat : stop.latitude
          const lng = stop.lng !== undefined ? stop.lng : stop.longitude
          if (
            lat !== undefined &&
            lng !== undefined &&
            !isNaN(parseFloat(lat)) &&
            !isNaN(parseFloat(lng))
          ) {
            return [parseFloat(lat), parseFloat(lng)]
          }
          return null
        })
        .filter(Boolean)
    },
    mapCenter () {
      return this.center
    },
    previewImageUrl () {
      // Mostra o preview do tipo oposto ao que está ativo
      const previewType = this.activeMapType === 'streetMap' ? 'satelliteMap' : 'streetMap'
      const url = this.mapLayers[previewType].url
      // Calcula o zoom e as coordenadas do tile para o preview
      const zoom = Math.max(this.zoom, 1)
      const x = this.getTileX(this.center[1], zoom)
      const y = this.getTileY(this.center[0], zoom)
      return url
        .replace('{z}', zoom)
        .replace('{x}', x)
        .replace('{y}', y)
        .replace('{r}', '')
    },
    activeMapUrl () {
      return this.mapLayers[this.activeMapType].url
    },
    activeAttribution () {
      return this.mapLayers[this.activeMapType].attribution
    }
  },
  watch: {
    stopsLatLng: {
      immediate: true,
      handler (newVal) {
        if (this.busRoutes?.[this.selectedCid]?.routes?.[this.selectedCidRoute]?.busStops?.length > 1) {
          this.fetchSnappedRoute(this.busRoutes[this.selectedCid].routes[this.selectedCidRoute].busStops)
        }
      }
    }
  },
  mounted () {
    this.isMounted = true
    if (this.stopsLatLng.length) {
      this.center = this.stopsLatLng[0]
    }
  },
  methods: {
    filterStopsForRouting (stops, minDistance = 90) {
      if (!stops.length) {
        return []
      }
      const filtered = [stops[0]]
      let last = stops[0]
      for (const stop of stops) {
        const dist = Math.sqrt(
          Math.pow(stop[0] - last[0], 2) + Math.pow(stop[1] - last[1], 2)
        )
        if (dist > minDistance / 111320) { // ~meters to degrees
          filtered.push(stop)
          last = stop
        }
      }
      if (filtered[filtered.length - 1] !== stops[stops.length - 1]) {
        filtered.push(stops[stops.length - 1])
      }
      return filtered
    },
    async fetchSnappedRoute (stops) {
      this.snappedRoute = []
      // Use latitude/longitude e raio de cada parada
      const coords = stops.map(stop => [stop.latitude, stop.longitude])
      const radiuses = stops.map(stop => stop.raio || 30).join(';') // usa o raio de cada parada, ou 30m padrão
      const coordStr = coords.map(c => `${c[1]},${c[0]}`).join(';')
      const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&radiuses=${radiuses}`
      const resp = await fetch(url)
      const data = await resp.json()
      if (data.routes && data.routes.length) {
        this.snappedRoute = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
      }
    },
    getCityName (fullRouteName) {
      if (!fullRouteName) {
        return ''
      }
      const cityName = fullRouteName.split('(')[0].trim()
      return cityName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },

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
    },

    zoomIn () {
      if (this.zoom < 18) {
        this.zoom += 1
      }
    },
    zoomOut () {
      if (this.zoom > 2) {
        this.zoom -= 1
      }
    },
    toggleMapType () {
      this.isImageTransitioning = true
      setTimeout(() => {
        this.activeMapType = this.activeMapType === 'streetMap' ? 'satelliteMap' : 'streetMap'
      }, 300)
    },
    onImageLoaded () {
      setTimeout(() => {
        this.isImageTransitioning = false
      }, 50)
    },
    getTileX (lng, zoom) {
      return Math.floor((lng + 180) / 360 * Math.pow(2, zoom))
    },
    getTileY (lat, zoom) {
      return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
    },
    onMapMove (event) {
      // Atualiza as coordenadas do centro
      if (event.target && event.target.getCenter) {
        const center = event.target.getCenter()
        const newCenter = [center.lat, center.lng]
        // Obtém o zoom atual
        let newZoom = this.zoom
        if (event.target.getZoom) {
          newZoom = event.target.getZoom()
        }

        // Verifica se a posição mudou significativamente
        const hasSignificantChange =
          !this.previousCenter ||
          Math.abs(this.previousCenter[0] - newCenter[0]) > 0.005 ||
          Math.abs(this.previousCenter[1] - newCenter[1]) > 0.005 ||
          this.zoom !== newZoom

        if (this.mapMoveTimeout) {
          clearTimeout(this.mapMoveTimeout)
        }
        // Apenas aplica a transição se houver mudança significativa
        if (hasSignificantChange) {
          // Inicia a transição
          this.isImageTransitioning = true

          // Agenda a atualização dos dados após um pequeno delay
          this.mapMoveTimeout = setTimeout(() => {
            this.center = newCenter
            this.zoom = newZoom
            this.previousCenter = [...newCenter]

            // Incrementa o contador para forçar a atualização do preview
            this.mapUpdateTrigger++
          }, 150) // Delay menor que a transição para começar a carregar a nova imagem
        } else {
          // Se a mudança for pequena, apenas atualiza os valores sem transição
          this.center = newCenter
          this.zoom = newZoom
          this.previousCenter = [...newCenter]
          this.mapUpdateTrigger++
        }
      }
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
  display: contents;
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
    border-radius: 10px;

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

.zoom-btn {
  width: 30px;
  height: 30px;
  background: white;
  border: 1px solid #ccc;
  display: block;
  z-index: 10000;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;

  &:first-child {
    border-bottom: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:hover {
    background-color: #f4f4f4;
  }
}
.leaflet-control-zoom-buttons {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 10px;
  right: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
.map-type-control {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10000;
}
.map-type-btn {
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &:hover {
    background-color: #f4f4f4;
  }

  span {
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
  }
}

.preview-container {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 2px;
  border: 1px solid #ddd;
  position: relative;
}

.preview-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  text-align: center;
  padding: 12px 0 4px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.map-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.map-preview-fade {
  opacity: 0;
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
