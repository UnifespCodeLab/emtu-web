<template>
  <div class="daily-access">
    <div v-for="card in cards" :key="card.id" class="card" @click="$router.push(card.route)">
      <div class="card-content">
        {{ card.title }}
      </div>
    </div>
  </div>
</template>

<script>
import adminItems from '~/assets/js/adminItems'
export default {
  name: 'AdminHome',
  layout: 'admin',
  data () {
    return {
      cards: []
    }
  },
  created () {
    this.cards = adminItems
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.daily-access {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;

  @media (min-width: 1000px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 40px;
    padding-right: 40px;
  }
}
.card {
  width: 100%;
  margin-bottom: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: background-color 0.3s;

  @media (min-width: 1000px) {
    width: calc(33.33% - 10px);
    margin: 5px 5px;
  }
}

.card:hover {
  background: linear-gradient(45deg, #0074d9, #00d4ff);
  background-size: 200% 200%;
  animation: gradient 0.5s ease;
  color: #f0f0f0;
}

@keyframes gradient {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.card-content {
  padding: 10px;
}
</style>
