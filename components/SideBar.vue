<template>
  <v-sheet>
    <v-navigation-drawer
      :value="openDrawer"
      :width="sideBarWidth"
      absolute
      right
      style="z-index: 1000;"
    >
      <div class="title-container">
        <v-icon color="#0099F0" class="title-navigation pr-2">
          mdi-bus
        </v-icon>
        <v-list-item-title class="title-navigation">
          VApt
        </v-list-item-title>
        <v-icon
          color="#1D1D1F"
          class="title-navigation close-icon"
          @click="$emit('toggleSideBar')"
        >
          mdi-close
        </v-icon>
      </div>

      <v-list dense nav>
        <v-list-item v-for="item in routerItems" :key="item.title" router :to="item.route">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <span class="item-title">{{ item.title }}</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script>
import adminItems from '~/assets/js/adminItems'

export default {
  name: 'SideBar',
  props: {
    isOpen: {
      required: true,
      type: Boolean
    },
    isUserLogged: {
      required: false,
      type: Boolean
    }
  },
  data () {
    return {
      innerWidth: window.innerWidth,
      items: [
        { title: 'Buscar', icon: 'mdi-magnify', route: '/' },
        { title: "Lista de CID's", icon: 'mdi-format-list-numbered', route: '/lista-cids' },
        { title: 'Não encontrei minha rota', icon: 'mdi-bus-alert', route: '/solicitacao' },
        { title: 'Sobre nós', icon: 'mdi-account-group', route: '/sobre-nos' }
      ],
      adminItems
    }
  },
  computed: {
    sideBarWidth () {
      return this.innerWidth < 1000 ? '100%' : '300'
    },
    openDrawer () {
      return this.isOpen
    },
    routerItems () {
      return this.$route.path.includes('admin') && this.isUserLogged ? this.adminItems : this.items
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    onResize () {
      this.innerWidth = window.innerWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 15px 15px 15px;
}

.title-navigation {
  font-family: "Lexend", "Roboto", sans-serif;
  font-size: 1.5rem;
  color: #1D1D1F;
  font-weight: 700;
}

.close-icon {
  width: 24px !important;
  height: 24px !important;
  font-size: 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1 !important;
}

.item-title {
  font-size: 16px;
}

:deep(.v-list-item) {
  border-radius: 10px !important;
  margin-bottom: 4px;
}

:deep(.v-list-item--active) {
  border-radius: 10px !important;
  color: #0099F0 !important;
  background-color: rgba(0, 153, 240, 0.1) !important;
}

:deep(.v-list-item:before) {
  border-radius: 10px !important;
}

:deep(.v-list-item:hover) {
  background-color: rgba(0, 0, 0, 0.04) !important;
}
</style>
