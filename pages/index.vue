<template>
  <div class="home">
    <div class="search-page">
      <div class="search-page__form">
        <span class="header-text">Para onde você quer ir?</span>
        <v-autocomplete
          v-model="searchBody.originCityId"
          :items="cities"
          label="Origem"
          prepend-inner-icon="mdi-map-marker"
          solo
        />
        <v-autocomplete
          v-model="searchBody.destinationCityId"
          :items="cities"
          label="Destino"
          prepend-inner-icon="mdi-map-marker-radius"
          solo
        />
        <div class="search-page__time-container">
          <v-dialog
            ref="dialogTime"
            v-model="modalTime"
            :return-value.sync="searchBody.hora"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="searchBody.hora"
                label="Horário"
                prepend-inner-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                solo
                class="custom-input"
                v-on="on"
              />
            </template>
            <v-time-picker v-if="modalTime" v-model="searchBody.hora" locale="pt-br" full-width>
              <v-spacer />
              <v-btn text color="primary" @click="modalTime = false">
                Cancelar
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialogTime.save(searchBody.hora)">
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
          <v-dialog
            ref="dialogDate"
            v-model="modalDate"
            :return-value.sync="searchBody.data"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="displayDate"
                label="Data"
                prepend-inner-icon="mdi-calendar"
                solo
                readonly
                v-bind="attrs"
                class="custom-input"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="searchBody.data" scrollable locale="pt-br">
              <v-spacer />
              <v-btn text color="primary" @click="modalDate = false">
                Cancelar
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialogDate.save(searchBody.data)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </div>
        <v-autocomplete
          v-model="searchBody.cid"
          :items="cids"
          label="Código Cid"
          solo
        />
        <v-btn block color="#01193D" elevation="2" large @click="performSearch">
          Buscar
        </v-btn>
        <v-btn
          id="btn-solicitacao"
          to="/solicitacao"
          class="mt-4"
          :ripple="false"
          small
          text
        >
          Não encontrei minha rota
        </v-btn>
      </div>
      <div class="map-container">
        <l-map
          v-if="isMounted"
          :zoom="zoom"
          :center="center"
          :options="mapOptions"
          @moveend="onMapMove"
          @zoomend="onMapMove"
        >
          <l-tile-layer :url="activeMapUrl" :attribution="activeAttribution" />
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
                  <img
                    :src="previewImageUrl"
                    alt="Preview"
                    class="map-preview"
                    :class="{ 'map-preview-fade': isImageTransitioning }"
                    @load="onImageLoaded"
                  ></img>
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
    <div v-if="recentSearches && recentSearches.length > 0" class="search-page-recents mb-4">
      <h2 class="recents-title">
        Recentes
      </h2>
      <div class="recentRoutesSearched-container">
        <v-card
          v-for="(search, index) in recentSearches"
          :key="index"
          class="recentRoute-card"
          elevation="0"
          @click="useRecentSearch(search)"
        >
          <v-card-title class="recentRoute-title">
            {{ search.routeInfo }}
          </v-card-title>
          <v-card-text v-if="search.routeInfo" class="recentRoute-text">
            {{ getCityName(search.originCityId) }}
            <v-icon color="#017BFD" small class="mx-1">
              mdi-arrow-right
            </v-icon>
            {{ getCityName(search.destinationCityId) }}
          </v-card-text>
          <v-card-actions>
            <v-chip
              class="ma-1 recentRoute-chip"
              color="#74C3F8"
              small
            >
              {{ formatTime(search.hora) }}
            </v-chip>
            <v-chip
              class="ma-1 recentRoute-chip"
              color="#74C3F8"
              small
            >
              {{ formatDate(search.data) }}
            </v-chip>
            <v-chip
              v-if="search.cid"
              class="ma-1 recentRoute-chip"
              color="#74C3F8"
              small
            >
              {{ getCIDText(search.cid) }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import { mapState, mapActions } from 'vuex'
import { Icon } from 'leaflet'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'SearchPage',
  components: {
    LMap,
    LTileLayer
  },
  data () {
    return {
      alertMessage: {
        error: 'Não foi possível realizar a busca, tente novamente.',
        warning: 'Nenhuma rota foi encontrada, nos envie um pedido através da página de Solicitação'
      },
      alertType: 'error',
      hasError: false,
      modalDate: false,
      modalTime: false,
      searchBody: {
        originCityId: '',
        destinationCityId: '',
        cid: '',
        data: '',
        hora: ''
      },
      recentSearches: [],
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
      center: [-23.5505, -46.6333], // Coordenadas de São Paulo
      markerLatLng: [-23.5505, -46.6333], // Posição inicial do marcador
      isMounted: false
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids']),
    ...mapState('bus', ['busRoutes']),
    formIsEmpty () {
      return !this.searchBody.cid || !this.searchBody.data || !this.searchBody.destinationCityId || !this.searchBody.hora || !this.searchBody.originCityId
    },
    displayDate: {
      get () {
        if (!this.searchBody.data) {
          return ''
        }
        const [year, month, day] = this.searchBody.data.split('-')
        return `${day}/${month}/${year}`
      },
      set (newVal) {
        if (!newVal) {
          this.searchBody.data = ''
        } else {
          const [day, month, year] = newVal.split('/')
          this.searchBody.data = `${year}-${month}-${day}`
        }
      }
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
  mounted () {
    this.isMounted = true
    this.previousCenter = [...this.center]
  },
  created () {
    if (!this.cities.length) {
      this.fetchCities()
    }
    if (!this.cids.length) {
      this.fetchCids()
    }
    this.loadRecentSearches()
  },
  destroyed () {
    this.hideAlert()
  },
  methods: {
    ...mapActions('city', ['fetchCities']),
    ...mapActions('cid', ['fetchCids']),
    ...mapActions('bus', ['fetchBusRoutes']),
    ...mapActions('loading', ['changeStatusLoading']),
    ...mapActions('alert', ['showAlert', 'hideAlert']),
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
    },
    loadRecentSearches () {
      try {
        const savedSearches = localStorage.getItem('recentSearches')
        if (savedSearches) {
          this.recentSearches = JSON.parse(savedSearches)
        }
      } catch (error) {
        console.error('Erro ao carregar pesquisas recentes:', error)
        this.recentSearches = []
      }
    },
    getCityName (cityId) {
      const city = this.cities.find(city => city.value === cityId)
      return city ? city.text : 'Cidade não encontrada'
    },
    formatTime (time) {
      return time || 'Horário não definido'
    },
    formatDate (date) {
      if (!date) {
        return 'Data não definida'
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    getCIDText (cid) {
      if (!cid) {
        return ''
      }
      const CIDItem = this.cids.find(item => item.value === cid)
      if (!CIDItem) {
        return ''
      }
      const Grupo = CIDItem.text.match(/- (G\d+)$/)
      return Grupo ? Grupo[1] : ''
    },
    saveRecentSearch (routeInfo = null) {
      try {
        // Criar uma cópia da pesquisa atual
        const searchCopy = { ...this.searchBody }
        // Adicionar informações da rota encontrada, se disponível
        if (routeInfo) {
          searchCopy.routeInfo = routeInfo
        }
        // Verificar se essa pesquisa já existe
        const existingIndex = this.recentSearches.findIndex(search =>
          search.originCityId === searchCopy.originCityId &&
          search.destinationCityId === searchCopy.destinationCityId &&
          search.cid === searchCopy.cid
        )
        // Se existir, remover para adicionar atualizada no início
        if (existingIndex !== -1) {
          this.recentSearches.splice(existingIndex, 1)
        }
        // Adicionar no início da lista
        this.recentSearches.unshift(searchCopy)
        // Limitando em 4 pesquisas recentes
        if (this.recentSearches.length > 4) {
          this.recentSearches = this.recentSearches.slice(0, 4)
        }
        // Salvar no localStorage
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))
      } catch (error) {
        console.error('Erro ao salvar pesquisa recente:', error)
      }
    },
    useRecentSearch (search) {
      // Preencher o formulário com os dados da pesquisa salva
      this.searchBody = { ...search }
      // Opcional: executar a pesquisa automaticamente
      this.performSearch()
    },
    async performSearch () {
      this.hideAlert()
      if (this.formIsEmpty) {
        const propsAlert = {
          alertMessage: 'Todos os campos devem ser preenchidos',
          alertType: 'error'
        }
        this.showAlert(propsAlert)
      } else {
        // console.log(this.searchBody)
        this.changeStatusLoading(true)
        await this.fetchBusRoutes(this.searchBody)
        if (!this.busRoutes) {
          this.showAlert({ alertMessage: this.alertMessage.error, alertType: 'error' })
        } else if (this.busRoutes.length === 0) {
          this.showAlert({ alertMessage: this.alertMessage.warning, alertType: 'warning' })
        } else {
          // Pesquisa bem-sucedida - salvar com informações da primeira rota encontrada
          let routeInfo = null

          if (this.busRoutes[0] && this.busRoutes[0].routes && this.busRoutes[0].routes.length) {
            // Se houver apenas uma rota, mostrar apenas seu código
            if (this.busRoutes[0].routes.length === 1) {
              routeInfo = `Linhas: ${this.busRoutes[0].routes[0].code}`
            } else if (this.busRoutes[0].routes.length > 4) {
              // Se houver mais de 3 rotas, mostrar os 3 primeiros códigos e "..." no final
              const lineCodes = this.busRoutes[0].routes.map(route => route.code)
              routeInfo = `Linhas: ${lineCodes.slice(0, 3).join(' | ')} | ...`
            } else {
              // Se houver 3 ou menos rotas, mostrar todos os códigos
              const lineCodes = this.busRoutes[0].routes.map(route => route.code)
              routeInfo = `Linhas: ${lineCodes.join(' | ')}`
            }
          }
          this.saveRecentSearch(routeInfo)
          this.$router.push('/rotas')
        }
        this.changeStatusLoading(false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}
.search-page {
  display: flex;
  flex-direction: row;
  margin: 1rem 1rem;
  width: webkit-fill-available;
  background-color: white;
  border-radius: 14px;
  margin-top: 35px;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;

  @media (min-width: 1200px) {
    min-height: 500px;
  }
}
.map-container {
  flex: 1;
  height: auto;
  display: none;
  z-index: 0;

  @media (min-width: 800px){
    display: block;
  }

  .leaflet-container {
    height: 100%;
    min-height: 500px;
    border-radius: 0 7px 7px 0;
    overflow: hidden;
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

.search-page__form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2.5rem;

  @media (min-width: 800px) {
    width: 430px;
    min-width: 430px;
    justify-content: center;
    margin: auto;
  }
}
.header-text {
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 20px;
}
.search-page__time-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}
.v-btn{
  color: white;
  border-radius: 12px;
}
#btn-solicitacao{
  color: #01193D;
  font-family: "Roboto", sans-serif;
  text-transform: none !important;
  font-size: 15px;
}

.v-text-field {
  border-radius: 10px;
}
.custom-input .v-input__control {
  border-radius: 10px;
}
:deep(.v-input__prepend-inner .v-icon) {
  color: #0099F0 !important;
}

#btn-solicitacao::before {
   background-color: transparent !important;
}
.search-page-recents{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  padding: 1.5rem;
  width: 100%;
  @media (min-width: 800px) {
    padding: 1rem;
  }
}
.recents-title{
  font-size: 22px;
  font-weight: 500;
  color: #1D1D1F;
}
.recentRoutesSearched-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;

  @media (min-width: 800px) {
    justify-content: flex-start;
    align-items: stretch;
  }
}
.recentRoute-title{
  font-size: 15px;
  font-weight: 400;
  color: #1D1D1F;
}
.recentRoute-card {
  border-radius: 14px;
  box-shadow: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: 800px) {
    width: calc(50% - 8px); /* 2 cards por linha, ajustando o gap */
    min-height: 140px; /* Altura mínima */
  }
  @media (min-width: 1200px) {
    width: calc(25% - 12px); /* 4 cards por linha em telas maiores */
  }
}

/* Estes seletores ajudam a estruturar o conteúdo dentro do card */
:deep(.v-card__title) {
  flex-shrink: 0; /* Impede que o título encolha */
}

:deep(.v-card__text) {
  flex-grow: 1; /* Permite que o texto ocupe o espaço disponível */
}

:deep(.v-card__actions) {
  margin-top: auto; /* Empurra as ações para o final do card */
}
.recentRoute-text{
  font-size: 16px;
  color: #000000 !important;
  font-weight: 500 !important;
}
.recentRoute-chip{
  border-radius: 6px;
}

.v-card--link:focus::before {
  opacity: 0;
}

.search-page__alert {
  margin: 20px;
  width: -webkit-fill-available;

  @media (min-width: 800px) {
    margin: 20px auto;
    width: 700px;
  }
}
</style>
