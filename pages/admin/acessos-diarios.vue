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
      <v-btn color="primary" large @click="executeSearch()">
        BUSCAR
      </v-btn>
    </div>
    <div
      v-if="series && series.length > 0"
      class="daily-access__graph-wrapper"
    >
      <AdminChart
        :categories="categories"
        title="Média de acessos diários por mês"
        type="line"
        :series="series"
      />
    </div>
  </div>
</template>

<script>
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      series: []
    }
  },
  methods: {
    executeSearch () {
      this.series = [
        {
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ]
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
</style>
