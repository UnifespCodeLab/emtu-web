<template>
  <div class="daily-access">
    <div class="daily-access__time-container">
      <v-dialog
        ref="dialogStartDate"
        v-model="startDateDialog"
        :return-value.sync="startDate"
        persistent
        width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="startDate"
            class="daily-acces__input"
            clearable
            placeholder="Período de início"
            label="Período de início"
            v-bind="attrs"
            solo
            v-on="on"
          />
        </template>
        <v-date-picker v-model="startDate" scrollable>
          <v-spacer />
          <v-btn text color="primary" @click="startDateDialog = false">
            Cancelar
          </v-btn>
          <v-btn text color="primary" @click="$refs.dialogStartDate.save(startDate)">
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
      <v-dialog
        ref="dialogEndDate"
        v-model="endDateDialog"
        :return-value.sync="endDate"
        persistent
        width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="endDate"
            class="daily-acces__input"
            clearable
            placeholder="Período final"
            label="Período final"
            readonly
            v-bind="attrs"
            solo
            v-on="on"
          />
        </template>
        <v-date-picker v-model="endDate" scrollable>
          <v-spacer />
          <v-btn text color="primary" @click="endDateDialog = false">
            Cancelar
          </v-btn>
          <v-btn text color="primary" @click="$refs.dialogEndDate.save(endDate)">
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
      <v-btn
        color="primary"
        large
        :loading="loading"
        :disabled="!startDate || !endDate || loading"
        @click="executeSearch()"
      >
        BUSCAR
      </v-btn>
    </div>

    <div v-if="loading" class="daily-access__loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="mt-4">
        Carregando dados...
      </p>
    </div>

    <div
      v-if="!loading && series && series.length > 0"
      class="daily-access__graph-wrapper"
    >
      <AdminChart
        :categories="categories"
        title="Acessos diários"
        type="line"
        :series="series"
      />
    </div>

    <div
      v-if="!loading && noData"
      class="daily-access__no-data"
    >
      <p>Nenhum dado encontrado para o período selecionado.</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axiosClient from '~/assets/services/emtu-api'
import AdminChart from '~/components/admin/AdminChart.vue'

export default {
  name: 'AdminDailyAccess',
  components: {
    AdminChart
  },
  layout: 'admin',
  data () {
    return {
      startDate: null,
      startDateDialog: false,
      endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      endDateDialog: false,
      categories: [],
      series: [],
      loading: false,
      noData: false
    }
  },
  methods: {
    ...mapActions('alert', ['showAlert']),

    async executeSearch () {
      if (!this.startDate || !this.endDate) {
        this.showAlert({
          alertMessage: 'Por favor, selecione ambas as datas',
          alertType: 'warning'
        })
        return
      }

      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.showAlert({
          alertMessage: 'A data inicial deve ser menor que a data final',
          alertType: 'warning'
        })
        return
      }

      this.loading = true
      this.noData = false

      try {
        const dates = this.getDateRange(this.startDate, this.endDate)
        const promises = dates.map(date =>
          axiosClient.get(`/access/dailyAccess?date=${date}`)
        )

        const responses = await Promise.all(promises)

        const accessData = responses.map((response, index) => ({
          date: dates[index],
          count: response.data.quantidade_acessos
        }))

        this.categories = accessData.map(item => this.formatDate(item.date))
        this.series = [
          {
            name: 'Acessos',
            data: accessData.map(item => item.count)
          }
        ]

        const hasData = accessData.some(item => item.count > 0)
        if (!hasData) {
          this.noData = true
        }
      } catch (error) {
        this.showAlert({
          alertMessage: 'Erro ao buscar dados. Tente novamente mais tarde.',
          alertType: 'error'
        })
      } finally {
        this.loading = false
      }
    },

    getDateRange (startDate, endDate) {
      const dates = []
      const currentDate = new Date(startDate)
      const end = new Date(endDate)

      // eslint-disable-next-line no-unmodified-loop-condition
      while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return dates
    },

    formatDate (dateString) {
      const date = new Date(dateString + 'T00:00:00')
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return `${day}/${month}`
    }
  }
}
</script>

<style scoped lang="scss">
.daily-access {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 4px;
  padding-right: 4px;

  @media (min-width: 1000px) {
    padding-left: 20px;
    padding-right: 20px;
  }
}
.daily-access__time-container {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: flex-start;
  margin-top: 28px;
  width: 100%;

  @media (min-width: 800px) {
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 500px;
  }
}

.daily-acces__input {
  width: 100%;
  height: 36px;

  @media (min-width: 800px) {
    width: 188px;
  }
}

.daily-access__graph-wrapper {
  margin-top: 60px;
  width: 100%;

  @media (min-width: 800px) {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
  }
}

.daily-access__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  margin-top: 60px;
  width: 100%;

  @media (min-width: 800px) {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
  }
}

.daily-access__no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 16px;
}
</style>
