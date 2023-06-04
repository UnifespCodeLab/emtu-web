<template>
  <div class="container">
    <v-data-table :headers="headers" :items="cids" :items-per-page="5" class="elevation-1 table" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        { text: 'Código', value: 'cod' },
        { text: 'Diagnóstico', value: 'diagnostic' },
        { text: 'Observações', value: 'observations' },
        { text: 'Companhia', value: 'companion' },
        { text: 'Grupo', value: 'group' }
      ],
      cids: [
        {
          id: 1,
          cod: 'B20.0',
          diagnostic: 'Doença pelo HIV resultando em infecções microbacterianas (resultando em tuberculose)',
          observations: '',
          companion: 'Não',
          duration: 1,
          requirements: 'Relatório Médico com CID +\nteste de Tuberculose + receitas (se tiver teste HIV + )',
          group: 'G3'
        },
        {
          id: 2,
          cod: 'B20.1',
          diagnostic: 'Doença pelo HIV resultando em outras infecções bacterianas',
          observations: 'Somente com doença oportunista: A15 até A19;B58 e B59;J13 até J18 e J65;C46',
          companion: 'Não',
          duration: 1,
          requirements: 'Relatório Médico com CID e\ndescrição das oportunistas atuais (se tiver teste HIV + infecções )',
          group: 'G3'
        },
        {
          id: 3,
          cod: 'B20.2',
          diagnostic: 'Doença pelo HIV resultando em doença citomegálica',
          observations: 'Somente com doença oportunista: A15 até A19;B58 e B59;J13 até J18 e J65; C46.',
          companion: 'Não\nObs: Casos com amaurose bilateral\nOU grave deficiência visual é com acompanhante',
          duration: 1,
          requirements: 'Relatório Médico com CID e descrição das oportunistas atuais (se tiver teste HIV +)',
          group: 'G3'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.table {
  width: 75%;
  height: 75%;
  margin: 0 auto;
}
</style>
