<template>
  <div class="default-layout">
    <header>!!! Header goes here !!!</header>
    <div class="default-layout__content">
      <Nuxt></Nuxt>
    </div>
    <footer>!!! Footer goes here !!!</footer>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
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
}
</style>
