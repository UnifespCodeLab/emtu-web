<template>
  <v-app>
    <SideBar :is-open="sidebarOpen" @toggleSideBar="runToggle()" />
    <div class="default-layout">
      <TheHeader @toggleSideBar="runToggle()" />
      <div class="default-layout__content">
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

export default {
  name: 'DefaultLayout',
  components: {
    SideBar,
    TheFooter,
    TheHeader,
    Loading
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

:deep(.v-application--wrap) {
  overflow: hidden;
}

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.default-layout__content {
  flex: 1;
  background-color: #e5e5e5;
}
</style>
