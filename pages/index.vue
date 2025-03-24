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
      <!-- <div class="image-container">
        <img src="../static/Teste.png" class="image" alt="Mapa de São José dos Campos" />
      </div> -->
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
            {{ getCityName(search.originCityId) }}
            <v-icon color="#017BFD" small class="mx-1">
              mdi-arrow-right
            </v-icon>
            {{ getCityName(search.destinationCityId) }}
          </v-card-title>
          <v-card-text v-if="search.routeInfo" class="recentRoute-text">
            {{ search.routeInfo }}
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
      <!-- <v-card class="recentRoute-card" elevation="0">
        <v-card-title class="recentRoute-title">São José dos Campos <v-icon color="#017BFD" small class="mx-1">mdi-arrow-right</v-icon> Jacareí</v-card-title>
        <v-card-text class="recentRoute-text">
          5114 - Jacareí (Via Dutra)<br>
        </v-card-text>
        <v-card-actions>
          <v-chip
            class="ma-1 recentRoute-chip"
            color="#74C3F8"
            small
          >
            12:30
          </v-chip>
          <v-chip
            class="ma-1 recentRoute-chip"
            color="#74C3F8"
            small
          >
            23/03/25
          </v-chip>
        </v-card-actions>
      </v-card> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SearchPage',
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
      recentSearches: []
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
    }
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

          if (this.busRoutes[0] && this.busRoutes[0].routes && this.busRoutes[0].routes[0]) {
            const firstRoute = this.busRoutes[0].routes[0]
            routeInfo = `${firstRoute.code} - ${firstRoute.origin.split('(')[1]?.replace(')', '') || firstRoute.origin}`
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
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.search-page {
  background-color: white;
  border-radius: 14px;
  padding: 1rem;
  margin: 1rem auto;
  margin-top: 50px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: fit-content;
  @media (min-width: 1200px) {
    justify-content: center;
  }
}
.search-page__form {
  display: flex;
  flex-direction: column;
  width: 300px;
  @media (min-width: 1200px) {
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
    padding: 3.25rem;
  }
}
.recents-title{
  font-size: 22px;
  font-weight: 500;
  color: #1D1D1F;
}
.recentRoutesSearched-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;

  @media (min-width: 800px) {
    flex-direction: row;
    justify-content: left;
    align-self: start;
  }
}
.recentRoute-title{
  font-size: 15px;
  font-weight: 400;
  color: #1D1D1F;
}
.recentRoute-card{
  border-radius: 14px;
  box-shadow: none;
  width: 100%;
  @media (min-width: 800px) {
    width: 300px;
  }
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
