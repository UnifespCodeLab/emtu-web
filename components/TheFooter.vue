<template>
  <v-footer padless>
    <v-card flat tile width="100%" class="text-center">
      <v-card-text class="main-container">
        <div class="codelab-container">
          <v-btn
            href="https://www.codelab-unifesp.org/"
            aria-label="Confira nosso Website"
            class="mx-4 website-btn"
            target="_blank"
            text
            id="btn-codelab"
            :ripple="false"
          >
            <img src="/LogoEstendidoBrancoCodeLab.png" class="desktop-logo" alt="Logo do CodeLab" height="32" />
            <img src="/LogoBrancoCodeLab.png" class="mobile-logo" alt="Logo do CodeLab" height="32" />
          </v-btn>
        </div>
        <div class="buttons-container">
          <v-btn
            v-for="icon in icons"
            :key="icon.name"
            :href="icon.link"
            :aria-label="icon.label"
            class="mx-3"
            target="_blank"
            icon
          >
            <v-icon color="#ffffff" size="24px">
              {{ icon.name }}
            </v-icon>
          </v-btn>
        </div>
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

<style lang="scss" scoped>
.main-container{
  display: flex;
  background: #017BFD;
  flex-direction: row;
  justify-content: space-between;
}
#btn-codelab::before {
   background-color: transparent !important;
   image-rendering: crisp-edges;
}
.desktop-logo {
  display: none;
}
.mobile-logo {
  display: block;
}

@media (min-width: 768px) {
  .desktop-logo {
    display: block;
  }
  .mobile-logo {
    display: none;
  }
}
</style>
