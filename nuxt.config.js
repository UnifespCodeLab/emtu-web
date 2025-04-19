export default {
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // titleTemplate: '%s - VApt',
    title: 'VApt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'leaflet/dist/leaflet.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://auth.nuxtjs.org/guide/setup
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.EMTU_API || process.env.NUXT_ENV_EMTU_API || process.env.NUXT_ENV_BASE_URL || 'http://localhost:3333/'
  },

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.EMTU_API || process.env.NUXT_ENV_EMTU_API || process.env.NUXT_ENV_BASE_URL || 'http://localhost:3333/'
    }
  },

  auth: {
    strategies: {
      local: {
        token: {
          required: false,
          type: false
        },
        endpoints: {
          login: { url: '/user/login', method: 'post', propertyName: 'token' },
          user: false
        }
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true
  }
}
