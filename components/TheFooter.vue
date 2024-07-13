<template>
  <v-footer padless>
    <v-card flat tile width="100%" class="primary text-center">
      <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon.name"
          :href="icon.link"
          :aria-label="icon.label"
          class="mx-4"
          target="_blank"
          icon
        >
          <v-icon color="white" size="24px">
            {{ icon.name }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-divider />

      <v-card-text>
        <v-btn id="btn-solicitacao" color="white" to="/solicitacao" small text>
          Não encontrou sua rota? Nos informe aqui!
        </v-btn>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'TheFooter',
  data () {
    return {
      icons: [
        {
          name: 'mdi-linkedin',
          label: 'Veja nosso linkedIn',
          link: 'https://www.linkedin.com/company/codelab-unifesp/'
        },
        {
          name: 'mdi-email',
          label: 'Entre em contato por email',
          link: 'mailto:codelab.unifesp@gmail.com?subject="link HTML"'
        },
        {
          name: 'mdi-github',
          label: 'Veja nosso github',
          link: 'https://github.com/UnifespCodeLab'
        }
      ]
    }
  }
}
</script>
