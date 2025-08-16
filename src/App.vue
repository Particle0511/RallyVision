<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/layout/TheHeader.vue';
</script>

<template>
  <TheHeader />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding-top: 2rem;
}
</style>