<template>
  <v-card flat height="50px" tile>
    <v-toolbar color="primary" dense dark>
      <v-icon>mdi-bus</v-icon>
      <v-toolbar-title class="ml-4">
        EMTU
      </v-toolbar-title>

      <v-spacer />
      <SideBar />
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      drawer: false
    }
  }
}
</script>