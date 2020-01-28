<template>
  <v-content>
    <v-container>
      <card></card>
    </v-container>
  </v-content>
</template>

<script>
import Card from '@/components/Card'

export default {
  name: 'home',
  components: {
    Card
  }
}
</script>

<style>
.v-content {
  background: url('../assets/bg.jpg');
}
</style>
