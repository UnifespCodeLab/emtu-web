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
          <v-dialog ref="dialogTime" v-model="modalTime" :return-value.sync="searchBody.hora" persistent width="290px">
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
          <v-dialog ref="dialogDate" v-model="modalDate" :return-value.sync="searchBody.data" persistent width="290px">
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
        <v-dialog ref="dialogCid" v-model="modalCid" persistent max-width="600px">
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="displayCid"
              label="Código Cid"
              prepend-inner-icon="mdi-medical-bag"
              solo
              readonly
              v-bind="attrs"
              class="custom-input"
              @click="openCidModal"
              v-on="on"
            />
          </template>
          <v-card class="cid-modal">
            <v-card-title class="cid-modal__title">
              Lista de CID's
            </v-card-title>
            <v-card-text class="cid-modal__content">
              <v-text-field
                v-model="cidSearch"
                label="Pesquisar CID"
                prepend-inner-icon="mdi-magnify"
                solo
                clearable
                hide-details
                class="mb-4"
              />
              <div class="cid-table-container">
                <div v-for="cid in filteredCids" :key="cid.value" class="cid-item" @click="toggleCidSelection(cid.value)">
                  <div class="cid-item__info">
                    <div class="cid-item__code">
                      Código: {{ getCidCode(cid.text) }}
                    </div>
                    <div class="cid-item__name">
                      Diagnóstico: {{ getCidDiagnostic(cid.diagnostic) }}
                    </div>
                  </div>
                  <div class="cid-item__tags">
                    <v-chip :class="getAdaptationChipClass(cid.text)" small>
                      Adaptação: {{ getAdaptationLevel(cid.text) }}
                    </v-chip>
                    <v-chip v-if="hasCompanion(cid)" class="cid-chip cid-chip--acompanhamento" small>
                      <v-icon
                        small
                        class="mr-1"
                      >
                        mdi-account-plus
                      </v-icon>
                      Acompanhante
                    </v-chip>
                  </div>
                  <div class="cid-item__checkbox">
                    <v-checkbox
                      :value="tempSelectedCids.includes(cid.value)"
                      hide-details
                      class="mt-0"
                    />
                  </div>
                </div>
              </div>

              <div class="cid-modal__footer">
                <span class="cid-selected-count">
                  {{ tempSelectedCids.length }} CID's selecionadas
                </span>
                <v-btn
                  v-if="tempSelectedCids.length > 0"
                  text
                  color="primary"
                  small
                  @click="clearAllCidSelections"
                >
                  Limpar Todas
                </v-btn>
              </div>
            </v-card-text>
            <v-card-actions class="cid-modal__actions">
              <v-btn text color="primary" @click="cancelCidSelection">
                Cancelar
              </v-btn>
              <v-btn color="primary" @click="confirmCidSelection">
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
              <button
                class="zoom-btn location-btn"
                :disabled="isLocating"
                :title="isLocating ? 'Obtendo localização...' : 'Centralizar no meu local'"
                @click="centerMapOnCurrentLocation"
              >
                <v-icon
                  small
                >
                  {{ isLocating ? 'mdi-loading mdi-spin' : 'mdi-crosshairs-gps' }}
                </v-icon>
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
                  >
                  </img>
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
            <v-chip class="ma-1 recentRoute-chip" color="#74C3F8" small>
              {{ formatTime(search.hora) }}
            </v-chip>
            <v-chip class="ma-1 recentRoute-chip" color="#74C3F8" small>
              {{ formatDate(search.data) }}
            </v-chip>
            <v-chip v-if="search.cid" class="ma-1 recentRoute-chip" color="#74C3F8" small>
              {{ getCIDText(search.cid) }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LControl } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import { mapState, mapActions } from 'vuex'
import { Icon } from 'leaflet'
import axiosClient from '~/assets/services/emtu-api'

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
    LTileLayer,
    LControl
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
      modalCid: false,
      cidSearch: '',
      tempSelectedCids: [],
      searchBody: {
        originCityId: '',
        destinationCityId: '',
        cid: [],
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
      isMounted: false,
      isLocating: false,
      locationError: null
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids']),
    ...mapState('bus', ['busRoutes']),
    ...mapState('search', ['searches']),
    formIsEmpty () {
      const cidIsEmpty = !this.searchBody.cid || (Array.isArray(this.searchBody.cid) && this.searchBody.cid.length === 0) || this.searchBody.cid === ''

      return cidIsEmpty || !this.searchBody.data || !this.searchBody.destinationCityId || !this.searchBody.hora || !this.searchBody.originCityId
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
    displayCid () {
      if (!this.searchBody.cid || this.searchBody.cid.length === 0) {
        return ''
      }
      const cidArray = Array.isArray(this.searchBody.cid) ? this.searchBody.cid : [this.searchBody.cid]
      const cidCodes = cidArray.map((cidValue) => {
        const cidItem = this.cids.find(item => item.value === cidValue)
        return cidItem ? this.getCidCode(cidItem.text) : cidValue
      })
      if (cidCodes.length === 1) {
        return cidCodes[0]
      } else {
        return `${cidCodes.length} CIDs selecionados`
      }
    },
    filteredCids () {
      if (!this.cidSearch) {
        return this.cids
      }
      return this.cids.filter(cid =>
        cid.text.toLowerCase().includes(this.cidSearch.toLowerCase()) ||
        String(cid.value).toLowerCase().includes(this.cidSearch.toLowerCase())
      )
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
    this.getCurrentLocation()
  },
  created () {
    if (!this.cities.length) {
      this.fetchCities()
    }
    if (!this.cids.length) {
      this.fetchCids()
    }
    // if (this.$route.query.parametro) {
    //   this.searchBody = { ...this.searches }
    // }
    this.loadRecentSearches()
    this.registerAccess()
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
    ...mapActions('search', ['changeSearch']),
    getCurrentLocation () {
      if (!navigator.geolocation) {
        this.locationError = 'Geolocalização não é suportada pelo seu navegador.'
        // console.warn(this.locationError)
        return
      }

      this.isLocating = true

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        this.center = [latitude, longitude]
        this.markerLatLng = [latitude, longitude]
        this.previousCenter = [latitude, longitude]
        this.isLocating = false
        this.locationError = null
      },
      (error) => {
        this.isLocating = false
        let errorMessage = 'Erro ao obter localização.'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão negada para acessar a localização.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível.'
            break
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido ao tentar obter a localização.'
            break
          case error.UNKNOWN_ERROR:
            errorMessage = 'Erro desconhecido ao tentar obter a localização.'
            break
        }

        this.locationError = errorMessage
        // console.warn(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000
      })
    },
    async registerAccess () {
      try {
        await axiosClient.post('/access/trackAccess')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao registrar acesso:', error)
      }
    },
    centerMapOnCurrentLocation () {
      this.getCurrentLocation()
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
    },
    loadRecentSearches () {
      try {
        const savedSearches = localStorage.getItem('recentSearches')
        if (savedSearches) {
          this.recentSearches = JSON.parse(savedSearches)
        }
      } catch (error) {
        // console.error('Erro ao carregar pesquisas recentes:', error)
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
    openCidModal () {
      if (!Array.isArray(this.searchBody.cid)) {
        this.searchBody.cid = this.searchBody.cid ? [this.searchBody.cid] : []
      }
      this.tempSelectedCids = [...this.searchBody.cid]
      this.modalCid = true
    },
    getCIDText (cid) {
      if (!cid || (Array.isArray(cid) && cid.length === 0)) {
        return ''
      }

      if (Array.isArray(cid)) {
        if (cid.length === 1) {
          const CIDItem = this.cids.find(item => item.value === cid[0])
          if (!CIDItem) {
            return ''
          }
          const Grupo = CIDItem.text.match(/- (G\d+)$/)
          return Grupo ? Grupo[1] : ''
        } else {
          return `${cid.length} CIDs`
        }
      }

      const CIDItem = this.cids.find(item => item.value === cid)
      if (!CIDItem) {
        return ''
      }
      const Grupo = CIDItem.text.match(/- (G\d+)$/)
      return Grupo ? Grupo[1] : ''
    },
    getCidCode (fullText) {
      // Extrai apenas o código do CID (primeira parte antes do " - ")
      const parts = fullText.split(' - ')
      return parts[0] ? parts[0].trim() : fullText.trim()
    },
    getCidGroup (fullText) {
      // Extrai o grupo (parte após o " - ")
      const parts = fullText.split(' - ')
      return parts[1] ? parts[1].trim() : ''
    },
    getCidName (fullText) {
      // Remove o código do grupo (ex: "- G123") do final
      return fullText.replace(/\s*-\s*G\d+\s*$/, '').trim()
    },
    getCidDiagnostic (fullText) {
      // Remove o código do grupo (ex: "- G123") do final para mostrar apenas o diagnóstico
      return fullText.replace(/\s*-\s*G\d+\s*$/, '').trim()
    },
    getAdaptationLevel (fullText) {
      const groupMatch = fullText.match(/- (G\d+)$/)
      if (!groupMatch) {
        return 'N/A'
      }
      const group = groupMatch[1]
      switch (group) {
        case 'G1': return 'Alto'
        case 'G2': return 'Médio'
        case 'G3': return 'Baixo'
        default: return 'N/A'
      }
    },
    getAdaptationChipClass (fullText) {
      const groupMatch = fullText.match(/- (G\d+)$/)
      if (!groupMatch) {
        return 'cid-chip cid-chip--adaptacao-na'
      }
      const group = groupMatch[1]
      switch (group) {
        case 'G1': return 'cid-chip cid-chip--adaptacao-alto'
        case 'G2': return 'cid-chip cid-chip--adaptacao-medio'
        case 'G3': return 'cid-chip cid-chip--adaptacao-baixo'
        default: return 'cid-chip cid-chip--adaptacao-na'
      }
    },
    hasCompanion (cid) {
      // Verifica se o CID tem acompanhamento
      return cid.text.includes('Acompanhante') || cid.text.includes('Acompanhamento')
    },
    toggleCidSelection (cidValue) {
      const index = this.tempSelectedCids.indexOf(cidValue)
      if (index > -1) {
        this.tempSelectedCids.splice(index, 1)
      } else {
        this.tempSelectedCids.push(cidValue)
      }
    },
    clearAllCidSelections () {
      this.tempSelectedCids = []
    },
    cancelCidSelection () {
      this.tempSelectedCids = [...this.searchBody.cid] // Restaura valor original
      this.cidSearch = ''
      this.modalCid = false
    },
    confirmCidSelection () {
      // console.log('Confirmando CIDs:', this.tempSelectedCids)
      this.$set(this.searchBody, 'cid', [...this.tempSelectedCids])
      // console.log('searchBody.cid após atribuição:', this.searchBody.cid)
      this.cidSearch = ''
      this.modalCid = false
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
          JSON.stringify(search.cid) === JSON.stringify(searchCopy.cid)
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
        // console.error('Erro ao salvar pesquisa recente:', error)
      }
    },
    useRecentSearch (search) {
      // Preencher o formulário com os dados da pesquisa salva
      this.searchBody = { ...search }
      if (!Array.isArray(this.searchBody.cid)) {
        this.searchBody.cid = this.searchBody.cid ? [this.searchBody.cid] : []
      }
      // Executar a pesquisa automaticamente
      this.performSearch()
    },
    async performSearch () {
      this.hideAlert()

      // console.log('searchBody:', this.searchBody)
      // console.log('cid:', this.searchBody.cid)
      // console.log('cid length:', this.searchBody.cid?.length)

      const cidIsEmpty = !this.searchBody.cid || (Array.isArray(this.searchBody.cid) && this.searchBody.cid.length === 0) || this.searchBody.cid === ''

      const formIsEmpty = cidIsEmpty || !this.searchBody.data || !this.searchBody.destinationCityId || !this.searchBody.hora || !this.searchBody.originCityId
      if (formIsEmpty) {
        // console.log('Form validation:', {
        //   cidIsEmpty,
        //   data: this.searchBody.data,
        //   destinationCityId: this.searchBody.destinationCityId,
        //   hora: this.searchBody.hora,
        //   originCityId: this.searchBody.originCityId
        // })
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
          this.changeSearch(this.searchBody)
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
.location-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .v-icon {
    font-size: 16px;
  }
}

.mdi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
.cid-modal {
  .cid-modal__title {
    font-size: 18px;
    font-weight: 500;
    padding: 20px 24px 16px;
  }

  .cid-modal__content {
    padding: 0 24px;
    max-height: 500px;
    overflow-y: auto;
  }

  .cid-modal__actions {
    padding: 16px 24px 20px;
    justify-content: flex-end;
    gap: 8px;
  }
}

.cid-table-container {
  max-height: 350px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.cid-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }

  .cid-item__info {
    flex: 1;
    margin-right: 16px;

    .cid-item__code {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .cid-item__name {
      font-size: 14px;
      color: #666;
      line-height: 1.4;
    }
  }

  .cid-item__tags {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-right: 16px;
    align-items: flex-end;
  }

  .cid-item__checkbox {
    flex-shrink: 0;
  }
}

.cid-chip {
  font-size: 12px;
  height: 24px;

  &.cid-chip--adaptacao-alto {
    background-color: #ffcdd2 !important;
    color: #c62828 !important;
  }

  &.cid-chip--adaptacao-medio {
    background-color: #fff3e0 !important;
    color: #f57c00 !important;
  }

  &.cid-chip--adaptacao-baixo {
    background-color: #e8f5e8 !important;
    color: #2e7d32 !important;
  }

  &.cid-chip--adaptacao-na {
    background-color: #f5f5f5 !important;
    color: #757575 !important;
  }

  &.cid-chip--acompanhamento {
    background-color: #e3f2fd !important;
    color: #1565c0 !important;
  }
}

.cid-modal__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 16px;

  .cid-selected-count {
    font-size: 14px;
    color: #666;
  }
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
