<template>
  <VueApexCharts
    :options="options ? options : chartOptions"
    :series="series"
  />
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'AdminChart',
  components: {
    VueApexCharts
  },
  props: {
    categories: {
      type: Array,
      required: true
    },
    dataLabels: {
      type: Boolean,
      default: false
    },
    series: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    zoom: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: false
    }
  },
  computed: {
    chartOptions () {
      return {
        type: this.type,
        chart: {
          type: this.type,
          zoom: {
            enabled: this.zoom
          }
        },
        dataLabels: {
          enabled: this.dataLabels
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: this.title,
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.categories
        }
      }
    }
  }
}
</script>
