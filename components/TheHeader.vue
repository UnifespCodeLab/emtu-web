<template>
  <v-card flat height="50px" tile>
    <v-toolbar color="primary" dense dark>
      <v-icon>mdi-bus</v-icon>
      <v-toolbar-title class="ml-4">
        EMTU
      </v-toolbar-title>

      <v-spacer />

      <v-app-bar-nav-icon @click="drawer = true" />
    </v-toolbar>

    <v-sheet height="100vh" class="overflow-hidden" style="position: relative">
      <v-navigation-drawer
        v-model="drawer"
        :width="sideBarWidth"
        absolute
        right
      >
        <div class="title-container">
          <v-icon color="primary" class="title-navigation">
            mdi-bus
          </v-icon>
          <v-list-item-title class="title-navigation">
            EMTU
          </v-list-item-title>
          <v-icon
            color="primary"
            class="title-navigation"
            @click="drawer = false"
          >
            mdi-close
          </v-icon>
        </div>

        <v-list dense>
          <v-list-item v-for="item in items" :key="item.title" link>
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
  </v-card>
</template>

<script>
export default {
  name: 'TheHeader',
  data () {
    return {
      drawer: false,
      innerWidth: window.innerWidth,
      items: [
        { title: 'Buscar', icon: 'mdi-magnify' },
        { title: "Lista de CID's", icon: 'mdi-format-list-numbered' },
        { title: 'Sobre nós', icon: 'mdi-account-group' }
      ]
    }
  },
  computed: {
    sideBarWidth () {
      return this.innerWidth < 1000 ? '100%' : '300'
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
  margin: 15px 0 15px 10px;
}

.title-navigation {
  color: #1976d2;
  margin-right: 25px;
}

.item-title {
  font-size: 16px;
}
</style>
