<template>
  <div class="performed-searches">
    <div class="performed-searches__filter">
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
            class="performed-searches__input"
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
            class="performed-searches__input"
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
      <v-autocomplete
        v-model="originCity"
        class="performed-searches__input"
        :items="cities"
        item-text="name"
        item-value="id"
        label="Origem"
        solo
      />
      <v-autocomplete
        v-model="destinationCity"
        class="performed-searches__input"
        :items="cities"
        item-text="name"
        item-value="id"
        label="Destino"
        solo
      />
      <v-btn color="primary" large @click="executeSearch()">
        BUSCAR
      </v-btn>
    </div>
    <div
      v-if="series && series.length > 0"
      class="line-ranking__graph-wrapper"
    >
      <AdminChart
        :categories="[]"
        title="Buscas realizadas no período"
        type="line"
        :series="series"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import AdminChart from '~/components/admin/AdminChart.vue'
import emtuApi from '~/assets/services/emtu-api'

export default {
  name: 'AdminPerformedSearches',
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
      originCity: null,
      destinationCity: null,
      series: [],
      cities: [],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          toolbar: {
            show: true
          }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Buscas realizadas no período',
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        markers: {
          size: 1
        },
        xaxis: {
          title: {
            text: 'Dias'
          }
        },
        yaxis: {
          title: {
            text: 'Quantidade de buscas'
          },
          min: 0
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      }
    }
  },
  // eslint-disable-next-line require-await
  async fetch () {
    const [citiesResponse] = await Promise.all([
      emtuApi.get('/city')
    ])

    this.cities = citiesResponse.data
  },
  methods: {
    async executeSearch () {
      const requestParams = {
        startDate: this.startDate,
        endDate: this.endDate,
        origin: this.originCity,
        destination: this.destinationCity
      }

      const searchResponse = await emtuApi.get('/searches', {
        params: requestParams
      })

      if (!searchResponse) {
        return
      }

      searchResponse.data.data.sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao))

      const groupedArray = searchResponse.data.data.reduce((result, item) => {
        const formattedDate = new Date(item.dataCriacao).toISOString().split('T')[0]

        if (item.sucedida) {
          if (!result.success) {
            result.success = {}
          }
          if (!result.success[formattedDate]) {
            result.success[formattedDate] = 0
          }
          result.success[formattedDate]++
        } else {
          if (!result.notSuccess) {
            result.notSuccess = {}
          }
          if (!result.notSuccess[formattedDate]) {
            result.notSuccess[formattedDate] = 0
          }
          result.notSuccess[formattedDate]++
        }
        return result
      }, {})

      const uniqueDates = Array.from(
        new Set(
          searchResponse.data.data.map(item => new Date(item.dataCriacao).toISOString().split('T')[0])
        )
      )

      const tempSeries = []

      // Convertendo os objetos em arrays
      if (groupedArray.success) {
        groupedArray.success = Object.values(groupedArray.success)
        tempSeries.push(
          {
            name: 'Sucedidas',
            data: groupedArray.success
          }
        )
      }

      if (groupedArray.notSuccess) {
        groupedArray.notSuccess = Object.values(groupedArray.notSuccess)
        tempSeries.push(
          {
            name: 'Não sucedidas',
            data: groupedArray.notSuccess
          }
        )
      }

      this.series = tempSeries
      this.chartOptions.xaxis.categories = uniqueDates
    }
  }
}
</script>
<style scoped lang="scss">
.performed-searches {
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

.performed-searches__filter{
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
    width: 800px;
  }
}

.performed-searches__input {
  width: 100%;
  height: 36px;

  @media (min-width: 800px) {
    width: 188px;
  }
}

.line-ranking__graph-wrapper {
  margin-top: 60px;
  width: 100%;

  @media (min-width: 800px) {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
  }
}
</style>
