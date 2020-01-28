<template>
  <v-card class="center mx-auto my-auto">
    <v-card-title>404 Page not found</v-card-title>
    <v-card-text>Страница не найдена</v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn text small @click="$router.push('/')">На главную</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>
.center {
  height: 100vh;
  width: 420px;
  height: fit-content;
}
</style>
