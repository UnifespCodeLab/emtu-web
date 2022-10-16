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
  </v-app>
</template>

<script>
import SideBar from '~/components/SideBar.vue'
import TheHeader from '~/components/TheHeader.vue'
import TheFooter from '~/components/TheFooter.vue'

export default {
  name: 'DefaultLayout',
  components: {
    SideBar,
    TheFooter,
    TheHeader
  },
  data () {
    return {
      sidebarOpen: false
    }
  },
  methods: {
    runToggle () {
      this.sidebarOpen = !this.sidebarOpen
    }
  }
}
</script>

<style lang="scss" scoped>
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
