<template>
  <v-app>
    <SideBar :is-open="sidebarOpen" @toggleSideBar="runToggle()" />
    <div class="default-layout">
      <TheHeader @toggleSideBar="runToggle()" />
      <div class="default-layout__content">
        <GlobalAlert />
        <Nuxt />
      </div>
      <TheFooter />
    </div>
    <Loading v-if="isActive" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import SideBar from '~/components/SideBar.vue'
import TheHeader from '~/components/TheHeader.vue'
import TheFooter from '~/components/TheFooter.vue'
import Loading from '~/components/LoadingAbsolute.vue'
import GlobalAlert from '~/components/GlobalAlert.vue'

export default {
  name: 'DefaultLayout',
  components: {
    SideBar,
    TheFooter,
    TheHeader,
    Loading,
    GlobalAlert
  },
  data () {
    return {
      sidebarOpen: false
    }
  },
  computed: {
    ...mapState('loading', ['isActive'])
  },

  methods: {
    runToggle () {
      this.sidebarOpen = !this.sidebarOpen
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Readex+Pro:wght@160..700&display=swap');

:deep(.v-application--wrap) {
  overflow: hidden;
}

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

.default-layout__content {
  flex: 1;
  background-color: #f0f0f0;
}
</style>
