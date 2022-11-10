<template>
  <v-app>
    <div class="admin-layout">
      <SideBar :is-open="sidebarOpen" :is-user-logged="isUserLogged" @toggleSideBar="runToggle()" />
      <TheHeader @toggleSideBar="runToggle()" />
      <div class="admin-layout__content">
        <Nuxt />
      </div>
    </div>
  </v-app>
</template>

<script>
import TheHeader from '~/components/TheHeader.vue'
import SideBar from '~/components/SideBar.vue'

export default {
  name: 'AdminLayout',
  components: {
    TheHeader,
    SideBar
  },
  data () {
    return {
      sidebarOpen: false
    }
  },
  computed: {
    // ToDo - Modificar quando tivermos o state de usuário logado
    isUserLogged () {
      return true
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
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-layout__content {
  flex: 1;
  background-color: #e5e5e5;
}
</style>
