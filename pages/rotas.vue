<template>
  <div class="routes-page__container">
    <div class="routes-page__chips-container">
      <v-chip
        class="routes-page__chip"
        close
        close-icon="mdi-close"
        color="orange"
        >cid acbd</v-chip
      >
      <v-chip close close-icon="mdi-close" color="red">cid efg</v-chip>
      <v-chip close close-icon="mdi-close" color="blue"
        >cid mnopqrstuvwxyz1</v-chip
      >
    </div>
    <div class="routes-page__steps">
      <v-carousel v-model="model">
        <v-carousel-item v-for="color in colors" :key="color">
          <v-card>
            <v-card-text>
              <div class="font-weight-bold ml-8 mb-2">Today</div>

              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="message in messages"
                  :key="message.time"
                  :color="message.color"
                  small
                >
                  <div>
                    <div class="font-weight-normal">
                      <strong>{{ message.from }}</strong> @{{ message.time }}
                    </div>
                    <div>{{ message.message }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoutesPage',
  data() {
    return {
      model: 0,
      colors: ['primary', 'secondary', 'yellow darken-2', 'red', 'orange'],
      messages: [
        {
          from: 'You',
          message: `Sure, I'll see you later.`,
          time: '10:42am',
          color: 'deep-purple lighten-1',
        },
        {
          from: 'John Doe',
          message: 'Yeah, sure. Does 1:00pm work?',
          time: '10:37am',
          color: 'green',
        },
        {
          from: 'You',
          message: 'Did you still want to grab lunch today?',
          time: '9:47am',
          color: 'deep-purple lighten-1',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.routes-page__container {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 16px;
  padding: 0 20px;
  height: 100%;
}

.routes-page__chip {
  margin: 4px;
}

.routes-page__steps {
  margin-top: 16px;
  margin-bottom: 16px;
  width: 360px;
}
</style>
