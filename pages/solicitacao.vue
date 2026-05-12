<template>
  <div class="home">
    <div class="report-page">
      <div class="report-page__form">
        <h1 class="header-text">Solicitar Nova Rota</h1>
        <p class="subtitle-text text-center mb-6" v-if="!hasSuccess">
          Não encontrou o que procurava?<br>
          Conte-nos qual rota você precisa.
        </p>

        <v-btn
          v-if="hasSuccess"
          block
          color="#01193D"
          elevation="0"
          large
          to="/"
          class="action-btn"
        >
          Voltar para Home
        </v-btn>

        <template v-else>
          <v-text-field
            v-model="reportData.email"
            label="E-mail"
            outlined
            class="custom-input"
            prepend-inner-icon="mdi-email-outline"
          />
          <v-autocomplete
            v-model="reportData.originCityId"
            :items="cities"
            label="Cidade de origem"
            outlined
            class="custom-input"
            prepend-inner-icon="mdi-map-marker-outline"
          />
          <v-autocomplete
            v-model="reportData.destinationCityId"
            :items="cities"
            label="Cidade de destino"
            outlined
            class="custom-input"
            prepend-inner-icon="mdi-map-marker"
          />
          <v-dialog ref="dialogCid" v-model="modalCid" persistent max-width="600px">
            <template #activator="{ on, attrs }">
              <v-text-field
                :value="displayCid"
                label="Condição / CID (Opcional)"
                outlined
                readonly
                v-bind="attrs"
                class="custom-input"
                prepend-inner-icon="mdi-wheelchair-accessibility"
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
                  outlined
                  clearable
                  hide-details
                  class="mb-4 custom-input"
                />
                <div class="cid-table-container">
                  <div v-for="cid in filteredCids" :key="cid.value" class="cid-item" @click="toggleCidSelection(cid.value)">
                    <div class="cid-item__info">
                      <div class="cid-item__code">
                        Código: {{ getCidCode(cid.text) }}
                      </div>
                      <div class="cid-item__name">
                        Diagnóstico: {{ getCidDiagnostic(cid.diagnostic || cid.text) }}
                      </div>
                    </div>
                    <div class="cid-item__tags">
                      <v-chip :class="getAdaptationChipClass(cid.text)" small>
                        Adaptação: {{ getAdaptationLevel(cid.text) }}
                      </v-chip>
                      <v-chip v-if="hasCompanion(cid)" class="cid-chip cid-chip--acompanhamento" small>
                        <v-icon small class="mr-1">mdi-account-plus</v-icon>
                        Acompanhante
                      </v-chip>
                    </div>
                    <div class="cid-item__checkbox">
                      <v-checkbox
                        :input-value="tempSelectedCids.includes(cid.value)"
                        hide-details
                        class="mt-0"
                        readonly
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

          <v-btn
            block
            color="#01193D"
            elevation="0"
            large
            @click="submit"
            class="action-btn"
          >
            Enviar Solicitação
          </v-btn>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import emtuApi from '~/assets/services/emtu-api'

export default {
  name: 'ReportPage',
  data () {
    return {
      hasSuccess: false,
      errorMessage: '',
      successMessage: 'Informação enviada com sucesso!',
      modalCid: false,
      cidSearch: '',
      tempSelectedCids: [],
      reportData: {
        email: null,
        originCityId: null,
        destinationCityId: null,
        cidId: []
      }
    }
  },
  computed: {
    ...mapState('city', ['cities']),
    ...mapState('cid', ['cids']),
    displayCid () {
      if (!this.reportData.cidId || this.reportData.cidId.length === 0) {
        return ''
      }
      const cidArray = Array.isArray(this.reportData.cidId) ? this.reportData.cidId : [this.reportData.cidId]
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
    alertMessage () {
      return this.hasSuccess ? this.successMessage : this.errorMessage
    },
    reportParams () {
      const { email, originCityId, destinationCityId, cidId } = this.reportData

      return {
        email,
        idCidadeOrigem: originCityId,
        idCidadeDestino: destinationCityId,
        idCid: cidId
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
  },

  destroyed () {
    this.hideAlert()
  },

  methods: {
    ...mapActions('city', ['fetchCities']),
    ...mapActions('cid', ['fetchCids']),
    ...mapActions('alert', ['showAlert', 'hideAlert']),
    openCidModal () {
      if (!Array.isArray(this.reportData.cidId)) {
        this.reportData.cidId = this.reportData.cidId ? [this.reportData.cidId] : []
      }
      this.tempSelectedCids = [...this.reportData.cidId]
      this.modalCid = true
    },
    getCidCode (fullText) {
      if (!fullText) {
        return ''
      }
      const parts = fullText.split(' - ')
      return parts[0] ? parts[0].trim() : fullText.trim()
    },
    getCidDiagnostic (fullText) {
      if (!fullText) {
        return ''
      }
      return fullText.replace(/\s*-\s*G\d+\s*$/, '').trim()
    },
    getAdaptationLevel (fullText) {
      if (!fullText) {
        return 'N/A'
      }
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
      if (!fullText) {
        return 'cid-chip cid-chip--adaptacao-na'
      }
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
      if (!cid || !cid.text) {
        return false
      }
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
      this.tempSelectedCids = Array.isArray(this.reportData.cidId) ? [...this.reportData.cidId] : []
      this.cidSearch = ''
      this.modalCid = false
    },
    confirmCidSelection () {
      this.$set(this.reportData, 'cidId', [...this.tempSelectedCids])
      this.cidSearch = ''
      this.modalCid = false
    },
    async submit () {
      this.hideAlert()

      try {
        await emtuApi.post('reports', this.reportParams)
        this.hasSuccess = true
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Ocorreu um erro ao enviar a informação'
        this.hasSuccess = false
      } finally {
        this.showAlert({
          alertMessage: this.alertMessage,
          alertType: this.hasSuccess ? 'success' : 'error'
        })
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

.report-page {
  display: flex;
  flex-direction: column;
  margin: 35px auto;
  width: webkit-fill-available;
  max-width: 800px;
  background-color: white;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (min-width: 800px) {
    min-height: 500px;
  }
}

.report-page__form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2.5rem;

  @media (min-width: 800px) {
    width: 500px;
    min-width: 500px;
    justify-content: center;
    margin: auto;
  }
}

.header-text {
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 8px;
}

.subtitle-text {
  color: #666;
  font-size: 15px;
  line-height: 1.4;
}

.action-btn {
  color: white;
  border-radius: 12px;
  text-transform: none !important;
  font-size: 16px;
  margin-top: 8px;
}

.custom-input {
  border-radius: 10px;
}

:deep(.v-input__control) {
  border-radius: 10px !important;
}

:deep(.v-input__prepend-inner .v-icon) {
  color: #0099F0 !important;
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
</style>
