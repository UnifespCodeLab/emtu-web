<template>
  <v-sheet>
    <v-app-bar-nav-icon @click="drawer = true" />
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
        <v-list-item v-for="item in items" :key="item.title" router :to="item.route">
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
export default {
  name: 'SideBar',
  data() {
    return {
      drawer: false,
      innerWidth: window.innerWidth,
      items: [
        { title: 'Buscar', icon: 'mdi-magnify', route:'/' },
        { title: "Lista de CID's", icon: 'mdi-format-list-numbered', route:'/lista-cids' },
        { title: 'Sobre nós', icon: 'mdi-account-group', route:'/sobre-nos' },
      ],
    }
  },
  computed: {
    sideBarWidth() {
      return this.innerWidth < 1000 ? '100%' : '300'
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    onResize() {
      this.innerWidth = window.innerWidth
    },
  },
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